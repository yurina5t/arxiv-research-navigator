import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { SearchForm } from "../components/SearchForm";
import { SUGGESTED_QUERIES } from "../data/demo";
import type { SearchFilters } from "../types";

interface HomePageProps {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
}

export function HomePage({ filters, onChange }: HomePageProps) {
  const navigate = useNavigate();

  function runSearch(query = filters.query) {
    const next = { ...filters, query: query.trim() };
    onChange(next);
    if (!next.query) return;
    navigate("/workspace");
  }

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-[1920px] flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-10">
        <Logo />
        <span className="rounded-full border border-line bg-card px-3 py-1 text-xs text-muted">
          Демонстрационная версия
        </span>
      </header>

      <main className="mx-auto flex max-w-[880px] flex-col px-5 pb-20 pt-12 sm:px-8 md:pt-20">
        <p className="text-sm font-medium tracking-wide text-forest-2">
          Навигатор по arXiv
        </p>
        <h1 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight text-ink sm:text-[32px]">
          От научного вопроса к доказательствам
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
          Находите исследования, сравнивайте методы и получайте ответы,
          подтверждённые источниками
        </p>

        <div className="mt-10">
          <SearchForm
            filters={filters}
            onChange={onChange}
            onSubmit={() => runSearch()}
          />
        </div>

        <div className="mt-8">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            Попробуйте
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {SUGGESTED_QUERIES.map((query) => (
              <button
                key={query}
                type="button"
                onClick={() => runSearch(query)}
                className="rounded-xl border border-line bg-card px-4 py-3 text-left text-[15px] leading-relaxed text-ink transition hover:border-forest/30 hover:bg-forest/5"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
