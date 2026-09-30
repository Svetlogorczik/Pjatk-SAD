/*
 * theme.js — light / dark theme toggle. The initial theme is set inline in index.html
 * (before first paint); this module only handles switching and remembering the choice.
 */
(function (SAD) {
  'use strict';

  var theme = SAD.theme = {
    current: function () {
      return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    },

    set: function (value) {
      document.documentElement.setAttribute('data-theme', value);
      SAD.storage.setRaw('theme', value);
      theme.updateButton();
      SAD.emit('theme', value);
    },

    toggle: function () {
      theme.set(theme.current() === 'dark' ? 'light' : 'dark');
    },

    updateButton: function () {
      var btn = document.getElementById('theme-toggle');
      if (!btn) { return; }
      var next = theme.current() === 'dark' ? 'theme.toLight' : 'theme.toDark';
      btn.setAttribute('title', SAD.i18n.t(next));
      btn.setAttribute('aria-label', SAD.i18n.t(next));
    },

    init: function () {
      var btn = document.getElementById('theme-toggle');
      if (btn) { btn.addEventListener('click', theme.toggle); }
      SAD.on('lang', theme.updateButton);
      theme.updateButton();
    }
  };
})(window.SAD);
