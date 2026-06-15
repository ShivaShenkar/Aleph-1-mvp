import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import { LoaderCircle } from "lucide-react";
import type { LessonType } from "@/models/models";
import type { CalendarBlock } from "@/types/calendar";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { usePaymentDetailsStore } from "@/store/paymentDetailsStore";
import WeekGrid from "@/components/sections/tutor-calendar/WeekGrid/WeekGrid";
import styles from "./TutorCalendarPage.module.scss";

function getSunday(d: Date): Date {
  const date = new Date(d);
  date.setDate(date.getDate() - date.getDay());
  date.setHours(0, 0, 0, 0);
  return date;
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatWeekRange(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
  return `${start.toLocaleDateString("he-IL", opts)} – ${end.toLocaleDateString("he-IL", opts)}`;
}

export default function TutorCalendarPage() {
  const navigate = useNavigate();
  const todaySunday = getSunday(new Date());
  const [weekStart, setWeekStart] = useState<Date>(todaySunday);
  const user = useAuthStore((s) => s.user);
  const lessonTypes = user?.lessonTypes ?? [];
  const subjects = user?.subjects ?? [];

  const { tutorSlots, tutorSlotsLoaded, fetchTutorSlots, applyTutorSlotChanges } = useBookingStore();
  const { accounts: bankAccounts, loading: bankLoading, fetchAccounts: fetchBankAccounts } = usePaymentDetailsStore();

  useEffect(() => {
    if (!tutorSlotsLoaded) fetchTutorSlots();
    fetchBankAccounts();
  }, [tutorSlotsLoaded, fetchTutorSlots, fetchBankAccounts]);

  const weekKey = toISODate(weekStart);

  const [unsaved, setUnsaved] = useState<{
    added: CalendarBlock[];
    deletedIds: string[];
  }>({ added: [], deletedIds: [] });
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const blocks = useMemo(() => {
    const dedup = new Map<string, CalendarBlock>();
    for (const s of tutorSlots) {
      if (s.weekStart === weekKey && !unsaved.deletedIds.includes(s.id) && !dedup.has(s.id)) {
        dedup.set(s.id, { ...s, source: "saved" as const });
      }
    }
    for (const b of unsaved.added) {
      if (b.weekStart === weekKey && !dedup.has(b.id)) {
        dedup.set(b.id, b);
      }
    }
    return Array.from(dedup.values());
  }, [tutorSlots, weekKey, unsaved.added, unsaved.deletedIds]);

  const hasChanges = unsaved.added.length > 0 || unsaved.deletedIds.length > 0;
  const backDisabled = weekStart.getTime() <= todaySunday.getTime();
  const maxForwardSunday = new Date(todaySunday.getTime() + 21 * 86400000);
  const forwardDisabled = weekStart.getTime() >= maxForwardSunday.getTime();

  function goBack() {
    if (backDisabled) return;
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  }

  function goForward() {
    if (forwardDisabled) return;
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  }

  function handleAddBlock(lt: LessonType, day: number, startHour: number) {
    const endHour = startHour + Math.ceil(lt.durationMinutes / 30);
    const block: CalendarBlock = {
      id: crypto.randomUUID(),
      source: "new",
      weekStart: weekKey,
      day,
      startHour,
      endHour,
      title: lt.title,
      price: lt.price,
      durationMinutes: lt.durationMinutes,
      location: lt.location,
      subject: null,
      maxStudents: lt.maxStudents,
      registeredCount: 0,
    };
    setUnsaved((prev) => ({ ...prev, added: [...prev.added, block] }));
  }

  function handleUpdateBlock(blockId: string, updates: Partial<CalendarBlock>) {
    setUnsaved((prev) => ({
      ...prev,
      added: prev.added.map((b) =>
        b.id === blockId ? { ...b, ...updates } : b,
      ),
    }));
  }

  function handleDeleteBlock(blockId: string, source: "saved" | "new") {
    if (source === "new") {
      setUnsaved((prev) => ({
        ...prev,
        added: prev.added.filter((b) => b.id !== blockId),
      }));
    } else {
      setUnsaved((prev) => ({
        ...prev,
        deletedIds: [...prev.deletedIds, blockId],
      }));
    }
  }

  async function handleSave() {
    if (!hasChanges) return;

    if (bankAccounts.length === 0) {
      setSubmitError("יש להוסיף חשבון בנק לפני פרסום שיעורים");
      return;
    }

    const noSubject = unsaved.added.filter((b) => !b.subject);
    if (noSubject.length > 0) {
      setSubmitError("יש לבחור נושא לכל שיעור לפני השמירה");
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken;
      if (!session || !token) {
        setSubmitError("שגיאה באימות, נסה שוב");
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_GATEWAY_URL}/upload-bookings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            added: unsaved.added,
            deletedIds: unsaved.deletedIds,
          }),
        },
      );
      if (!response.ok) {
        setSubmitError("שגיאה בשמירה, נסה שוב מאוחר יותר");
        return;
      }
      applyTutorSlotChanges(unsaved.added, unsaved.deletedIds);
      setUnsaved({ added: [], deletedIds: [] });
      setShowSuccessDialog(true);
    } catch {
      setSubmitError("שגיאה בשמירה, נסה שוב מאוחר יותר");
    } finally {
      setSubmitting(false);
    }
  }

  if (bankLoading || !tutorSlotsLoaded) {
    return (
      <div className={styles.page}>
        <div className={styles.centerState}>
          <LoaderCircle className={styles.spinner} size={32} />
        </div>
      </div>
    );
  }

  if (!bankLoading && bankAccounts.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.noBank}>
          <h2>לא ניתן לקבוע שיעורים</h2>
          <p>על מנת לקבוע שיעורים יש להוסיף חשבון בנק לפרטי התשלום שלך</p>
          <button className={styles.linkBtn} onClick={() => navigate("/tutor/payments")}>
            מעבר לפרטי תשלום
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>לו"ז עבודה</h1>

      <div className={styles.toolbar}>
        <button
          className={`${styles.navBtn} ${backDisabled ? styles.navBtnDisabled : ""}`}
          onClick={goBack}
          disabled={backDisabled}
        >
          →
        </button>
        <span className={styles.weekLabel}>
          {formatWeekRange(weekStart)}
        </span>
        <button
          className={`${styles.navBtn} ${forwardDisabled ? styles.navBtnDisabled : ""}`}
          onClick={goForward}
          disabled={forwardDisabled}
        >
          ←
        </button>
      </div>

      <WeekGrid
        weekStart={weekStart}
        lessonTypes={lessonTypes}
        subjects={subjects}
        blocks={blocks}
        onAddBlock={handleAddBlock}
        onUpdateBlock={handleUpdateBlock}
        onDeleteBlock={handleDeleteBlock}
        canDeleteBlock={(blockId) => {
          const block = blocks.find((b) => b.id === blockId);
          return block ? block.registeredCount === 0 : true;
        }}
      />

      {hasChanges && (
        <div className={styles.submitBar}>
          <div className={styles.submitBarLeft}>
            <span className={styles.submitInfo}>
              {unsaved.added.length} שיעורים חדשים
              {unsaved.deletedIds.length > 0
                ? `, ${unsaved.deletedIds.length} מחיקות`
                : ""}
            </span>
            {submitError && (
              <span className={styles.submitError}>
                {submitError}
                {submitError.includes("חשבון בנק") && (
                  <button className={styles.linkBtnInline} onClick={() => navigate("/tutor/payments")}>
                    מעבר לפרטי תשלום
                  </button>
                )}
              </span>
            )}
          </div>
          <div className={styles.submitActions}>
            <button
              className={styles.submitBtn}
              onClick={handleSave}
              disabled={submitting}
            >
              {submitting ? (
                <LoaderCircle className={styles.spinner} size={18} />
              ) : (
                "שמור שינויים"
              )}
            </button>
            <button
              className={styles.discardBtn}
              onClick={() => setShowDiscardDialog(true)}
            >
              בטל שינויים
            </button>
          </div>
        </div>
      )}

      {showDiscardDialog && (
        <div
          className={styles.overlay}
          onClick={() => setShowDiscardDialog(false)}
        >
          <div
            className={styles.dialog}
            onClick={(e) => e.stopPropagation()}
          >
            <p className={styles.dialogText}>האם אתה בטוח שברצונך לבטל את השינויים?</p>
            <div className={styles.dialogActions}>
              <button
                className={styles.dialogCancel}
                onClick={() => setShowDiscardDialog(false)}
              >
                לא, המשך בעריכה
              </button>
              <button
                className={styles.dialogConfirm}
                onClick={() => {
                  setUnsaved({ added: [], deletedIds: [] });
                  setSubmitError(null);
                  setShowDiscardDialog(false);
                }}
              >
                כן, בטל הכל
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessDialog && (
        <div
          className={styles.overlay}
          onClick={() => setShowSuccessDialog(false)}
        >
          <div
            className={styles.dialog}
            onClick={(e) => e.stopPropagation()}
          >
            <p className={styles.dialogText}>השינויים נשמרו בהצלחה</p>
            <div className={styles.dialogActions}>
              <button
                className={styles.successBtn}
                onClick={() => setShowSuccessDialog(false)}
              >
                אישור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
