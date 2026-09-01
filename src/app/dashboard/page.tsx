import type { Metadata } from "next";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <section id="projects" aria-label="Your projects">
          <DashboardHeader
            title="Your Projects"
            description="Build, manage, and refine your applications."
          />
          <div className="mt-8">
            <ProjectGrid />
          </div>
        </section>
      </main>
    </DashboardShell>
  );
}
