"use client";

interface noLessonsCtaProps {
  name: string;
}

export default function noLessonsCta({ name }: noLessonsCtaProps) {
  return (
    <div style={{ padding: 20, background: '#FFF9F0', borderRadius: 8 }}>
      <h3 style={{ margin: 0 }}>אין שיעורים קרובים כרגע.</h3>
      <p style={{ margin: '8px 0 0' }}>רק תזכורת: תוכל לתזמן שיעור חדש בעמוד המורים.</p>
    </div>
  );
}