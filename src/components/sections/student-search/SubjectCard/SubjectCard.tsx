import { useNavigate } from "react-router-dom";
import styles from "./SubjectCard.module.scss";

interface SubjectCardProps {
  slug: string;
  name: string;
  color: string;
}

export default function SubjectCard({ slug, name, color }: SubjectCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      data-slug={slug}
      style={{ backgroundColor: color }}
      onClick={() => navigate(`/student/subjects/${slug}`)}
    >
      <span className={styles.name}>{name}</span>
    </div>
  );
}
