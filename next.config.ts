import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  generateBuildId: async () => 'build-' + Date.now(),
  // turbopack: {}, // --webpack use kar rahe hain isliye iski zaroorat nahi
};

export default nextConfig;
