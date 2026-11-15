import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Columns3, Home, MessageSquareText, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AnswerPanel } from "../components/AnswerPanel";
import { ComparisonTable } from "../components/ComparisonTable";
import { Logo } from "../components/Logo";
import { PaperCard } from "../components/PaperCard";
import { PaperDrawer } from "../components/PaperDrawer";
import { ResizableWorkspace } from "../components/ResizableWorkspace";
import { SearchForm } from "../components/SearchForm";
import { DEMO_ANSWER, DEMO_CITATIONS, DEMO_COMPARE, DEMO_PAPERS, filterPapers, paperById } from "../data/demo";
import { wait } from "../lib/format";
import type { Citation, Paper, SearchFilters } from "../types";

interface WorkspacePageProps {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
}

type Tab = "answer" | "papers" | "compare";
const TABS = [
  { id: "answer", label: "AI-ответ", icon: MessageSquareText },
  { id: "papers", label: "Статьи", icon: BookOpen },
  { id: "compare", label: "Сравнение", icon: Columns3 },
] as const;

export function WorkspacePage({ filters, onChange }: WorkspacePageProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("answer");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Paper | null>(null);
  const [citationId, setCitationId] = useState<string | undefined>();
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const papers = useMemo(() => filterPapers(filters), [filters]);

  useEffect(() => {
    if (!filters.query.trim()) navigate("/");
  }, [filters.query, navigate]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void wait(650).then(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [filters]);

  function openPaper(paper: Paper) {
    setSelected(paper);
    setCitationId(undefined);
    setSourcesOpen(true);
  }

  function openPaperById(paperId: string) {
    const paper = paperById(paperId);
    if (paper) openPaper(paper);
  }

  function openCitation(citation: Citation) {
    const paper = paperById(citation.paperId);
    if (!paper) return;
    setSelected(paper);
    setCitationId(citation.id);
    setSourcesOpen(true);
  }

  return (
    <div className="workspace-shell">
      <header className="shrink-0 border-b border-line bg-card px-4 py-3 md:px-6">
        <SearchForm filters={filters} onChange={onChange} onSubmit={() => undefined} compact loading={loading} />
      </header>

      <div className="workspace-body">
        <aside className={`workspace-navigation ${navigationOpen ? "" : "is-collapsed"}`} aria-label="Навигация">
          <div className="navigation-heading">
            <Link to="/" className="brand-link" aria-label="NaviGators — на главную">
              <Logo compact={!navigationOpen} />
            </Link>
            <button
              type="button"
              onClick={() => setNavigationOpen(!navigationOpen)}
              className="panel-toggle"
              aria-label={navigationOpen ? "Свернуть навигацию" : "Развернуть навигацию"}
              aria-expanded={navigationOpen}
              aria-controls="workspace-navigation-links"
              title={navigationOpen ? "Свернуть навигацию" : "Развернуть навигацию"}
            >
              {navigationOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
          </div>
          <nav id="workspace-navigation-links" className="navigation-links">
            <Link to="/" className="navigation-link" title="Новый поиск">
              <Home size={18} aria-hidden="true" />
              <span className={navigationOpen ? "" : "sr-only"}>Новый поиск</span>
            </Link>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setTab(id)} className={`navigation-link ${tab === id ? "is-active" : ""}`} aria-current={tab === id ? "page" : undefined} title={label}>
                <Icon size={18} aria-hidden="true" />
                <span className={navigationOpen ? "" : "sr-only"}>{label}</span>
              </button>
            ))}
          </nav>
          {navigationOpen && <p className="navigation-note text-xs leading-relaxed text-muted">Демонстрационная версия<br />Исследования из arXiv</p>}
        </aside>

        <ResizableWorkspace
          sourcesOpen={sourcesOpen}
          sourceTitle={selected?.title}
          onToggleSources={() => setSourcesOpen(!sourcesOpen)}
          sourceContent={selected ? (
            <PaperDrawer paper={selected} citations={DEMO_CITATIONS} activeCitationId={citationId} onClose={() => setSourcesOpen(false)} />
          ) : (
            <div className="p-5 text-sm leading-relaxed text-muted"><BookOpen className="mb-4 h-6 w-6 text-forest-2" /><p>Выберите статью, ссылку в AI-ответе или ячейку сравнения, чтобы изучить источник и цитаты.</p></div>
          )}
        >
        <main className="workspace-main" aria-label="Рабочая область">
          <div className="mb-6 flex flex-wrap gap-1 border-b border-line pb-3" aria-label="Разделы исследования">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setTab(id)} aria-pressed={tab === id} aria-controls="workspace-content" className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${tab === id ? "bg-forest text-white" : "text-muted hover:bg-sidebar hover:text-ink"}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />{label}
              </button>
            ))}
          </div>
          <div id="workspace-content" aria-busy={loading}>
            {loading ? (
              <div className="space-y-3" role="status" aria-label="Подбираем статьи">
                <div className="h-8 w-2/3 animate-pulse rounded-lg bg-line/70" />
                <div className="h-40 animate-pulse rounded-2xl bg-line/40" />
                <div className="h-24 animate-pulse rounded-xl bg-line/30" />
              </div>
            ) : tab === "answer" ? (
              <AnswerPanel answer={{ ...DEMO_ANSWER, question: filters.query }} citations={DEMO_CITATIONS} papers={DEMO_PAPERS} onOpenPaper={openPaperById} onOpenCitation={openCitation} />
            ) : tab === "papers" ? (
              <section className="mx-auto max-w-[1000px]">
                <h1 className="text-2xl font-semibold">Статьи</h1>
                <p className="mt-2 text-sm text-muted">{papers.length} статей · ранжирование демо</p>
                <div className="mt-5 space-y-3">
                  {papers.map((paper) => <PaperCard key={paper.id} paper={paper} selected={selected?.id === paper.id} onOpen={openPaper} />)}
                  {papers.length === 0 && <p className="rounded-xl border border-dashed border-line bg-card px-4 py-8 text-sm text-muted">В демо-данных нет статей под эти фильтры. Расширьте период или категории.</p>}
                </div>
              </section>
            ) : (
              <ComparisonTable rows={DEMO_COMPARE} papers={DEMO_PAPERS} onOpenPaper={openPaperById} onOpenCitation={openCitation} />
            )}
          </div>
        </main>

        </ResizableWorkspace>
      </div>
    </div>
  );
}
