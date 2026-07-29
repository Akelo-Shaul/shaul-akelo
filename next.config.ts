import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 only optimizes qualities on this allowlist (default [75]). 90 is here for the
    // full-bleed project banner, where 75 shows visible artefacts at viewport width.
    // 50 is the hero backdrop (rendered at 40% opacity, so detail is wasted there).
    qualities: [50, 75, 90],
    // Default is ['image/webp'] alone. AVIF is typically 20-50% smaller again, and browsers that
    // don't support it fall back to WebP via the Accept header.
    formats: ['image/avif', 'image/webp'],
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
