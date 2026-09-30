/*
 * cheatsheet.js — modal with the short summary ("konspekt") of a topic. Printable.
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;
  var dialog;
  var lastTrigger = null;

  function close() {
    if (!dialog) { return; }
    if (dialog.close && dialog.open) { dialog.close(); } else { dialog.removeAttribute('open'); }
    if (lastTrigger) { lastTrigger.focus(); }
  }

  function open(meta, data, trigger) {
    dialog = dialog || document.getElementById('cheatsheet');
    lastTrigger = trigger || null;
    var content = SAD.i18n.pick(data)[ 'cheatsheet' ] || '';
    var ctx = { data: data, idPrefix: 'cs-' };
    dialog.innerHTML =
      '<header class="cheatsheet__head">' +
        '<div><span class="cheatsheet__kicker">' + esc(SAD.i18n.t('cheatsheet.kicker', { n: meta.num })) + '</span>' +
        '<h2 class="cheatsheet__title" id="cheatsheet-title">' + esc(SAD.i18n.pick(meta.title)) + '</h2></div>' +
        '<div class="cheatsheet__tools">' +
          '<button type="button" class="btn btn--sm" data-cs="print">' + esc(SAD.i18n.t('btn.print')) + '</button>' +
          '<button type="button" class="btn btn--sm btn--primary" data-cs="close">' + esc(SAD.i18n.t('btn.close')) + '</button>' +
        '</div>' +
      '</header>' +
      '<div class="cheatsheet__body prose">' + SAD.markup.render(content, ctx) + '</div>';
    SAD.math.renderIn(dialog);
    if (dialog.showModal) { dialog.showModal(); } else { dialog.setAttribute('open', ''); }
    var closeBtn = dialog.querySelector('[data-cs="close"]');
    if (closeBtn) { closeBtn.focus(); }
  }

  document.addEventListener('click', function (e) {
    if (!dialog) { return; }
    var btn = e.target.closest('[data-cs]');
    if (btn && dialog.contains(btn)) {
      if (btn.getAttribute('data-cs') === 'close') { close(); }
      if (btn.getAttribute('data-cs') === 'print') {
        document.body.classList.add('is-printing-cheatsheet');
        window.print();
      }
      return;
    }
    // click on the backdrop closes the dialog
    if (e.target === dialog) { close(); }
  });

  window.addEventListener('afterprint', function () {
    document.body.classList.remove('is-printing-cheatsheet');
  });

  // the router re-renders on language change — close a stale dialog
  SAD.on('routed', function () { if (dialog && dialog.open) { close(); } });

  SAD.cheatsheet = { open: open, close: close };
})(window.SAD);
