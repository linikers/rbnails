// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["localhost", "vercel.app"],
    unoptimized: false,
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  },

  webpack: (config, { isServer }) => {
    // Simplifica imports (ex: import x from "@/components/x")
    config.resolve.alias["@"] = path.resolve(__dirname, "src");

    // Evita source maps pesados no client
    if (!isServer) {
      config.devtool = false;
    }

    config.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    };

    return config;
  },
};

module.exports = nextConfig;
