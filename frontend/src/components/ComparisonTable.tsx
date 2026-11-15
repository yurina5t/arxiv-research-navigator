import { useState } from "react";
import { ExternalLink, ShieldAlert } from "lucide-react";
import type { Citation, CompareCell, CompareRow, Paper } from "../types";
import { COMPARE_COLUMNS } from "../types";
import { citationById } from "../data/demo";

interface ComparisonTableProps {
  rows: CompareRow[];
  papers: Paper[];
  onOpenPaper: (paperId: string) => void;
  onOpenCitation?: (citation: Citation) => void;
}

export function ComparisonTable({
  rows,
  papers,
  onOpenPaper,
  onOpenCitation,
}: ComparisonTableProps) {
  const [active, setActive] = useState<{
    paperId: string;
    citation?: Citation;
    unverified?: boolean;
    value: string;
  } | null>(null);

  const papersById = Object.fromEntries(papers.map((item) => [item.id, item]));

  function openCell(paperId: string, cell: CompareCell) {
    const citation = cell.citationId ? citationById(cell.citationId) : undefined;
    if (citation) onOpenCitation?.(citation);
    setActive({
      paperId,
      citation,
      unverified: cell.unverified,
      value: cell.value,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            Таблица сравнения · демо
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-snug text-ink xl:text-[28px]">
            Метод, данные и метрики
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          Ячейка открывает цитату. Янтарный маркер — значение не проверено.
        </p>
      </div>

      <div
        className="overflow-x-auto rounded-xl border border-line bg-card shadow-sm"
        tabIndex={0}
        role="region"
        aria-label="Сравнение статей — таблицу можно прокручивать по горизонтали"
      >
        <table className="w-full min-w-[1100px] table-fixed border-collapse text-left text-sm leading-relaxed">
          <thead>
            <tr className="border-b border-line bg-paper text-sm text-muted">
              <th className="left-0 z-10 sm:sticky w-[240px] border-r border-line bg-paper px-5 py-4 font-semibold">
                Статья
              </th>
              {COMPARE_COLUMNS.map((column) => (
                <th key={column.key} className="px-4 py-4 font-semibold">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const paper = papersById[row.paperId];
              return (
                <tr key={row.paperId} className="group border-b border-line last:border-0 hover:bg-paper/60">
                  <th className="left-0 z-10 sm:sticky border-r border-line bg-card px-5 py-4 align-top font-medium group-hover:bg-paper">
                    <button
                      type="button"
                      onClick={() => onOpenPaper(row.paperId)}
                      className="text-left hover:text-forest-2"
                    >
                      {paper?.title ?? row.paperId}
                    </button>
                    <p className="mt-2 text-xs font-normal text-muted">
                      {paper?.arxivId}
                    </p>
                  </th>
                  {COMPARE_COLUMNS.map((column) => {
                    const cell = row.cells[column.key];
                    return (
                      <td key={column.key} className="px-2 py-2 align-top">
                        <button
                          type="button"
                          onClick={() => openCell(row.paperId, cell)}
                          className={`w-full rounded-xl px-2 py-2 text-left leading-relaxed transition hover:bg-paper ${
                            cell.unverified ? "bg-warn-bg/60" : ""
                          }`}
                        >
                          <span>{cell.value}</span>
                          {cell.unverified && (
                            <ShieldAlert className="ml-1 inline h-3.5 w-3.5 text-warn" />
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {active && (
        <aside className="rounded-2xl border border-line bg-card p-5">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            {active.unverified ? "Непроверенное значение" : "Цитата к ячейке"}
          </p>
          <p className="mt-2 font-medium text-ink">{active.value}</p>
          {active.unverified && (
            <p className="mt-2 text-sm text-warn">
              В демо-корпусе для этого поля нет подтверждающего фрагмента —
              так пайплайн будет помечать сомнительные извлечения.
            </p>
          )}
          {active.citation && (
            <>
              <blockquote className="mt-3 border-l-2 border-forest/25 pl-3 text-sm leading-relaxed">
                {active.citation.quote}
              </blockquote>
              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => onOpenPaper(active.paperId)}
                  className="font-medium text-forest-2 hover:underline"
                >
                  {papersById[active.paperId]?.title}
                </button>
                <a
                  href={active.citation.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-muted hover:text-ink"
                >
                  {active.citation.section}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </>
          )}
        </aside>
      )}
    </div>
  );
}
