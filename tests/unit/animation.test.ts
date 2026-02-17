import { describe, expect, it } from "vitest";

import {
  buildRouteMetrics,
  densifyRoute,
  getBearing,
  getPointAtProgress,
} from "@/lib/map/animation";
import type { RoutePoint } from "@/lib/types";

const points: RoutePoint[] = [
  { id: "a", lng: -73.9851, lat: 40.7589 },
  { id: "b", lng: -0.1278, lat: 51.5074 },
  { id: "c", lng: 2.3522, lat: 48.8566 },
];

describe("map animation utilities", () => {
  it("builds route metrics with cumulative distances", () => {
    const metrics = buildRouteMetrics(points);

    expect(metrics.segments.length).toBe(2);
    expect(metrics.totalDistance).toBeGreaterThan(0);
    expect(metrics.segments[1].cumulativeStart).toBeGreaterThan(0);
  });

  it("computes a stable bearing", () => {
    const bearing = getBearing(points[0], points[1]);

    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThanOrEqual(360);
  });

  it("returns interpolated progress points", () => {
    const frame = getPointAtProgress(points, 0.5);

    expect(frame.lng).toBeTypeOf("number");
    expect(frame.lat).toBeTypeOf("number");
    expect(frame.bearing).toBeTypeOf("number");
  });

  it("densifies route according to smoothness", () => {
    const coords = densifyRoute(points, 60);

    expect(coords.length).toBeGreaterThan(100);
  });
});
