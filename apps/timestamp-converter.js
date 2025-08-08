document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('t-input');
  const results = document.getElementById('t-results');
  const meta = document.getElementById('t-meta');
  const nowBtn = document.getElementById('t-now');
  const clearBtn = document.getElementById('t-clear');

  function setRows(rows) {
    results.innerHTML = '';
    const tbody = document.createElement('tbody');
    rows.forEach(([k,v])=>{const tr=document.createElement('tr');const th=document.createElement('th');th.textContent=k;const td=document.createElement('td');td.textContent=v;tr.appendChild(th);tr.appendChild(td);tbody.appendChild(tr);});
    results.appendChild(tbody);
  }

  function rel(ms) {
    const s = Math.round((ms - Date.now())/1000);
    const abs = Math.abs(s);
    const unit = abs>=86400?['day',86400]:abs>=3600?['hour',3600]:abs>=60?['minute',60]:['second',1];
    const n = Math.round(s/unit[1]);
    return n===0? 'now' : (n>0? `in ${n} ${unit[0]}${Math.abs(n)===1?'':'s'}` : `${Math.abs(n)} ${unit[0]}${Math.abs(n)===1?'':'s'} ago`);
  }

  function parseInput(text) {
    if (!text) return null;
    if (/^\d{13}$/.test(text)) return new Date(Number(text)); // ms
    if (/^\d{10}$/.test(text)) return new Date(Number(text)*1000); // s
    const d = new Date(text);
    if (!isNaN(d.getTime())) return d;
    return null;
  }

  function update() {
    const v = input.value.trim();
    const d = parseInput(v);
    if (!v) { setRows([]); meta.textContent='—'; return; }
    if (!d) { setRows([['input', v]]); meta.textContent='Invalid time'; return; }
    const rows = [
      ['ISO (UTC)', d.toISOString()],
      ['Local', d.toString()],
      ['Epoch ms', d.getTime().toString()],
      ['Epoch s', Math.floor(d.getTime()/1000).toString()],
      ['Relative', rel(d.getTime())]
    ];
    setRows(rows);
    meta.textContent = 'Parsed successfully';
  }

  input.addEventListener('input', update);
  nowBtn.addEventListener('click', ()=>{ input.value = Date.now().toString(); update(); });
  clearBtn.addEventListener('click', ()=>{ input.value=''; update(); input.focus(); });
  update();
});


