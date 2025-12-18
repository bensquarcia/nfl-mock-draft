import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // This allows us to use standard <img> tags or <Image> components
    // without Next.js blocking the external websites.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'static.www.nfl.com',
      },
      {
        protocol: 'https',
        hostname: 'a.espncdn.com',
      },
    ],
    // This setting ensures that even if a link is slightly "off," 
    // Next.js will still try to show it.
    unoptimized: true, 
  },
};

export default nextConfig;