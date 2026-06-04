
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

  if (loading) return <div style={{ direction: "rtl", padding: "20px" }}>טוען נתונים...</div>;

  return (
    <>
      <NavBar />
      <main style={{ padding: "40px", backgroundColor: "#F8FAFC", minHeight: "80vh", direction: "rtl" }}>
        <h1 style={{ color: "#0A192F", fontSize: "28px", fontWeight: "bold", marginBottom: "5px" }}>
          שלום, {tutorName} 👋
        </h1>
        <p style={{ color: "#718096", marginBottom: "30px" }}>מרכז ניהול השיעורים והתלמידים שלך.</p>

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
        </div>
      </main>
      <Footer />
    </>
  );
}