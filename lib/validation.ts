import { z } from "zod";

export const sourcePageSchema = z.enum([
  "home",
  "plans",
  "download",
  "studio",
  "hub",
]);

export const waitlistSignupSchema = z.object({
  email: z.string().email(),
  creatorType: z.enum(["travel_creator", "agency", "traveler"]),
  useCase: z
    .string()
    .min(12, "Please share at least a short sentence")
    .max(600, "Keep it under 600 characters"),
  sourcePage: sourcePageSchema,
  consent: z.literal(true),
});

export const routePointSchema = z.object({
  id: z.string().min(1),
  lng: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
  label: z.string().max(80).optional(),
});

export const playbackSettingsSchema = z.object({
  speed: z.number().min(0.25).max(4),
  loop: z.boolean(),
  smoothness: z.number().int().min(20).max(250),
});

export const routeProjectInputSchema = z.object({
  name: z.string().min(2).max(80),
  mapStyleId: z.string().min(1),
  vehicleModelId: z.string().min(1),
  points: z.array(routePointSchema).min(2),
  playback: playbackSettingsSchema,
});
