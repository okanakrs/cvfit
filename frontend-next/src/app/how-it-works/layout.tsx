import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nasıl Çalışır?",
  description:
    "CVFit nasıl çalışır? ATS uyumlu CV oluşturmak için 3 adım: şablon seç, bilgilerini gir, AI ile ATS'e optimize et ve indir.",
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
