import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    transpilePackages: ["@repo/ui"],
    output: "standalone",
};

export default nextConfig;
