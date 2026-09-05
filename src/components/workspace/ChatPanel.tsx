"use client";

import { useEffect, useRef, useState } from "react";
import { Paperclip, SendHorizontal, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/workspace/ChatMessage";
import { createMockMessageId, createTimestamp } from "@/lib/mock-chat";
import { parseGeneratedFiles, buildFileTree, extractProse } from "@/lib/parse-ai-response";
import { saveChatMessage } from "@/lib/supabase/db";
import type { ChatMessage as ChatMessageType, ProjectFile, FileNode } from "@/lib/types";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "Build a modern SaaS landing page with pricing, features, and user testimonials.",
  "Build a luxury restaurant website with interactive menu and reservation flow.",
  "Create a developer portfolio with dark mode, project showcase, and contact form.",
  "Design a sleek e-commerce storefront with product filters, cart, and checkout.",
  "Build a fitness and gym website with class schedules, trainer bios, and membership tiers.",
] as const;

interface ChatPanelProps {
  projectId?: string;
  initialPrompt?: string | null;
  initialMessages: ChatMessageType[];
  onFilesGenerated?: (files: ProjectFile[], tree: FileNode[]) => void;
}

export function ChatPanel({
  projectId = "demo",
  initialPrompt,
  initialMessages,
  onFilesGenerated,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>(initialMessages);
  const [input, setInput] = useState("");
  const [responding, setResponding] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const initialPromptExecutedRef = useRef(false);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, statusText]);

  // If an initial prompt is passed from the Hero or URL query, auto-trigger generation!
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && !initialPromptExecutedRef.current) {
      initialPromptExecutedRef.current = true;
      executePrompt(initialPrompt.trim());
    }
  }, [initialPrompt]);

  async function executePrompt(promptText: string) {
    const content = promptText.trim();
    if (!content || responding) return;

    const userMessage: ChatMessageType = {
      id: createMockMessageId("msg-user"),
      role: "user",
      content,
      createdAt: createTimestamp(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setResponding(true);
    setStatusText("Thinking...");

    // Persist user message to DB
    if (projectId) {
      saveChatMessage(projectId, { role: "user", content });
    }

    // Placeholder assistant message that streams in
    const assistantId = createMockMessageId("msg-assistant");
    const assistantPlaceholder: ChatMessageType = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: createTimestamp(),
      pending: true,
    };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      abortRef.current = new AbortController();

      // Build conversation history for Gemini
      const history = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";
      setStatusText("Generating components...");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        // Stream text into the assistant message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: extractProse(fullText) || fullText, pending: true }
              : m
          )
        );
      }

      // Parse generated files from the complete response
      const generatedFiles = parseGeneratedFiles(fullText);
      const fileTree = buildFileTree(generatedFiles);

      // Finalize assistant message with prose only
      const finalContent = extractProse(fullText) || fullText;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: finalContent, pending: false } : m
        )
      );

      // Persist assistant message to DB
      if (projectId) {
        saveChatMessage(projectId, { role: "assistant", content: finalContent });
      }

      // Notify parent of new files
      if (generatedFiles.length > 0 && onFilesGenerated) {
        onFilesGenerated(generatedFiles, fileTree);
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") return;

      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Sorry, I encountered an issue generating the code. Please try again.",
                pending: false,
              }
            : m
        )
      );
    } finally {
      setResponding(false);
      setStatusText(null);
    }
  }

  function handleSubmit() {
    executePrompt(input);
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#0B0F19] text-slate-200">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-800 px-4 bg-[#0B0F19]">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Prompt & Chat</p>
        <p className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span
            aria-hidden="true"
            className={cn(
              "size-2 rounded-full",
              responding
                ? "animate-pulse bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
            )}
          />
          {responding ? "Generating..." : "Gemini 3.5 Flash"}
        </p>
      </div>

      <div
        className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 scrollbar-panel"
        aria-live="polite"
      >
        {messages.length === 0 && !responding ? (
          <div className="flex h-full flex-col items-center justify-center px-2 py-4 text-center">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner mb-3">
              <Sparkles className="size-5" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-bold text-white">
              What would you like to build?
            </h2>
            <p className="mt-1.5 max-w-xs text-xs text-slate-400 mb-5 leading-relaxed">
              Describe any website, landing page, or web app and Klyro will generate all components and render a live preview.
            </p>
            <div className="w-full space-y-2 text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">Suggested Prompts:</p>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => executePrompt(prompt)}
                  className="w-full rounded-xl border border-slate-800/90 bg-slate-900/80 p-2.5 text-left text-xs text-slate-300 transition-all hover:border-indigo-500/50 hover:bg-slate-800/80 hover:text-white focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:outline-none"
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
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-300">
                <span className="flex gap-1" aria-hidden="true">
                  <span className="size-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:300ms]" />
                </span>
                <span className="font-medium">{statusText ?? "Thinking..."}</span>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        className="shrink-0 border-t border-slate-800 bg-[#0B0F19] p-3"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <div className="rounded-2xl border border-slate-700/80 bg-slate-950 p-2 shadow-inner transition-all duration-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
          <label htmlFor="chat-input" className="sr-only">
            Describe what you want to build
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
            placeholder="Ask a question or describe what to build..."
            rows={2}
            className="min-h-[44px] max-h-32 resize-none border-0 bg-transparent text-xs sm:text-sm font-medium text-white placeholder:text-slate-500 shadow-none focus-visible:ring-0 caret-white"
          />
          <div className="flex items-center justify-between px-1.5 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled
              aria-label="Attachments"
              title="Attachments"
              className="text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded-lg"
            >
              <Paperclip className="size-4" aria-hidden="true" />
            </Button>
            <Button
              type="submit"
              size="icon-sm"
              disabled={!input.trim() || responding}
              aria-label="Send message"
              className="rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-md shadow-indigo-600/30 hover:from-indigo-500 hover:to-blue-500 hover:shadow-indigo-600/50 disabled:opacity-40 transition-all cursor-pointer"
            >
              <SendHorizontal className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-500 font-medium">
          Powered by Gemini 3.5 Flash · Realtime Live Preview
        </p>
      </form>
    </div>
  );
}
