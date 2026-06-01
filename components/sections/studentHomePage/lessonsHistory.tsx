"use client";

interface lessonsHistoryProps {
  name: string;
}

export default function lessonsHistory({ name }: lessonsHistoryProps) {
  return (
    <div>
      <h3 style={{ margin: 0 }}>היסטוריית שיעורים מוקלטים</h3>
      <p style={{ marginTop: 8 }}>רשימת שיעורים מוקלטים תופיע כאן ברגע שיהיו שיעורים.</p>
    </div>
  );
}