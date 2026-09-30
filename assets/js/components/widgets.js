/*
 * widgets.js — interactive elements placed in content with "@widget name args":
 *   normal-explorer, clt-dice                      (lectures)
 *   calc-normal, calc-t, calc-chi2, calc-binom, calc-poisson,
 *   table-phi, table-t, table-chi2, table-poisson  (tables page)
 *   points, planner                                (course rules page)
 *   excel-dict                                     (Excel page)
 * All of them are the site author's additions.
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;
  var S = SAD.stats;
  var t = function (k, v) { return SAD.i18n.t(k, v); };
  var num = function (x, d) { return SAD.util.num(x, d); };

  function parse(v) {
    var n = parseFloat(String(v).replace(',', '.').trim());
    return isFinite(n) ? n : NaN;
  }

  function field(name, label, value, attrs) {
    return '<label class="form__field"><span class="form__label">' + label + '</span>' +
      '<input class="form__input" name="' + name + '" value="' + esc(value) + '" inputmode="decimal" autocomplete="off" ' + (attrs || '') + '></label>';
  }

  function form(title, fields, extra) {
    return '<form class="form" onsubmit="return false">' +
      (title ? '<h3 class="form__title">' + esc(title) + '</h3>' : '') +
      '<div class="form__row">' + fields + '</div>' + (extra || '') +
      '<div class="form__result" aria-live="polite"></div></form>';
  }

  function values(el) {
    var out = {};
    SAD.util.qsa('input, select', el).forEach(function (i) { out[i.name] = i.type === 'checkbox' ? i.checked : i.value; });
    return out;
  }

  function live(el, compute) {
    var run = function () {
      var res = el.querySelector('.form__result');
      try { res.innerHTML = compute(values(el), res); } catch (e) { res.innerHTML = '—'; }
      SAD.math.renderIn(res);
    };
    el.addEventListener('input', run);
    el.addEventListener('change', run);
    run();
  }

  function p4(x) { return isFinite(x) ? num(x, 4) : '—'; }

  function tableHtml(head, rows, compact) {
    return '<div class="data-table' + (compact ? ' data-table--compact' : '') + '"><table class="data-table__table"><thead><tr>' +
      head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div>';
  }

  var W = {};

  /* ---------- lecture widgets ---------- */

  W['normal-explorer'] = function (el) {
    el.innerHTML = form(t('w.normal.title'),
      field('mu', 'μ', '0') + field('sigma', 'σ', '1') + field('a', 'a', '-1') + field('b', 'b', '1')) +
      '<div class="widget__chart"></div>';
    var f = el.querySelector('form');
    live(f, function (v) {
      var mu = parse(v.mu), sg = parse(v.sigma), a = parse(v.a), b = parse(v.b);
      if (!(sg > 0) || !(a <= b)) { return t('w.invalid'); }
      var p = S.normCdf(b, mu, sg) - S.normCdf(a, mu, sg);
      el.querySelector('.widget__chart').innerHTML = SAD.charts.figure({
        type: 'pdf', dist: { name: 'normal', mu: mu, sigma: sg }, range: [mu - 4 * sg, mu + 4 * sg],
        shade: [{ from: a, to: b, label: 'P = ' + num(p, 4) }]
      });
      return '<p>' + t('w.normal.z', { za: num((a - mu) / sg, 3), zb: num((b - mu) / sg, 3) }) + '</p>' +
        '<p><strong>P(' + num(a) + ' ≤ X ≤ ' + num(b) + ') = Φ(z_b) − Φ(z_a) = ' + num(p, 4) + '</strong></p>';
    });
  };

  W['clt-dice'] = function (el) {
    el.innerHTML = '<form class="form" onsubmit="return false"><h3 class="form__title">' + esc(t('w.clt.title')) + '</h3>' +
      '<label class="form__field"><span class="form__label">' + esc(t('w.clt.n')) + ': <strong class="widget__n">1</strong></span>' +
      '<input type="range" name="n" min="1" max="30" value="1"></label><div class="widget__chart"></div>' +
      '<p class="form__hint">' + esc(t('w.clt.hint')) + '</p></form>';
    var input = el.querySelector('input');
    var draw = function () {
      var n = +input.value;
      el.querySelector('.widget__n').textContent = n;
      var dist = [1];
      for (var k = 0; k < n; k++) {
        var next = new Array(dist.length + 6).fill(0);
        dist.forEach(function (p, i) { for (var f = 1; f <= 6; f++) { next[i + f] += p / 6; } });
        dist = next;
      }
      var xs = [], ps = [];
      dist.forEach(function (p, s) { if (s >= n) { xs.push(s); ps.push(p); } });
      el.querySelector('.widget__chart').innerHTML = SAD.charts.figure({
        type: 'pmf', dist: { xs: xs, ps: ps }, xLabel: t('w.clt.x'), yLabel: 'P',
        normal: n > 1 ? { mu: 3.5 * n, sigma: Math.sqrt(35 * n / 12) } : null
      });
    };
    input.addEventListener('input', draw);
    draw();
  };

  /* ---------- calculators ---------- */

  W['calc-normal'] = function (el) {
    el.innerHTML = form(t('w.calc.normal'),
      field('mu', 'μ', '0') + field('sigma', 'σ', '1') + field('x', 'x', '1,96') +
      field('a', 'a', '-1') + field('b', 'b', '1') + field('p', t('w.calc.p'), '0,95'));
    live(el.querySelector('form'), function (v) {
      var mu = parse(v.mu), sg = parse(v.sigma), x = parse(v.x), a = parse(v.a), b = parse(v.b), p = parse(v.p);
      if (!(sg > 0)) { return t('w.invalid'); }
      return '<p>P(X ≤ x) = <strong>' + p4(S.normCdf(x, mu, sg)) + '</strong> &nbsp; P(X > x) = <strong>' + p4(1 - S.normCdf(x, mu, sg)) + '</strong></p>' +
        '<p>P(a ≤ X ≤ b) = <strong>' + p4(S.normCdf(b, mu, sg) - S.normCdf(a, mu, sg)) + '</strong></p>' +
        '<p>' + esc(t('w.calc.quantile')) + ' x<sub>p</sub> = <strong>' + p4(S.normInv(p, mu, sg)) + '</strong></p>';
    });
  };

  W['calc-t'] = function (el) {
    el.innerHTML = form(t('w.calc.t'), field('df', t('w.calc.df'), '10') + field('x', 't', '2') + field('p', t('w.calc.p'), '0,975'));
    live(el.querySelector('form'), function (v) {
      var df = parse(v.df), x = parse(v.x), p = parse(v.p);
      if (!(df > 0)) { return t('w.invalid'); }
      return '<p>P(T ≤ t) = <strong>' + p4(S.tCdf(x, df)) + '</strong> &nbsp; P(T > t) = <strong>' + p4(1 - S.tCdf(x, df)) + '</strong></p>' +
        '<p>t<sub>p, df</sub> = <strong>' + p4(S.tInv(p, df)) + '</strong></p>';
    });
  };

  W['calc-chi2'] = function (el) {
    el.innerHTML = form(t('w.calc.chi2'), field('df', t('w.calc.df'), '5') + field('x', 'x', '11,07') + field('p', t('w.calc.p'), '0,95'));
    live(el.querySelector('form'), function (v) {
      var df = parse(v.df), x = parse(v.x), p = parse(v.p);
      if (!(df > 0)) { return t('w.invalid'); }
      return '<p>P(χ² ≤ x) = <strong>' + p4(S.chi2Cdf(x, df)) + '</strong> &nbsp; P(χ² > x) = <strong>' + p4(1 - S.chi2Cdf(x, df)) + '</strong></p>' +
        '<p>χ²<sub>p, df</sub> = <strong>' + p4(S.chi2Inv(p, df)) + '</strong></p>';
    });
  };

  W['calc-binom'] = function (el) {
    el.innerHTML = form(t('w.calc.binom'), field('n', 'n', '10') + field('p', 'p', '0,3') + field('k', 'k', '3'));
    live(el.querySelector('form'), function (v) {
      var n = Math.round(parse(v.n)), p = parse(v.p), k = Math.round(parse(v.k));
      if (!(n > 0) || !(p >= 0 && p <= 1) || n > 5000) { return t('w.invalid'); }
      return '<p>P(X = k) = <strong>' + p4(S.binomPmf(k, n, p)) + '</strong> &nbsp; P(X ≤ k) = <strong>' + p4(S.binomCdf(k, n, p)) +
        '</strong> &nbsp; P(X ≥ k) = <strong>' + p4(1 - S.binomCdf(k - 1, n, p)) + '</strong></p>' +
        '<p>E(X) = np = ' + num(n * p, 4) + ', &nbsp; V(X) = np(1−p) = ' + num(n * p * (1 - p), 4) + '</p>';
    });
  };

  W['calc-poisson'] = function (el) {
    el.innerHTML = form(t('w.calc.poisson'), field('lambda', 'λ', '2') + field('k', 'k', '3'));
    live(el.querySelector('form'), function (v) {
      var l = parse(v.lambda), k = Math.round(parse(v.k));
      if (!(l > 0) || k < 0) { return t('w.invalid'); }
      return '<p>P(X = k) = <strong>' + p4(S.poissonPmf(k, l)) + '</strong> &nbsp; P(X ≤ k) = <strong>' + p4(S.poissonCdf(k, l)) +
        '</strong> &nbsp; P(X ≥ k) = <strong>' + p4(1 - S.poissonCdf(k - 1, l)) + '</strong></p>' +
        '<p>E(X) = V(X) = λ = ' + num(l) + '</p>';
    });
  };

  /* ---------- statistical tables ---------- */

  W['table-phi'] = function (el) {
    var head = ['z'].concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (d) { return num(d / 100, 2); }));
    var rows = [];
    for (var r = 0; r <= 39; r++) {
      var z0 = r / 10, row = [num(z0, 1)];
      for (var c = 0; c <= 9; c++) { row.push(num(S.normCdf(z0 + c / 100), 4)); }
      rows.push(row);
    }
    el.innerHTML = tableHtml(head, rows, true);
  };

  W['table-t'] = function (el) {
    var ps = [0.9, 0.95, 0.975, 0.99, 0.995];
    var dfs = [];
    for (var i = 1; i <= 30; i++) { dfs.push(i); }
    dfs = dfs.concat([40, 50, 60, 80, 100, 120, Infinity]);
    var head = [t('w.table.df')].concat(ps.map(function (p) { return 'p = ' + num(p); }));
    el.innerHTML = tableHtml(head, dfs.map(function (df) {
      return [df === Infinity ? '∞' : df].concat(ps.map(function (p) { return num(S.tInv(p, df), 3); }));
    }), true);
  };

  W['table-chi2'] = function (el) {
    var ps = [0.005, 0.01, 0.025, 0.05, 0.1, 0.9, 0.95, 0.975, 0.99, 0.995];
    var dfs = [];
    for (var i = 1; i <= 30; i++) { dfs.push(i); }
    dfs = dfs.concat([40, 50, 60, 70, 80, 90, 100]);
    var head = [t('w.table.df')].concat(ps.map(function (p) { return num(p); }));
    el.innerHTML = tableHtml(head, dfs.map(function (df) {
      return [df].concat(ps.map(function (p) { return num(S.chi2Inv(p, df), 3); }));
    }), true);
  };

  W['table-poisson'] = function (el) {
    var lambdas = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10];
    var mode = 'cdf';
    var draw = function () {
      var head = ['k \\ λ'].concat(lambdas.map(function (l) { return num(l); }));
      var rows = [];
      for (var k = 0; k <= 20; k++) {
        rows.push([k].concat(lambdas.map(function (l) {
          return num(mode === 'cdf' ? S.poissonCdf(k, l) : S.poissonPmf(k, l), 4);
        })));
      }
      el.querySelector('.widget__table').innerHTML = tableHtml(head, rows, true);
      SAD.util.qsa('[data-pmode]', el).forEach(function (b) { b.classList.toggle('segmented__item--active', b.getAttribute('data-pmode') === mode); });
    };
    el.innerHTML = '<div class="segmented" role="group">' +
      '<button type="button" class="segmented__item" data-pmode="cdf">F(k; λ) = P(X ≤ k)</button>' +
      '<button type="button" class="segmented__item" data-pmode="pmf">P(X = k)</button></div><div class="widget__table"></div>';
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pmode]');
      if (b) { mode = b.getAttribute('data-pmode'); draw(); }
    });
    draw();
  };

  /* ---------- course helpers ---------- */

  W.points = function (el) {
    el.innerHTML = form(t('w.points.title'),
      field('k1', t('w.points.k1'), '30', 'type="number" min="0" max="45" step="0.5"') +
      field('k2', t('w.points.k2'), '28', 'type="number" min="0" max="45" step="0.5"') +
      field('act', t('w.points.act'), '2', 'type="number" min="0" max="4" step="1"') +
      field('att', t('w.points.att'), '6', 'type="number" min="0" max="6" step="1"') +
      field('abs', t('w.points.abs'), '0', 'type="number" min="0" max="15" step="1"'),
      '<p class="form__hint">' + esc(t('w.points.hint')) + '</p>');
    live(el.querySelector('form'), function (v, res) {
      var k1 = Math.min(45, Math.max(0, parse(v.k1) || 0)), k2 = Math.min(45, Math.max(0, parse(v.k2) || 0));
      var act = Math.min(4, Math.max(0, parse(v.act) || 0)), att = Math.min(6, Math.max(0, parse(v.att) || 0));
      var abs = Math.max(0, parse(v.abs) || 0);
      var total = k1 + k2 + act + att;
      var lo = Math.min(k1, k2), hi = Math.max(k1, k2);
      var grade = total >= 91 ? '5' : total >= 81 ? '4,5' : total >= 71 ? '4' : total >= 61 ? '3,5' : total >= 51 ? '3' : '2';
      var notes = [];
      var ok = true;
      if (abs > 3) { ok = false; notes.push(t('w.points.absFail')); }
      else if (abs === 3) { notes.push(t('w.points.abs3')); }
      if (lo < 20) {
        ok = false;
        notes.push(t('w.points.kolFail'));
        if (hi >= 25) { notes.push(t('w.points.retake4')); }
        else if (hi >= 20) { notes.push(t('w.points.retake3')); }
        else { notes.push(t('w.points.noRetake')); }
      }
      if (total < 51) { ok = false; notes.push(t('w.points.totalFail')); }
      if (ok && (grade === '4' || grade === '4,5' || grade === '5') && lo < 25) {
        grade = total >= 61 ? '3,5' : '3';
        notes.push(t('w.points.cap'));
      }
      var exempt = ok && (grade === '4' || grade === '4,5' || grade === '5');
      if (SAD.i18n.lang === 'en') { grade = grade.replace(',', '.'); }
      res.className = 'form__result ' + (ok ? 'form__result--ok' : 'form__result--bad');
      return '<p>' + esc(t('w.points.total')) + ': <strong>' + num(total) + ' / 100</strong></p>' +
        '<p>' + esc(t('w.points.grade')) + ': <strong>' + (ok ? grade : '2 — ' + t('w.points.notPassed')) + '</strong>' +
        (exempt ? ' · <span class="badge badge--ok">' + esc(t('w.points.exempt')) + '</span>' : '') + '</p>' +
        (notes.length ? '<ul>' + notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' : '');
    });
  };

  W.planner = function (el) {
    var state = SAD.storage.get('planner', { start: '', skips: [] });
    var locale = { pl: 'pl-PL', en: 'en-GB', ru: 'ru-RU' }[SAD.i18n.lang];
    function iso(d) { return d.toISOString().slice(0, 10); }
    function draw() {
      var list = el.querySelector('.form__list');
      var res = el.querySelector('.form__result');
      if (!state.start) {
        list.innerHTML = '';
        res.innerHTML = esc(t('w.planner.empty'));
        return;
      }
      var d = new Date(state.start + 'T12:00:00');
      var items = [], n = 0, guard = 0;
      while (n < 15 && guard < 40) {
        var key = iso(d), skipped = state.skips.indexOf(key) >= 0;
        items.push({ key: key, date: new Date(d), n: skipped ? null : ++n });
        d.setDate(d.getDate() + 7);
        guard++;
      }
      var labels = { 8: t('w.planner.k1'), 14: t('w.planner.k2'), 15: t('w.planner.last') };
      list.innerHTML = items.map(function (it) {
        var key = labels[it.n];
        return '<li><button type="button" class="form__chip' + (key ? ' form__chip--key' : '') + (it.n ? '' : ' form__chip--skip') + '" data-day="' + it.key + '">' +
          '<span>' + (it.n ? '#' + it.n : '—') + ' · ' + esc(it.date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })) + '</span>' +
          (key ? '<small>' + esc(key) + '</small>' : '') + (it.n ? '' : '<small>' + esc(t('w.planner.cancelled')) + '</small>') + '</button></li>';
      }).join('');
      var find = function (k) { return items.filter(function (i) { return i.n === k; })[0]; };
      var fmtD = function (it) { return it ? it.date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '—'; };
      res.innerHTML = '<p>' + esc(t('w.planner.k1')) + ': <strong>' + esc(fmtD(find(8))) + '</strong></p>' +
        '<p>' + esc(t('w.planner.k2')) + ': <strong>' + esc(fmtD(find(14))) + '</strong></p>' +
        '<p>' + esc(t('w.planner.last')) + ': <strong>' + esc(fmtD(find(15))) + '</strong></p>';
    }
    el.innerHTML = '<form class="form" onsubmit="return false"><h3 class="form__title">' + esc(t('w.planner.title')) + '</h3>' +
      '<div class="form__row"><label class="form__field"><span class="form__label">' + esc(t('w.planner.start')) + '</span>' +
      '<input class="form__input" type="date" name="start" value="' + esc(state.start) + '"></label></div>' +
      '<p class="form__hint">' + esc(t('w.planner.hint')) + '</p><ul class="form__list"></ul>' +
      '<div class="form__result" aria-live="polite"></div></form>';
    el.querySelector('input').addEventListener('change', function (e) {
      state.start = e.target.value;
      state.skips = [];
      SAD.storage.set('planner', state);
      draw();
    });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-day]');
      if (!b) { return; }
      var k = b.getAttribute('data-day'), i = state.skips.indexOf(k);
      if (i >= 0) { state.skips.splice(i, 1); } else { state.skips.push(k); }
      SAD.storage.set('planner', state);
      draw();
    });
    draw();
  };

  W['excel-dict'] = function (el) {
    var dict = SAD.highlight.plDictionary;
    var rows = Object.keys(dict).filter(function (k) { return k !== 'TRUE' && k !== 'FALSE'; }).sort().map(function (k) {
      return ['<code>' + esc(k) + '</code>', '<code>' + esc(dict[k]) + '</code>'];
    });
    el.innerHTML = tableHtml([t('w.excel.en'), t('w.excel.pl')], rows);
  };

  SAD.widgets = {
    hydrate: function (root) {
      SAD.util.qsa('.widget[data-widget]', root).forEach(function (el) {
        var fn = W[el.getAttribute('data-widget')];
        if (fn) { fn(el, el.getAttribute('data-args') || ''); }
      });
    }
  };
})(window.SAD);
