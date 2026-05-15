let isClickScrolling = false;
let clickScrollTimer = null;

export function init({ root }) {
  const article   = root.querySelector('.article');
  const sidebar   = root.querySelector('.sidebar');
  const tocList   = root.querySelector('.toc-list');
  const tocIndic  = root.querySelector('.toc-indicator');
  const tocToggle = root.querySelector('[data-toc-toggle]');
  const overlay   = root.querySelector('[data-sidebar-overlay]');

  let activeScrollHandler = null;

  article.addEventListener('rendered', () => {
    build();
  });

  function build() {
    // Clear previous TOC items, preserve indicator
    [...tocList.querySelectorAll('a')].forEach((a) => a.remove());

    const headings = article.querySelectorAll('h1, h2, h3, h4');
    if (headings.length === 0) {
      sidebar.dataset.state = 'hidden';
      tocToggle.classList.add('hidden');
      return;
    }

    headings.forEach((h, i) => {
      if (!h.id) h.id = `heading-${i}`;
      const depth = parseInt(h.tagName[1], 10);
      const a = window.document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = h.textContent;
      a.className = 'toc-item';
      a.dataset.depth = depth;

      a.addEventListener('click', (e) => {
        e.preventDefault();
        tocList.querySelectorAll('a').forEach((link) => link.classList.remove('active'));
        a.classList.add('active');

        isClickScrolling = true;
        clearTimeout(clickScrollTimer);
        clickScrollTimer = setTimeout(() => { isClickScrolling = false; }, 800);

        h.scrollIntoView({ behavior: 'smooth' });
        moveIndicator(a);

        if (window.innerWidth <= 900) {
          sidebar.classList.remove('mobile-open');
          overlay.classList.remove('visible');
        }
      });

      tocList.appendChild(a);
    });

    sidebar.dataset.state = 'visible';
    tocToggle.classList.remove('hidden');
    observe(headings);
  }

  function moveIndicator(activeLink) {
    if (!activeLink || !tocIndic) return;
    const listRect = tocList.getBoundingClientRect();
    const itemRect = activeLink.getBoundingClientRect();
    const y = itemRect.top - listRect.top + (itemRect.height - 22) / 2;
    tocIndic.style.transform = `translateY(${y}px)`;
  }

  function observe(headings) {
    if (activeScrollHandler) {
      window.removeEventListener('scroll', activeScrollHandler);
    }

    const headingsArr = [...headings];

    function update() {
      if (isClickScrolling) return;
      let current = null;
      for (const h of headingsArr) {
        if (h.getBoundingClientRect().top <= 80) current = h;
        else break;
      }
      if (!current) return;
      tocList.querySelectorAll('a').forEach((a) => a.classList.remove('active'));
      const activeLink = tocList.querySelector(`a[href="#${current.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        moveIndicator(activeLink);
      }
    }

    activeScrollHandler = update;
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('scrollend', () => {
      if (isClickScrolling) {
        isClickScrolling = false;
        clearTimeout(clickScrollTimer);
        update();
      }
    }, { passive: true });

    update();
  }

  // TOC toggle + mobile overlay handlers
  tocToggle.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 900;
    if (isMobile) {
      const isOpen = sidebar.classList.contains('mobile-open');
      sidebar.classList.toggle('mobile-open', !isOpen);
      overlay.classList.toggle('visible', !isOpen);
    } else {
      const isOpen = sidebar.dataset.state === 'visible';
      sidebar.dataset.state = isOpen ? 'hidden' : 'visible';
    }
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('visible');
  });
}
