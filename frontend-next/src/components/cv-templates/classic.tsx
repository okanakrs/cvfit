import type { CVData } from "@/types/cv"
import { getCVLabels } from "@/lib/cv-labels"

export default function ClassicTemplate({ data, locale }: { data: CVData; locale?: string }) {
  const p = data.personal
  const L = getCVLabels(locale)
  return (
    <div className="p-10 font-sans text-gray-800" style={{ fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* Header */}
      <div className="text-center pb-4 border-b-2 border-gray-800 mb-5">
        <h1 className="text-3xl font-bold text-gray-900 tracking-wide">
          {p.fullName || "Ad Soyad"}
        </h1>
        {p.title && <p className="text-base text-gray-500 mt-1">{p.title}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-sm text-gray-500 mt-2">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>|  {p.phone}</span>}
          {p.location && <span>|  {p.location}</span>}
          {p.linkedin && <span>|  {p.linkedin}</span>}
          {p.website && <span>|  {p.website}</span>}
        </div>
      </div>

      {p.summary && (
        <Section title={L.summary}>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{p.summary}</p>
        </Section>
      )}

      {data.experience.length > 0 && (
        <Section title={L.experience}>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-gray-900">{exp.position || "Pozisyon"}</span>
                    {exp.company && <span className="text-sm text-gray-600">,  {exp.company}</span>}
                  </div>
                  <span className="text-sm text-gray-500 shrink-0 ml-4">
                    {exp.startDate}{exp.startDate && " – "}{exp.current ? L.ongoing : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-600 whitespace-pre-line mt-1 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title={L.education}>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-gray-900">
                    {edu.degree || "Derece"}{edu.field ? `, ${edu.field}` : ""}
                  </span>
                  {edu.school && <span className="text-sm text-gray-600"> — {edu.school}</span>}
                  {edu.gpa && <span className="text-sm text-gray-400"> (GPA: {edu.gpa})</span>}
                </div>
                <span className="text-sm text-gray-500 shrink-0 ml-4">
                  {edu.startDate}{edu.startDate && " – "}{edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title={L.skills}>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
            {data.skills.map((s) => (
              <span key={s.id}>{s.name}{s.level ? ` (${s.level})` : ""}</span>
            ))}
          </div>
        </Section>
      )}

      {data.languages.length > 0 && (
        <Section title={L.languages}>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
            {data.languages.map((l) => (
              <span key={l.id}>{l.name}{l.level ? ` (${l.level})` : ""}</span>
            ))}
          </div>
        </Section>
      )}

      {data.certifications.length > 0 && (
        <Section title={L.certifications}>
          <div className="space-y-1.5">
            {data.certifications.map((c) => (
              <div key={c.id} className="text-sm">
                <span className="font-bold text-gray-900">{c.name}</span>
                {c.issuer && <span className="text-gray-600"> — {c.issuer}</span>}
                {c.date && <span className="text-gray-400 ml-2">{c.date}</span>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h2 className="text-sm font-bold text-gray-900 tracking-widest border-b border-gray-400 pb-1 mb-3">
        {title}
      </h2>
      {children}
    </div>
  )
}
