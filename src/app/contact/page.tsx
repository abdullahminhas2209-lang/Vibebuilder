"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { CONTACT_EMAIL } from "@/lib/constants";
import { Mail, CheckCircle2, Send, ArrowLeft, Users, Building } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [teamSize, setTeamSize] = useState("1-5");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function generateMailtoUrl() {
    const subject = encodeURIComponent(`Klyro Team Inquiry: ${name} (${teamSize} seats)`);
    const body = encodeURIComponent(
      `Name: ${name}\nWork Email: ${email}\nTeam Size: ${teamSize}\n\nProject Needs / Message:\n${message}\n\nSent from Klyro Contact Form`
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    setIsSubmitting(true);

    // Build the mailto link and trigger it as the configured fallback
    const mailtoUrl = generateMailtoUrl();

    try {
      // Open default mail client with pre-filled content
      window.location.href = mailtoUrl;
      setSubmitted(true);
    } catch {
      // If direct location change is blocked, user still gets the success UI with the direct mail link
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-ink text-cream font-sans antialiased overflow-x-hidden selection:bg-amber selection:text-[#201404]">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20">
        <div className="mx-auto w-full max-w-[820px] px-5 sm:px-8">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-fog hover:text-cream transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Pricing</span>
            </Link>
          </div>

          {/* Header block */}
          <div className="border-b border-slate-line pb-8 mb-8">
            <span className="font-mono text-xs uppercase tracking-wider text-amber font-medium block mb-2">
              Team &amp; Enterprise Support
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-cream tracking-tight">
              Talk to the Klyro Team
            </h1>
            <p className="mt-3.5 text-sm sm:text-base text-fog leading-relaxed max-w-[62ch]">
              Have questions about team workspaces, agency seats, custom volume, or technical requirements? We&apos;ll get back to you within one business day.
            </p>
          </div>

          {submitted ? (
            /* Success confirmation state */
            <div className="rounded-lg border border-slate-line bg-ink-raised/60 p-8 sm:p-12 text-center space-y-4">
              <div className="size-12 rounded-full bg-amber/15 border border-amber/30 text-amber flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-6" />
              </div>
              <h2 className="font-serif text-2xl text-cream font-normal">
                Message Ready to Send
              </h2>
              <p className="text-sm text-fog max-w-[50ch] mx-auto leading-relaxed">
                Your email client should have opened with your inquiry. If it didn&apos;t open automatically, click the button below to send directly to{" "}
                <span className="text-cream font-mono font-medium">{CONTACT_EMAIL}</span>.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={generateMailtoUrl()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-[3px] bg-amber hover:bg-amber-deep text-[#201404] font-semibold text-sm transition-colors shadow-xs"
                >
                  Open in Email Client
                </a>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-[3px] border border-slate-line hover:border-fog-dim text-cream text-sm transition-colors"
                >
                  Edit Information
                </button>
              </div>
            </div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-[3px] border border-rose-900/60 bg-rose-950/50 p-3.5 text-xs text-rose-300 font-medium"
                >
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-mono uppercase tracking-wider text-fog mb-1.5"
                  >
                    Your Name <span className="text-amber">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full h-11 px-3.5 rounded-[3px] bg-ink border border-slate-line text-cream text-sm placeholder:text-fog-dim focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-colors"
                  />
                </div>

                {/* Work Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-mono uppercase tracking-wider text-fog mb-1.5"
                  >
                    Work Email <span className="text-amber">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full h-11 px-3.5 rounded-[3px] bg-ink border border-slate-line text-cream text-sm placeholder:text-fog-dim focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-colors"
                  />
                </div>
              </div>

              {/* Team Size */}
              <div>
                <label
                  htmlFor="contact-team-size"
                  className="block text-xs font-mono uppercase tracking-wider text-fog mb-1.5"
                >
                  Team Size (Seats Needed)
                </label>
                <div className="relative">
                  <select
                    id="contact-team-size"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-[3px] bg-ink border border-slate-line text-cream text-sm focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="1-5">1 to 5 seats (Covered by Team Plan at $39/mo)</option>
                    <option value="6-15">6 to 15 seats</option>
                    <option value="16-50">16 to 50 seats</option>
                    <option value="50+">50+ seats (Custom agency package)</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-xs font-mono uppercase tracking-wider text-fog mb-1.5"
                >
                  How can we help your team? <span className="text-amber">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the apps or prototypes your team is building, workflow integrations, or invoicing requirements..."
                  className="w-full p-3.5 rounded-[3px] bg-ink border border-slate-line text-cream text-sm placeholder:text-fog-dim focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber/30 transition-colors resize-y leading-relaxed"
                />
              </div>

              {/* Direct Mail Info */}
              <div className="rounded-[3px] border border-slate-line bg-ink-raised/30 p-3.5 text-xs font-mono text-fog-dim flex items-center gap-2.5">
                <Mail className="size-4 text-amber shrink-0" />
                <span>
                  Direct email contact:{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-amber hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 rounded-[3px] bg-amber hover:bg-amber-deep text-[#201404] font-semibold text-sm transition-colors cursor-pointer shadow-xs inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <Send className="size-4" />
                  <span>{isSubmitting ? "Opening Mail..." : "Send Message"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
