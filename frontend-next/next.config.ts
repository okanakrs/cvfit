import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const backendUrl = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

const STATIC_PAGES = [
  "pricing",
  "how-it-works",
  "builder",
  "blog",
  "ats",
  "editor",
  "privacy",
  "terms",
  "kvkk",
  "cerez-politikasi",
  "mesafeli-satis-sozlesmesi",
];

const nextConfig: NextConfig = {
  async redirects() {
    // Eski root URL'leri /tr/ altına 301 yönlendir (SEO juice korunur)
    const staticRedirects = STATIC_PAGES.map((page) => ({
      source: `/${page}`,
      destination: `/tr/${page}`,
      permanent: true,
    }));

    return [
      // Ana sayfa
      {
        source: "/",
        destination: "/tr",
        permanent: true,
      },
      // Blog slug'ları
      {
        source: "/blog/:slug",
        destination: "/tr/blog/:slug",
        permanent: true,
      },
      // Result sayfası
      {
        source: "/result/:id",
        destination: "/tr/result/:id",
        permanent: true,
      },
      ...staticRedirects,
    ];
  },

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
