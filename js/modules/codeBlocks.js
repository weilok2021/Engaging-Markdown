export function init({ root }) {
  const article = root.querySelector('.article');

  article.addEventListener('rendered', () => {
    article.querySelectorAll('pre > code').forEach((codeEl) => {
      // Syntax highlight via hljs (loaded as classic script on window)
      if (window.hljs) {
        try { window.hljs.highlightElement(codeEl); } catch {}
      }

      const pre = codeEl.parentElement;

      // Language label
      if (!pre.querySelector('.code-lang')) {
        const langMatch = codeEl.className.match(/language-(\w+)/);
        if (langMatch) {
          const label = window.document.createElement('span');
          label.className = 'code-lang';
          label.textContent = langMatch[1];
          pre.appendChild(label);
        }
      }

      // Copy button
      if (!pre.querySelector('.code-copy')) {
        const btn = window.document.createElement('button');
        btn.className = 'code-copy';
        btn.type = 'button';
        btn.textContent = 'Copy';
        btn.addEventListener('click', () => {
          navigator.clipboard?.writeText(codeEl.textContent).then(() => {
            btn.textContent = '✓ Copied';
            btn.classList.add('copied');
            setTimeout(() => {
              btn.textContent = 'Copy';
              btn.classList.remove('copied');
            }, 1400);
          });
        });
        pre.appendChild(btn);
      }
    });
  });
}
