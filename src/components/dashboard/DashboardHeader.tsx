"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Sparkles } from "lucide-react";

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
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">{description}</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 hover:from-indigo-500 hover:to-blue-500 gap-1.5 transition-all hover:scale-[1.02]">
            <Plus className="size-4" aria-hidden="true" />
            <span>New Project</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg bg-[#0B0F19] border-slate-800 text-slate-100 ring-1 ring-white/10 rounded-3xl p-6">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-white font-bold text-lg">
                <Sparkles className="size-5 text-indigo-400" />
                <span>Create New Project</span>
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Set up a new workspace and describe what you want the AI to generate.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-xs font-medium text-slate-200 block mb-1.5">
                  Project Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Modern Restaurant Portal"
                  className="bg-slate-950 border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl h-10 text-xs caret-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-200 block mb-1.5">
                  Project Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/80 bg-slate-950 px-3 py-2 text-xs text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Web Application" className="bg-slate-900 text-white">Web Application</option>
                  <option value="Landing Page" className="bg-slate-900 text-white">Landing Page</option>
                  <option value="E-commerce Store" className="bg-slate-900 text-white">E-commerce Store</option>
                  <option value="Portfolio Site" className="bg-slate-900 text-white">Portfolio Site</option>
                  <option value="Dashboard & Analytics" className="bg-slate-900 text-white">Dashboard & Analytics</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-200 block mb-1.5">
                  Initial Prompt (Optional)
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what features, style, or components you'd like..."
                  rows={3}
                  className="resize-none bg-slate-950 border-slate-700/80 text-white placeholder:text-slate-500 rounded-xl text-xs caret-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-xl border-slate-700 bg-slate-800 text-white text-xs hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !name.trim()}
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold hover:from-indigo-500 hover:to-blue-500 shadow-md shadow-indigo-600/25"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
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
