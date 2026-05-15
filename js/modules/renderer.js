import { doc } from '../state/document.js';
import { parser } from '../services/parser.js';

export function init({ root }) {
  const article = root.querySelector('.article');
  const fileNameEl = root.querySelector('[data-file-name]');

  doc.subscribe(({ content, filename }) => {
    article.innerHTML = content ? parser.toHtml(content) : '';
    article.dataset.state = content ? 'loaded' : 'empty';

    if (fileNameEl) {
      fileNameEl.textContent = content ? (filename || 'Untitled') : 'No file open';
    }

    window.scrollTo({ top: 0 });
    // Dispatch even on empty content so post-render consumers (toc, codeBlocks)
    // can clear their state — toc resets the sidebar, codeBlocks no-ops on empty.
    article.dispatchEvent(new CustomEvent('rendered', { bubbles: true, detail: { content, filename } }));
  });
}
