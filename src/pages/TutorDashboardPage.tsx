import { useEffect } from "react";
import styles from "@/styles/student.module.scss";
import GreetingHeading from "@/components/sections/student-home/GreetingHeading/GreetingHeading";
import ClosestLessonHeading from "@/components/sections/student-home/ClosestLessonHeading/ClosestLessonHeading";
import LessonSchedule from "@/components/sections/student-home/LessonSchedule/LessonSchedule";
import { useBookingStore } from "@/store/bookingStore";
import { homePageLoad } from "@/lib/slotActions";

export default function TutorDashboardPage() {
  const upcomingLessons = useBookingStore((s) => s.upcomingLessons);

  useEffect(() => {
    homePageLoad();
  }, []);

  const closestBooking =
    upcomingLessons.length > 0 ? upcomingLessons[0].bookings[0] : undefined;

  return (
    <div className={styles.page}>
      <div className={styles.headings}>
        <GreetingHeading />
        <ClosestLessonHeading booking={closestBooking} />
      </div>
      <div className={styles.lessonSchedule}>
        <LessonSchedule emptyRedirectTo="/tutor/calendar" />
      </div>
    </div>
  );
}
