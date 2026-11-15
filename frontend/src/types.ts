export type ArxivCategory = "cs.CL" | "cs.AI" | "cs.IR" | "cs.LG";

export interface Paper {
  id: string;
  arxivId: string;
  title: string;
  authors: string[];
  published: string;
  categories: ArxivCategory[];
  citations: number;
  venue: string;
  tldr: string;
  abstract: string;
  relevance: number;
  license: "cc" | "other";
  pdfUrl: string;
  htmlUrl: string;
}

export interface Citation {
  id: string;
  paperId: string;
  section: string;
  url: string;
  quote: string;
}

export interface SearchFilters {
  query: string;
  from: string;
  to: string;
  categories: ArxivCategory[];
}

export interface AnswerBlock {
  text: string;
  citationIds: string[];
  unverified?: boolean;
}

export interface DemoAnswer {
  question: string;
  summary: AnswerBlock[];
}

export type CompareColumn =
  | "task"
  | "method"
  | "datasets"
  | "metrics"
  | "result";

export interface CompareCell {
  value: string;
  citationId?: string;
  unverified?: boolean;
}

export interface CompareRow {
  paperId: string;
  cells: Record<CompareColumn, CompareCell>;
}

export const COMPARE_COLUMNS: { key: CompareColumn; label: string }[] = [
  { key: "task", label: "Задача" },
  { key: "method", label: "Метод" },
  { key: "datasets", label: "Датасеты" },
  { key: "metrics", label: "Метрики" },
  { key: "result", label: "Результат" },
];

export const ALL_CATEGORIES: ArxivCategory[] = [
  "cs.CL",
  "cs.AI",
  "cs.IR",
  "cs.LG",
];
