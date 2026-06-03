"use client";

interface DynamoLesson {
  PK: string;
  SK: string;
  subject: string;
  tutorName: string;
  dateStr: string;
  timeStr: string;
  status: string;
  participants?: number;
}

interface DayColumn {
  dayName: string;
  date: string;
  lessons: {
    id: string;
    title: string;
    time: string;
    participants: number;
    tutor: string;
    status: string; // <-- שומרים את הסטטוס לרינדור מותנה
  }[];
}

interface Props {
  lessons?: DynamoLesson[];
}

export default function UpcomingLessons({ lessons }: Props) {
  
  if (!lessons || lessons.length === 0) return null;

  // פונקציית הרשמה (קיימת)
  const handleRegisterToLesson = async (lessonId: string, studentId: string) => {
    try {
      const response = await fetch("/api/lessons/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: studentId, lessonId }),
      });
      if (response.ok) {
        alert("נרשמת לשיעור בהצלחה!");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

    // פונקציה חדשה לביטול הרשמה (נחבר ל-API בהמשך, כרגע עושה Alert ומשנה זמנית)
  const handleCancelRegistration = async (lessonId: string, studentId: string) => {
      try {
        const response = await fetch("/api/lessons/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: studentId, lessonId }),
        });

        if (response.ok) {
          alert("ההרשמה בוטלה בהצלחה!");
          window.location.reload(); // רענון מהיר כדי לראות את השינוי בעיניים
        } else {
          alert("אופס, ביטול ההרשמה נכשל.");
        }
      } catch (err) {
        console.error("Error sending cancellation request:", err);
      }
    };

  const dataToRender: DayColumn[] = lessons.map((lesson) => {
    const dateParts = lesson.dateStr.split(",");
    return {
      dayName: dateParts[0]?.trim() || "שיעור",
      date: dateParts[1]?.trim() || "",
      lessons: [
        {
          id: lesson.SK,
          title: lesson.subject,
          time: lesson.timeStr,
          participants: lesson.participants ?? 1,
          tutor: lesson.tutorName,
          status: lesson.status, // שמירת הסטטוס הנוכחי מהדיינמו
        },
      ],
    };
  });

  const currentStudentId = lessons[0].PK.replace("USER#", "");

  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>שיעורים קרובים:</h3>
      <div style={styles.grid}>
        {dataToRender.map((day, idx) => (
          <div key={idx} style={styles.dayCard}>
            <div style={styles.dayHeader}>
              <span style={styles.dayName}>{day.dayName}</span>
              <span style={styles.dayDate}>{day.date}</span>
            </div>
            <div style={styles.lessonsContainer}>
              {day.lessons.map((lesson, lIdx) => {
                const isBooked = lesson.status === "booked";

                return (
                  <div key={lIdx} style={styles.lessonItem}>
                    <div style={styles.lessonTitle}>
                      {lesson.title}
                      {isBooked ? (
                        <span style={styles.bookedBadge}>✓ רשום</span>
                      ) : (
                        lesson.participants > 1 && <span style={styles.badge}>קבוצתי</span>
                      )}
                    </div>
                    
                    <div style={{ fontSize: "14px", color: "#A0AEC0" }}>
                      מורה: {lesson.tutor}
                    </div>

                    {/* הודעת סטטוס ייעודית אם המשתמש רשום */}
                    {isBooked && (
                      <div style={styles.registeredText}>
                        📢 הינך רשום לשיעור זה
                      </div>
                    )}

                    <div style={styles.lessonMeta}>
                      <span>🕒 {lesson.time}</span>
                      <span>👤 {lesson.participants}</span>
                    </div>

                    {/* שינוי דינמי של הכפתור לפי הסטטוס */}
                    {isBooked ? (
                      <button 
                        onClick={() => handleCancelRegistration(lesson.id, currentStudentId)}
                        style={styles.cancelButton}
                      >
                        ✕ בטל הרשמה
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleRegisterToLesson(lesson.id, currentStudentId)}
                        style={styles.registerButton}
                      >
                        ✏️ הירשם לשיעור
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  section: { width: "100%" },
  sectionTitle: { fontSize: "20px", fontWeight: "bold" as const, marginBottom: "15px", color: "#0A192F" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  dayCard: { backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E2E8F0", minHeight: "260px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
  dayHeader: { padding: "15px", textAlign: "center" as const, borderBottom: "2px dashed #E2E8F0", display: "flex", flexDirection: "column" as const, gap: "4px" },
  dayName: { fontSize: "22px", fontWeight: "bold" as const, color: "#0A192F" },
  dayDate: { fontSize: "14px", color: "#718096" },
  lessonsContainer: { padding: "15px", display: "flex", flexDirection: "column" as const, gap: "10px" },
  lessonItem: { backgroundColor: "#1D2D50", color: "#fff", padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column" as const, gap: "8px" },
  lessonTitle: { fontWeight: "bold" as const, fontSize: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  badge: { backgroundColor: "#FF9F43", color: "#fff", fontSize: "11px", padding: "2px 6px", borderRadius: "4px" },
  bookedBadge: { backgroundColor: "#2ECC71", color: "#fff", fontSize: "11px", padding: "2px 6px", borderRadius: "4px" },
  registeredText: { backgroundColor: "rgba(46, 204, 113, 0.15)", color: "#2ECC71", padding: "6px", borderRadius: "4px", fontSize: "13px", fontWeight: "bold" as const, textAlign: "center" as const, marginTop: "4px" },
  lessonMeta: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#CBD5E0" },
  registerButton: { marginTop: "12px", backgroundColor: "#FF9F43", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 12px", fontSize: "14px", fontWeight: "bold" as const, cursor: "pointer", transition: "background-color 0.2s", width: "100%", textAlign: "center" as const },
  cancelButton: { marginTop: "12px", backgroundColor: "#E74C3C", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 12px", fontSize: "14px", fontWeight: "bold" as const, cursor: "pointer", transition: "background-color 0.2s", width: "100%", textAlign: "center" as const },
};