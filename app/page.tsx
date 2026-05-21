import NavBar from "@/components/sections/NavBar/NavBar";
import HeroSection from "@/components/sections/HeroSection/HeroSection";
import SubjectsSection from "@/components/sections/SubjectsSection/SubjectsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection/HowItWorksSection";
import BottomCtaSection from "@/components/sections/BottomCtaSection/BottomCtaSection";
import Footer from "@/components/sections/Footer/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <SubjectsSection />
        <HowItWorksSection />
        <BottomCtaSection />
      </main>
      <Footer />
    </>
  );
}
