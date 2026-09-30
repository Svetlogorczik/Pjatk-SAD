/*
 * highlight.js — tiny syntax highlighters for Python and Excel formulas,
 * plus translation of Excel formulas to the Polish Excel interface
 * (Polish function names, ";" as argument separator, "," as decimal separator).
 *
 * Excel code-block convention used in the content:
 *   B33: =AVERAGE(B2:B31)   // comment
 * "B33:" is the cell to type into; "// …" is a comment. Both are removed when copying.
 */
(function (SAD) {
  'use strict';

  var esc = SAD.util.esc;

  function span(cls, text) { return '<span class="tok--' + cls + '">' + esc(text) + '</span>'; }

  /* ---------- Python ---------- */

  var PY_KW = ('False None True and as assert break class continue def del elif else except finally for from ' +
    'global if import in is lambda nonlocal not or pass raise return try while with yield print').split(' ');

  var PY_RE = /(#[^\n]*)|([rRbBfFuU]{0,2}(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))|(\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_]\w*)(\s*\()?|([\s\S])/g;

  function python(src) {
    var out = '';
    src.replace(PY_RE, function (m, com, str, num, id, call, other) {
      if (com) { out += span('com', com); }
      else if (str) { out += span('str', str); }
      else if (num) { out += span('num', num); }
      else if (id) {
        if (PY_KW.indexOf(id) >= 0) { out += span('kw', id); }
        else if (call) { out += span('fn', id); }
        else { out += esc(id); }
        if (call) { out += esc(call); }
      } else { out += esc(other); }
      return m;
    });
    return out;
  }

  /* ---------- Excel ---------- */

  // English → Polish function names (Microsoft Excel, Polish UI)
  var PL = {
    'AVERAGE': 'ŚREDNIA', 'MEDIAN': 'MEDIANA', 'MODE': 'WYST.NAJCZĘŚCIEJ', 'MODE.SNGL': 'WYST.NAJCZĘŚCIEJ.WART',
    'MIN': 'MIN', 'MAX': 'MAX', 'SUM': 'SUMA', 'SUMPRODUCT': 'SUMA.ILOCZYNÓW', 'SUMSQ': 'SUMA.KWADRATÓW',
    'COUNT': 'ILE.LICZB', 'COUNTA': 'ILE.NIEPUSTYCH', 'COUNTIF': 'LICZ.JEŻELI', 'COUNTIFS': 'LICZ.WARUNKI',
    'FREQUENCY': 'CZĘSTOŚĆ', 'IF': 'JEŻELI', 'AND': 'ORAZ', 'OR': 'LUB', 'NOT': 'NIE',
    'VAR': 'WARIANCJA', 'VAR.S': 'WARIANCJA.PRÓBKI', 'VAR.P': 'WARIANCJA.POPUL',
    'STDEV': 'ODCH.STANDARDOWE', 'STDEV.S': 'ODCH.STANDARD.PRÓBKI', 'STDEV.P': 'ODCH.STANDARD.POPUL',
    'QUARTILE': 'KWARTYL', 'QUARTILE.INC': 'KWARTYL.PRZEDZ.ZAMK', 'QUARTILE.EXC': 'KWARTYL.PRZEDZ.OTW',
    'PERCENTILE.INC': 'PERCENTYL.PRZEDZ.ZAMK', 'TRIMMEAN': 'ŚREDNIA.WEWN', 'AVEDEV': 'ODCH.ŚREDNIE',
    'SQRT': 'PIERWIASTEK', 'ABS': 'MODUŁ.LICZBY', 'POWER': 'POTĘGA', 'EXP': 'EXP', 'LN': 'LN',
    'ROUND': 'ZAOKR', 'ROUNDUP': 'ZAOKR.GÓRA', 'ROUNDDOWN': 'ZAOKR.DÓŁ', 'INT': 'ZAOKR.DO.CAŁK',
    'FACT': 'SILNIA', 'COMBIN': 'KOMBINACJE', 'PERMUT': 'PERMUTACJE',
    'BINOM.DIST': 'ROZKŁ.DWUM', 'POISSON.DIST': 'ROZKŁ.POISSON', 'EXPON.DIST': 'ROZKŁ.EXP',
    'NORM.DIST': 'ROZKŁ.NORMALNY', 'NORM.S.DIST': 'ROZKŁ.NORMALNY.S',
    'NORM.INV': 'ROZKŁ.NORMALNY.ODWR', 'NORM.S.INV': 'ROZKŁ.NORMALNY.S.ODWR', 'STANDARDIZE': 'NORMALIZUJ',
    'T.DIST': 'ROZKŁ.T', 'T.DIST.RT': 'ROZKŁ.T.PS', 'T.DIST.2T': 'ROZKŁ.T.DS',
    'T.INV': 'ROZKŁ.T.ODWR', 'T.INV.2T': 'ROZKŁ.T.ODWR.DS',
    'CHISQ.DIST': 'ROZKŁ.CHI', 'CHISQ.DIST.RT': 'ROZKŁ.CHI.PS', 'CHISQ.INV': 'ROZKŁ.CHI.ODWR',
    'CHISQ.INV.RT': 'ROZKŁ.CHI.ODWR.PS', 'CHISQ.TEST': 'CHI.TEST',
    'F.INV.RT': 'ROZKŁ.F.ODWR.PS', 'F.DIST.RT': 'ROZKŁ.F.PS',
    'CONFIDENCE.NORM': 'UFNOŚĆ.NORM', 'CONFIDENCE.T': 'UFNOŚĆ.T',
    'CORREL': 'WSP.KORELACJI', 'PEARSON': 'PEARSON', 'COVARIANCE.S': 'KOWARIANCJA.PRÓBKI',
    'SLOPE': 'NACHYLENIE', 'INTERCEPT': 'ODCIĘTA', 'RSQ': 'R.KWADRAT', 'FORECAST': 'REGLINX',
    'FORECAST.LINEAR': 'REGLINX', 'LINEST': 'REGLINP', 'STEYX': 'REGBŁSTD',
    'TRUE': 'PRAWDA', 'FALSE': 'FAŁSZ'
  };

  var XL_ADDR = /^(\s*)([A-Z]{1,3}\d+(?::[A-Z]{1,3}\d+)?)(\s*:\s*)/;
  var XL_RE = /("(?:[^"]|"")*")|(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\$?[A-Z]{1,3}\$?\d+)(?![\w.(])|([A-Za-z_][A-Za-z0-9_.]*)(\s*\()?|([\s\S])/g;

  function splitComment(line) {
    // "//" outside of string literals starts a comment
    var inStr = false;
    for (var i = 0; i < line.length - 1; i++) {
      if (line[i] === '"') { inStr = !inStr; }
      if (!inStr && line[i] === '/' && line[i + 1] === '/') {
        return { code: line.slice(0, i).replace(/\s+$/, ''), comment: line.slice(i) , pad: line.slice(0, i).match(/\s*$/)[0] };
      }
    }
    return { code: line, comment: '', pad: '' };
  }

  function excelLine(line, toPL) {
    var addr = '', lead = '', sep = '';
    var am = line.match(XL_ADDR);
    if (am && line.length > am[0].length) {
      lead = am[1]; addr = am[2]; sep = am[3];
      line = line.slice(am[0].length);
    }
    var parts = splitComment(line);
    var html = '', plain = '';
    parts.code.replace(XL_RE, function (m, str, num, cell, id, call, other) {
      if (str) { html += span('str', str); plain += str; }
      else if (num) {
        var n = toPL ? num.replace('.', ',') : num;
        html += span('num', n); plain += n;
      } else if (cell) { html += span('cell', cell); plain += cell; }
      else if (id) {
        var up = id.toUpperCase();
        var name = toPL && call && PL[up] ? PL[up] : id;
        if (call) { html += span('fn', name) + esc(call); plain += name + call; }
        else if (toPL && PL[up] && (up === 'TRUE' || up === 'FALSE')) { html += span('kw', PL[up]); plain += PL[up]; }
        else { html += esc(id); plain += id; }
      } else {
        var ch = other;
        if (toPL && ch === ',') { ch = ';'; }
        html += /[=+\-*/^&<>]/.test(ch) ? span('op', ch) : esc(ch);
        plain += ch;
      }
      return m;
    });
    var outHtml = (addr ? esc(lead) + span('addr', addr) + esc(sep) : '') + html +
      (parts.comment ? esc(parts.pad || '  ') + span('com', parts.comment) : '');
    return { html: outHtml, formula: plain };
  }

  function excel(src, toPL) {
    var html = [], copy = [];
    src.split('\n').forEach(function (line) {
      var r = excelLine(line, toPL);
      html.push(r.html);
      if (r.formula.trim()) { copy.push(r.formula.trim()); }
    });
    return { html: html.join('\n'), copy: copy.join('\n') };
  }

  SAD.highlight = {
    python: python,
    excel: excel,
    plName: function (en) { return PL[String(en).toUpperCase()] || en; },
    plDictionary: PL
  };
})(window.SAD);
