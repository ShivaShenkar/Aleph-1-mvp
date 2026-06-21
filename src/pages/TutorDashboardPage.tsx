import { useEffect } from "react";
import styles from "@/styles/student.module.scss";
import GreetingHeading from "@/components/sections/student-home/GreetingHeading/GreetingHeading";
import ClosestLessonHeading from "@/components/sections/student-home/ClosestLessonHeading/ClosestLessonHeading";
import LessonSchedule from "@/components/sections/student-home/LessonSchedule/LessonSchedule";
import { useBookingStore } from "@/store/bookingStore";
import type { Booking } from "@/models/models";

function computeSlotDate(weekStart: string, day: number, halfHourIndex: number): Date {
  const base = new Date(weekStart);
  base.setDate(base.getDate() + (day - 1));
  const totalMinutes = halfHourIndex * 30;
  base.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);
  return base;
}

export default function TutorDashboardPage() {
  const tutorSlots = useBookingStore((s) => s.tutorSlots);
  const fetchTutorSlots = useBookingStore((s) => s.fetchTutorSlots);
  const setUpcomingLessons = useBookingStore((s) => s.setUpcomingLessons);
  const upcomingLessons = useBookingStore((s) => s.upcomingLessons);

  useEffect(() => {
    fetchTutorSlots();
  }, [fetchTutorSlots]);

  useEffect(() => {
    const now = new Date();
    const booked: Booking[] = tutorSlots
      .filter((s) => s.registeredCount > 0)
      .map((s) => ({
        id: s.id,
        title: s.title,
        tutorId: "",
        tutorFirstName: "",
        tutorLastName: "",
        subject: s.subject ?? "",
        maxStudents: s.maxStudents,
        bookedStudents: s.registeredCount,
        durationMinutes: s.durationMinutes,
        location: s.location,
        price: s.price,
        startTime: computeSlotDate(s.weekStart, s.day, s.startHour),
        endTime: computeSlotDate(s.weekStart, s.day, s.endHour),
        tutorLatencyMinutes: 0,
        createdAt: new Date(),
      }))
      .filter((b) => b.endTime > now);

    const groupsMap = new Map<string, Booking[]>();
    for (const b of booked) {
      const key = b.startTime.toDateString();
      const list = groupsMap.get(key) ?? [];
      list.push(b);
      groupsMap.set(key, list);
    }

    const groups = Array.from(groupsMap.entries())
      .map(([_, bookings]) => ({
        date: bookings[0].startTime,
        bookings,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    setUpcomingLessons(groups);
  }, [tutorSlots, setUpcomingLessons]);

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
