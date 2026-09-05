import { LogoMark } from "@/components/brand/Logo";
import { mockUser } from "@/lib/mock-data";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-2.5 animate-fade-up", isUser && "flex-row-reverse")}>
      {isUser ? (
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] font-bold text-white shadow-xs"
        >
          {mockUser.initials}
        </span>
      ) : (
        <LogoMark className="size-7 shrink-0 rounded-full" />
      )}

      <div
        className={cn(
          "flex max-w-[85%] min-w-0 flex-col gap-1",
          isUser && "items-end",
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed",
            isUser
              ? "rounded-br-sm bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md font-normal"
              : "rounded-bl-sm bg-slate-900/90 border border-slate-800 text-slate-200 shadow-xs",
          )}
        >
          {message.content}
        </div>
        <p
          className={cn(
            "px-1 text-[11px] text-slate-500 font-medium",
            isUser && "text-right",
          )}
        >
          {isUser ? "You" : "Klyro"} · {message.createdAt}
        </p>
      </div>
    </div>
  );
}
