export type CreatorType = "travel_creator" | "agency" | "traveler";

export type SourcePage = "home" | "plans" | "download" | "studio" | "hub";

export type WaitlistSignupInput = {
  email: string;
  creatorType: CreatorType;
  useCase: string;
  sourcePage: SourcePage;
  consent: boolean;
};

export type RoutePoint = {
  id: string;
  lng: number;
  lat: number;
  label?: string;
};

export type PlaybackSettings = {
  speed: number;
  loop: boolean;
  smoothness: number;
};

export type RouteProjectInput = {
  name: string;
  mapStyleId: string;
  vehicleModelId: string;
  points: RoutePoint[];
  playback: PlaybackSettings;
};

export type RouteProject = RouteProjectInput & {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type RouteProjectSummary = Pick<
  RouteProject,
  "id" | "name" | "mapStyleId" | "vehicleModelId" | "updatedAt"
>;

export type HubPostFrontmatter = {
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  tags: string[];
};

export type HubPostSummary = HubPostFrontmatter & {
  readingMinutes: number;
};
