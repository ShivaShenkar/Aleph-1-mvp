"use client";

interface Lesson {
  title: string;
  time: string;
  participants: number;
  type: string;
}

interface DayColumn {
  dayName: string;
  date: string;
  lessons: Lesson[];
}

export default function UpcomingLessons() {
  // מידע דמי (Mock Data) לפי העיצוב שלך
  const weeklySchedule: DayColumn[] = [
    {
      dayName: "א'",
      date: "3.5",
      lessons: [
        { title: "אלגברה ליניארית", time: "13:00-14:00", participants: 2, type: "מתמטיקה" },
        { title: "שיעור פרטי", time: "16:00-17:30", participants: 1, type: "פרטי" },
      ],
    },
    {
      dayName: "ג'",
      date: "5.5",
      lessons: [
        { title: "מכניקה קוונטית", time: "8:00-10:00", participants: 10, type: "פיזיקה" },
        { title: "שיעור פרטי", time: "11:00-11:45", participants: 1, type: "פרטי" },
      ],
    },
    {
      dayName: "ד'",
      date: "6.5",
      lessons: [
        { title: "אלגברה ליניארית", time: "13:00-14:00", participants: 2, type: "מתמטיקה" },
        { title: "שיעור פרטי", time: "13:00-14:00", participants: 1, type: "פרטי" },
      ],
    },
  ];

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>שיעורים קרובים:</h3>
      <div style={styles.grid}>
        {weeklySchedule.map((day, idx) => (
          <div key={idx} style={styles.dayCard}>
            <div style={styles.dayHeader}>
              <span style={styles.dayName}>{day.dayName}</span>
              <span style={styles.dayDate}>{day.date}</span>
            </div>
            <div style={styles.lessonsContainer}>
              {day.lessons.map((lesson, lIdx) => (
                <div key={lIdx} style={styles.lessonItem}>
                  <div style={styles.lessonTitle}>
                    {lesson.title} 
                    {lesson.participants > 1 && <span style={styles.badge}>קבוצתי</span>}
                  </div>
                  <div style={styles.lessonMeta}>
                    <span>🕒 {lesson.time}</span>
                    <span>👤 {lesson.participants}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  section: { width: "100%" },
  sectionTitle: { fontSize: "20px", fontWeight: "bold", marginBottom: "15px", color: "#0A192F" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  dayCard: { backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E2E8F0", minHeight: "300px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  dayHeader: { padding: "15px", textAlign: "center" as const, borderBottom: "2px dashed #E2E8F0", display: "flex", flexDirection: "column" as const, gap: "4px" },
  dayName: { fontSize: "22px", fontWeight: "bold", color: "#0A192F" },
  dayDate: { fontSize: "14px", color: "#718096" },
  lessonsContainer: { padding: "15px", display: "flex", flexDirection: "column" as const, gap: "10px" },
  lessonItem: { backgroundColor: "#1D2D50", color: "#fff", padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column" as const, gap: "8px" },
  lessonTitle: { fontWeight: "bold", fontSize: "15px", display: "flex", justifyContent: "space-between" },
  badge: { backgroundColor: "#FF9F43", color: "#fff", fontSize: "11px", padding: "2px 6px", borderRadius: "4px" },
  lessonMeta: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#CBD5E0" },
};