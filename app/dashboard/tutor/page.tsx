
"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@aws-amplify/auth";

import NavBar from "@/components/sections/NavBar/NavBar"; // תתאים את ה-Imports לפרויקט שלך
import Footer from "@/components/sections/Footer/Footer";

interface Lesson {
  PK: string;
  SK: string;
  subject: string;
  tutorName: string;
  dateStr: string;
  timeStr: string;
  status: string;
  studentId?: string;
}


export default function TutorDashboardPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [tutorName, setTutorName] = useState<string>("המורה");
  const [tutorId, setTutorId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // States עבור הטופס החדש
  const [selectedSubject, setSelectedSubject] = useState("מדעי המחשב");
  const [dateInput, setDateInput] = useState(""); // פורמט: יום ד', 10.06
  const [timeInput, setTimeInput] = useState("15:00 - 16:30");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // פונקציה לשליפת הנתונים (הוצאנו החוצה כדי שנוכל לקרוא לה שוב אחרי יצירת שיעור)
  async function loadTutorData() {
    try {
      const cognitoUser = await getCurrentUser();
      if (!cognitoUser) return;

      setTutorId(cognitoUser.userId);

      const profileRes = await fetch(`/api/user/profile?userId=${cognitoUser.userId}`);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.name) setTutorName(profileData.name);
        setProfile(profileData);
      }

      const response = await fetch(`/api/lessons?userId=${cognitoUser.userId}&role=tutor`);
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      }
    } catch (err) {
      console.error("Failed to fetch tutor data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTutorData();
  }, []);



  // פונקציית שליחת הטופס ל-API
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateInput || !timeInput) {
      alert("נא למלא תאריך ושעה");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: tutorId,
          tutorName: tutorName,
          subject: selectedSubject,
          dateStr: dateInput,
          timeStr: timeInput
        }),
      });

      if (response.ok) {
        alert("השיעור נוצר בהצלחה ופורסם לתלמידים!");
        setDateInput(""); // איפוס התאריך בטופס
        loadTutorData(); // טעינה מחדש של הרשימה כדי לראות את השיעור החדש מיד בלו"ז של המורה
      } else {
        alert("אופס, יצירת השיעור נכשלה.");
      }
    } catch (err) {
      console.error("Error creating lesson:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState<{ name?: string; about?: string } | null>(null);
  const [editName, setEditName] = useState("");
  const [editAbout, setEditAbout] = useState("");

  // אפקט שיעדכן את השדות ברגע שנתוני הפרופיל המקוריים נטענים
  useEffect(() => {
    if (profile) {
      setEditName(profile.name || "");
      setEditAbout(profile.about || "");
    }
  }, [profile]);


    const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(profile as any)?.SK){
      alert("לא ניתן לעדכן פרופיל: מזהה פרופיל חסר.");
      return;
    }
    try {
      const response = await fetch("/api/user/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: tutorId,
            profileSK: (profile as any).SK,
            name: editName,
            about: editAbout,
          }),
      });

      if (response.ok) {
        alert("הפרופיל עודכן בהצלחה!");
        setIsEditModalOpen(false);
        window.location.reload(); // רענון מהיר כדי לראות את השינוי בדשבורד
      } else {
        alert("שגיאה בעדכון הפרופיל");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };


  if (loading) return <div style={{ direction: "rtl", padding: "20px" }}>טוען נתונים...</div>;

  return (
    <>
      <NavBar />
      <main style={{ padding: "40px", backgroundColor: "#F8FAFC", minHeight: "80vh", direction: "rtl" }}>
        <h1 style={{ color: "#0A192F", fontSize: "28px", fontWeight: "bold", marginBottom: "5px" }}>
         
        שלום, {profile?.name || tutorName} 👋</h1>
        <p style={{ color: "#718096", marginBottom: "30px" }}>מרכז ניהול השיעורים והתלמידים שלך.</p>

        <button
          onClick={() => setIsEditModalOpen(true)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#00B4D8",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "15px",
            marginTop: "10px"
          }}
        >
          📝 ערוך פרופיל
        </button>

        {/* 🛠️ אזור הטופס לקביעת שיעור חדש */}
        <section style={{ backgroundColor: "#fff", padding: "25px", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "40px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px", color: "#0A192F" }}>📅 קביעת שיעור חדש במערכת:</h3>
          <form onSubmit={handleCreateLesson} style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "flex-end" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "#4A5568" }}>נושא הלימוד:</label>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E0", minWidth: "150px" }}>
                <option value="מדעי המחשב">מדעי המחשב</option>
                <option value="מתמטיקה">מתמטיקה</option>
                <option value="פיזיקה">פיזיקה</option>
                <option value="תנך">תנך</option>
                <option value="מדעים">מדעים</option>
                <option value="אנגלית">אנגלית</option>
                <option value="היסטוריה">היסטוריה</option>
                <option value="גיאוגרפיה">גיאוגרפיה</option>
                <option value="ספרות">ספרות</option>

                
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "#4A5568" }}>תאריך (לדוגמה: יום ד', 10.06):</label>
              <input type="text" placeholder="יום ד', 10.06" value={dateInput} onChange={(e) => setDateInput(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E0", minWidth: "180px" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "#4A5568" }}>שעות (לדוגמה: 15:00 - 16:30):</label>
              <input type="text" placeholder="15:00 - 16:30" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E0", minWidth: "150px" }} />
            </div>

            <button type="submit" disabled={isSubmitting} style={{ padding: "11px 25px", backgroundColor: "#1D2D50", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", transition: "background 0.2s" }}>
              {isSubmitting ? "מפרסם..." : "➕ פרסם שיעור"}
            </button>
          </form>
        </section>

        {/* 📋 תצוגת הלו"ז הקיים */}
        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px", color: "#0A192F" }}>הלו"ז המתוכנן שלך:</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {lessons.map((lesson) => {
            const isBooked = lesson.status === "booked";
            return (
              <div key={lesson.SK} style={{ backgroundColor: "#fff", borderRadius: "12px", border: isBooked ? "2px solid #2ECC71" : "1px solid #E2E8F0", padding: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "#718096" }}>{lesson.dateStr}</span>
                  <span style={{ backgroundColor: isBooked ? "#2ECC71" : "#FF9F43", color: "#fff", fontSize: "12px", padding: "3px 8px", borderRadius: "4px", fontWeight: "bold" }}>
                    {isBooked ? "✓ מוזמן" : "⏳ פנוי להרשמה"}
                  </span>
                </div>
                <h4 style={{ fontSize: "18px", fontWeight: "bold", color: "#0A192F", margin: "5px 0" }}>{lesson.subject}</h4>
                <p style={{ color: "#4A5568", margin: "5px 0" }}>🕒 שעות: {lesson.timeStr}</p>
                {isBooked ? (
                  <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "rgba(46, 204, 113, 0.1)", borderRadius: "6px", fontSize: "14px", color: "#27AE60", fontWeight: "bold" }}>
                    👤 תלמיד רשום (מזהה: {lesson.studentId?.substring(0,8)}...)
                  </div>
                ) : (
                  <div style={{ marginTop: "15px", fontSize: "14px", color: "#A0AEC0", fontStyle: "italic" }}>אין עדיין תלמיד רשום לשיעור זה.</div>
                )}
              </div>
            );
          })}

          {isEditModalOpen && (
            <div style={modalStyles.overlay}>
              <div style={modalStyles.content}>
                <h3 style={modalStyles.title}>עדכון פרטי פרופיל</h3>
                
                <form onSubmit={handleUpdateProfile} style={modalStyles.form}>
                  <div style={modalStyles.inputGroup}>
                    <label style={modalStyles.label}>שם המורה:</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={modalStyles.input}
                      required
                    />
                  </div>

                  <div style={modalStyles.inputGroup}>
                    <label style={modalStyles.label}>קצת עליי (תיאור הפרופיל):</label>
                    <textarea
                      value={editAbout}
                      onChange={(e) => setEditAbout(e.target.value)}
                      style={modalStyles.textarea}
                      rows={6}
                      required
                    />
                  </div>

                  <div style={modalStyles.actions}>
                    <button type="submit" style={modalStyles.saveButton}>שמור שינויים</button>
                    <button type="button" onClick={() => setIsEditModalOpen(false)} style={modalStyles.cancelButton}>ביטול</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}

const modalStyles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    direction: "rtl" as const,
  },
  content: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
  title: {
    margin: "0 0 20px 0",
    fontSize: "22px",
    fontWeight: "bold" as const,
    color: "#0A192F",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "5px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold" as const,
    color: "#4A5568",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #CBD5E0",
    fontSize: "15px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #CBD5E0",
    fontSize: "15px",
    fontFamily: "inherit",
    resize: "vertical" as const,
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  saveButton: {
    padding: "10px 20px",
    backgroundColor: "#27AE60",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold" as const,
    cursor: "pointer",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#718096",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold" as const,
    cursor: "pointer",
  },
};