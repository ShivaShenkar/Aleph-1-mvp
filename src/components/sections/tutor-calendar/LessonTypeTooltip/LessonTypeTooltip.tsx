import type { CSSProperties } from "react";
import type { LessonType } from "@/models/models";
import styles from "./LessonTypeTooltip.module.scss";

interface LessonTypeTooltipProps {
  style: CSSProperties;
  lessonTypes: LessonType[];
  onSelect: (lt: LessonType) => void;
}

function formatDuration(mins: number): string {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h} שע' ${m} דק'` : `${h} שע'`;
  }
  return `${mins} דק'`;
}

export default function LessonTypeTooltip({
  style,
  lessonTypes,
  onSelect,
}: LessonTypeTooltipProps) {
  if (lessonTypes.length === 0) {
    return (
      <div className={styles.wrapper} style={style} onClick={(e) => e.stopPropagation()}>
        <div className={styles.arrow} />
        <div className={styles.emptyText}>לא נמצאו סוגי שיעור</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} style={style} onClick={(e) => e.stopPropagation()}>
      <div className={styles.arrow} />
      <div className={styles.list}>
        {lessonTypes.map((lt) => (
          <button
            key={lt.LessonId}
            className={styles.card}
            onClick={() => onSelect(lt)}
          >
            <div className={styles.price}>₪{lt.price}</div>
            <div className={styles.details}>
              <span className={styles.name}>{lt.title}</span>
              <div className={styles.meta}>
                <span>{formatDuration(lt.durationMinutes)}</span>
                <span className={styles.locationBadge}>
                  {lt.location === "online" ? "אונליין" : "פרונטלי"}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
