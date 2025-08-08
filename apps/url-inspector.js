document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('url-input');
  const urlTable = document.getElementById('url-table');
  const paramsTable = document.getElementById('params-table');
  const meta = document.getElementById('url-meta');
  const clearBtn = document.getElementById('clear-url');

  function setTableBody(table, rows) {
    table.innerHTML = '';
    const tbody = document.createElement('tbody');
    rows.forEach(([k, v]) => {
      const tr = document.createElement('tr');
      const th = document.createElement('th'); th.textContent = k;
      const td = document.createElement('td'); td.textContent = v;
      tr.appendChild(th); tr.appendChild(td); tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  }

  function inspect() {
    const raw = input.value.trim();
    if (!raw) {
      setTableBody(urlTable, []);
      setTableBody(paramsTable, []);
      meta.textContent = '—';
      return;
    }
    try {
      const url = new URL(raw);
      const rows = [
        ['href', url.href],
        ['origin', url.origin],
        ['protocol', url.protocol],
        ['username', url.username],
        ['password', url.password ? '••••' : ''],
        ['host', url.host],
        ['hostname', url.hostname],
        ['port', url.port || '(default)'],
        ['pathname', url.pathname],
        ['search', url.search],
        ['hash', url.hash]
      ];
      setTableBody(urlTable, rows);
      const params = [];
      url.searchParams.forEach((v, k) => params.push([k, v]));
      setTableBody(paramsTable, params.length ? params : [['(none)', '']]);
      meta.textContent = 'Parsed successfully';
    } catch (e) {
      meta.textContent = 'Invalid URL';
      setTableBody(urlTable, [['input', raw]]);
      setTableBody(paramsTable, []);
    }
  }

  input.addEventListener('input', inspect);
  clearBtn.addEventListener('click', () => { input.value = ''; inspect(); input.focus(); });
  inspect();
});


