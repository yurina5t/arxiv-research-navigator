import { useEffect, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import type { Citation, Paper } from "../types";
import { formatAuthors, formatDate } from "../lib/format";

interface PaperDrawerProps {
  paper: Paper | null;
  onClose: () => void;
  citations?: Citation[];
  activeCitationId?: string;
}

export function PaperDrawer({ paper, onClose, citations = [], activeCitationId }: PaperDrawerProps) {
  const activeCitation = useRef<HTMLLIElement>(null);
  useEffect(() => {
    activeCitation.current?.scrollIntoView({ block: "nearest" });
  }, [paper?.id, activeCitationId]);
  if (!paper) return null;

  return (
    <article className="min-w-0">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <p className="text-xs font-medium text-forest-2">{paper.arxivId}</p>
            <h3 className="mt-2 text-2xl font-semibold leading-snug text-ink">
              {paper.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть статью"
            className="shrink-0 rounded-full p-2 text-muted hover:bg-paper hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <p className="text-sm text-muted">
            {formatAuthors(paper.authors)}
            <span className="mx-2">·</span>
            {formatDate(paper.published)}
            <span className="mx-2">·</span>
            {paper.citations} цитирований
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            {paper.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-paper px-2.5 py-1 text-muted"
              >
                {category}
              </span>
            ))}
            <span className="rounded-full bg-paper px-2.5 py-1 text-muted">
              {paper.venue}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 ${
                paper.license === "cc"
                  ? "bg-forest/10 text-forest-2"
                  : "bg-warn-bg text-warn"
              }`}
            >
              {paper.license === "cc"
                ? "Creative Commons"
                : "только короткие цитаты"}
            </span>
          </div>

          <section>
            <h3 className="text-xs font-medium tracking-wide text-muted uppercase">
              TLDR
            </h3>
            <p className="mt-2 text-base leading-7">{paper.tldr}</p>
          </section>

          <section>
            <h3 className="text-xs font-medium tracking-wide text-muted uppercase">
              Аннотация
            </h3>
            <p className="mt-2 text-base leading-7 text-ink/85">
              {paper.abstract}
            </p>
          </section>

          <section aria-label="Цитаты из статьи">
            <h3 className="text-sm font-semibold">Цитаты из статьи</h3>
            <ol className="mt-3 space-y-3">
              {citations.filter((citation) => citation.paperId === paper.id).map((citation) => (
                <li key={citation.id} ref={citation.id === activeCitationId ? activeCitation : undefined} className={`rounded-xl border bg-card p-4 ${citation.id === activeCitationId ? "border-forest/40 ring-1 ring-forest/20" : "border-line"}`}>
                  <p className="text-xs font-medium text-muted">{citation.section}</p>
                  <blockquote className="mt-2 border-l-2 border-gold pl-3 text-sm leading-relaxed">{citation.quote}</blockquote>
                  <a href={citation.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-forest hover:underline">{citation.url.includes("/abs/") ? "Открыть аннотацию в arXiv" : "Открыть абзац в arXiv"}<ExternalLink size={13} /></a>
                </li>
              ))}
            </ol>
            {!citations.some((citation) => citation.paperId === paper.id) && <p className="mt-2 text-sm text-muted">В демо-корпусе нет цитат из этой статьи.</p>}
          </section>

          <div className="flex flex-wrap gap-2">
            <a
              href={paper.htmlUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-3 py-2 text-sm text-paper"
            >
              HTML на arXiv
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-sm text-ink"
            >
              PDF
            </a>
          </div>
        </div>
    </article>
  );
}
