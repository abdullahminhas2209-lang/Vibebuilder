"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Building2,
  Upload,
  CheckCircle2,
  FileCheck2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Trash2,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PlanId,
  BillingCycle,
  PaymentMethodType,
  CardPaymentInput,
  BankTransferInput,
  PaymentProcessingResult,
  BANK_TRANSFER_DETAILS,
  getPlanCheckoutDetails,
  generateBankTransferReference,
  formatCardNumber,
  formatExpiry,
  formatCvv,
  detectCardBrand,
  validateCardDetails,
  validateBankTransferDetails,
  processCardPayment,
  processBankTransfer,
} from "@/lib/payment-service";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlan?: PlanId;
  initialBillingCycle?: BillingCycle;
  onSuccess?: (result: PaymentProcessingResult) => void;
}

export function CheckoutModal({
  open,
  onOpenChange,
  initialPlan = "pro",
  initialBillingCycle = "annual",
  onSuccess,
}: CheckoutModalProps) {
  const router = useRouter();

  // Core state
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initialBillingCycle);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("card");

  // Step state: "form" | "processing" | "success" | "submitted"
  const [step, setStep] = useState<"form" | "processing" | "success" | "submitted">("form");
  const [processingMessage, setProcessingMessage] = useState("Securing connection...");
  const [paymentResult, setPaymentResult] = useState<PaymentProcessingResult | null>(null);

  // Card form state
  const [cardForm, setCardForm] = useState<CardPaymentInput>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardholderName: "",
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  // Bank transfer state
  const [bankReference, setBankReference] = useState("");
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [bankFilePreview, setBankFilePreview] = useState<string | null>(null);
  const [bankErrors, setBankErrors] = useState<Record<string, string>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedPlan(initialPlan);
      setBillingCycle(initialBillingCycle);
      setPaymentMethod("card");
      setStep("form");
      setPaymentResult(null);
      setCardErrors({});
      setBankErrors({});
      setBankReference(generateBankTransferReference(initialPlan));
    }
  }, [open, initialPlan, initialBillingCycle]);

  // Dynamic calculated details
  const planDetails = getPlanCheckoutDetails(selectedPlan, billingCycle);
  const cardBrand = detectCardBrand(cardForm.cardNumber);

  // 1. handlePlanSelection(): change active plan or billing frequency
  function handlePlanSelection(planId: PlanId, cycle?: BillingCycle) {
    setSelectedPlan(planId);
    if (cycle) setBillingCycle(cycle);
    setBankReference(generateBankTransferReference(planId));
  }

  // 2. handlePaymentMethodChange(): switch between card and bank transfer
  function handlePaymentMethodChange(method: PaymentMethodType) {
    setPaymentMethod(method);
    setCardErrors({});
    setBankErrors({});
  }

  // 3. handleCardPayment(): process card transaction
  async function handleCardPayment(e: React.FormEvent) {
    e.preventDefault();
    setCardErrors({});

    const validation = validateCardDetails(cardForm);
    if (!validation.isValid) {
      setCardErrors(validation.errors);
      return;
    }

    setStep("processing");
    setProcessingMessage("Encrypting payment credentials...");

    try {
      setTimeout(() => setProcessingMessage("Processing card authorization..."), 500);

      const result = await processCardPayment(cardForm, selectedPlan, billingCycle);
      handlePaymentSuccess(result);
    } catch (err: unknown) {
      setStep("form");
      const msg = err instanceof Error ? err.message : "Payment processing failed. Please try again.";
      setCardErrors({ general: msg });
    }
  }

  // 4. handleBankTransfer(): process bank proof submission
  async function handleBankTransfer(e: React.FormEvent) {
    e.preventDefault();
    setBankErrors({});

    const transferInput: BankTransferInput = {
      reference: bankReference,
      proofFile: bankFile,
      proofFileName: bankFile ? bankFile.name : "",
      proofFileSize: bankFile ? bankFile.size : 0,
    };

    const validation = validateBankTransferDetails(transferInput);
    if (!validation.isValid) {
      setBankErrors(validation.errors);
      return;
    }

    setStep("processing");
    setProcessingMessage("Uploading receipt screenshot...");

    try {
      setTimeout(() => setProcessingMessage("Registering payment verification ticket..."), 450);

      const result = await processBankTransfer(transferInput, selectedPlan, billingCycle);
      setPaymentResult(result);
      setStep("submitted");
      if (onSuccess) onSuccess(result);
    } catch (err: unknown) {
      setStep("form");
      const msg = err instanceof Error ? err.message : "Failed to submit payment proof.";
      setBankErrors({ general: msg });
    }
  }

  // 5. handlePaymentSuccess(): transition to confirmation state
  function handlePaymentSuccess(result: PaymentProcessingResult) {
    setPaymentResult(result);
    setStep("success");
    if (onSuccess) onSuccess(result);
  }

  // File drop & select handling
  function handleFileSelected(file: File) {
    setBankFile(file);
    setBankErrors({});
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setBankFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setBankFilePreview(null);
    }
  }

  function handleDropFile(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  }

  function handleCopy(text: string, fieldName: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  }

  function handleCompleteAndRedirect() {
    onOpenChange(false);
    router.push("/dashboard");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-1.5rem)] sm:max-w-3xl lg:max-w-4xl p-0 overflow-hidden bg-ink border-slate-line text-cream shadow-2xl rounded-md max-h-[92vh] flex flex-col">
        {/* ========================================================================= */}
        {/* MODAL HEADER: "Complete Your Purchase"                                    */}
        {/* ========================================================================= */}
        <DialogHeader className="px-6 py-5 sm:px-8 border-b border-slate-line bg-ink-raised/60 text-left shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-amber font-medium">
                  Checkout
                </span>
                <span className="text-fog-dim font-mono text-xs select-none">•</span>
                <span className="text-fog-dim text-xs font-mono">256-bit Encrypted</span>
              </div>
              <DialogTitle className="font-serif font-normal text-2xl sm:text-3xl tracking-tight text-cream">
                Complete Your Purchase
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-fog mt-1">
                Review your plan selection, choose your payment method, and confirm your order.
              </DialogDescription>
            </div>

            {/* Plan switcher chips in header */}
            <div className="flex items-center gap-1.5 self-start sm:self-center bg-ink border border-slate-line p-1 rounded-[3px]">
              {(["starter", "pro", "team"] as PlanId[]).map((pid) => (
                <button
                  key={pid}
                  type="button"
                  disabled={step !== "form"}
                  onClick={() => handlePlanSelection(pid)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-mono rounded-[2px] transition-all cursor-pointer uppercase",
                    selectedPlan === pid
                      ? "bg-amber text-[#201404] font-semibold shadow-xs"
                      : "text-fog hover:text-cream"
                  )}
                >
                  {pid}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* ========================================================================= */}
        {/* BODY CONTENT: 2 COLUMNS (Form on Left, Order Summary on Right)            */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 lg:p-8">
          {/* STATE: PROCESSING SPINNER */}
          {step === "processing" && (
            <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center">
              <div className="size-14 rounded-full border-2 border-amber/30 border-t-amber animate-spin flex items-center justify-center mb-5" />
              <h3 className="font-serif text-2xl text-cream font-normal mb-2">
                Processing Payment...
              </h3>
              <p className="text-sm font-sans text-fog max-w-sm mb-4">
                {processingMessage}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[3px] bg-ink-raised border border-slate-line font-mono text-xs text-fog-dim">
                <Lock className="size-3 text-amber" />
                <span>Please do not close or refresh this window</span>
              </div>
            </div>
          )}

          {/* STATE: CARD PAYMENT SUCCESS */}
          {step === "success" && (
            <div className="py-10 sm:py-16 max-w-lg mx-auto text-center">
              <div className="size-16 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <CheckCircle2 className="size-8" />
              </div>

              <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-medium block mb-1">
                Payment Successful
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-cream font-normal mb-3">
                Your Klyro AI plan has been activated.
              </h3>
              <p className="text-sm text-fog mb-6 leading-relaxed">
                Welcome to <strong className="text-cream">{planDetails.name}</strong> ({planDetails.billingFrequencyLabel}). 
                You now have full access to unlimited app generations and full Next.js project export.
              </p>

              {/* Explicit Honest Prototype Notice */}
              <div className="mb-8 p-4 rounded-[4px] border border-amber/30 bg-amber/[0.06] text-left">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="size-5 text-amber shrink-0 mt-0.5" />
                  <div className="text-xs text-cream/90 space-y-1">
                    <p className="font-semibold text-amber font-mono text-[11px] uppercase tracking-wide">
                      Test Mode / Sandbox Prototype Notice
                    </p>
                    <p className="text-fog leading-relaxed">
                      This checkout prototype simulated the card charge safely. No actual debit occurred. Your workspace session has been upgraded to test all {planDetails.name} features.
                    </p>
                    {paymentResult && (
                      <p className="font-mono text-[11px] text-fog-dim pt-1 border-t border-slate-line/50">
                        Transaction ID: {paymentResult.transactionId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={handleCompleteAndRedirect}
                  className="w-full sm:w-auto px-7 py-2.5 rounded-[3px] bg-amber text-[#201404] hover:bg-amber-deep font-sans font-semibold text-sm transition-colors cursor-pointer"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-[3px] border-slate-line text-cream hover:bg-ink-raised font-sans text-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* STATE: BANK TRANSFER SUBMITTED */}
          {step === "submitted" && (
            <div className="py-10 sm:py-16 max-w-lg mx-auto text-center">
              <div className="size-16 rounded-full bg-amber/15 text-amber border border-amber/30 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <FileCheck2 className="size-8" />
              </div>

              <span className="font-mono text-xs uppercase tracking-wider text-amber font-medium block mb-1">
                Payment Submitted
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-cream font-normal mb-3">
                Your payment proof has been submitted and will be reviewed.
              </h3>
              <p className="text-sm text-fog mb-6 leading-relaxed">
                Thank you. Our finance team will verify your receipt and provision your 
                <strong className="text-cream"> {planDetails.name}</strong> workspace within 1–2 business hours.
              </p>

              {/* Details card */}
              <div className="mb-8 p-4 rounded-[4px] border border-slate-line bg-ink-raised text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center text-fog">
                  <span>Payment Reference:</span>
                  <span className="text-cream font-bold text-amber">{bankReference}</span>
                </div>
                <div className="flex justify-between items-center text-fog">
                  <span>Receipt File:</span>
                  <span className="text-cream truncate max-w-[200px]">{bankFile?.name || "Uploaded receipt"}</span>
                </div>
                <div className="flex justify-between items-center text-fog">
                  <span>Total Amount:</span>
                  <span className="text-cream">${planDetails.totalDue} USD</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={handleCompleteAndRedirect}
                  className="w-full sm:w-auto px-7 py-2.5 rounded-[3px] bg-amber text-[#201404] hover:bg-amber-deep font-sans font-semibold text-sm transition-colors cursor-pointer"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-[3px] border-slate-line text-cream hover:bg-ink-raised font-sans text-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* STATE: CHECKOUT FORM & SUMMARY */}
          {step === "form" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* =================================================================== */}
              {/* LEFT COLUMN: PAYMENT METHOD & FORM (7 cols on Desktop)             */}
              {/* =================================================================== */}
              <div className="lg:col-span-7 space-y-6">
                {/* Plan Highlights Summary banner */}
                <div className="rounded-[4px] border border-slate-line bg-ink-raised p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-serif text-lg text-cream font-normal">
                        {planDetails.name}
                      </h4>
                      <p className="text-xs text-amber font-mono">
                        {planDetails.billingFrequencyLabel}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-2xl text-cream font-normal">
                        ${planDetails.monthlyDisplayPrice}
                      </span>
                      <span className="text-xs text-fog font-mono">/month</span>
                    </div>
                  </div>

                  <p className="text-xs text-fog leading-relaxed border-t border-slate-line/70 pt-2.5">
                    {planDetails.summary}
                  </p>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* PAYMENT METHOD SELECTOR                                           */}
                {/* ----------------------------------------------------------------- */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-fog-dim mb-2.5 font-medium">
                    Payment Method
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Card Option */}
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange("card")}
                      className={cn(
                        "flex items-center justify-center gap-2.5 p-3.5 rounded-[4px] border font-sans text-sm transition-all cursor-pointer text-left select-none",
                        paymentMethod === "card"
                          ? "border-amber bg-amber/[0.08] text-cream ring-1 ring-amber/40 shadow-xs"
                          : "border-slate-line bg-ink-raised text-fog hover:text-cream hover:border-fog-dim"
                      )}
                    >
                      <CreditCard className={cn("size-4 shrink-0", paymentMethod === "card" ? "text-amber" : "text-fog")} />
                      <div className="flex flex-col">
                        <span className="font-medium text-cream">Card</span>
                        <span className="text-[11px] font-mono text-fog-dim">Visa, Mastercard</span>
                      </div>
                    </button>

                    {/* Bank Transfer Option */}
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange("bank_transfer")}
                      className={cn(
                        "flex items-center justify-center gap-2.5 p-3.5 rounded-[4px] border font-sans text-sm transition-all cursor-pointer text-left select-none",
                        paymentMethod === "bank_transfer"
                          ? "border-amber bg-amber/[0.08] text-cream ring-1 ring-amber/40 shadow-xs"
                          : "border-slate-line bg-ink-raised text-fog hover:text-cream hover:border-fog-dim"
                      )}
                    >
                      <Building2 className={cn("size-4 shrink-0", paymentMethod === "bank_transfer" ? "text-amber" : "text-fog")} />
                      <div className="flex flex-col">
                        <span className="font-medium text-cream">Bank Transfer</span>
                        <span className="text-[11px] font-mono text-fog-dim">Direct wire & proof</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* ----------------------------------------------------------------- */}
                {/* METHOD 1: CREDIT / DEBIT CARD FORM                                */}
                {/* ----------------------------------------------------------------- */}
                {paymentMethod === "card" && (
                  <form onSubmit={handleCardPayment} className="space-y-4">
                    {/* Visa-style Card Option Display Box */}
                    <div className="rounded-[6px] border border-slate-line bg-gradient-to-br from-[#1c202e] to-[#12141d] p-4 text-cream shadow-inner relative overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <div className="size-7 rounded-[4px] bg-amber/20 border border-amber/40 flex items-center justify-center">
                          <span className="block size-3 rounded-[2px] bg-amber/80" />
                        </div>
                        <span className="font-mono text-xs font-bold tracking-widest text-amber uppercase">
                          {cardBrand === "visa"
                            ? "VISA"
                            : cardBrand === "mastercard"
                            ? "MASTERCARD"
                            : cardBrand === "amex"
                            ? "AMEX"
                            : "CARD"}
                        </span>
                      </div>

                      <div className="font-mono text-sm sm:text-base tracking-[0.18em] text-cream/90 mb-3 select-none">
                        {cardForm.cardNumber ? cardForm.cardNumber : "•••• •••• •••• ••••"}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-fog">
                        <span className="uppercase tracking-wider truncate max-w-[170px]">
                          {cardForm.cardholderName || "CARDHOLDER NAME"}
                        </span>
                        <span>{cardForm.expiry || "MM/YY"}</span>
                      </div>
                    </div>

                    {cardErrors.general && (
                      <div className="p-3 rounded-[3px] bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>{cardErrors.general}</span>
                      </div>
                    )}

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-xs font-mono text-fog mb-1.5">
                        Cardholder Name
                      </label>
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={cardForm.cardholderName}
                        onChange={(e) => {
                          setCardForm({ ...cardForm, cardholderName: e.target.value });
                          if (cardErrors.cardholderName) {
                            setCardErrors({ ...cardErrors, cardholderName: "" });
                          }
                        }}
                        className={cn(
                          "bg-ink-raised border-slate-line text-cream placeholder:text-fog-dim focus-visible:border-amber focus-visible:ring-amber/30 text-sm",
                          cardErrors.cardholderName && "border-red-500/80"
                        )}
                      />
                      {cardErrors.cardholderName && (
                        <p className="text-[11px] text-red-400 mt-1 font-mono">
                          {cardErrors.cardholderName}
                        </p>
                      )}
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="block text-xs font-mono text-fog mb-1.5">
                        Card Number
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="4242 •••• •••• 4242"
                          maxLength={19}
                          value={cardForm.cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            setCardForm({ ...cardForm, cardNumber: formatted });
                            if (cardErrors.cardNumber) {
                              setCardErrors({ ...cardErrors, cardNumber: "" });
                            }
                          }}
                          className={cn(
                            "bg-ink-raised border-slate-line text-cream placeholder:text-fog-dim font-mono focus-visible:border-amber focus-visible:ring-amber/30 text-sm pl-9",
                            cardErrors.cardNumber && "border-red-500/80"
                          )}
                        />
                        <CreditCard className="size-4 text-fog-dim absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {cardErrors.cardNumber && (
                        <p className="text-[11px] text-red-400 mt-1 font-mono">
                          {cardErrors.cardNumber}
                        </p>
                      )}
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-fog mb-1.5">
                          Expires (MM/YY)
                        </label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardForm.expiry}
                          onChange={(e) => {
                            const formatted = formatExpiry(e.target.value);
                            setCardForm({ ...cardForm, expiry: formatted });
                            if (cardErrors.expiry) {
                              setCardErrors({ ...cardErrors, expiry: "" });
                            }
                          }}
                          className={cn(
                            "bg-ink-raised border-slate-line text-cream placeholder:text-fog-dim font-mono focus-visible:border-amber focus-visible:ring-amber/30 text-sm",
                            cardErrors.expiry && "border-red-500/80"
                          )}
                        />
                        {cardErrors.expiry && (
                          <p className="text-[11px] text-red-400 mt-1 font-mono">
                            {cardErrors.expiry}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-fog mb-1.5">
                          CVV / CVC
                        </label>
                        <Input
                          type="password"
                          inputMode="numeric"
                          placeholder="•••"
                          maxLength={4}
                          value={cardForm.cvv}
                          onChange={(e) => {
                            const formatted = formatCvv(e.target.value);
                            setCardForm({ ...cardForm, cvv: formatted });
                            if (cardErrors.cvv) {
                              setCardErrors({ ...cardErrors, cvv: "" });
                            }
                          }}
                          className={cn(
                            "bg-ink-raised border-slate-line text-cream placeholder:text-fog-dim font-mono focus-visible:border-amber focus-visible:ring-amber/30 text-sm tracking-widest",
                            cardErrors.cvv && "border-red-500/80"
                          )}
                        />
                        {cardErrors.cvv && (
                          <p className="text-[11px] text-red-400 mt-1 font-mono">
                            {cardErrors.cvv}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-fog-dim font-mono pt-1">
                      🔒 Your card details are never stored on our servers. Processed via mock TLS.
                    </p>

                    {/* Mobile submit button trigger */}
                    <div className="pt-2 lg:hidden">
                      <Button
                        type="submit"
                        className="w-full h-11 rounded-[3px] bg-amber text-[#201404] hover:bg-amber-deep font-sans font-semibold text-sm transition-colors cursor-pointer shadow-xs"
                      >
                        {selectedPlan === "starter"
                          ? "Activate Starter Free"
                          : `Pay $${planDetails.totalDue}`}
                      </Button>
                    </div>
                  </form>
                )}

                {/* ----------------------------------------------------------------- */}
                {/* METHOD 2: BANK TRANSFER INSTRUCTIONS & UPLOAD                      */}
                {/* ----------------------------------------------------------------- */}
                {paymentMethod === "bank_transfer" && (
                  <form onSubmit={handleBankTransfer} className="space-y-5">
                    {/* Bank Transfer Instructions Card */}
                    <div className="rounded-[4px] border border-slate-line bg-ink-raised p-4 sm:p-5 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-line/70 pb-2.5">
                        <span className="font-mono text-xs uppercase tracking-wider text-amber font-semibold">
                          Bank Transfer Instructions
                        </span>
                        <span className="text-[11px] font-mono text-fog-dim">
                          Currency: {BANK_TRANSFER_DETAILS.currency}
                        </span>
                      </div>

                      <p className="text-xs text-fog leading-relaxed">
                        Transfer the total amount (${planDetails.totalDue} USD) using the wire details below. 
                        Always include your unique payment reference in your transfer notes.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono">
                        {/* Bank Name */}
                        <div className="p-2.5 rounded-[3px] bg-ink border border-slate-line flex items-center justify-between">
                          <div>
                            <span className="text-fog-dim block text-[10px] uppercase">Bank Name</span>
                            <span className="text-cream font-medium">{BANK_TRANSFER_DETAILS.bankName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(BANK_TRANSFER_DETAILS.bankName, "bankName")}
                            className="text-fog-dim hover:text-amber transition-colors p-1"
                            title="Copy bank name"
                          >
                            {copiedField === "bankName" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                          </button>
                        </div>

                        {/* Account Title */}
                        <div className="p-2.5 rounded-[3px] bg-ink border border-slate-line flex items-center justify-between">
                          <div>
                            <span className="text-fog-dim block text-[10px] uppercase">Account Title</span>
                            <span className="text-cream font-medium">{BANK_TRANSFER_DETAILS.accountTitle}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(BANK_TRANSFER_DETAILS.accountTitle, "accountTitle")}
                            className="text-fog-dim hover:text-amber transition-colors p-1"
                            title="Copy account title"
                          >
                            {copiedField === "accountTitle" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                          </button>
                        </div>

                        {/* IBAN / Account Number */}
                        <div className="p-2.5 rounded-[3px] bg-ink border border-slate-line sm:col-span-2 flex items-center justify-between">
                          <div>
                            <span className="text-fog-dim block text-[10px] uppercase">IBAN / Account Number</span>
                            <span className="text-cream font-medium tracking-wider">{BANK_TRANSFER_DETAILS.iban}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(BANK_TRANSFER_DETAILS.iban, "iban")}
                            className="text-fog-dim hover:text-amber transition-colors p-1"
                            title="Copy IBAN"
                          >
                            {copiedField === "iban" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                          </button>
                        </div>

                        {/* Payment Reference */}
                        <div className="p-2.5 rounded-[3px] bg-amber/[0.08] border border-amber/30 sm:col-span-2 flex items-center justify-between">
                          <div>
                            <span className="text-amber font-semibold block text-[10px] uppercase tracking-wide">
                              Payment Reference (Required)
                            </span>
                            <span className="text-cream font-bold text-sm tracking-wider">{bankReference}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(bankReference, "reference")}
                            className="text-amber hover:text-cream transition-colors p-1"
                            title="Copy reference code"
                          >
                            {copiedField === "reference" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Upload Payment Proof interface */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-fog font-medium">
                          Upload Payment Proof
                        </label>
                        <span className="text-[11px] font-mono text-fog-dim">
                          PNG, JPG, or PDF up to 10MB
                        </span>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileSelected(e.target.files[0]);
                          }
                        }}
                      />

                      {!bankFile ? (
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDropFile}
                          onClick={() => fileInputRef.current?.click()}
                          className={cn(
                            "rounded-[4px] border border-dashed border-slate-line hover:border-amber bg-ink-raised/50 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group",
                            bankErrors.proof && "border-red-500/80 bg-red-500/5"
                          )}
                        >
                          <div className="size-10 rounded-full bg-ink border border-slate-line flex items-center justify-center text-fog-dim group-hover:text-amber mb-2 transition-colors">
                            <Upload className="size-5" />
                          </div>
                          <p className="text-xs font-medium text-cream group-hover:text-amber transition-colors">
                            Click to upload or drag & drop payment receipt
                          </p>
                          <p className="text-[11px] text-fog-dim mt-0.5">
                            Screenshot of wire confirmation, bank receipt, or online transaction
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-[4px] border border-slate-line bg-ink-raised p-3.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            {bankFilePreview ? (
                              <img
                                src={bankFilePreview}
                                alt="Receipt preview"
                                className="size-10 rounded-[2px] object-cover border border-slate-line"
                              />
                            ) : (
                              <div className="size-10 rounded-[2px] bg-ink border border-slate-line flex items-center justify-center text-amber">
                                <FileCheck2 className="size-5" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-cream truncate">
                                {bankFile.name}
                              </p>
                              <p className="text-[10px] font-mono text-fog-dim">
                                {(bankFile.size / 1024).toFixed(1)} KB • Ready for review
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setBankFile(null);
                              setBankFilePreview(null);
                            }}
                            className="p-1.5 text-fog-dim hover:text-red-400 transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      )}

                      {bankErrors.proof && (
                        <p className="text-[11px] text-red-400 mt-1 font-mono">
                          {bankErrors.proof}
                        </p>
                      )}
                    </div>

                    {/* Mobile submit button trigger */}
                    <div className="pt-2 lg:hidden">
                      <Button
                        type="submit"
                        className="w-full h-11 rounded-[3px] bg-amber text-[#201404] hover:bg-amber-deep font-sans font-semibold text-sm transition-colors cursor-pointer shadow-xs"
                      >
                        Submit Payment Proof
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* =================================================================== */}
              {/* RIGHT COLUMN: ORDER SUMMARY (5 cols on Desktop)                    */}
              {/* =================================================================== */}
              <div className="lg:col-span-5 rounded-[4px] border border-slate-line bg-ink-raised/70 p-5 sm:p-6 flex flex-col justify-between space-y-6">
                <div>
                  <div className="border-b border-slate-line pb-3 mb-4">
                    <h3 className="font-serif text-xl text-cream font-normal">
                      Order Summary
                    </h3>
                    <p className="text-xs text-fog mt-0.5">
                      Review billing cycle and total charges
                    </p>
                  </div>

                  {/* Billing Frequency Toggle */}
                  <div className="mb-4">
                    <span className="block text-xs font-mono text-fog-dim uppercase mb-2">
                      Billing Cycle
                    </span>
                    <div className="grid grid-cols-2 gap-2 bg-ink p-1 rounded-[3px] border border-slate-line text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setBillingCycle("annual")}
                        className={cn(
                          "py-1.5 px-2 rounded-[2px] transition-all cursor-pointer text-center",
                          billingCycle === "annual"
                            ? "bg-amber text-[#201404] font-semibold"
                            : "text-fog hover:text-cream"
                        )}
                      >
                        Annual (Save 20%+)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingCycle("monthly")}
                        className={cn(
                          "py-1.5 px-2 rounded-[2px] transition-all cursor-pointer text-center",
                          billingCycle === "monthly"
                            ? "bg-amber text-[#201404] font-semibold"
                            : "text-fog hover:text-cream"
                        )}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  {/* Order breakdown lines */}
                  <div className="space-y-2.5 text-xs font-mono text-fog border-b border-slate-line pb-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span>Plan:</span>
                      <span className="text-cream font-medium uppercase">{selectedPlan}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Billing:</span>
                      <span className="text-cream capitalize">{billingCycle}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Monthly rate:</span>
                      <span className="text-cream">${planDetails.monthlyDisplayPrice}/mo</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-line/50">
                      <span>Subtotal:</span>
                      <span className="text-cream">${planDetails.totalDue}</span>
                    </div>

                    <div className="flex justify-between items-center text-fog-dim text-[11px]">
                      <span>Applicable Taxes:</span>
                      <span>$0.00</span>
                    </div>
                  </div>

                  {/* Total calculation */}
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="font-serif text-lg text-cream font-normal">Total:</span>
                    <div className="text-right">
                      <span className="font-serif text-3xl text-cream font-normal">
                        ${planDetails.totalDue}
                      </span>
                      <span className="block text-[11px] font-mono text-fog-dim">
                        USD {billingCycle === "annual" && selectedPlan !== "starter" ? "/ year" : "/ month"}
                      </span>
                    </div>
                  </div>

                  {/* What you get bullets */}
                  <div className="space-y-1.5 text-xs text-fog mb-6">
                    <span className="text-cream font-mono text-[11px] uppercase block mb-1 font-semibold">
                      Included with {planDetails.name}:
                    </span>
                    {planDetails.features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-amber font-mono select-none mt-0.5">—</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Terms & Privacy Consent */}
                  <p className="text-[11px] text-fog-dim leading-relaxed mb-4 text-center">
                    By continuing, you agree to Klyro AI&apos;s{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-cream underline hover:text-amber transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-cream underline hover:text-amber transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>

                  {/* Desktop Final CTA button */}
                  <div className="hidden lg:block">
                    {paymentMethod === "card" ? (
                      <Button
                        type="button"
                        onClick={handleCardPayment}
                        className="w-full h-11 rounded-[3px] bg-amber text-[#201404] hover:bg-amber-deep font-sans font-semibold text-sm transition-colors cursor-pointer shadow-xs"
                      >
                        {selectedPlan === "starter"
                          ? "Activate Starter Free"
                          : `Pay $${planDetails.totalDue}`}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleBankTransfer}
                        className="w-full h-11 rounded-[3px] bg-amber text-[#201404] hover:bg-amber-deep font-sans font-semibold text-sm transition-colors cursor-pointer shadow-xs"
                      >
                        Submit Payment Proof
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
