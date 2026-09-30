/* Page: home */
SAD.content = SAD.content || {};
SAD.content.home = {
  pl: {
    kicker: 'Rok akademicki 2026/27 · semestr zimowy',
    title: 'Statystyczna Analiza Danych — po ludzku',
    intro: SAD.md`
Tu znajdziesz **wszystkie tematy wykładu** opisane zwykłym tekstem (a nie slajdami): z przykładami, wykresami i gotowymi formułami **Excela** do skopiowania. Do każdego tematu jest **konspekt na ćwiczenia** (przycisk 📋) i **zadania z rozwiązaniami**, ułożone od nowa według logiki ćwiczeń.

Jak korzystać: przeczytaj temat → zrób zadania → przed ćwiczeniami/kolokwium przejrzyj konspekt.
`,
    news: SAD.md`
::: note | Aktualności — stan na 30.09.2026 (wykład 1)
- Wykład w tym roku jest **zdalny i nagrywany**. {ok}
- Zasady zaliczenia bez zmian względem ubiegłego roku; doprecyzowano 10 pkt dodatkowych: **4 za aktywność** (max 1 pkt na zajęciach) i **6 za obecności**. {ok}
- **Kolokwia: zajęcia nr 8 i nr 14 Twojej grupy**, poprawa na ostatnich zajęciach. Sprawdź daty w [planerze](#/course). {ok}
:::
`,
    ctaCourse: 'Jak zaliczyć przedmiot',
    ctaStart: 'Zacznij od tematu 1',
    topicsTitle: 'Tematy wykładu',
    practiceTitle: 'Ćwicz przed kolokwium',
    practice: [
      { href: '#/colloquium/1', icon: '📝', title: 'Próbne kolokwium 1', text: 'Zestaw w stylu kolokwium z zajęć nr 8 — z punktacją i rozwiązaniami.' },
      { href: '#/colloquium/2', icon: '📝', title: 'Próbne kolokwium 2', text: 'Zestaw w stylu kolokwium z zajęć nr 14 — przedziały ufności, testy, CTG.' },
      { href: '#/tables', icon: 'Φ', title: 'Tablice i kalkulatory', text: 'Φ(z), kwantyle t-Studenta i χ², rozkład Poissona + kalkulatory.' },
      { href: '#/excel', icon: '🟩', title: 'Excel na SAD', text: 'Funkcje Excela potrzebne na laboratorium — po angielsku i po polsku.' },
      { href: '#/tips', icon: '💡', title: 'Rady, jak się uczyć', text: 'Plan nauki, szablon rozwiązania testu, najczęstsze błędy.' }
    ],
    legend: SAD.md`
::: own | Oznaczenia na stronie
- {own} — tego **nie ma** w materiałach z wykładu/ćwiczeń: moje wyjaśnienia „po ludzku”, dodatkowe przykłady, Python, rady.
- {lecture:W03} — treść lub przykład pochodzi z danego wykładu.
- {ok} {doc} {ask} — przy zasadach zaliczenia: skąd informacja i czy jest aktualna.
- Kod **Excel** ma przełącznik **EN / PL** (angielskie albo polskie nazwy funkcji), a **Python** jest zawsze oznaczony jako dodatek.
:::
`
  },

  en: {
    kicker: 'Academic year 2026/27 · winter semester',
    title: 'Statistical Data Analysis — made simple',
    intro: SAD.md`
Here you’ll find **every lecture topic** written as normal text (not slides): with examples, charts and ready-to-copy **Excel** formulas. Each topic has a **cheat sheet for classes** (the 📋 button) and **exercises with solutions**, written from scratch following the logic of the class problems.

How to use it: read a topic → do the exercises → skim the cheat sheet before classes / a test.
`,
    news: SAD.md`
::: note | News — as of 30.09.2026 (lecture 1)
- This year the lecture is **online and recorded**. {ok}
- Passing rules unchanged from last year; the 10 bonus points were specified: **4 for activity** (max 1 per class) and **6 for attendance**. {ok}
- **Tests: class no. 8 and no. 14 of your group**, retake at the last class. Check the dates in the [planner](#/course). {ok}
:::
`,
    ctaCourse: 'How to pass the course',
    ctaStart: 'Start with topic 1',
    topicsTitle: 'Lecture topics',
    practiceTitle: 'Practise before the tests',
    practice: [
      { href: '#/colloquium/1', icon: '📝', title: 'Practice test 1', text: 'A set in the style of the test at class no. 8 — with points and solutions.' },
      { href: '#/colloquium/2', icon: '📝', title: 'Practice test 2', text: 'A set in the style of the test at class no. 14 — intervals, tests, CLT.' },
      { href: '#/tables', icon: 'Φ', title: 'Tables & calculators', text: 'Φ(z), t and χ² quantiles, Poisson distribution + calculators.' },
      { href: '#/excel', icon: '🟩', title: 'Excel for SAD', text: 'Excel functions needed in the lab — English and Polish names.' },
      { href: '#/tips', icon: '💡', title: 'How to study', text: 'Study plan, a template for test solutions, typical mistakes.' }
    ],
    legend: SAD.md`
::: own | Markers used on this site
- {own} — **not** in the lecture/class materials: my plain-language explanations, extra examples, Python, advice.
- {lecture:W03} — content or example taken from that lecture.
- {ok} {doc} {ask} — next to the passing rules: where the information comes from and whether it is current.
- **Excel** code has an **EN / PL** switch (English or Polish function names); **Python** is always marked as an addition.
:::
`
  },

  ru: {
    kicker: 'Учебный год 2026/27 · зимний семестр',
    title: 'Статистический анализ данных — по-человечески',
    intro: SAD.md`
Здесь **все темы лекций** изложены обычным текстом (а не слайдами): с примерами, графиками и готовыми формулами **Excel**, которые можно скопировать. К каждой теме есть **конспект для занятий** (кнопка 📋) и **задачи с решениями**, составленные заново по логике задач с занятий.

Как пользоваться: прочитайте тему → решите задачи → перед занятием/коллоквиумом пробегитесь по конспекту.
`,
    news: SAD.md`
::: note | Новости — на 30.09.2026 (лекция 1)
- В этом году лекция **дистанционная и записывается**. {ok}
- Правила зачёта как в прошлом году; уточнили 10 дополнительных баллов: **4 за активность** (макс. 1 за занятие) и **6 за посещаемость**. {ok}
- **Коллоквиумы: занятие № 8 и № 14 вашей группы**, пересдача на последнем занятии. Даты — в [планере](#/course). {ok}
:::
`,
    ctaCourse: 'Как сдать предмет',
    ctaStart: 'Начать с темы 1',
    topicsTitle: 'Темы лекций',
    practiceTitle: 'Тренировка перед коллоквиумом',
    practice: [
      { href: '#/colloquium/1', icon: '📝', title: 'Пробный коллоквиум 1', text: 'Вариант в стиле коллоквиума на занятии № 8 — с баллами и решениями.' },
      { href: '#/colloquium/2', icon: '📝', title: 'Пробный коллоквиум 2', text: 'Вариант в стиле коллоквиума на занятии № 14 — интервалы, тесты, ЦПТ.' },
      { href: '#/tables', icon: 'Φ', title: 'Таблицы и калькуляторы', text: 'Φ(z), квантили Стьюдента и χ², распределение Пуассона + калькуляторы.' },
      { href: '#/excel', icon: '🟩', title: 'Excel для SAD', text: 'Функции Excel для лабораторных — английские и польские названия.' },
      { href: '#/tips', icon: '💡', title: 'Советы по учёбе', text: 'План, шаблон решения теста, типичные ошибки.' }
    ],
    legend: SAD.md`
::: own | Обозначения на сайте
- {own} — этого **нет** в материалах лекций/занятий: мои объяснения «по-человечески», дополнительные примеры, Python, советы.
- {lecture:W03} — содержание или пример взяты из этой лекции.
- {ok} {doc} {ask} — у правил зачёта: откуда информация и актуальна ли она.
- У кода **Excel** есть переключатель **EN / PL** (английские или польские названия функций), а **Python** всегда помечен как дополнение.
:::
`
  }
};
