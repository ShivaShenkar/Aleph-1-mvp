import { notFound } from "next/navigation";
import NavBar from "@/components/sections/NavBar/NavBar";
import Footer from "@/components/sections/Footer/Footer";
import SubjectPage from "@/components/sections/subjects/SubjectPage/SubjectPage";

const subjectNameMap: Record<string, string> = {
  math: "מתמטיקה",
  english: "אנגלית",
  history: "היסטוריה",
  hebrew: "עברית",
  civics: "אזרחות",
  bible: "תנ״ך",
};

export default async function SubjectPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subjectName = subjectNameMap[slug];
  if (!subjectName) notFound();

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
