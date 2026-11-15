import { ArrowRight, CalendarRange } from "lucide-react";
import type { ArxivCategory, SearchFilters } from "../types";
import { ALL_CATEGORIES } from "../types";

interface SearchFormProps {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
  onSubmit: () => void;
  compact?: boolean;
  loading?: boolean;
}

export function SearchForm({
  filters,
  onChange,
  onSubmit,
  compact = false,
  loading = false,
}: SearchFormProps) {
  function toggleCategory(category: ArxivCategory) {
    const selected = filters.categories.includes(category)
      ? filters.categories.filter((item) => item !== category)
      : [...filters.categories, category];
    onChange({
      ...filters,
      categories: selected.length ? selected : [category],
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div
        className={`flex items-center gap-2 rounded-2xl border border-line bg-card shadow-sm transition focus-within:border-forest/40 focus-within:ring-2 focus-within:ring-forest/10 ${
          compact ? "p-2 pl-3 sm:pl-4" : "p-2.5 pl-3 sm:pl-5"
        }`}
      >
        <label className="min-w-0 flex-1">
          <span className="sr-only">Вопрос или тема</span>
          <input
            value={filters.query}
            onChange={(event) =>
              onChange({ ...filters, query: event.target.value })
            }
            placeholder="Что вы хотите исследовать?"
            className={`w-full bg-transparent text-ink outline-none placeholder:text-muted/70 ${
              compact ? "h-10 text-base" : "h-12 text-base"
            }`}
          />
        </label>
        <button
          type="submit"
          disabled={loading || !filters.query.trim()}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-forest px-3 text-sm font-medium sm:px-4 text-paper transition hover:bg-forest-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Ищем…" : "Искать"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div
        className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${compact ? "text-sm" : "text-[15px]"}`}
      >
        <div className="grid w-full min-w-0 grid-cols-[16px_minmax(0,1fr)] items-center gap-2 text-muted min-[480px]:grid-cols-[16px_minmax(0,1fr)_auto_minmax(0,1fr)] sm:flex sm:w-auto">
          <CalendarRange className="h-4 w-4" />
          <label className="flex min-w-0 items-center gap-1.5">
            <span className="sr-only">С</span>
            <input
              type="date"
              value={filters.from}
              onChange={(event) =>
                onChange({ ...filters, from: event.target.value })
              }
              className="w-full min-w-0 rounded-lg border border-line bg-card px-2 py-1.5 text-sm text-ink sm:w-auto"
            />
          </label>
          <span>—</span>
          <label className="min-w-0">
            <span className="sr-only">По</span>
            <input
              type="date"
              value={filters.to}
              onChange={(event) =>
                onChange({ ...filters, to: event.target.value })
              }
              className="w-full min-w-0 rounded-lg border border-line bg-card px-2 py-1.5 text-sm text-ink sm:w-auto"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((category) => {
            const active = filters.categories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`rounded-full border px-2.5 py-1 font-medium transition ${
                  active
                    ? "border-forest/20 bg-forest text-paper"
                    : "border-line bg-card text-muted hover:border-forest/30 hover:text-ink"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </form>
  );
}
