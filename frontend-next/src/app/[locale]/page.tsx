"use client";
/* eslint-disable @next/next/no-img-element */

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  Sparkles,
  Cloud,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

function TemplateMockup({
  color,
  accent,
  dark,
}: {
  color: string;
  accent: string;
  dark?: boolean;
}) {
  const line = dark ? "bg-white/20" : "bg-gray-300";
  const lineDark = dark ? "bg-white/40" : "bg-gray-500";
  return (
    <div className={`${color} rounded-md w-full h-full p-2 flex flex-col gap-1`}>
      <div className={`${lineDark} h-1.5 w-16 rounded`} />
      <div className={`${accent} h-0.5 w-10 rounded`} />
      <div className="mt-1 space-y-0.5">
        <div className={`${line} h-0.5 w-full rounded`} />
        <div className={`${line} h-0.5 w-4/5 rounded`} />
        <div className={`${line} h-0.5 w-full rounded`} />
      </div>
      <div className={`${accent} h-0.5 w-8 rounded mt-1`} />
      <div className="space-y-0.5">
        <div className={`${line} h-0.5 w-3/4 rounded`} />
        <div className={`${line} h-0.5 w-2/3 rounded`} />
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const t = useTranslations("home");
  const tt = useTranslations("templates");
  useAuth();

  const TEMPLATES_PREVIEW = [
    { value: "classic", key: "classic", color: "bg-slate-100", accent: "bg-slate-400" },
    { value: "modern", key: "modern", color: "bg-blue-50", accent: "bg-blue-500" },
    { value: "minimal", key: "minimal", color: "bg-white", accent: "bg-gray-300" },
    { value: "executive", key: "executive", color: "bg-slate-800", accent: "bg-white", dark: true },
    { value: "creative", key: "creative", color: "bg-violet-500", accent: "bg-white", dark: true },
    { value: "elegant", key: "elegant", color: "bg-teal-50", accent: "bg-teal-500" },
    { value: "professional", key: "professional", color: "bg-red-50", accent: "bg-red-500" },
    { value: "tech", key: "tech", color: "bg-slate-900", accent: "bg-sky-400", dark: true },
    { value: "steel", key: "steel", color: "bg-sky-700", accent: "bg-white", dark: true },
    { value: "bordeaux", key: "bordeaux", color: "bg-red-900", accent: "bg-white", dark: true },
    { value: "navy", key: "navy", color: "bg-indigo-950", accent: "bg-white", dark: true },
    { value: "teal", key: "teal", color: "bg-teal-700", accent: "bg-white", dark: true },
  ];

  const hasDraft = useSyncExternalStore(
    () => () => {},
    () => {
      const saved = localStorage.getItem("cvfit_editor_data");
      if (!saved) return false;
      try {
        const data = JSON.parse(saved);
        return Boolean(
          data?.personal?.fullName || (data?.experience?.length ?? 0) > 0
        );
      } catch {
        return false;
      }
    },
    () => false
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="mx-auto max-w-4xl px-4 pt-24 pb-20 md:pt-32 md:pb-28 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            {t("h1_line1")}
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {t("h1_gradient")}
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              className="h-12 px-8 text-sm font-semibold gap-2 rounded-full shadow-lg shadow-primary/20"
              onClick={() => router.push("/builder")}
            >
              {hasDraft ? t("cta_continue") : t("cta_start")}
              <ArrowRight className="size-4" />
            </Button>

            {hasDraft && (
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-6 text-sm rounded-full"
                onClick={() => {
                  localStorage.removeItem("cvfit_editor_data");
                  localStorage.removeItem("cvfit_editor_template");
                  localStorage.removeItem("cvfit_session_token");
                  router.push("/builder");
                }}
              >
                {t("cta_reset")}
              </Button>
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ── Template Showcase ─────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">{t("templates_title")}</h2>
            <p className="text-muted-foreground">{t("templates_subtitle")}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {TEMPLATES_PREVIEW.map((tmpl) => (
              <button
                key={tmpl.value}
                onClick={() => router.push(`/builder?template=${tmpl.value}`)}
                className="group flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border border-border shadow-sm group-hover:shadow-md group-hover:border-primary/40 transition-all duration-200">
                  <TemplateMockup
                    color={tmpl.color}
                    accent={tmpl.accent}
                    dark={tmpl.dark}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                  {tt(tmpl.key as Parameters<typeof tt>[0])}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">{t("features_title")}</h2>
            <p className="text-muted-foreground">{t("features_subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="size-5 text-yellow-500" />,
                title: t("feature_instant_title"),
                desc: t("feature_instant_desc"),
              },
              {
                icon: <Cloud className="size-5 text-blue-500" />,
                title: t("feature_cloud_title"),
                desc: t("feature_cloud_desc"),
              },
              {
                icon: <FileDown className="size-5 text-green-500" />,
                title: t("feature_download_title"),
                desc: t("feature_download_desc"),
              },
              {
                icon: <Sparkles className="size-5 text-purple-500" />,
                title: t("feature_ai_title"),
                desc: t("feature_ai_desc"),
              },
              {
                icon: <Shield className="size-5 text-orange-500" />,
                title: t("feature_secure_title"),
                desc: t("feature_secure_desc"),
              },
              {
                icon: <CheckCircle2 className="size-5 text-teal-500" />,
                title: t("feature_ats_title"),
                desc: t("feature_ats_desc"),
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-background p-5"
              >
                <div className="mb-3">{f.icon}</div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ATS Info ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border">
        <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold mb-3">{t("ats_what_title")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("ats_what_body")}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-3">{t("ats_how_title")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("ats_how_body")}
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border bg-muted/30">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold mb-3">{t("cta_title")}</h2>
          <p className="text-muted-foreground mb-8">{t("cta_body")}</p>
          <Button
            size="lg"
            className="h-12 px-8 gap-2"
            onClick={() => router.push("/builder")}
          >
            {t("cta_button")}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            <img
              src="/cvfit-logo-light.svg"
              alt="CVFit"
              className="h-10 md:h-11 w-auto dark:hidden"
            />
            <img
              src="/cvfit-logo-dark.svg"
              alt="CVFit"
              className="hidden h-10 md:h-11 w-auto dark:block"
            />
          </div>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t("footer_privacy")}
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              {t("footer_terms")}
            </Link>
            <Link href="/kvkk" className="hover:text-foreground transition-colors">
              {t("footer_kvkk")}
            </Link>
            <Link href="/cerez-politikasi" className="hover:text-foreground transition-colors">
              {t("footer_cookie")}
            </Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-foreground transition-colors">
              {t("footer_distance")}
            </Link>
          </div>
          <div>{t("footer_rights")}</div>
        </div>
      </footer>
    </div>
  );
}
