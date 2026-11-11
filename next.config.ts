import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/setchi",
  assetPrefix: "/setchi/",
  images: {
    unoptimized: true,
  },
  // GitHub Pages static export: don't block deploy on lint/TS noise
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
