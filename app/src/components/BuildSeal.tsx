/**
 * Deployment artifact seal: short git hash + build ISO timestamp (injected at build via vite.config).
 */
export function BuildSeal() {
  const commit = import.meta.env.VITE_GIT_COMMIT_HASH || "unknown"
  const buildTime = import.meta.env.VITE_BUILD_TIMESTAMP || ""
  const date = buildTime.slice(0, 10)

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[200] opacity-30 transition-opacity hover:pointer-events-auto hover:opacity-100"
      aria-hidden="true"
    >
      <div className="rounded border border-white/10 bg-slate-950/90 px-3 py-1 font-mono text-[9px] tracking-widest text-slate-500 shadow-lg backdrop-blur-sm">
        <span>BUILD:</span>
        <span className="ml-1 text-solaris-gold/80">{commit}</span>
        <span className="mx-1 text-slate-600">|</span>
        <span>{date}</span>
      </div>
    </div>
  )
}
