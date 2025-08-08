document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle-apps');
  const grid = document.getElementById('apps-grid');
  if (toggle && grid) {
    toggle.addEventListener('click', () => {
      const isHidden = grid.hasAttribute('hidden');
      if (isHidden) {
        grid.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = 'Hide apps';
      } else {
        grid.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Show all apps';
      }
    });
  }
});


