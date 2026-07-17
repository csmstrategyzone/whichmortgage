import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 restricts qualities to [75] by default; allow the hero's q=95.
    qualities: [75, 95],
  },
};

export default nextConfig;
