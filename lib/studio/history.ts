import type { RoutePoint } from "@/lib/types";

export type PointHistory = {
  past: RoutePoint[][];
  present: RoutePoint[];
  future: RoutePoint[][];
};

const clonePoints = (points: RoutePoint[]): RoutePoint[] =>
  points.map((point) => ({ ...point }));

export function createPointHistory(initial: RoutePoint[] = []): PointHistory {
  return {
    past: [],
    present: clonePoints(initial),
    future: [],
  };
}

export function applyPointUpdate(
  history: PointHistory,
  nextPoints: RoutePoint[],
): PointHistory {
  return {
    past: [...history.past, clonePoints(history.present)],
    present: clonePoints(nextPoints),
    future: [],
  };
}

export function undoPointUpdate(history: PointHistory): PointHistory {
  if (history.past.length === 0) {
    return history;
  }

  const previous = history.past[history.past.length - 1];
  return {
    past: history.past.slice(0, -1),
    present: clonePoints(previous),
    future: [clonePoints(history.present), ...history.future],
  };
}

export function redoPointUpdate(history: PointHistory): PointHistory {
  if (history.future.length === 0) {
    return history;
  }

  const next = history.future[0];
  return {
    past: [...history.past, clonePoints(history.present)],
    present: clonePoints(next),
    future: history.future.slice(1),
  };
}
