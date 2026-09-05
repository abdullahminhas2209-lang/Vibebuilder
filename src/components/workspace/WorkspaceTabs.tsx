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
      className="h-full min-h-0 gap-0 bg-[#0B0F19]"
    >
      <div className="flex h-12 shrink-0 items-center border-b border-slate-800 px-3 bg-[#0B0F19]">
        <TabsList className="h-8 bg-slate-900/90 border border-slate-800 p-0.5 rounded-xl">
          <TabsTrigger
            value="preview"
            className="px-3 text-xs font-semibold text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg"
          >
            <Eye className="size-3.5 mr-1.5" aria-hidden="true" />
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="px-3 text-xs font-semibold text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg"
          >
            <Code2 className="size-3.5 mr-1.5" aria-hidden="true" />
            Code
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="preview"
        className="min-h-0 flex-1 data-[state=active]:animate-fade-in m-0 h-[calc(100%-48px)]"
      >
        {preview}
      </TabsContent>
      <TabsContent
        value="code"
        className="min-h-0 flex-1 data-[state=active]:animate-fade-in m-0 h-[calc(100%-48px)]"
      >
        {code}
      </TabsContent>
    </Tabs>
  );
}
