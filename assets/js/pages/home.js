/*
 * pages/home.js — landing page + shared page helpers.
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;
  var pages = SAD.pages = SAD.pages || {};

  // shared helpers ----------------------------------------------------------

  pages.hydrate = function (root) {
    SAD.math.renderIn(root);
    SAD.widgets.hydrate(root);
  };

  pages.loading = function (view) {
    view.className = 'page page--loading';
    view.innerHTML = '<p class="page__status">' + esc(SAD.i18n.t('loading')) + '</p>';
  };

  pages.notFound = function (view) {
    view.className = 'page';
    view.innerHTML = '<h1 class="page__title">' + esc(SAD.i18n.t('notfound.title')) + '</h1>' +
      '<p><a href="#/">' + esc(SAD.i18n.t('notfound.text')) + '</a></p>';
    document.title = SAD.i18n.t('notfound.title') + ' — SAD';
  };

  // Static markup page (course rules, tips, about, excel, tables)
  pages.markupPage = function (view, key, wide) {
    var c = SAD.i18n.pick(SAD.content[key]);
    view.className = 'page' + (wide ? ' page--wide' : '');
    view.innerHTML =
      (c.kicker ? '<div class="page__kicker"><span class="page__kicker-item">' + esc(c.kicker) + '</span></div>' : '') +
      '<h1 class="page__title">' + SAD.markup.inline(c.title) + '</h1>' +
      (c.lead ? '<p class="page__lead">' + SAD.markup.inline(c.lead) + '</p>' : '') +
      '<div class="prose">' + SAD.markup.render(c.body, { data: SAD.content[key] }) + '</div>';
    document.title = c.title + ' — SAD';
    pages.hydrate(view);
  };

  pages.topicLabel = function (tp) {
    return SAD.i18n.t('topic.kicker', { n: tp.num });
  };

  // home --------------------------------------------------------------------

  pages.home = function (view) {
    var c = SAD.i18n.pick(SAD.content.home);
    var t = SAD.i18n.t;
    var done = SAD.storage.get('done', {});
    view.className = 'page page--wide';

    var cards = SAD.topics.map(function (tp) {
      var isDone = !!done[tp.id];
      return '<a class="card' + (isDone ? ' card--done' : '') + '" href="#/topic/' + tp.id + '">' +
        (isDone ? '<span class="card__done" title="' + esc(t('topic.done')) + '">✓</span>' : '') +
        '<span class="card__icon" aria-hidden="true">' + tp.icon + '</span>' +
        '<span class="card__num">' + esc(pages.topicLabel(tp)) + '</span>' +
        '<h3 class="card__title">' + esc(SAD.i18n.pick(tp.title)) + '</h3>' +
        '<p class="card__text">' + esc(SAD.i18n.pick(tp.short)) + '</p>' +
        '<span class="card__meta"><span class="badge badge--lecture">' + esc(tp.lecture) + '</span>' +
        (tp.classes ? '<span class="badge">' + esc(tp.classes) + '</span>' : '<span class="badge badge--own">✎</span>') + '</span></a>';
    }).join('');

    var practice = c.practice.map(function (p) {
      return '<a class="card" href="' + p.href + '"><span class="card__icon" aria-hidden="true">' + p.icon + '</span>' +
        '<h3 class="card__title">' + esc(p.title) + '</h3><p class="card__text">' + esc(p.text) + '</p></a>';
    }).join('');

    view.innerHTML =
      '<section class="card card--hero">' +
        '<span class="card__num">' + esc(c.kicker) + '</span>' +
        '<h1 class="card__title">' + esc(c.title) + '</h1>' +
        '<div class="prose">' + SAD.markup.render(c.intro, {}) + '</div>' +
        '<div class="action-bar">' +
          '<a class="btn btn--primary" href="#/course">' + esc(c.ctaCourse) + '</a>' +
          '<a class="btn" href="#/topic/t01">' + esc(c.ctaStart) + '</a>' +
          '<a class="btn btn--ghost" href="#/tables">' + esc(t('nav.tables')) + '</a>' +
        '</div>' +
      '</section>' +
      '<section class="page__section"><div class="prose">' + SAD.markup.render(c.news, {}) + '</div></section>' +
      '<section class="page__section"><h2 class="page__section-title">' + esc(c.topicsTitle) + '</h2>' +
        '<div class="card-grid">' + cards + '</div></section>' +
      '<section class="page__section"><h2 class="page__section-title">' + esc(c.practiceTitle) + '</h2>' +
        '<div class="card-grid">' + practice + '</div></section>' +
      '<section class="page__section"><div class="prose">' + SAD.markup.render(c.legend, {}) + '</div></section>';

    document.title = 'SAD — ' + t('site.subtitle');
    pages.hydrate(view);
  };
})(window.SAD);
