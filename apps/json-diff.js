document.addEventListener('DOMContentLoaded', () => {
  const a = document.getElementById('a');
  const b = document.getElementById('b');
  const out = document.getElementById('out');
  const metaOut = document.getElementById('meta-out');
  const diffBtn = document.getElementById('diff');
  const swapBtn = document.getElementById('swap');
  const clearBtn = document.getElementById('clear');

  function parse(text) {
    try { return JSON.parse(text); } catch { return Symbol('invalid'); }
  }

  function isObject(v) { return v && typeof v === 'object' && !Array.isArray(v); }

  function diff(a, b, path = '') {
    if (a === b) return [];
    if (Array.isArray(a) && Array.isArray(b)) {
      const max = Math.max(a.length, b.length);
      let res = [];
      for (let i = 0; i < max; i++) {
        res = res.concat(diff(a[i], b[i], `${path}[${i}]`));
      }
      return res;
    }
    if (isObject(a) && isObject(b)) {
      const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
      let res = [];
      for (const k of keys) {
        if (!(k in a)) res.push({ type: '+', path: `${path}.${k}` });
        else if (!(k in b)) res.push({ type: '-', path: `${path}.${k}` });
        else res = res.concat(diff(a[k], b[k], `${path}.${k}`));
      }
      return res;
    }
    return [{ type: '~', path }];
  }

  function format(rows) {
    if (!rows.length) return 'No differences';
    const lines = rows.map(r => `${r.type} ${r.path || '(root)'}`);
    return lines.join('\n');
  }

  function run() {
    const av = parse(a.value || 'null');
    const bv = parse(b.value || 'null');
    if (typeof av === 'symbol' || typeof bv === 'symbol') {
      out.textContent = '';
      metaOut.textContent = 'Invalid JSON in one or both inputs';
      return;
    }
    const rows = diff(av, bv, '');
    out.textContent = format(rows);
    const add = rows.filter(r=>r.type==='+').length;
    const rem = rows.filter(r=>r.type==='-').length;
    const chg = rows.filter(r=>r.type==='~').length;
    metaOut.textContent = `${add} added, ${rem} removed, ${chg} changed`;
  }

  diffBtn.addEventListener('click', run);
  swapBtn.addEventListener('click', () => { [a.value, b.value] = [b.value, a.value]; run(); });
  clearBtn.addEventListener('click', () => { a.value=''; b.value=''; out.textContent=''; metaOut.textContent='—'; });
});


