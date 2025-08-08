document.addEventListener('DOMContentLoaded', () => {
  const out = document.getElementById('id-output');
  const meta = document.getElementById('id-meta');
  const uuidBtn = document.getElementById('uuid-btn');
  const nanoBtn = document.getElementById('nano-btn');

  function uuidv4() {
    const b = new Uint8Array(16);
    crypto.getRandomValues(b);
    b[6] = (b[6] & 0x0f) | 0x40; // version
    b[8] = (b[8] & 0x3f) | 0x80; // variant
    const hex = [...b].map(x => x.toString(16).padStart(2, '0'));
    return `${hex.slice(0,4).join('')}-${hex.slice(4,6).join('')}-${hex.slice(6,8).join('')}-${hex.slice(8,10).join('')}-${hex.slice(10,16).join('')}`;
  }

  function nanoid(size = 21) {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-';
    const bytes = new Uint8Array(size);
    crypto.getRandomValues(bytes);
    let id = '';
    for (let i = 0; i < size; i++) id += alphabet[bytes[i] % alphabet.length];
    return id;
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); meta.textContent = 'Copied'; }
    catch { meta.textContent = 'Copy failed'; }
  }

  uuidBtn.addEventListener('click', () => { const v = uuidv4(); out.textContent = v; copy(v); });
  nanoBtn.addEventListener('click', () => { const v = nanoid(); out.textContent = v; copy(v); });
});


