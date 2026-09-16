"use client";

import type { ReactNode } from "react";
import { Code2, Eye } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkspaceTabsProps {
  value: "preview" | "code";
  onValueChange: (value: "preview" | "code") => void;
  preview: ReactNode;
  code: ReactNode;
}

export function WorkspaceTabs({
  value,
  onValueChange,
  preview,
  code,
}: WorkspaceTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as "preview" | "code")}
      className="h-full min-h-0 gap-0 bg-ink"
    >
      <div className="flex h-11 shrink-0 items-center border-b border-slate-line px-3 bg-ink">
        <TabsList className="h-8 bg-ink-raised border border-slate-line p-0.5 rounded-sm">
          <TabsTrigger
            value="preview"
            className="px-3 text-xs font-mono font-medium text-fog data-[state=active]:bg-amber data-[state=active]:text-[#14161f] data-[state=active]:shadow-xs rounded-sm transition-colors"
          >
            <Eye className="size-3.5 mr-1.5" aria-hidden="true" />
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="px-3 text-xs font-mono font-medium text-fog data-[state=active]:bg-amber data-[state=active]:text-[#14161f] data-[state=active]:shadow-xs rounded-sm transition-colors"
          >
            <Code2 className="size-3.5 mr-1.5" aria-hidden="true" />
            Code
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="preview"
        className="min-h-0 flex-1 data-[state=active]:animate-fade-in m-0 h-[calc(100%-44px)]"
      >
        {preview}
      </TabsContent>
      <TabsContent
        value="code"
        className="min-h-0 flex-1 data-[state=active]:animate-fade-in m-0 h-[calc(100%-44px)]"
      >
        {code}
      </TabsContent>
    </Tabs>
  );
}
