import type { DayGroup } from "@/store/bookingStore";
import { subjects } from "@/lib/subjects";
import styles from "./DayCard.module.scss";

const HEBREW_DAYS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

function getSubjectColor(slug: string): string {
  return subjects.find((s) => s.slug === slug)?.color ?? "#00b4d8";
}

function getSubjectName(slug: string): string {
  return subjects.find((s) => s.slug === slug)?.name ?? slug;
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
      <div className={styles.header}>
        <span className={styles.dayLetter}>{dayLetter}</span>
        <span className={styles.date}>{`${dayNum}.${monthNum}`}</span>
      </div>
      <div className={styles.separator} />

      {group.bookings.map((booking) => {
        const subjectColor = getSubjectColor(booking.subject);
        return (
          <div
            key={booking.id}
            className={styles.lessonCard}
            style={{ borderInlineStartColor: subjectColor }}
          >
            <span
              className={styles.badge}
              style={{ backgroundColor: subjectColor }}
            >
              {getSubjectName(booking.subject)}
            </span>
            <p className={styles.lessonTitle}>{booking.title}</p>
            <p className={styles.tutorName}>{booking.tutorName}</p>
            <p className={styles.lessonTime}>
              {new Date(booking.startTime).toLocaleTimeString("he-IL", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" – "}
              {new Date(booking.endTime).toLocaleTimeString("he-IL", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        );
      })}
    </div>
  );
}
