import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const backendUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backendUrl) {
      return [];
    }

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

export default withNextIntl(nextConfig);
