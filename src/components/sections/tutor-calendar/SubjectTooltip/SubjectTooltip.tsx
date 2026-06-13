import { subjects } from "@/lib/subjects";
import styles from "./SubjectTooltip.module.scss";

interface SubjectTooltipProps {
  tutorSubjects: string[];
  onSelect: (subject: string) => void;
  onClose: () => void;
}

export default function SubjectTooltip({
  tutorSubjects,
  onSelect,
  onClose,
}: SubjectTooltipProps) {
  const available = subjects.filter((s) => tutorSubjects.includes(s.slug));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <p className={styles.title}>בחר נושא</p>
        <div className={styles.grid}>
          {available.map((s) => (
            <button
              key={s.slug}
              className={styles.chip}
              style={{ backgroundColor: s.color }}
              onClick={() => onSelect(s.slug)}
            >
              {s.name}
            </button>
          ))}
        </div>
        {available.length === 0 && (
          <p className={styles.empty}>לא נמצאו נושאים</p>
        )}
      </div>
    </div>
  );
}
