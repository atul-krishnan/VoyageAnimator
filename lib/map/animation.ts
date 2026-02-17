import type { RoutePoint } from "@/lib/types";

type SegmentMetric = {
  start: RoutePoint;
  end: RoutePoint;
  distance: number;
  cumulativeStart: number;
};

export type RouteMetrics = {
  totalDistance: number;
  segments: SegmentMetric[];
};

const toRadians = (value: number): number => (value * Math.PI) / 180;
const toDegrees = (value: number): number => (value * 180) / Math.PI;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export function haversineDistanceKm(from: RoutePoint, to: RoutePoint): number {
  const radiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radiusKm * c;
}

export function getBearing(from: RoutePoint, to: RoutePoint): number {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const dLng = toRadians(to.lng - from.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

export function buildRouteMetrics(points: RoutePoint[]): RouteMetrics {
  if (points.length < 2) {
    return { totalDistance: 0, segments: [] };
  }

  let cumulative = 0;

  const segments: SegmentMetric[] = points.slice(1).map((point, index) => {
    const start = points[index];
    const distance = haversineDistanceKm(start, point);
    const segment: SegmentMetric = {
      start,
      end: point,
      distance,
      cumulativeStart: cumulative,
    };
    cumulative += distance;
    return segment;
  });

  return { totalDistance: cumulative, segments };
}

export function getPointAtProgress(
  points: RoutePoint[],
  progress: number,
): { lng: number; lat: number; bearing: number } {
  if (points.length === 0) {
    return { lng: 0, lat: 0, bearing: 0 };
  }

  if (points.length === 1) {
    return { lng: points[0].lng, lat: points[0].lat, bearing: 0 };
  }

  const metrics = buildRouteMetrics(points);
  if (metrics.totalDistance === 0) {
    return {
      lng: points[0].lng,
      lat: points[0].lat,
      bearing: getBearing(points[0], points[points.length - 1]),
    };
  }

  const bounded = clamp(progress, 0, 1);
  const targetDistance = metrics.totalDistance * bounded;

  const segment =
    metrics.segments.find((item) => {
      const start = item.cumulativeStart;
      const end = start + item.distance;
      return targetDistance >= start && targetDistance <= end;
    }) ?? metrics.segments[metrics.segments.length - 1];

  if (segment.distance === 0) {
    return {
      lng: segment.end.lng,
      lat: segment.end.lat,
      bearing: getBearing(segment.start, segment.end),
    };
  }

  const offset = targetDistance - segment.cumulativeStart;
  const localProgress = clamp(offset / segment.distance, 0, 1);

  const lng = segment.start.lng + (segment.end.lng - segment.start.lng) * localProgress;
  const lat = segment.start.lat + (segment.end.lat - segment.start.lat) * localProgress;

  return { lng, lat, bearing: getBearing(segment.start, segment.end) };
}

export function densifyRoute(
  points: RoutePoint[],
  smoothness = 80,
): Array<[number, number]> {
  if (points.length <= 1) {
    return points.map((point) => [point.lng, point.lat]);
  }

  const density = clamp(Math.round(smoothness), 20, 250);
  const coordinates: Array<[number, number]> = [];

  points.slice(1).forEach((point, index) => {
    const start = points[index];
    if (index === 0) {
      coordinates.push([start.lng, start.lat]);
    }

    for (let step = 1; step <= density; step += 1) {
      const t = step / density;
      coordinates.push([
        start.lng + (point.lng - start.lng) * t,
        start.lat + (point.lat - start.lat) * t,
      ]);
    }
  });

  return coordinates;
}
