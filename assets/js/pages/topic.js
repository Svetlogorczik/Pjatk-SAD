/*
 * pages/topic.js — a lecture: text, table of contents, cheat-sheet button, link to exercises.
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;
  var pages = SAD.pages;

  function neighbours(tp) {
    var i = SAD.topics.indexOf(tp);
    return { prev: SAD.topics[i - 1], next: SAD.topics[i + 1] };
  }

  pages.kicker = function (tp, extra) {
    var t = SAD.i18n.t;
    var items = [pages.topicLabel(tp), t('topic.lecture', { w: tp.lecture }),
      tp.classes ? t('topic.exercises', { c: tp.classes }) : t('topic.noExercises')];
    if (extra) { items.push(extra); }
    return '<div class="page__kicker">' + items.map(function (s) {
      return '<span class="page__kicker-item">' + esc(s) + '</span>';
    }).join('') + '</div>';
  };

  pages.pager = function (tp, suffix) {
    var t = SAD.i18n.t;
    var n = neighbours(tp);
    var html = '<nav class="pager" aria-label="pager">';
    if (n.prev) {
      html += '<a class="pager__link" href="#/topic/' + n.prev.id + (suffix || '') + '"><span class="pager__dir">← ' + esc(t('topic.prev')) + '</span>' +
        '<span class="pager__title">' + esc(n.prev.num + '. ' + SAD.i18n.pick(n.prev.title)) + '</span></a>';
    }
    if (n.next) {
      html += '<a class="pager__link pager__link--next" href="#/topic/' + n.next.id + (suffix || '') + '"><span class="pager__dir">' + esc(t('topic.next')) + ' →</span>' +
        '<span class="pager__title">' + esc(n.next.num + '. ' + SAD.i18n.pick(n.next.title)) + '</span></a>';
    }
    return html + '</nav>';
  };

  function toc(headings) {
    if (headings.length < 3) { return ''; }
    var open = window.matchMedia('(max-width: 600px)').matches ? '' : ' open';
    return '<details class="toc"' + open + '><summary class="toc__summary">' + esc(SAD.i18n.t('topic.toc')) + '</summary><ol class="toc__list">' +
      headings.map(function (h) {
        return '<li class="toc__item"><a class="toc__link" href="#" data-scroll="' + esc(h.id) + '">' + h.html + '</a></li>';
      }).join('') + '</ol></details>';
  }

  pages.actions = function (tp, data, where) {
    var t = SAD.i18n.t;
    var L = SAD.i18n.pick(data);
    var count = (L.exercises || []).length;
    var html = '<div class="action-bar' + (where === 'end' ? ' action-bar--end' : '') + '">';
    html += '<button type="button" class="btn btn--primary" data-open-cheatsheet="' + tp.id + '">' + esc(t('topic.cheatsheet')) + '</button>';
    if (where === 'exercises') {
      html += '<a class="btn" href="#/topic/' + tp.id + '">' + esc(t('topic.toLecture')) + '</a>';
    } else if (count) {
      html += '<a class="btn" href="#/topic/' + tp.id + '/exercises">' + esc(t('topic.toExercises', { n: count })) + '</a>';
    }
    if (where === 'top') {
      var done = SAD.storage.get('done', {});
      html += '<span class="action-bar__spacer"></span><label class="action-bar__check"><input type="checkbox" data-done="' + tp.id + '"' +
        (done[tp.id] ? ' checked' : '') + '> ' + esc(t('topic.done')) + '</label>';
    }
    return html + '</div>';
  };

  pages.topic = function (view, params) {
    var tp = SAD.topicById(params.id);
    if (!tp) { return pages.notFound(view); }
    pages.loading(view);
    return SAD.loader.topic(tp.id).then(function (data) {
      var L = SAD.i18n.pick(data);
      var ctx = { data: data, headings: [] };
      var body = SAD.markup.render(L.lecture, ctx);
      view.className = 'page';
      view.innerHTML = pages.kicker(tp) +
        '<h1 class="page__title">' + esc(SAD.i18n.pick(tp.title)) + '</h1>' +
        (L.lead ? '<p class="page__lead">' + SAD.markup.inline(L.lead) + '</p>' : '') +
        pages.actions(tp, data, 'top') +
        toc(ctx.headings) +
        '<article class="prose">' + body + '</article>' +
        pages.actions(tp, data, 'end') +
        pages.pager(tp);
      document.title = SAD.i18n.pick(tp.title) + ' — SAD';
      pages.hydrate(view);
    });
  };

  // delegated handlers: TOC scrolling, cheat sheet, "done" checkbox
  document.addEventListener('click', function (e) {
    var sc = e.target.closest('[data-scroll]');
    if (sc) {
      e.preventDefault();
      var target = document.getElementById(sc.getAttribute('data-scroll'));
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      return;
    }
    var cs = e.target.closest('[data-open-cheatsheet]');
    if (cs) {
      var id = cs.getAttribute('data-open-cheatsheet');
      SAD.loader.topic(id).then(function (data) { SAD.cheatsheet.open(SAD.topicById(id), data, cs); });
    }
  });

  document.addEventListener('change', function (e) {
    var cb = e.target.closest('[data-done]');
    if (!cb) { return; }
    var done = SAD.storage.get('done', {});
    if (cb.checked) { done[cb.getAttribute('data-done')] = true; } else { delete done[cb.getAttribute('data-done')]; }
    SAD.storage.set('done', done);
    SAD.emit('done-changed');
  });
})(window.SAD);
