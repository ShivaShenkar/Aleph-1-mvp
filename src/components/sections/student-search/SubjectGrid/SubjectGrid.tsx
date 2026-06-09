import { useEffect } from "react";
import type { Subject } from "@/lib/subjects";
import SubjectCard from "../SubjectCard/SubjectCard";
import styles from "./SubjectGrid.module.scss";

interface SubjectGridProps {
  subjects: Subject[];
  searchValue: string;
}

export default function SubjectGrid({ subjects, searchValue }: SubjectGridProps) {
  useEffect(() => {
    const maxTilt = 15;
    const falloff = 600;
    const selector = "[data-slug]";

    let rafId: number | null = null;
    let latestX = 0;
    let latestY = 0;
    let ticking = false;

    function updateTilt() {
      const cards = document.querySelectorAll<HTMLDivElement>(selector);
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = latestX - centerX;
        const deltaY = latestY - centerY;

        const rotateY = Math.max(-maxTilt, Math.min(maxTilt, (deltaX / falloff) * maxTilt));
        const rotateX = Math.max(-maxTilt, Math.min(maxTilt, (-deltaY / falloff) * maxTilt));

        card.style.transform =
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
      ticking = false;
    }

    function handleMouseMove(e: MouseEvent) {
      latestX = e.clientX;
      latestY = e.clientY;
      if (!ticking) {
        rafId = requestAnimationFrame(updateTilt);
        ticking = true;
      }
    }

    function handleMouseLeaveDoc() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ticking = false;
      const cards = document.querySelectorAll<HTMLDivElement>(selector);
      for (const card of cards) {
        card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
      }
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeaveDoc);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeaveDoc);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const filtered = searchValue
    ? subjects.filter((s) => s.name.includes(searchValue))
    : subjects;

  return (
    <div className={styles.grid}>
      {filtered.map((s) => (
        <SubjectCard key={s.slug} slug={s.slug} name={s.name} color={s.color} />
      ))}
    </div>
  );
}
