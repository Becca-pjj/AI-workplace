import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDraft, computePanelWidths, normalizeTheme } from './core.js';

test('normalizeTheme falls back to night', () => {
  assert.equal(normalizeTheme('day'), 'day');
  assert.equal(normalizeTheme('unknown'), 'night');
});

test('buildDraft returns bilingual empty-state hints', () => {
  assert.equal(buildDraft('zh', [], []), '请先添加高亮或笔记。');
  assert.equal(buildDraft('en', [], []), 'Please add highlights or notes first.');
});

test('buildDraft includes top highlights and notes', () => {
  const out = buildDraft('en', ['[Doc] A', '[Doc] B'], ['note 1']);
  assert.match(out, /II\. Core Findings Across Documents/);
  assert.match(out, /1\. \[Doc\] A/);
  assert.match(out, /3\. note 1/);
});

test('computePanelWidths keeps at least one panel expanded', () => {
  const result = computePanelWidths({
    containerWidth: 1600,
    weights: { left: 1, center: 1.2, right: 1 },
    collapsed: { left: true, center: true, right: true },
    minPanelWidth: 260,
    collapsedWidth: 52,
    splitterWidth: 8,
  });

  assert.equal(result.collapsed.center, false);
  assert.ok(result.widthByPanel.center >= 260);
});
