# SAD — Statystyczna Analiza Danych (PL / EN / RU)

Unofficial study site: lectures as readable text, cheat sheets, exercises with solutions
(written from scratch following the logic of the class lists), practice tests, statistical
tables & calculators, course rules for 2026/27. Light/dark theme.

## Run locally

Just open `index.html` in a browser (formulas need internet for KaTeX), or serve the folder:

```bash
npx http-server . -p 8080
```

## Publish on GitHub Pages

1. Create a repository and push the **contents of this folder** (with `index.html` in the root).
2. *Settings → Pages → Deploy from a branch → main / (root)*.
3. The site will be at `https://<user>.github.io/<repo>/`. Hash routing (`#/topic/t01`) needs no server config;
   `.nojekyll` is included.

## Structure

```
index.html                 app shell
assets/css/tokens.css      design tokens, light/dark themes
assets/css/base.css        reset, utilities
assets/css/blocks/*.css    BEM blocks (header, sidebar, callout, code-block, chart, task, …)
assets/css/print.css       print styles (lectures, cheat sheets)
assets/js/core/            namespace, storage, i18n, theme, loader, router
assets/js/lib/             stats (numerics), markup (content parser), highlight (Excel/Python), math (KaTeX)
assets/js/components/      code blocks, SVG charts, cheat sheet modal, tasks, widgets, sidebar
assets/js/pages/           page renderers
assets/js/data/ui.js       UI strings (3 languages)
assets/js/data/topics.js   topic registry
assets/js/data/topics/     t01…t12 — lecture, cheat sheet, exercises (PL/EN/RU), loaded on demand
assets/js/data/pages/      home, course rules, tables, tips, Excel, about
assets/js/data/colloquia.js practice tests
```

Content is written in a small Markdown dialect (see the header of `assets/js/lib/markup.js`).
