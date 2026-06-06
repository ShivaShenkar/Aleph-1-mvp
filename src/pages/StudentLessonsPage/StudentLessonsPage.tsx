import { useEffect, useState, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import StudentNavBar from "@/components/sections/StudentNavBar/StudentNavBar";
import Heading from "@/components/ui/Heading/Heading";
import LessonRow from "@/components/sections/student-lessons/LessonRow/LessonRow";
import EmptyLessons from "@/components/sections/student-lessons/EmptyLessons/EmptyLessons";
import { useSlotStore } from "@/store/slotStore";
import { fetchAllLessons } from "@/lib/slotActions";
import styles from "./StudentLessonsPage.module.scss";

export default function StudentLessonsPage() {
  const [pageOffset, setPageOffset] = useState(0);
  const allBookings = useSlotStore((s) => s.allBookings);

  useEffect(() => {
    fetchAllLessons();
  }, []);

  const { window: lessonWindow, hasPast, hasFuture } = useMemo(() => {
    if (allBookings.length === 0) {
      return { window: [], hasPast: false, hasFuture: false };
    }

    const sorted = [...allBookings].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const now = new Date();
    let splitIdx = -1;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (new Date(sorted[i].startTime) <= now) {
        splitIdx = i;
        break;
      }
    }

    const center = splitIdx === -1 ? 0 : splitIdx;
    const start = Math.max(0, center - 5 + pageOffset * 10);
    const items = sorted.slice(start, start + 10);

    return {
      window: [...items].reverse(),
      hasPast: start > 0,
      hasFuture: start + 10 < sorted.length,
    };
  }, [allBookings, pageOffset]);

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

        {allBookings.length === 0 ? (
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
