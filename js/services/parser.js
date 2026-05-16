/**
 * Parser service — wraps marked. The ONLY file that touches window.marked.
 *
 * Does NOT apply syntax highlighting. Highlighting is handled post-render by
 * modules/codeBlocks.js via hljs.highlightElement(). This keeps parser.js
 * free of hljs dependencies and matches modern marked usage.
 */
export const parser = {
  toHtml(markdown) {
    try {
      return window.marked.parse(markdown, {
        gfm: true,
        breaks: true,
        mangle: false,
        headerIds: false,
      });
    } catch (err) {
      return `<p class="parse-error">Failed to render Markdown: ${err.message}</p>`;
    }
  },
};
