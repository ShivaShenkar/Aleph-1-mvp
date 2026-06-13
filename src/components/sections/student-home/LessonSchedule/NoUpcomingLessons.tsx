import { useNavigate } from "react-router-dom";
import styles from "./NoUpcomingLessons.module.scss";

interface NoUpcomingLessonsProps {
  redirectTo?: string;
}

export default function NoUpcomingLessons({
  redirectTo = "/student/search",
}: NoUpcomingLessonsProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <img
        src="/png-jpg/Sad-child.png"
        alt=""
        className={styles.image}
        width={256}
        height={256}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>אין לך שיעורים בזמן הקרוב</h3>
        <button
          className={styles.button}
          onClick={() => navigate(redirectTo)}
        >
          לקביעת שיעור
        </button>
      </div>
    </div>
  );
}
