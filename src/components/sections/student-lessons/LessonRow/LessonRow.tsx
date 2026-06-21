import { LoaderCircle } from "lucide-react";
import type { Booking } from "@/models/models";
import styles from "./LessonRow.module.scss";

interface LessonRowProps {
  booking: Booking;
  isPast: boolean;
  cancelLoadingId?: string | null;
  onCancel?: (bookingId: string) => void;
}

export default function LessonRow({ booking, isPast, cancelLoadingId, onCancel }: LessonRowProps) {
  const fmtTime = (d: Date) =>
    new Date(d).toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const fmtDate = (d: Date) =>
    new Date(d).toLocaleDateString("he-IL", {
      day: "numeric",
      month: "numeric",
    });

  const locationLabel = booking.location === "online" ? "אונליין" : "פרונטלי";
  const loading = cancelLoadingId === booking.id;

  return (
    <div className={`${styles.row} ${isPast ? styles.past : ""}`}>
      <span className={styles.cell}>{fmtDate(booking.startTime)}</span>
      <span className={styles.cell}>{`${booking.tutorFirstName} ${booking.tutorLastName}`}</span>
      <span className={styles.cell}>{booking.title}</span>
      <span className={styles.cell}>{booking.subject}</span>
      <span className={styles.cell}>{fmtTime(booking.startTime)}</span>
      <span className={styles.cell}>{fmtTime(booking.endTime)}</span>
      <span className={styles.cell}>{locationLabel}</span>
      {!isPast && (
        <span className={styles.cell}>
          <button className={styles.cancelBtn} disabled={loading} onClick={() => onCancel?.(booking.id)}>
            {loading ? <LoaderCircle size={16} className={styles.spinner} /> : "בטל הזמנה"}
          </button>
        </span>
      )}
    </div>
  );
}
