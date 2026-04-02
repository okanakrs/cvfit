/* eslint-disable @next/next/no-img-element */
import type { CVData } from "@/types/cv"
import { getCVLabels } from "@/lib/cv-labels"

const ACCENT = "#0d7b7b"

function skillPct(level: string) {
  return level === "Uzman" ? 95 : level === "İleri" ? 75 : level === "Orta" ? 50 : 25
}

export default function TealTemplate({ data, locale }: { data: CVData; locale?: string }) {
  const p = data.personal
  const L = getCVLabels(locale)
  return (
    <div style={{ minHeight: 1123, fontFamily: "Roboto, Arial, sans-serif", backgroundColor: "#ffffff" }}>
      {/* Top Header Bar */}
      <div className="flex items-center gap-5 px-7 py-5" style={{ backgroundColor: ACCENT, color: "#ffffff" }}>
        {/* Photo */}
        <div className="shrink-0">
          {p.photo ? (
            <img
              src={p.photo}
              alt={p.fullName}
              className="rounded-full object-cover"
              style={{ width: 80, height: 80, border: "3px solid rgba(255,255,255,0.4)" }}
            />
          ) : (
            <div
              className="rounded-full flex items-center justify-center text-xl font-bold"
              style={{ width: 80, height: 80, backgroundColor: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.3)" }}
            >
              {(p.fullName || "A S").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
          )}
        </div>
        {/* Name & Contact */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white leading-tight">{p.fullName || L.fullName}</h1>
          {p.title && <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.8)" }}>{p.title}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
            {p.linkedin && <span className="break-all">{p.linkedin}</span>}
          </div>
        </div>
      </div>

      {/* Two-Column Body */}
      <div className="flex" style={{ minHeight: 1123 - 130 }}>
        {/* Left — 60% */}
        <div className="p-6 space-y-5" style={{ width: "60%", borderRight: "1px solid #e5e7eb" }}>
          {p.summary && (
            <div>
              <LeftHeading>{L.about}</LeftHeading>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{p.summary}</p>
            </div>
          )}

          {data.education.length > 0 && (
            <div>
              <LeftHeading>{L.education}</LeftHeading>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-bold text-gray-900">
                        {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                      </span>
                      <span className="text-xs shrink-0 ml-2" style={{ color: ACCENT }}>
                        {edu.startDate}{edu.startDate && edu.endDate ? " – " : ""}{edu.endDate}
                      </span>
                    </div>
                    {edu.school && <p className="text-sm font-medium" style={{ color: ACCENT }}>{edu.school}</p>}
                    {edu.gpa && <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.experience.length > 0 && (
            <div>
              <LeftHeading>{L.experience}</LeftHeading>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-bold text-gray-900">{exp.position || L.position}</span>
                      <span className="text-xs shrink-0 ml-2" style={{ color: ACCENT }}>
                        {exp.startDate}{exp.startDate && " – "}{exp.current ? L.ongoing : exp.endDate}
                      </span>
                    </div>
                    {exp.company && <p className="text-sm font-medium" style={{ color: ACCENT }}>{exp.company}</p>}
                    {exp.description && (
                      <p className="text-sm text-gray-600 whitespace-pre-line mt-1 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — 40% */}
        <div className="p-6 space-y-5" style={{ width: "40%" }}>
          {data.skills.length > 0 && (
            <div>
              <RightHeading>{L.skills}</RightHeading>
              <div className="space-y-2.5">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium">{s.name}</span>
                      <span className="text-gray-400">{s.level}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${skillPct(s.level)}%`, backgroundColor: ACCENT }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages.length > 0 && (
            <div>
              <RightHeading>{L.languagesShort}</RightHeading>
              <div className="space-y-1.5">
                {data.languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{l.name}</span>
                    <span className="text-gray-400 text-xs">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.certifications.length > 0 && (
            <div>
              <RightHeading>{L.certifications}</RightHeading>
              <div className="space-y-2">
                {data.certifications.map((c) => (
                  <div key={c.id}>
                    <p className="text-sm font-bold text-gray-900">{c.name}</p>
                    {c.issuer && <p className="text-xs text-gray-500">{c.issuer}</p>}
                    {c.date && <p className="text-xs" style={{ color: ACCENT }}>{c.date}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LeftHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-sm uppercase tracking-wider font-bold mb-3 pb-1 border-b-2"
      style={{ color: ACCENT, borderColor: ACCENT }}
    >
      {children}
    </h2>
  )
}

function RightHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xs uppercase tracking-widest font-bold mb-2.5 pb-1 border-b"
      style={{ color: ACCENT, borderColor: `${ACCENT}40` }}
    >
      {children}
    </h2>
  )
}
