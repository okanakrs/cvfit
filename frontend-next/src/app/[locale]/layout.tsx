import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/lib/auth-context";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const locales = ["en", "tr"];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CVFit",
  applicationCategory: "BusinessApplication",
  description:
    "ATS-friendly resume builder powered by AI. Optimize your resume for any job posting.",
  url: "https://www.cvfit.com.tr",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TRY",
    description: "Free resume creation. PDF/DOCX download from ₺39.",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTR = locale === "tr";

  return {
    title: {
      default: isTR
        ? "ATS Uyumlu CV Oluşturucu | CVFit"
        : "ATS-Friendly Resume Builder | CVFit",
      template: "%s | CVFit",
    },
    description: isTR
      ? "ATS sistemlerini geçen CV'ler oluşturun. CVFit ile CV'nizi ATS'e optimize edin, daha fazla mülakata çıkın. Ücretsiz, kayıt gerektirmez."
      : "Build resumes that pass ATS systems. Optimize your resume with CVFit AI, get more interviews. Free, no registration required.",
    keywords: isTR
      ? [
          "ATS uyumlu CV",
          "ATS optimize CV",
          "ATS uyumlu CV oluşturucu",
          "ATS friendly CV",
          "ATS geçen CV",
          "CV oluşturucu",
          "özgeçmiş oluştur",
          "yapay zeka CV",
        ]
      : [
          "ATS friendly resume",
          "ATS optimized resume",
          "ATS resume builder",
          "AI resume builder",
          "resume optimizer",
          "CV builder",
        ],
    metadataBase: new URL("https://www.cvfit.com.tr"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        tr: "/tr",
      },
    },
    openGraph: {
      type: "website",
      locale: isTR ? "tr_TR" : "en_US",
      url: `https://www.cvfit.com.tr/${locale}`,
      siteName: "CVFit",
      title: isTR
        ? "ATS Uyumlu CV Oluşturucu | CVFit"
        : "ATS-Friendly Resume Builder | CVFit",
      description: isTR
        ? "ATS sistemlerini geçen CV'ler oluşturun."
        : "Build resumes that pass ATS systems.",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: isTR
            ? "CVFit - ATS Uyumlu CV Oluşturucu"
            : "CVFit - ATS-Friendly Resume Builder",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isTR
        ? "ATS Uyumlu CV Oluşturucu | CVFit"
        : "ATS-Friendly Resume Builder | CVFit",
      description: isTR
        ? "ATS sistemlerini geçen CV'ler oluşturun."
        : "Build resumes that pass ATS systems.",
      images: ["/og-image.png"],
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "32x32" },
      ],
      shortcut: "/favicon.svg",
      apple: "/favicon.svg",
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
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="alternate" hrefLang="tr" href="https://www.cvfit.com.tr/tr" />
        <link rel="alternate" hrefLang="en" href="https://www.cvfit.com.tr/en" />
        <link rel="alternate" hrefLang="x-default" href="https://www.cvfit.com.tr/tr" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
