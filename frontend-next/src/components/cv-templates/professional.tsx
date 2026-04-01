import type { CVData } from "@/types/cv"

const ACCENT = "#dc2626" // red-600
const BG_DARK = "#111827" // gray-900

export default function ProfessionalTemplate({ data }: { data: CVData }) {
  const p = data.personal
  return (
    <div style={{ minHeight: 1123, fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* Header — accent strip top */}
      <div className="h-1.5" style={{ backgroundColor: ACCENT }} />
      <div className="px-8 py-5 flex justify-between items-end border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {p.fullName || "Ad Soyad"}
          </h1>
          {p.title && (
            <p className="text-xs font-semibold mt-0.5" style={{ color: ACCENT }}>
              {p.title}
            </p>
          )}
        </div>
        <div className="text-right text-xs text-gray-500 space-y-0.5">
          {p.email && <p>{p.email}</p>}
          {p.phone && <p>{p.phone}</p>}
          {p.location && <p>{p.location}</p>}
          {p.linkedin && <p>{p.linkedin}</p>}
          {p.website && <p>{p.website}</p>}
        </div>
      </div>

      <div className="px-8 py-5 space-y-0">
        {/* Summary */}
        {p.summary && (
          <div
            className="py-3 px-4 rounded border-l-4 bg-gray-50"
            style={{ borderColor: ACCENT }}
          >
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {p.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <ProSection title="İŞ DENEYİMİ" color={ACCENT}>
            <div className="space-y-3">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {exp.position || "Pozisyon"}
                      </span>
                      {exp.company && (
                        <span
                          className="text-xs font-semibold"
                          style={{ color: ACCENT }}
                        >
                          {exp.company}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {exp.startDate}
                      {exp.startDate && " – "}
                      {exp.current ? "Devam Ediyor" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-600 whitespace-pre-line mt-0.5 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ProSection>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <ProSection title="EĞİTİM" color={ACCENT}>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-gray-900">
                      {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                    </span>
                    {edu.school && (
                      <span className="text-sm text-gray-500"> — {edu.school}</span>
                    )}
                    {edu.gpa && (
                      <span className="text-xs text-gray-400"> (GPA: {edu.gpa})</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">
                    {edu.startDate}{edu.startDate && " – "}{edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </ProSection>
        )}

        {/* Skills — tag pills */}
        {data.skills.length > 0 && (
          <ProSection title="BECERİLER" color={ACCENT}>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => (
                <span
                  key={s.id}
                  className="text-xs px-2.5 py-0.5 rounded-full font-medium text-white"
                  style={{ backgroundColor: BG_DARK }}
                >
                  {s.name}
                  {s.level && (
                    <span className="ml-1 opacity-60">· {s.level}</span>
                  )}
                </span>
              ))}
            </div>
          </ProSection>
        )}

        {/* Languages + Certifications side by side */}
        <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-6">
          {data.languages.length > 0 && (
            <div>
              <h3
                className="text-xs uppercase tracking-wider font-bold mb-1.5"
                style={{ color: ACCENT }}
              >
                Diller
              </h3>
              <div className="space-y-1">
                {data.languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-xs">
                    <span className="text-gray-700 font-medium">{l.name}</span>
                    <span className="text-gray-400">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.certifications.length > 0 && (
            <div>
              <h3
                className="text-xs uppercase tracking-wider font-bold mb-1.5"
                style={{ color: ACCENT }}
              >
                Sertifikalar
              </h3>
              <div className="space-y-1.5">
                {data.certifications.map((c) => (
                  <div key={c.id} className="text-xs">
                    <span className="font-semibold text-gray-800">{c.name}</span>
                    {c.issuer && (
                      <span className="text-gray-400"> — {c.issuer}</span>
                    )}
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

function ProSection({
  title,
  color,
  children,
}: {
  title: string
  color: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-4 pt-3 border-t border-gray-100">
      <h2 className="text-xs uppercase tracking-wider font-bold mb-2" style={{ color }}>
        {title}
      </h2>
      {children}
    </div>
  )
}
