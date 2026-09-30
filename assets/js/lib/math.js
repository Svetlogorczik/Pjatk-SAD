/*
 * math.js — renders [data-tex] elements with KaTeX (loaded from CDN with "defer").
 * Without internet the TeX source stays visible in a monospace font.
 */
(function (SAD) {
  'use strict';

  var waiting = [];

  function renderEl(el) {
    if (el.getAttribute('data-rendered')) { return; }
    var tex = el.getAttribute('data-tex');
    var display = el.classList.contains('math-block');
    try {
      window.katex.render(tex, el, { displayMode: display, throwOnError: false, strict: 'ignore', trust: false });
      el.setAttribute('data-rendered', '1');
    } catch (e) {
      el.classList.add('math--fallback');
    }
  }

  function renderIn(root) {
    var els = SAD.util.qsa('[data-tex]', root || document);
    if (!els.length) { return; }
    if (window.katex) {
      els.forEach(renderEl);
    } else {
      els.forEach(function (el) { el.classList.add('math--fallback'); });
      waiting.push(root || document);
    }
  }

  // KaTeX arrives after our scripts (defer) — render everything that was waiting
  function flush() {
    if (!window.katex) { return; }
    var list = waiting.splice(0);
    list.forEach(function (root) {
      SAD.util.qsa('[data-tex]', root).forEach(function (el) {
        el.classList.remove('math--fallback');
        renderEl(el);
      });
    });
  }

  window.addEventListener('load', flush);
  document.addEventListener('DOMContentLoaded', flush);

  SAD.math = { renderIn: renderIn };
})(window.SAD);
