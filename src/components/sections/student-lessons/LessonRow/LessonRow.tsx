import type { Booking } from "@/models/models";
import styles from "./LessonRow.module.scss";

interface LessonRowProps {
  booking: Booking;
  isPast: boolean;
}

export default function LessonRow({ booking, isPast }: LessonRowProps) {
  const fmtTime = (d: Date) =>
    new Date(d).toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const locationLabel = booking.location === "online" ? "אונליין" : "פרונטלי";

  return (
    <div className={`${styles.row} ${isPast ? styles.past : ""}`}>
      <span className={styles.cell}>{booking.tutorName}</span>
      <span className={styles.cell}>{booking.title}</span>
      <span className={styles.cell}>{booking.subject}</span>
      <span className={styles.cell}>
        {booking.bookedStudents}/{booking.maxStudents}
      </span>
      <span className={styles.cell}>{fmtTime(booking.startTime)}</span>
      <span className={styles.cell}>{fmtTime(booking.endTime)}</span>
      <span className={styles.cell}>{locationLabel}</span>
    </div>
  );
}
