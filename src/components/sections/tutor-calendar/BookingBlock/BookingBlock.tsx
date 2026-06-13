import type { CSSProperties } from "react";
import type { CalendarBlock } from "@/types/calendar";
import { subjects } from "@/lib/subjects";
import styles from "./BookingBlock.module.scss";

interface BookingBlockProps {
  block: CalendarBlock;
  style: CSSProperties;
  fading?: boolean;
  onSubjectClick: (blockId: string) => void;
  onBlockClick: (blockId: string, source: "saved" | "new") => void;
}

function formatDuration(mins: number): string {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h} שע' ${m} דק'` : `${h} שע'`;
  }
  return `${mins} דק'`;
}

export default function BookingBlock({
  block,
  style,
  fading,
  onSubjectClick,
  onBlockClick,
}: BookingBlockProps) {
  const subjectColor = block.subject
    ? subjects.find((s) => s.slug === block.subject)?.color || "#9ca3af"
    : "#9ca3af";

  const subjectName = block.subject
    ? subjects.find((s) => s.slug === block.subject)?.name || block.subject
    : null;

  return (
    <div
      className={`${styles.block} ${fading ? styles.fading : ""}`}
      style={{ ...style, borderLeftColor: subjectColor }}
      onClick={() => onBlockClick(block.id, block.source)}
    >
      <div className={styles.inner}>
        <span className={styles.title}>{block.title}</span>
        <span className={styles.price}>₪{block.price}</span>
        <span className={styles.duration}>
          {formatDuration(block.durationMinutes)}
        </span>
      </div>

      {subjectName ? (
        <span
          className={styles.subjectBadge}
          style={{ backgroundColor: subjectColor }}
        >
          {subjectName}
        </span>
      ) : (
        <button
          className={styles.subjectBtn}
          onClick={(e) => {
            e.stopPropagation();
            onSubjectClick(block.id);
          }}
        >
          נושא
        </button>
      )}
    </div>
  );
}
