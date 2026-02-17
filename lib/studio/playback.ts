import { clamp } from "@/lib/map/animation";

export type PlaybackState = {
  isPlaying: boolean;
  progress: number;
  speed: number;
  loop: boolean;
};

export type PlaybackAction =
  | { type: "play" }
  | { type: "pause" }
  | { type: "toggle" }
  | { type: "setProgress"; payload: number }
  | { type: "setSpeed"; payload: number }
  | { type: "setLoop"; payload: boolean }
  | { type: "reset" };

export const initialPlaybackState: PlaybackState = {
  isPlaying: false,
  progress: 0,
  speed: 1,
  loop: true,
};

export function playbackReducer(
  state: PlaybackState,
  action: PlaybackAction,
): PlaybackState {
  switch (action.type) {
    case "play":
      return { ...state, isPlaying: true };
    case "pause":
      return { ...state, isPlaying: false };
    case "toggle":
      return { ...state, isPlaying: !state.isPlaying };
    case "setProgress":
      return { ...state, progress: clamp(action.payload, 0, 1) };
    case "setSpeed":
      return { ...state, speed: clamp(action.payload, 0.25, 4) };
    case "setLoop":
      return { ...state, loop: action.payload };
    case "reset":
      return { ...state, progress: 0, isPlaying: false };
    default:
      return state;
  }
}

export function nextPlaybackProgress(
  current: number,
  deltaMs: number,
  speed: number,
): number {
  const delta = (deltaMs / 1000) * speed * 0.08;
  return clamp(current + delta, 0, 1);
}
