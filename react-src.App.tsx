import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { useLayout } from './hooks/useLayout';
import { useTheme } from './hooks/useTheme';
import { useWorkspaceState } from './hooks/useWorkspaceState';

export default function App() {
  const { theme, setTheme } = useTheme();
  const { layout, toggle } = useLayout();
  const {
    state,
    activeWorkspace,
    activeDoc,
    createWorkspace,
    addDocument,
    selectWorkspace,
    selectDoc,
    addQuickNote,
    saveDocHtml,
    addHighlightAndMaybeNote,
    generateDraft,
    updateDraft,
  } = useWorkspaceState();

  const highlights = (activeWorkspace?.docs || []).flatMap((d) => d.highlights.map((h) => `[${d.title}] ${h.text}`));

  return (
    <>
      <header className="app-header">
        <h1>AI Research Workspace (React + TS)</h1>
        <select id="themeMode" value={theme} onChange={(e) => setTheme(e.target.value as any)}>
          <option value="night">Night</option>
          <option value="day">Day</option>
          <option value="eye">Eye Care</option>
        </select>
      </header>
      <main className="layout" style={{ gridTemplateColumns: `${Math.round(layout.widths.left)}px 8px ${Math.round(layout.widths.center)}px 8px ${Math.round(layout.widths.right)}px` }}>
        <div data-collapsed={layout.collapsed.left}><button id="toggleLeft" onClick={() => toggle('left')}>Toggle</button><LeftPanel workspaces={state.workspaces} activeWorkspaceId={state.activeWorkspaceId} activeDocId={state.activeDocId} onSelectWorkspace={selectWorkspace} onSelectDoc={selectDoc} onCreateWorkspace={createWorkspace} onAddDoc={addDocument} /></div>
        <div className="splitter" />
        <div data-collapsed={layout.collapsed.center}><button id="toggleCenter" onClick={() => toggle('center')}>Toggle</button><CenterPanel docTitle={activeDoc?.title || ''} html={activeDoc?.contentHtml || ''} onSaveHtml={saveDocHtml} onHighlight={addHighlightAndMaybeNote} /></div>
        <div className="splitter" />
        <div data-collapsed={layout.collapsed.right}><button id="toggleRight" onClick={() => toggle('right')}>Toggle</button><RightPanel highlights={highlights} notes={activeWorkspace?.crossNotes || []} draft={activeWorkspace?.generatedDraft || ''} onGenerate={generateDraft} onUpdateDraft={updateDraft} onAddQuickNote={addQuickNote} /></div>
      </main>
    </>
  );
}
