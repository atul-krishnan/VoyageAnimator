import type { RouteProjectInput, RouteProjectSummary } from "@/lib/types";

export function mergeLocalAndRemote(
  localProjects: RouteProjectInput[],
  remoteProjects: RouteProjectSummary[],
): { toCreate: RouteProjectInput[]; skipped: number } {
  const remoteNames = new Set(
    remoteProjects.map((project) => project.name.trim().toLowerCase()),
  );
  const remoteSignatures = new Set(
    remoteProjects.map((project) =>
      JSON.stringify({
        name: project.name.trim().toLowerCase(),
        mapStyleId: project.mapStyleId,
        vehicleModelId: project.vehicleModelId,
      }),
    ),
  );

  const deduped = localProjects.filter((project) => {
    const matchesName = remoteNames.has(project.name.trim().toLowerCase());
    const matchesSignature = remoteSignatures.has(
      JSON.stringify({
        name: project.name.trim().toLowerCase(),
        mapStyleId: project.mapStyleId,
        vehicleModelId: project.vehicleModelId,
      }),
    );
    return !(matchesName || matchesSignature);
  });

  return {
    toCreate: deduped,
    skipped: localProjects.length - deduped.length,
  };
}
