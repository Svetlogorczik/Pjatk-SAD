/*
 * sidebar.js — main navigation (rendered from the topic registry) + mobile drawer.
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;

  function link(href, label, num, done) {
    return '<li><a class="sidebar__link" href="' + href + '">' +
      (num !== undefined ? '<span class="sidebar__num">' + esc(num) + '</span>' : '') +
      '<span>' + esc(label) + '</span>' +
      (done ? '<span class="sidebar__done" aria-label="✓">✓</span>' : '') + '</a></li>';
  }

  function render() {
    var nav = document.getElementById('sidebar');
    if (!nav) { return; }
    var t = SAD.i18n.t;
    var done = SAD.storage.get('done', {});
    var html = '';

    html += '<div class="sidebar__group"><ul class="sidebar__list">' +
      link('#/', t('nav.home'), '⌂') +
      link('#/course', t('nav.course'), '★') +
      '</ul></div>';

    html += '<div class="sidebar__group"><h2 class="sidebar__heading">' + esc(t('nav.topics')) + '</h2><ul class="sidebar__list">' +
      SAD.topics.map(function (tp) {
        return link('#/topic/' + tp.id, SAD.i18n.pick(tp.title), tp.num, done[tp.id]);
      }).join('') + '</ul></div>';

    html += '<div class="sidebar__group"><h2 class="sidebar__heading">' + esc(t('nav.practice')) + '</h2><ul class="sidebar__list">' +
      link('#/colloquium/1', t('nav.kol1'), 'K1') +
      link('#/colloquium/2', t('nav.kol2'), 'K2') +
      link('#/tables', t('nav.tables'), 'Φ') +
      '</ul></div>';

    html += '<div class="sidebar__group"><h2 class="sidebar__heading">' + esc(t('nav.more')) + '</h2><ul class="sidebar__list">' +
      link('#/tips', t('nav.tips'), '✎') +
      link('#/excel', t('nav.excel'), 'fx') +
      link('#/about', t('nav.about'), 'i') +
      '</ul></div>';

    nav.innerHTML = html;
    highlight();
  }

  function highlight() {
    var path = SAD.router.path();
    SAD.util.qsa('.sidebar__link').forEach(function (a) {
      var href = a.getAttribute('href').slice(1);
      var active = href === path || (href !== '/' && path.indexOf(href + '/') === 0);
      a.classList.toggle('sidebar__link--active', active);
      if (active) { a.setAttribute('aria-current', 'page'); } else { a.removeAttribute('aria-current'); }
    });
  }

  function setOpen(open) {
    var nav = document.getElementById('sidebar');
    var btn = document.getElementById('menu-toggle');
    var bd = document.getElementById('backdrop');
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    bd.hidden = !open;
  }

  SAD.sidebar = {
    render: render,
    highlight: highlight,
    init: function () {
      document.getElementById('menu-toggle').addEventListener('click', function () {
        setOpen(!document.getElementById('sidebar').classList.contains('is-open'));
      });
      document.getElementById('backdrop').addEventListener('click', function () { setOpen(false); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { setOpen(false); } });
      SAD.on('routed', function () { setOpen(false); highlight(); });
      SAD.on('lang', render);
      SAD.on('done-changed', render);
      render();
    }
  };
})(window.SAD);
