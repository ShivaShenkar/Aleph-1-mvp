import { useBookingStore } from "@/store/bookingStore";
import NoUpcomingLessons from "./NoUpcomingLessons";
import DayCard from "./DayCard";
import styles from "./LessonSchedule.module.scss";

export default function LessonSchedule() {
  const upcomingLessons = useBookingStore((s) => s.upcomingLessons);

  if (upcomingLessons.length === 0) return <NoUpcomingLessons />;

  return (
    <div className={styles.schedule}>
      <h3 className={styles.heading}>שיעורים קרובים:</h3>
      <div className={styles.days}>
        {upcomingLessons.map((group) => (
          <DayCard key={group.date.toISOString()} group={group} />
        ))}
      </div>
    </div>
  );
}
