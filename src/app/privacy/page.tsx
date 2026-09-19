import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Klyro Privacy Policy",
  description:
    "Klyro's Privacy Policy explains how we collect, use, store, and protect information when you use the Klyro platform.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-ink text-cream font-montserrat antialiased overflow-x-hidden selection:bg-amber selection:text-[#201404]">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[820px] px-5 py-14 sm:px-8 sm:py-20">
          {/* Header Block */}
          <header className="border-b border-slate-line pb-8">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-amber">
              Legal &amp; Compliance
            </span>
            <h1 className="mt-3 font-playfair text-3xl font-semibold tracking-tight text-cream sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 font-mono text-xs text-fog-dim">
              Last updated: September 19, 2026
            </p>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-fog">
              Your privacy matters to us. This Privacy Policy explains how Klyro collects, uses,
              stores, and protects information when you use our platform.
            </p>
          </header>

          {/* Policy Body */}
          <div className="mt-10 space-y-12 text-sm leading-relaxed text-cream/90">
            {/* 1. Introduction */}
            <section id="introduction" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                1. Introduction
              </h2>
              <p className="text-fog">
                Welcome to Klyro (&ldquo;Klyro&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or
                &ldquo;us&rdquo;). Klyro is an AI-powered website and web application builder that
                allows developers, creators, and teams to turn natural language descriptions into
                interactive, production-ready software.
              </p>
              <p className="text-fog">
                This Privacy Policy applies to all users of Klyro accessible through our web platform,
                APIs, and related services. By accessing or using Klyro, you acknowledge that you have
                read and understood the practices described in this document.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="information-we-collect" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                2. Information We Collect
              </h2>
              <p className="text-fog">
                We collect only the information necessary to provide, secure, and improve Klyro. The
                types of information we collect depend on how you interact with our platform and may
                include:
              </p>
              <ul className="list-disc pl-5 text-fog space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong className="text-cream">Account credentials and profile data</strong>{" "}
                  provided during sign-up or authentication.
                </li>
                <li>
                  <strong className="text-cream">Authentication tokens and identifiers</strong>{" "}
                  received through third-party sign-in methods such as Google Sign-In.
                </li>
                <li>
                  <strong className="text-cream">Prompts, instructions, and messages</strong> you
                  enter into the AI builder to construct or modify projects.
                </li>
                <li>
                  <strong className="text-cream">Generated code, files, and project assets</strong>{" "}
                  synthesized in your workspace.
                </li>
                <li>
                  <strong className="text-cream">Technical, operational, and log data</strong>{" "}
                  automatically recorded when interacting with our servers.
                </li>
              </ul>
            </section>

            {/* 3. Information Collected Through Google Sign-In */}
            <section id="google-signin-collection" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                3. Information Collected Through Google Sign-In
              </h2>
              <p className="text-fog">
                Klyro supports &ldquo;Sign in with Google&rdquo; to provide a seamless, secure, and
                passwordless authentication experience using Google Identity Services and OAuth 2.0.
              </p>
              <p className="text-fog">
                When you choose to authenticate using Google Sign-In, Klyro receives basic identity
                credentials directly from Google that are strictly necessary to authenticate your
                account. This information may include:
              </p>
              <div className="rounded-md border border-slate-line bg-ink-raised p-4 sm:p-5 space-y-2">
                <ul className="list-disc pl-5 text-xs sm:text-sm text-fog space-y-1.5">
                  <li>
                    <strong className="text-cream">Full Name:</strong> Your Google profile display
                    name, given name, and family name.
                  </li>
                  <li>
                    <strong className="text-cream">Email Address:</strong> Your verified Google or
                    Gmail email address.
                  </li>
                  <li>
                    <strong className="text-cream">Google Account Identifier (&ldquo;sub&rdquo;):</strong>{" "}
                    A permanent, unique numerical identifier assigned by Google used as your stable
                    Klyro user ID. We do not use your email address as the primary identity key.
                  </li>
                  <li>
                    <strong className="text-cream">Profile Picture:</strong> Your public Google
                    profile image URL, if provided by your Google account.
                  </li>
                </ul>
              </div>
              <p className="text-xs text-fog">
                <strong className="text-amber">Scope Limitation:</strong> Klyro only requests the
                minimal standard OpenID Connect scopes (<code className="font-mono text-amber">openid</code>,{" "}
                <code className="font-mono text-amber">email</code>, and{" "}
                <code className="font-mono text-amber">profile</code>). Klyro does not request or access
                your Gmail inbox, emails, Google Drive files, calendar, address book, contacts, or any
                other unrelated Google services.
              </p>
            </section>

            {/* 4. How We Use Information */}
            <section id="how-we-use-information" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                4. How We Use Information
              </h2>
              <p className="text-fog">
                We process collected information solely for legitimate operational purposes necessary to
                deliver Klyro&apos;s website-building and AI features:
              </p>
              <ul className="list-disc pl-5 text-fog space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong className="text-cream">Authentication and Session Management:</strong> To
                  create or identify your account, verify your identity, maintain authenticated
                  sessions, and keep your workspace secure.
                </li>
                <li>
                  <strong className="text-cream">Providing Core Services:</strong> To process natural
                  language prompts, synthesize source code, compile component file trees, render live
                  previews, and facilitate code exports.
                </li>
                <li>
                  <strong className="text-cream">Project Association:</strong> To link created
                  projects, chat histories, and file trees to your authenticated user account so you can
                  access them on return visits.
                </li>
                <li>
                  <strong className="text-cream">Platform Protection:</strong> To prevent fraud, abuse,
                  denial-of-service attempts, and ensure high availability for all builders.
                </li>
                <li>
                  <strong className="text-cream">Essential Communications:</strong> To send critical
                  service-related notices such as security alerts, terms changes, or responses to
                  inquiries.
                </li>
              </ul>
            </section>

            {/* 5. Account Information */}
            <section id="account-information" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                5. Account Information
              </h2>
              <p className="text-fog">
                When an account is created—whether through email registration or Google Sign-In—we store
                a corresponding user record in our database containing your name, email address,
                assigned role, and timestamps for account creation and last login.
              </p>
              <p className="text-fog">
                For users who register directly using email and password, passwords are cryptographically
                hashed using industry-standard hashing algorithms before storage. We never store, log, or
                have access to plain-text passwords.
              </p>
            </section>

            {/* 6. Website / AI Builder Usage Data */}
            <section id="usage-data" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                6. Website / AI Builder Usage Data
              </h2>
              <p className="text-fog">
                To enable real-time web application generation and interactive previews, Klyro stores
                and processes:
              </p>
              <ul className="list-disc pl-5 text-fog space-y-1.5 text-xs sm:text-sm">
                <li>Prompt text and conversational revisions submitted during project generation.</li>
                <li>Project metadata including title, description, application type, and status.</li>
                <li>Source code files generated for each project (e.g., React, Next.js, TypeScript).</li>
                <li>Project export requests, such as ZIP bundle downloads.</li>
              </ul>
              <p className="text-fog">
                Your prompt submissions are transmitted securely to our AI synthesis pipeline (powered
                by Google Gemini) solely to produce the requested code files for your project.
              </p>
            </section>

            {/* 7. Cookies and Similar Technologies */}
            <section id="cookies" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                7. Cookies and Similar Technologies
              </h2>
              <p className="text-fog">
                Klyro uses essential first-party cookies and browser storage technologies strictly
                necessary to enable authentication and core functionality:
              </p>
              <div className="rounded-md border border-slate-line bg-ink-raised p-4 sm:p-5 space-y-3 text-xs sm:text-sm text-fog">
                <div>
                  <strong className="text-cream font-mono">klyro_session:</strong>
                  <p className="mt-0.5 text-xs">
                    An HTTP-only, secure, SameSite session cookie that stores your signed authentication
                    token. This prevents unauthorized scripts from accessing your credentials.
                  </p>
                </div>
                <div>
                  <strong className="text-cream font-mono">klyro_user &amp; local storage:</strong>
                  <p className="mt-0.5 text-xs">
                    Client-side browser storage used to preserve active workspace state, such as keeping
                    your drafted prompt intact when you navigate between landing pages and login.
                  </p>
                </div>
              </div>
              <p className="text-xs text-fog">
                Klyro does not deploy invasive cross-site advertising cookies or third-party behavioral
                tracking cookies.
              </p>
            </section>

            {/* 8. How We Store and Protect Information */}
            <section id="storage-protection" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                8. How We Store and Protect Information
              </h2>
              <p className="text-fog">
                We maintain rigorous technical, administrative, and physical security measures designed
                to protect your information against unauthorized access, destruction, loss, or
                alteration:
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1 text-xs">
                <div className="rounded border border-slate-line bg-ink-raised p-3.5">
                  <span className="font-mono text-amber text-[11px] uppercase tracking-wider block font-semibold">
                    In-Transit Encryption
                  </span>
                  <p className="mt-1 text-fog">
                    All network traffic between your browser and Klyro servers is encrypted via TLS 1.3 /
                    HTTPS protocols.
                  </p>
                </div>
                <div className="rounded border border-slate-line bg-ink-raised p-3.5">
                  <span className="font-mono text-amber text-[11px] uppercase tracking-wider block font-semibold">
                    At-Rest Encryption
                  </span>
                  <p className="mt-1 text-fog">
                    Databases, file backups, and storage volumes are protected with AES-256 standard
                    encryption at rest.
                  </p>
                </div>
                <div className="rounded border border-slate-line bg-ink-raised p-3.5">
                  <span className="font-mono text-amber text-[11px] uppercase tracking-wider block font-semibold">
                    Row-Level Security (RLS)
                  </span>
                  <p className="mt-1 text-fog">
                    Database tables enforce strict Row-Level Security policies to ensure users only have
                    access to their own records.
                  </p>
                </div>
                <div className="rounded border border-slate-line bg-ink-raised p-3.5">
                  <span className="font-mono text-amber text-[11px] uppercase tracking-wider block font-semibold">
                    Credential Isolation
                  </span>
                  <p className="mt-1 text-fog">
                    OAuth client secrets, database keys, and AI credentials are stored only in secure
                    server-side environments.
                  </p>
                </div>
              </div>
            </section>

            {/* 9. Data Sharing and Third Parties */}
            <section id="data-sharing" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                9. Data Sharing and Third Parties
              </h2>
              <p className="text-fog">
                Klyro does not sell, rent, monetize, or disclose your personal data to data brokers or
                unaffiliated third parties.
              </p>
              <p className="text-fog">
                We share data only with trusted service providers who perform infrastructure,
                hosting, and processing services strictly necessary to operate Klyro:
              </p>
              <ul className="list-disc pl-5 text-fog space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong className="text-cream">Hosting &amp; Edge Infrastructure (Vercel):</strong>{" "}
                  For running application servers, serverless API execution, and serving web assets.
                </li>
                <li>
                  <strong className="text-cream">Database Services (Supabase / PostgreSQL):</strong>{" "}
                  For securely persisting user records, project structures, and code files.
                </li>
                <li>
                  <strong className="text-cream">AI Generation Pipeline (Google Gemini API):</strong>{" "}
                  To process prompts and generate code. Prompts sent to the API are processed
                  in accordance with enterprise data protection terms to fulfill your generation
                  requests.
                </li>
                <li>
                  <strong className="text-cream">Identity Services (Google OAuth):</strong> For
                  verifying Google user authentication tokens when you log in.
                </li>
              </ul>
              <p className="text-xs text-fog">
                We may also disclose information if required by law, subpoena, or valid legal process,
                or to protect the safety, rights, and security of Klyro, our users, or the public.
              </p>
            </section>

            {/* 10. Google Sign-In and Google User Data */}
            <section id="google-user-data" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                10. Google Sign-In and Google User Data
              </h2>
              <p className="text-fog">
                Klyro&apos;s use and transfer of information received from Google APIs to any other app
                adheres to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber hover:underline"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
              <div className="rounded-md border border-slate-line bg-ink-raised p-4 sm:p-5 space-y-2 text-xs sm:text-sm text-fog">
                <p>
                  <strong className="text-cream">Limited Use Statement:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>
                    We only request Google data that is directly relevant and necessary to authenticate
                    your identity (name, email, profile picture, and Google user ID).
                  </li>
                  <li>
                    We do not use Google user data to serve advertisements, build consumer profiles, or
                    train generalized third-party machine learning models.
                  </li>
                  <li>
                    We do not transfer or disclose Google user data to external parties except to the
                    extent necessary to provide the authentication service or comply with applicable law.
                  </li>
                </ul>
              </div>
            </section>

            {/* 11. Data Retention */}
            <section id="data-retention" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                11. Data Retention
              </h2>
              <p className="text-fog">
                We retain your account information, workspace projects, and generated code for as long
                as your Klyro account remains active, or as necessary to provide you with the service.
              </p>
              <p className="text-fog">
                Technical logs (such as HTTP request logs and error traces) are retained for a limited
                operational period (typically 30 to 90 days) for security diagnostics and system
                monitoring, after which they are automatically rotated and permanently purged.
              </p>
            </section>

            {/* 12. Account and Data Deletion */}
            <section id="account-deletion" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                12. Account and Data Deletion
              </h2>
              <p className="text-fog">
                You have full control over your data on Klyro and may request complete deletion of your
                account and all associated personal information at any time.
              </p>
              <div className="rounded-md border border-slate-line bg-ink-raised p-4 sm:p-5 space-y-2.5 text-xs sm:text-sm text-fog">
                <p className="font-medium text-cream">How to Request Account Deletion:</p>
                <p>
                  To request the permanent deletion of your Klyro account, project code, and Google
                  identity associations, email our support team at{" "}
                  <a
                    href="mailto:support@klyro.ai"
                    className="font-mono text-amber hover:underline"
                  >
                    support@klyro.ai
                  </a>{" "}
                  or{" "}
                  <a
                    href="mailto:privacy@klyro.ai"
                    className="font-mono text-amber hover:underline"
                  >
                    privacy@klyro.ai
                  </a>{" "}
                  with the subject line <code className="font-mono text-cream">&ldquo;Account Deletion Request&rdquo;</code>.
                </p>
                <p>
                  Please send the request from the email address associated with your Klyro account so
                  that we can verify your identity.
                </p>
                <p>
                  Upon receiving and verifying your request, we will permanently delete your user
                  profile, database records, code repositories, and workspace history from our active
                  databases within thirty (30) days.
                </p>
              </div>
              <p className="text-xs text-fog">
                You can also revoke Klyro&apos;s authorization to your Google account at any time by
                visiting your{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber hover:underline"
                >
                  Google Account Permissions
                </a>{" "}
                dashboard.
              </p>
            </section>

            {/* 13. User Rights */}
            <section id="user-rights" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                13. User Rights
              </h2>
              <p className="text-fog">
                Depending on your jurisdiction (including the European Economic Area under GDPR and
                California under CCPA/CPRA), you have rights regarding your personal information:
              </p>
              <ul className="list-disc pl-5 text-fog space-y-1.5 text-xs sm:text-sm">
                <li>
                  <strong className="text-cream">Right of Access:</strong> You may request a copy of
                  the personal data we hold about you.
                </li>
                <li>
                  <strong className="text-cream">Right to Rectification:</strong> You may request that
                  we correct inaccurate or incomplete information.
                </li>
                <li>
                  <strong className="text-cream">Right to Erasure (&ldquo;Right to be Forgotten&rdquo;):</strong>{" "}
                  You may request the permanent deletion of your account and personal data.
                </li>
                <li>
                  <strong className="text-cream">Right to Data Portability:</strong> You can export and
                  download your generated code projects as complete ZIP archives directly from the
                  workspace at any time.
                </li>
                <li>
                  <strong className="text-cream">Right to Object / Restrict Processing:</strong> You may
                  request that we restrict processing of your data under certain circumstances.
                </li>
              </ul>
              <p className="text-xs text-fog">
                To exercise any of these rights, contact our privacy team at{" "}
                <a
                  href="mailto:privacy@klyro.ai"
                  className="font-mono text-amber hover:underline"
                >
                  privacy@klyro.ai
                </a>
                .
              </p>
            </section>

            {/* 14. Children's Privacy */}
            <section id="childrens-privacy" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                14. Children&apos;s Privacy
              </h2>
              <p className="text-fog">
                Klyro is intended for use by developers, professionals, and individuals who are at
                least 13 years old (or 16 in the European Economic Area).
              </p>
              <p className="text-fog">
                We do not knowingly collect or solicit personal information from children under 13. If
                we become aware that a child under 13 has provided us with personal information without
                parental consent, we take immediate steps to delete such information and terminate the
                account.
              </p>
            </section>

            {/* 15. Changes to This Privacy Policy */}
            <section id="changes" className="space-y-3">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                15. Changes to This Privacy Policy
              </h2>
              <p className="text-fog">
                We may periodically update this Privacy Policy to reflect changes in our platform,
                features, legal requirements, or authentication capabilities.
              </p>
              <p className="text-fog">
                When changes are made, we will update the &ldquo;Last updated&rdquo; date at the top of
                this page. For material updates, we will provide more prominent notice (such as an
                announcement banner on our homepage or notification within the builder). Continued use of
                Klyro after any updates indicates acceptance of the revised policy.
              </p>
            </section>

            {/* 16. Contact Us */}
            <section id="contact-us" className="space-y-3 rounded-md border border-slate-line bg-ink-raised p-6">
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-cream">
                16. Contact Us
              </h2>
              <p className="text-fog text-xs sm:text-sm">
                If you have questions, feedback, or privacy-related requests regarding this Privacy
                Policy or your Google authentication data, please reach out to us:
              </p>
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm">
                <p className="font-medium text-cream">Klyro Data Protection &amp; Privacy</p>
                <p className="text-fog">
                  Privacy Inquiries:{" "}
                  <a
                    href="mailto:privacy@klyro.ai"
                    className="font-mono text-amber hover:underline"
                  >
                    privacy@klyro.ai
                  </a>
                </p>
                <p className="text-fog">
                  General Support:{" "}
                  <a
                    href="mailto:support@klyro.ai"
                    className="font-mono text-amber hover:underline"
                  >
                    support@klyro.ai
                  </a>
                </p>
                <p className="text-fog">
                  Website:{" "}
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
