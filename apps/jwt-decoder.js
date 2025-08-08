document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('jwt-input');
  const clearBtn = document.getElementById('clear-jwt');
  const headerEl = document.getElementById('jwt-header');
  const payloadEl = document.getElementById('jwt-payload');
  const headerMeta = document.getElementById('header-meta');
  const payloadMeta = document.getElementById('payload-meta');

  function b64urlDecode(str) {
    try {
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      const pad = str.length % 4 ? 4 - (str.length % 4) : 0;
      str += '='.repeat(pad);
      const decoded = atob(str);
      // convert to UTF-8 string
      const bytes = Uint8Array.from(decoded, c => c.charCodeAt(0));
      return new TextDecoder('utf-8').decode(bytes);
    } catch {
      return null;
    }
  }

  function decodeJwt() {
    const token = input.value.trim();
    if (!token) {
      headerEl.textContent = '';
      payloadEl.textContent = '';
      headerMeta.textContent = '—';
      payloadMeta.textContent = '—';
      return;
    }
    const parts = token.split('.');
    if (parts.length < 2) {
      headerMeta.textContent = 'Invalid JWT';
      payloadMeta.textContent = '';
      return;
    }
    const [h, p] = parts;
    const hd = b64urlDecode(h);
    const pd = b64urlDecode(p);
    try {
      const hj = JSON.parse(hd || 'null');
      headerEl.textContent = JSON.stringify(hj, null, 2);
      headerMeta.textContent = 'Header decoded';
    } catch { headerMeta.textContent = 'Invalid header'; }
    try {
      const pj = JSON.parse(pd || 'null');
      payloadEl.textContent = JSON.stringify(pj, null, 2);
      const now = Math.floor(Date.now() / 1000);
      const msgs = [];
      if (pj && typeof pj.exp === 'number') msgs.push(`exp: ${new Date(pj.exp * 1000).toISOString()} (${pj.exp - now}s)`);
      if (pj && typeof pj.iat === 'number') msgs.push(`iat: ${new Date(pj.iat * 1000).toISOString()}`);
      payloadMeta.textContent = msgs.join(' • ') || 'Payload decoded';
    } catch { payloadMeta.textContent = 'Invalid payload'; }
  }

  input.addEventListener('input', decodeJwt);
  clearBtn.addEventListener('click', () => { input.value = ''; decodeJwt(); input.focus(); });
  decodeJwt();
});


