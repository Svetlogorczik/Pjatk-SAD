/*
 * tasks.js — exercise cards (statement, hint, full solution, answer).
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;
  var t = function (k, v) { return SAD.i18n.t(k, v); };

  function one(task, index, ctx) {
    var md = function (s) { return SAD.markup.render(s || '', ctx); };
    var head = '<header class="task__head">' +
      '<span class="task__num">' + esc(task.num || index + 1) + '</span>' +
      '<h3 class="task__title">' + SAD.markup.inline(task.title || t('task.task', { n: index + 1 })) + '</h3>' +
      (task.tag ? '<span class="badge badge--lecture" title="' + esc(t('task.tagTitle')) + '">' + esc(task.tag) + '</span>' : '') +
      (task.own ? '<span class="badge badge--own" title="' + esc(t('badge.ownTitle')) + '">✎ ' + esc(t('task.ownTag')) + '</span>' : '') +
      (task.points ? '<span class="task__points">' + esc(t('task.points', { n: task.points })) + '</span>' : '') +
      '</header>';
    var body = '<div class="task__body prose">' + md(task.text) + '</div>';
    var hint = task.hint ? '<details class="task__reveal task__reveal--hint"><summary>' + esc(t('task.hint')) + '</summary>' +
      '<div class="task__reveal-body prose">' + md(task.hint) + '</div></details>' : '';
    var answer = task.answer ? '<div class="task__answer"><span class="task__answer-label">' + esc(t('task.answer')) + '</span>' +
      '<div class="prose">' + md(task.answer) + '</div></div>' : '';
    var sol = task.solution ? '<details class="task__reveal task__reveal--solution"><summary>' + esc(t('task.solution')) + '</summary>' +
      '<div class="task__reveal-body prose">' + md(task.solution) + answer + '</div></details>' : '';
    return '<article class="task" id="task-' + esc(task.id || index + 1) + '">' + head + body + hint + sol + '</article>';
  }

  function list(tasks, ctx) {
    return '<div class="task-list">' +
      '<div class="task-list__tools">' +
        '<button type="button" class="btn btn--sm" data-tasks="open">' + esc(t('task.showAll')) + '</button>' +
        '<button type="button" class="btn btn--sm" data-tasks="close">' + esc(t('task.hideAll')) + '</button>' +
      '</div>' +
      tasks.map(function (task, i) { return one(task, i, ctx); }).join('') +
      '</div>';
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-tasks]');
    if (!btn) { return; }
    var open = btn.getAttribute('data-tasks') === 'open';
    var root = btn.closest('.task-list');
    SAD.util.qsa('.task__reveal--solution, .task__reveal--hint', root).forEach(function (d) { d.open = open; });
  });

  SAD.tasks = { list: list, one: one };
})(window.SAD);
