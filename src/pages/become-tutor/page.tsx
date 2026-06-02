import NavBar from "@/components/sections/NavBar/NavBar";
import Footer from "@/components/sections/Footer/Footer";
import HeroSection from "@/components/sections/become-tutor/HeroSection/HeroSection";
import StatsBar from "@/components/sections/become-tutor/StatsBar/StatsBar";
import BenefitsSection from "@/components/sections/become-tutor/BenefitsSection/BenefitsSection";
import TutorHowItWorksSection from "@/components/sections/become-tutor/TutorHowItWorksSection/TutorHowItWorksSection";
import FaqSection from "@/components/sections/become-tutor/FaqSection/FaqSection";
import CtaSection from "@/components/sections/become-tutor/CtaSection/CtaSection";

export default function BecomeTutorPage() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <StatsBar />
        <BenefitsSection />
        <TutorHowItWorksSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
