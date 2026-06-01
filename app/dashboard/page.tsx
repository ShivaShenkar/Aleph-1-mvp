"use client";

// ייבוא הרכיבים החדשים מהתיקייה שיצרת בתוך components
import WelcomeHeader from "@/components/sections/studentHomePage/welcomeHeader";
import UpcomingLessons from "@/components/sections/studentHomePage/upcomingLessons";
import NoLessonsCta from "@/components/sections/studentHomePage/noLessonsCta";
import LessonsHistory from "@/components/sections/studentHomePage/lessonsHistory";
import NavBar from "@/components/sections/NavBar/NavBar";
import Footer from "@/components/sections/Footer/Footer";

export default function StudentDashboardPage() {
  const studentName = "ליאור";

  return (
    <>
      <NavBar />
      <main style={styles.dashboardContainer}>
        {/* 1. כותרת ברוכים הבאים */}
        <WelcomeHeader name={studentName} />
        
        {/* 2. שיעורים קרובים */}
        <UpcomingLessons />
        
        {/* 3. באנר קריאה לפעולה (אין שיעורים קרובים) */}
        <NoLessonsCta name={studentName} />
        
        {/* 4. היסטוריית שיעורים מוקלטים */}
        <LessonsHistory name={studentName} />
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