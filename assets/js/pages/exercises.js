/*
 * pages/exercises.js — exercise list of a topic (author's problems modelled on the class lists).
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;
  var pages = SAD.pages;

  pages.exercises = function (view, params) {
    var tp = SAD.topicById(params.id);
    if (!tp) { return pages.notFound(view); }
    pages.loading(view);
    return SAD.loader.topic(tp.id).then(function (data) {
      var t = SAD.i18n.t;
      var L = SAD.i18n.pick(data);
      var title = SAD.i18n.pick(tp.title);
      var intro = tp.classes ? t('ex.intro', { c: tp.classes }) : t('ex.introOwn');
      if (L.exIntro) { intro += '\n\n' + L.exIntro; }
      view.className = 'page';
      view.innerHTML = pages.kicker(tp) +
        '<h1 class="page__title">' + esc(t('ex.title', { title: title })) + '</h1>' +
        '<div class="prose">' + SAD.markup.render('::: own\n' + intro + '\n:::', { data: data }) + '</div>' +
        pages.actions(tp, data, 'exercises') +
        SAD.tasks.list(L.exercises || [], { data: data }) +
        pages.actions(tp, data, 'exercises') +
        pages.pager(tp, '/exercises');
      document.title = t('ex.title', { title: title }) + ' — SAD';
      pages.hydrate(view);
    });
  };
})(window.SAD);
