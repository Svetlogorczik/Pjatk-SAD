/*
 * i18n.js — language state (pl / en / ru), UI string lookup and helpers for trilingual data.
 */
(function (SAD) {
  'use strict';

  var LANGS = ['pl', 'en', 'ru'];
  var dict = { pl: {}, en: {}, ru: {} };

  function detect() {
    var fromUrl = (location.search.match(/[?&]lang=(pl|en|ru)/) || [])[1];
    if (fromUrl) { return fromUrl; }
    var saved = SAD.storage.get('lang', null);
    if (LANGS.indexOf(saved) >= 0) { return saved; }
    var nav = (navigator.language || 'pl').slice(0, 2).toLowerCase();
    if (nav === 'ru' || nav === 'uk' || nav === 'be') { return 'ru'; }
    if (nav === 'pl') { return 'pl'; }
    return 'en';
  }

  var i18n = SAD.i18n = {
    langs: LANGS,
    lang: 'pl',

    add: function (strings) {
      LANGS.forEach(function (l) {
        var src = strings[l] || {};
        Object.keys(src).forEach(function (k) { dict[l][k] = src[k]; });
      });
    },

    // t('btn.copy') or t('topic.kicker', {n: 3})
    t: function (key, vars) {
      var s = dict[i18n.lang][key];
      if (s === undefined) { s = dict.pl[key]; }
      if (s === undefined) { s = key; }
      return vars ? SAD.util.fmt(s, vars) : s;
    },

    // pick({pl:'…', en:'…', ru:'…'}) → text in the current language (falls back to pl → en)
    pick: function (value) {
      if (value === null || value === undefined) { return ''; }
      if (typeof value !== 'object' || Array.isArray(value)) { return value; }
      if (value[i18n.lang] !== undefined) { return value[i18n.lang]; }
      return value.pl !== undefined ? value.pl : value.en;
    },

    set: function (lang, silent) {
      if (LANGS.indexOf(lang) < 0) { return; }
      i18n.lang = lang;
      SAD.storage.set('lang', lang);
      document.documentElement.setAttribute('lang', lang);
      i18n.applyStatic();
      if (!silent) { SAD.emit('lang', lang); }
    },

    // Elements with data-i18n="key" (static shell) get their text updated
    applyStatic: function () {
      SAD.util.qsa('[data-i18n]').forEach(function (el) {
        el.textContent = i18n.t(el.getAttribute('data-i18n'));
      });
      SAD.util.qsa('[data-lang]').forEach(function (el) {
        var active = el.getAttribute('data-lang') === i18n.lang;
        el.classList.toggle('segmented__item--active', active);
        el.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    },

    init: function () {
      i18n.lang = detect();
      document.documentElement.setAttribute('lang', i18n.lang);
      document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-lang]');
        if (btn) { i18n.set(btn.getAttribute('data-lang')); }
      });
    }
  };
})(window.SAD);
