/*
 * code-block.js — renders code fences and handles "copy" and Excel EN/PL switching.
 * Python blocks are automatically marked as an author's addition (the course uses Excel).
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;
  var t = function (k) { return SAD.i18n.t(k); };

  function excelLang() { return SAD.storage.get('excelLang', 'en'); }

  function html(block) {
    var lang = (block.lang || 'text').toLowerCase();
    var head = '<span class="code-block__lang">' + esc(lang === 'excel' ? 'Excel' : lang) + '</span>';
    if (block.title) { head += '<span class="code-block__title">' + esc(block.title) + '</span>'; }
    if (lang === 'python') {
      head += '<span class="badge badge--own" title="' + esc(t('badge.ownTitle')) + '">✎ ' + esc(t('badge.pythonOwn')) + '</span>';
    }

    var tools = '';
    var panes = '';
    var note = '';

    if (lang === 'excel') {
      var cur = excelLang();
      var en = SAD.highlight.excel(block.src, false);
      var pl = SAD.highlight.excel(block.src, true);
      tools += '<div class="segmented segmented--sm" role="group" aria-label="' + esc(t('excel.switch')) + '">' +
        '<button type="button" class="segmented__item' + (cur === 'en' ? ' segmented__item--active' : '') + '" data-excel-lang="en" title="' + esc(t('excel.en')) + '">EN</button>' +
        '<button type="button" class="segmented__item' + (cur === 'pl' ? ' segmented__item--active' : '') + '" data-excel-lang="pl" title="' + esc(t('excel.pl')) + '">PL</button></div>';
      panes += '<pre class="code-block__pre" data-pane="en"' + (cur === 'en' ? '' : ' hidden') + ' data-copy="' + esc(en.copy) + '"><code class="code-block__code">' + en.html + '</code></pre>';
      panes += '<pre class="code-block__pre" data-pane="pl"' + (cur === 'pl' ? '' : ' hidden') + ' data-copy="' + esc(pl.copy) + '"><code class="code-block__code">' + pl.html + '</code></pre>';
      note = '<div class="code-block__note">' + esc(t('excel.note')) + '</div>';
    } else {
      var body = lang === 'python' ? SAD.highlight.python(block.src) : esc(block.src);
      panes += '<pre class="code-block__pre" data-pane="main" data-copy="' + esc(block.src) + '"><code class="code-block__code">' + body + '</code></pre>';
      if (lang === 'python') { note = '<div class="code-block__note">' + esc(t('python.note')) + '</div>'; }
    }

    tools += '<button type="button" class="btn btn--sm code-block__copy">' + esc(t('btn.copy')) + '</button>';

    return '<figure class="code-block code-block--' + esc(lang) + '">' +
      '<figcaption class="code-block__head">' + head + '<div class="code-block__tools">' + tools + '</div></figcaption>' +
      panes + note + '</figure>';
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(); } catch (e) { reject(e); }
      ta.remove();
    });
  }

  function setExcelLang(lang) {
    SAD.storage.set('excelLang', lang);
    SAD.util.qsa('.code-block--excel').forEach(function (fig) {
      SAD.util.qsa('[data-pane]', fig).forEach(function (p) { p.hidden = p.getAttribute('data-pane') !== lang; });
      SAD.util.qsa('[data-excel-lang]', fig).forEach(function (b) {
        b.classList.toggle('segmented__item--active', b.getAttribute('data-excel-lang') === lang);
      });
    });
  }

  document.addEventListener('click', function (e) {
    var copyBtn = e.target.closest('.code-block__copy');
    if (copyBtn) {
      var fig = copyBtn.closest('.code-block');
      var pane = SAD.util.qsa('.code-block__pre', fig).filter(function (p) { return !p.hidden; })[0];
      copyText(pane.getAttribute('data-copy')).then(function () {
        copyBtn.textContent = t('btn.copied');
        copyBtn.classList.add('is-copied');
        setTimeout(function () {
          copyBtn.textContent = t('btn.copy');
          copyBtn.classList.remove('is-copied');
        }, 1600);
      }, function () {
        copyBtn.textContent = t('btn.copyFail');
      });
      return;
    }
    var xl = e.target.closest('[data-excel-lang]');
    if (xl) { setExcelLang(xl.getAttribute('data-excel-lang')); }
  });

  SAD.codeBlock = { html: html };
})(window.SAD);
