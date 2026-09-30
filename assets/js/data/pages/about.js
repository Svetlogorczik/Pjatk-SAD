/* Page: about the site, sources, markers */
SAD.content = SAD.content || {};
SAD.content.about = {
  pl: {
    kicker: 'Informacje',
    title: 'O stronie i źródła',
    lead: 'Nieoficjalny, darmowy materiał do nauki Statystycznej Analizy Danych (Informatyka, studia dzienne).',
    body: SAD.md`
# Skąd pochodzi treść

- **Wykłady W01–W11/12** (slajdy PDF, rok 2025/26) — na nich opierają się teksty wykładów; fragmenty oznaczone {lecture:W01} itp.
- **Nagranie wykładu 1 z roku 2026/27** (30.09.2026) — aktualne zasady zaliczenia {ok}.
- **„Zasady zaliczenia” 2025/26** {doc}.
- **Listy ćwiczeń C01–C15 i przykładowe kolokwia** — wykorzystano **tylko logikę** zadań; wszystkie zadania na stronie mają **nowe dane i historie**.
- **Arkusze wzorów** (modele przedziałów ufności i testów, testy nieparametryczne) oraz **tablice statystyczne**.

# Oznaczenia

- {own} — dodatek autora strony (wyjaśnienia „po ludzku”, własne przykłady, Python, rady, kalkulatory).
- {lecture:W05} / {lecture:C08} — pochodzi z wykładu / z materiałów ćwiczeń.
- {ok} {doc} {ask} — aktualność informacji o zaliczeniu.

::: note
Niektóre slajdy (np. o prawdopodobieństwie warunkowym i Bayesie w W02) były tylko obrazkami — ich treść opisano standardowymi definicjami, a przykłady do nich są autorskie i oznaczone {own}.
:::

::: warn
To **nie jest** oficjalna strona przedmiotu. W razie rozbieżności obowiązuje to, co mówi prowadzący. Wartości liczbowe w rozwiązaniach sprawdzono obliczeniowo, ale błąd zawsze jest możliwy.
:::

# Technicznie

Czysty HTML/CSS/JS (metodologia BEM), bez frameworków i bez serwera — działa na GitHub Pages i po otwarciu pliku ‹index.html›. Wzory: KaTeX (CDN). Tablice i kalkulatory liczone są w przeglądarce. Twoje ustawienia (język, motyw, postęp) zapisują się tylko lokalnie.
`
  },
  en: {
    kicker: 'Information',
    title: 'About & sources',
    lead: 'Unofficial, free study material for Statistical Data Analysis (Computer Science, full-time).',
    body: SAD.md`
# Where the content comes from

- **Lectures W01–W11/12** (PDF slides, 2025/26) — the lecture texts are based on them; parts marked {lecture:W01} etc.
- **Recording of lecture 1, 2026/27** (30.09.2026) — current passing rules {ok}.
- **“Zasady zaliczenia” 2025/26** {doc}.
- **Class lists C01–C15 and sample tests** — **only the logic** of the problems was used; every exercise here has **new data and stories**.
- **Formula sheets** (confidence-interval and test models, non-parametric tests) and **statistical tables**.

# Markers

- {own} — added by the site author (plain-language explanations, own examples, Python, advice, calculators).
- {lecture:W05} / {lecture:C08} — from a lecture / from the class materials.
- {ok} {doc} {ask} — how current the passing information is.

::: note
Some slides (e.g. conditional probability and Bayes in W02) were images only — their content is described with standard definitions, and the examples for them are the author’s, marked {own}.
:::

::: warn
This is **not** the official course site. If anything differs, the instructor’s word counts. The numbers in the solutions were checked computationally, but mistakes are always possible.
:::

# Technical

Plain HTML/CSS/JS (BEM methodology), no frameworks, no server — works on GitHub Pages and when opening ‹index.html› directly. Formulas: KaTeX (CDN). Tables and calculators are computed in the browser. Your settings (language, theme, progress) are stored locally only.
`
  },
  ru: {
    kicker: 'Информация',
    title: 'О сайте и источники',
    lead: 'Неофициальный бесплатный материал для изучения Статистического анализа данных (Информатика, дневное отделение).',
    body: SAD.md`
# Откуда содержание

- **Лекции W01–W11/12** (PDF-слайды, 2025/26) — на них основаны тексты лекций; фрагменты помечены {lecture:W01} и т.д.
- **Запись лекции 1, 2026/27** (30.09.2026) — актуальные правила зачёта {ok}.
- **«Zasady zaliczenia» 2025/26** {doc}.
- **Списки задач C01–C15 и примерные коллоквиумы** — использована **только логика** задач; у всех задач на сайте **новые данные и сюжеты**.
- **Листы формул** (модели доверительных интервалов и тестов, непараметрические тесты) и **статистические таблицы**.

# Обозначения

- {own} — добавлено автором сайта (объяснения «по-человечески», свои примеры, Python, советы, калькуляторы).
- {lecture:W05} / {lecture:C08} — из лекции / из материалов занятий.
- {ok} {doc} {ask} — насколько актуальна информация о зачёте.

::: note
Некоторые слайды (например, об условной вероятности и Байесе в W02) были только картинками — их содержание описано стандартными определениями, а примеры к ним авторские и помечены {own}.
:::

::: warn
Это **не** официальный сайт предмета. При расхождениях действует то, что говорит преподаватель. Числа в решениях проверены вычислительно, но ошибка всегда возможна.
:::

# Технически

Чистый HTML/CSS/JS (методология БЭМ), без фреймворков и сервера — работает на GitHub Pages и при открытии ‹index.html› напрямую. Формулы: KaTeX (CDN). Таблицы и калькуляторы считаются в браузере. Ваши настройки (язык, тема, прогресс) хранятся только локально.
`
  }
};
