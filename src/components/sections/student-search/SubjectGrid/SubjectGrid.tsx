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

    function handleMouseMove(e: MouseEvent) {
      const cards = document.querySelectorAll<HTMLDivElement>(selector);

      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        const rotateY = Math.max(-maxTilt, Math.min(maxTilt, (deltaX / falloff) * maxTilt));
        const rotateX = Math.max(-maxTilt, Math.min(maxTilt, (-deltaY / falloff) * maxTilt));

        card.style.transform =
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }
    }

    function handleMouseLeaveDoc() {
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
