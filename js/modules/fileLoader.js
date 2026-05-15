import { doc } from '../state/document.js';

export function init({ root }) {
  const dropZone  = root.querySelector('[data-drop-zone]');
  const fileInput = root.querySelector('[data-file-input]');
  const openBtn   = root.querySelector('[data-file-open]');

  const readFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => doc.load(e.target.result, file.name);
    reader.onerror = () => {
      console.error('FileReader failed for', file.name);
    };
    reader.readAsText(file);
  };

  // File input
  openBtn?.addEventListener('click', () => fileInput.click());
  dropZone?.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => readFile(fileInput.files[0]));

  // Drop on dropZone
  ['dragenter', 'dragover'].forEach((evt) =>
    dropZone?.addEventListener(evt, (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    })
  );
  ['dragleave', 'drop'].forEach((evt) =>
    dropZone?.addEventListener(evt, () => dropZone.classList.remove('drag-over'))
  );

  // Drop anywhere on the page when content is loaded
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
