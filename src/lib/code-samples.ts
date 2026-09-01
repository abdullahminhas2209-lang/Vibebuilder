import type { ProjectFile } from "@/lib/types";
import { restaurantFiles } from "@/lib/samples/restaurant";
import { saasFiles } from "@/lib/samples/saas";
import { portfolioFiles } from "@/lib/samples/portfolio";
import { ecommerceFiles } from "@/lib/samples/ecommerce";
import { fitnessFiles } from "@/lib/samples/fitness";

/** Mock project ids that ship with generated sample source files. */
export type SampleProjectId =
  | "restaurant-booking"
  | "saas-analytics"
  | "personal-portfolio"
  | "ecommerce-store"
  | "fitness-landing";

/**
 * Static example source code shown in the workspace code panel, per mock
 * project. Phase 1 only: these files are display data, not a real file
 * system. The demo project ships without files until the agent "generates".
 */
const sampleFilesByProject: Record<SampleProjectId, ProjectFile[]> = {
  "restaurant-booking": restaurantFiles,
  "saas-analytics": saasFiles,
  "personal-portfolio": portfolioFiles,
  "ecommerce-store": ecommerceFiles,
  "fitness-landing": fitnessFiles,
};

export function getSampleFiles(projectId: string): ProjectFile[] {
  return sampleFilesByProject[projectId as SampleProjectId] ?? [];
}
