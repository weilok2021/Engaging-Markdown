# Engaging Markdown

A lightweight, client-side Markdown viewer that renders `.md` files in a clean, engaging UI. No installation, no sign-up — just drop your file and read.

**Live demo:** [https://weilok2021.github.io/Engaging-Markdown/](https://weilok2021.github.io/Engaging-Markdown/)

## Why I Built This

As a software engineer, I spend a good chunk of my day reading documents. Out of all the formats, Markdown is the one I enjoy reading the most — it's simple, structured, and gets straight to the point.

But raw `.md` files are still too verbose to read comfortably. I wanted something that could render them in a way that's actually pleasant to look at.

Sure, there are plenty of tools out there — Obsidian, Typora, various VS Code extensions — but I don't want to install an app, set up a workspace, or learn another tool just to read a document. I wanted something **lightweight** and frictionless: open it, drop a file, and start reading.

So I built Engaging Markdown. It runs entirely in your browser. No backend, no dependencies to install, no accounts. Just a single static page that does one thing well.

## Features

- **Drag & drop** or click to open any `.md`, `.markdown`, `.mdx`, or `.txt` file
- **Try a sample document** without bringing your own — one click from the landing page lets you preview the viewer's full typography, TOC, and code-block treatment
- **Refined typography** — Fraunces (display) + Switzer (body) + JetBrains Mono (code), tuned for long-form reading at 17px / 1.7 line-height
- **Light & dark themes** with automatic system preference detection; the syntax-highlighting palette swaps with the theme
- **Auto-generated Table of Contents** from your headings (h1–h4), with smooth-scroll navigation and an animated active-section indicator
- **Syntax highlighting** for code blocks with language labels and one-click copy
- **Resizable sidebar** on desktop (220–420 px), slide-out drawer on mobile
- **Reading progress bar** at the top of the page
- **Session persistence** — refresh the page and your document is still there
- **Click the brand wordmark** in the sidebar to return to the landing page at any time

## Usage

Visit the [live site](https://weilok2021.github.io/Engaging-Markdown/) and drop a Markdown file onto the page. That's it.

To run it locally — **a static server is required** (the app uses ES modules, which browsers refuse to load from `file://` for security reasons):

```bash
python -m http.server 8000
# or
npx http-server
# or
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Tech Stack

Vanilla JavaScript, HTML, and CSS. No frameworks, no bundlers, no package manager.

Architecture:
- ES modules under `js/`: `state/` (reactive store + Document model), `services/` (storage + parser), `modules/` (UI features)
- CSS organized with `@layer` and `@import` under `css/`: `reset`, `tokens`, `base`, `layout`, `components/*`

External libraries loaded via CDN (pinned):
- [marked.js](https://github.com/markedjs/marked) `@5.1.2` — Markdown parsing
- [Highlight.js](https://highlightjs.org/) `@11.9.0` — syntax highlighting
- [Google Fonts](https://fonts.google.com/) — Fraunces, JetBrains Mono
- [Fontshare](https://www.fontshare.com/) — Switzer

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

MIT
