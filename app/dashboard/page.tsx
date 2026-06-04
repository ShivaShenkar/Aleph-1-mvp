"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // או "next/navigation"
import { getCurrentUser } from "@aws-amplify/auth";

import WelcomeHeader from "@/components/sections/studentHomePage/welcomeHeader";
import UpcomingLessons from "@/components/sections/studentHomePage/upcomingLessons";
import NoLessonsCta from "@/components/sections/studentHomePage/noLessonsCta";
import LessonsHistory from "@/components/sections/studentHomePage/lessonsHistory";
import NavBar from "@/components/sections/NavBar/NavBar";
import Footer from "@/components/sections/Footer/Footer";

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]); // State חדש לשמירת השיעורים
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


  useEffect(() => {
    const fetchUserDataAndLessons = async () => {
      try {
        const cognitoUser = await getCurrentUser();
        if (!cognitoUser) {
          router.push("/login");
          return;
        }

        // 1. שליפת פרופיל משתמש
        const profileRes = await fetch(`/api/user/profile?userId=${cognitoUser.userId}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.role === "tutor") {
            router.push("/dashboard/tutor");
            return;
          }
          setProfile(profileData);
        }

        // 2. שליפת שיעורי המשתמש מתוך ה-API החדש שיצרנו
        const lessonsRes = await fetch(`/api/lessons?userId=${cognitoUser.userId}`);
        if (lessonsRes.ok) {
          const lessonsData = await lessonsRes.json();
          setLessons(lessonsData);
        }

      } catch (err) {
        console.error("Error fetching dashboard data", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndLessons();
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", direction: "rtl" }}>
        <h3>טוען נתונים מהמערכת...</h3>
      </div>
    );
  }

  const studentName = profile?.name || "סטודנט";

  // סינון השיעורים הקרובים לפי הסטטוס, ובנוסף לפי המקצוע שנבחר!
  const upcoming = lessons.filter(lesson => {
    // const isScheduled = lesson.status === "scheduled";
    // const isBookedByMe =lesson.status === "booked" && lesson.studentId === profile.userId;

    // if (!isScheduled && !isBookedByMe) return false;
    // if(!selectedCategory ) return true; // אם לא נבחר מקצוע, מציגים את כל השיעורים הקרובים

    // // ניקוי משתנים לטובת השוואה בטוחה בלי בעיות רווחים או אותיות
    // const lessonSubject = String(lesson.subject || "").trim();
    // const currentCategory = String(selectedCategory).trim();

    // return lessonSubject.includes(currentCategory) || currentCategory.includes(lessonSubject);

    // מציגים כל שיעור שהוא לא "completed"
    if (lesson.status === "completed") return false;
    
    if (!selectedCategory) return true; // אם לא נבחר מקצוע, מציגים הכל

    const lessonSubject = String(lesson.subject || "").trim();
    const currentCategory = String(selectedCategory).trim();

    return lessonSubject.includes(currentCategory) || currentCategory.includes(lessonSubject);

  });
  // פיצול השיעורים בין "קרובים" (עתידיים) לבין "היסטוריה" (בעבר או מוקלטים) לפי שדה הסטטוס או תאריך
  
  const history = lessons.filter(lesson => lesson.status === "completed");

  return (
    <>
      <NavBar />
      <main style={styles.dashboardContainer}>
        <WelcomeHeader name={studentName} />
        
        {/* 1. כרטיסיות נושאי הלימוד לבחירה */}
        <section>
          <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px", color: "#0A192F" }}>
            בחר נושא לימוד:
          </h3>
          <div style={{ display: "flex", gap: "15px" }}>
            {["מתמטיקה", "מדעי המחשב", "פיזיקה"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                style={{
                  padding: "15px 25px",
                  borderRadius: "10px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: selectedCategory === cat ? "#1D2D50" : "#fff",
                  color: selectedCategory === cat ? "#fff" : "#0A192F",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                  transition: "all 0.2s"
                }}
              >
                📚 {cat}
              </button>
            ))}
          </div>
        </section>

        {/* 2. רכיב השיעורים הקרובים - יציג רק אם נבחר מקצוע ויש בו שיעורים */}
        {selectedCategory && upcoming.length > 0 ? (
          //<UpcomingLessons lessons={upcoming} />
          <UpcomingLessons lessons={upcoming} studentId={profile?.userId || ""} />
        ) : selectedCategory ? (
          <div style={{ padding: "20px", backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px dashed #E2E8F0" }}>
            <p style={{ color: "#718096", margin: 0 }}>אין שיעורים קרובים בנושא {selectedCategory}.</p>
          </div>
        ) : null}
        
        {upcoming.length === 0 && !selectedCategory && <NoLessonsCta name={studentName} />}
        
        <LessonsHistory lessons={history} />
      </main>
      <Footer />
    </>
  );
}

const styles = {
  dashboardContainer: {
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    direction: "rtl" as const,
    display: "flex",
    flexDirection: "column" as const,
    gap: "40px",
  },
};