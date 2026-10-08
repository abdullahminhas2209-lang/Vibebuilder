"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { PlanId, BillingCycle } from "@/lib/payment-service";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const billingParam = searchParams.get("billing");

  const initialPlan: PlanId =
    planParam === "starter" || planParam === "team" ? planParam : "pro";
  const initialBilling: BillingCycle =
    billingParam === "monthly" ? "monthly" : "annual";

  const [modalOpen, setModalOpen] = useState(true);

  // If user closes modal on the dedicated /checkout page, redirect back to #pricing
  function handleOpenChange(open: boolean) {
    setModalOpen(open);
    if (!open) {
      router.push("/#pricing");
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-ink text-cream">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="size-12 rounded-[4px] bg-amber/15 text-amber border border-amber/30 flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="font-serif text-3xl text-cream font-normal">
            Klyro AI Secure Checkout
          </h1>
          <p className="text-sm text-fog leading-relaxed">
            Opening your secure payment session for the{" "}
            <strong className="text-cream capitalize">{initialPlan} Plan</strong>...
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={() => setModalOpen(true)}
              className="rounded-[3px] bg-amber text-[#201404] hover:bg-amber-deep font-sans font-medium text-sm px-5 py-2 cursor-pointer shadow-xs"
            >
              Resume Checkout
            </Button>
            <Button
              variant="outline"
              asChild
              className="rounded-[3px] border-slate-line text-cream hover:bg-ink-raised font-sans text-sm"
            >
              <Link href="/#pricing">Return to Pricing</Link>
            </Button>
          </div>
        </div>

        <CheckoutModal
          open={modalOpen}
          onOpenChange={handleOpenChange}
          initialPlan={initialPlan}
          initialBillingCycle={initialBilling}
        />
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ink flex items-center justify-center text-fog font-mono text-xs">
          Loading checkout...
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
