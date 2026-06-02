import { useParams } from "react-router-dom";
import NavBar from "@/components/sections/NavBar/NavBar";
import Footer from "@/components/sections/Footer/Footer";
import SubjectPage from "@/components/sections/subjects/SubjectPage/SubjectPage";
import HomePage from "./HomePage";

const subjectNameMap: Record<string, string> = {
  math: "מתמטיקה",
  english: "אנגלית",
  history: "היסטוריה",
  hebrew: "עברית",
  civics: "אזרחות",
  bible: "תנ״ך",
};

export default function SubjectPageRoute() {
  const { slug } = useParams<{ slug: string }>();

  
  const subjectName = slug ? subjectNameMap[slug] : null;
  
  if (!subjectName) {
    return <HomePage />
  }

  return (
    <>
      <NavBar />
      <main>
        <SubjectPage subjectName={subjectName} />
      </main>
      <Footer />
    </>
  );
}
