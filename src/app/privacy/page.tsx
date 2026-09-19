import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Klyro. Understand what information we collect, how Sign in with Google identity credentials are used, and how your project data is protected.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-ink text-cream font-sans antialiased overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[880px] px-5 py-14 sm:px-8 sm:py-20">
          {/* Header Section */}
          <div className="border-b border-slate-line pb-8">
            <span className="font-mono text-xs uppercase tracking-widest text-amber">
              Legal Documentation
            </span>
            <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-cream sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-base leading-relaxed text-fog">
              This Privacy Policy explains how Klyro collects, uses, stores, and protects your
              personal information when you access or use our AI web application builder, including
              authentication through Google Identity Services.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-6 font-mono text-xs text-fog-dim">
              <span>Effective Date: September 19, 2026</span>
              <span>Last Revised: September 19, 2026</span>
              <span>Applies to: klyro.ai &amp; vibebuilder-gamma.vercel.app</span>
            </div>
          </div>

          {/* Policy Content Sections */}
          <div className="mt-10 space-y-12 text-sm leading-relaxed text-cream/90">
            {/* 1. Overview */}
            <section id="overview" className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-cream">
                1. Overview &amp; Our Commitment
              </h2>
              <p className="text-fog">
                Klyro (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to
                respecting your privacy and safeguarding your personal information. We operate an
                intelligent software builder that translates natural language prompts into working
                web applications. We only collect the minimal data required to create your account,
                authenticate your sessions, manage your code workspaces, and provide our core AI
                generation services.
              </p>
              <p className="text-fog">
                We do not sell your personal information, and we do not use your proprietary
                project code or authentication credentials for third-party advertising.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="information-collected" className="space-y-4">
              <h2 className="font-serif text-xl font-semibold text-cream">
                2. Information We Collect
              </h2>
              <p className="text-fog">
                Depending on how you interact with Klyro, we collect several categories of
                information:
              </p>

              <div className="space-y-4 rounded-md border border-slate-line bg-ink-raised p-5">
                <div>
                  <h3 className="font-medium text-cream">A. Account Information</h3>
                  <p className="mt-1 text-xs text-fog">
                    When you sign up directly using an email and password, we collect your full
                    name, email address, and an encrypted hash of your password. We never store
                    plain-text passwords.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-cream">
                    B. Google Sign-In &amp; Identity Credentials
                  </h3>
                  <p className="mt-1 text-xs text-fog">
                    Users can sign in to Klyro using their Google account via official Google
                    Identity Services and OAuth 2.0. When you authenticate using &ldquo;Sign in with
                    Google&rdquo;, we receive verified identity data from Google:
                  </p>
                  <ul className="mt-2 list-disc pl-5 text-xs text-fog space-y-1">
                    <li>
                      <strong className="text-cream">Google User ID (&ldquo;sub&rdquo;):</strong> A
                      permanent, unique numerical identifier assigned by Google used as your primary
                      Klyro account identity anchor.
                    </li>
                    <li>
                      <strong className="text-cream">Email Address:</strong> Your verified Google or
                      Gmail address.
                    </li>
                    <li>
                      <strong className="text-cream">Full Name:</strong> Your Google profile display
                      name, given name, and family name.
                    </li>
                    <li>
                      <strong className="text-cream">Profile Picture URL:</strong> Your public
                      Google avatar image, used to personalize your workspace header.
                    </li>
                  </ul>
                  <p className="mt-2 text-xs text-amber/90">
                    We never receive, access, or store your Google account password.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-cream">C. Project Content &amp; AI Prompts</h3>
                  <p className="mt-1 text-xs text-fog">
                    To generate web applications, we store the natural language prompts you submit,
                    workspace chat messages, AI model generation outputs, project files (such as
                    React, Next.js, and TypeScript components), and project configuration metadata.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-cream">D. Technical &amp; Operational Data</h3>
                  <p className="mt-1 text-xs text-fog">
                    We automatically record standard technical data necessary for system security,
                    including your IP address, browser type, device operating system, access
                    timestamps, and error logs.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Sign in with Google Integration */}
            <section id="google-signin" className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-cream">
                3. How Google Sign-In Operates
              </h2>
              <p className="text-fog">
                When you click &ldquo;Sign in with Google&rdquo; on Klyro:
              </p>
              <ol className="list-decimal pl-5 text-fog space-y-2 text-xs sm:text-sm">
                <li>
                  You are presented with Google&apos;s official account selection dialog hosted
                  directly on Google&apos;s verified servers.
                </li>
                <li>
                  Upon your approval, Google issues an identity credential directly to our secure
                  authentication backend.
                </li>
                <li>
                  Our server cryptographically validates the token against Google&apos;s public keys
                  and extracts your stable Google subject identifier (<code className="rounded bg-ink px-1.5 py-0.5 font-mono text-amber">sub</code>).
                </li>
                <li>
                  If you are a new user, we automatically generate a Klyro account linking your
                  Google ID, name, email, and avatar. If your account already exists, we authenticate
                  your session and update your last login timestamp.
                </li>
                <li>
                  A secure, HTTP-only session cookie is established on your browser to keep you
                  signed in across sessions.
                </li>
              </ol>
            </section>

            {/* 4. Purpose and Usage */}
            <section id="data-usage" className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-cream">
                4. How We Use Your Information
              </h2>
              <p className="text-fog">
                We use collected information strictly for the following purposes:
              </p>
              <ul className="list-disc pl-5 text-fog space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong className="text-cream">Authentication &amp; Account Management:</strong>{" "}
                  To identify you, maintain active builder sessions, and verify authorization to
                  access your private projects.
                </li>
                <li>
                  <strong className="text-cream">Product Delivery:</strong> To execute AI code
                  generation requests, compile project files, render live browser previews, and
                  facilitate project ZIP exports.
                </li>
                <li>
                  <strong className="text-cream">Security &amp; Abuse Prevention:</strong> To
                  prevent automated denial-of-service attacks, detect fraudulent usage, and monitor
                  system health.
                </li>
                <li>
                  <strong className="text-cream">Direct Communication:</strong> To send critical
                  service-related notices, such as account security alerts, updates to terms, or
                  responses to your support requests.
                </li>
              </ul>
            </section>

            {/* 5. Data Storage & Security */}
            <section id="security" className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-cream">
                5. Data Storage &amp; Security Protection
              </h2>
              <p className="text-fog">
                We employ industry-standard technical and organizational security controls:
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <div className="rounded-md border border-slate-line bg-ink-raised p-4">
                  <h3 className="font-medium text-cream text-xs uppercase tracking-wider font-mono">
                    Encryption Standards
                  </h3>
                  <p className="mt-1.5 text-xs text-fog">
                    All communications between your browser and Klyro servers are encrypted using
                    TLS 1.3/HTTPS. Stored databases and code assets are encrypted at rest.
                  </p>
                </div>
                <div className="rounded-md border border-slate-line bg-ink-raised p-4">
                  <h3 className="font-medium text-cream text-xs uppercase tracking-wider font-mono">
                    Session Hardening
                  </h3>
                  <p className="mt-1.5 text-xs text-fog">
                    Authentication cookies are signed, scoped with HTTP-only and SameSite flags,
                    ensuring credentials cannot be extracted by malicious third-party scripts.
                  </p>
                </div>
                <div className="rounded-md border border-slate-line bg-ink-raised p-4">
                  <h3 className="font-medium text-cream text-xs uppercase tracking-wider font-mono">
                    Database Isolation
                  </h3>
                  <p className="mt-1.5 text-xs text-fog">
                    We enforce Row-Level Security (RLS) policies ensuring users can only read,
                    modify, or delete projects and files assigned to their authenticated identity.
                  </p>
                </div>
                <div className="rounded-md border border-slate-line bg-ink-raised p-4">
                  <h3 className="font-medium text-cream text-xs uppercase tracking-wider font-mono">
                    No Credential Sharing
                  </h3>
                  <p className="mt-1.5 text-xs text-fog">
                    OAuth client secrets remain exclusively within secured server environments and
                    are never exposed to browser or client-side bundles.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Third Parties */}
            <section id="third-parties" className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-cream">
                6. Third-Party Service Providers
              </h2>
              <p className="text-fog">
                We do not sell, rent, license, or trade your personal information. We share data
                only with vetted infrastructure and platform providers necessary to operate the
                service:
              </p>
              <ul className="list-disc pl-5 text-fog space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong className="text-cream">Google Cloud &amp; Google Identity Services:</strong>{" "}
                  For OAuth authentication and Google user verification.
                </li>
                <li>
                  <strong className="text-cream">Google Gemini AI:</strong> For real-time processing
                  of user prompts and synthesis of application source code. Prompts are transmitted
                  securely via API to fulfill your explicit generation requests.
                </li>
                <li>
                  <strong className="text-cream">Vercel:</strong> For hosting web application
                  assets, edge routing, and serverless compute execution.
                </li>
                <li>
                  <strong className="text-cream">Supabase / PostgreSQL:</strong> For persistent
                  storage of user accounts, project trees, and encrypted records.
                </li>
              </ul>
            </section>

            {/* 7. Retention & Deletion */}
            <section id="retention-deletion" className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-cream">
                7. Data Retention &amp; Account Deletion
              </h2>
              <p className="text-fog">
                We retain your account data and projects for as long as your Klyro account remains
                active. You have full ownership and control of your information:
              </p>
              <ul className="list-disc pl-5 text-fog space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong className="text-cream">Project Export:</strong> You can export and
                  download your complete project source code as a ZIP archive at any time directly
                  from the builder workspace.
                </li>
                <li>
                  <strong className="text-cream">Account &amp; Data Deletion:</strong> You may
                  request permanent deletion of your Klyro account, Google identity associations,
                  stored projects, and generated code files by contacting us at{" "}
                  <a
                    href="mailto:privacy@klyro.ai"
                    className="text-amber hover:underline font-mono"
                  >
                    privacy@klyro.ai
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-cream">Deletion Processing:</strong> Once verified, your
                  account and associated code files are permanently removed from active databases
                  within 30 days.
                </li>
                <li>
                  <strong className="text-cream">Revoking Google Permissions:</strong> You can
                  disconnect Klyro from your Google account at any time via your{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber hover:underline"
                  >
                    Google Account Security settings
                  </a>
                  .
                </li>
              </ul>
            </section>

            {/* 8. Your Rights */}
            <section id="user-rights" className="space-y-3">
              <h2 className="font-serif text-xl font-semibold text-cream">
                8. Your Privacy Rights (GDPR, CCPA &amp; Global)
              </h2>
              <p className="text-fog">
                Regardless of your geographic location, Klyro extends core privacy rights:
              </p>
              <ul className="list-disc pl-5 text-fog space-y-1 text-xs sm:text-sm">
                <li>The right to access the personal information we hold about you.</li>
                <li>The right to correct inaccurate or incomplete personal data.</li>
                <li>The right to request deletion of your account and project content.</li>
                <li>The right to export your code and data in a machine-readable format.</li>
                <li>The right to withdraw consent for third-party authentication links.</li>
              </ul>
            </section>

            {/* 9. Contact */}
            <section id="contact" className="space-y-3 rounded-md border border-slate-line bg-ink-raised p-6">
              <h2 className="font-serif text-xl font-semibold text-cream">
                9. Contacting Our Privacy Team
              </h2>
              <p className="text-xs sm:text-sm text-fog">
                If you have questions about this Privacy Policy, your Google authentication data,
                or would like to submit a data deletion request, please contact our team:
              </p>
              <div className="mt-3 space-y-1 text-xs sm:text-sm">
                <p className="font-medium text-cream">Klyro Privacy &amp; Data Protection</p>
                <p className="text-fog">
                  Email:{" "}
                  <a
                    href="mailto:privacy@klyro.ai"
                    className="font-mono text-amber hover:underline"
                  >
                    privacy@klyro.ai
                  </a>
                </p>
                <p className="text-fog">
                  Support:{" "}
                  <a
                    href="mailto:support@klyro.ai"
                    className="font-mono text-amber hover:underline"
                  >
                    support@klyro.ai
                  </a>
                </p>
                <p className="text-fog">
                  Web:{" "}
                  <Link href="/" className="text-amber hover:underline">
                    https://vibebuilder-gamma.vercel.app
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
