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
      className="h-full min-h-0 gap-0"
    >
      <div className="flex h-11 shrink-0 items-center border-b border-border px-3">
        <TabsList className="h-8">
          <TabsTrigger value="preview" className="px-3">
            <Eye aria-hidden="true" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="px-3">
            <Code2 aria-hidden="true" />
            Code
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value="preview"
        className="min-h-0 flex-1 data-[state=active]:animate-fade-in"
      >
        {preview}
      </TabsContent>
      <TabsContent
        value="code"
        className="min-h-0 flex-1 data-[state=active]:animate-fade-in"
      >
        {code}
      </TabsContent>
    </Tabs>
  );
}
