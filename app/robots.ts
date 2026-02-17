import type { MetadataRoute } from "next";

import { runtimeEnv } from "@/lib/env";

const baseUrl = runtimeEnv.siteUrl || "https://voyagraph.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
