# AI Research Workspace Reader

A lightweight browser-based app for the workflow:

- Multi-workspace document collection
- Read and annotate in the center pane
- Maintain a cross-document Outline panel on the right
- Generate a bilingual (中文 / English) outline draft from all notes and highlights
- Keep editing generated draft inside the app
- Switch between Night (deep blue), Day (white), and Eye Care (beige) modes
- Resize the three panels by dragging splitters, and collapse/expand each panel

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

4. **Adjustable layout**
   - Drag vertical splitters to resize left/center/right panels
   - Collapse and restore each panel from its header button

5. **Outline / AI workspace (right panel)**
   - Aggregated highlights across all documents in active workspace
   - Cross-document notes list
   - One-click draft generation in Chinese or English
   - Generated draft remains editable for post-expansion

## Data persistence

All data is persisted in browser `localStorage` keys:
- `ai_reader_workspace_v1` for workspace and document data
- `ai_reader_theme_v1` for theme mode
- `ai_reader_layout_v1` for panel widths and collapsed states


## Testing

```bash
npm test
```

(Uses Node built-in test runner to validate theme normalization, draft generation, and layout-width computation.)


## React + TypeScript Next Step (new)

A new React/Vite/TypeScript implementation now lives in `react-app/`.

### Run React app

```bash
cd react-app
npm install
npm run dev
```

Open `http://localhost:5173`.

### Tests (React app)

```bash
cd react-app
npm test
npm run build
npm run e2e
```

> The root static files (`index.html`, `app.js`, `styles.css`) are intentionally preserved as regression baseline.
