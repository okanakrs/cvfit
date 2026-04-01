import type { ContentBlock } from "./posts"

interface BlogContentProps {
  blocks: ContentBlock[]
}

export function BlogContent({ blocks }: BlogContentProps) {
  return (
    <div className="max-w-none">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={index} className="text-2xl font-bold text-foreground mt-10 mb-4">
                {block.text}
              </h2>
            )

          case "h3":
            return (
              <h3 key={index} className="text-xl font-semibold text-foreground mt-7 mb-3">
                {block.text}
              </h3>
            )

          case "p":
            return (
              <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                {block.text}
              </p>
            )

          case "ul":
            return (
              <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-foreground/90">
                {block.items.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )

          case "ol":
            return (
              <ol key={index} className="list-decimal list-inside space-y-2 mb-4 text-foreground/90">
                {block.items.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ol>
            )

          case "bold_p":
            return (
              <p key={index} className="text-foreground/90 leading-relaxed mb-4">
                <strong className="text-foreground font-semibold">{block.label}</strong>{" "}
                {block.text}
              </p>
            )

          case "callout":
            return (
              <div
                key={index}
                className="border-l-4 border-border bg-muted/40 px-5 py-4 my-6 rounded-r-lg"
              >
                <p className="text-muted-foreground text-sm leading-relaxed m-0">{block.text}</p>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
