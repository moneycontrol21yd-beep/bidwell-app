import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  generateBuildId: async () => 'build-' + Date.now(),
  turbopack: {},
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
