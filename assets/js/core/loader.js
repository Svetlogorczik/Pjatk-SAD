/*
 * loader.js — on-demand loading of data scripts (topic content, colloquia).
 * Uses <script> injection instead of fetch() so it also works from file://.
 */
(function (SAD) {
  'use strict';

  var pending = {};

  function loadScript(src) {
    if (pending[src]) { return pending[src]; }
    pending[src] = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () {
        delete pending[src];
        s.remove();
        reject(new Error('Cannot load ' + src));
      };
      document.head.appendChild(s);
    });
    return pending[src];
  }

  SAD.loader = {
    script: loadScript,

    topic: function (id) {
      if (SAD.data.topics[id]) { return Promise.resolve(SAD.data.topics[id]); }
      return loadScript('assets/js/data/topics/' + id + '.js').then(function () {
        if (!SAD.data.topics[id]) { throw new Error('Topic ' + id + ' not registered'); }
        return SAD.data.topics[id];
      });
    },

    data: function (key) {
      if (SAD.data.extra[key]) { return Promise.resolve(SAD.data.extra[key]); }
      return loadScript('assets/js/data/' + key + '.js').then(function () {
        return SAD.data.extra[key];
      });
    }
  };
})(window.SAD);
