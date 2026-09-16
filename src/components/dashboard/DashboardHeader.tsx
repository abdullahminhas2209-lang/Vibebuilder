"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderPlus, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/lib/supabase/db";

interface DashboardHeaderProps {
  title: string;
  description: string;
  onProjectCreated?: () => void;
}

export function DashboardHeader({ title, description, onProjectCreated }: DashboardHeaderProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Web Application");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const newProj = await createProject({
        name: name.trim(),
        type,
        description: prompt.trim() || `Created with Klyro AI`,
        status: "active",
      });

      setOpen(false);
      setName("");
      setPrompt("");
      if (onProjectCreated) onProjectCreated();

      const targetUrl = prompt.trim()
        ? `/project/${newProj.id}?prompt=${encodeURIComponent(prompt.trim())}`
        : `/project/${newProj.id}`;
      router.push(targetUrl);
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-cream">
          {title}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-fog font-sans">{description}</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-sm bg-amber hover:bg-amber-deep text-[#14161f] font-mono text-xs font-semibold shadow-xs gap-1.5 transition-colors cursor-pointer px-3.5 py-2">
            <Plus className="size-4" aria-hidden="true" />
            <span>New Project</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-ink-raised border-slate-line text-cream shadow-2xl rounded-md p-6 font-sans">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-cream font-serif font-bold text-lg">
                <FolderPlus className="size-5 text-amber" />
                <span>Create New Project</span>
              </DialogTitle>
              <DialogDescription className="text-fog text-xs font-sans">
                Set up a new workspace and describe what you want the AI to generate.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-[11px] font-mono font-medium text-fog block mb-1.5 uppercase tracking-wider">
                  Project Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Modern Restaurant Portal"
                  className="bg-ink border-slate-line text-cream placeholder:text-fog-dim rounded-sm h-10 text-xs font-mono caret-amber focus:border-amber/60 focus:ring-1 focus:ring-amber/30"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-mono font-medium text-fog block mb-1.5 uppercase tracking-wider">
                  Project Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-sm border border-slate-line bg-ink px-3 py-2 text-xs font-mono text-cream shadow-xs focus:border-amber/60 focus:outline-none focus:ring-1 focus:ring-amber/30"
                >
                  <option value="Web Application" className="bg-ink text-cream">Web Application</option>
                  <option value="Landing Page" className="bg-ink text-cream">Landing Page</option>
                  <option value="E-commerce Store" className="bg-ink text-cream">E-commerce Store</option>
                  <option value="Portfolio Site" className="bg-ink text-cream">Portfolio Site</option>
                  <option value="Dashboard & Analytics" className="bg-ink text-cream">Dashboard & Analytics</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono font-medium text-fog block mb-1.5 uppercase tracking-wider">
                  Initial Prompt (Optional)
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what features, style, or components you'd like..."
                  rows={3}
                  className="resize-none bg-ink border-slate-line text-cream placeholder:text-fog-dim rounded-sm text-xs font-sans caret-amber focus:border-amber/60 focus:ring-1 focus:ring-amber/30"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-sm border-slate-line bg-ink text-fog hover:text-cream hover:bg-ink-raised text-xs font-mono cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !name.trim()}
                className="rounded-sm bg-amber hover:bg-amber-deep text-[#14161f] text-xs font-mono font-semibold shadow-xs cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5 text-[#14161f]" />
                    Creating...
                  </>
                ) : (
                  "Create & Open Workspace"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
