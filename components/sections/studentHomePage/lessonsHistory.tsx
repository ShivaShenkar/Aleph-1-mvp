"use client";

interface Lesson {
  title?: string;
  date?: string;
  status?: string;
}

interface LessonsHistoryProps {
  lessons?: Lesson[];
  name?: string;
}

export default function LessonsHistory({ lessons, name }: LessonsHistoryProps) {
  return (
    <div>
      <h3 style={{ margin: 0 }}>היסטוריית שיעורים מוקלטים</h3>
      {lessons && lessons.length > 0 ? (
        <ul style={{ marginTop: 8 }}>
          {lessons.map((l, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>
              {l.title || "שיעור"} — {l.date || "תאריך לא זמין"}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ marginTop: 8 }}>רשימת שיעורים מוקלטים תופיע כאן ברגע שיהיו שיעורים.</p>
      )}
    </div>
  );
}