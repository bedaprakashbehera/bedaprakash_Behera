import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {},
  },
  output: "standalone",
};

export default nextConfig;
