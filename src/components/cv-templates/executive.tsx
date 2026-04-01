import type { CVData } from "@/types/cv"

const HEADER_BG = "#1e293b" // slate-800 / lacivert tonu

export default function ExecutiveTemplate({ data }: { data: CVData }) {
  const p = data.personal
  return (
    <div style={{ minHeight: 1123, fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* Dark Header */}
      <div className="px-8 py-6" style={{ backgroundColor: HEADER_BG }}>
        <h1 className="text-xl font-bold text-white tracking-wide">
          {p.fullName || "Ad Soyad"}
        </h1>
        {p.title && (
          <p className="text-sm text-slate-300 mt-0.5 font-light">{p.title}</p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-400 mt-2">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>|  {p.phone}</span>}
          {p.location && <span>|  {p.location}</span>}
          {p.linkedin && <span>|  {p.linkedin}</span>}
          {p.website && <span>|  {p.website}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-5 space-y-0">
        {/* Summary */}
        {p.summary && (
          <ExecSection title="Profesyonel Özet">
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {p.summary}
            </p>
          </ExecSection>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <ExecSection title="İş Deneyimi">
            <div className="space-y-3">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-gray-900">
                        {exp.position || "Pozisyon"}
                      </span>
                      {exp.company && (
                        <span className="text-sm text-gray-500"> — {exp.company}</span>
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
          </ExecSection>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <ExecSection title="Eğitim">
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
                    {edu.startDate}
                    {edu.startDate && " – "}
                    {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </ExecSection>
        )}

        {/* Two-column: Skills + Languages */}
        {(data.skills.length > 0 || data.languages.length > 0) && (
          <div className="mt-4 pt-3 border-t border-gray-200 grid grid-cols-2 gap-6">
            {data.skills.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-1.5">
                  Beceriler
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((s) => (
                    <span
                      key={s.id}
                      className="text-xs px-2 py-0.5 rounded text-white font-medium"
                      style={{ backgroundColor: HEADER_BG }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.languages.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-1.5">
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
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <ExecSection title="Sertifikalar">
            <div className="space-y-1.5">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-sm">
                  <span className="font-bold text-gray-900">{c.name}</span>
                  {c.issuer && <span className="text-gray-500"> — {c.issuer}</span>}
                  {c.date && <span className="text-gray-400 ml-2">{c.date}</span>}
                </div>
              ))}
            </div>
          </ExecSection>
        )}
      </div>
    </div>
  )
}

function ExecSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 pt-3 border-t border-gray-200">
      <h2 className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}
