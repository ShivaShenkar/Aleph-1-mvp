import type { DayGroup } from "@/store/slotStore";
import styles from "./DayCard.module.scss";

const HEBREW_DAYS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

const SUBJECT_COLORS: Record<string, string> = {
  מתמטיקה: "#ff8c61",
  אנגלית: "#00b4d8",
  היסטוריה: "#f548e7",
  עברית: "#ff8c61",
  אזרחות: "#00b4d8",
  "תנ״ך": "#f548e7",
};

function getSubjectColor(subject: string): string {
  return SUBJECT_COLORS[subject] || "#00b4d8";
}

interface DayCardProps {
  group: DayGroup;
}

export default function DayCard({ group }: DayCardProps) {
  const dayLetter = HEBREW_DAYS[group.date.getDay()];
  const dayNum = group.date.getDate();
  const monthNum = group.date.getMonth() + 1;

  return (
    <div className={styles.card}>
      <p className={styles.dayLetter}>{dayLetter}</p>
      <p className={styles.date}>{`${dayNum}.${monthNum}`}</p>
      <div className={styles.separator} />

      {group.bookings.map((booking) => (
        <div key={booking.id} className={styles.lessonCard}>
          <p className={styles.lessonTitle}>{booking.title}</p>
          <span
            className={styles.badge}
            style={{ backgroundColor: getSubjectColor(booking.subject) }}
          >
            {booking.subject}
          </span>
          <p className={styles.lessonTime}>
            {new Date(booking.startTime).toLocaleTimeString("he-IL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            -
            {new Date(booking.endTime).toLocaleTimeString("he-IL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className={styles.studentCount}>{booking.bookedStudents}</p>
        </div>
      ))}
    </div>
  );
}
