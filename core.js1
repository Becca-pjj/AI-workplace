export const SUPPORTED_THEMES = ["night", "day", "eye"];

export function normalizeTheme(theme) {
  return SUPPORTED_THEMES.includes(theme) ? theme : "night";
}

export function buildDraft(lang, highlights = [], notes = []) {
  const source = [...highlights, ...notes].filter(Boolean);
  if (!source.length) {
    return lang === "zh" ? "请先添加高亮或笔记。" : "Please add highlights or notes first.";
  }

  const top = source.slice(0, 8).map((s, i) => `${i + 1}. ${s}`).join("\n");

  if (lang === "zh") {
    return [
      "标题（草案）: 基于阅读笔记的研究输出",
      "",
      "一、背景与问题定义",
      "- 结合材料解释研究背景与目标。",
      "",
      "二、核心发现（跨文档）",
      top,
      "",
      "三、主题归纳",
      "- Theme A: ...",
      "- Theme B: ...",
      "",
      "四、建议/行动方案",
      "- 短期：...",
      "- 中期：...",
      "- 长期：...",
      "",
      "五、下一步待验证问题",
      "- ...",
    ].join("\n");
  }

  return [
    "Working Title: Research Brief from Reading Workspace",
    "",
    "I. Context and Problem Definition",
    "- Frame the background and objective from source notes.",
    "",
    "II. Core Findings Across Documents",
    top,
    "",
    "III. Thematic Synthesis",
    "- Theme A: ...",
    "- Theme B: ...",
    "",
    "IV. Recommendations / Proposal",
    "- Short-term: ...",
    "- Mid-term: ...",
    "- Long-term: ...",
    "",
    "V. Open Questions",
    "- ...",
  ].join("\n");
}

export function computePanelWidths({
  containerWidth,
  weights,
  collapsed,
  minPanelWidth,
  collapsedWidth,
  splitterWidth,
}) {
  const keys = ["left", "center", "right"];
  const normalizedCollapsed = { ...collapsed };
  const expanded = keys.filter((k) => !normalizedCollapsed[k]);
  if (!expanded.length) {
    normalizedCollapsed.center = false;
  }

  const expandedKeys = keys.filter((k) => !normalizedCollapsed[k]);
  const collapsedCount = keys.length - expandedKeys.length;
  const availableForExpanded = containerWidth - collapsedCount * collapsedWidth - splitterWidth * 2;

  const widthByPanel = {
    left: collapsedWidth,
    center: collapsedWidth,
    right: collapsedWidth,
  };

  const totalWeight = expandedKeys.reduce((sum, key) => sum + (weights[key] || 1), 0) || 1;
  expandedKeys.forEach((key) => {
    widthByPanel[key] = Math.max(minPanelWidth, (availableForExpanded * (weights[key] || 1)) / totalWeight);
  });

  const totalExpanded = expandedKeys.reduce((sum, key) => sum + widthByPanel[key], 0);
  const overflow = totalExpanded - availableForExpanded;
  if (overflow > 0) {
    const adjustables = expandedKeys.filter((k) => widthByPanel[k] > minPanelWidth + 1);
    const deduction = adjustables.length ? overflow / adjustables.length : 0;
    adjustables.forEach((k) => {
      widthByPanel[k] = Math.max(minPanelWidth, widthByPanel[k] - deduction);
    });
  }

  return {
    widthByPanel,
    collapsed: normalizedCollapsed,
  };
}
