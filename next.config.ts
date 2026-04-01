import type { NextConfig } from "next";

const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${backendUrl}/auth/:path*`,
      },
      {
        source: "/analyze",
        destination: `${backendUrl}/analyze`,
      },
      {
        source: "/download-pdf",
        destination: `${backendUrl}/download-pdf`,
      },
      {
        source: "/download-docx",
        destination: `${backendUrl}/download-docx`,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
