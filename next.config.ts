import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/setchi",
  assetPrefix: "/setchi/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
