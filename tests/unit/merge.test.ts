import { describe, expect, it } from "vitest";

import { mergeLocalAndRemote } from "@/lib/studio/merge";

describe("local/cloud merge strategy", () => {
  it("skips local projects already represented in cloud", () => {
    const result = mergeLocalAndRemote(
      [
        {
          name: "Iceland Reel",
          mapStyleId: "atlas-night",
          vehicleModelId: "voyager-duck",
          points: [
            { id: "1", lng: -21.8, lat: 64.1 },
            { id: "2", lng: -19.0, lat: 63.4 },
          ],
          playback: { speed: 1, loop: true, smoothness: 80 },
        },
      ],
      [
        {
          id: "abc",
          name: "Iceland Reel",
          mapStyleId: "atlas-night",
          vehicleModelId: "voyager-duck",
          updatedAt: new Date().toISOString(),
        },
      ],
    );

    expect(result.toCreate.length).toBe(0);
    expect(result.skipped).toBe(1);
  });
});
