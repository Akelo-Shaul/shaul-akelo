import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only optimizes qualities on this allowlist (default [75]). 90 is here for the
    // full-bleed project banner, where 75 shows visible artefacts at viewport width.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
