import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";
import StudentNavBar from "@/components/sections/StudentNavBar/StudentNavBar";
import { subjects } from "@/lib/subjects";
import type { TutorProfile } from "@/types/tutor";
import styles from "./TutorProfilePage.module.scss";

const PLACEHOLDER_REVIEWS = [
  { stars: 5, name: "נועה לוי", text: "מורה מעולה! מסביר בצורה ברורה ומקצועית." },
  { stars: 4, name: "יוסי כהן", text: "שיעור מוצלח מאוד, ממליץ בחום." },
];

function fmtDuration(mins: number): string {
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h} שע' ${m} דק'` : `${h} שע'`;
  }
  return `${mins} דק'`;
}

function subjectColor(slug: string): string {
  return subjects.find((s) => s.slug === slug)?.color || "#ccc";
}

function subjectName(slug: string): string {
  return subjects.find((s) => s.slug === slug)?.name || slug;
}

export default function TutorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken;
        if (!token) { setLoading(false); return; }
        const res = await fetch(
          `${import.meta.env.VITE_API_GATEWAY_URL}/tutor-profile?userId=${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) {
          const data: TutorProfile = await res.json();
          setTutor(data);
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!tutor?.profilePic) return;
    getUrl({
      key: tutor.profilePic.replace(/^\//, ""),
      options: { accessLevel: "protected" },
    })
      .then((res) => setImgUrl(res.url.toString()))
      .catch(() => {});
  }, [tutor?.profilePic]);

  if (loading) {
    return (
      <>
        <StudentNavBar />
        <main className={styles.page}>
          <div className={styles.loading}>טוען פרטי מורה...</div>
        </main>
      </>
    );
  }

  if (!tutor) {
    return (
      <>
        <StudentNavBar />
        <main className={styles.page}>
          <div className={styles.loading}>לא נמצא מורה</div>
        </main>
      </>
    );
  }

  return (
    <>
      <StudentNavBar />
      <main className={styles.page}>
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← חזור
          </button>
        </div>

        <div className={styles.wrapper}>
          {/* Profile Header */}
          <div className={styles.header}>
            <div className={styles.avatar}>
              {imgUrl ? (
                <img src={imgUrl} alt="" className={styles.avatarImg} />
              ) : (
                <svg viewBox="0 0 80 80" className={styles.placeholderSvg}>
                  <circle cx="40" cy="28" r="14" fill="#fff" opacity="0.8" />
                  <ellipse cx="40" cy="60" rx="24" ry="18" fill="#fff" opacity="0.8" />
                </svg>
              )}
            </div>
            <div className={styles.headerInfo}>
              <h1 className={styles.name}>
                {tutor.firstName} {tutor.lastName}
              </h1>
              <p className={styles.subtitle}>
                {tutor.gender === "male"
                  ? "בן"
                  : tutor.gender === "female"
                    ? "בת"
                    : "בן/בת"}
                {tutor.location ? ` גיל, ${tutor.location}` : " גיל, מיקום"}
              </p>
              <div className={styles.rating}>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={i <= 4 ? "#00b4d8" : "#d1d5db"}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span className={styles.reviewCount}>(0 ביקורות)</span>
              </div>
            </div>
          </div>

          {/* Subject Badges */}
          <div className={styles.badges}>
            {tutor.subjects.map((slug) => (
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
            <div className={`${styles.bioBox} ${!tutor.bio ? styles.bioEmpty : ""}`}>
              {tutor.bio || "אין תיאור"}
            </div>
          </div>

          {/* Lesson Types */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              קבע שיעור עם {tutor.firstName}
            </h2>
            <div className={styles.lessonGrid}>
              {tutor.lessonTypes.map((lt) => (
                <div key={lt.LessonId} className={styles.lessonCard} onClick={() => navigate(`/student/book/${id}`)}>
                  <div className={styles.lessonPrice}>₪{lt.price}</div>
                  <div className={styles.lessonDetails}>
                    <span className={styles.lessonName}>{lt.title}</span>
                    <div className={styles.lessonMeta}>
                      <span className={styles.lessonDuration}>
                        {fmtDuration(lt.durationMinutes)}
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
              המלצות <span className={styles.reviewCountTitle}>(0)</span>
            </h2>
            <div className={styles.recommendations}>
              {PLACEHOLDER_REVIEWS.map((r, i) => (
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
      </main>
    </>
  );
}
