"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NavBar from "@/components/sections/NavBar/NavBar";
import Footer from "@/components/sections/Footer/Footer";

interface TutorProfile {
  name: string;
  about?: string;
  email?: string;
  // תוכל להוסיף שדות מחיר אם יש לכם בדיינמו, או להשאיר סטטי כרגע
}

interface Review {
  SK: string;
  reviewerName: string;
  rating: number;
  comment: string;
}

export default function TutorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const tutorId = params.id as string;

  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTutorData() {
      try {
        const res = await fetch(`/api/tutor/profile?tutorId=${tutorId}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setReviews(data.reviews);
        }
      } catch (err) {
        console.error("Failed to load tutor data", err);
      } finally {
        setLoading(false);
      }
    }
    if (tutorId) fetchTutorData();
  }, [tutorId]);

  if (loading) return <div style={{ direction: "rtl", padding: "40px", textAlign: "center" }}>טוען פרופיל מורה...</div>;
  if (!profile) return <div style={{ direction: "rtl", padding: "40px", textAlign: "center" }}>מורה לא נמצא במערכת.</div>;

  // המלצות דאמי במידה והטבלה עדיין ריקה מביקורות - כדי שהעיצוב היפה שלך יוצג מיד!
  const displayReviews = reviews.length > 0 ? reviews : [
    { SK: "1", reviewerName: "שלמה ארצי", rating: 5, comment: "מורה מצוין! הסביר בסבלנות." },
    { SK: "2", reviewerName: "אנונימי", rating: 2, comment: "פחות התחברתי לסגנון." },
    { SK: "3", reviewerName: "שלמה ארצי", rating: 5, comment: "מורה מצוין! מומלץ בחום!" },
    { SK: "4", reviewerName: "אנונימי", rating: 2, comment: "פחות התחברתי..." },
  ];

  return (
    <>
      <NavBar />
      <main style={{ direction: "rtl", backgroundColor: "#F8FAFC", padding: "40px 20px", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* 1. אזור עליון - אווטאר ושם המורה */}
        <div style={styles.headerSection}>
          <div style={styles.avatar}>👤</div>
          <h1 style={styles.tutorName}>{profile.name}</h1>
          <div style={styles.ratingSummary}>⭐ ⭐ ⭐ ⭐ ⭐ <span style={{ color: "#718096", fontSize: "14px" }}>(12 ביקורות)</span></div>
          <div style={styles.tagsContainer}>
            <span style={{ ...styles.tag, backgroundColor: "#E2E8F0", color: "#4A5568" }}>פיזיקה</span>
            <span style={{ ...styles.tag, backgroundColor: "#EBF8FF", color: "#2B6CB0" }}>מתמטיקה</span>
          </div>
        </div>

        {/* 2. קצת עליי */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>קצת עליי</h3>
          <p style={styles.cardText}>
            {profile.about || "הלימוד הילד הנורם ומתקופה קבועים החינוכית המקצוע המורה המבין. נמצא תלמידיו פעיל ספר נוספים לחינוך המערכת לתקופה המורה לרוב. וטכניקת התייחסותו הלמידה והחברתי משמעותיים משתנה חלק במסגרת לכל החינוך, המושפעים מידת הדור המורה סביבת תלמיד הראשונים אישיים המשפחה הלמידה."}
          </p>
        </section>

        {/* 3. קבע שיעור עם... */}
        <h3 style={styles.sectionTitle}>קבע שיעור עם {profile.name}</h3>
        <div style={styles.pricingGrid}>
          <div style={styles.priceCard}>
            <span style={styles.priceAmount}>90 ₪</span>
            <div style={styles.priceInfo}>
              <span style={styles.priceType}>שיעור קבוצתי</span>
              <span style={styles.priceDetails}>👥 5 | 🕒 45 דק'</span>
            </div>
          </div>

          <div style={styles.priceCard}>
            <span style={styles.priceAmount}>120 ₪</span>
            <div style={styles.priceInfo}>
              <span style={styles.priceType}>שיעור פרטי</span>
              <span style={styles.priceDetails}>👤 1 | 🕒 שעה אחת</span>
            </div>
          </div>
        </div>

        {/* 4. המלצות */}
        <h3 style={styles.sectionTitle}>המלצות ({displayReviews.length})</h3>
        <div style={styles.reviewsGrid}>
          {displayReviews.map((review) => (
            <div key={review.SK} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <span style={styles.reviewerName}>{review.reviewerName}</span>
                <span style={styles.reviewStars}>{"⭐".repeat(review.rating)}</span>
              </div>
              <p style={styles.reviewComment}>"{review.comment}"</p>
            </div>
          ))}
        </div>

      </main>
      <Footer />
    </>
  );
}

// 🎨 אובייקט הסטייל התואם לעיצוב שבצילום המסך
const styles: Record<string, React.CSSProperties> = {
  headerSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
  },
  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "#00B4D8",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "45px",
    marginBottom: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  tutorName: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#0A192F",
    margin: "5px 0",
  },
  ratingSummary: {
    fontSize: "16px",
    marginBottom: "12px",
  },
  tagsContainer: {
    display: "flex",
    gap: "8px",
  },
  tag: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    padding: "25px",
    maxWidth: "700px",
    width: "100%",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    marginBottom: "35px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#0A192F",
    marginBottom: "10px",
  },
  cardText: {
    fontSize: "15px",
    color: "#4A5568",
    lineHeight: "1.6",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#0A192F",
    alignSelf: "flex-start",
    maxWidth: "700px",
    width: "100%",
    margin: "20px auto 15px auto",
  },
  pricingGrid: {
    display: "flex",
    gap: "20px",
    maxWidth: "700px",
    width: "100%",
    marginBottom: "35px",
  },
  priceCard: {
    flex: 1,
    backgroundColor: "#0A192F", // כחול כהה עמוק כמו בעיצוב
    color: "#fff",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceAmount: {
    fontSize: "26px",
    fontWeight: "bold",
  },
  priceInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
  },
  priceType: {
    fontSize: "15px",
    fontWeight: "bold",
  },
  priceDetails: {
    fontSize: "13px",
    color: "#CBD5E0",
  },
  reviewsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    maxWidth: "700px",
    width: "100%",
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    border: "1px solid #E2E8F0",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewerName: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#0A192F",
  },
  reviewStars: {
    fontSize: "12px",
  },
  reviewComment: {
    fontSize: "13px",
    color: "#718096",
    fontStyle: "italic",
    margin: "0",
  },
};