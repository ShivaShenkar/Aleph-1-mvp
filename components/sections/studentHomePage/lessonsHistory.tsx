"use client";

interface lessonsHistoryProps {
  name: string;
}

export default function lessonsHistory({ name }: lessonsHistoryProps) {
  return (
    <div>
      <h1>צהריים טובים, {name}</h1>
    </div>
  );
}