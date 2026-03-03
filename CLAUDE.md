# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and other AI agents when working with code in this repository. For human-readable documentation, see [README.md](README.md).

## Project Overview

Engaging Markdown is a lightweight, client-side Markdown viewer — a single-page application with zero build tools and zero npm dependencies. It uses vanilla JavaScript, HTML, and CSS with CDN-hosted libraries (marked.js, Highlight.js, Google Fonts). The goal is to stay lightweight: no frameworks, no bundlers, no backend.

## Development

No build step, no package manager. Serve the static files with any HTTP server:

```bash
python -m http.server 8000
# or
npx http-server
```

There are no tests, linters, or CI pipelines.

## Architecture

The entire app is three files:

- **`index.html`** — Markup structure, CDN script/style imports
- **`js/app.js`** — All application logic (~365 lines), organized into sections: Theme, File Input, Drag & Drop, Load & Render, Table of Contents, TOC Toggle, Sidebar Resize, Reading Progress, Session Restore
- **`css/styles.css`** — Complete styling (~737 lines) with CSS custom properties for light/dark theming

### Key Patterns

- **Theming**: `data-theme` attribute on `<html>` switches CSS variable sets. Theme preference stored in `localStorage('md-viewer-theme')`. Highlight.js CSS stylesheet URL is swapped dynamically.
- **Markdown rendering**: `marked.parse()` with GFM and breaks enabled; syntax highlighting via `hljs.highlight()`. Code blocks get language labels and copy buttons post-render.
- **TOC**: Auto-generated from h1–h4 headings in rendered output. Active heading tracked via scroll position (not IntersectionObserver). Click-scroll suppression flag (`isClickScrolling`) prevents scroll handler from fighting smooth-scroll navigation.
- **Session persistence**: Markdown content and filename saved to `sessionStorage` for refresh recovery.
- **Responsive**: 900px breakpoint. Sidebar is sticky on desktop (drag-resizable, 180–450px), overlay drawer on mobile.

### State

- `localStorage`: theme preference
- `sessionStorage`: current markdown text + filename
- Module-level flags: `isResizing`, `isClickScrolling`

## Conventions

- 2-space indentation
- camelCase for JS variables/functions, kebab-case for CSS classes and HTML IDs
- Section markers in JS: `// ===== Section Name =====`
- No module system — single script loaded at end of `<body>`
