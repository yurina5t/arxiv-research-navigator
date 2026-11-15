import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Maximize2, Minimize2, PanelRightClose, PanelRightOpen, Undo2 } from "lucide-react";
import { clampSourceWidth, DEFAULT_SOURCE_WIDTH, MIN_SOURCE_WIDTH, parseSourceWidth, RESIZE_HANDLE_WIDTH, SOURCE_WIDTH_KEY, sourceWidthLimit } from "../lib/sourcePanelSizing";

interface ResizableWorkspaceProps {
  sourcesOpen: boolean;
  onToggleSources: () => void;
  sourceContent: ReactNode;
  sourceTitle?: string;
  children: ReactNode;
}

export function ResizableWorkspace({ sourcesOpen, onToggleSources, sourceContent, sourceTitle, children }: ResizableWorkspaceProps) {
  const container = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; startX: number; startWidth: number } | null>(null);
  const [availableWidth, setAvailableWidth] = useState(DEFAULT_SOURCE_WIDTH / 0.65);
  const [desktop, setDesktop] = useState(false);
  const [preferredWidth, setPreferredWidth] = useState(() => {
    try { return parseSourceWidth(window.localStorage.getItem(SOURCE_WIDTH_KEY)); }
    catch { return DEFAULT_SOURCE_WIDTH; }
  });
  const [expanded, setExpanded] = useState(false);
  const [resizing, setResizing] = useState(false);
  const maxWidth = sourceWidthLimit(availableWidth);
  const width = expanded ? maxWidth : clampSourceWidth(preferredWidth, availableWidth);
  const canRestoreSource = !sourcesOpen && Boolean(sourceTitle);
  const toggleLabel = sourcesOpen ? "Свернуть источники" : canRestoreSource ? "Вернуть источник" : "Развернуть источники";

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const media = window.matchMedia("(min-width: 1024px)");
    function measure() {
      if (!element) return;
      setDesktop(media.matches);
      setAvailableWidth(Math.max(0, element.clientWidth - RESIZE_HANDLE_WIDTH));
      if (!media.matches) {
        drag.current = null;
        setResizing(false);
      }
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    media.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", measure);
    };
  }, []);

  useEffect(() => {
    // Persist a completed drag, rather than writing on every pointer move.
    if (resizing) return;
    try { window.localStorage.setItem(SOURCE_WIDTH_KEY, String(preferredWidth)); }
    catch { /* Resizing still works when browser storage is unavailable. */ }
  }, [preferredWidth, resizing]);

  function startResize(event: PointerEvent<HTMLDivElement>) {
    if (!desktop || event.button !== 0 || !event.isPrimary) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startWidth: width };
    setPreferredWidth(width);
    setExpanded(false);
    setResizing(true);
  }

  function resize(event: PointerEvent<HTMLDivElement>) {
    const active = drag.current;
    if (!active || active.pointerId !== event.pointerId) return;
    setPreferredWidth(clampSourceWidth(active.startWidth + active.startX - event.clientX, availableWidth));
  }

  function stopResize(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    setResizing(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function resizeWithKeyboard(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 48 : 16;
    const next = event.key === "ArrowLeft" ? width + step
      : event.key === "ArrowRight" ? width - step
      : event.key === "Home" ? MIN_SOURCE_WIDTH
      : event.key === "End" ? maxWidth : undefined;
    if (next === undefined) return;
    event.preventDefault();
    setExpanded(false);
    setPreferredWidth(clampSourceWidth(next, availableWidth));
  }

  return (
    <div ref={container} className={`workspace-content ${resizing ? "is-resizing" : ""}`}>
      {children}
      {sourcesOpen && desktop && (
        <div
          className="source-resize-handle"
          role="separator"
          tabIndex={0}
          aria-label="Изменить ширину панели источников"
          aria-orientation="vertical"
          aria-controls="workspace-source-panel"
          aria-valuemin={MIN_SOURCE_WIDTH}
          aria-valuemax={maxWidth}
          aria-valuenow={width}
          aria-valuetext={`${Math.round(width)} пикселей`}
          onPointerDown={startResize}
          onPointerMove={resize}
          onPointerUp={stopResize}
          onPointerCancel={stopResize}
          onLostPointerCapture={stopResize}
          onKeyDown={resizeWithKeyboard}
          title="Перетащите для изменения ширины"
        />
      )}
      <aside
        id="workspace-source-panel"
        className={`workspace-source-panel ${sourcesOpen ? "" : "is-collapsed"} ${expanded ? "is-expanded" : ""}`}
        style={{ "--sources-width": `${width}px` } as CSSProperties}
        aria-label="Источники и цитаты"
      >
        <div className="source-panel-heading">
          {sourcesOpen && <h2 className="min-w-0 text-[15px] font-semibold">Источники и цитаты</h2>}
          <div className="flex shrink-0 items-center gap-1">
            {sourcesOpen && (
              <button type="button" onClick={() => setExpanded(!expanded)} className="panel-toggle" aria-label={expanded ? "Вернуть предыдущий размер" : "Развернуть для чтения"} aria-pressed={expanded} aria-controls="workspace-source-panel" title={expanded ? "Вернуть предыдущий размер" : "Развернуть для чтения"}>
                {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            )}
            <button type="button" onClick={onToggleSources} className={`panel-toggle ${canRestoreSource ? "bg-forest/10 text-forest" : ""}`} aria-label={toggleLabel} aria-expanded={sourcesOpen} aria-controls="source-panel-content" title={canRestoreSource ? `Вернуть источник: ${sourceTitle}` : toggleLabel}>
              {sourcesOpen ? <PanelRightClose size={18} /> : canRestoreSource ? <Undo2 size={18} /> : <PanelRightOpen size={18} />}
            </button>
          </div>
        </div>
        <div id="source-panel-content" className="source-panel-content" hidden={!sourcesOpen}>
          {sourceContent}
        </div>
      </aside>
    </div>
  );
}
