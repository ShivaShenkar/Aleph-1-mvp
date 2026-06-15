import { useEffect, useState, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import StudentNavBar from "@/components/sections/StudentNavBar/StudentNavBar";
import Heading from "@/components/ui/Heading/Heading";
import LessonRow from "@/components/sections/student-lessons/LessonRow/LessonRow";
import EmptyLessons from "@/components/sections/student-lessons/EmptyLessons/EmptyLessons";
import { useStudentBookingStore } from "@/store/studentBookingStore";
import type { Booking, StudentSlot } from "@/models/models";
import styles from "./StudentLessonsPage.module.scss";

function toBooking(slot: StudentSlot): Booking {
  return {
    id: slot.bookingId,
    title: slot.title,
    tutorId: slot.tutorId,
    tutorName: slot.tutorName,
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

const PAGE_SIZE = 10;

export default function StudentLessonsPage() {
  const bookings = useStudentBookingStore((s) => s.bookings);
  const loaded = useStudentBookingStore((s) => s.loaded);
  const fetchStudentBookings = useStudentBookingStore((s) => s.fetchStudentBookings);

  useEffect(() => {
    if (!loaded) fetchStudentBookings();
  }, [loaded, fetchStudentBookings]);

  const pages = useMemo(() => {
    if (bookings.length === 0) return [];

    const sorted = bookings
      .map(toBooking)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    const now = new Date();
    let splitIdx = -1;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (new Date(sorted[i].startTime) <= now) {
        splitIdx = i;
        break;
      }
    }

    const center = splitIdx === -1 ? 0 : splitIdx;
    const result: Booking[][] = [];
    const centerStart = Math.max(0, center - 5);
    result.push(sorted.slice(centerStart, centerStart + PAGE_SIZE));

    let pastIdx = centerStart - PAGE_SIZE;
    while (pastIdx >= 0) {
      result.unshift(sorted.slice(pastIdx, pastIdx + PAGE_SIZE));
      pastIdx -= PAGE_SIZE;
    }

    let futureIdx = centerStart + PAGE_SIZE;
    while (futureIdx < sorted.length) {
      result.push(sorted.slice(futureIdx, futureIdx + PAGE_SIZE));
      futureIdx += PAGE_SIZE;
    }

    return result;
  }, [bookings]);

  const [pageOffset, setPageOffset] = useState(0);
  const currentPage = pages[pageOffset] || [];
  const hasPast = pageOffset > 0;
  const hasFuture = pageOffset < pages.length - 1;

  const lessonWindow = [...currentPage].reverse();
  const now = new Date();

  return (
    <>
      <StudentNavBar />
      <main className={styles.page}>
        <div className={styles.headings}>
          <Heading level="h1" underline>
            השיעורים שלי
          </Heading>
        </div>

        {pages.length === 0 ? (
          <EmptyLessons />
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <div className={styles.headerRow}>
                <span className={styles.headerCell}>שם מורה</span>
                <span className={styles.headerCell}>כותרת</span>
                <span className={styles.headerCell}>מקצוע</span>
                <span className={styles.headerCell}>משתתפים</span>
                <span className={styles.headerCell}>התחלה</span>
                <span className={styles.headerCell}>סיום</span>
                <span className={styles.headerCell}>מיקום</span>
              </div>

              <div className={styles.list}>
                {lessonWindow.map((b) => (
                  <LessonRow
                    key={b.id}
                    booking={b}
                    isPast={new Date(b.startTime) <= now}
                  />
                ))}
              </div>
            </div>

            <div className={styles.pagination}>
              <button
                className={styles.arrowBtn}
                disabled={!hasPast}
                onClick={() => setPageOffset((p) => p - 1)}
              >
                <ChevronRight size={20} />
                קודמים
              </button>
              <button
                className={styles.arrowBtn}
                disabled={!hasFuture}
                onClick={() => setPageOffset((p) => p + 1)}
              >
                הבאים
                <ChevronLeft size={20} />
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
