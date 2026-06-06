import type { Booking } from "@/models/models";
import Heading from "@/components/ui/Heading/Heading";
import styles from "./ClosestLessonHeading.module.scss";

interface ClosestLessonHeadingProps {
  booking?: Booking;
}

function formatTimeRemaining(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  if (totalMinutes <= 0) return "פחות מדקה";

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
  const start = new Date(booking.startTime);
  const diff = start.getTime() - now.getTime();

  const timeRemaining = diff > 0 ? formatTimeRemaining(diff) : "השיעור התחיל";

  return (
    <div className={styles.wrapper}>
      <Heading level="h2">{`השיעור "${booking.title}" עם ${booking.tutorName} יתחיל בעוד ${timeRemaining}`}</Heading>
    </div>
  );
}
