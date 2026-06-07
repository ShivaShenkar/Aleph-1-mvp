"use client";

import React from "react";

// 1. מערך המקצועות המעוצב - צבעי רקע עדינים ואייקונים מתאימים
const SUBJECTS_DATA = [
  { id: "math", name: "מתמטיקה", icon: "📐", bgColor: "#EBF8FF" },
  { id: "english", name: "אנגלית", icon: "🇬🇧", bgColor: "#F7FAFC" },
  { id: "history", name: "היסטוריה", icon: "📜", bgColor: "#FEF3C7" },
  { id: "hebrew", name: "עברית", icon: "✍️", bgColor: "#E6FFFA" },
  { id: "civics", name: "אזרחות", icon: "🏛️", bgColor: "#ECEFFF" },
  { id: "bible", name: "תנ\"ך", icon: "⚱️", bgColor: "#FFF5F5" },
];

export default function SubjectsSection() {
  return (
    <section style={styles.container}>
      <h2 style={styles.mainTitle}>בחר נושא לימוד</h2>
      <div style={styles.underline} />

      <div style={styles.grid}>
        {SUBJECTS_DATA.map((subject) => (
          <div 
            key={subject.id} 
            style={styles.card}
            // הוספת אפקט ה-Hover דרך ה-JS (בשביל inline styles פשוטים בלי קובץ CSS נפרד)
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.borderColor = "#00B4D8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
              e.currentTarget.style.borderColor = "#E2E8F0";
            }}
          >
            {/* העיגול המרכזי עם האייקון התואם */}
            <div 
              style={{
                ...styles.iconCircle,
                backgroundColor: subject.bgColor,
              }}
            >
              <span style={{ fontSize: "40px" }}>{subject.icon}</span>
            </div>
            
            {/* שם המקצוע בצבע התכלת של הלוגו שלכם */}
            <h3 style={styles.subjectName}>{subject.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

// 🎨 אובייקט הסטייל המעודכן המעניק מראה מודרני ונקי
const styles = {
  container: {
    padding: "60px 20px",
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    direction: "rtl" as const,
  },
  mainTitle: {
    fontSize: "26px",
    fontWeight: "bold" as const,
    color: "#0A192F",
    margin: "0 0 8px 0",
    textAlign: "center" as const,
  },
  underline: {
    width: "80px",
    height: "3px",
    backgroundColor: "#0A192F",
    marginBottom: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "30px",
    maxWidth: "1000px",
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  iconCircle: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
  },
  subjectName: {
    fontSize: "18px",
    fontWeight: "bold" as const,
    color: "#00B4D8", // שימוש בצבע המותג של אומגה/אלף1
    margin: "0",
  },
};