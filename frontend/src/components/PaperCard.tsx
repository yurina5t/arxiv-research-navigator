import { Quote } from "lucide-react";
import type { Paper } from "../types";
import { formatAuthors, formatDate } from "../lib/format";

interface PaperCardProps {
  paper: Paper;
  selected?: boolean;
  onOpen: (paper: Paper) => void;
}

export function PaperCard({ paper, selected, onOpen }: PaperCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(paper)}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? "border-forest/50 bg-card ring-1 ring-forest/15"
          : "border-line bg-card hover:border-forest/30 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 text-[15px] font-semibold leading-6 text-ink">{paper.title}</p>
        <span className="shrink-0 rounded-full bg-forest/8 px-2 py-0.5 text-xs font-medium text-muted">
          {Math.round(paper.relevance * 100)}%
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {formatAuthors(paper.authors)} · {formatDate(paper.published)}
      </p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/80">
        <Quote className="mr-1 inline h-3 w-3 text-forest-2" />
        {paper.tldr}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="font-medium text-forest-2">{paper.arxivId}</span>
        {paper.categories.map((category) => (
          <span key={category} className="rounded-md bg-paper px-1.5 py-0.5">
            {category}
          </span>
        ))}
        <span>{paper.citations} цит.</span>
        {paper.license !== "cc" && (
          <span className="rounded-md bg-warn-bg px-1.5 py-0.5 text-warn">
            краткие цитаты
          </span>
        )}
      </div>
    </button>
  );
}
