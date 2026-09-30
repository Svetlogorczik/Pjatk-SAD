/*
 * namespace.js — global SAD namespace, tiny event bus, DOM helpers and data registries.
 * All scripts are classic (non-module) so the site also works when opened from disk (file://).
 */
(function (root) {
  'use strict';

  var SAD = root.SAD = root.SAD || {};

  /* ---------- event bus ---------- */
  var listeners = {};
  SAD.on = function (name, fn) {
    (listeners[name] = listeners[name] || []).push(fn);
  };
  SAD.emit = function (name, payload) {
    (listeners[name] || []).slice().forEach(function (fn) { fn(payload); });
  };

  /* ---------- DOM / string helpers ---------- */
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  SAD.util = {
    esc: function (s) {
      return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; });
    },
    qs: function (sel, ctx) { return (ctx || document).querySelector(sel); },
    qsa: function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); },
    // "Hello {name}" + {name: 'x'} → "Hello x"
    fmt: function (tpl, vars) {
      return String(tpl).replace(/\{(\w+)\}/g, function (m, k) {
        return vars && vars[k] !== undefined ? vars[k] : m;
      });
    },
    slug: function (text) {
      return String(text).toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/ł/g, 'l')
        .replace(/[^a-z0-9Ѐ-ӿ]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'section';
    },
    // Number formatting respecting the language's decimal separator
    num: function (x, digits, lang) {
      if (typeof x !== 'number' || !isFinite(x)) { return String(x); }
      var s = digits === undefined ? String(+x.toPrecision(10)) : x.toFixed(digits);
      lang = lang || (SAD.i18n && SAD.i18n.lang) || 'pl';
      return lang === 'en' ? s : s.replace('.', ',');
    }
  };

  /* ---------- data registries ---------- */
  SAD.data = SAD.data || { topics: {}, extra: {} };

  // Topic files call this: SAD.registerTopic('t01', { pl: {...}, en: {...}, ru: {...}, charts: {...} })
  SAD.registerTopic = function (id, content) {
    SAD.data.topics[id] = content;
    SAD.emit('topic-loaded', id);
  };

  // Other lazily loaded data files (e.g. colloquia) call this
  SAD.registerData = function (key, content) {
    SAD.data.extra[key] = content;
    SAD.emit('data-loaded', key);
  };

  // Content helper for data files: md`...` keeps backslashes (TeX) untouched
  SAD.md = String.raw;
})(window);
