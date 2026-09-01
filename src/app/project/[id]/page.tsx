import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import {
  demoProjectId,
  getInitialChatMessages,
  getProjectById,
  getProjectFileMap,
  getProjectFileTree,
  projects,
} from "@/lib/mock-data";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

/** Prerender every known mock project; unknown ids get a real 404. */
export function generateStaticParams() {
  return [
    ...projects.map((project) => ({ id: project.id })),
    { id: demoProjectId },
  ];
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);
  return { title: project ? project.name : "Project" };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
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
