"use client";

import { useEffect, useState } from "react";
import NavBar from "@/components/sections/NavBar/NavBar"; // תתאים את ה-Imports לפרויקט שלך
import Footer from "@/components/sections/Footer/Footer";
import { getCurrentUser } from "@aws-amplify/auth";


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
  const [tutorName, setTutorName] = useState<string>("המורה"); // State חדש לשם המורה
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTutorData() {
      try {
        // 1. שליפת המשתמש המחובר מקוגניטו
        const cognitoUser = await getCurrentUser();
        if (!cognitoUser) {
          console.error("No user is currently logged in");
          return;
        }

        // 2. שליפת השם האמיתי של המורה מטבלת המשתמשים בדיינמו
        const profileRes = await fetch(`/api/user/profile?userId=${cognitoUser.userId}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.name) {
            setTutorName(profileData.name); // מעדכן לשם האמיתי (למשל: נדב)
          }
        }

        // 3. קריאה ל-API של השיעורים עם ה-userId הדינמי
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
    
    fetchTutorData();
  }, []);

  if (loading) return <div style={{ direction: "rtl", padding: "20px" }}>טוען נתונים...</div>; 

  return (
    <>
      <NavBar />
      <main style={{ padding: "40px", backgroundColor: "#F8FAFC", minHeight: "80vh", direction: "rtl" }}>
        <h1 style={{ color: "#0A192F", fontSize: "28px", fontWeight: "bold", marginBottom: "5px" }}>
          שלום, {tutorName} 👋
        </h1>
        <p style={{ color: "#718096", marginBottom: "30px" }}>מרכז ניהול השיעורים והתלמידים שלך.</p>

        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px", color: "#0A192F" }}>
          הלו"ז המתוכנן שלך:
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {lessons.map((lesson) => {
            const isBooked = lesson.status === "booked";
            
            return (
              <div key={lesson.SK} style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: isBooked ? "2px solid #2ECC71" : "1px solid #E2E8F0",
                padding: "20px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "#718096" }}>{lesson.dateStr}</span>
                  <span style={{
                    backgroundColor: isBooked ? "#2ECC71" : "#FF9F43",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontWeight: "bold"
                  }}>
                    {isBooked ? "✓ מוזמן" : "⏳ פנוי להרשמה"}
                  </span>
                </div>

                <h4 style={{ fontSize: "18px", fontWeight: "bold", color: "#0A192F", margin: "5px 0" }}>
                  {lesson.subject}
                </h4>
                <p style={{ color: "#4A5568", margin: "5px 0" }}>🕒 שעות: {lesson.timeStr}</p>

                {/* חלק דינמי שמציג למורה מי הסטודנט שרשום אליו */}
                {isBooked ? (
                  <div style={{
                    marginTop: "15px",
                    padding: "10px",
                    backgroundColor: "rgba(46, 204, 113, 0.1)",
                    borderRadius: "6px",
                    fontSize: "14px",
                    color: "#27AE60",
                    fontWeight: "bold"
                  }}>
                    👤 תלמיד רשום: רעי שאול (מזהה: {lesson.studentId?.substring(0,8)}...)
                  </div>
                ) : (
                  <div style={{ marginTop: "15px", fontSize: "14px", color: "#A0AEC0", fontStyle: "italic" }}>
                    אין עדיין תלמיד רשום לשיעור זה.
                  </div>
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