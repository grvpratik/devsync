import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
  images:{

    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  }
};

export default nextConfig;
