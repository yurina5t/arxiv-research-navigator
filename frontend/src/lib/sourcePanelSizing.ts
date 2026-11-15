export const MIN_SOURCE_WIDTH = 300;
export const DEFAULT_SOURCE_WIDTH = 380;
export const SOURCE_WIDTH_KEY = "navigators.sources.width";
export const RESIZE_HANDLE_WIDTH = 8;

// The navigation and resize handle are outside the available reading area.
export function sourceWidthLimit(availableWidth: number): number {
  return Math.max(MIN_SOURCE_WIDTH, Math.floor(availableWidth * 0.65));
}

export function clampSourceWidth(width: number, availableWidth: number): number {
  const value = Number.isFinite(width) ? width : DEFAULT_SOURCE_WIDTH;
  return Math.min(sourceWidthLimit(availableWidth), Math.max(MIN_SOURCE_WIDTH, value));
}

export function parseSourceWidth(saved: string | null): number {
  if (!saved?.trim()) return DEFAULT_SOURCE_WIDTH;
  const width = Number(saved);
  return Number.isFinite(width) && width >= MIN_SOURCE_WIDTH ? width : DEFAULT_SOURCE_WIDTH;
}
