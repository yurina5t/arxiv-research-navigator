"""Сбор данных для чекпоинта 1. Этапы идемпотентны: повторный запуск докачивает недостающее.

    python scripts/collect.py meta       # arXiv API -> data/processed/papers.parquet
    python scripts/collect.py s2         # + цитируемость/TLDR из Semantic Scholar
    python scripts/collect.py fulltext   # HTML/PDF в кэш data/raw (+ лицензии), затем chunks
    python scripts/collect.py chunks     # пересобрать data/processed/chunks.jsonl из кэша, без сети
    python scripts/collect.py evalsets   # QASPER + ArxivDIGESTables -> data/eval/
    python scripts/collect.py stats      # сводка -> data/STATS.md
    python scripts/collect.py all
"""
from __future__ import annotations

import gzip
import json
import random
import sys
from pathlib import Path

import pandas as pd
import yaml
from tqdm import tqdm

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from navigator.collect import arxiv_api, eval_sets, fulltext, semantic_scholar  # noqa: E402

CFG = yaml.safe_load((ROOT / "config/corpus.yaml").read_text())
RAW, PROC, EVAL = ROOT / "data/raw", ROOT / "data/processed", ROOT / "data/eval"
PAPERS = PROC / "papers.parquet"
CHUNKS = PROC / "chunks.jsonl"
FT_LOG = PROC / "fulltext_log.jsonl"


def stage_meta() -> None:
    (RAW / "arxiv_api").mkdir(parents=True, exist_ok=True)
    rows: dict[str, dict] = {}
    for q in CFG["queries"]:
        full_q = arxiv_api.build_query(q, CFG["categories"], CFG["period"]["from"], CFG["period"]["to"])
        res = arxiv_api.search(full_q, CFG["max_per_query"])
        print(f"{len(res):5d}  {q}")
        for r in res:
            rows.setdefault(r["arxiv_id"], {**r, "matched_queries": []})["matched_queries"].append(q)
    PROC.mkdir(parents=True, exist_ok=True)
    df = pd.DataFrame(rows.values())
    df.to_parquet(PAPERS, index=False)
    with gzip.open(RAW / "arxiv_api/papers.jsonl.gz", "wt") as f:
        for r in rows.values():
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"unique papers: {len(df)}")


def stage_s2() -> None:
    df = pd.read_parquet(PAPERS)
    enr = semantic_scholar.enrich(df["arxiv_id"].tolist())
    s2 = pd.DataFrame.from_dict(enr, orient="index").rename_axis("arxiv_id").reset_index()
    df = df.drop(columns=[c for c in s2.columns if c != "arxiv_id" and c in df.columns])
    df = df.merge(s2, on="arxiv_id", how="left")
    df.to_parquet(PAPERS, index=False)
    print(f"S2 matched: {df['s2_paper_id'].notna().sum()} / {len(df)}")


def _select_for_fulltext(df: pd.DataFrame) -> list[str]:
    ft = CFG["fulltext"]
    cites = df.get("citation_count", pd.Series(0, index=df.index)).fillna(0)
    top = df.assign(c=cites).sort_values("c", ascending=False, kind="stable")["arxiv_id"].head(ft["top_by_citations"]).tolist()
    rest = [a for a in df["arxiv_id"] if a not in set(top)]
    random.Random(ft["random_seed"]).shuffle(rest)
    return top + rest[: ft["n_papers"] - len(top)]


def _raw_path(aid: str, fmt: str) -> Path:
    safe = aid.replace("/", "_")
    return RAW / fmt / (f"{safe}.html.gz" if fmt == "html" else f"{safe}.pdf")


def stage_fulltext() -> None:
    """Скачивает HTML/PDF в кэш data/raw и лицензии; чанки затем строит stage_chunks."""
    df = pd.read_parquet(PAPERS)
    ids = _select_for_fulltext(df)
    # журнал лежит в репозитории, а сами файлы нет: «готово» = есть запись в журнале И файл на диске
    # (статья без текста, format == "none", скачивать повторно нет смысла)
    log: dict[str, dict] = {}
    if FT_LOG.exists():
        log = {r["arxiv_id"]: r for r in map(json.loads, FT_LOG.open())}
    # журнал = зафиксированный корпус: всё, что в нём есть, докачиваем, даже если статья
    # не попала в текущий отбор (иначе у участников получаются разные корпуса)
    ids = list(dict.fromkeys([*ids, *log]))
    pending = [a for a in ids
               if a not in log or (log[a]["format"] != "none" and not _raw_path(a, log[a]["format"]).exists())]
    (RAW / "html").mkdir(parents=True, exist_ok=True)
    (RAW / "pdf").mkdir(parents=True, exist_ok=True)
    for aid in tqdm(pending, desc="fulltext"):
        fmt, content = fulltext.fetch(aid)
        if fmt == "html":
            _raw_path(aid, fmt).write_bytes(gzip.compress(content.encode()))
        elif fmt == "pdf":
            _raw_path(aid, fmt).write_bytes(content)
        lic = log.get(aid, {}).get("license") or arxiv_api.fetch_license(aid)
        log[aid] = {"arxiv_id": aid, "format": fmt, "license": lic,
                    "open_license": arxiv_api.is_open_license(lic)}
        with FT_LOG.open("w") as fl:  # переписываем целиком: безопасно прерывать и запускать снова
            fl.writelines(json.dumps(r, ensure_ascii=False) + "\n" for r in log.values())
    stage_chunks()


def stage_chunks() -> None:
    """Пересобирает chunks.jsonl из кэша data/raw (без сети) — после правок парсера."""
    abstracts = pd.read_parquet(PAPERS).set_index("arxiv_id")["abstract"]
    log = pd.read_json(FT_LOG, lines=True, dtype={"arxiv_id": str})
    n_chunks = []
    with CHUNKS.open("w") as fc:
        for aid, fmt in tqdm(zip(log.arxiv_id, log.format), total=len(log), desc="chunks"):
            if fmt != "none" and not _raw_path(aid, fmt).exists():
                n_chunks.append(None)  # файл не скачан (например, запускали fulltext на части статей)
                continue
            if fmt == "html":
                html = gzip.decompress(_raw_path(aid, fmt).read_bytes()).decode()
                chunks = fulltext.parse_html(aid, html, abstract_fallback=abstracts.get(aid))
            elif fmt == "pdf":
                chunks = fulltext.parse_pdf(aid, _raw_path(aid, fmt).read_bytes())
            else:
                chunks = []
            for c in chunks:
                fc.write(json.dumps(c, ensure_ascii=False) + "\n")
            n_chunks.append(len(chunks))
    log.assign(n_chunks=n_chunks).to_json(FT_LOG, orient="records", lines=True, force_ascii=False)


def stage_evalsets() -> None:
    for p in eval_sets.download(EVAL):
        print(f"{p.relative_to(ROOT)}  {p.stat().st_size / 1e6:.1f} MB")


def stage_stats() -> None:
    df = pd.read_parquet(PAPERS)
    log = pd.read_json(FT_LOG, lines=True, dtype={"arxiv_id": str}) if FT_LOG.exists() else pd.DataFrame()
    ch = pd.read_json(CHUNKS, lines=True, dtype={"arxiv_id": str}) if CHUNKS.exists() else pd.DataFrame()
    month = pd.to_datetime(df["published"]).dt.to_period("M").value_counts().sort_index()
    def size(p: Path) -> str:
        b = sum(f.stat().st_size for f in p.rglob("*") if f.is_file()) if p.exists() else 0
        return f"{b / 1e6:.1f} MB"
    lines = [
        "# Статистика собранных данных", "",
        f"Тема dev-корпуса: **{CFG['topic']}**, период {CFG['period']['from']} — {CFG['period']['to']}, "
        f"категории {', '.join(CFG['categories'])}.", "",
        "## Метаданные (arXiv API + Semantic Scholar)", "",
        f"- Уникальных статей: **{len(df)}**",
        f"- Найдено в Semantic Scholar: {df['s2_paper_id'].notna().sum() if 's2_paper_id' in df else 0}",
        f"- С TLDR: {df['tldr'].notna().sum() if 'tldr' in df else 0}",
        f"- Медиана цитирований: {df['citation_count'].median() if 'citation_count' in df else '—'}",
        f"- Основные категории: " + ", ".join(f"{k} ({v})" for k, v in df["primary_category"].value_counts().head(6).items()),
        "", "По месяцам публикации:", "", "| месяц | статей |", "|---|---|",
        *[f"| {m} | {n} |" for m, n in month.items()], "",
        "Запросы и число статей:", "", "| запрос | статей |", "|---|---|",
        *[f"| `{q}` | {(df['matched_queries'].apply(lambda x: q in list(x))).sum()} |" for q in CFG["queries"]], "",
    ]
    if len(log):
        lines += [
            "## Полные тексты", "",
            f"- Обработано статей: **{len(log)}** (HTML: {(log.format == 'html').sum()}, "
            f"PDF-fallback: {(log.format == 'pdf').sum()}, недоступно: {(log.format == 'none').sum()})",
            f"- С открытой CC-лицензией: {log.open_license.sum()} ({log.open_license.mean():.0%})",
            f"- Чанков всего: **{len(ch)}** — " + ", ".join(f"{k}: {v}" for k, v in ch["type"].value_counts().items()),
            f"- Медиана чанков на статью: {log.n_chunks.median():.0f}; "
            f"медиана длины абзаца: {ch.loc[ch.type == 'paragraph', 'text'].str.len().median():.0f} символов",
            "", "Лицензии:", "", "| лицензия | статей |", "|---|---|",
            *[f"| {k or 'нет данных'} | {v} |" for k, v in log["license"].fillna("").value_counts().items()], "",
        ]
    lines += ["## Объём на диске", "",
              f"- data/raw: {size(RAW)}", f"- data/processed: {size(PROC)}", f"- data/eval: {size(EVAL)}"]
    (ROOT / "data/STATS.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


STAGES = {"meta": stage_meta, "s2": stage_s2, "fulltext": stage_fulltext, "chunks": stage_chunks,
          "evalsets": stage_evalsets, "stats": stage_stats}

if __name__ == "__main__":
    arg = sys.argv[1] if len(sys.argv) > 1 else "all"
    for name in ([s for s in STAGES if s != "chunks"] if arg == "all" else [arg]):
        print(f"== {name}")
        STAGES[name]()
