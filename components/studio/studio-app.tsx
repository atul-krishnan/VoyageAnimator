"use client";

import { MapboxOverlay } from "@deck.gl/mapbox";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import type { User } from "@supabase/supabase-js";
import { LogIn, Pause, Play, RotateCcw, Save, Trash2, Undo2 } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { RoutePointList } from "@/components/studio/route-point-list";
import { trackEvent } from "@/lib/analytics/client";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { runtimeEnv } from "@/lib/env";
import { densifyRoute, getPointAtProgress } from "@/lib/map/animation";
import { DEFAULT_MODEL_ID, VEHICLE_MODELS } from "@/lib/map/models";
import { DEFAULT_MAP_STYLE_ID, MAP_STYLES } from "@/lib/map/styles";
import {
  applyPointUpdate,
  createPointHistory,
  redoPointUpdate,
  undoPointUpdate,
} from "@/lib/studio/history";
import {
  initialPlaybackState,
  nextPlaybackProgress,
  playbackReducer,
} from "@/lib/studio/playback";
import { mergeLocalAndRemote } from "@/lib/studio/merge";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  localMergeFlagKey,
  readLocalProjects,
  saveLocalProject,
} from "@/lib/storage/local-projects";
import type { RoutePoint, RouteProjectInput, RouteProjectSummary } from "@/lib/types";

mapboxgl.accessToken = runtimeEnv.mapboxToken;

const MAP_SOURCE_ID = "voyagraph-route-source";
const MAP_LINE_LAYER_ID = "voyagraph-route-line";
const MAP_POINTS_LAYER_ID = "voyagraph-route-points";

function ensureRouteLayers(map: mapboxgl.Map): void {
  if (!map.getSource(MAP_SOURCE_ID)) {
    map.addSource(MAP_SOURCE_ID, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
  }

  if (!map.getLayer(MAP_LINE_LAYER_ID)) {
    map.addLayer({
      id: MAP_LINE_LAYER_ID,
      type: "line",
      source: MAP_SOURCE_ID,
      paint: {
        "line-color": "#72f7cf",
        "line-width": 4,
        "line-opacity": 0.8,
      },
      filter: ["==", ["get", "kind"], "route"],
    });
  }

  if (!map.getLayer(MAP_POINTS_LAYER_ID)) {
    map.addLayer({
      id: MAP_POINTS_LAYER_ID,
      type: "circle",
      source: MAP_SOURCE_ID,
      paint: {
        "circle-radius": 5,
        "circle-color": "#ffb06a",
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 1,
      },
      filter: ["==", ["get", "kind"], "point"],
    });
  }
}

function buildRouteGeoJson(points: RoutePoint[], smoothness: number) {
  const routeCoordinates = densifyRoute(points, smoothness);

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { kind: "route" },
        geometry: {
          type: "LineString",
          coordinates: routeCoordinates,
        },
      },
      ...points.map((point) => ({
        type: "Feature",
        properties: { kind: "point" },
        geometry: {
          type: "Point",
          coordinates: [point.lng, point.lat],
        },
      })),
    ],
  };
}

function getDisplayError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected error";
}

export function StudioApp() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousTimestampRef = useRef<number | null>(null);
  const playbackRef = useRef(initialPlaybackState);

  const [history, setHistory] = useState(createPointHistory([]));
  const [playback, dispatchPlayback] = useReducer(
    playbackReducer,
    initialPlaybackState,
  );
  const [projectName, setProjectName] = useState("My Cinematic Journey");
  const [selectedMapStyleId, setSelectedMapStyleId] = useState(DEFAULT_MAP_STYLE_ID);
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);
  const [smoothness, setSmoothness] = useState(80);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localProjects, setLocalProjects] = useState<RouteProjectInput[]>([]);
  const [cloudProjects, setCloudProjects] = useState<RouteProjectSummary[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const points = history.present;
  const selectedStyle =
    MAP_STYLES.find((style) => style.id === selectedMapStyleId) ?? MAP_STYLES[0];
  const selectedModel =
    VEHICLE_MODELS.find((model) => model.id === selectedModelId) ?? VEHICLE_MODELS[0];

  playbackRef.current = playback;

  const currentFrame = useMemo(
    () => getPointAtProgress(points, playback.progress),
    [points, playback.progress],
  );

  const hasMapToken = Boolean(runtimeEnv.mapboxToken);

  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const activeProject = useMemo<RouteProjectInput>(
    () => ({
      name: projectName,
      mapStyleId: selectedMapStyleId,
      vehicleModelId: selectedModelId,
      points,
      playback: {
        speed: playback.speed,
        loop: playback.loop,
        smoothness,
      },
    }),
    [playback.loop, playback.speed, points, projectName, selectedMapStyleId, selectedModelId, smoothness],
  );

  const updatePoints = (nextPoints: RoutePoint[]) => {
    setHistory((current) => applyPointUpdate(current, nextPoints));
  };

  const addPoint = (lng: number, lat: number) => {
    const id = typeof crypto !== "undefined" ? crypto.randomUUID() : `${Date.now()}`;
    const next = [...points, { id, lng, lat }];
    updatePoints(next);

    if (next.length === 2) {
      trackEvent(ANALYTICS_EVENTS.studioRouteCreated, {
        source: "map_click",
      });
    }
  };

  const clearRoute = () => {
    updatePoints([]);
    dispatchPlayback({ type: "reset" });
  };

  const reorderPoints = (nextPoints: RoutePoint[]) => {
    updatePoints(nextPoints);
  };

  const removePoint = (id: string) => {
    updatePoints(points.filter((point) => point.id !== id));
  };

  const undo = () => {
    setHistory((current) => undoPointUpdate(current));
  };

  const redo = () => {
    setHistory((current) => redoPointUpdate(current));
  };

  const updateMapSource = () => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    const source = map.getSource(MAP_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
    if (!source) {
      return;
    }

    source.setData(buildRouteGeoJson(points, smoothness) as GeoJSON.FeatureCollection);
  };

  useEffect(() => {
    setLocalProjects(readLocalProjects());
  }, []);

  useEffect(() => {
    if (!hasMapToken || !mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: selectedStyle.styleUrl,
      center: [-73.9851, 40.7589],
      zoom: 2.4,
      pitch: 35,
      bearing: -10,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      ensureRouteLayers(map);
      updateMapSource();
    });

    map.on("click", (event) => {
      addPoint(event.lngLat.lng, event.lngLat.lat);
    });

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      previousTimestampRef.current = null;

      if (overlayRef.current && mapRef.current) {
        mapRef.current.removeControl(overlayRef.current);
      }

      overlayRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMapToken]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.setStyle(selectedStyle.styleUrl);
    map.once("styledata", () => {
      ensureRouteLayers(map);
      updateMapSource();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStyle.styleUrl]);

  useEffect(() => {
    updateMapSource();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, smoothness]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || points.length < 2) {
      return;
    }

    if (!overlayRef.current) {
      overlayRef.current = new MapboxOverlay({ interleaved: true, layers: [] });
      map.addControl(overlayRef.current);
    }

    overlayRef.current.setProps({
      layers: [
        new ScenegraphLayer({
          id: "voyagraph-scenegraph-layer",
          data: [
            {
              position: [currentFrame.lng, currentFrame.lat] as [number, number],
              bearing: currentFrame.bearing,
            },
          ],
          scenegraph: selectedModel.scenegraph,
          sizeScale: selectedModel.sizeScale,
          getPosition: (d: { position: [number, number] }) => d.position,
          getOrientation: (d: { bearing: number }) =>
            [0, 90 - d.bearing, 90] as [number, number, number],
          pickable: false,
        }),
      ],
    });
  }, [currentFrame.bearing, currentFrame.lat, currentFrame.lng, points.length, selectedModel.scenegraph, selectedModel.sizeScale]);

  useEffect(() => {
    if (!playback.isPlaying || points.length < 2) {
      return;
    }

    const loop = (timestamp: number) => {
      if (previousTimestampRef.current === null) {
        previousTimestampRef.current = timestamp;
      }

      const delta = timestamp - previousTimestampRef.current;
      previousTimestampRef.current = timestamp;

      const next = nextPlaybackProgress(
        playbackRef.current.progress,
        delta,
        playbackRef.current.speed,
      );

      if (next >= 1) {
        if (playbackRef.current.loop) {
          dispatchPlayback({ type: "setProgress", payload: 0 });
        } else {
          dispatchPlayback({ type: "setProgress", payload: 1 });
          dispatchPlayback({ type: "pause" });
          previousTimestampRef.current = null;
          return;
        }
      } else {
        dispatchPlayback({ type: "setProgress", payload: next });
      }

      animationFrameRef.current = window.requestAnimationFrame(loop);
    };

    animationFrameRef.current = window.requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      animationFrameRef.current = null;
      previousTimestampRef.current = null;
    };
  }, [playback.isPlaying, points.length]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }

      setUser(data.session?.user ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const fetchCloudProjects = async () => {
    if (!supabase || !user) {
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      return;
    }

    const response = await fetch("/api/route-projects", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Unable to fetch cloud projects");
    }

    const body = (await response.json()) as { items: RouteProjectSummary[] };
    setCloudProjects(body.items);
  };

  useEffect(() => {
    if (!user) {
      setCloudProjects([]);
      return;
    }

    fetchCloudProjects().catch((fetchError) => {
      setError(getDisplayError(fetchError));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (!user || !supabase) {
      return;
    }

    const key = localMergeFlagKey(user.id);
    if (window.localStorage.getItem(key) === "done") {
      return;
    }

    const local = readLocalProjects();
    if (local.length === 0) {
      window.localStorage.setItem(key, "done");
      return;
    }

    const merge = mergeLocalAndRemote(local, cloudProjects);
    if (merge.toCreate.length === 0) {
      window.localStorage.setItem(key, "done");
      return;
    }

    const run = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        return;
      }

      await Promise.all(
        merge.toCreate.map((project) =>
          fetch("/api/route-projects", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(project),
          }),
        ),
      );

      window.localStorage.setItem(key, "done");
      await fetchCloudProjects();
      setStatus(`Merged ${merge.toCreate.length} local projects to cloud.`);
    };

    run().catch((mergeError) => setError(getDisplayError(mergeError)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudProjects, supabase, user]);

  const saveProjectLocally = () => {
    if (activeProject.points.length < 2) {
      setError("Add at least two route points before saving.");
      return;
    }

    setError(null);
    const saved = saveLocalProject(activeProject);
    setLocalProjects(saved);
    setStatus("Project saved locally.");
    trackEvent(ANALYTICS_EVENTS.studioProjectSaved, { destination: "local" });
  };

  const saveProjectToCloud = async () => {
    if (!supabase || !user) {
      setError("Sign in with Google to save cloud projects.");
      return;
    }

    if (activeProject.points.length < 2) {
      setError("Add at least two route points before saving.");
      return;
    }

    setError(null);

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      setError("Your session expired. Sign in again.");
      return;
    }

    const response = await fetch("/api/route-projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(activeProject),
    });

    if (!response.ok) {
      const body = (await response.json()) as { error?: string };
      setError(body.error ?? "Failed to save cloud project.");
      return;
    }

    await fetchCloudProjects();
    setStatus("Project saved to cloud.");
    trackEvent(ANALYTICS_EVENTS.studioProjectSaved, { destination: "cloud" });
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      setError("Supabase environment is not configured.");
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/studio`,
      },
    });
  };

  const onPlay = () => {
    if (points.length < 2) {
      setError("Add at least two points to start playback.");
      return;
    }

    setError(null);
    dispatchPlayback({ type: "play" });
    trackEvent(ANALYTICS_EVENTS.studioPlaybackStarted, {
      source: "studio_controls",
    });
  };

  return (
    <section className="min-h-screen bg-[#020a13] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-[#051322]/70 p-3">
          <div className="mb-3 flex items-center justify-between gap-3 px-2">
            <h1 className="font-display text-2xl text-white">Voyagraph Studio</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-[#79ecc9]">
              Interactive Demo
            </p>
          </div>

          <div className="relative h-[60vh] overflow-hidden rounded-xl border border-white/10 bg-[#08172a] lg:h-[72vh]">
            {!hasMapToken ? (
              <div className="absolute inset-0 grid place-items-center px-6 text-center">
                <div>
                  <p className="font-display text-2xl text-white">Mapbox token required</p>
                  <p className="mt-2 text-sm text-[#bcd1e6]">
                    Set `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` in `.env.local` to use the
                    route map canvas.
                  </p>
                </div>
              </div>
            ) : null}
            <div className="h-full w-full" ref={mapContainerRef} />
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border border-white/10 bg-[#051322]/75 p-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-[#89a8c8]" htmlFor="project-name">
              Project Name
            </label>
            <input
              className="h-10 w-full rounded-lg border border-white/15 bg-[#0a1d30] px-3 text-sm text-white outline-none ring-[#72f7cf] focus:ring-2"
              id="project-name"
              onChange={(event) => setProjectName(event.target.value)}
              value={projectName}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <label className="space-y-2 text-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-[#89a8c8]">
                Map Style
              </span>
              <select
                className="h-10 w-full rounded-lg border border-white/15 bg-[#0a1d30] px-3 text-sm text-white outline-none ring-[#72f7cf] focus:ring-2"
                onChange={(event) => setSelectedMapStyleId(event.target.value)}
                value={selectedMapStyleId}
              >
                {MAP_STYLES.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-[#89a8c8]">
                3D Model
              </span>
              <select
                className="h-10 w-full rounded-lg border border-white/15 bg-[#0a1d30] px-3 text-sm text-white outline-none ring-[#72f7cf] focus:ring-2"
                onChange={(event) => setSelectedModelId(event.target.value)}
                value={selectedModelId}
              >
                {VEHICLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-2 rounded-xl border border-white/10 bg-[#081a2c] p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#89a8c8]">
              Playback
            </p>
            <div className="flex gap-2">
              <button
                className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-white/20 px-3 text-sm text-white hover:bg-white/10"
                onClick={onPlay}
                type="button"
              >
                <Play className="h-4 w-4" />
                Play
              </button>
              <button
                className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-white/20 px-3 text-sm text-white hover:bg-white/10"
                onClick={() => dispatchPlayback({ type: "pause" })}
                type="button"
              >
                <Pause className="h-4 w-4" />
                Pause
              </button>
              <button
                className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-white/20 px-3 text-sm text-white hover:bg-white/10"
                onClick={() => dispatchPlayback({ type: "reset" })}
                type="button"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            <label className="block space-y-1">
              <span className="text-xs text-[#b7cde3]">
                Progress: {Math.round(playback.progress * 100)}%
              </span>
              <input
                className="w-full"
                max={1000}
                min={0}
                onChange={(event) =>
                  dispatchPlayback({
                    type: "setProgress",
                    payload: Number(event.target.value) / 1000,
                  })
                }
                type="range"
                value={Math.round(playback.progress * 1000)}
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs text-[#b7cde3]">Speed: {playback.speed.toFixed(2)}x</span>
              <input
                className="w-full"
                max={400}
                min={25}
                onChange={(event) =>
                  dispatchPlayback({
                    type: "setSpeed",
                    payload: Number(event.target.value) / 100,
                  })
                }
                type="range"
                value={Math.round(playback.speed * 100)}
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs text-[#b7cde3]">Smoothness: {smoothness}</span>
              <input
                className="w-full"
                max={250}
                min={20}
                onChange={(event) => setSmoothness(Number(event.target.value))}
                type="range"
                value={smoothness}
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-[#d0e1f2]">
              <input
                checked={playback.loop}
                onChange={(event) =>
                  dispatchPlayback({ type: "setLoop", payload: event.target.checked })
                }
                type="checkbox"
              />
              Loop playback
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-white/20 text-sm text-white hover:bg-white/10"
              onClick={undo}
              type="button"
            >
              <Undo2 className="h-4 w-4" /> Undo
            </button>
            <button
              className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-white/20 text-sm text-white hover:bg-white/10"
              onClick={redo}
              type="button"
            >
              <RotateCcw className="h-4 w-4" /> Redo
            </button>
            <button
              className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-white/20 text-sm text-white hover:bg-white/10"
              onClick={saveProjectLocally}
              type="button"
            >
              <Save className="h-4 w-4" /> Save Local
            </button>
            <button
              className="inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-white/20 text-sm text-white hover:bg-white/10"
              onClick={saveProjectToCloud}
              type="button"
            >
              <Save className="h-4 w-4" /> Save Cloud
            </button>
            <button
              className="col-span-2 inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-[#ff9578]/40 text-sm text-[#ffb39d] hover:bg-[#ff9578]/10"
              onClick={clearRoute}
              type="button"
            >
              <Trash2 className="h-4 w-4" /> Clear route
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#081a2c] p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-[#89a8c8]">Route points</p>
            <p className="mt-1 text-xs text-[#a6bed5]">Click the map to add stops.</p>
            <div className="mt-3">
              <RoutePointList onDelete={removePoint} onReorder={reorderPoints} points={points} />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#081a2c] p-3 text-xs text-[#9fb8d1]">
            <p>
              Logged in: <span className="text-white">{user ? user.email : "No"}</span>
            </p>
            <p className="mt-1">Local projects: {localProjects.length}</p>
            <p className="mt-1">Cloud projects: {cloudProjects.length}</p>
            {!user ? (
              <button
                className="mt-3 inline-flex h-9 items-center justify-center gap-1 rounded-lg border border-white/20 px-3 text-sm text-white hover:bg-white/10"
                onClick={signInWithGoogle}
                type="button"
              >
                <LogIn className="h-4 w-4" /> Sign in with Google
              </button>
            ) : null}
            {error ? <p className="mt-2 text-[#ff9e9e]">{error}</p> : null}
            {status ? <p className="mt-2 text-[#8cf8d9]">{status}</p> : null}
          </div>
        </aside>
      </div>
    </section>
  );
}
