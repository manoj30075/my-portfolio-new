// Manoj's portfolio — vanilla JS
// Handles: live handwriting animation, active nav on scroll,
// smooth scroll, footer clock, keyboard shortcuts, scroll-to-top.

(function () {
  'use strict';

  const reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── footer clock ────────────────────────────────────────────
  function updateTime() {
    const el = document.getElementById('current-time');
    if (!el) return;
    el.textContent = new Date().toLocaleTimeString('en-US', {
      hour12: false, hour: '2-digit', minute: '2-digit'
    });
  }

  // ── smooth scroll for same-page anchors ─────────────────────
  function wireSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', id);
      });
    });
  }

  // ── active nav highlighting ─────────────────────────────────
  function wireActiveNav() {
    const links = [...document.querySelectorAll('.top-nav a[href^="#"]')];
    if (!links.length) return;
    const byHash = new Map(links.map(l => [l.getAttribute('href'), l]));
    const sectionIds = links.map(l => l.getAttribute('href').slice(1));
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const link = byHash.get('#' + entry.target.id);
        if (!link) return;
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }

  // ── live handwriting effect ─────────────────────────────────
  // Splits targeted elements into per-character spans with staggered
  // animation delays, triggered when they scroll into view. Each
  // element animates independently so long pages don't wait for a
  // single global timeline.
  function wireHandwriting() {
    if (reduceMotion) return;

    const PER_CHAR_MS = 10;
    const JITTER_MS = 8;
    const WORD_PAUSE = 28;
    const MAX_STAGGER = 1800;
    const SKIP_TAGS = new Set([
      'SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'CANVAS',
      'INPUT', 'TEXTAREA', 'CODE'
    ]);

    // Target: any section heading, hero, project card, job, log row,
    // about paragraph, contact hero/lead. These cover the copy without
    // over-splitting giant text blobs.
    const targets = [
      '.hero-name', '.hero-tag', '.margin-notes',
      '.section-head h2', '.section-head .section-dek',
      '.about-body p', '.about-body .opinions',
      '.job-header h3', '.job-header .company', '.job .achievements li',
      '.log-row',
      '.project-card h3', '.project-card p', '.project-card .project-meta',
      '.shelf-row h4', '.shelf-row .shelf-body',
      '.edu-item h4', '.edu-item .institution', '.edu-item .coursework',
      '.contact-hero', '.contact-lead',
      '.contact-block h4', '.contact-block .contact-list',
      '.contact-primary'
    ].join(',');

    function shouldSkipAncestor(node) {
      let p = node.parentElement;
      while (p) {
        if (SKIP_TAGS.has(p.tagName)) return true;
        p = p.parentElement;
      }
      return false;
    }

    function split(el) {
      if (el.dataset.writeReady === '1') return;
      el.dataset.writeReady = '1';
      el.setAttribute('data-write', '');

      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (shouldSkipAncestor(n)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      const nodes = [];
      let n;
      while ((n = walker.nextNode())) nodes.push(n);

      let t = 0;
      for (const textNode of nodes) {
        const frag = document.createDocumentFragment();
        const s = textNode.nodeValue;
        for (let i = 0; i < s.length; i++) {
          const ch = s[i];
          if (ch === ' ' || ch === '\n' || ch === '\t') {
            frag.appendChild(document.createTextNode(ch));
            t += WORD_PAUSE * 0.4;
            continue;
          }
          const span = document.createElement('span');
          span.className = 'w-char';
          const jitter = (Math.random() * JITTER_MS) | 0;
          const rot = ((Math.random() - 0.5) * 2).toFixed(2);
          span.style.setProperty('--d', (t + jitter) + 'ms');
          span.style.setProperty('--r', rot + 'deg');
          span.textContent = ch;
          frag.appendChild(span);
          t += PER_CHAR_MS;
          if (t > MAX_STAGGER) t = MAX_STAGGER;
        }
        const parent = textNode.parentNode;
        if (parent) parent.replaceChild(frag, textNode);
      }
    }

    function trigger(el) {
      if (el.classList.contains('w-go')) return;
      el.classList.add('w-go');
    }

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        split(e.target);
        requestAnimationFrame(() => requestAnimationFrame(() => trigger(e.target)));
        io.unobserve(e.target);
      }
    }, { threshold: 0.12, rootMargin: '40px' });

    document.querySelectorAll(targets).forEach(el => io.observe(el));
  }

  // ── scroll-to-top ───────────────────────────────────────────
  function wireScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-to-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    const onScroll = () => {
      if (window.pageYOffset > 400) {
        btn.style.opacity = '1';
        btn.style.visibility = 'visible';
      } else {
        btn.style.opacity = '0';
        btn.style.visibility = 'hidden';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // ── keyboard shortcuts ──────────────────────────────────────
  function wireKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (!e.altKey) return;
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        const target = document.getElementById('contact');
        if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  // ── console easter egg ──────────────────────────────────────
  function consoleHello() {
    const art = [
      "",
      "  ✦ manoj palasamudram — product engineer",
      "",
      "  building: real-time IDE UIs × agentic AI × streaming LLM interfaces",
      "  stack:    typescript · react · python · node · langgraph · mcp",
      "  hiring?   manojpls@icloud.com",
      ""
    ].join('\n');
    console.log('%c' + art, 'font-family: "Kalam", "Space Mono", monospace; color:#ff5a36;');
  }

  // ── boot ────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 30_000);
    wireSmoothScroll();
    wireActiveNav();
    wireHandwriting();
    wireScrollToTop();
    wireKeyboard();
    consoleHello();
  });
})();
