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
        description: prompt.trim() || `Created with VibeBuilder AI`,
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
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-1.5 shadow-sm">
            <Plus className="size-4" aria-hidden="true" />
            <span>New Project</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                <span>Create New Project</span>
              </DialogTitle>
              <DialogDescription>
                Set up a new workspace and describe what you want the AI to generate.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Project Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Modern Restaurant Portal"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Project Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="Web Application">Web Application</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="E-commerce Store">E-commerce Store</option>
                  <option value="Portfolio Site">Portfolio Site</option>
                  <option value="Dashboard & Analytics">Dashboard & Analytics</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground block mb-1.5">
                  Initial Prompt (Optional)
                </label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what features, style, or components you'd like..."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !name.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-1.5" />
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
