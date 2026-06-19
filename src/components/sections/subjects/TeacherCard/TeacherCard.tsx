import styles from "./TeacherCard.module.scss";
import DefaultAvatar from "@/components/ui/DefaultAvatar/DefaultAvatar";

interface TeacherCardProps {
  name: string;
  bio: string;
}

export default function TeacherCard({ name, bio }: TeacherCardProps) {
  return (
    <div className={styles.card}>
      <DefaultAvatar size="5rem" label="תמונה" />
      <div className={styles.contentArea}>
        <h4 className={styles.name}>{name}</h4>
        <p className={styles.bio}>{bio}</p>
      </div>
      {/* <button className={styles.bookButton}>לקביעת שיעור</button> */}
    </div>
  );
}
