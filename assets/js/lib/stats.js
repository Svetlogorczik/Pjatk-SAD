/*
 * stats.js — small numerical library used by charts, tables and calculators.
 * Works in the browser (window.SAD.stats) and in Node (module.exports).
 */
(function (root) {
  'use strict';

  /* ---------- special functions ---------- */

  // Complementary error function (Numerical Recipes erfcc), |error| < 1.2e-7
  function erfc(x) {
    var z = Math.abs(x);
    var t = 1 / (1 + 0.5 * z);
    var r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 +
      t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
      t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  }

  // Lanczos approximation of ln(Gamma(x))
  function lnGamma(x) {
    var g = [76.18009172947146, -86.50532032941677, 24.01409824083091,
      -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    var y = x, tmp = x + 5.5, ser = 1.000000000190015;
    tmp -= (x + 0.5) * Math.log(tmp);
    for (var j = 0; j < 6; j++) { ser += g[j] / ++y; }
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }

  function lnFact(n) { return lnGamma(n + 1); }

  function combin(n, k) {
    if (k < 0 || k > n) { return 0; }
    return Math.round(Math.exp(lnFact(n) - lnFact(k) - lnFact(n - k)));
  }

  // Regularized lower incomplete gamma P(a, x)
  function gammaP(a, x) {
    if (x <= 0) { return 0; }
    if (x < a + 1) {
      var ap = a, sum = 1 / a, del = sum;
      for (var n = 0; n < 500; n++) {
        ap += 1; del *= x / ap; sum += del;
        if (Math.abs(del) < Math.abs(sum) * 1e-14) { break; }
      }
      return sum * Math.exp(-x + a * Math.log(x) - lnGamma(a));
    }
    // continued fraction for Q(a, x)
    var b = x + 1 - a, c = 1 / 1e-300, d = 1 / b, h = d;
    for (var i = 1; i < 500; i++) {
      var an = -i * (i - a);
      b += 2;
      d = an * d + b; if (Math.abs(d) < 1e-300) { d = 1e-300; }
      c = b + an / c; if (Math.abs(c) < 1e-300) { c = 1e-300; }
      d = 1 / d;
      var dl = d * c; h *= dl;
      if (Math.abs(dl - 1) < 1e-14) { break; }
    }
    return 1 - Math.exp(-x + a * Math.log(x) - lnGamma(a)) * h;
  }

  // Continued fraction for the incomplete beta function
  function betacf(a, b, x) {
    var qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < 1e-300) { d = 1e-300; }
    d = 1 / d;
    var h = d;
    for (var m = 1; m <= 500; m++) {
      var m2 = 2 * m;
      var aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) { d = 1e-300; }
      c = 1 + aa / c; if (Math.abs(c) < 1e-300) { c = 1e-300; }
      d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < 1e-300) { d = 1e-300; }
      c = 1 + aa / c; if (Math.abs(c) < 1e-300) { c = 1e-300; }
      d = 1 / d;
      var del = d * c; h *= del;
      if (Math.abs(del - 1) < 1e-14) { break; }
    }
    return h;
  }

  // Regularized incomplete beta I_x(a, b)
  function betaI(a, b, x) {
    if (x <= 0) { return 0; }
    if (x >= 1) { return 1; }
    var bt = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) { return bt * betacf(a, b, x) / a; }
    return 1 - bt * betacf(b, a, 1 - x) / b;
  }

  /* ---------- distributions ---------- */

  function normPdf(x, mu, sigma) {
    mu = mu || 0; sigma = sigma || 1;
    var z = (x - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
  }

  function normCdf(x, mu, sigma) {
    mu = mu || 0; sigma = sigma || 1;
    return 0.5 * erfc(-(x - mu) / (sigma * Math.SQRT2));
  }

  // Acklam's algorithm for the standard normal quantile
  function normInv(p, mu, sigma) {
    mu = mu || 0; sigma = sigma === undefined ? 1 : sigma;
    if (p <= 0) { return -Infinity; }
    if (p >= 1) { return Infinity; }
    var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
      1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    var b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
      6.680131188771972e+01, -1.328068155288572e+01];
    var c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
      -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    var d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
      3.754408661907416e+00];
    var pl = 0.02425, q, r, x;
    if (p < pl) {
      q = Math.sqrt(-2 * Math.log(p));
      x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= 1 - pl) {
      q = p - 0.5; r = q * q;
      x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
        (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
        ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    // one Halley refinement step
    var e = 0.5 * erfc(-x / Math.SQRT2) - p;
    var u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2);
    x = x - u / (1 + x * u / 2);
    return mu + sigma * x;
  }

  function tPdf(x, df) {
    return Math.exp(lnGamma((df + 1) / 2) - lnGamma(df / 2)) /
      Math.sqrt(df * Math.PI) * Math.pow(1 + x * x / df, -(df + 1) / 2);
  }

  function tCdf(t, df) {
    var x = df / (df + t * t);
    var tail = 0.5 * betaI(df / 2, 0.5, x);
    return t >= 0 ? 1 - tail : tail;
  }

  function chi2Pdf(x, df) {
    if (x <= 0) { return 0; }
    return Math.exp((df / 2 - 1) * Math.log(x) - x / 2 - (df / 2) * Math.log(2) - lnGamma(df / 2));
  }

  function chi2Cdf(x, df) { return x <= 0 ? 0 : gammaP(df / 2, x / 2); }

  function fCdf(x, d1, d2) {
    if (x <= 0) { return 0; }
    return betaI(d1 / 2, d2 / 2, d1 * x / (d1 * x + d2));
  }

  function expPdf(x, lambda) { return x < 0 ? 0 : lambda * Math.exp(-lambda * x); }
  function expCdf(x, lambda) { return x < 0 ? 0 : 1 - Math.exp(-lambda * x); }

  function unifPdf(x, a, b) { return (x >= a && x <= b) ? 1 / (b - a) : 0; }
  function unifCdf(x, a, b) { return x < a ? 0 : (x > b ? 1 : (x - a) / (b - a)); }

  // Generic quantile by bisection of a monotone CDF
  function invert(cdf, p, lo, hi) {
    while (cdf(lo) > p) { lo = lo - (hi - lo) - 1; }
    while (cdf(hi) < p) { hi = hi + (hi - lo) + 1; }
    for (var i = 0; i < 200; i++) {
      var mid = (lo + hi) / 2;
      if (cdf(mid) < p) { lo = mid; } else { hi = mid; }
      if (hi - lo < 1e-12) { break; }
    }
    return (lo + hi) / 2;
  }

  function tInv(p, df) {
    if (df === Infinity) { return normInv(p); }
    return invert(function (x) { return tCdf(x, df); }, p, -10, 10);
  }

  function chi2Inv(p, df) {
    return invert(function (x) { return chi2Cdf(x, df); }, p, 0, df + 10 * Math.sqrt(2 * df) + 10);
  }

  function fInv(p, d1, d2) {
    return invert(function (x) { return fCdf(x, d1, d2); }, p, 0, 50);
  }

  function binomPmf(k, n, p) {
    if (k < 0 || k > n || k !== Math.floor(k)) { return 0; }
    if (p === 0) { return k === 0 ? 1 : 0; }
    if (p === 1) { return k === n ? 1 : 0; }
    return Math.exp(lnFact(n) - lnFact(k) - lnFact(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  }

  function binomCdf(k, n, p) {
    var s = 0;
    for (var i = 0; i <= Math.min(Math.floor(k), n); i++) { s += binomPmf(i, n, p); }
    return Math.min(1, s);
  }

  function poissonPmf(k, lambda) {
    if (k < 0 || k !== Math.floor(k)) { return 0; }
    return Math.exp(-lambda + k * Math.log(lambda) - lnFact(k));
  }

  function poissonCdf(k, lambda) {
    var s = 0;
    for (var i = 0; i <= Math.floor(k); i++) { s += poissonPmf(i, lambda); }
    return Math.min(1, s);
  }

  /* ---------- descriptive statistics ---------- */

  function sum(a) { return a.reduce(function (s, v) { return s + v; }, 0); }
  function mean(a) { return sum(a) / a.length; }
  function sorted(a) { return a.slice().sort(function (x, y) { return x - y; }); }

  function variance(a) { // sample variance, divisor n - 1
    var m = mean(a);
    return sum(a.map(function (v) { return (v - m) * (v - m); })) / (a.length - 1);
  }

  function sd(a) { return Math.sqrt(variance(a)); }

  function median(a) {
    var s = sorted(a), n = s.length;
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  }

  // Quartiles as defined in the lecture: medians of the lower / upper half (median excluded for odd n)
  function quartilesLecture(a) {
    var s = sorted(a), n = s.length, h = Math.floor(n / 2);
    var lower = s.slice(0, h), upper = s.slice(n % 2 ? h + 1 : h);
    return { q1: median(lower), q2: median(s), q3: median(upper) };
  }

  // Excel QUARTILE.INC / QUARTILE.EXC
  function quartileInc(a, q) {
    var s = sorted(a), pos = (s.length - 1) * q / 4, lo = Math.floor(pos);
    return lo + 1 < s.length ? s[lo] + (pos - lo) * (s[lo + 1] - s[lo]) : s[lo];
  }

  function quartileExc(a, q) {
    var s = sorted(a), pos = (s.length + 1) * q / 4 - 1, lo = Math.floor(pos);
    if (lo < 0) { return s[0]; }
    if (lo + 1 >= s.length) { return s[s.length - 1]; }
    return s[lo] + (pos - lo) * (s[lo + 1] - s[lo]);
  }

  function modes(a) {
    var cnt = {}, best = 0;
    a.forEach(function (v) { cnt[v] = (cnt[v] || 0) + 1; best = Math.max(best, cnt[v]); });
    return Object.keys(cnt).filter(function (k) { return cnt[k] === best; }).map(Number);
  }

  function correlation(x, y) {
    var mx = mean(x), my = mean(y), sxy = 0, sxx = 0, syy = 0;
    for (var i = 0; i < x.length; i++) {
      sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) * (x[i] - mx); syy += (y[i] - my) * (y[i] - my);
    }
    return sxy / Math.sqrt(sxx * syy);
  }

  function linreg(x, y) {
    var mx = mean(x), my = mean(y), sxy = 0, sxx = 0;
    for (var i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) * (x[i] - mx); }
    var b1 = sxy / sxx, b0 = my - b1 * mx, sse = 0, sst = 0;
    for (var j = 0; j < x.length; j++) {
      var e = y[j] - (b0 + b1 * x[j]); sse += e * e; sst += (y[j] - my) * (y[j] - my);
    }
    return { b0: b0, b1: b1, sse: sse, sst: sst, ssr: sst - sse, r2: 1 - sse / sst, sxx: sxx, mx: mx, my: my };
  }

  /* ---------- deterministic PRNG for reproducible demos ---------- */
  function rng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var api = {
    erfc: erfc, lnGamma: lnGamma, combin: combin, gammaP: gammaP, betaI: betaI,
    normPdf: normPdf, normCdf: normCdf, normInv: normInv,
    tPdf: tPdf, tCdf: tCdf, tInv: tInv,
    chi2Pdf: chi2Pdf, chi2Cdf: chi2Cdf, chi2Inv: chi2Inv,
    fCdf: fCdf, fInv: fInv,
    expPdf: expPdf, expCdf: expCdf, unifPdf: unifPdf, unifCdf: unifCdf,
    binomPmf: binomPmf, binomCdf: binomCdf, poissonPmf: poissonPmf, poissonCdf: poissonCdf,
    sum: sum, mean: mean, sorted: sorted, variance: variance, sd: sd, median: median,
    quartilesLecture: quartilesLecture, quartileInc: quartileInc, quartileExc: quartileExc,
    modes: modes, correlation: correlation, linreg: linreg, rng: rng
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.SAD = root.SAD || {};
    root.SAD.stats = api;
  }
})(typeof window !== 'undefined' ? window : this);
