import type { CVData } from "@/types/cv"
import { getCVLabels } from "@/lib/cv-labels"

const ACCENT = "#d97706" // amber-600
const ACCENT_SOFT = "#fffbeb" // amber-50
const INK = "#1c1917" // stone-900

const LEVEL_PCT: Record<string, number> = { "Uzman": 95, "İleri": 80, "Orta": 60, "Başlangıç": 35 }

export default function AmberTemplate({ data, locale }: { data: CVData; locale?: string }) {
  const p = data.personal
  const L = getCVLabels(locale)
  const contacts = [p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean)
  return (
    <div style={{ minHeight: 1123, fontFamily: "Roboto, Arial, sans-serif", color: "#44403c" }}>
      {/* Header with accent bar */}
      <div className="flex px-8 pt-8 pb-5" style={{ borderBottom: `3px solid ${ACCENT}` }}>
        <div className="mr-4 shrink-0 rounded-sm" style={{ width: 6, backgroundColor: ACCENT }} />
        <div className="min-w-0">
          <h1 className="text-3xl font-bold tracking-tight leading-tight" style={{ color: INK }}>
            {p.fullName || L.fullName}
          </h1>
          {p.title && (
            <p className="text-sm font-semibold uppercase tracking-widest mt-1" style={{ color: ACCENT }}>
              {p.title}
            </p>
          )}
          {contacts.length > 0 && (
            <p className="text-xs text-stone-500 mt-2">{contacts.join("   •   ")}</p>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Main column */}
        <div className="px-8 py-5 space-y-5" style={{ width: "64%" }}>
          {data.experience.length > 0 && (
            <AmberSection title={L.experience}>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-sm font-bold" style={{ color: INK }}>
                        {exp.position || L.position}
                      </span>
                      <span className="text-xs text-stone-400 shrink-0">
                        {exp.startDate}
                        {exp.startDate && " – "}
                        {exp.current ? L.ongoing : exp.endDate}
                      </span>
                    </div>
                    {exp.company && (
                      <p className="text-xs font-semibold" style={{ color: ACCENT }}>{exp.company}</p>
                    )}
                    {exp.description && (
                      <p className="text-sm text-stone-600 whitespace-pre-line mt-1 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </AmberSection>
          )}

          {data.education.length > 0 && (
            <AmberSection title={L.education}>
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-sm font-bold" style={{ color: INK }}>
                        {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                      </span>
                      <span className="text-xs text-stone-400 shrink-0">
                        {edu.startDate}
                        {edu.startDate && " – "}
                        {edu.endDate}
                      </span>
                    </div>
                    {edu.school && <p className="text-xs text-stone-500">{edu.school}</p>}
                    {edu.gpa && <p className="text-xs text-stone-400">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </AmberSection>
          )}
        </div>

        {/* Side column */}
        <div className="px-5 py-5 space-y-5 flex-1" style={{ backgroundColor: ACCENT_SOFT }}>
          {p.summary && (
            <AmberSection title={L.summary}>
              <p className="text-xs text-stone-600 whitespace-pre-line leading-relaxed">{p.summary}</p>
            </AmberSection>
          )}

          {data.skills.length > 0 && (
            <AmberSection title={L.skills}>
              <div className="space-y-2">
                {data.skills.map((s) => (
                  <div key={s.id}>
                    <p className="text-xs font-medium" style={{ color: INK }}>{s.name}</p>
                    <div className="h-1 rounded-full bg-amber-100 mt-0.5">
                      <div
                        className="h-1 rounded-full"
                        style={{ width: `${LEVEL_PCT[s.level] ?? 35}%`, backgroundColor: ACCENT }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AmberSection>
          )}

          {data.languages.length > 0 && (
            <AmberSection title={L.languagesShort}>
              <div className="space-y-1">
                {data.languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-xs">
                    <span className="font-medium" style={{ color: INK }}>{l.name}</span>
                    <span className="text-stone-400">{l.level}</span>
                  </div>
                ))}
              </div>
            </AmberSection>
          )}

          {data.certifications.length > 0 && (
            <AmberSection title={L.certificationsShort}>
              <div className="space-y-1.5">
                {data.certifications.map((c) => (
                  <div key={c.id} className="text-xs">
                    <p className="font-bold" style={{ color: INK }}>{c.name}</p>
                    {(c.issuer || c.date) && (
                      <p className="text-stone-500">{[c.issuer, c.date].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                ))}
              </div>
            </AmberSection>
          )}
        </div>
      </div>
    </div>
  )
}

function AmberSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
        {title}
      </h2>
      {children}
    </div>
  )
}
