import { useAuthStore } from "@/store/authStore";
import styles from "./TutorPreview.module.scss";
import { subjects } from "@/lib/subjects";

interface LessonTypeDraft {
  LessonId: string;
  title: string;
  price: number;
  durationMinutes: number;
  maxStudents: number;
  location: "online" | "in-person";
}

interface TutorPreviewProps {
  gender: "male" | "female" | null;
  profilePicPreview: string | null;
  location: string;
  selectedSubjects: string[];
  bio: string;
  lessonTypes: LessonTypeDraft[];
}

function calcAge(birthdate: string): number | null {
  if (!birthdate) return null;
  const birth = new Date(birthdate);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default function TutorPreview({
  gender,
  profilePicPreview,
  location,
  selectedSubjects,
  bio,
  lessonTypes,
}: TutorPreviewProps) {
  const user = useAuthStore((s) => s.user);
  const name = user ? `${user.firstName} ${user.lastName}` : "שם המורה";
  const age = user ? calcAge(user.birthdate) : null;

  function subjectName(slug: string) {
    return subjects.find((s) => s.slug === slug)?.name || slug;
  }

  function subjectColor(slug: string) {
    return subjects.find((s) => s.slug === slug)?.color || "#ccc";
  }

  return (
    <div className={styles.preview}>
      {/* Profile Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          {profilePicPreview ? (
            <img src={profilePicPreview} alt="" className={styles.avatarImg} />
          ) : (
            <svg viewBox="0 0 80 80" className={styles.avatarPlaceholder}>
              <circle cx="40" cy="28" r="14" fill="#fff" opacity="0.8" />
              <ellipse cx="40" cy="60" rx="24" ry="18" fill="#fff" opacity="0.8" />
            </svg>
          )}
        </div>
        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.subtitle}>
            {gender === "male"
              ? `בן ${age ?? "גיל"}`
              : gender === "female"
                ? `בת ${age ?? "גיל"}`
                : `בן/בת ${age ?? "גיל"}`}
            {location ? `, ${location}` : ", מיקום"}
          </p>
          <div className={styles.rating}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={i <= 4 ? "#00b4d8" : "#d1d5db"}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className={styles.reviewCount}>(12 ביקורות)</span>
          </div>
        </div>
      </div>

      {/* Subject Badges */}
      <div className={styles.badges}>
        {selectedSubjects.map((slug) => (
          <span
            key={slug}
            className={styles.badge}
            style={{ backgroundColor: subjectColor(slug) }}
          >
            {subjectName(slug)}
          </span>
        ))}
      </div>

      {/* About Me */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>קצת עליי</h2>
        <div className={styles.bioBox}>
          {bio || "הוסף תיאור"}
        </div>
      </div>

      {/* Lesson Types */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          קבע שיעור עם {user?.firstName || "שם"}
        </h2>
        <div className={styles.lessonGrid}>
          {lessonTypes.map((lt) => (
            <div key={lt.LessonId} className={styles.lessonCard}>
              <div className={styles.lessonPrice}>
                ₪{lt.price}
              </div>
              <div className={styles.lessonDetails}>
                <span className={styles.lessonName}>{lt.title}</span>
                <div className={styles.lessonMeta}>
                  <span className={styles.lessonDuration}>
                    {lt.durationMinutes >= 60
                      ? `${Math.floor(lt.durationMinutes / 60)} שע' ${lt.durationMinutes % 60} דק'`
                      : `${lt.durationMinutes} דק'`}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#f8f9fa">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                  </span>
                  <span className={styles.lessonParticipants}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#f8f9fa">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                    {lt.maxStudents}
                  </span>
                  <span className={styles.lessonLocation}>
                    {lt.location === "online" ? "אונליין" : "פרונטלי"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          המלצות <span className={styles.reviewCountTitle}>(12)</span>
        </h2>
        <div className={styles.recommendations}>
          {[
            { stars: 5, name: "נועה לוי", text: "מורה מעולה! מסביר בצורה ברורה ומקצועית." },
            { stars: 4, name: "יוסי כהן", text: "שיעור מוצלח מאוד, ממליץ בחום." },
          ].map((r, i) => (
            <div key={i} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= r.stars ? "#00b4d8" : "#d1d5db"}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <div className={styles.reviewAuthor}>
                  <span className={styles.reviewAuthorName}>{r.name}</span>
                  <svg width="28" height="28" viewBox="0 0 50 50" fill="#9ca3af">
                    <circle cx="25" cy="18" r="9" />
                    <ellipse cx="25" cy="38" rx="16" ry="12" />
                  </svg>
                </div>
              </div>
              <p className={styles.reviewText}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
