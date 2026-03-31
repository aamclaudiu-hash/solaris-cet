import { useMemo } from "react"
import { useLanguage } from "@/hooks/useLanguage"
import { formatCetInteger } from "@/lib/numerals"

const COLS = 12
const ROWS = 8
const CELLS = COLS * ROWS

type YieldLevel = "high" | "med" | "low" | "water"

function yieldForIndex(i: number): { level: YieldLevel; prediction: number } {
  const x = i % COLS
  const y = Math.floor(i / COLS)
  const n = (Math.sin(x * 0.7 + y * 0.9) + 1) / 2
  const prediction = Math.round((0.75 + n * 0.55) * 100) / 100
  let level: YieldLevel = "med"
  if (n > 0.72) level = "high"
  else if (n < 0.28) level = "low"
  if ((x + y * 3) % 17 === 0) level = "water"
  return { level, prediction }
}

/**
 * Presentational heatmap (RAV / agri narrative — not a live oracle).
 * CSS-only cells + `title` tooltips; no client JS requirement if reused on static surfaces.
 */
export function PredictiveTerrainHeatmap() {
  const { t, lang } = useLanguage()

  const cells = useMemo(() => {
    return Array.from({ length: CELLS }, (_, i) => {
      const { level, prediction } = yieldForIndex(i)
      return { i, level, prediction }
    })
  }, [])

  const localeDemo = formatCetInteger(124, lang)

  return (
    <div className="mt-12 rounded-2xl border border-emerald-400/20 bg-black/30 p-6 md:p-8">
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="font-display text-lg md:text-xl text-solaris-text">
            Predictive terrain <span className="text-emerald-400/90">(illustrative)</span>
          </h3>
          <p className="text-solaris-muted text-sm max-w-2xl mt-1">
            {t.sectionAria.predictiveTerrainHeatmap}
          </p>
        </div>
      </div>

      <div
        className="grid w-full max-w-3xl mx-auto gap-px aspect-[12/8] bg-slate-950/80 p-px rounded-lg border border-white/10"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
        }}
        role="img"
        aria-label={t.sectionAria.predictiveTerrainHeatmap}
      >
        {cells.map(({ i, level, prediction }) => (
          <div
            key={i}
            className="min-h-[6px] min-w-0 rounded-[1px] transition-colors motion-reduce:transition-none focus:outline focus:outline-2 focus:outline-solaris-gold/50"
            data-yield={level}
            title={`~${prediction.toFixed(2)} CET/ha (model illustrative)`}
            style={{
              background:
                level === "water"
                  ? "rgba(59, 130, 246, 0.42)"
                  : level === "high"
                    ? "rgba(242, 201, 76, 0.55)"
                    : level === "med"
                      ? "rgba(242, 201, 76, 0.28)"
                      : "rgba(242, 201, 76, 0.12)",
              boxShadow:
                level === "high" ? "0 0 8px rgba(242, 201, 76, 0.25)" : undefined,
            }}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between gap-2 text-[10px] font-mono text-slate-500">
        <span>Model label: RAV-AGRI-v2.6 (presentational)</span>
        <span>
          Locale sample: <span className="text-solaris-gold/80">{localeDemo}</span> · CET/ha (unit demo)
        </span>
      </div>
    </div>
  )
}
