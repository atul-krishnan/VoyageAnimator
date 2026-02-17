import { describe, expect, it } from "vitest";

import { routeProjectInputSchema, waitlistSignupSchema } from "@/lib/validation";

describe("validation schemas", () => {
  it("validates waitlist payload", () => {
    const result = waitlistSignupSchema.safeParse({
      email: "creator@example.com",
      creatorType: "travel_creator",
      useCase: "I produce road-trip shorts and need map animation templates.",
      sourcePage: "home",
      consent: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects waitlist payload without consent", () => {
    const result = waitlistSignupSchema.safeParse({
      email: "creator@example.com",
      creatorType: "travel_creator",
      useCase: "I produce road-trip shorts and need map animation templates.",
      sourcePage: "home",
      consent: false,
    });

    expect(result.success).toBe(false);
  });

  it("validates route project payload", () => {
    const result = routeProjectInputSchema.safeParse({
      name: "My Route",
      mapStyleId: "atlas-night",
      vehicleModelId: "voyager-duck",
      points: [
        { id: "1", lng: -73.9, lat: 40.7 },
        { id: "2", lng: -0.1, lat: 51.5 },
      ],
      playback: {
        speed: 1,
        loop: true,
        smoothness: 90,
      },
    });

    expect(result.success).toBe(true);
  });
});
