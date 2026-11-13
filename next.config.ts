import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/page/1", destination: "/", permanent: true },
      { source: "/topics/:topic/page/1", destination: "/topics/:topic", permanent: true },
    ];
  },
};

export default nextConfig;
