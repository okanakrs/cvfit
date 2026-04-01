"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, X, Star, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalysisResult {
  cv_data: Record<string, unknown>;
  original_score: number;
  new_score: number;
  added_keywords: string[];
  skill_match: {
    matched: string[];
    missing: string[];
    bonus: string[];
  };
  section_scores: Record<string, number>;
  suggestions: string[];
  remaining_credits: number;
}

function ScoreCard({
  title,
  score,
  description,
}: {
  title: string;
  score: number;
  description: string;
}) {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-3xl font-bold">{score}%</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={score} className="h-2" />
      </CardContent>
    </Card>
  );
}

function DiffBadge({ diff }: { diff: number }) {
  if (diff === 0) return null;

  return diff > 0 ? (
    <Badge className="bg-green-600 text-white hover:bg-green-700 text-sm">
      +{diff}%
    </Badge>
  ) : (
    <Badge className="bg-red-600 text-white hover:bg-red-700 text-sm">
      {diff}%
    </Badge>
  );
}

function SkillColumn({
  title,
  items,
  icon,
  variant,
}: {
  title: string;
  items: string[];
  icon: React.ReactNode;
  variant: "matched" | "missing" | "bonus";
}) {
  const badgeClass =
    variant === "matched"
      ? "border-green-500/50 text-green-400 bg-green-500/10"
      : variant === "missing"
        ? "border-red-500/50 text-red-400 bg-red-500/10"
        : "border-blue-500/50 text-blue-400 bg-blue-500/10";

  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {title}
          <Badge variant="secondary" className="ml-auto">
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Yok</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {items.map((item) => (
              <Badge key={item} variant="outline" className={badgeClass}>
                {item}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ResultSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-24" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}

// Demo data for previewing the page without a real API call
const DEMO_DATA: AnalysisResult = {
  cv_data: {},
  original_score: 52,
  new_score: 78,
  added_keywords: [
    "React",
    "TypeScript",
    "REST API",
    "CI/CD",
    "Agile",
    "Docker",
  ],
  skill_match: {
    matched: ["JavaScript", "Node.js", "Git", "PostgreSQL", "HTML/CSS"],
    missing: ["Kubernetes", "AWS", "GraphQL"],
    bonus: ["Python", "Figma", "Redis"],
  },
  section_scores: {
    skills: 85,
    experience: 70,
    education: 90,
    summary: 75,
  },
  suggestions: [
    "Deneyim bölümünde ölçülebilir başarı metrikleri ekleyin (ör: %30 performans artışı).",
    "Özet kısmını iş ilanındaki anahtar becerilerle güçlendirin.",
    "Eksik beceriler bölümündeki teknolojileri projelerinizde vurgulayın.",
  ],
  remaining_credits: 2,
};

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If "demo" id, show demo data
    if (id === "demo") {
      setData(DEMO_DATA);
      setLoading(false);
      return;
    }

    // Try to load from sessionStorage (set after analysis)
    const stored = sessionStorage.getItem(`analysis_${id}`);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        // invalid JSON, ignore
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) return <ResultSkeleton />;

  if (!data) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Analiz bulunamadı</h1>
        <p className="mt-2 text-muted-foreground">
          Bu analiz sonucu mevcut değil veya süresi dolmuş.
        </p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ana Sayfa
        </Button>
      </div>
    );
  }

  const diff = data.new_score - data.original_score;

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Analiz Sonucu</h1>
        <DiffBadge diff={diff} />
      </div>

      {/* Score Comparison */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ScoreCard
          title="Önceki Skor"
          score={data.original_score}
          description="Optimizasyon öncesi ATS eşleşme skoru"
        />
        <ScoreCard
          title="Yeni Skor"
          score={data.new_score}
          description="Optimizasyon sonrası ATS eşleşme skoru"
        />
      </section>

      {/* Added Keywords */}
      {data.added_keywords.length > 0 && (
        <section>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Eklenen Anahtar Kelimeler
              </CardTitle>
              <CardDescription>
                CV&apos;nize eklenen iş ilanı ile eşleşen kelimeler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.added_keywords.map((kw) => (
                  <Badge
                    key={kw}
                    variant="secondary"
                    className="flex items-center gap-1.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    {kw}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Skill Map */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Beceri Haritas&#305;</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SkillColumn
            title="Eşleşen"
            items={data.skill_match.matched}
            icon={<Check className="h-4 w-4 text-green-500" />}
            variant="matched"
          />
          <SkillColumn
            title="Eksik"
            items={data.skill_match.missing}
            icon={<X className="h-4 w-4 text-red-500" />}
            variant="missing"
          />
          <SkillColumn
            title="Bonus"
            items={data.skill_match.bonus}
            icon={<Star className="h-4 w-4 text-blue-500" />}
            variant="bonus"
          />
        </div>
      </section>

      {/* Suggestions */}
      {data.suggestions.length > 0 && (
        <section>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                İyileştirme Önerileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {data.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      <Separator />

      {/* Action Buttons */}
      <section className="flex flex-wrap gap-3">
        <Button onClick={() => router.push(`/builder?from=${id}`)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editörde Düzenle
        </Button>
        <Button variant="outline" onClick={() => router.push("/ats")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Yeni Analiz
        </Button>
      </section>
    </main>
  );
}
