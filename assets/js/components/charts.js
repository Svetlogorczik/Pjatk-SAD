/*
 * charts.js — dependency-free SVG charts. Colours come from CSS custom properties,
 * so charts follow the light / dark theme automatically.
 *
 * Spec types: bar, hist, pie, box, pdf, pmf, cdf, scatter, ci, sigma
 * Text values may be plain strings or {pl, en, ru} objects.
 */
(function (SAD) {
  'use strict';

  var W = 640;
  var esc = SAD.util.esc;
  var S = SAD.stats;

  // Localised label; plain strings written with decimal commas ("0,25") get dots in English
  function L(v) {
    var s = SAD.i18n.pick(v);
    return typeof s === 'string' && SAD.i18n.lang === 'en' ? s.replace(/(\d),(\d)/g, '$1.$2') : s;
  }
  function num(x, d) { return SAD.util.num(x, d); }

  /* ---------- scales & axes ---------- */

  function niceStep(range, count) {
    var raw = range / (count || 5);
    var mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var norm = raw / mag;
    var step = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
    return step * mag;
  }

  function ticks(min, max, count) {
    var step = niceStep(max - min, count);
    var out = [];
    for (var v = Math.ceil(min / step - 1e-9) * step; v <= max + step * 1e-6; v += step) { out.push(+v.toFixed(10)); }
    return { values: out, step: step };
  }

  function decimalsFor(step) { return Math.max(0, -Math.floor(Math.log10(step) + 1e-9)); }

  function frame(o) {
    var h = o.height || 300;
    var m = { l: o.left || 58, r: 20, t: 18, b: o.bottom || 50 };
    var f = {
      h: h, m: m,
      x: function (v) { return m.l + (v - o.xmin) / (o.xmax - o.xmin) * (W - m.l - m.r); },
      y: function (v) { return h - m.b - (v - o.ymin) / (o.ymax - o.ymin) * (h - m.t - m.b); }
    };
    var parts = [];
    var yt = ticks(o.ymin, o.ymax, o.yCount || 5);
    var yd = o.yDecimals !== undefined ? o.yDecimals : decimalsFor(yt.step);
    yt.values.forEach(function (v) {
      var yy = f.y(v);
      parts.push('<line class="chart__grid" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + yy + '" y2="' + yy + '"/>');
      parts.push('<text class="chart__tick" x="' + (m.l - 8) + '" y="' + (yy + 4) + '" text-anchor="end">' +
        esc(o.yPercent ? num(v * 100, Math.max(0, yd - 2)) + '%' : num(v, yd)) + '</text>');
    });
    if (!o.categorical) {
      var xt = o.xTicks ? { values: o.xTicks, step: o.xStep || 1 } : ticks(o.xmin, o.xmax, o.xCount || 8);
      var xd = o.xDecimals !== undefined ? o.xDecimals : decimalsFor(xt.step);
      xt.values.forEach(function (v) {
        var xx = f.x(v);
        parts.push('<line class="chart__axis" x1="' + xx + '" x2="' + xx + '" y1="' + (h - m.b) + '" y2="' + (h - m.b + 5) + '"/>');
        parts.push('<text class="chart__tick" x="' + xx + '" y="' + (h - m.b + 18) + '" text-anchor="middle">' + esc(num(v, xd)) + '</text>');
      });
    }
    parts.push('<line class="chart__axis" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + f.y(Math.max(o.ymin, 0)) + '" y2="' + f.y(Math.max(o.ymin, 0)) + '"/>');
    parts.push('<line class="chart__axis" x1="' + m.l + '" x2="' + m.l + '" y1="' + m.t + '" y2="' + (h - m.b) + '"/>');
    if (o.xLabel) {
      parts.push('<text class="chart__label" x="' + ((m.l + W - m.r) / 2) + '" y="' + (h - 10) + '" text-anchor="middle">' + esc(L(o.xLabel)) + '</text>');
    }
    if (o.yLabel) {
      parts.push('<text class="chart__label" transform="translate(14 ' + ((m.t + h - m.b) / 2) + ') rotate(-90)" text-anchor="middle">' + esc(L(o.yLabel)) + '</text>');
    }
    f.axes = parts.join('');
    return f;
  }

  function svg(h, body, label) {
    return '<svg class="chart__svg" viewBox="0 0 ' + W + ' ' + h + '" role="img" aria-label="' + esc(label || '') + '">' + body + '</svg>';
  }

  function path(points) {
    return points.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2); }).join(' ');
  }

  /* ---------- distributions ---------- */

  function densityFn(d) {
    if (typeof d === 'function') { return d; }
    switch (d.name) {
      case 'normal': return function (x) { return S.normPdf(x, d.mu || 0, d.sigma || 1); };
      case 't': return function (x) { return S.tPdf(x, d.df); };
      case 'chi2': return function (x) { return S.chi2Pdf(x, d.df); };
      case 'exp': return function (x) { return S.expPdf(x, d.lambda); };
      case 'unif': return function (x) { return S.unifPdf(x, d.a, d.b); };
      default: return function () { return 0; };
    }
  }

  function cdfFn(d) {
    switch (d.name) {
      case 'normal': return function (x) { return S.normCdf(x, d.mu || 0, d.sigma || 1); };
      case 'exp': return function (x) { return S.expCdf(x, d.lambda); };
      case 'unif': return function (x) { return S.unifCdf(x, d.a, d.b); };
      case 't': return function (x) { return S.tCdf(x, d.df); };
      case 'chi2': return function (x) { return S.chi2Cdf(x, d.df); };
      default: return d.cdf || function () { return 0; };
    }
  }

  function pmfValues(d) {
    var xs = [], ps = [];
    if (d.name === 'binom') {
      for (var k = 0; k <= d.n; k++) { xs.push(k); ps.push(S.binomPmf(k, d.n, d.p)); }
    } else if (d.name === 'poisson') {
      var top = Math.ceil(d.lambda + 4 * Math.sqrt(d.lambda) + 2);
      for (var j = 0; j <= top; j++) { xs.push(j); ps.push(S.poissonPmf(j, d.lambda)); }
    } else {
      xs = d.xs.slice(); ps = d.ps.slice();
    }
    return { xs: xs, ps: ps };
  }

  /* ---------- chart types ---------- */

  function bar(spec) {
    var labels = spec.labels.map(L);
    var sets = [spec.values].concat(spec.values2 ? [spec.values2] : []);
    var max = Math.max.apply(null, sets.reduce(function (a, s) { return a.concat(s); }, []));
    var rotate = labels.some(function (l) { return String(l).length > 9; }) && labels.length > 4;
    var f = frame({ xmin: 0, xmax: labels.length, ymin: 0, ymax: spec.ymax || max * 1.15, yLabel: spec.yLabel, xLabel: spec.xLabel,
      categorical: true, bottom: rotate ? 88 : 50, yPercent: spec.percent, height: spec.height });
    var band = (f.x(1) - f.x(0));
    var body = f.axes;
    sets.forEach(function (vals, s) {
      var bw = sets.length > 1 ? band * 0.34 : band * 0.6;
      vals.forEach(function (v, i) {
        var x0 = f.x(i) + (band - bw * sets.length) / 2 + s * bw;
        body += '<rect class="chart__bar' + (s ? ' chart__bar--alt' : '') + '" x="' + x0 + '" y="' + f.y(v) + '" width="' + (bw - 2) + '" height="' + (f.y(0) - f.y(v)) + '"/>';
        if (spec.showValues !== false) {
          body += '<text class="chart__value" x="' + (x0 + bw / 2) + '" y="' + (f.y(v) - 5) + '" text-anchor="middle">' +
            esc(spec.percent ? num(v * 100, 1) + '%' : num(v)) + '</text>';
        }
      });
    });
    labels.forEach(function (l, i) {
      var cx = f.x(i) + band / 2, cy = f.h - f.m.b + 18;
      body += rotate
        ? '<text class="chart__tick" transform="translate(' + cx + ' ' + (cy - 6) + ') rotate(-35)" text-anchor="end">' + esc(l) + '</text>'
        : '<text class="chart__tick" x="' + cx + '" y="' + cy + '" text-anchor="middle">' + esc(l) + '</text>';
    });
    if (spec.legend) {
      spec.legend.forEach(function (lg, i) {
        var lx = W - 190 + i * 95;
        body += '<rect class="chart__bar' + (i ? ' chart__bar--alt' : '') + '" x="' + lx + '" y="6" width="12" height="12"/>' +
          '<text class="chart__text" x="' + (lx + 17) + '" y="16">' + esc(L(lg)) + '</text>';
      });
    }
    return svg(f.h, body, L(spec.caption));
  }

  function hist(spec) {
    var e = spec.edges, c = spec.counts, wdt = e[1] - e[0];
    var vals = spec.density ? c.map(function (v, i) { return v / (spec.total || 1) / (e[i + 1] - e[i]); }) : c;
    var xmin = spec.polygon ? e[0] - wdt : e[0], xmax = spec.polygon ? e[e.length - 1] + wdt : e[e.length - 1];
    var max = Math.max.apply(null, vals);
    var f = frame({ xmin: xmin, xmax: xmax, ymin: 0, ymax: spec.ymax || max * 1.18, xLabel: spec.xLabel, yLabel: spec.yLabel,
      xTicks: spec.xTicks || e, xStep: wdt, xDecimals: spec.xDecimals, yPercent: spec.percent, height: spec.height });
    var body = f.axes;
    vals.forEach(function (v, i) {
      var x0 = f.x(e[i]), x1 = f.x(e[i + 1]);
      body += '<rect class="chart__bar chart__bar--hist" x="' + x0 + '" y="' + f.y(v) + '" width="' + (x1 - x0) + '" height="' + (f.y(0) - f.y(v)) + '"/>';
      if (spec.showValues !== false) {
        body += '<text class="chart__value" x="' + ((x0 + x1) / 2) + '" y="' + (f.y(v) - 5) + '" text-anchor="middle">' +
          esc(spec.percent ? num(v * 100, 1) + '%' : num(v, spec.density ? 3 : undefined)) + '</text>';
      }
    });
    if (spec.polygon) {
      var pts = [[f.x(e[0] - wdt / 2), f.y(0)]];
      vals.forEach(function (v, i) { pts.push([f.x((e[i] + e[i + 1]) / 2), f.y(v)]); });
      pts.push([f.x(e[e.length - 1] + wdt / 2), f.y(0)]);
      body += '<path class="chart__poly" d="' + path(pts) + '"/>';
      pts.forEach(function (p) { body += '<circle class="chart__point chart__point--alt" cx="' + p[0] + '" cy="' + p[1] + '" r="3.5"/>'; });
    }
    if (spec.curve) {
      var fn = densityFn(spec.curve), scale = spec.curveScale || 1, cpts = [];
      for (var k = 0; k <= 200; k++) {
        var xv = xmin + (xmax - xmin) * k / 200;
        cpts.push([f.x(xv), f.y(fn(xv) * scale)]);
      }
      body += '<path class="chart__curve chart__curve--3" d="' + path(cpts) + '"/>';
    }
    return svg(f.h, body, L(spec.caption));
  }

  function pie(spec) {
    var total = spec.values.reduce(function (a, b) { return a + b; }, 0);
    var cx = 170, cy = 150, r = 120, a0 = -Math.PI / 2, body = '';
    spec.values.forEach(function (v, i) {
      var a1 = a0 + v / total * 2 * Math.PI;
      var large = a1 - a0 > Math.PI ? 1 : 0;
      var p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)], p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
      body += '<path class="chart__slice chart__slice--' + (i % 8 + 1) + '" d="M' + cx + ' ' + cy + ' L' + p0[0] + ' ' + p0[1] +
        ' A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + p1[0] + ' ' + p1[1] + ' Z"/>';
      var mid = (a0 + a1) / 2, share = v / total;
      if (share > 0.05) {
        body += '<text class="chart__value" x="' + (cx + r * 0.66 * Math.cos(mid)) + '" y="' + (cy + r * 0.66 * Math.sin(mid) + 4) +
          '" text-anchor="middle" style="fill:#fff">' + esc(num(share * 100, 1)) + '%</text>';
      }
      var ly = 40 + i * 26;
      body += '<rect class="chart__slice--' + (i % 8 + 1) + '" x="340" y="' + (ly - 11) + '" width="14" height="14" rx="3"/>' +
        '<text class="chart__text" x="362" y="' + ly + '">' + esc(L(spec.labels[i])) + ' — ' + esc(num(v)) +
        ' (' + esc(num(share * 360, 1)) + '°)</text>';
      a0 = a1;
    });
    return svg(300, body, L(spec.caption));
  }

  function box(spec) {
    var n = spec.boxes.length, rowH = 70, h = 60 + n * rowH;
    var f = frame({ xmin: spec.range[0], xmax: spec.range[1], ymin: 0, ymax: n, height: h, xLabel: spec.xLabel, yCount: 1, left: spec.boxes.some(function (b) { return b.label; }) ? 80 : 30 });
    // remove the y ticks/grid for box plots: rebuild axes manually
    var body = f.axes.replace(/<line class="chart__grid"[^>]*\/>/g, '').replace(/<text class="chart__tick" x="\d+(\.\d+)?" y="[\d.]+" text-anchor="end">[^<]*<\/text>/g, '');
    spec.boxes.forEach(function (b, i) {
      var yc = f.y(n - i - 0.5), bh = 30;
      var iqr = b.q3 - b.q1;
      var lo = b.whiskerLow !== undefined ? b.whiskerLow : b.min;
      var hi = b.whiskerHigh !== undefined ? b.whiskerHigh : b.max;
      body += '<line class="chart__whisker" x1="' + f.x(lo) + '" x2="' + f.x(b.q1) + '" y1="' + yc + '" y2="' + yc + '"/>';
      body += '<line class="chart__whisker" x1="' + f.x(b.q3) + '" x2="' + f.x(hi) + '" y1="' + yc + '" y2="' + yc + '"/>';
      body += '<line class="chart__whisker" x1="' + f.x(lo) + '" x2="' + f.x(lo) + '" y1="' + (yc - 10) + '" y2="' + (yc + 10) + '"/>';
      body += '<line class="chart__whisker" x1="' + f.x(hi) + '" x2="' + f.x(hi) + '" y1="' + (yc - 10) + '" y2="' + (yc + 10) + '"/>';
      body += '<rect class="chart__box" x="' + f.x(b.q1) + '" y="' + (yc - bh / 2) + '" width="' + (f.x(b.q3) - f.x(b.q1)) + '" height="' + bh + '" rx="3"/>';
      body += '<line class="chart__median" x1="' + f.x(b.med) + '" x2="' + f.x(b.med) + '" y1="' + (yc - bh / 2) + '" y2="' + (yc + bh / 2) + '"/>';
      (b.outliers || []).forEach(function (o) {
        body += '<circle class="chart__outlier" cx="' + f.x(o) + '" cy="' + yc + '" r="5"/>';
      });
      if (b.mean !== undefined) {
        var mx = f.x(b.mean);
        body += '<path class="chart__mean" d="M' + (mx - 5) + ' ' + (yc - 5) + ' L' + (mx + 5) + ' ' + (yc + 5) + ' M' + (mx - 5) + ' ' + (yc + 5) + ' L' + (mx + 5) + ' ' + (yc - 5) + '"/>';
      }
      if (b.label) {
        body += '<text class="chart__label" x="' + (f.m.l - 10) + '" y="' + (yc + 4) + '" text-anchor="end">' + esc(L(b.label)) + '</text>';
      }
      if (spec.annotate) {
        [['Q1', b.q1], ['Me', b.med], ['Q3', b.q3]].forEach(function (a) {
          body += '<text class="chart__value" x="' + f.x(a[1]) + '" y="' + (yc - bh / 2 - 7) + '" text-anchor="middle">' + a[0] + '=' + esc(num(a[1])) + '</text>';
        });
      }
      void iqr;
    });
    return svg(h, body, L(spec.caption));
  }

  function sampleCurve(fn, a, b, f, steps) {
    var pts = [];
    steps = steps || 240;
    for (var i = 0; i <= steps; i++) {
      var x = a + (b - a) * i / steps;
      var y = fn(x);
      if (isFinite(y)) { pts.push([f.x(x), f.y(y)]); }
    }
    return pts;
  }

  function shadeArea(fn, from, to, f, cls) {
    var pts = [[f.x(from), f.y(0)]];
    var steps = 120;
    for (var i = 0; i <= steps; i++) {
      var x = from + (to - from) * i / steps;
      var y = fn(x);
      pts.push([f.x(x), f.y(isFinite(y) ? y : 0)]);
    }
    pts.push([f.x(to), f.y(0)]);
    return '<path class="chart__shade' + (cls ? ' chart__shade--' + cls : '') + '" d="' + path(pts) + ' Z"/>';
  }

  function pdf(spec) {
    var curves = spec.curves || [{ dist: spec.dist, label: spec.label }];
    var a = spec.range[0], b = spec.range[1];
    var fns = curves.map(function (c) { return densityFn(c.dist); });
    var ymax = spec.ymax;
    if (!ymax) {
      ymax = 0;
      fns.forEach(function (fn) {
        for (var i = 0; i <= 300; i++) { var v = fn(a + (b - a) * i / 300); if (isFinite(v)) { ymax = Math.max(ymax, v); } }
      });
      ymax *= 1.15;
    }
    var f = frame({ xmin: a, xmax: b, ymin: 0, ymax: ymax, xLabel: spec.xLabel, yLabel: spec.yLabel, xTicks: spec.xTicks, xStep: spec.xStep, height: spec.height });
    var body = f.axes;
    (spec.shade || []).forEach(function (s) {
      body += shadeArea(fns[s.curve || 0], Math.max(a, s.from), Math.min(b, s.to), f, s.cls);
      if (s.label) {
        var mid = (Math.max(a, s.from) + Math.min(b, s.to)) / 2;
        var ly = s.labelY !== undefined ? f.y(s.labelY) : f.y(fns[s.curve || 0](mid) * 0.45);
        body += '<text class="chart__value" x="' + f.x(s.labelX !== undefined ? s.labelX : mid) + '" y="' + ly + '" text-anchor="middle">' + esc(L(s.label)) + '</text>';
      }
    });
    fns.forEach(function (fn, i) {
      body += '<path class="chart__curve' + (i ? ' chart__curve--' + (i + 1) : '') + (curves[i].dashed ? ' chart__curve--dashed' : '') +
        '" d="' + path(sampleCurve(fn, a, b, f, spec.steps)) + '"/>';
    });
    (spec.markers || []).forEach(function (mk) {
      var xx = f.x(mk.x);
      body += '<line class="chart__marker" x1="' + xx + '" x2="' + xx + '" y1="' + f.m.t + '" y2="' + f.y(0) + '"/>';
      if (mk.label) {
        body += '<text class="chart__value" x="' + xx + '" y="' + (f.m.t + 10) + '" text-anchor="' + (mk.anchor || 'middle') + '">' + esc(L(mk.label)) + '</text>';
      }
    });
    if (curves.length > 1 || curves[0].label) {
      curves.forEach(function (c, i) {
        if (!c.label) { return; }
        var ly = 22 + i * 20;
        body += '<line class="chart__curve' + (i ? ' chart__curve--' + (i + 1) : '') + (c.dashed ? ' chart__curve--dashed' : '') + '" x1="' + (W - 170) + '" x2="' + (W - 146) + '" y1="' + (ly - 4) + '" y2="' + (ly - 4) + '"/>' +
          '<text class="chart__text" x="' + (W - 140) + '" y="' + ly + '">' + esc(L(c.label)) + '</text>';
      });
    }
    return svg(f.h, body, L(spec.caption));
  }

  function pmf(spec) {
    var v = pmfValues(spec.dist);
    var max = Math.max.apply(null, v.ps);
    var f = frame({ xmin: 0, xmax: v.xs.length, ymin: 0, ymax: spec.ymax || max * 1.2, xLabel: spec.xLabel, yLabel: spec.yLabel, categorical: true, height: spec.height });
    var band = f.x(1) - f.x(0), bw = Math.max(3, Math.min(band * 0.55, 34));
    var body = f.axes;
    var every = Math.ceil(v.xs.length / 22);
    v.xs.forEach(function (x, i) {
      var cx = f.x(i) + band / 2;
      var hl = spec.highlight && spec.highlight(x);
      body += '<rect class="chart__bar' + (hl ? ' chart__bar--alt' : '') + '" x="' + (cx - bw / 2) + '" y="' + f.y(v.ps[i]) + '" width="' + bw + '" height="' + (f.y(0) - f.y(v.ps[i])) + '"/>';
      if (i % every === 0) {
        body += '<text class="chart__tick" x="' + cx + '" y="' + (f.h - f.m.b + 18) + '" text-anchor="middle">' + esc(num(x)) + '</text>';
      }
      if (spec.showValues && v.xs.length <= 12) {
        body += '<text class="chart__value" x="' + cx + '" y="' + (f.y(v.ps[i]) - 5) + '" text-anchor="middle">' + esc(num(v.ps[i], spec.valueDecimals || 3)) + '</text>';
      }
    });
    if (spec.normal) {
      var mu = spec.normal.mu, sg = spec.normal.sigma, pts = [];
      for (var k = 0; k <= 200; k++) {
        var xv = v.xs[0] - 0.5 + (v.xs.length) * k / 200;
        pts.push([f.x(xv - v.xs[0] + 0.5), f.y(S.normPdf(xv, mu, sg))]);
      }
      body += '<path class="chart__curve chart__curve--2" d="' + path(pts) + '"/>';
    }
    return svg(f.h, body, L(spec.caption));
  }

  function cdf(spec) {
    var body, f;
    if (spec.dist && !spec.dist.xs) {
      var fn = cdfFn(spec.dist);
      f = frame({ xmin: spec.range[0], xmax: spec.range[1], ymin: 0, ymax: 1.08, xLabel: spec.xLabel, yLabel: spec.yLabel || 'F(x)', height: spec.height });
      body = f.axes + '<path class="chart__curve" d="' + path(sampleCurve(fn, spec.range[0], spec.range[1], f)) + '"/>';
      (spec.markers || []).forEach(function (mk) {
        body += '<line class="chart__marker" x1="' + f.x(mk.x) + '" x2="' + f.x(mk.x) + '" y1="' + f.m.t + '" y2="' + f.y(0) + '"/>';
        if (mk.label) { body += '<text class="chart__value" x="' + f.x(mk.x) + '" y="' + (f.m.t + 10) + '" text-anchor="middle">' + esc(L(mk.label)) + '</text>'; }
      });
      return svg(f.h, body, L(spec.caption));
    }
    var d = spec.dist ? pmfValues(spec.dist) : { xs: spec.xs, ps: spec.ps };
    var xs = d.xs, cum = [], s = 0;
    d.ps.forEach(function (p) { s += p; cum.push(Math.min(1, s)); });
    var lo = spec.range ? spec.range[0] : xs[0] - 1, hi = spec.range ? spec.range[1] : xs[xs.length - 1] + 1;
    f = frame({ xmin: lo, xmax: hi, ymin: 0, ymax: 1.08, xLabel: spec.xLabel, yLabel: spec.yLabel || 'F(x)', xTicks: spec.xTicks || xs, height: spec.height, xDecimals: spec.xDecimals });
    body = f.axes;
    var segs = [[lo, xs[0], 0]];
    xs.forEach(function (x, i) { segs.push([x, i + 1 < xs.length ? xs[i + 1] : hi, cum[i]]); });
    segs.forEach(function (sg) {
      body += '<line class="chart__curve" x1="' + f.x(sg[0]) + '" x2="' + f.x(sg[1]) + '" y1="' + f.y(sg[2]) + '" y2="' + f.y(sg[2]) + '" style="stroke-width:3"/>';
    });
    xs.forEach(function (x, i) {
      var prev = i ? cum[i - 1] : 0;
      body += '<line class="chart__marker" x1="' + f.x(x) + '" x2="' + f.x(x) + '" y1="' + f.y(prev) + '" y2="' + f.y(cum[i]) + '"/>';
      body += '<circle class="chart__point--open" cx="' + f.x(x) + '" cy="' + f.y(prev) + '" r="4.5"/>';
      body += '<circle class="chart__point" cx="' + f.x(x) + '" cy="' + f.y(cum[i]) + '" r="4.5"/>';
      if (spec.showValues !== false) {
        body += '<text class="chart__value" x="' + (f.x(x) + 8) + '" y="' + (f.y(cum[i]) - 7) + '">' + esc(num(+cum[i].toFixed(4))) + '</text>';
      }
    });
    return svg(f.h, body, L(spec.caption));
  }

  function scatter(spec) {
    var xs = spec.points.map(function (p) { return p[0]; }), ys = spec.points.map(function (p) { return p[1]; });
    var xr = spec.xRange || [Math.min.apply(null, xs), Math.max.apply(null, xs)];
    var yr = spec.yRange || [Math.min.apply(null, ys), Math.max.apply(null, ys)];
    var px = (xr[1] - xr[0]) * 0.08 || 1, py = (yr[1] - yr[0]) * 0.12 || 1;
    var f = frame({ xmin: spec.xRange ? xr[0] : xr[0] - px, xmax: spec.xRange ? xr[1] : xr[1] + px,
      ymin: spec.yRange ? yr[0] : yr[0] - py, ymax: spec.yRange ? yr[1] : yr[1] + py, xLabel: spec.xLabel, yLabel: spec.yLabel, height: spec.height });
    var body = f.axes;
    var X0 = spec.xRange ? xr[0] : xr[0] - px, X1 = spec.xRange ? xr[1] : xr[1] + px;
    if (spec.line) {
      var l = spec.line;
      if (spec.residuals) {
        spec.points.forEach(function (p) {
          body += '<line class="chart__resid" x1="' + f.x(p[0]) + '" x2="' + f.x(p[0]) + '" y1="' + f.y(p[1]) + '" y2="' + f.y(l.b0 + l.b1 * p[0]) + '"/>';
        });
      }
      body += '<line class="chart__line" x1="' + f.x(X0) + '" x2="' + f.x(X1) + '" y1="' + f.y(l.b0 + l.b1 * X0) + '" y2="' + f.y(l.b0 + l.b1 * X1) + '"/>';
      if (l.label) {
        body += '<text class="chart__value" x="' + (W - 24) + '" y="' + (f.m.t + 14) + '" text-anchor="end">' + esc(L(l.label)) + '</text>';
      }
    }
    spec.points.forEach(function (p) {
      body += '<circle class="chart__point" cx="' + f.x(p[0]) + '" cy="' + f.y(p[1]) + '" r="5.5"/>';
    });
    return svg(f.h, body, L(spec.caption));
  }

  function ci(spec) {
    var rnd = S.rng(spec.seed || 7), count = spec.count || 25, z = S.normInv(1 - (1 - (spec.level || 0.95)) / 2);
    var rows = [];
    for (var k = 0; k < count; k++) {
      var sum = 0;
      for (var i = 0; i < spec.n; i++) {
        var u1 = rnd() || 1e-9, u2 = rnd();
        sum += spec.mu + spec.sigma * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      }
      var m = sum / spec.n, half = z * spec.sigma / Math.sqrt(spec.n);
      rows.push([m - half, m + half]);
    }
    var span = 4.2 * spec.sigma / Math.sqrt(spec.n);
    var h = 40 + count * 12 + 40;
    var f = frame({ xmin: spec.mu - span, xmax: spec.mu + span, ymin: 0, ymax: count + 1, height: h, xLabel: spec.xLabel, left: 30, yCount: 1 });
    var body = f.axes.replace(/<line class="chart__grid"[^>]*\/>/g, '').replace(/<text class="chart__tick" x="[\d.]+" y="[\d.]+" text-anchor="end">[^<]*<\/text>/g, '');
    body += '<line class="chart__truth" x1="' + f.x(spec.mu) + '" x2="' + f.x(spec.mu) + '" y1="' + f.m.t + '" y2="' + f.y(0) + '"/>';
    var miss = 0;
    rows.forEach(function (r, i) {
      var yy = f.y(count - i);
      var bad = r[0] > spec.mu || r[1] < spec.mu;
      if (bad) { miss++; }
      body += '<line class="chart__interval' + (bad ? ' chart__interval--miss' : '') + '" x1="' + f.x(r[0]) + '" x2="' + f.x(r[1]) + '" y1="' + yy + '" y2="' + yy + '"/>';
      body += '<circle class="' + (bad ? 'chart__outlier' : 'chart__point') + '" cx="' + f.x((r[0] + r[1]) / 2) + '" cy="' + yy + '" r="2.8"/>';
    });
    body += '<text class="chart__value" x="' + (f.x(spec.mu) + 6) + '" y="' + (f.m.t + 8) + '">μ</text>';
    body += '<text class="chart__text" x="' + (W - 24) + '" y="' + (f.m.t + 8) + '" text-anchor="end">' +
      esc(SAD.i18n.t('chart.ciMiss', { miss: miss, count: count })) + '</text>';
    return svg(f.h, body, L(spec.caption));
  }

  function sigma(spec) {
    var mu = spec.mu || 0, sg = spec.sigma || 1;
    var fn = function (x) { return S.normPdf(x, mu, sg); };
    var f = frame({ xmin: mu - 4 * sg, xmax: mu + 4 * sg, ymin: 0, ymax: fn(mu) * 1.32,
      xTicks: [-3, -2, -1, 0, 1, 2, 3].map(function (k) { return mu + k * sg; }), xStep: sg, height: spec.height || 320, xDecimals: spec.xDecimals });
    var body = f.axes;
    body += shadeArea(fn, mu - 3 * sg, mu + 3 * sg, f, '');
    body += shadeArea(fn, mu - 2 * sg, mu + 2 * sg, f, '');
    body += shadeArea(fn, mu - sg, mu + sg, f, '');
    body += '<path class="chart__curve" d="' + path(sampleCurve(fn, mu - 4 * sg, mu + 4 * sg, f)) + '"/>';
    [[1, '68,3%'], [2, '95,4%'], [3, '99,7%']].forEach(function (b, i) {
      var y = f.y(fn(mu) * (1.05 + i * 0.09));
      var lbl = SAD.i18n.lang === 'en' ? b[1].replace(',', '.') : b[1];
      body += '<line class="chart__marker" x1="' + f.x(mu - b[0] * sg) + '" x2="' + f.x(mu + b[0] * sg) + '" y1="' + y + '" y2="' + y + '"/>';
      body += '<text class="chart__value" x="' + f.x(mu) + '" y="' + (y - 4) + '" text-anchor="middle">±' + b[0] + 'σ: ' + lbl + '</text>';
    });
    if (spec.labels !== false) {
      body = body.replace(/(<text class="chart__tick"[^>]*>)([^<]*)(<\/text>)/g, function (m, a, v, c) {
        var k = Math.round((parseFloat(v.replace(',', '.')) - mu) / sg);
        if (spec.symbolic) { return a + (k === 0 ? 'μ' : 'μ' + (k > 0 ? '+' : '−') + Math.abs(k) + 'σ') + c; }
        return m;
      });
    }
    return svg(f.h, body, L(spec.caption));
  }

  var TYPES = { bar: bar, hist: hist, pie: pie, box: box, pdf: pdf, pmf: pmf, cdf: cdf, scatter: scatter, ci: ci, sigma: sigma };

  SAD.charts = {
    render: function (spec) {
      var fn = TYPES[spec.type];
      return fn ? fn(spec) : '';
    },
    figure: function (spec) {
      var cap = L(spec.caption);
      return '<figure class="chart">' + SAD.charts.render(spec) +
        (cap ? '<figcaption class="chart__caption">' + SAD.markup.inline(cap) + '</figcaption>' : '') + '</figure>';
    }
  };
})(window.SAD);
