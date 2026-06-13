import { useEffect, useState, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import type { SavedSlot } from "@/types/calendar";
import { useBookingStore } from "@/store/bookingStore";
import styles from "./TutorHistoryPage.module.scss";

interface HistoryRow {
  id: string;
  title: string;
  subject: string | null;
  startTime: Date;
  durationMinutes: number;
  price: number;
  location: "online" | "in-person";
}

function slotToRow(slot: SavedSlot): HistoryRow {
  const [y, m, d] = slot.weekStart.split("-").map(Number);
  const date = new Date(y, m - 1, d + slot.day - 1);
  const hours = Math.floor(slot.startHour / 2);
  const mins = (slot.startHour % 2) * 30;
  date.setHours(hours, mins, 0, 0);
  return {
    id: slot.id,
    title: slot.title,
    subject: slot.subject,
    startTime: date,
    durationMinutes: slot.durationMinutes,
    price: slot.price,
    location: slot.location,
  };
}

function buildPages(items: HistoryRow[]): HistoryRow[][] {
  if (items.length === 0) return [];
  const sorted = [...items].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime(),
  );
  const now = new Date();
  let center = sorted.length - 1;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].startTime <= now) {
      center = i;
      break;
    }
  }
  if (center === -1) center = 0;

  const PAGE_SIZE = 10;
  const pages: HistoryRow[][] = [];

  const centerStart = Math.max(0, center - 5);
  pages.push(sorted.slice(centerStart, centerStart + PAGE_SIZE));

  let pastIdx = centerStart - PAGE_SIZE;
  while (pastIdx >= 0) {
    pages.unshift(sorted.slice(pastIdx, pastIdx + PAGE_SIZE));
    pastIdx -= PAGE_SIZE;
  }

  let futureIdx = centerStart + PAGE_SIZE;
  while (futureIdx < sorted.length) {
    pages.push(sorted.slice(futureIdx, futureIdx + PAGE_SIZE));
    futureIdx += PAGE_SIZE;
  }

  return pages;
}

function fmtTime(d: Date): string {
  return d.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmtDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function fmtDuration(mins: number): string {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h} שע' ${m} דק'` : `${h} שע'`;
  }
  return `${mins} דק'`;
}

const locationLabel: Record<string, string> = {
  online: "אונליין",
  "in-person": "פרונטלי",
};

export default function TutorHistoryPage() {
  const [pageOffset, setPageOffset] = useState(0);
  const { tutorSlots, tutorSlotsLoaded, fetchTutorSlots } = useBookingStore();

  useEffect(() => {
    if (!tutorSlotsLoaded) fetchTutorSlots();
  }, [tutorSlotsLoaded, fetchTutorSlots]);

  const pages = useMemo(() => buildPages(tutorSlots.map(slotToRow)), [tutorSlots]);

  const currentPage = pages[pageOffset] || [];
  const hasPast = pageOffset > 0;
  const hasFuture = pageOffset < pages.length - 1;
  const lessonWindow = [...currentPage].reverse();
  const now = new Date();

  if (pages.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.headings}>
          <h1>היסטוריית שיעורים</h1>
        </div>
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>אין היסטוריית שיעורים</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headings}>
        <h1>היסטוריית שיעורים</h1>
      </div>

      <div className={styles.tableWrapper}>
        <div className={styles.headerRow}>
          <span className={styles.headerCell}>כותרת</span>
          <span className={styles.headerCell}>נושא</span>
          <span className={styles.headerCell}>תאריך</span>
          <span className={styles.headerCell}>שעה</span>
          <span className={styles.headerCell}>משך</span>
          <span className={styles.headerCell}>מחיר</span>
          <span className={styles.headerCell}>מיקום</span>
        </div>

        <div className={styles.list}>
          {lessonWindow.map((row) => (
            <div
              key={row.id}
              className={`${styles.row} ${row.startTime <= now ? styles.past : ""}`}
            >
              <span className={styles.cell}>{row.title}</span>
              <span className={styles.cell}>
                {row.subject || "ללא נושא"}
              </span>
              <span className={styles.cell}>
                {fmtDate(row.startTime)}
              </span>
              <span className={styles.cell}>{fmtTime(row.startTime)}</span>
              <span className={styles.cell}>
                {fmtDuration(row.durationMinutes)}
              </span>
              <span className={styles.cell}>₪{row.price}</span>
              <span className={styles.cell}>
                {locationLabel[row.location]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.arrowBtn}
          disabled={!hasPast}
          onClick={() => setPageOffset((p) => p - 1)}
        >
          <ChevronRight size={20} />
          קודמים
        </button>
        <button
          className={styles.arrowBtn}
          disabled={!hasFuture}
          onClick={() => setPageOffset((p) => p + 1)}
        >
          הבאים
          <ChevronLeft size={20} />
        </button>
      </div>
    </div>
  );
}
