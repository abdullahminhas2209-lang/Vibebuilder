import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TemplatesSection } from "@/components/landing/TemplatesSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0B0F19] text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <TemplatesSection />
      </main>
      <Footer />
    </div>
  );
}
