import NavBar from "@/components/sections/NavBar/NavBar";
import HeroSection from "@/components/sections/HeroSection/HeroSection";
import SubjectsSection from "@/components/sections/SubjectsSection/SubjectsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection/HowItWorksSection";
import Footer from "@/components/sections/Footer/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <SubjectsSection />
        <HowItWorksSection />
        
      </main>
      <Footer />
    </>
  );
}

const SUBJECTS_DATA = [
  { id: "math", name: "מתמטיקה", icon: "📐", bgColor: "#EBF8FF", iconColor: "#2B6CB0" },
  { id: "english", name: "אנגלית", icon: "🇬🇧", bgColor: "#F7FAFC", iconColor: "#4A5568" },
  { id: "history", name: "היסטוריה", icon: "📜", bgColor: "#FEF3C7", iconColor: "#D97706" },
  { id: "hebrew", name: "עברית", icon: "✍️", bgColor: "#E6FFFA", iconColor: "#319795" },
  { id: "civics", name: "אזרחות", icon: "🏛️", bgColor: "#ECEFFF", color: "#4C51BF" },
  { id: "bible", name: "תנ\"ך", icon: "⚱️", bgColor: "#FFF5F5", iconColor: "#E53E3E" },
];


const pageStyles = {
  container: {
    padding: "60px 20px",
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    direction: "rtl" as const,
  },
  mainTitle: {
    fontSize: "26px",
    fontWeight: "bold" as const,
    color: "#0A192F",
    margin: "0 0 8px 0",
    textAlign: "center" as const,
  },
  underline: {
    width: "80px",
    height: "3px",
    backgroundColor: "#0A192F",
    marginBottom: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "30px",
    maxWidth: "1000px",
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
  },
  iconCircle: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  },
  subjectName: {
    fontSize: "18px",
    fontWeight: "bold" as const,
    color: "#00B4D8", // צבע הכותרת הכחול מהעיצוב המקור שלך
    margin: "0",
  },
};


<div style={pageStyles.container}>
  <h2 style={pageStyles.mainTitle}>בחר נושא לימוד</h2>
  <div style={pageStyles.underline} />

  <div style={pageStyles.grid}>
    {SUBJECTS_DATA.map((subject) => (
      <div key={subject.id} style={pageStyles.card} className="subject-card">
        {/* העיגול המרכזי - מעוצב לפי צבעי המקצוע */}
        <div 
          style={{
            ...pageStyles.iconCircle,
            backgroundColor: subject.bgColor,
          }}
        >
          <span style={{ fontSize: "40px" }}>{subject.icon}</span>
        </div>
        
        {/* שם המקצוע */}
        <h3 style={pageStyles.subjectName}>{subject.name}</h3>
      </div>
    ))}
  </div>
</div>