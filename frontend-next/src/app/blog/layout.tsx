import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "CVFit blog: ATS uyumlu CV yazma rehberleri, iş başvurusu ipuçları ve kariyer tavsiyeleri.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
