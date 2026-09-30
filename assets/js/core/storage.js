/*
 * storage.js — localStorage wrapper that never throws (private mode, blocked storage, previews).
 * Used only for per-visitor conveniences: theme, language, Excel names, finished topics, planner.
 */
(function (SAD) {
  'use strict';

  var PREFIX = 'sad.';

  SAD.storage = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
      } catch (e) { /* ignore: storage unavailable */ }
    },
    // raw string access (theme is read before JSON helpers exist, see index.html)
    getRaw: function (key) {
      try { return localStorage.getItem(PREFIX + key); } catch (e) { return null; }
    },
    setRaw: function (key, value) {
      try { localStorage.setItem(PREFIX + key, value); } catch (e) { /* ignore */ }
    }
  };
})(window.SAD);
