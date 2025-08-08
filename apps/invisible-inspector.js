// Invisible Inspector – detect zero-width and confusable characters
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const inputMeta = document.getElementById('input-meta');
  const outputMeta = document.getElementById('output-meta');
  const scanBtn = document.getElementById('scan-btn');
  const cleanBtn = document.getElementById('clean-btn');
  const normalizeBtn = document.getElementById('normalize-btn');
  const copyCleanBtn = document.getElementById('copy-clean-btn');

  // Zero-width and control codepoints
  const INVISIBLES = /[\u200B\u200C\u200D\uFEFF\u00AD\u2066\u2067\u2068\u2069\u202A\u202B\u202D\u202E\u202C\u200E\u200F]/g;

  // Minimal set of ASCII confusables (Cyrillic/Greek lookalikes)
  const CONFUSABLES = {
    '\u0430': 'a', // cyrillic a
    '\u03B1': 'a', // greek alpha
    '\u0441': 'c', // cyrillic es
    '\u03F2': 's', // greek lunate sigma
    '\u03BF': 'o', // greek omicron
    '\u043E': 'o', // cyrillic o
    '\u0440': 'p', // cyrillic er
    '\u0445': 'x', // cyrillic ha
    '\u03C5': 'y', // greek upsilon
    '\u03BA': 'k', // greek kappa
    '\u0391': 'A', '\u0410': 'A',
    '\u0395': 'E', '\u0415': 'E',
    '\u039A': 'K', '\u041A': 'K',
    '\u039C': 'M', '\u041C': 'M',
    '\u039D': 'N', '\u041D': 'H', // H-like N – keep N separate
    '\u039F': 'O', '\u041E': 'O',
    '\u03A1': 'P', '\u0420': 'P',
    '\u03A5': 'Y', '\u0423': 'Y',
    '\u03A7': 'X', '\u0425': 'X'
  };

  function summarizeIssues(text) {
    const invisibleMatches = [...text.matchAll(INVISIBLES)].length;
    // Scan for confusables by checking codepoints present in map keys
    const confusablePattern = new RegExp(Object.keys(CONFUSABLES).join('|'), 'g');
    const confusableMatches = [...text.matchAll(confusablePattern)].length;
    const parts = [];
    if (invisibleMatches) parts.push(`${invisibleMatches} invisible`);
    if (confusableMatches) parts.push(`${confusableMatches} confusable`);
    return parts.length ? parts.join(', ') : 'No issues detected';
  }

  function highlight(text) {
    // Show invisibles with bracketed hex and confusables underlined
    const withInvisibles = text.replace(INVISIBLES, (c) => {
      const hex = c.codePointAt(0).toString(16).toUpperCase();
      return `[U+${hex}]`;
    });
    const pattern = new RegExp(Object.keys(CONFUSABLES).join('|'), 'g');
    const highlighted = withInvisibles.replace(pattern, (c) => `\u0332${c}\u0332`);
    return highlighted;
  }

  function cleanInvisibles(text) {
    return text.replace(INVISIBLES, '');
  }

  function normalizeText(text) {
    try { return text.normalize('NFKC'); } catch { return text; }
  }

  function replaceConfusables(text) {
    return text.replace(new RegExp(Object.keys(CONFUSABLES).join('|'), 'g'), (c) => CONFUSABLES[c] || c);
  }

  function updateMeta() {
    inputMeta.textContent = `${input.value.length} chars`;
  }

  function runScan() {
    const text = input.value;
    updateMeta();
    const annotated = highlight(text);
    output.textContent = annotated;
    outputMeta.textContent = summarizeIssues(text);
  }

  input.addEventListener('input', runScan);
  scanBtn.addEventListener('click', runScan);

  cleanBtn.addEventListener('click', () => {
    input.value = cleanInvisibles(input.value);
    runScan();
  });

  normalizeBtn.addEventListener('click', () => {
    input.value = normalizeText(input.value);
    runScan();
  });

  copyCleanBtn.addEventListener('click', async () => {
    const cleaned = replaceConfusables(normalizeText(cleanInvisibles(input.value)));
    try {
      await navigator.clipboard.writeText(cleaned);
      outputMeta.textContent = 'Copied cleaned text to clipboard';
    } catch {
      outputMeta.textContent = 'Copy failed';
    }
  });

  // Initial
  runScan();
});


