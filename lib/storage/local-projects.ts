import type { RouteProjectInput } from "@/lib/types";

const LOCAL_PROJECTS_KEY = "voyagraph.local.projects.v1";

function safeParse(value: string | null): RouteProjectInput[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as RouteProjectInput[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readLocalProjects(): RouteProjectInput[] {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse(window.localStorage.getItem(LOCAL_PROJECTS_KEY));
}

export function writeLocalProjects(projects: RouteProjectInput[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(projects));
}

export function saveLocalProject(project: RouteProjectInput): RouteProjectInput[] {
  const existing = readLocalProjects();
  const index = existing.findIndex(
    (item) => item.name.trim().toLowerCase() === project.name.trim().toLowerCase(),
  );

  if (index >= 0) {
    existing[index] = project;
  } else {
    existing.unshift(project);
  }

  writeLocalProjects(existing);
  return existing;
}

export function localMergeFlagKey(userId: string): string {
  return `voyagraph.local.merge.${userId}`;
}
