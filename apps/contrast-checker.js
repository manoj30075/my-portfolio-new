document.addEventListener('DOMContentLoaded', () => {
  const fg = document.getElementById('fg');
  const bg = document.getElementById('bg');
  const swap = document.getElementById('swap');
  const results = document.getElementById('results');
  const ratioMeta = document.getElementById('ratio-meta');
  const preview = document.getElementById('preview');

  function parseColor(str) {
    if (!str) return null;
    if (/^#?[0-9a-fA-F]{6}$/.test(str)) {
      const hex = str.replace('#','');
      return [
        parseInt(hex.slice(0,2),16)/255,
        parseInt(hex.slice(2,4),16)/255,
        parseInt(hex.slice(4,6),16)/255,
      ];
    }
    const m = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/.exec(str);
    if (m) return [Number(m[1])/255, Number(m[2])/255, Number(m[3])/255];
    return null;
  }

  function srgbToL(rgb) {
    const [r,g,b]=rgb.map(c=> c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4));
    return 0.2126*r + 0.7152*g + 0.0722*b;
  }

  function ratio(fgc, bgc) {
    const L1 = srgbToL(fgc);
    const L2 = srgbToL(bgc);
    const hi = Math.max(L1,L2)+0.05;
    const lo = Math.min(L1,L2)+0.05;
    return hi/lo;
  }

  function pass(r, threshold) { return r >= threshold ? 'Pass' : 'Fail'; }

  function setTable(rows) {
    results.innerHTML = '';
    const tbody = document.createElement('tbody');
    rows.forEach(([k,v])=>{const tr=document.createElement('tr');const th=document.createElement('th');th.textContent=k;const td=document.createElement('td');td.textContent=v;tr.appendChild(th);tr.appendChild(td);tbody.appendChild(tr);});
    results.appendChild(tbody);
  }

  function update() {
    const f = parseColor(fg.value || '#000000');
    const b = parseColor(bg.value || '#ffffff');
    if (!f || !b) { ratioMeta.textContent = 'Enter colors as #RRGGBB or rgb(r,g,b)'; return; }
    const r = ratio(f,b);
    const rFixed = r.toFixed(2);
    setTable([
      ['Contrast ratio', rFixed],
      ['AA (normal)', pass(r, 4.5)],
      ['AAA (normal)', pass(r, 7.0)],
      ['AA (large)', pass(r, 3.0)],
      ['AAA (large)', pass(r, 4.5)],
    ]);
    ratioMeta.textContent = `Computed at ${new Date().toLocaleTimeString()}`;
    preview.style.color = fg.value || '#000000';
    preview.style.background = bg.value || '#ffffff';
  }

  [fg,bg].forEach(e => e.addEventListener('input', update));
  swap.addEventListener('click', ()=>{ const t=fg.value; fg.value=bg.value; bg.value=t; update(); });
  fg.value = '#000000';
  bg.value = '#ffffff';
  update();
});


