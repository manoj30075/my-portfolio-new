document.addEventListener('DOMContentLoaded', () => {
  const pat = document.getElementById('re-pattern');
  const flags = document.getElementById('re-flags');
  const input = document.getElementById('re-input');
  const output = document.getElementById('re-output');
  const meta = document.getElementById('re-meta');
  const count = document.getElementById('re-count');
  const clearBtn = document.getElementById('re-clear');

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  }

  function run() {
    output.innerHTML = '';
    const text = input.value || '';
    if (!pat.value) { meta.textContent = 'Enter a pattern'; count.textContent = '0 matches'; return; }
    let re;
    try {
      const f = (flags.value || '').replace(/[^gimsuy]/g, '');
      const fWithG = f.includes('g') ? f : (f + 'g');
      re = new RegExp(pat.value, fWithG);
    } catch (e) {
      meta.textContent = 'Invalid pattern';
      return;
    }
    meta.textContent = '—';
    let match;
    let lastIndex = 0;
    let pieces = '';
    let n = 0;
    while ((match = re.exec(text)) !== null) {
      n++;
      const start = match.index;
      const end = start + (match[0].length || 0);
      pieces += escapeHtml(text.slice(lastIndex, start));
      pieces += '<mark>' + escapeHtml(text.slice(start, end)) + '</mark>';
      lastIndex = end;
      if (match[0].length === 0) re.lastIndex++; // avoid zero-length infinite loop
    }
    pieces += escapeHtml(text.slice(lastIndex));
    output.innerHTML = pieces;
    count.textContent = `${n} match${n===1?'':'es'}`;
  }

  [pat, flags, input].forEach(el => el.addEventListener('input', run));
  clearBtn.addEventListener('click', () => { pat.value=''; flags.value=''; input.value=''; run(); pat.focus(); });
  run();
});


