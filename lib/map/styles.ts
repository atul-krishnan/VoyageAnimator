export type MapStyleDefinition = {
  id: string;
  name: string;
  description: string;
  styleUrl: string;
  accent: string;
};

export const MAP_STYLES: MapStyleDefinition[] = [
  {
    id: "atlas-night",
    name: "Atlas Night",
    description: "Low-light cinematic cityscape",
    styleUrl: "mapbox://styles/mapbox/dark-v11",
    accent: "#72f7cf",
  },
  {
    id: "sunrise-roads",
    name: "Sunrise Roads",
    description: "Warm roads for story-first journeys",
    styleUrl: "mapbox://styles/mapbox/streets-v12",
    accent: "#ffb86b",
  },
  {
    id: "terrain-odyssey",
    name: "Terrain Odyssey",
    description: "Terrain detail for road trips",
    styleUrl: "mapbox://styles/mapbox/outdoors-v12",
    accent: "#92d879",
  },
  {
    id: "clean-documentary",
    name: "Clean Documentary",
    description: "Minimal editorial map",
    styleUrl: "mapbox://styles/mapbox/light-v11",
    accent: "#89a3ff",
  },
  {
    id: "aerial-arc",
    name: "Aerial Arc",
    description: "Satellite context with street layer",
    styleUrl: "mapbox://styles/mapbox/satellite-streets-v12",
    accent: "#ffd39a",
  },
  {
    id: "cinematic-satellite",
    name: "Cinematic Satellite",
    description: "Full satellite perspective",
    styleUrl: "mapbox://styles/mapbox/satellite-v9",
    accent: "#c7f5ff",
  },
  {
    id: "navigation-day",
    name: "Navigator Day",
    description: "Navigation-style daytime look",
    styleUrl: "mapbox://styles/mapbox/navigation-day-v1",
    accent: "#ffe57d",
  },
  {
    id: "navigation-night",
    name: "Navigator Night",
    description: "Navigation style for after-dark routes",
    styleUrl: "mapbox://styles/mapbox/navigation-night-v1",
    accent: "#88b5ff",
  },
  {
    id: "traffic-day",
    name: "Pulse Traffic Day",
    description: "Urban mobility look with live-road aesthetic",
    styleUrl: "mapbox://styles/mapbox/traffic-day-v2",
    accent: "#ff8f70",
  },
  {
    id: "traffic-night",
    name: "Pulse Traffic Night",
    description: "Dark mobility style for city reels",
    styleUrl: "mapbox://styles/mapbox/traffic-night-v2",
    accent: "#9da9ff",
  },
  {
    id: "atlas-standard",
    name: "Atlas Standard",
    description: "Balanced, modern mapping baseline",
    styleUrl: "mapbox://styles/mapbox/standard",
    accent: "#77f2ff",
  },
  {
    id: "atlas-storyboard",
    name: "Atlas Storyboard",
    description: "Story-tuned variant for recap videos",
    styleUrl: "mapbox://styles/mapbox/standard",
    accent: "#ffca8b",
  },
];

export const DEFAULT_MAP_STYLE_ID = MAP_STYLES[0].id;
