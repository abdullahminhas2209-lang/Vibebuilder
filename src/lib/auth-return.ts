/**
 * Klyro AI Authentication Return & Prompt Preservation State Manager
 * Handles seamless preservation of user prompts across authentication boundaries
 * with open-redirect protection and storage sync.
 */

export interface AuthReturnState {
  prompt: string;
  returnUrl: string;
  action: "build" | "general";
  timestamp: number;
}

const STORAGE_KEY = "klyro_auth_return";
const LEGACY_PROMPT_KEY = "klyro_pending_prompt";

/**
 * Validates and sanitizes a return URL to prevent open-redirect vulnerabilities.
 * Ensures the destination is strictly a relative internal path on this Klyro app.
 */
export function sanitizeReturnUrl(url: string | null | undefined): string {
  if (!url || typeof url !== "string") {
    return "/";
  }

  const trimmed = url.trim();

  // Block protocols, protocol-relative URLs, javascript, and data URLs
  if (
    trimmed.startsWith("//") ||
    trimmed.startsWith("\\\\") ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) ||
    trimmed.includes("javascript:") ||
    trimmed.includes("data:")
  ) {
    return "/";
  }

  // Must begin with single forward slash
  if (!trimmed.startsWith("/")) {
    return `/${trimmed}`;
  }

  return trimmed;
}

/**
 * Saves pending workflow state before redirecting to Sign In / Sign Up.
 */
export function saveAuthReturnState({
  prompt,
  returnUrl = "/",
  action = "build",
}: {
  prompt: string;
  returnUrl?: string;
  action?: "build" | "general";
}): void {
  if (typeof window === "undefined") return;

  const sanitizedUrl = sanitizeReturnUrl(returnUrl);
  const state: AuthReturnState = {
    prompt: prompt.trim(),
    returnUrl: sanitizedUrl,
    action,
    timestamp: Date.now(),
  };

  const serialized = JSON.stringify(state);

  try {
    sessionStorage.setItem(STORAGE_KEY, serialized);
    sessionStorage.setItem(LEGACY_PROMPT_KEY, state.prompt);
  } catch (e) {
    console.warn("sessionStorage unavailable:", e);
  }

  try {
    localStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(LEGACY_PROMPT_KEY, state.prompt);
  } catch (e) {
    console.warn("localStorage unavailable:", e);
  }
}

/**
 * Reads pending return state without removing it (e.g. for page displays, refreshes, or previews).
 */
export function getAuthReturnState(): AuthReturnState | null {
  if (typeof window === "undefined") return null;

  let serialized: string | null = null;
  try {
    serialized = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
  } catch {
    // storage blocked or private browsing
  }

  if (serialized) {
    try {
      const parsed = JSON.parse(serialized) as AuthReturnState;
      if (parsed && typeof parsed.prompt === "string") {
        return {
          prompt: parsed.prompt,
          returnUrl: sanitizeReturnUrl(parsed.returnUrl),
          action: parsed.action || "build",
          timestamp: parsed.timestamp || Date.now(),
        };
      }
    } catch {
      // JSON parse failure
    }
  }

  // Check legacy prompt storage
  try {
    const legacyPrompt =
      sessionStorage.getItem(LEGACY_PROMPT_KEY) || localStorage.getItem(LEGACY_PROMPT_KEY);
    if (legacyPrompt && legacyPrompt.trim()) {
      return {
        prompt: legacyPrompt.trim(),
        returnUrl: "/",
        action: "build",
        timestamp: Date.now(),
      };
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Consumes and clears the pending return state so it is restored only once.
 */
export function consumeAuthReturnState(): AuthReturnState | null {
  const state = getAuthReturnState();
  clearAuthReturnState();
  return state;
}

/**
 * Clears pending state from all client storage mechanisms.
 */
export function clearAuthReturnState(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(LEGACY_PROMPT_KEY);
  } catch {
    // ignore
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_PROMPT_KEY);
  } catch {
    // ignore
  }
}
