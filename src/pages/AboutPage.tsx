import NavBar from "@/components/sections/NavBar/NavBar";
import MissionSection from "@/components/sections/MissionSection/MissionSection";
import ValuesSection from "@/components/sections/ValuesSection/ValuesSection";
import AboutCtaSection from "@/components/sections/AboutCtaSection/AboutCtaSection";
import Footer from "@/components/sections/Footer/Footer";

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <main>
        <MissionSection />
        <ValuesSection />
        <AboutCtaSection />
      </main>
      <Footer />
    </>
  );
}

