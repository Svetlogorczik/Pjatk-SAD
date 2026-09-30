/*
 * pages/colloquium.js — practice tests (author's sets modelled on the sample tests).
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;
  var pages = SAD.pages;

  pages.colloquium = function (view, params) {
    var n = params.n;
    if (n !== '1' && n !== '2') { return pages.notFound(view); }
    pages.loading(view);
    return SAD.loader.data('colloquia').then(function (all) {
      var set = all[n];
      var L = SAD.i18n.pick(set);
      var t = SAD.i18n.t;
      view.className = 'page';
      view.innerHTML =
        '<div class="page__kicker"><span class="page__kicker-item">' + esc(t('kol.kicker', { n: n })) + '</span></div>' +
        '<h1 class="page__title">' + esc(L.title || t('kol.title', { n: n })) + '</h1>' +
        '<div class="prose">' + SAD.markup.render(L.intro, { data: set }) + '</div>' +
        SAD.tasks.list(L.tasks, { data: set });
      document.title = (L.title || t('kol.title', { n: n })) + ' — SAD';
      pages.hydrate(view);
    });
  };
})(window.SAD);
