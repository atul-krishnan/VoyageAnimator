import type { Metadata } from "next";

import { StudioApp } from "@/components/studio/studio-app";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Voyagraph studio demo for map route editing, 3D model playback, and project persistence.",
};

export default function StudioPage() {
  return <StudioApp />;
}
