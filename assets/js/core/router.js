/*
 * router.js — hash router (#/topic/t01, #/topic/t01/exercises, …).
 * Hash routing needs no server configuration, so it works on GitHub Pages and from disk.
 */
(function (SAD) {
  'use strict';

  var routes = [];

  function compile(pattern) {
    var keys = [];
    var re = new RegExp('^' + pattern.replace(/\/:(\w+)/g, function (m, k) {
      keys.push(k);
      return '/([^/]+)';
    }) + '/?$');
    return { re: re, keys: keys };
  }

  var router = SAD.router = {
    current: { path: '/', params: {}, name: '' },

    add: function (name, pattern, handler) {
      var c = compile(pattern);
      routes.push({ name: name, re: c.re, keys: c.keys, handler: handler });
    },

    path: function () {
      var h = location.hash.replace(/^#/, '');
      return h.charAt(0) === '/' ? h.split('?')[0] : '/';
    },

    go: function (path) {
      location.hash = '#' + path;
    },

    resolve: function () {
      var path = router.path();
      for (var i = 0; i < routes.length; i++) {
        var m = path.match(routes[i].re);
        if (m) {
          var params = {};
          routes[i].keys.forEach(function (k, j) { params[k] = decodeURIComponent(m[j + 1]); });
          router.current = { path: path, params: params, name: routes[i].name };
          return routes[i];
        }
      }
      router.current = { path: path, params: {}, name: 'notfound' };
      return null;
    },

    // (Re)render the current route; keepScroll is used when only the language changes
    render: function (keepScroll) {
      var route = router.resolve();
      var view = document.getElementById('view');
      var y = window.scrollY;
      var done = function () {
        SAD.emit('routed', router.current);
        if (keepScroll) {
          window.scrollTo(0, y);
        } else {
          window.scrollTo(0, 0);
          var main = document.getElementById('main');
          if (main) { main.focus({ preventScroll: true }); }
        }
      };
      var result = route ? route.handler(view, router.current.params) : SAD.pages.notFound(view);
      if (result && typeof result.then === 'function') {
        result.then(done, function (err) {
          view.innerHTML = '<p class="page__status page__status--error">' + SAD.util.esc(SAD.i18n.t('error.load')) +
            '<br><small>' + SAD.util.esc(err && err.message) + '</small></p>';
          done();
        });
      } else {
        done();
      }
    },

    init: function () {
      window.addEventListener('hashchange', function () { router.render(false); });
    }
  };
})(window.SAD);
