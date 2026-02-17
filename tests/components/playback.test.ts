import { describe, expect, it } from "vitest";

import {
  initialPlaybackState,
  nextPlaybackProgress,
  playbackReducer,
} from "@/lib/studio/playback";

describe("playback reducer", () => {
  it("toggles state and clamps speed/progress", () => {
    const started = playbackReducer(initialPlaybackState, { type: "play" });
    const spedUp = playbackReducer(started, { type: "setSpeed", payload: 10 });
    const progressed = playbackReducer(spedUp, {
      type: "setProgress",
      payload: 2,
    });

    expect(started.isPlaying).toBe(true);
    expect(spedUp.speed).toBe(4);
    expect(progressed.progress).toBe(1);
  });

  it("computes next progress from delta time", () => {
    const next = nextPlaybackProgress(0, 1000, 1.5);

    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThanOrEqual(1);
  });
});
