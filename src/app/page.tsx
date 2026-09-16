import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhatYouCanBuildSection } from "@/components/landing/WhatYouCanBuildSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-ink text-cream overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <WhatYouCanBuildSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
