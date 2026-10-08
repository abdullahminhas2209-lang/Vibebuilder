/**
 * Klyro AI — Modular Payment Service & Processing Abstraction
 * 
 * Separates payment gateway interaction from the UI layer.
 * Currently provides prototype/sandbox payment handling with realistic validation
 * and structured interfaces so Stripe, Paddle, or another provider can replace
 * the mock logic cleanly.
 * 
 * SECURITY:
 * - Never stores raw card numbers in localStorage or client cookies.
 * - Never stores CVV in any persistent storage.
 * - Never pretends real money was charged: explicitly flags sandbox simulation.
 */

import { PRICING_PLANS } from "@/lib/constants";

export type PlanId = "starter" | "pro" | "team";
export type BillingCycle = "annual" | "monthly";
export type PaymentMethodType = "card" | "bank_transfer";

export interface PlanCheckoutDetails {
  id: PlanId;
  name: string;
  monthlyDisplayPrice: number;
  totalDue: number;
  billingCycle: BillingCycle;
  billingFrequencyLabel: string;
  summary: string;
  features: string[];
}

export interface CardPaymentInput {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
}

export interface BankTransferInput {
  reference: string;
  proofFile: File | null;
  proofFileName: string;
  proofFileSize: number;
  senderNotes?: string;
}

export interface PaymentProcessingResult {
  success: boolean;
  status: "succeeded" | "submitted" | "failed";
  transactionId: string;
  planId: PlanId;
  billingCycle: BillingCycle;
  amount: number;
  paymentMethod: PaymentMethodType;
  message: string;
  isMock: boolean;
  timestamp: string;
  details?: {
    cardLast4?: string;
    cardBrand?: string;
    transferReference?: string;
    proofFileName?: string;
  };
}

/**
 * Bank transfer destination account details
 */
export const BANK_TRANSFER_DETAILS = {
  bankName: "Standard Chartered Bank",
  accountTitle: "Klyro AI Technologies Inc.",
  accountNumber: "0109-8472-9182-01",
  iban: "GB29 SCBL 6016 1331 9268 19",
  swiftBic: "SCBLGB2L",
  branch: "London City Central Branch",
  currency: "USD",
} as const;

/**
 * Calculate pricing and summary for checkout display
 */
export function getPlanCheckoutDetails(
  planId: PlanId,
  billingCycle: BillingCycle
): PlanCheckoutDetails {
  const plan = PRICING_PLANS[planId];
  const isAnnual = billingCycle === "annual";

  if (planId === "starter") {
    return {
      id: "starter",
      name: "Starter Plan",
      monthlyDisplayPrice: 0,
      totalDue: 0,
      billingCycle,
      billingFrequencyLabel: "Free forever",
      summary: "5 app generations monthly, single-component export, live multi-device sandbox preview.",
      features: [...plan.features],
    };
  }

  if (planId === "pro") {
    const monthlyRate = isAnnual ? plan.priceAnnualPerMonth : plan.priceMonthly;
    const totalDue = isAnnual ? plan.priceAnnualPerMonth * 12 : plan.priceMonthly; // $180 or $19

    return {
      id: "pro",
      name: "Pro Plan",
      monthlyDisplayPrice: monthlyRate,
      totalDue,
      billingCycle,
      billingFrequencyLabel: isAnnual ? "Billed annually ($180/year)" : "Billed monthly ($19/month)",
      summary: "Unlimited app generations (fair-use), full Next.js project export (.zip), and conversational AI editing.",
      features: [...plan.features],
    };
  }

  // team
  const monthlyRate = isAnnual ? plan.priceAnnualPerMonth : plan.priceMonthly;
  const totalDue = isAnnual ? plan.priceAnnualPerMonth * 12 : plan.priceMonthly; // $468 or $49

  return {
    id: "team",
    name: "Team Plan",
    monthlyDisplayPrice: monthlyRate,
    totalDue,
    billingCycle,
    billingFrequencyLabel: isAnnual ? "Billed annually ($468/year)" : "Billed monthly ($49/month)",
    summary: "Up to 5 seats included, shared team workspaces, full source export, and priority support.",
    features: [...plan.features],
  };
}

/**
 * Generate a unique bank transfer payment reference
 */
export function generateBankTransferReference(planId: PlanId): string {
  const prefix = `KLYRO-${planId.toUpperCase()}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
}

/**
 * Card Input Formatting Utilities
 */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(" ") : digits;
}

export function detectCardBrand(number: string): "visa" | "mastercard" | "amex" | "generic" {
  const clean = number.replace(/\D/g, "");
  if (/^4/.test(clean)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(clean)) return "mastercard";
  if (/^3[47]/.test(clean)) return "amex";
  return "generic";
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
  return digits;
}

export function formatCvv(value: string): string {
  return value.replace(/\D/g, "").slice(0, 4);
}

/**
 * Validation rules
 */
export function validateCardDetails(input: CardPaymentInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  const cleanNumber = input.cardNumber.replace(/\s+/g, "");

  if (!input.cardholderName.trim()) {
    errors.cardholderName = "Cardholder name is required.";
  } else if (input.cardholderName.trim().length < 3) {
    errors.cardholderName = "Please enter a valid full name.";
  }

  if (!cleanNumber) {
    errors.cardNumber = "Card number is required.";
  } else if (!/^\d{15,16}$/.test(cleanNumber)) {
    errors.cardNumber = "Enter a valid 15 or 16-digit card number.";
  }

  if (!input.expiry) {
    errors.expiry = "MM/YY is required.";
  } else {
    const parts = input.expiry.split("/");
    if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
      errors.expiry = "Use MM/YY format.";
    } else {
      const month = parseInt(parts[0], 10);
      const year = parseInt(`20${parts[1]}`, 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (month < 1 || month > 12) {
        errors.expiry = "Month must be 01-12.";
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiry = "Card has expired.";
      }
    }
  }

  if (!input.cvv) {
    errors.cvv = "CVV is required.";
  } else if (!/^\d{3,4}$/.test(input.cvv)) {
    errors.cvv = "CVV must be 3 or 4 digits.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateBankTransferDetails(input: BankTransferInput): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.proofFile && !input.proofFileName) {
    errors.proof = "Please attach a payment receipt or transfer screenshot.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Card Payment Processing Adapter (Prototype/Sandbox)
 * 
 * Simulates network communication with a payment processor like Stripe.
 * Never persists raw card numbers or CVV.
 */
export async function processCardPayment(
  input: CardPaymentInput,
  planId: PlanId,
  billingCycle: BillingCycle
): Promise<PaymentProcessingResult> {
  const validation = validateCardDetails(input);
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0] || "Invalid card details.");
  }

  // Artificial processing delay for authentic payment flow feeling (1.2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const cleanNumber = input.cardNumber.replace(/\s+/g, "");
  const last4 = cleanNumber.slice(-4);
  const brand = detectCardBrand(cleanNumber);
  const details = getPlanCheckoutDetails(planId, billingCycle);

  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Store active subscription state locally in session (no sensitive card data)
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        "klyro_active_plan",
        JSON.stringify({
          planId,
          billingCycle,
          activatedAt: new Date().toISOString(),
          paymentMethod: "card",
          last4,
          isMock: true,
        })
      );
    } catch {
      // Non-blocking
    }
  }

  return {
    success: true,
    status: "succeeded",
    transactionId: txId,
    planId,
    billingCycle,
    amount: details.totalDue,
    paymentMethod: "card",
    message: `Your Klyro AI ${details.name} has been activated.`,
    isMock: true,
    timestamp: new Date().toISOString(),
    details: {
      cardLast4: last4,
      cardBrand: brand,
    },
  };
}

/**
 * Bank Transfer Processing Adapter (Prototype/Sandbox)
 * 
 * Simulates proof submission and queuing for manual administrative review.
 */
export async function processBankTransfer(
  input: BankTransferInput,
  planId: PlanId,
  billingCycle: BillingCycle
): Promise<PaymentProcessingResult> {
  const validation = validateBankTransferDetails(input);
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0] || "Missing payment proof.");
  }

  // Artificial upload/verification delay (1.0 second)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const details = getPlanCheckoutDetails(planId, billingCycle);
  const txId = `bt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        "klyro_pending_bank_transfer",
        JSON.stringify({
          reference: input.reference,
          planId,
          billingCycle,
          proofFileName: input.proofFileName,
          submittedAt: new Date().toISOString(),
          status: "pending_verification",
          isMock: true,
        })
      );
    } catch {
      // Non-blocking
    }
  }

  return {
    success: true,
    status: "submitted",
    transactionId: txId,
    planId,
    billingCycle,
    amount: details.totalDue,
    paymentMethod: "bank_transfer",
    message: "Your payment proof has been submitted and will be reviewed.",
    isMock: true,
    timestamp: new Date().toISOString(),
    details: {
      transferReference: input.reference,
      proofFileName: input.proofFileName,
    },
  };
}
