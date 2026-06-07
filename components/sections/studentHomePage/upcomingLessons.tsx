"use client";

import { useRouter } from "next/navigation";


interface DynamoLesson {
  PK: string;
  SK: string;
  tutorId: string; // ודא שקיים
  subject: string;
  tutorName: string;
  dateStr: string;
  timeStr: string;
  status: string;
  studentId?: string;
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
    status: string;
    tutorId: string; // שמירת מזהה המורה לטובת כפתור הביטול
    studentId?: string; // שמירת מזהה הסטודנט הרשום
  }[];
}

interface Props {
  lessons?: DynamoLesson[];
  studentId: string; // <-- מקבלים את ה-ID האמיתי של הסטודנט המחובר כפרופ
}


export default function UpcomingLessons({ lessons, studentId }: Props) {
  const router = useRouter();
  
  if (!lessons || lessons.length === 0) return null;

  // פונקציית הרשמה
  const handleRegisterToLesson = async (lessonId: string, studentId: string, tutorId: string) => {
    try {
      const response = await fetch("/api/lessons/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: studentId, lessonId, tutorId }),
      });
      if (response.ok) {
        alert("נרשמת לשיעור בהצלחה!");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };



  const handleCancelRegistration = async (lessonId: string, tutorId: string) => {
      try {
        const response = await fetch("/api/lessons/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId, tutorId }),
        });
        if (response.ok) {
          alert("ההרשמה בוטלה בהצלחה!");
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
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
            status: lesson.status,
            tutorId: lesson.tutorId || lesson.PK.replace("USER#", ""), // חילוץ בטוח של ה-tutorId
            studentId: lesson.studentId
          },
        ],
      };
    });

  const currentStudentId = studentId; // שימוש ב-prop שמגיע מהדשבורד
    
    return (
      <div style={localStyles.container}>
        <h3 style={localStyles.title}>שיעורים קרובים:</h3>
        
        <div style={localStyles.grid}>
          {dataToRender.map((day) => (
            <div key={day.date} style={localStyles.dayCard}>
              {/* כותרת היום והתאריך */}
              <div style={localStyles.dayHeader}>
                <h4 style={localStyles.dayName}>{day.dayName}</h4>
                <span style={localStyles.dayDate}>{day.date}</span>
              </div>
              
              <hr style={localStyles.divider} />

              {/* רשימת השיעורים בתוך אותו יום */}
              <div style={localStyles.lessonsList}>
                {day.lessons.map((lesson) => {
                  const isBooked = lesson.status === "booked";
                  const isScheduled = lesson.status === "scheduled";

                  // אם השיעור לא פנוי ולא מוזמן על ידינו - לא נציג אותו
                  if (!isScheduled && !isBooked) return null;

                  return (
                    <div key={lesson.id} style={localStyles.lessonRow}>
                      <div style={localStyles.lessonInfo}>
                        <span style={localStyles.lessonTime}>🕒 {lesson.time}</span>
                        <span style={localStyles.lessonTutor}>👤 מורה: {lesson.tutor}</span>
                        
                        {/* כיתוב סטטוס דינמי */}
                        {isBooked && (
                          <span style={localStyles.bookedBadge}>
                            ✓ הינך רשום לשיעור זה
                          </span>
                        )}
                      </div>

                      <div style={localStyles.actionArea}>
                        {isBooked ? (
                          <button 
                            onClick={() => handleCancelRegistration(lesson.id, lesson.tutorId)}
                            style={localStyles.cancelButton}
                          >
                            ✕ בטל הרשמה
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRegisterToLesson(lesson.id, currentStudentId, lesson.tutorId)}
                            style={localStyles.registerButton}
                          >
                            ✏️ הירשם לשיעור
                          </button>
                        )}
                        <button 
                          onClick={() => router.push(`/tutor/${lesson.tutorId}`)}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: "#E2E8F0",
                            color: "#4A5568",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            marginLeft: "10px" // מרווח בין הכפתורים
                          }}
                        >
                          ℹ️ אודות המורה
                        </button>

                      </div>
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

// const styles = {
//   section: { width: "100%" },
//   sectionTitle: { fontSize: "20px", fontWeight: "bold" as const, marginBottom: "15px", color: "#0A192F" },
//   grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
//   dayCard: { backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E2E8F0", minHeight: "260px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" },
//   dayHeader: { padding: "15px", textAlign: "center" as const, borderBottom: "2px dashed #E2E8F0", display: "flex", flexDirection: "column" as const, gap: "4px" },
//   dayName: { fontSize: "22px", fontWeight: "bold" as const, color: "#0A192F" },
//   dayDate: { fontSize: "14px", color: "#718096" },
//   lessonsContainer: { padding: "15px", display: "flex", flexDirection: "column" as const, gap: "10px" },
//   lessonItem: { backgroundColor: "#1D2D50", color: "#fff", padding: "12px", borderRadius: "8px", display: "flex", flexDirection: "column" as const, gap: "8px" },
//   lessonTitle: { fontWeight: "bold" as const, fontSize: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" },
//   badge: { backgroundColor: "#FF9F43", color: "#fff", fontSize: "11px", padding: "2px 6px", borderRadius: "4px" },
//   bookedBadge: { backgroundColor: "#2ECC71", color: "#fff", fontSize: "11px", padding: "2px 6px", borderRadius: "4px" },
//   registeredText: { backgroundColor: "rgba(46, 204, 113, 0.15)", color: "#2ECC71", padding: "6px", borderRadius: "4px", fontSize: "13px", fontWeight: "bold" as const, textAlign: "center" as const, marginTop: "4px" },
//   lessonMeta: { display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#CBD5E0" },
//   registerButton: { marginTop: "12px", backgroundColor: "#FF9F43", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 12px", fontSize: "14px", fontWeight: "bold" as const, cursor: "pointer", transition: "background-color 0.2s", width: "100%", textAlign: "center" as const },
//   cancelButton: { marginTop: "12px", backgroundColor: "#E74C3C", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 12px", fontSize: "14px", fontWeight: "bold" as const, cursor: "pointer", transition: "background-color 0.2s", width: "100%", textAlign: "center" as const },
// };

const localStyles = {
  container: {direction: "rtl" as const,marginTop: "20px",},
  title: {
    fontSize: "18px", fontWeight: "bold" as const, color: "#0A192F", marginBottom: "15px",},
  grid: { display: "flex",flexDirection: "column" as const,gap: "15px",},
  dayCard: {backgroundColor: "#fff",borderRadius: "10px",border: "1px solid #E2E8F0",padding: "20px",boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
  },
  dayHeader: {display: "flex",flexDirection: "column" as const,alignItems: "center",marginBottom: "10px",
  },
  dayName: {fontSize: "20px",fontWeight: "bold" as const,color: "#0A192F",margin: "0",
  },
  dayDate: {
    fontSize: "13px",
    color: "#718096",
  },
  divider: {
    border: "0",
    borderTop: "1px dashed #E2E8F0",
    margin: "15px 0",
  },
  lessonsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  lessonRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #EDF2F7",
  },
  lessonInfo: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  lessonTime: {
    fontSize: "14px",
    fontWeight: "bold" as const,
    color: "#1D2D50",
  },
  lessonTutor: {
    fontSize: "14px",
    color: "#4A5568",
  },
  bookedBadge: {
    fontSize: "13px",
    fontWeight: "bold" as const,
    color: "#27AE60",
    backgroundColor: "rgba(46, 204, 113, 0.1)",
    padding: "2px 8px",
    borderRadius: "4px",
    marginTop: "4px",
    width: "fit-content",
  },
  actionArea: {
    display: "flex",
    alignItems: "center",
  },
  registerButton: {
    padding: "8px 16px",
    backgroundColor: "#FF9F43",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold" as const,
    cursor: "pointer",
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "#E74C3C", // אדום בולט לביטול
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};