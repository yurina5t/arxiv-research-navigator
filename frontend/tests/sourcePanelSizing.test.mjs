import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { transformSync } from "esbuild";

const source = readFileSync(new URL("../src/lib/sourcePanelSizing.ts", import.meta.url), "utf8");
const { code } = transformSync(source, { loader: "ts", format: "esm" });
const { clampSourceWidth, DEFAULT_SOURCE_WIDTH, parseSourceWidth, sourceWidthLimit } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);

test("keeps a chosen reading width and clamps both drag extremes", () => {
  assert.equal(clampSourceWidth(480, 1000), 480);
  assert.equal(clampSourceWidth(-500, 1000), 300);
  assert.equal(clampSourceWidth(5000, 1000), 650);
});

test("calculates 65% from the reading area at desktop breakpoints with either navigation width", () => {
  for (const viewport of [1024, 1280, 1440, 1920]) {
    for (const navigation of [224, 68]) {
      // Include space reserved for a conventional 16px scrollbar and the 8px handle.
      const available = viewport - 16 - navigation - 8;
      const max = sourceWidthLimit(available);
      assert.equal(max, Math.floor(available * 0.65));
      assert(clampSourceWidth(9999, available) <= available * 0.65);
      assert(clampSourceWidth(0, available) >= 300);
      assert(available - max >= 250, `Center remains usable at ${viewport}px`);
    }
  }
});

test("shrinking and enlarging the workspace preserves the preferred width", () => {
  const preferred = 800;
  assert.equal(clampSourceWidth(preferred, 800), 520);
  assert.equal(clampSourceWidth(preferred, 1600), preferred);
});

test("fractional container widths never round beyond the 65% maximum", () => {
  const available = 1001.5;
  const max = sourceWidthLimit(available);
  assert(max <= available * 0.65);
  assert.equal(clampSourceWidth(10000, available), max);
  assert.equal(clampSourceWidth(544.5, available), 544.5);
});

test("restores a saved width and handles corrupt or missing storage", () => {
  assert.equal(parseSourceWidth("544.5"), 544.5);
  for (const value of [null, "", "  ", "null", "{}", "NaN", "Infinity", "-1", "299", "1e309"]) {
    assert.equal(parseSourceWidth(value), DEFAULT_SOURCE_WIDTH, `Invalid value ${value}`);
  }
});

test("non-finite drag sizes cannot produce invalid CSS", () => {
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.equal(clampSourceWidth(value, 1200), DEFAULT_SOURCE_WIDTH);
  }
  assert.equal(sourceWidthLimit(0), 300);
});
