# Implementation Plan: AI Research Workspace

This document outlines the proposed architecture and implementation phases for the AI Research Workspace desktop application (Mac & Windows).

## Goal Description
To build a premium, highly-interactive cross-platform desktop application tailored for researchers, analysts, and translators. The app provides a powerful 3-pane interface (Left: Workspace, Center: Reader, Right: AI insights) that goes beyond simple highlighting to offer continuous knowledge extraction, structured AI outputs, and multi-document synthesis.

## User Review Required
> [!NOTE]
> **Key Decisions Finalized:**
> 1. **AI Model Hosting:** Cloud API (OpenAI ChatGPT) will be used for high-quality extraction and drafting.
> 2. **Desktop Framework:** Electron + React (Vite) selected for a modern, high-performance cross-platform experience.
> 3. **Core Workflow Focus:** Read → Extract to Unified Outline (cross-document) → AI Generate Draft → Manual Edit. 

## Proposed Architecture

### Tech Stack
- **Frontend Framework**: React 18 built with Vite (Fast compilation, high performance UI).
- **Desktop Wrapper**: Electron (Cross-platform compatibility for Windows and Mac, deep file-system access).
- **Styling**: Vanilla CSS with modern custom variables, smooth transitions, and a premium Dark/Light mode theme.
- **Local Storage**: SQLite (via Electron integrations) for robust local storage of workspaces, metadata, highlights, and unified outlines.
- **Document Parsing**: `pdf.js` for robust PDF rendering and text layer interaction.
- **AI/LLM layer**: OpenAI API (ChatGPT) explicitly chosen for high-quality language tasks and Draft Generation.

### UI Component Layout (The 3-Pane Design)
1. **Left Panel (Workspaces)**: Folder trees, document collections, tagging system.
2. **Center Panel (Reader)**: High-fidelity PDF/article renderer, custom selection APIs to capture highlights.
3. **Right Panel (AI Brain & Workspace)**: A highly dynamic view updating based on user workflow:
   - **Unified Outline Builder**: Drag/extract highlights from *multiple* documents into a single master outline.
   - **Draft Generator**: Trigger ChatGPT to write a full article/report based on the Unified Outline.
   - **Rich Text Editor**: Edit, refine, and polish the AI-generated draft manually.

## Development Phases

### Phase 1: Proof of Concept UI (Web Mode)
Build the foundational UI in a standard web environment (Vite + React) first. This allows us to perfect the visual aesthetics, CSS animations, pane-resizing logic, and dummy-data interactions without Desktop overhead.

### Phase 2: Desktop Integration (Electron)
Wrap the UI in Electron. Connect local file system APIs to read actual PDF files from the Windows/Mac hard drive and render them in the center pane.

### Phase 3: Annotation & Data Layer
Implement SQLite. Write logic to select text on the PDF, save coordinates and text to the database, and render highlights natively.

### Phase 4: AI "Right Panel" & Outline-to-Draft Workflow
Integrate the ChatGPT API and build the core research loop:
- **Unified Outline**: Allow users to extract keywords/paragraphs from any open document and pin them to a global outline for the current project.
- **AI Draft Generation**: Feed the constructed unified outline context to ChatGPT to generate a structured draft.
- **Draft Editor**: Provide a built-in rich text editor so the user can modify and finalize the generated draft.

## Verification Plan
### Automated Tests
- Unit testing core CSS/UI responsiveness across standard desktop aspect ratios.
- Verifying SQLite read/write speeds for massive annotation data.

### Manual Verification
- Compile standard `.exe` (Windows) and `.dmg` (Mac).
- User tests importing a heavy (100+ page) PDF industry report and executing AI summary extraction.
