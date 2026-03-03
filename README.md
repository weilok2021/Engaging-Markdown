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
- **Dark / light theme** with automatic system preference detection
- **Auto-generated Table of Contents** from your headings (h1–h4), with active section tracking
- **Syntax highlighting** for code blocks with language labels and one-click copy
- **Resizable sidebar** on desktop, slide-out drawer on mobile
- **Reading progress bar** at the top of the page
- **Session persistence** — refresh the page and your document is still there

## Usage

Visit the [live site](https://weilok2021.github.io/Engaging-Markdown/) and drop a Markdown file onto the page. That's it.

To run it locally:

```bash
# any static file server works
python -m http.server 8000
# or
npx http-server
```

Then open `http://localhost:8000` in your browser.

## Tech Stack

Vanilla JavaScript, HTML, and CSS. No frameworks, no bundlers, no package manager.

External libraries loaded via CDN:
- [marked.js](https://github.com/markedjs/marked) — Markdown parsing
- [Highlight.js](https://highlightjs.org/) — syntax highlighting
- [Google Fonts](https://fonts.google.com/) — Inter + JetBrains Mono

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

MIT
