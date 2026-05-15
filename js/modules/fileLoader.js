import { doc } from '../state/document.js';

const SAMPLE_DOC = `# Engaging Markdown

A lightweight, client-side viewer for reading Markdown — designed to stay out of the way.

## What you're looking at

This is the sample document. It demonstrates the typographic rhythm, the table of contents on the left, code-block treatment, and the reading-progress hairline at the very top of the page.

Drop your own \`.md\` file at any time to replace it. The viewer renders \`.md\`, \`.markdown\`, \`.mdx\`, and \`.txt\` files.

## Headings build hierarchy

Body text is set in Switzer at 17px / 1.7 line-height — tuned for long-form reading, not skimming. Section breaks have generous top margins so you *feel* the shift between ideas, not just see it.

### Subsections

Sub-headings step the type system down without losing rhythm. Each level has its own weight and optical size.

#### Smallest label

Used sparingly for quiet sub-labels in the prose.

## Code, treated with care

Inline \`code\` and code blocks share a warm-cream background that sits one step off the page color — visible without shouting. Block code gets a language label and a one-click copy button:

\`\`\`js
// A tiny reactive store — ~30 lines, no framework
export function createStore(initial) {
  let state = { ...initial };
  const subs = new Set();
  return {
    get: () => state,
    set: (patch) => {
      state = { ...state, ...patch };
      subs.forEach(fn => fn(state));
    },
    subscribe: (fn) => {
      subs.add(fn);
      fn(state);
      return () => subs.delete(fn);
    },
  };
}
\`\`\`

## Quotes carry weight

> "Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects." — Dieter Rams

## Lists stay readable

- Auto-generated table of contents from your headings (h1–h4)
- Light and dark themes — toggle from the sidebar, persists across reloads
- Drag-to-resize sidebar on desktop, slide-out drawer on mobile
- Session restored on refresh — your last document is still there

---

Ready when you are. Drop a Markdown file anywhere on the page to replace this sample.
`;

export function init({ root }) {
  const dropZone   = root.querySelector('[data-drop-zone]');
  const dropFrame  = root.querySelector('[data-drop-frame]');
  const fileInput  = root.querySelector('[data-file-input]');
  const openBtn    = root.querySelector('[data-file-open]');
  const sampleBtn  = root.querySelector('[data-sample]');
  const homeBtn    = root.querySelector('[data-home]');

  const readFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => doc.load(e.target.result, file.name);
    reader.onerror = () => {
      console.error('FileReader failed for', file.name);
    };
    reader.readAsText(file);
  };

  // Click handlers — only the drop frame opens the file picker (not the
  // surrounding brand / features / sample button)
  openBtn?.addEventListener('click', () => fileInput.click());
  dropFrame?.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => readFile(fileInput.files[0]));

  sampleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    doc.load(SAMPLE_DOC, 'sample.md');
  });

  // Brand wordmark acts as a "home" link — clears the doc and returns to empty state
  homeBtn?.addEventListener('click', () => doc.clear());

  // Drag visual feedback on the whole drop-zone area
  ['dragenter', 'dragover'].forEach((evt) =>
    dropZone?.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    })
  );
  ['dragleave', 'drop'].forEach((evt) =>
    dropZone?.addEventListener(evt, () => dropZone.classList.remove('drag-over'))
  );

  // Drop anywhere on the page (works after content is loaded and drop-zone is hidden)
  window.document.addEventListener('dragover', (e) => e.preventDefault());
  window.document.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) readFile(e.dataTransfer.files[0]);
  });

  dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length) readFile(e.dataTransfer.files[0]);
  });
}
