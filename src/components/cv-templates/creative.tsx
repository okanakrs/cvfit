import type { CVData } from "@/types/cv"

const ACCENT = "#7c3aed"

export default function CreativeTemplate({ data }: { data: CVData }) {
  const p = data.personal
  return (
    <div className="flex" style={{ minHeight: 1123, fontFamily: "Roboto, Arial, sans-serif" }}>
      {/* Sidebar — 34% */}
      <div className="flex-shrink-0 p-6 space-y-5 text-white" style={{ width: "34%", backgroundColor: ACCENT }}>
        {/* Avatar */}
        <div className="flex justify-center pt-2">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            {(p.fullName || "A S").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold leading-tight">{p.fullName || "Ad Soyad"}</h1>
          {p.title && <p className="text-sm mt-1 opacity-80">{p.title}</p>}
        </div>

        <SideSection title="İLETİŞİM">
          <div className="space-y-1.5 text-sm opacity-90">
            {p.email && <p>✉ {p.email}</p>}
            {p.phone && <p>✆ {p.phone}</p>}
            {p.location && <p>◉ {p.location}</p>}
            {p.linkedin && <p className="break-all">⌁ {p.linkedin}</p>}
            {p.website && <p className="break-all">⌂ {p.website}</p>}
          </div>
        </SideSection>

        {data.skills.length > 0 && (
          <SideSection title="BECERİLER">
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s) => (
                <span key={s.id} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                  {s.name}
                </span>
              ))}
            </div>
          </SideSection>
        )}

        {data.languages.length > 0 && (
          <SideSection title="DİLLER">
            <div className="space-y-1.5">
              {data.languages.map((l) => (
                <div key={l.id} className="flex justify-between text-sm">
                  <span className="font-medium">{l.name}</span>
                  <span className="opacity-70">{l.level}</span>
                </div>
              ))}
            </div>
          </SideSection>
        )}
      </div>

      {/* Main Content — 66% */}
      <div className="p-7 space-y-5" style={{ width: "66%" }}>
        {p.summary && (
          <div>
            <MainHeading>HAKKIMDA</MainHeading>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{p.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <MainHeading>DENEYİM</MainHeading>
            <div className="space-y-4 border-l-2 pl-4 ml-1" style={{ borderColor: "#ddd6fe" }}>
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">{exp.position || "Pozisyon"}</span>
                    <span className="text-sm text-gray-400 shrink-0 ml-4">
                      {exp.startDate}{exp.startDate && " – "}{exp.current ? "Devam Ediyor" : exp.endDate}
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
            <MainHeading>EĞİTİM</MainHeading>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-900">
                      {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                    </span>
                    <span className="text-sm text-gray-400 shrink-0 ml-4">
                      {edu.startDate}{edu.startDate && " – "}{edu.endDate}
                    </span>
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
            <MainHeading>SERTİFİKALAR</MainHeading>
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

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest font-bold mb-2 pb-1 border-b border-white/20">{title}</h3>
      {children}
    </div>
  )
}

function MainHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-sm uppercase tracking-wider font-bold mb-3 pb-1.5 border-b-2" style={{ color: ACCENT, borderColor: ACCENT }}>
      {children}
    </h2>
  )
}
