// HTTP Header Diff – compare two header blocks
document.addEventListener('DOMContentLoaded', () => {
  const aEl = document.getElementById('headers-a');
  const bEl = document.getElementById('headers-b');
  const metaA = document.getElementById('meta-a');
  const metaB = document.getElementById('meta-b');
  const metaR = document.getElementById('meta-result');
  const result = document.getElementById('result');
  const diffBtn = document.getElementById('diff-btn');
  const swapBtn = document.getElementById('swap-btn');
  const clearBtn = document.getElementById('clear-btn');

  function parseHeaders(text) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const map = new Map();
    for (const line of lines) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      const name = line.slice(0, idx).trim().toLowerCase();
      const value = line.slice(idx + 1).trim();
      // Combine duplicates using comma per RFC
      if (map.has(name)) map.set(name, map.get(name) + ', ' + value);
      else map.set(name, value);
    }
    return map;
  }

  function diffHeaders(a, b) {
    const names = new Set([...a.keys(), ...b.keys()]);
    const added = [], removed = [], changed = [], same = [];
    for (const n of names) {
      const av = a.get(n);
      const bv = b.get(n);
      if (av === undefined && bv !== undefined) added.push([n, bv]);
      else if (av !== undefined && bv === undefined) removed.push([n, av]);
      else if ((av || '') !== (bv || '')) changed.push([n, av, bv]);
      else same.push([n, av]);
    }
    return { added, removed, changed, same };
  }

  function formatDiff(d) {
    const lines = [];
    if (d.added.length) {
      lines.push('# Added');
      d.added.sort().forEach(([n, v]) => lines.push(`+ ${n}: ${v}`));
      lines.push('');
    }
    if (d.removed.length) {
      lines.push('# Removed');
      d.removed.sort().forEach(([n, v]) => lines.push(`- ${n}: ${v}`));
      lines.push('');
    }
    if (d.changed.length) {
      lines.push('# Changed');
      d.changed.sort().forEach(([n, av, bv]) => lines.push(`~ ${n}: \n  A: ${av}\n  B: ${bv}`));
      lines.push('');
    }
    if (!lines.length) return 'No differences';
    return lines.join('\n');
  }

  function updateMeta() {
    metaA.textContent = `${(aEl.value.match(/\n|$/g) || []).length - 1} headers`;
    metaB.textContent = `${(bEl.value.match(/\n|$/g) || []).length - 1} headers`;
  }

  function runDiff() {
    const a = parseHeaders(aEl.value);
    const b = parseHeaders(bEl.value);
    const d = diffHeaders(a, b);
    result.textContent = formatDiff(d);
    metaR.textContent = `${d.added.length} added, ${d.removed.length} removed, ${d.changed.length} changed`;
    updateMeta();
  }

  aEl.addEventListener('input', updateMeta);
  bEl.addEventListener('input', updateMeta);
  diffBtn.addEventListener('click', runDiff);
  swapBtn.addEventListener('click', () => {
    [aEl.value, bEl.value] = [bEl.value, aEl.value];
    runDiff();
  });
  clearBtn.addEventListener('click', () => {
    aEl.value = '';
    bEl.value = '';
    result.textContent = '';
    metaR.textContent = '—';
    updateMeta();
  });

  updateMeta();
});


