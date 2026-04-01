import type { CVData } from "@/types/cv"
import { getCVLabels } from "@/lib/cv-labels"

const ACCENT = "#2563eb"

function skillPct(level: string) {
  return level === "Uzman" ? 100 : level === "İleri" ? 75 : level === "Orta" ? 50 : 25
}

export default function ModernTemplate({ data, locale }: { data: CVData; locale?: string }) {
  const p = data.personal
  const L = getCVLabels(locale)
  return (
    <div className="flex" style={{ minHeight: 1123, fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* Left Sidebar */}
      <div className="flex-shrink-0 p-6 space-y-5 bg-gray-100" style={{ width: "35%" }}>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{p.fullName || "Ad Soyad"}</h1>
          {p.title && <p className="text-sm font-medium mt-1" style={{ color: ACCENT }}>{p.title}</p>}
        </div>

        <div>
          <SidebarHeading>{L.contact}</SidebarHeading>
          <div className="space-y-1 text-sm text-gray-600">
            {p.email && <p>{p.email}</p>}
            {p.phone && <p>{p.phone}</p>}
            {p.location && <p>{p.location}</p>}
            {p.linkedin && <p className="break-all">{p.linkedin}</p>}
            {p.website && <p className="break-all">{p.website}</p>}
          </div>
        </div>

        {data.skills.length > 0 && (
          <div>
            <SidebarHeading>{L.skills}</SidebarHeading>
            <div className="space-y-2">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <div className="flex justify-between text-sm mb-0.5">
                    <span className="text-gray-700 font-medium">{s.name}</span>
                    <span className="text-gray-400">{s.level}</span>
                  </div>
                  <div className="h-1.5 bg-gray-300 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${skillPct(s.level)}%`, backgroundColor: ACCENT }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.languages.length > 0 && (
          <div>
            <SidebarHeading>{L.languages}</SidebarHeading>
            <div className="space-y-1">
              {data.languages.map((l) => (
                <div key={l.id} className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">{l.name}</span>
                  <span className="text-gray-400">{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="p-7 space-y-5" style={{ width: "65%" }}>
        {p.summary && (
          <div>
            <MainHeading>{L.about}</MainHeading>
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{p.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <MainHeading>{L.experience}</MainHeading>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">{exp.position || "Pozisyon"}</span>
                    <span className="text-sm text-gray-400 shrink-0 ml-4">
                      {exp.startDate}{exp.startDate && " – "}{exp.current ? L.ongoing : exp.endDate}
                    </span>
                  </div>
                  {exp.company && <p className="text-sm font-medium" style={{ color: ACCENT }}>{exp.company}</p>}
                  {exp.description && <p className="text-sm text-gray-600 whitespace-pre-line mt-1 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <MainHeading>{L.education}</MainHeading>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">{edu.degree}{edu.field ? `, ${edu.field}` : ""}</span>
                    <span className="text-sm text-gray-400 shrink-0 ml-4">{edu.startDate}{edu.startDate && " – "}{edu.endDate}</span>
                  </div>
                  {edu.school && <p className="text-sm font-medium" style={{ color: ACCENT }}>{edu.school}</p>}
                  {edu.gpa && <p className="text-sm text-gray-400">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.certifications.length > 0 && (
          <div>
            <MainHeading>{L.certifications}</MainHeading>
            <div className="space-y-2">
              {data.certifications.map((c) => (
                <div key={c.id} className="text-sm">
                  <span className="font-bold text-gray-900">{c.name}</span>
                  {c.issuer && <span className="text-gray-600"> — {c.issuer}</span>}
                  {c.date && <span className="text-gray-400 ml-2">{c.date}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs uppercase tracking-wider font-bold mb-2 pb-1 border-b" style={{ color: ACCENT, borderColor: `${ACCENT}33` }}>
      {children}
    </h3>
  )
}

function MainHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm uppercase tracking-wider font-bold mb-3 pb-1 border-b border-gray-200" style={{ color: ACCENT }}>
      {children}
    </h2>
  )
}
