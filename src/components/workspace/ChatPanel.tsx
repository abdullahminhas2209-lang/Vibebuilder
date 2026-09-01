"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, SendHorizontal, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/workspace/ChatMessage";
import {
  createMockMessageId,
  createTimestamp,
  getMockAssistantReply,
  MOCK_STATUS_STEPS,
  MOCK_THINKING_DELAY_MS,
} from "@/lib/mock-chat";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "Build a modern restaurant website with online reservations.",
  "Create a personal portfolio with a projects and writing section.",
] as const;

export function ChatPanel({
  initialMessages,
}: {
  initialMessages: ChatMessageType[];
}) {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [input, setInput] = useState("");
  const [responding, setResponding] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);

  // Clear any pending mock-response timers when the panel unmounts.
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  // Keep the conversation pinned to the latest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, statusText]);

  function scheduleTimer(callback: () => void, delayMs: number) {
    const timer = window.setTimeout(callback, delayMs);
    timersRef.current.push(timer);
  }

  function handleSubmit() {
    const content = input.trim();
    if (!content || responding) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        id: createMockMessageId("msg-user"),
        role: "user",
        content,
        createdAt: createTimestamp(),
      },
    ]);
    setInput("");
    setResponding(true);
    setStatusText(null);

    // Mock assistant run — frontend only. Phase 2 replaces this block
    // with a real agent API call; the surrounding UI stays unchanged.
    scheduleTimer(() => setStatusText(MOCK_STATUS_STEPS[0].text), 0);
    let elapsed = MOCK_STATUS_STEPS[0].delayMs;
    for (const step of MOCK_STATUS_STEPS.slice(1)) {
      scheduleTimer(() => setStatusText(step.text), elapsed);
      elapsed += step.delayMs;
    }

    scheduleTimer(() => {
      setMessages((previous) => [
        ...previous,
        {
          id: createMockMessageId("msg-assistant"),
          role: "assistant",
          content: getMockAssistantReply(content),
          createdAt: createTimestamp(),
        },
      ]);
      setResponding(false);
      setStatusText(null);
    }, elapsed + MOCK_THINKING_DELAY_MS);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border px-4">
        <p className="text-sm font-medium">Chat</p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full",
              responding
                ? "animate-pulse bg-primary"
                : "bg-muted-foreground/50",
            )}
          />
          {responding ? "Working..." : "Agent ready"}
        </p>
      </div>

      <div
        className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 scrollbar-panel"
        aria-live="polite"
      >
        {messages.length === 0 && !responding ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-accent text-primary">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-sm font-semibold">
              Start the conversation
            </h2>
            <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
              Describe the application you want and the agent will plan it,
              generate the code, and open a live preview.
            </p>
            <div className="mt-5 w-full space-y-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-ring/40 hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {responding && (
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                <span className="flex gap-1" aria-hidden="true">
                  <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:300ms]" />
                </span>
                <span>{statusText ?? "Thinking..."}</span>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="shrink-0 border-t border-border p-3"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="rounded-lg border border-border bg-card transition-colors focus-within:border-ring/50">
          <label htmlFor="chat-input" className="sr-only">
            Describe a change for the agent
          </label>
          <Textarea
            id="chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Describe a change..."
            rows={2}
            className="max-h-32 resize-none border-0 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center justify-between px-2 pb-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled
              aria-label="Attachments are not available yet"
            >
              <Paperclip className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="submit"
              size="icon-sm"
              disabled={!input.trim() || responding}
              aria-label="Send message"
            >
              <SendHorizontal className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Prototype — the agent is simulated and no code is actually generated.
        </p>
      </form>
    </div>
  );
}
