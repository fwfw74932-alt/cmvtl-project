import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Keep the project root as the workspace root so the app sources that live
  // under imports/ (the preserved original project) are compiled as part of
  // this app instead of being treated as outside the build.
  turbopack: {
    root: process.cwd(),
  },
  // The preview is served from a public host that differs from the
  // in-container dev origin, so Next 16 blocks cross-origin /_next and HMR
  // without this.
  allowedDevOrigins: [
    "*.iqx.dev",
    ...(process.env.IQX_PROJECT_ID || process.env.PROJECT_ID
      ? [
          `preview-${process.env.IQX_PROJECT_ID || process.env.PROJECT_ID}-web.iqx.dev`,
          `preview-${process.env.IQX_PROJECT_ID || process.env.PROJECT_ID}-mobile.iqx.dev`,
        ]
      : []),
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    dangerouslyAllowSVG: false,
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
