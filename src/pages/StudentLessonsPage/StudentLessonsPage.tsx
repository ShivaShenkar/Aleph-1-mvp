import { useEffect, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import StudentNavBar from "@/components/sections/StudentNavBar/StudentNavBar";
import Heading from "@/components/ui/Heading/Heading";
import LessonRow from "@/components/sections/student-lessons/LessonRow/LessonRow";
import EmptyLessons from "@/components/sections/student-lessons/EmptyLessons/EmptyLessons";
import { useBookingStore } from "@/store/bookingStore";
import { fetchAllLessons } from "@/lib/slotActions";
import styles from "./StudentLessonsPage.module.scss";

export default function StudentLessonsPage() {
  const [pageOffset, setPageOffset] = useState(0);
  const allLessonsMat = useBookingStore((s) => s.allLessonsMat);

  useEffect(() => {
    fetchAllLessons();
  }, []);

  const currentPage = allLessonsMat[pageOffset] || [];
  const hasPast = pageOffset > 0;
  const hasFuture = pageOffset < allLessonsMat.length - 1;

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

        {allLessonsMat.length === 0 ? (
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
