/*
 * app.js — bootstrap: language, theme, routes, sidebar, footer.
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;
  var P = SAD.pages;

  SAD.router.add('home', '/', P.home);
  SAD.router.add('course', '/course', P.course);
  SAD.router.add('topic', '/topic/:id', P.topic);
  SAD.router.add('exercises', '/topic/:id/exercises', P.exercises);
  SAD.router.add('colloquium', '/colloquium/:n', P.colloquium);
  SAD.router.add('tables', '/tables', P.tables);
  SAD.router.add('tips', '/tips', P.tips);
  SAD.router.add('excel', '/excel', P.excel);
  SAD.router.add('about', '/about', P.about);

  function footer() {
    var f = document.getElementById('footer');
    if (!f) { return; }
    f.innerHTML = '<div class="footer__inner"><p class="footer__text">' + esc(SAD.i18n.t('site.footer')) + '</p>' +
      '<p class="footer__text">' + esc(SAD.i18n.t('site.footer2')) + '</p></div>';
  }

  function start() {
    SAD.i18n.init();
    SAD.i18n.applyStatic();
    SAD.theme.init();
    SAD.router.init();
    SAD.sidebar.init();
    footer();

    SAD.on('lang', function () {
      footer();
      SAD.router.render(true);
    });

    SAD.router.render(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(window.SAD);
