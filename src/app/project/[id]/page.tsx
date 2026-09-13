import type { Metadata } from "next";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  demoProjectId,
  getInitialChatMessages,
  getProjectById,
  getProjectFileMap,
  getProjectFileTree,
  projects,
} from "@/lib/mock-data";
import { getProject } from "@/lib/supabase/db";
import type { Project } from "@/lib/types";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

/** Prerender preset mock projects */
export function generateStaticParams() {
  return [
    ...projects.map((project) => ({ id: project.id })),
    { id: demoProjectId },
  ];
}

// Allow dynamic project IDs for newly created projects
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  let project: Project | undefined = getProjectById(id);
  if (!project) {
    project = await getProject(id);
  }
  return { title: project ? `${project.name} · Klyro` : "Klyro Workspace" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  let project: Project | undefined = getProjectById(id);

  // If newly created project ID not in static presets, check database
  if (!project) {
    project = await getProject(id);
  }

  // If still not found in DB, initialize fresh workspace descriptor
  if (!project) {
    project = {
      id,
      name: "New Application",
      description: "A new workspace ready for your prompts.",
      type: "Web Application",
      status: "active",
      lastUpdated: "Just now",
      createdAt: "Today",
      generated: false,
    };
  }

  return (
    <WorkspaceShell
      project={project}
      fileTree={getProjectFileTree(id)}
      fileMap={getProjectFileMap(id)}
      initialMessages={getInitialChatMessages(id)}
    />
  );
}
