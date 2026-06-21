import type { Booking } from "@/models/models";
import Heading from "@/components/ui/Heading/Heading";
import styles from "./ClosestLessonHeading.module.scss";

interface ClosestLessonHeadingProps {
  booking?: Booking;
}

function formatTimeRemaining(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  if (totalMinutes <= 0) return "פחות מדקה";

  const days = Math.floor(totalMinutes / 1440);
  if (days > 0) return days === 1 ? "יום" : `${days} ימים`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} דקות`;
  if (minutes === 0) return `${hours} שעות`;
  return `${hours} שעות ו-${minutes} דקות`;
}

export default function ClosestLessonHeading({
  booking,
}: ClosestLessonHeadingProps) {
  if (!booking) {
    return null;
  }

  const now = new Date();
  if (new Date(booking.endTime) <= now) return null;

  const start = new Date(booking.startTime);
  const diff = start.getTime() - now.getTime();
  const tutorPart = booking.tutorFirstName
    ? ` עם ${booking.tutorFirstName} ${booking.tutorLastName}`
    : "";

  if (diff > 0) {
    return (
      <div className={styles.wrapper}>
        <Heading level="h2">{`השיעור "${booking.title}"${tutorPart} יתחיל בעוד ${formatTimeRemaining(diff)}`}</Heading>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Heading level="h2">{`השיעור "${booking.title}"${tutorPart} מתקיים כעת`}</Heading>
    </div>
  );
}
