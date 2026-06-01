"use client";

interface noLessonsCtaProps {
  name: string;
}

export default function noLessonsCta({ name }: noLessonsCtaProps) {
  return (
    <div>
      <h1>צהריים טובים, {name}</h1>
    </div>
  );
}