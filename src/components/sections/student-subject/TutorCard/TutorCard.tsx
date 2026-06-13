import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage";
import { subjects } from "@/lib/subjects";
import type { TutorProfile } from "@/types/tutor";
import styles from "./TutorCard.module.scss";

interface TutorCardProps {
  tutor: TutorProfile;
  onClick: () => void;
}

function getPriceRange(
  lessonTypes: TutorProfile["lessonTypes"],
): { min: number; max: number } | null {
  const prices = lessonTypes.map((lt) => lt.price).filter((p) => p > 0);
  if (!prices.length) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export default function TutorCard({ tutor, onClick }: TutorCardProps) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!tutor.profilePic) return;
    getUrl({
      key: tutor.profilePic.replace(/^\//, ""),
      options: { accessLevel: "protected" },
    })
      .then((res) => setImgUrl(res.url.toString()))
      .catch(() => {});
  }, [tutor.profilePic]);

  const range = getPriceRange(tutor.lessonTypes);
  const initials = `${tutor.firstName.charAt(0)}${tutor.lastName.charAt(0)}`;
  const tutorSubjects = subjects.filter((s) =>
    tutor.subjects.includes(s.slug),
  );

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.avatar}>
        {imgUrl ? (
          <img src={imgUrl} alt="" className={styles.avatarImg} />
        ) : (
          <span className={styles.avatarPlaceholder}>{initials}</span>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>
            {tutor.firstName} {tutor.lastName}
          </span>
          <div className={styles.badges}>
            {tutorSubjects.slice(0, 3).map((s) => (
              <span
                key={s.slug}
                className={styles.badge}
                style={{ backgroundColor: s.color }}
              >
                {s.name}
              </span>
            ))}
            {tutorSubjects.length > 3 && (
              <span className={styles.badge} style={{ backgroundColor: "#d1d5db" }}>
                +{tutorSubjects.length - 3}
              </span>
            )}
          </div>
        </div>

        <p className={styles.bio}>
          {tutor.bio || "אין תיאור"}
        </p>

        <div className={styles.footer}>
          <span className={styles.location}>
            {tutor.location || "מיקום לא צוין"}
          </span>
          {range && (
            <span className={styles.price}>
              ₪{range.min}{range.max > range.min ? `–${range.max}` : ""} לשעה
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
