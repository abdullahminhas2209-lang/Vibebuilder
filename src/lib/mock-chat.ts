/**
 * Frontend-only mock assistant behavior for the chat panel.
 *
 * Phase 1: responses are simulated with static content and delays so the
 * workspace UX can be demonstrated without any AI service. Phase 2 can
 * replace `streamMockAssistantReply` with a real API call without
 * redesigning `ChatPanel`.
 */

import type { ChatMessage } from "@/lib/types";

export interface MockStatusStep {
  /** How long the step is displayed before moving on. */
  delayMs: number;
  text: string;
}

/** Sequential status messages shown while the mock assistant "works". */
export const MOCK_STATUS_STEPS: MockStatusStep[] = [
  { delayMs: 900, text: "Understanding your request..." },
  { delayMs: 1300, text: "Planning the interface..." },
  { delayMs: 1100, text: "Preparing the workspace..." },
];

/** Final assistant message once the mock generation "finishes". */
export function getMockAssistantReply(_prompt: string): string {
  void _prompt;
  return (
    "Your project structure is ready. I scaffolded a homepage with a hero, " +
    "featured dishes, and a reservation call-to-action. Preview it on the " +
    "right, then describe any changes and I'll refine the project."
  );
}

export const MOCK_THINKING_DELAY_MS = 700;

/**
 * Builds the ids for messages produced by one mock assistant run.
 * Kept here so ChatPanel stays presentational.
 */
export function createMockMessageId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createTimestamp(): string {
  return new Date().toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export type { ChatMessage };
