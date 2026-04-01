import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fiyatlandırma",
  description:
    "CVFit fiyat planları. Ücretsiz CV oluştur, tek seferlik 39₺ ile PDF/DOCX indir veya Pro plan ile ATS optimizasyonu yap.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
