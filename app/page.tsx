import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import Curriculum from "@/components/Curriculum";
import Proof from "@/components/Proof";
import ValueStack from "@/components/ValueStack";
import Pricing from "@/components/Pricing";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <Curriculum />
        <Proof />
        <ValueStack />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
