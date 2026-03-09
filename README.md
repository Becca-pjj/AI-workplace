# AI Research Workspace Reader

A lightweight browser-based app for the workflow:

- Multi-workspace document collection
- Read and annotate in the center pane
- Maintain a cross-document Outline panel on the right
- Generate a bilingual (中文 / English) outline draft from all notes and highlights
- Keep editing generated draft inside the app
- Switch between Night (deep blue), Day (white), and Eye Care (beige) modes

## Run

No build step required.

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Core features

1. **Workspace + document library (left panel)**
   - Create project-level workspaces
   - Add multiple pasted documents into current workspace

2. **Reader (center panel)**
   - Open a document and read in editable view
   - Highlight selected text
   - Add selection directly to cross-document notes
   - Add quick notes

3. **Theme modes**
   - Night mode (deep blue)
   - Day mode (white)
   - Eye Care mode (beige)

4. **Outline / AI workspace (right panel)**
   - Aggregated highlights across all documents in active workspace
   - Cross-document notes list
   - One-click draft generation in Chinese or English
   - Generated draft remains editable for post-expansion

## Data persistence

All data is persisted in browser `localStorage` key `ai_reader_workspace_v1`.
