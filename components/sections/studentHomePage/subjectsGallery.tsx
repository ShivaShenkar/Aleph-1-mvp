"use client";

import { useState } from "react";

interface Subject {
  id: string;
  name: string;
  icon: string;
  borderColor: string;
}

export default function SubjectsGallery() {
  // נתוני דמי (Mock Data) לפי העיצוב שלך
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "מתמטיקה", icon: "📐", borderColor: "#4A90E2" },
    { id: "2", name: "פיזיקה", icon: "🌌", borderColor: "#7B1FA2" },
    { id: "3", name: "אנגלית", icon: "🇬🇧", borderColor: "#E67E22" },
    { id: "4", name: "מדעי המחשב", icon: "💻", borderColor: "#2ECC71" },
    { id: "5", name: "היסטוריה", icon: "🏛️", borderColor: "#F44336" },
    { id: "6", name: "ספרות", icon: "📚", borderColor: "#9C27B0" }, 
    { id: "7", name: "מדעים", icon: "⚗️", borderColor: "#3F51B5" },
    { id: "8", name: "תנ״ך", icon: "📖", borderColor: "#009688" },
    { id: "9", name: "גיאוגרפיה", icon: "🌍", borderColor: "#FF5722" },
  
  ]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // הוספת נושא הוסרה — אין אפשרות להוסיף נושאים דרך הממשק

  return (
    <div style={styles.container}>
      {/* שורת כותרת */}
      <div style={styles.headerRow}>
        <h2 style={styles.title}>נושאי לימוד</h2>
      </div>

      {/* גריד של כרטיסיות */}
      <div style={styles.grid}>
        {subjects.map((subject) => {
          const isHovered = hoveredId === subject.id;
          const cardStyle = {
            ...styles.card,
            borderTop: `6px solid ${subject.borderColor}`,
            backgroundColor: isHovered ? "#f0f4ff" : styles.card.backgroundColor,
            transform: isHovered ? "translateY(-6px)" : undefined,
            boxShadow: isHovered ? "0 8px 20px rgba(0,0,0,0.12)" : styles.card.boxShadow,
          } as React.CSSProperties;

          return (
            <div
              key={subject.id}
              style={cardStyle}
              onMouseEnter={() => setHoveredId(subject.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div style={styles.iconContainer}>{subject.icon}</div>
              <h3 style={styles.cardTitle}>{subject.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    marginTop: "20px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#0A192F",
  },
  addButton: {
    backgroundColor: "#1D2D50",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background-color 0.2s",
  },
  plusSign: {
    fontSize: "18px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    minHeight: "160px",
  },
  iconContainer: {
    fontSize: "40px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    textAlign: "center" as const,
  },
};