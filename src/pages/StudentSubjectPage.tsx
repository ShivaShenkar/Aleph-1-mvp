import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAuthSession } from "aws-amplify/auth";
import StudentNavBar from "@/components/sections/StudentNavBar/StudentNavBar";
import Heading from "@/components/ui/Heading/Heading";
import TutorCard from "@/components/sections/student-subject/TutorCard/TutorCard";
import { subjects } from "@/lib/subjects";
import type { TutorProfile } from "@/types/tutor";
import styles from "./StudentSubjectPage.module.scss";

const LOCATIONS = [
  "הכל",
  "תל אביב",
  "ירושלים",
  "חיפה",
  "באר שבע",
  "רמת גן",
  "פתח תקווה",
  "חולון",
  "נתניה",
  "אשדוד",
];

const TYPES = [
  { value: "all", label: "הכל" },
  { value: "online", label: "אונליין" },
  { value: "in-person", label: "פרונטלי" },
];

const SORTS = [
  { value: "default", label: "ברירת מחדל" },
  { value: "price-asc", label: "מחיר: מהנמוך לגבוה" },
  { value: "price-desc", label: "מחיר: מהגבוה לנמוך" },
];

function getPriceRange(
  lessonTypes: TutorProfile["lessonTypes"],
): { min: number; max: number } | null {
  const prices = lessonTypes.map((lt) => lt.price).filter((p) => p > 0);
  if (!prices.length) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export default function StudentSubjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const subject = subjects.find((s) => s.slug === slug);

  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState("הכל");
  const [type, setType] = useState("all");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    if (!subject) return;
    setLoading(true);
    (async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken;
        if (!token) { setLoading(false); return; }
        const res = await fetch(
          `${import.meta.env.VITE_API_GATEWAY_URL}/tutors-by-subject?slug=${slug}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) {
          const data: TutorProfile[] = await res.json();
          setTutors(data);
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [subject, slug]);

  const filtered = useMemo(() => {
    let result = [...tutors];

    if (location !== "הכל") {
      result = result.filter(
        (t) => t.location?.includes(location),
      );
    }

    if (type !== "all") {
      result = result.filter((t) =>
        t.lessonTypes.some((lt) => lt.location === type),
      );
    }

    const min = priceMin ? Number(priceMin) : 0;
    const max = priceMax ? Number(priceMax) : Infinity;
    if (min > 0 || max < Infinity) {
      result = result.filter((t) => {
        const r = getPriceRange(t.lessonTypes);
        if (!r) return false;
        return r.max >= min && r.min <= max;
      });
    }

    if (sort === "price-asc") {
      result.sort(
        (a, b) =>
          (getPriceRange(a.lessonTypes)?.min ?? 0) -
          (getPriceRange(b.lessonTypes)?.min ?? 0),
      );
    } else if (sort === "price-desc") {
      result.sort(
        (a, b) =>
          (getPriceRange(b.lessonTypes)?.max ?? 0) -
          (getPriceRange(a.lessonTypes)?.max ?? 0),
      );
    }

    return result;
  }, [tutors, location, type, priceMin, priceMax, sort]);

  if (!subject) return null;

  return (
    <>
      <StudentNavBar />
      <main className={styles.page}>
        <div className={styles.headings}>
          <Heading level="h1" underline>
            {subject.name}
          </Heading>
          {!loading && (
            <p className={styles.subtitle}>
              נמצאו {filtered.length} מורים
            </p>
          )}
        </div>

        {!loading && tutors.length > 0 && (
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>מיקום</span>
              <select
                className={styles.filterSelect}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>מחיר מינימום</span>
              <input
                className={styles.filterInput}
                type="number"
                min="0"
                placeholder="₪0"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
            </div>

            <span className={styles.priceSeparator}>–</span>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>מחיר מקסימום</span>
              <input
                className={styles.filterInput}
                type="number"
                min="0"
                placeholder="₪∞"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>סוג שיעור</span>
              <select
                className={styles.filterSelect}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>מיין לפי</span>
              <select
                className={styles.filterSelect}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>טוען מורים...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>לא נמצאו מורים בתחום זה</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((tutor) => (
              <TutorCard
                key={tutor.userId}
                tutor={tutor}
                onClick={() =>
                  navigate(`/student/tutor-profile/${tutor.userId}`)
                }
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
