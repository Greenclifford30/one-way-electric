import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Explicitly configure SWC loader
    swcPlugins: [
      ['@swc/plugin-styled-components', {}]
    ]
  },
  webpack: (config, { isServer }) => {
    // Add custom webpack configuration
    config.resolve.fallback = { 
      ...config.resolve.fallback, 
      fs: false,  // Explicitly disable filesystem module
      net: false,
      tls: false
    };

    return config;
  },
  typescript: {
    // Temporarily ignore build errors for debugging
    ignoreBuildErrors: false
  },
  // Optional: Add transpilation for specific packages
  transpilePackages: [
    // Add any packages that might need transpilation
    'lucide-react'
  ]
};

export default nextConfig;
