import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CVFit",
  applicationCategory: "BusinessApplication",
  description: "ATS uyumlu CV oluşturucu. Yapay zeka ile CV'nizi ATS sistemlerine göre optimize edin, daha fazla mülakata çıkın.",
  url: "https://cvfit.app",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TRY",
    description: "Ücretsiz CV oluşturma. PDF/DOCX indirme 39₺.",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "500",
  },
};

export const metadata: Metadata = {
  title: {
    default: "ATS Uyumlu CV Oluşturucu | CVFit",
    template: "%s | CVFit",
  },
  description:
    "ATS sistemlerini geçen CV'ler oluşturun. CVFit ile CV'nizi ATS'e optimize edin, daha fazla mülakata çıkın. Ücretsiz, kayıt gerektirmez.",
  keywords: [
    "ATS uyumlu CV",
    "ATS optimize CV",
    "ATS uyumlu CV oluşturucu",
    "ATS friendly CV",
    "ATS geçen CV",
    "CV oluşturucu",
    "CV yapma",
    "özgeçmiş oluştur",
    "AI CV",
    "yapay zeka CV",
  ],
  metadataBase: new URL("https://cvfit.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://cvfit.app",
    siteName: "CVFit",
    title: "ATS Uyumlu CV Oluşturucu | CVFit",
    description:
      "ATS sistemlerini geçen CV'ler oluşturun. CVFit ile CV'nizi ATS'e optimize edin, daha fazla mülakata çıkın.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CVFit - ATS Uyumlu CV Oluşturucu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATS Uyumlu CV Oluşturucu | CVFit",
    description:
      "ATS sistemlerini geçen CV'ler oluşturun. CVFit ile CV'nizi ATS'e optimize edin, daha fazla mülakata çıkın.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AuthProvider>
              <div className="min-h-screen bg-background">
                <Navbar />
                {children}
              </div>
            </AuthProvider>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
