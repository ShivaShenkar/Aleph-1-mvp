import { useMemo, useEffect } from "react";
import styles from "@/styles/student.module.scss";
import StudentNavBar from "@/components/sections/StudentNavBar/StudentNavBar";
import ClosestLessonHeading from"@/components/sections/student-home/ClosestLessonHeading/ClosestLessonHeading";
import GreetingHeading from "@/components/sections/student-home/GreetingHeading/GreetingHeading";
import LessonSchedule from "@/components/sections/student-home/LessonSchedule/LessonSchedule";
import { useStudentBookingStore } from "@/store/studentBookingStore";
import { useBookingStore } from "@/store/bookingStore";
import type { Booking, StudentSlot } from "@/models/models";
import type { DayGroup } from "@/store/bookingStore";

function toBooking(slot: StudentSlot): Booking {
  return {
    id: slot.bookingId,
    title: slot.title,
    tutorId: slot.tutorId,
    tutorFirstName: slot.tutorFirstName,
    tutorLastName: slot.tutorLastName,
    subject: slot.subject,
    maxStudents: slot.maxStudents,
    bookedStudents: 0,
    durationMinutes: slot.durationMinutes,
    location: slot.location,
    price: slot.price,
    startTime: slot.startTime,
    endTime: slot.endTime,
    tutorLatencyMinutes: 0,
    createdAt: slot.createdAt,
  };
}

function groupByNearestDays(slots: StudentSlot[]): DayGroup[] {
  const now = new Date();
  const bookings = slots
    .map(toBooking)
    .filter((b) => new Date(b.endTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const groups: DayGroup[] = [];
  const seen = new Set<string>();

  for (const booking of bookings) {
    const d = new Date(booking.startTime);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!seen.has(key)) {
      seen.add(key);
      groups.push({ date: d, bookings: [] });
    }
    groups[groups.length - 1].bookings.push(booking);
    if (groups.length === 3) break;
  }

  return groups;
}

export default function StudentPage() {
  const bookings = useStudentBookingStore((s) => s.bookings);
  const loaded = useStudentBookingStore((s) => s.loaded);
  const fetchStudentBookings = useStudentBookingStore((s) => s.fetchStudentBookings);

  useEffect(() => {
    if (!loaded) fetchStudentBookings();
  }, [loaded, fetchStudentBookings]);

  const groups = useMemo(() => {
    if (!loaded) return [];
    return groupByNearestDays(bookings);
  }, [bookings, loaded]);

  useEffect(() => {
    useBookingStore.getState().setUpcomingLessons(groups);
  }, [groups]);

  const closestBooking = useMemo(() => {
    if (!loaded || bookings.length === 0) return undefined;
    const now = new Date();
    const upcoming = bookings
      .map(toBooking)
      .filter((b) => new Date(b.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    return upcoming[0];
  }, [bookings, loaded]);

  return (
    <main className={styles.page}>
      <StudentNavBar />
      <div className={styles.headings}>
        <GreetingHeading />
        <ClosestLessonHeading booking={closestBooking} />
      </div>
      <div className={styles.lessonSchedule}>
        <LessonSchedule />
      </div>
    </main>
  );
}
