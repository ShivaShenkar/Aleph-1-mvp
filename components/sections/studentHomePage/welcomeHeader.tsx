"use client";

interface WelcomeHeaderProps {
  name: string;
}

export default function WelcomeHeader({ name }: WelcomeHeaderProps) {
  return (
    <div>
      <h1>צהריים טובים, {name}</h1>
    </div>
  );
}