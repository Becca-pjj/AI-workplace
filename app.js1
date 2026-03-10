import { buildDraft, computePanelWidths, normalizeTheme } from "./core.js";

const STORAGE_KEY = "ai_reader_workspace_v1";
const THEME_KEY = "ai_reader_theme_v1";
const LAYOUT_KEY = "ai_reader_layout_v1";

const MIN_PANEL_WIDTH = 260;
const COLLAPSED_WIDTH = 52;
const SPLITTER_WIDTH = 8;

const state = {
  workspaces: [],
  activeWorkspaceId: null,
  activeDocId: null,
};

const layoutState = {
  weights: { left: 1, center: 1.2, right: 1 },
  collapsed: { left: false, center: false, right: false },
};

const panelOrder = ["left", "center", "right"];

const el = {
  appLayout: document.querySelector("#appLayout"),
  workspaceName: document.querySelector("#workspaceName"),
  createWorkspaceBtn: document.querySelector("#createWorkspaceBtn"),
  workspaceList: document.querySelector("#workspaceList"),
  docTitle: document.querySelector("#docTitle"),
  docContent: document.querySelector("#docContent"),
  addDocBtn: document.querySelector("#addDocBtn"),
  reader: document.querySelector("#reader"),
  activeDocLabel: document.querySelector("#activeDocLabel"),
  highlightSelectionBtn: document.querySelector("#highlightSelectionBtn"),
  addSelectionNoteBtn: document.querySelector("#addSelectionNoteBtn"),
  quickNote: document.querySelector("#quickNote"),
  saveQuickNoteBtn: document.querySelector("#saveQuickNoteBtn"),
  highlightsList: document.querySelector("#highlightsList"),
  notesList: document.querySelector("#notesList"),
  generationLang: document.querySelector("#generationLang"),
  generateDraftBtn: document.querySelector("#generateDraftBtn"),
  generatedDraft: document.querySelector("#generatedDraft"),
  themeMode: document.querySelector("#themeMode"),
  toggleLeftPanelBtn: document.querySelector("#toggleLeftPanelBtn"),
  toggleCenterPanelBtn: document.querySelector("#toggleCenterPanelBtn"),
  toggleRightPanelBtn: document.querySelector("#toggleRightPanelBtn"),
  splitters: Array.from(document.querySelectorAll(".splitter")),
  panels: {
    left: document.querySelector('[data-panel="left"]'),
    center: document.querySelector('[data-panel="center"]'),
    right: document.querySelector('[data-panel="right"]'),
  },
};

function applyTheme(theme) {
  const normalized = normalizeTheme(theme);
  if (normalized === "night") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = normalized;
  }
  el.themeMode.value = normalized;
  localStorage.setItem(THEME_KEY, normalized);
}

function initializeTheme() {
  applyTheme(localStorage.getItem(THEME_KEY) || "night");
}

function saveLayoutState() {
  localStorage.setItem(LAYOUT_KEY, JSON.stringify(layoutState));
}

function loadLayoutState() {
  const raw = localStorage.getItem(LAYOUT_KEY);
  if (!raw) return;
  const parsed = JSON.parse(raw);
  if (parsed.weights) {
    layoutState.weights.left = Math.max(0.2, Number(parsed.weights.left) || 1);
    layoutState.weights.center = Math.max(0.2, Number(parsed.weights.center) || 1.2);
    layoutState.weights.right = Math.max(0.2, Number(parsed.weights.right) || 1);
  }
  if (parsed.collapsed) {
    layoutState.collapsed.left = Boolean(parsed.collapsed.left);
    layoutState.collapsed.center = Boolean(parsed.collapsed.center);
    layoutState.collapsed.right = Boolean(parsed.collapsed.right);
  }
}

function updateToggleButtonLabels() {
  el.toggleLeftPanelBtn.textContent = layoutState.collapsed.left ? "⇥" : "⇤";
  el.toggleCenterPanelBtn.textContent = layoutState.collapsed.center ? "⤢" : "⇵";
  el.toggleRightPanelBtn.textContent = layoutState.collapsed.right ? "⇤" : "⇥";
}

function applyPanelLayout() {
  const containerWidth = el.appLayout.clientWidth || window.innerWidth;
  const { widthByPanel, collapsed } = computePanelWidths({
    containerWidth,
    weights: layoutState.weights,
    collapsed: layoutState.collapsed,
    minPanelWidth: MIN_PANEL_WIDTH,
    collapsedWidth: COLLAPSED_WIDTH,
    splitterWidth: SPLITTER_WIDTH,
  });

  layoutState.collapsed = collapsed;

  el.appLayout.style.gridTemplateColumns = `${Math.round(widthByPanel.left)}px ${SPLITTER_WIDTH}px ${Math.round(
    widthByPanel.center
  )}px ${SPLITTER_WIDTH}px ${Math.round(widthByPanel.right)}px`;

  panelOrder.forEach((key) => {
    el.panels[key].dataset.collapsed = layoutState.collapsed[key] ? "true" : "false";
  });

  updateToggleButtonLabels();
}


function setCollapsed(panelKey, nextCollapsed) {
  const currentlyExpanded = panelOrder.filter((p) => !layoutState.collapsed[p]).length;
  if (nextCollapsed && currentlyExpanded === 1 && !layoutState.collapsed[panelKey]) {
    return;
  }

  layoutState.collapsed[panelKey] = nextCollapsed;
  saveLayoutState();
  applyPanelLayout();
}

function attachSplitters() {
  el.splitters.forEach((splitter) => {
    splitter.addEventListener("pointerdown", (event) => {
      const leftKey = splitter.dataset.left;
      const rightKey = splitter.dataset.right;
      if (layoutState.collapsed[leftKey] || layoutState.collapsed[rightKey]) return;

      splitter.setPointerCapture(event.pointerId);
      const startX = event.clientX;
      const startLeft = el.panels[leftKey].getBoundingClientRect().width;
      const startRight = el.panels[rightKey].getBoundingClientRect().width;

      const onMove = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        let nextLeft = startLeft + dx;
        let nextRight = startRight - dx;

        if (nextLeft < MIN_PANEL_WIDTH) {
          nextRight -= MIN_PANEL_WIDTH - nextLeft;
          nextLeft = MIN_PANEL_WIDTH;
        }
        if (nextRight < MIN_PANEL_WIDTH) {
          nextLeft -= MIN_PANEL_WIDTH - nextRight;
          nextRight = MIN_PANEL_WIDTH;
        }
        if (nextLeft < MIN_PANEL_WIDTH || nextRight < MIN_PANEL_WIDTH) return;

        layoutState.weights[leftKey] = nextLeft;
        layoutState.weights[rightKey] = nextRight;
        applyPanelLayout();
      };

      const onUp = () => {
        splitter.removeEventListener("pointermove", onMove);
        splitter.removeEventListener("pointerup", onUp);
        saveLayoutState();
      };

      splitter.addEventListener("pointermove", onMove);
      splitter.addEventListener("pointerup", onUp);
    });
  });
}

function uid(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const parsed = JSON.parse(raw);
  state.workspaces = parsed.workspaces || [];
  state.activeWorkspaceId = parsed.activeWorkspaceId || null;
  state.activeDocId = parsed.activeDocId || null;
}

function getActiveWorkspace() {
  return state.workspaces.find((w) => w.id === state.activeWorkspaceId) || null;
}

function getActiveDoc() {
  const ws = getActiveWorkspace();
  if (!ws) return null;
  return ws.docs.find((d) => d.id === state.activeDocId) || null;
}

function ensureDefaultWorkspace() {
  if (state.workspaces.length) return;
  const workspace = {
    id: uid("ws"),
    name: "Default Workspace",
    docs: [],
    crossNotes: [],
    generatedDraft: "",
  };
  state.workspaces.push(workspace);
  state.activeWorkspaceId = workspace.id;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderWorkspaceList() {
  el.workspaceList.innerHTML = "";
  const tpl = document.querySelector("#workspaceItemTpl");
  const docTpl = document.querySelector("#docItemTpl");

  state.workspaces.forEach((ws) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const nameBtn = node.querySelector(".workspace-name-btn");
    const delWsBtn = node.querySelector(".delete-workspace-btn");
    const docList = node.querySelector(".doc-list");

    nameBtn.textContent = ws.name;
    if (ws.id === state.activeWorkspaceId) {
      nameBtn.style.borderColor = "#5ea1ff";
    }
    nameBtn.onclick = () => {
      state.activeWorkspaceId = ws.id;
      state.activeDocId = ws.docs[0]?.id || null;
      saveState();
      renderAll();
    };

    delWsBtn.onclick = () => {
      if (!confirm(`Delete workspace \"${ws.name}\"?`)) return;
      state.workspaces = state.workspaces.filter((x) => x.id !== ws.id);
      if (!state.workspaces.length) {
        ensureDefaultWorkspace();
      }
      if (state.activeWorkspaceId === ws.id) {
        state.activeWorkspaceId = state.workspaces[0]?.id || null;
        state.activeDocId = getActiveWorkspace()?.docs[0]?.id || null;
      }
      saveState();
      renderAll();
    };

    ws.docs.forEach((doc) => {
      const docNode = docTpl.content.firstElementChild.cloneNode(true);
      docNode.querySelector(".doc-open-btn").textContent = doc.title;
      docNode.querySelector(".doc-open-btn").onclick = () => {
        state.activeWorkspaceId = ws.id;
        state.activeDocId = doc.id;
        saveState();
        renderAll();
      };
      docNode.querySelector(".delete-doc-btn").onclick = () => {
        ws.docs = ws.docs.filter((d) => d.id !== doc.id);
        if (state.activeDocId === doc.id) {
          state.activeDocId = ws.docs[0]?.id || null;
        }
        saveState();
        renderAll();
      };
      docList.appendChild(docNode);
    });

    el.workspaceList.appendChild(node);
  });
}

function renderReader() {
  const doc = getActiveDoc();
  if (!doc) {
    el.activeDocLabel.textContent = "No document selected";
    el.reader.innerHTML = "Select or add a document to start reading.";
    return;
  }

  el.activeDocLabel.textContent = `${doc.title} · editable reading view`;
  el.reader.innerHTML = doc.contentHtml || escapeHtml(doc.content || "");
}

function renderOutlinePanel() {
  const ws = getActiveWorkspace();
  el.highlightsList.innerHTML = "";
  el.notesList.innerHTML = "";

  if (!ws) return;

  const allHighlights = ws.docs.flatMap((doc) =>
    (doc.highlights || []).map((h) => ({ ...h, docTitle: doc.title }))
  );

  allHighlights.forEach((h) => {
    const li = document.createElement("li");
    li.textContent = `[${h.docTitle}] ${h.text}`;
    el.highlightsList.appendChild(li);
  });

  (ws.crossNotes || []).forEach((n) => {
    const li = document.createElement("li");
    li.textContent = n;
    el.notesList.appendChild(li);
  });

  el.generatedDraft.value = ws.generatedDraft || "";
}

function renderAll() {
  renderWorkspaceList();
  renderReader();
  renderOutlinePanel();
}

function addWorkspace() {
  const name = el.workspaceName.value.trim();
  if (!name) return;
  const ws = { id: uid("ws"), name, docs: [], crossNotes: [], generatedDraft: "" };
  state.workspaces.push(ws);
  state.activeWorkspaceId = ws.id;
  state.activeDocId = null;
  el.workspaceName.value = "";
  saveState();
  renderAll();
}

function addDocument() {
  const ws = getActiveWorkspace();
  if (!ws) return;
  const title = el.docTitle.value.trim();
  const content = el.docContent.value.trim();
  if (!title || !content) return;

  const doc = { id: uid("doc"), title, content, contentHtml: escapeHtml(content), highlights: [] };
  ws.docs.push(doc);
  state.activeDocId = doc.id;
  el.docTitle.value = "";
  el.docContent.value = "";
  saveState();
  renderAll();
}

function syncReaderIntoDoc() {
  const doc = getActiveDoc();
  if (!doc) return;
  doc.contentHtml = el.reader.innerHTML;
  saveState();
}

function getSelectedText() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return "";
  return selection.toString().trim();
}

function highlightSelection() {
  const doc = getActiveDoc();
  if (!doc) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
  const range = selection.getRangeAt(0);

  if (!el.reader.contains(range.commonAncestorContainer)) return;

  const span = document.createElement("span");
  span.className = "highlight";
  try {
    range.surroundContents(span);
  } catch {
    const text = range.extractContents();
    span.appendChild(text);
    range.insertNode(span);
  }

  const selected = span.textContent.trim();
  if (selected) {
    doc.highlights = doc.highlights || [];
    doc.highlights.push({ text: selected, at: new Date().toISOString() });
  }

  selection.removeAllRanges();
  syncReaderIntoDoc();
  renderOutlinePanel();
}

function addSelectionNote() {
  const ws = getActiveWorkspace();
  if (!ws) return;
  const selected = getSelectedText();
  if (!selected) return;
  ws.crossNotes = ws.crossNotes || [];
  ws.crossNotes.push(selected);
  saveState();
  renderOutlinePanel();
}

function addQuickNote() {
  const ws = getActiveWorkspace();
  if (!ws) return;
  const note = el.quickNote.value.trim();
  if (!note) return;
  ws.crossNotes = ws.crossNotes || [];
  ws.crossNotes.push(note);
  el.quickNote.value = "";
  saveState();
  renderOutlinePanel();
}

function generateDraft() {
  const ws = getActiveWorkspace();
  if (!ws) return;

  const lang = el.generationLang.value;
  const highlights = ws.docs.flatMap((doc) =>
    (doc.highlights || []).map((h) => `[${doc.title}] ${h.text}`)
  );
  const notes = ws.crossNotes || [];

  ws.generatedDraft = buildDraft(lang, highlights, notes);
  saveState();
  renderOutlinePanel();
}


function attachEvents() {
  el.createWorkspaceBtn.addEventListener("click", addWorkspace);
  el.addDocBtn.addEventListener("click", addDocument);
  el.highlightSelectionBtn.addEventListener("click", highlightSelection);
  el.addSelectionNoteBtn.addEventListener("click", addSelectionNote);
  el.saveQuickNoteBtn.addEventListener("click", addQuickNote);
  el.generateDraftBtn.addEventListener("click", generateDraft);

  el.reader.addEventListener("input", syncReaderIntoDoc);
  el.themeMode.addEventListener("change", () => applyTheme(el.themeMode.value));
  el.generatedDraft.addEventListener("input", () => {
    const ws = getActiveWorkspace();
    if (!ws) return;
    ws.generatedDraft = el.generatedDraft.value;
    saveState();
  });

  el.toggleLeftPanelBtn.addEventListener("click", () => setCollapsed("left", !layoutState.collapsed.left));
  el.toggleCenterPanelBtn.addEventListener("click", () => setCollapsed("center", !layoutState.collapsed.center));
  el.toggleRightPanelBtn.addEventListener("click", () => setCollapsed("right", !layoutState.collapsed.right));

  attachSplitters();
  window.addEventListener("resize", applyPanelLayout);
}

function init() {
  loadState();
  loadLayoutState();
  initializeTheme();
  ensureDefaultWorkspace();
  if (!state.activeWorkspaceId) {
    state.activeWorkspaceId = state.workspaces[0].id;
  }

  attachEvents();
  saveState();
  applyPanelLayout();
  renderAll();
}

init();
