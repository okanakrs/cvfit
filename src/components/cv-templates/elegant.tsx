import type { CVData } from "@/types/cv"

const ACCENT = "#0d9488" // teal-600

export default function ElegantTemplate({ data }: { data: CVData }) {
  const p = data.personal
  return (
    <div className="p-8 space-y-0" style={{ minHeight: 1123, fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* Header with accent top border */}
      <div className="pb-4 border-b border-gray-200">
        <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: ACCENT }} />
        <h1 className="text-2xl font-light text-gray-900 tracking-tight">
          {p.fullName || "Ad Soyad"}
        </h1>
        {p.title && (
          <p className="text-sm font-medium mt-1" style={{ color: ACCENT }}>
            {p.title}
          </p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400 mt-2">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>·  {p.phone}</span>}
          {p.location && <span>·  {p.location}</span>}
          {p.linkedin && <span>·  {p.linkedin}</span>}
          {p.website && <span>·  {p.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {p.summary && (
        <ElegantSection title="Profesyonel Özet">
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed italic">
            {p.summary}
          </p>
        </ElegantSection>
      )}

      {/* Experience — timeline style */}
      {data.experience.length > 0 && (
        <ElegantSection title="İş Deneyimi">
          <div className="space-y-3">
            {data.experience.map((exp, i) => (
              <div key={exp.id} className="flex gap-3">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center pt-1.5 shrink-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full border-2"
                    style={{
                      borderColor: ACCENT,
                      backgroundColor: i === 0 ? ACCENT : "white",
                    }}
                  />
                  {i < data.experience.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 mt-1" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-1 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-gray-900">
                      {exp.position || "Pozisyon"}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">
                      {exp.startDate}
                      {exp.startDate && " – "}
                      {exp.current ? "Devam" : exp.endDate}
                    </span>
                  </div>
                  {exp.company && (
                    <p className="text-xs font-medium" style={{ color: ACCENT }}>
                      {exp.company}
                    </p>
                  )}
                  {exp.description && (
                    <p className="text-sm text-gray-500 whitespace-pre-line mt-0.5 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ElegantSection>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <ElegantSection title="Eğitim">
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                  </span>
                  {edu.school && (
                    <span className="text-sm text-gray-500"> — {edu.school}</span>
                  )}
                  {edu.gpa && (
                    <span className="text-xs text-gray-300 ml-1">({edu.gpa})</span>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-2">
                  {edu.startDate}{edu.startDate && " – "}{edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </ElegantSection>
      )}

      {/* Two-column: Skills + Languages */}
      <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-6">
        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h3
              className="text-xs uppercase tracking-wider font-bold mb-2"
              style={{ color: ACCENT }}
            >
              Beceriler
            </h3>
            <div className="space-y-1.5">
              {data.skills.map((s) => {
                const pct =
                  s.level === "Uzman" ? 100 : s.level === "İleri" ? 75 : s.level === "Orta" ? 50 : 25
                return (
                  <div key={s.id}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-700">{s.name}</span>
                      <span className="text-gray-300">{s.level}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: ACCENT }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div>
            <h3
              className="text-xs uppercase tracking-wider font-bold mb-2"
              style={{ color: ACCENT }}
            >
              Diller
            </h3>
            <div className="space-y-1">
              {data.languages.map((l) => (
                <div key={l.id} className="flex justify-between text-xs">
                  <span className="text-gray-700">{l.name}</span>
                  <span className="text-gray-400">{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <ElegantSection title="Sertifikalar">
          <div className="grid grid-cols-2 gap-2">
            {data.certifications.map((c) => (
              <div
                key={c.id}
                className="text-xs px-2.5 py-1.5 rounded border border-gray-100 bg-gray-50"
              >
                <p className="font-semibold text-gray-800">{c.name}</p>
                {c.issuer && <p className="text-gray-400">{c.issuer}</p>}
                {c.date && <p className="text-gray-300 mt-0.5">{c.date}</p>}
              </div>
            ))}
          </div>
        </ElegantSection>
      )}
    </div>
  )
}

function ElegantSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      <h2
        className="text-xs uppercase tracking-wider font-bold mb-2"
        style={{ color: ACCENT }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}
