/*
 * markup.js — a small Markdown dialect used for all lecture / exercise content.
 *
 * Blocks
 *   # / ## / ###            headings (h2 / h3 / h4); "{own}" at the end adds the author's-addition badge
 *   - item / 1. item        lists (one nested level with 2+ spaces of indentation)
 *   | a | b |               tables (second row = separator |---|---:|)
 *   ~~~excel Title          code fences (excel, python, text); closed with ~~~
 *   $$ … $$                 display formulas (KaTeX)
 *   ::: type flags | Title  callouts: def, note, tip, warn, example, own, intuition, formula,
 *   :::                     summary, steps, grid (layout only). Flags: "own" or a lecture id like "W03".
 *   @chart id  @svg id  @widget name args
 *   ---                     horizontal rule
 * Inline
 *   **bold**  *italic*  ‹code›  $formula$  [text](href)  {own}  {lecture:W03}
 *
 * Content is written with SAD.md`…` (String.raw), so TeX backslashes stay intact.
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;
  var NUL = '\u0000';

  function dedent(lines) {
    var min = Infinity;
    lines.forEach(function (l) {
      if (l.trim()) { min = Math.min(min, l.match(/^[ \t]*/)[0].length); }
    });
    if (!isFinite(min) || min === 0) { return lines; }
    return lines.map(function (l) { return l.slice(min); });
  }

  /* ---------- inline ---------- */

  function inline(text, ctx, store) {
    var local = [];
    function keep(html) { local.push(html); return NUL + 'I' + (local.length - 1) + NUL; }

    // code spans ‹…›
    text = text.replace(/‹([^›]+)›/g, function (m, code) { return keep('<code>' + esc(code) + '</code>'); });
    // placeholders for display math that ended up inline
    text = text.replace(new RegExp(NUL + 'D(\\d+)' + NUL, 'g'), function (m, i) {
      return keep(mathHtml(store.math[+i].tex, true));
    });
    // inline math $…$
    text = text.replace(/\$([^$\n]+?)\$/g, function (m, tex) { return keep(mathHtml(tex, false)); });

    text = esc(text).replace(new RegExp(NUL + 'BR' + NUL + '\\s*', 'g'), '<br>');

    text = text
      .replace(/\{own\}/g, function () { return keep(ownBadge()); })
      .replace(/\{(ok|doc|ask)\}/g, function (m, kind) {
        var cls = { ok: 'badge--ok', doc: 'badge--doc', ask: 'badge--warn' }[kind];
        return keep('<span class="badge ' + cls + '" title="' + esc(SAD.i18n.t('badge.' + kind + 'Title')) + '">' +
          esc(SAD.i18n.t('badge.' + kind)) + '</span>');
      })
      .replace(/\{lecture:([\w\-–]+)\}/g, function (m, id) { return keep(lectureBadge(id)); })
      .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^\w*])\*(?!\s)([^*\n]+?)\*(?!\w)/g, '$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, href) {
        var ext = /^https?:/.test(href);
        return '<a href="' + href + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + label + '</a>';
      });

    // restore kept fragments (may be nested once)
    for (var pass = 0; pass < 2; pass++) {
      text = text.replace(new RegExp(NUL + 'I(\\d+)' + NUL, 'g'), function (m, i) { return local[+i]; });
    }
    return text;
  }

  function mathHtml(tex, display) {
    var t = esc(tex.trim());
    return display
      ? '<div class="math-block" data-tex="' + t + '">' + t + '</div>'
      : '<span class="math" data-tex="' + t + '">' + t + '</span>';
  }

  function ownBadge() {
    return '<span class="badge badge--own" title="' + esc(SAD.i18n.t('badge.ownTitle')) + '">✎ ' +
      esc(SAD.i18n.t('badge.own')) + '</span>';
  }

  function lectureBadge(id) {
    var isClass = /^C/.test(id);
    return '<span class="badge badge--lecture" title="' + esc(SAD.i18n.t(isClass ? 'badge.classesTitle' : 'badge.lectureTitle')) + '">' +
      esc(SAD.i18n.t(isClass ? 'badge.classes' : 'badge.lecture', { id: id })) + '</span>';
  }

  /* ---------- blocks ---------- */

  function heading(level, text, ctx, store) {
    var own = /\s*\{own\}\s*$/.test(text);
    text = text.replace(/\s*\{own\}\s*$/, '');
    var plain = text.replace(/\$[^$]*\$/g, '').replace(/[*‹›]/g, '');
    var id = SAD.util.slug(plain);
    ctx.ids = ctx.ids || {};
    if (ctx.ids[id]) { id += '-' + (++ctx.ids[id]); } else { ctx.ids[id] = 1; }
    var tag = 'h' + (level + 1);
    if (level === 1 && ctx.headings) { ctx.headings.push({ id: id, html: inline(text, ctx, store) }); }
    return '<' + tag + ' id="' + (ctx.idPrefix || '') + id + '">' + inline(text, ctx, store) +
      (own ? ownBadge() : '') + '</' + tag + '>';
  }

  function table(rows, ctx, store) {
    function cells(row) {
      return row.replace(/^\|/, '').replace(/\|\s*$/, '').split('|').map(function (c) { return c.trim(); });
    }
    var head = cells(rows[0]);
    var align = [];
    var body = rows.slice(1);
    if (body.length && /^\|?\s*:?-{2,}/.test(body[0])) {
      align = cells(body[0]).map(function (c) { return /:$/.test(c) ? 'right' : (/^:/.test(c) ? 'center' : ''); });
      body = body.slice(1);
    }
    function cell(tag, c, i) {
      var a = align[i] ? ' style="text-align:' + align[i] + '"' : '';
      return '<' + tag + a + '>' + inline(c, ctx, store) + '</' + tag + '>';
    }
    return '<div class="data-table"><table class="data-table__table"><thead><tr>' +
      head.map(function (c, i) { return cell('th', c, i); }).join('') + '</tr></thead><tbody>' +
      body.map(function (r) {
        return '<tr>' + cells(r).map(function (c, i) { return cell('td', c, i); }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  var LIST_RE = /^([-*]|\d+[.)])\s+/;

  function list(lines, start, ctx, store) {
    var first = lines[start].trim();
    var ordered = /^\d/.test(first);
    var items = [];
    var i = start;
    while (i < lines.length) {
      var raw = lines[i];
      var t = raw.trim();
      var indent = raw.match(/^\s*/)[0].length;
      if (!t) {
        // a blank line ends the list unless the next line continues it
        var next = lines[i + 1] || '';
        if (LIST_RE.test(next.trim()) && /^\d/.test(next.trim()) === ordered && next.match(/^\s*/)[0].length === 0) { i++; continue; }
        break;
      }
      if (indent === 0 && LIST_RE.test(t)) {
        if (/^\d/.test(t) !== ordered) { break; }
        items.push({ text: t.replace(LIST_RE, ''), sub: [] });
      } else if (indent >= 2 && LIST_RE.test(t) && items.length) {
        items[items.length - 1].sub.push(t);
      } else if (indent >= 2 && items.length) {
        var it = items[items.length - 1];
        if (it.sub.length) { it.sub[it.sub.length - 1] += ' ' + t; } else { it.text += ' ' + t; }
      } else {
        break;
      }
      i++;
    }
    var tag = ordered ? 'ol' : 'ul';
    var html = '<' + tag + '>' + items.map(function (it) {
      var sub = '';
      if (it.sub.length) {
        var subOrdered = /^\d/.test(it.sub[0]);
        var st = subOrdered ? 'ol' : 'ul';
        sub = '<' + st + '>' + it.sub.map(function (s) { return '<li>' + inline(s.replace(LIST_RE, ''), ctx, store) + '</li>'; }).join('') + '</' + st + '>';
      }
      return '<li>' + inline(it.text, ctx, store) + sub + '</li>';
    }).join('') + '</' + tag + '>';
    return { html: html, next: i };
  }

  var COLLAPSIBLE = ['example', 'intuition', 'own', 'note'];

  function container(type, rest, innerHtml, ctx, store) {
    if (type === 'grid') { return '<div class="prose__grid">' + innerHtml + '</div>'; }
    var flags = [];
    var title = rest.trim();
    if (rest.indexOf('|') >= 0) {
      var parts = rest.split('|');
      flags = parts[0].trim().split(/\s+/).filter(Boolean);
      title = parts.slice(1).join('|').trim();
    }
    var badges = '';
    if (type !== 'own' && (flags.indexOf('own') >= 0 || type === 'intuition')) { badges += ownBadge(); }
    flags.forEach(function (f) { if (/^W\d/.test(f)) { badges += lectureBadge(f); } });
    // secondary callouts collapse on phones so the key content stays visible (see callout.css)
    var fold = COLLAPSIBLE.indexOf(type) >= 0;
    return '<aside class="callout callout--' + esc(type) + (fold ? ' callout--collapsible' : '') + '">' +
      '<div class="callout__head"><span class="callout__label">' + esc(SAD.i18n.t('callout.' + type)) + '</span>' +
      (title ? '<span class="callout__title">' + inline(title, ctx, store) + '</span>' : '') + badges +
      (fold ? '<button type="button" class="callout__toggle" aria-expanded="false" data-show="' + esc(SAD.i18n.t('callout.show')) +
        '" data-hide="' + esc(SAD.i18n.t('callout.hide')) + '">' + esc(SAD.i18n.t('callout.show')) + '</button>' : '') + '</div>' +
      '<div class="callout__body">' + innerHtml + '</div></aside>';
  }

  function directive(kind, id, arg, ctx) {
    var data = ctx.data || {};
    if (kind === 'chart') {
      var spec = data.charts && data.charts[id];
      return spec ? SAD.charts.figure(spec) : '<!-- missing chart ' + esc(id) + ' -->';
    }
    if (kind === 'svg') {
      var d = data.svg && data.svg[id];
      if (!d) { return '<!-- missing svg ' + esc(id) + ' -->'; }
      var svg = SAD.i18n.pick(typeof d === 'string' ? d : d.svg);
      var cap = typeof d === 'string' ? '' : SAD.i18n.pick(d.caption);
      return '<figure class="chart prose__figure">' + svg +
        (cap ? '<figcaption class="chart__caption">' + esc(cap) + '</figcaption>' : '') + '</figure>';
    }
    if (kind === 'widget') {
      return '<div class="widget" data-widget="' + esc(id) + '" data-args="' + esc(arg) + '"></div>';
    }
    return '';
  }

  function blocks(lines, ctx, store) {
    lines = dedent(lines);
    var out = [];
    var para = [];
    var i = 0;
    var m;

    function flush() {
      if (para.length) {
        out.push('<p>' + inline(para.join(' '), ctx, store) + '</p>');
        para = [];
      }
    }

    while (i < lines.length) {
      var line = lines[i];
      var t = line.trim();

      if (!t) { flush(); i++; continue; }

      if ((m = t.match(/^:::\s*([\w-]+)\s*(.*)$/))) {
        flush();
        var depth = 1;
        var j = i + 1;
        var inner = [];
        for (; j < lines.length; j++) {
          var tj = lines[j].trim();
          if (/^:::\s*[\w-]+/.test(tj)) { depth++; }
          else if (tj === ':::') { depth--; if (depth === 0) { break; } }
          inner.push(lines[j]);
        }
        out.push(container(m[1], m[2], blocks(inner, ctx, store), ctx, store));
        i = j + 1;
        continue;
      }

      if ((m = t.match(new RegExp('^' + NUL + 'C(\\d+)' + NUL + '$')))) {
        flush();
        out.push(SAD.codeBlock.html(store.code[+m[1]]));
        i++;
        continue;
      }

      if ((m = t.match(new RegExp('^' + NUL + 'D(\\d+)' + NUL + '$')))) {
        flush();
        out.push(mathHtml(store.math[+m[1]].tex, true));
        i++;
        continue;
      }

      if ((m = t.match(/^(#{1,3})\s+(.*)$/))) {
        flush();
        out.push(heading(m[1].length, m[2], ctx, store));
        i++;
        continue;
      }

      if (t === '---') { flush(); out.push('<hr>'); i++; continue; }

      if ((m = t.match(/^@(chart|svg|widget)\s+([\w-]+)\s*(.*)$/))) {
        flush();
        out.push(directive(m[1], m[2], m[3], ctx));
        i++;
        continue;
      }

      if (t.charAt(0) === '|') {
        flush();
        var rows = [];
        while (i < lines.length && lines[i].trim().charAt(0) === '|') { rows.push(lines[i].trim()); i++; }
        out.push(table(rows, ctx, store));
        continue;
      }

      if (LIST_RE.test(t) && line.match(/^\s*/)[0].length === 0) {
        flush();
        var res = list(lines, i, ctx, store);
        out.push(res.html);
        i = res.next;
        continue;
      }

      // a trailing "\\" forces a line break inside a paragraph
      para.push(t.replace(/\s*\\\\$/, NUL + 'BR' + NUL));
      i++;
    }
    flush();
    return out.join('\n');
  }

  /**
   * render(src, ctx) → HTML
   * ctx.data      topic data object (charts / svg lookups)
   * ctx.headings  array to collect h2 headings (for the table of contents)
   */
  function render(src, ctx) {
    ctx = ctx || {};
    var store = { code: [], math: [] };
    src = String(src || '').replace(/\r\n?/g, '\n');

    src = src.replace(/^[ \t]*~~~([\w-]*)[ \t]*([^\n]*)\n([\s\S]*?)\n[ \t]*~~~[ \t]*$/gm, function (m, lang, title, body) {
      store.code.push({ lang: lang || 'text', title: title.trim(), src: dedent(body.split('\n')).join('\n') });
      return NUL + 'C' + (store.code.length - 1) + NUL;
    });

    src = src.replace(/\$\$([\s\S]+?)\$\$/g, function (m, tex) {
      store.math.push({ tex: tex });
      return NUL + 'D' + (store.math.length - 1) + NUL;
    });

    return blocks(src.split('\n'), ctx, store);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.callout__toggle');
    if (!btn) { return; }
    var open = btn.closest('.callout').classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = btn.getAttribute(open ? 'data-hide' : 'data-show');
  });

  SAD.markup = {
    render: render,
    inline: function (text) { return inline(text, {}, { code: [], math: [] }); }
  };
})(window.SAD);
