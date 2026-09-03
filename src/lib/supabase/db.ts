import { supabase, isSupabaseConfigured } from "./client";
import { projects as mockProjects, getProjectById as getMockProjectById, demoProjectId, demoProject } from "@/lib/mock-data";
import { getSampleFiles } from "@/lib/code-samples";
import type { Project, ProjectFile, ChatMessage } from "@/lib/types";

const LOCAL_STORAGE_PROJECTS_KEY = "vibebuilder_projects";
const LOCAL_STORAGE_FILES_KEY = "vibebuilder_files_";
const LOCAL_STORAGE_CHATS_KEY = "vibebuilder_chats_";

// In-memory fallback if localStorage is unavailable (e.g. during SSR)
let memoryProjects: Project[] = [...mockProjects];
const memoryFiles: Record<string, ProjectFile[]> = {};
const memoryChats: Record<string, ChatMessage[]> = {};

/**
 * Get all projects (from Supabase or local store)
 */
export async function getProjects(): Promise<Project[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description || "",
          type: p.type || "Web Application",
          status: p.status || "active",
          lastUpdated: new Date(p.updated_at).toLocaleDateString(),
          createdAt: new Date(p.created_at).toLocaleDateString(),
          generated: true,
        }));
      }
    } catch (err) {
      console.warn("Supabase getProjects error, falling back to local:", err);
    }
  }

  // Local Storage fallback
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  return memoryProjects;
}

/**
 * Get a specific project by ID
 */
export async function getProject(id: string): Promise<Project | undefined> {
  if (id === demoProjectId) {
    return demoProject;
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          description: data.description || "",
          type: data.type || "Web Application",
          status: data.status || "active",
          lastUpdated: new Date(data.updated_at).toLocaleDateString(),
          createdAt: new Date(data.created_at).toLocaleDateString(),
          generated: true,
        };
      }
    } catch (err) {
      console.warn("Supabase getProject error:", err);
    }
  }

  // Fallback to local
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      if (stored) {
        const list: Project[] = JSON.parse(stored);
        const match = list.find((p) => p.id === id);
        if (match) return match;
      }
    } catch {
      // ignore
    }
  }

  return getMockProjectById(id);
}

/**
 * Create a new project
 */
export async function createProject(project: Partial<Project> & { name: string }): Promise<Project> {
  const id = project.id || `proj_${Date.now()}`;
  const now = new Date().toISOString();
  const newProject: Project = {
    id,
    name: project.name,
    description: project.description || "Created with VibeBuilder AI",
    type: project.type || "Web Application",
    status: project.status || "active",
    lastUpdated: "Just now",
    createdAt: new Date().toLocaleDateString(),
    generated: true,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("projects").insert({
        id: newProject.id,
        name: newProject.name,
        description: newProject.description,
        type: newProject.type,
        status: newProject.status,
        created_at: now,
        updated_at: now,
      });
    } catch (err) {
      console.warn("Supabase createProject error:", err);
    }
  }

  // Save locally
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      const list: Project[] = stored ? JSON.parse(stored) : [...mockProjects];
      list.unshift(newProject);
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  memoryProjects = [newProject, ...memoryProjects];
  return newProject;
}

/**
 * Update project details (e.g. rename)
 */
export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from("projects")
        .update({
          name: updates.name,
          description: updates.description,
          status: updates.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    } catch (err) {
      console.warn("Supabase updateProject error:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      const list: Project[] = stored ? JSON.parse(stored) : [...mockProjects];
      const idx = list.findIndex((p) => p.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates, lastUpdated: "Just now" };
        localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(list));
        return list[idx];
      }
    } catch {
      // ignore
    }
  }

  return null;
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("projects").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase deleteProject error:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
      if (stored) {
        const list: Project[] = JSON.parse(stored);
        const filtered = list.filter((p) => p.id !== id);
        localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(filtered));
      }
      localStorage.removeItem(LOCAL_STORAGE_FILES_KEY + id);
      localStorage.removeItem(LOCAL_STORAGE_CHATS_KEY + id);
    } catch {
      // ignore
    }
  }

  memoryProjects = memoryProjects.filter((p) => p.id !== id);
  return true;
}

/**
 * Get project files
 */
export async function getProjectFiles(projectId: string): Promise<ProjectFile[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("project_files")
        .select("*")
        .eq("project_id", projectId);

      if (!error && data && data.length > 0) {
        return data.map((f) => ({
          path: f.path,
          name: f.name,
          language: f.language || "tsx",
          code: f.code || "",
        }));
      }
    } catch (err) {
      console.warn("Supabase getProjectFiles error:", err);
    }
  }

  // Local Storage
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_FILES_KEY + projectId);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  if (memoryFiles[projectId]) {
    return memoryFiles[projectId];
  }

  return getSampleFiles(projectId);
}

/**
 * Save / update project files
 */
export async function saveProjectFiles(projectId: string, files: ProjectFile[]): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const rows = files.map((f) => ({
        project_id: projectId,
        path: f.path,
        name: f.name,
        language: f.language || "tsx",
        code: f.code || "",
        updated_at: new Date().toISOString(),
      }));

      await supabase.from("project_files").upsert(rows, { onConflict: "project_id,path" });
    } catch (err) {
      console.warn("Supabase saveProjectFiles error:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_FILES_KEY + projectId, JSON.stringify(files));
    } catch {
      // ignore
    }
  }

  memoryFiles[projectId] = files;
  return true;
}

/**
 * Get chat messages for a project
 */
export async function getChatMessages(projectId: string): Promise<ChatMessage[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));
      }
    } catch (err) {
      console.warn("Supabase getChatMessages error:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CHATS_KEY + projectId);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }

  return memoryChats[projectId] || [];
}

/**
 * Save a chat message
 */
export async function saveChatMessage(projectId: string, message: { role: "user" | "assistant" | "system"; content: string }): Promise<void> {
  const newMsg: ChatMessage = {
    id: `msg_${Date.now()}`,
    role: message.role,
    content: message.content,
    createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from("chat_messages").insert({
        project_id: projectId,
        role: message.role,
        content: message.content,
      });
    } catch (err) {
      console.warn("Supabase saveChatMessage error:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CHATS_KEY + projectId);
      const list: ChatMessage[] = stored ? JSON.parse(stored) : [];
      list.push(newMsg);
      localStorage.setItem(LOCAL_STORAGE_CHATS_KEY + projectId, JSON.stringify(list));
    } catch {
      // ignore
    }
  }

  if (!memoryChats[projectId]) memoryChats[projectId] = [];
  memoryChats[projectId].push(newMsg);
}
