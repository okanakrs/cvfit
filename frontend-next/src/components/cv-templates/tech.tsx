import type { CVData } from "@/types/cv"
import { getCVLabels } from "@/lib/cv-labels"

const SIDEBAR_BG = "#0f172a"
const ACCENT = "#38bdf8"

export default function TechTemplate({ data, locale }: { data: CVData; locale?: string }) {
  const p = data.personal
  const L = getCVLabels(locale)
  return (
    <div className="flex" style={{ minHeight: 1123, fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* Dark Sidebar */}
      <div className="flex-shrink-0 p-6 space-y-5" style={{ width: "36%", backgroundColor: SIDEBAR_BG, color: "#e2e8f0" }}>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight tracking-wide">{p.fullName || L.fullName}</h1>
          {p.title && <p className="text-sm mt-1 font-mono" style={{ color: ACCENT }}>{`> ${p.title}`}</p>}
        </div>

        <SideBlock title={L.contact}>
          <div className="space-y-1.5 text-sm text-slate-300">
            {p.email && <p><span style={{ color: ACCENT }}>@</span> {p.email}</p>}
            {p.phone && <p><span style={{ color: ACCENT }}>#</span> {p.phone}</p>}
            {p.location && <p><span style={{ color: ACCENT }}>~</span> {p.location}</p>}
            {p.linkedin && <p className="break-all"><span style={{ color: ACCENT }}>in</span> {p.linkedin}</p>}
            {p.website && <p className="break-all"><span style={{ color: ACCENT }}>→</span> {p.website}</p>}
          </div>
        </SideBlock>

        {data.skills.length > 0 && (
          <SideBlock title={L.skills}>
            <div className="space-y-2.5">
              {data.skills.map((s) => {
                const pct = s.level === "Uzman" ? 100 : s.level === "İleri" ? 75 : s.level === "Orta" ? 50 : 25
                return (
                  <div key={s.id}>
                    <div className="flex justify-between text-sm mb-0.5">
                      <span className="font-mono text-slate-200">{s.name}</span>
                      <span className="text-slate-500">{s.level}</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ACCENT }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </SideBlock>
        )}

        {data.languages.length > 0 && (
          <SideBlock title={L.languagesShort}>
            <div className="space-y-1.5">
              {data.languages.map((l) => (
                <div key={l.id} className="flex justify-between text-sm">
                  <span className="text-slate-200">{l.name}</span>
                  <span className="font-mono" style={{ color: ACCENT }}>{l.level}</span>
                </div>
              ))}
            </div>
          </SideBlock>
        )}
      </div>

      {/* Main Content */}
      <div className="p-7 space-y-5 bg-white" style={{ width: "64%" }}>
        {p.summary && (
          <div>
            <ContentHeading>{L.about}</ContentHeading>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{p.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <ContentHeading>{L.experience}</ContentHeading>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: `${ACCENT}40` }}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">{exp.position || L.position}</span>
                    <span className="text-sm text-gray-400 shrink-0 ml-4">
                      {exp.startDate}{exp.startDate && " – "}{exp.current ? L.ongoing : exp.endDate}
                    </span>
                  </div>
                  {exp.company && <p className="text-sm font-mono font-medium" style={{ color: ACCENT }}>{exp.company}</p>}
                  {exp.description && <p className="text-sm text-gray-600 whitespace-pre-line mt-1 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <ContentHeading>{L.education}</ContentHeading>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</span>
                    <span className="text-sm text-gray-400 shrink-0 ml-4">{edu.startDate}{edu.startDate && " – "}{edu.endDate}</span>
                  </div>
                  {edu.school && <p className="text-sm font-mono" style={{ color: ACCENT }}>{edu.school}</p>}
                  {edu.gpa && <p className="text-sm text-gray-400">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.certifications.length > 0 && (
          <div>
            <ContentHeading>{L.certificationsShort}</ContentHeading>
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

function SideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest font-bold mb-2 pb-1 border-b border-slate-700" style={{ color: ACCENT }}>{title}</h3>
      {children}
    </div>
  )
}

function ContentHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm uppercase tracking-wider font-bold mb-3 pb-1 border-b border-gray-200" style={{ color: SIDEBAR_BG }}>{children}</h2>
  )
}
