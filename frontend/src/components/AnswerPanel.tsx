import { ExternalLink, ShieldAlert } from "lucide-react";
import type { Citation, DemoAnswer, Paper } from "../types";
import { formatAuthors } from "../lib/format";

interface AnswerPanelProps {
  answer: DemoAnswer;
  citations: Citation[];
  papers: Paper[];
  onOpenPaper: (paperId: string) => void;
  onOpenCitation?: (citation: Citation) => void;
}

export function AnswerPanel({
  answer,
  citations,
  papers,
  onOpenPaper,
  onOpenCitation,
}: AnswerPanelProps) {
  const byId = Object.fromEntries(citations.map((item) => [item.id, item]));
  const papersById = Object.fromEntries(papers.map((item) => [item.id, item]));

  return (
    <div className="mx-auto max-w-[1000px] space-y-7">
      <section className="rounded-2xl border border-line bg-card p-5 shadow-sm sm:p-7 xl:p-9">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          Ответ по корпусу · демо
        </p>
        <h2 className="mt-3 text-2xl font-semibold leading-snug text-ink xl:text-[28px]">
          {answer.question}
        </h2>
        <div className="mt-6 max-w-[80ch] space-y-5 text-base leading-7 text-ink/90">
          {answer.summary.map((block, index) => (
            <p
              key={index}
              className={
                block.unverified
                  ? "rounded-xl bg-warn-bg/70 px-3 py-2 text-[15px]"
                  : undefined
              }
            >
              {block.unverified && (
                <span className="mb-1 flex items-center gap-1.5 text-xs font-medium text-warn">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Не подтверждено цитатой
                </span>
              )}
              {block.text}{" "}
              {block.citationIds.map((id) => {
                const citation = byId[id];
                if (!citation) return null;
                const number = citations.findIndex((item) => item.id === id) + 1;
                return (
                  <a
                    key={id}
                    href={`#cite-${id}`}
                    aria-label={`Открыть источник ${number}`}
                    onClick={(event) => {
                      if (onOpenCitation) {
                        event.preventDefault();
                        onOpenCitation(citation);
                      }
                    }}
                    className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-forest/10 px-1 align-super text-[11px] font-medium text-forest-2 no-underline"
                  >
                    {number}
                  </a>
                );
              })}
            </p>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-base font-semibold text-ink">Источники</h3>
        <ol className="space-y-3">
          {citations.map((citation, index) => {
            const paper = papersById[citation.paperId];
            return (
              <li
                id={`cite-${citation.id}`}
                key={citation.id}
                className="scroll-mt-48 rounded-xl border border-line bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-xs text-paper">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => onOpenPaper(citation.paperId)}
                      className="text-left text-[15px] font-semibold leading-6 text-ink hover:text-forest-2"
                    >
                      {paper?.title ?? citation.paperId}
                    </button>
                    {paper && (
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {formatAuthors(paper.authors)} · {citation.section}
                      </p>
                    )}
                    <blockquote className="mt-2 border-l-2 border-forest/25 pl-3 text-sm leading-relaxed text-ink/80">
                      {citation.quote}
                    </blockquote>
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-forest-2 hover:underline"
                    >
                      {citation.url.includes("/abs/") ? "Открыть аннотацию в arXiv" : "Открыть абзац в arXiv"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
