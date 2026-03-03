/* ============================================================
   Engaging Markdown Viewer
   ============================================================ */

// --- DOM refs ---
const dropZone      = document.getElementById('drop-zone');
const rendered      = document.getElementById('rendered');
const fileInput     = document.getElementById('file-input');
const pickBtn       = document.getElementById('pick-btn');
const openBtn       = document.getElementById('open-btn');
const themeToggle   = document.getElementById('theme-toggle');
const themeIcon     = document.getElementById('theme-icon');
const progressBar   = document.getElementById('progress-bar');
const sidebar       = document.getElementById('sidebar');
const tocList       = document.getElementById('toc-list');
const tocToggle     = document.getElementById('toc-toggle');
const fileNameEl    = document.getElementById('file-name');
const overlay       = document.getElementById('sidebar-overlay');
const tocClose      = document.getElementById('toc-close');
const sidebarResize = document.getElementById('sidebar-resize');
const html          = document.documentElement;

// ============================================================
// Theme
// ============================================================

const savedTheme = localStorage.getItem('md-viewer-theme');
if (savedTheme) {
  html.setAttribute('data-theme', savedTheme);
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  html.setAttribute('data-theme', 'dark');
}
updateThemeIcon();
updateHljsTheme();

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('md-viewer-theme', next);
  updateThemeIcon();
  updateHljsTheme();
});

function updateThemeIcon() {
  const isDark = html.getAttribute('data-theme') === 'dark';
  themeIcon.innerHTML = isDark ? '&#9788;' : '&#9789;';
}

function updateHljsTheme() {
  const isDark = html.getAttribute('data-theme') === 'dark';
  const link = document.getElementById('hljs-theme');
  link.href = isDark
    ? 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css'
    : 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github.min.css';
}

// ============================================================
// File Input
// ============================================================

pickBtn.addEventListener('click', () => fileInput.click());
openBtn.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('click', (e) => {
  if (e.target !== pickBtn) fileInput.click();
});

fileInput.addEventListener('change', () => {
  if (fileInput.files.length) loadFile(fileInput.files[0]);
});

// ============================================================
// Drag & Drop
// ============================================================

['dragenter', 'dragover'].forEach(evt =>
  dropZone.addEventListener(evt, (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); })
);
['dragleave', 'drop'].forEach(evt =>
  dropZone.addEventListener(evt, () => dropZone.classList.remove('drag-over'))
);

// Support dropping anywhere on the page when content is shown
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
});

// ============================================================
// Load & Render
// ============================================================

function loadFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const md = e.target.result;
    renderMarkdown(md, file.name);
  };
  reader.readAsText(file);
}

function renderMarkdown(mdText, fileName) {
  // Configure marked
  marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: function(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    }
  });

  // Render
  rendered.innerHTML = marked.parse(mdText);

  // Enhance code blocks: language label + copy button
  rendered.querySelectorAll('pre').forEach(pre => {
    const code = pre.querySelector('code');

    // Detect language from class (e.g. "language-js")
    if (code) {
      const langMatch = code.className.match(/language-(\w+)/);
      if (langMatch) {
        const label = document.createElement('span');
        label.className = 'code-lang-label';
        label.textContent = langMatch[1];
        pre.appendChild(label);
      }
    }

    // Copy button
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(code ? code.textContent : pre.textContent).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 1500);
      });
    });
    pre.appendChild(btn);
  });

  // Show content, hide drop zone
  dropZone.style.display = 'none';
  rendered.style.display = 'block';

  // Update file name
  fileNameEl.textContent = fileName || 'Untitled';

  // Build TOC
  buildTOC();

  // Scroll to top
  window.scrollTo({ top: 0 });

  // Persist for session refresh
  try {
    sessionStorage.setItem('md-viewer-content', mdText);
    sessionStorage.setItem('md-viewer-filename', fileName || 'Untitled');
  } catch (e) {
    // sessionStorage may be full or unavailable; silently ignore
  }
}

// ============================================================
// Table of Contents
// ============================================================

function buildTOC() {
  tocList.innerHTML = '';
  const headings = rendered.querySelectorAll('h1, h2, h3, h4');

  if (headings.length === 0) {
    sidebar.classList.remove('visible');
    tocToggle.classList.add('hidden');
    return;
  }

  headings.forEach((heading, i) => {
    // Give heading an id if it doesn't have one
    if (!heading.id) {
      heading.id = 'heading-' + i;
    }

    const depth = parseInt(heading.tagName[1]);
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + heading.id;
    a.textContent = heading.textContent;
    a.className = 'depth-' + depth;
    a.addEventListener('click', (e) => {
      e.preventDefault();

      // Immediately force this link as active
      tocList.querySelectorAll('a').forEach(link => link.classList.remove('active'));
      a.classList.add('active');
      a.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

      // Suppress scroll-based tracking while smooth scroll runs
      isClickScrolling = true;
      if (clickScrollTimer) clearTimeout(clickScrollTimer);
      clickScrollTimer = setTimeout(() => { isClickScrolling = false; }, 800);

      // Scroll to the heading
      heading.scrollIntoView({ behavior: 'smooth' });

      // Close mobile sidebar
      if (window.innerWidth <= 900) {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('visible');
      }
    });
    li.appendChild(a);
    tocList.appendChild(li);
  });

  sidebar.classList.add('visible');
  tocToggle.classList.remove('hidden');

  // Start intersection observer for active tracking
  observeHeadings(headings);
}

let activeHeadingScrollHandler = null;
let isClickScrolling = false;
let clickScrollTimer = null;

function observeHeadings(headings) {
  // Remove previous scroll handler if re-rendering
  if (activeHeadingScrollHandler) {
    window.removeEventListener('scroll', activeHeadingScrollHandler);
  }

  const headingsArr = Array.from(headings);

  function updateActiveHeading() {
    if (isClickScrolling) return;
    const tocLinks = tocList.querySelectorAll('a');

    // Find the last heading whose top edge has scrolled past the top bar
    let current = null;
    for (const h of headingsArr) {
      if (h.getBoundingClientRect().top <= 80) {
        current = h;
      } else {
        break;
      }
    }

    if (current) {
      tocLinks.forEach(a => a.classList.remove('active'));
      const activeLink = tocList.querySelector(`a[href="#${current.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        activeLink.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }

  activeHeadingScrollHandler = updateActiveHeading;
  window.addEventListener('scroll', updateActiveHeading, { passive: true });

  // Clear click-scroll suppression when scroll animation finishes (modern browsers)
  window.addEventListener('scrollend', () => {
    if (isClickScrolling) {
      isClickScrolling = false;
      if (clickScrollTimer) clearTimeout(clickScrollTimer);
      updateActiveHeading();
    }
  }, { passive: true });

  updateActiveHeading();
}

// ============================================================
// TOC Toggle & Close
// ============================================================

tocToggle.addEventListener('click', () => {
  if (window.innerWidth <= 900) {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('visible');
  } else {
    sidebar.classList.toggle('visible');
  }
});

overlay.addEventListener('click', () => {
  sidebar.classList.remove('mobile-open');
  overlay.classList.remove('visible');
});

tocClose.addEventListener('click', () => {
  if (window.innerWidth <= 900) {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('visible');
  } else {
    sidebar.classList.remove('visible');
  }
});

// ============================================================
// Sidebar Drag-to-Resize
// ============================================================

let isResizing = false;

sidebarResize.addEventListener('mousedown', (e) => {
  if (window.innerWidth <= 900) return; // disable on mobile
  isResizing = true;
  sidebarResize.classList.add('active');
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isResizing) return;
  const newWidth = Math.min(Math.max(e.clientX, 180), 450);
  sidebar.style.width = newWidth + 'px';
});

document.addEventListener('mouseup', () => {
  if (!isResizing) return;
  isResizing = false;
  sidebarResize.classList.remove('active');
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});

// ============================================================
// Reading Progress Bar
// ============================================================

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
});

// ============================================================
// Restore from sessionStorage on page load
// ============================================================

(function restoreSession() {
  try {
    const savedMd = sessionStorage.getItem('md-viewer-content');
    const savedName = sessionStorage.getItem('md-viewer-filename');
    if (savedMd) {
      renderMarkdown(savedMd, savedName || 'Untitled');
    }
  } catch (e) {
    // sessionStorage unavailable; show default drop zone
  }
})();
