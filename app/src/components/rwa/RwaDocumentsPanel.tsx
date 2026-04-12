import { useMemo, useState } from 'react';
import { Download, ExternalLink, FileText, Search } from 'lucide-react';
import type { RwaDocument, RwaDocType } from '@/lib/rwaPortfolio';

function labelForType(t: RwaDocType): string {
  if (t === 'whitepaper') return 'Whitepaper';
  if (t === 'land_registry') return 'Land registry';
  if (t === 'audit') return 'Audit';
  if (t === 'ipfs_proof') return 'IPFS proof';
  return 'Timeline';
}

export function RwaDocumentsPanel({
  documents,
  title = 'Documents',
}: {
  documents: readonly RwaDocument[];
  title?: string;
}) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<RwaDocType | 'all'>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return documents.filter((d) => {
      const typeOk = typeFilter === 'all' ? true : d.docType === typeFilter;
      const qOk = !q ? true : d.title.toLowerCase().includes(q);
      return typeOk && qOk;
    });
  }, [documents, query, typeFilter]);

  return (
    <section
      id="documente"
      className="bento-card border border-white/10 p-6 shadow-depth scroll-mt-28"
      aria-label="RWA documents"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display font-bold text-base text-solaris-text">{title}</h3>
          <p className="text-solaris-muted text-sm mt-1">
            Preview when possible; download links open in a new tab.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <label className="relative">
            <span className="sr-only">Search documents</span>
            <Search className="w-4 h-4 text-solaris-muted absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-11 w-full sm:w-64 rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 text-sm text-solaris-text placeholder:text-solaris-muted focus:outline-none focus:ring-1 focus:ring-solaris-gold/40"
              placeholder="Search…"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Filter by type</span>
            <select
              className="min-h-11 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-solaris-text focus:outline-none focus:ring-1 focus:ring-solaris-gold/40"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as RwaDocType | 'all')}
            >
              <option value="all">All types</option>
              <option value="whitepaper">Whitepaper</option>
              <option value="audit">Audit</option>
              <option value="ipfs_proof">IPFS proof</option>
              <option value="land_registry">Land registry</option>
              <option value="timeline">Timeline</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((d) => (
          <article
            key={d.id}
            className="rounded-2xl border border-white/10 bg-black/30 p-5 hover:bg-black/40 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-solaris-gold" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h4 className="font-display font-semibold text-sm text-solaris-text truncate">{d.title}</h4>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-solaris-muted">
                    {labelForType(d.docType)}
                  </span>
                  <span className="text-[10px] font-mono text-solaris-muted">{d.publishedAt}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 text-xs font-semibold text-solaris-text hover:border-solaris-gold/30 hover:text-solaris-gold transition-colors"
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                Preview
              </a>
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 text-xs font-semibold text-solaris-text hover:border-emerald-500/30 hover:text-emerald-300 transition-colors"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Download
              </a>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-solaris-muted">
          No documents match your filters.
        </div>
      ) : null}
    </section>
  );
}

