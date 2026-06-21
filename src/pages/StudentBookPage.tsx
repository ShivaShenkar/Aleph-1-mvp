  import { useEffect, useState, useMemo } from "react";
  import { useParams } from "react-router-dom";
  import { fetchAuthSession } from "aws-amplify/auth";
  import { LoaderCircle } from "lucide-react";
  import StudentNavBar from "@/components/sections/StudentNavBar/StudentNavBar";
import WeekGrid from "@/components/sections/tutor-calendar/WeekGrid/WeekGrid";
import { useStudentBookingStore } from "@/store/studentBookingStore";
import type { TutorProfile } from "@/types/tutor";
  import type { SavedSlot, CalendarBlock } from "@/types/calendar";
  import styles from "./StudentBookPage.module.scss";

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

  function computeSlotDate(weekStart: string, day: number, halfHourIndex: number): Date {
    const base = new Date(weekStart);
    base.setDate(base.getDate() + (day - 1));
    const totalMinutes = halfHourIndex * 30;
    base.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);
    return base;
  }

  const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  export default function StudentBookPage() {
    const { tutorId } = useParams<{ tutorId: string }>();
    const todaySunday = useMemo(() => getSunday(new Date()), []);
    const [weekStart, setWeekStart] = useState<Date>(todaySunday);
    const [tutor, setTutor] = useState<TutorProfile | null>(null);
    const [slots, setSlots] = useState<SavedSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
      setSelectedSlotIds([]);
    }, [weekStart]);

    useEffect(() => {
      if (!tutorId) return;
      setLoading(true);
      (async () => {
        try {
          const session = await fetchAuthSession();
          const token = session.tokens?.idToken;
          if (!token) { setLoading(false); return; }

          const [profileRes, slotsRes] = await Promise.all([
            fetch(
              `${import.meta.env.VITE_API_GATEWAY_URL}/tutor-profile?userId=${tutorId}`,
              { headers: { Authorization: `Bearer ${token}` } },
            ),
            fetch(
              `${import.meta.env.VITE_API_GATEWAY_URL}/get-bookings?tutorId=${tutorId}`,
              { headers: { Authorization: `Bearer ${token}` } },
            ),
          ]);

          if (profileRes.ok) {
            const data: TutorProfile = await profileRes.json();
            setTutor(data);
          }
          if (slotsRes.ok) {
            const raw = await slotsRes.json();
            const data: SavedSlot[] = raw.map(
              ({ BookingId: id, TutorId: _t, createdAt: _c, ...rest }: Record<string, unknown>) => ({ id, ...rest } as SavedSlot),
            );
            setSlots(data);
          }
        } catch { /* ignore */ }
        setLoading(false);
      })();
    }, [tutorId]);

    const weekKey = toISODate(weekStart);
    const studentBookings = useStudentBookingStore((s) => s.bookings);

    const blocks: CalendarBlock[] = useMemo(() => {
      const dedup = new Map<string, SavedSlot>();
      for (const s of slots) {
        if (s.weekStart !== weekKey || dedup.has(s.id) || s.registeredCount >= s.maxStudents) continue;

        const slotStart = computeSlotDate(s.weekStart, s.day, s.startHour);
        const slotEnd = computeSlotDate(s.weekStart, s.day, s.endHour);
        const overlapsExisting = studentBookings.some(
          (b) => new Date(b.startTime) < slotEnd && slotStart < new Date(b.endTime),
        );
        if (!overlapsExisting) {
          dedup.set(s.id, s);
        }
      }
      return Array.from(dedup.values()).map((s) => ({ ...s, source: "saved" as const }));
    }, [slots, weekKey, studentBookings]);

    const backDisabled = weekStart.getTime() <= todaySunday.getTime();
    const maxForwardSunday = new Date(todaySunday.getTime() + 21 * 86400000);
    const forwardDisabled = weekStart.getTime() >= maxForwardSunday.getTime();

    const selectedSlots = useMemo(
      () => slots.filter((s) => selectedSlotIds.includes(s.id)),
      [slots, selectedSlotIds],
    );

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

    function handleSelectBlock(blockId: string) {
      setBookingError(null);
      setBookingSuccess(false);
      setSelectedSlotIds((prev) => {
        if (prev.includes(blockId)) return prev.filter((id) => id !== blockId);
        if (prev.length >= 4) return prev;
        return [...prev, blockId];
      });
    }

    async function handleConfirmBooking() {
      if (selectedSlotIds.length === 0) return;
      setBookingError(null);
      setBookingSuccess(false);
      setBookingLoading(true);
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken;
        if (!token) { setBookingError("שגיאה באימות"); setBookingLoading(false); return; }

        const res = await fetch(
          `${import.meta.env.VITE_API_GATEWAY_URL}/create-bookings?tutorId=${tutorId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ slotIds: selectedSlotIds }),
          },
        );

        if (res.ok) {
          setSelectedSlotIds([]);
          setBookingSuccess(true);
          useStudentBookingStore.getState().fetchStudentBookings();
          const freshRes = await fetch(
            `${import.meta.env.VITE_API_GATEWAY_URL}/get-bookings?tutorId=${tutorId}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          if (freshRes.ok) {
            const raw = await freshRes.json();
            const data: SavedSlot[] = raw.map(
              ({ BookingId: id, TutorId: _t, createdAt: _c, ...rest }: Record<string, unknown>) =>
                ({ id, ...rest } as SavedSlot),
            );
            setSlots(data);
          }
        } else {
          const text = await res.text();
          setBookingError(text || "שגיאה בהזמנה");
        }
      } catch {
        setBookingError("שגיאה בהזמנה");
      }
      setBookingLoading(false);
    }

    function formatSlotTime(slot: SavedSlot): string {
      const slotDate = new Date(weekStart);
      slotDate.setDate(slotDate.getDate() + (slot.day - 1));
      const dayName = DAY_NAMES[slot.day - 1];
      const dateStr = `${slotDate.getDate()}.${slotDate.getMonth() + 1}`;
      const startHour = Math.floor(slot.startHour / 2);
      const startMin = slot.startHour % 2 === 0 ? "00" : "30";
      const endHour = Math.floor(slot.endHour / 2);
      const endMin = slot.endHour % 2 === 0 ? "00" : "30";
      return `${dayName} ${dateStr}, ${String(startHour).padStart(2, "0")}:${startMin} – ${String(endHour).padStart(2, "0")}:${endMin}`;
    }

    if (loading) {
      return (
        <>
          <StudentNavBar />
          <main className={styles.page}>
            <div className={styles.loading}>טוען...</div>
          </main>
        </>
      );
    }

    if (!tutor) {
      return (
        <>
          <StudentNavBar />
          <main className={styles.page}>
            <div className={styles.loading}>לא נמצא מורה</div>
          </main>
        </>
      );
    }

    return (
      <>
        <StudentNavBar />
        <main className={styles.page}>
          <h1 className={styles.heading}>
            {tutor.firstName} {tutor.lastName}
          </h1>

          {bookingSuccess && (
            <div className={styles.overlay} onClick={() => setBookingSuccess(false)}>
              <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
                <p className={styles.dialogText}>השיעור הוזמן בהצלחה</p>
                <div className={styles.dialogActions}>
                  <button className={styles.dialogConfirm} onClick={() => setBookingSuccess(false)}>
                    אישור
                  </button>
                </div>
              </div>
            </div>
          )}

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
            lessonTypes={tutor.lessonTypes}
            subjects={tutor.subjects}
            blocks={blocks}
            readOnly
            selectedBlockIds={selectedSlotIds}
            onSelectBlock={handleSelectBlock}
            onAddBlock={() => {}}
            onUpdateBlock={() => {}}
            onDeleteBlock={() => {}}
          />

          {selectedSlots.length > 0 && (
            <div className={styles.bookingBar}>
              <div className={styles.slotList}>
                {selectedSlots.map((slot) => (
                  <div key={slot.id} className={styles.slotRow}>
                    <span className={styles.slotRowTitle}>{slot.title}</span>
                    <span className={styles.slotRowTime}>{formatSlotTime(slot)}</span>
                    <span className={styles.slotRowPrice}>₪{slot.price}</span>
                    <span className={styles.slotRowCapacity}>
                      {slot.registeredCount}/{slot.maxStudents}
                    </span>
                    <button
                      className={styles.removeSlotBtn}
                      onClick={() => handleSelectBlock(slot.id)}
                      disabled={bookingLoading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {bookingError && <span className={styles.bookingError}>{bookingError}</span>}
              <div className={styles.bookingBarActions}>
                <button
                  className={styles.confirmBtn}
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <LoaderCircle size={18} className={styles.spinner} />
                  ) : (
                    `הזמן (${selectedSlots.length})`
                  )}
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setSelectedSlotIds([])}
                  disabled={bookingLoading}
                >
                  בטל
                </button>
              </div>
            </div>
          )}
        </main>
      </>
    );
  }
