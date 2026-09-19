/**
 * STATS STRIP DATA
 * NOTE FOR FOUNDER: Provide genuine verified metrics when available.
 * Any stat with a null, empty, or undefined value will be automatically hidden.
 * If all stats are null or empty, the stats strip will omit itself completely.
 */

export interface StatItem {
  id: string;
  label: string;
  value: string | null;
  description?: string | null;
}

export const STATS_DATA: StatItem[] = [
  {
    id: "apps-generated",
    label: "Apps Generated",
    value: null, // Placeholder: Set to verified count e.g. "12,000+" when live
    description: "Across starter and pro workspaces",
  },
  {
    id: "active-builders",
    label: "Active Builders",
    value: null, // Placeholder: Set to verified count e.g. "4,500+" when live
    description: "Developers and product designers",
  },
  {
    id: "avg-build-time",
    label: "Average Generation Time",
    value: null, // Placeholder: Set to verified metric e.g. "18s"
    description: "From prompt submission to sandbox preview",
  },
];
