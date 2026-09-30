/* Page: study tips (entirely the author's own advice) */
SAD.content = SAD.content || {};
SAD.content.tips = {
  pl: {
    kicker: 'Od autora strony',
    title: 'Jak się uczyć SAD, żeby zdać bez stresu',
    lead: 'Cała ta strona to moje rady — nie ma ich w materiałach przedmiotu. {own}',
    body: SAD.md`
::: own | Plan tygodniowy (15 tygodni)
1. **Po wykładzie** (30–40 min): przeczytaj odpowiedni temat na tej stronie, zrób 2–3 zadania.
2. **Przed ćwiczeniami** (10 min): przejrzyj konspekt 📋 tematu — na zajęciach szybciej ruszysz i łatwiej zdobędziesz punkt za aktywność.
3. **Po ćwiczeniach**: dokończ zadania z listy na tej stronie, zwłaszcza te, które na zajęciach „przeleciały”.
4. **Tydzień przed kolokwium**: próbne kolokwium na czas + powtórka konspektów.
:::

# Najważniejsze nawyki

- **Pisz schemat, nie tylko wynik.** Za poprawne założenia, hipotezy i zbiór krytyczny zwykle dostaje się punkty, nawet gdy rachunek się posypie.
- **Jednostki i nazwy.** Zawsze pisz, co jest czym: „$X$ — czas obsługi klienta [min], $X\sim N(\mu, 2)$”.
- **Zawsze tablice pod ręką.** Naucz się szybko czytać $\Phi(z)$, $t_{p,k}$ i $\chi^2_{p,k}$ — patrz [Tablice](#/tables).
- **Sprawdzaj sensowność:** prawdopodobieństwo w $[0;1]$, wariancja ≥ 0, suma w tabeli rozkładu = 1, dystrybuanta rośnie do 1.
- **Aktywność = 4 darmowe punkty.** Zgłaszaj się od pierwszych zajęć (max 1 pkt na zajęciach).
- **Nie opuszczaj ćwiczeń** — więcej niż 3 nieobecności to brak zaliczenia.

# Najczęstsze błędy (i jak ich uniknąć)

| błąd | poprawnie |
|---|---|
| $N(\mu,\sigma)$: wstawianie wariancji zamiast odchylenia | wariancja 144 → $\sigma = 12$ |
| $P(X\ge k) = 1 - P(X\le k)$ dla dyskretnych | $P(X\ge k) = 1 - P(X\le k-1)$ |
| wariancja z dzielnikiem $n$ | $s^2$ z dzielnikiem $n-1$ |
| $V(X-Y) = VX - VY$ | $V(X-Y) = VX+VY$ (niezależne) |
| dwustronny test z $z_{1-\alpha}$ | dwustronny → $z_{1-\alpha/2}$ |
| „przyjmujemy $H_0$” | „brak podstaw do odrzucenia $H_0$” |
| przedział dla proporcji z $p_0$ / test z $\hat p$ | przedział: $\hat p$; test: $p_0$ |
| test dwóch prób zamiast sparowanego | te same obiekty 2× → różnice $d_i$ |
| odwrotna kolejność kwantyli χ² w przedziale dla σ² | większy kwantyl w mianowniku lewego końca |

# Jak czytać treść zadania

- „co najmniej / co najwyżej / więcej niż / mniej niż” → od razu zapisz nierówność i sprawdź, czy wartość graniczna wchodzi.
- „średnio” → wartość oczekiwana; „ile spośród N” → $N\cdot p$.
- „zakładamy rozkład normalny, σ nieznane” → test/przedział t.
- „czy można twierdzić, że…” → to, co „twierdzimy”, idzie do $H_1$.

# Jak korzystać z tej strony

- W każdym temacie przycisk **📋 Konspekt** otwiera ściągę do druku.
- Zadania mają trzy poziomy pomocy: najpierw spróbuj sam → **Podpowiedź** → **Rozwiązanie**.
- Zaznacz temat jako **Przerobione** — na stronie głównej zobaczysz postęp (zapisuje się tylko w Twojej przeglądarce).
- Kod **Excel** przełączasz EN/PL, kod **Python** służy tylko do sprawdzania wyników w domu.

::: warn
Zadania na tej stronie są **ułożone od nowa** — nie przepisuj ich jako „rozwiązań list z zajęć”. Ucz się metody, a zadania z zajęć rozwiązuj samodzielnie.
:::
`
  },
  en: {
    kicker: 'From the site author',
    title: 'How to study SAD and pass without stress',
    lead: 'This whole page is my advice — it is not part of the course materials. {own}',
    body: SAD.md`
::: own | A weekly plan (15 weeks)
1. **After the lecture** (30–40 min): read the topic on this site, do 2–3 exercises.
2. **Before the class** (10 min): skim the topic’s cheat sheet 📋 — you will start faster and earn activity points more easily.
3. **After the class**: finish the exercises on this site, especially the ones that “flew by”.
4. **A week before a test**: a timed practice test + review of the cheat sheets.
:::

# Key habits

- **Write the template, not just the result.** Correct assumptions, hypotheses and critical region usually earn points even if the arithmetic fails.
- **Units and names.** Always state what is what: “$X$ — service time [min], $X\sim N(\mu, 2)$”.
- **Keep the tables at hand.** Learn to read $\Phi(z)$, $t_{p,k}$ and $\chi^2_{p,k}$ quickly — see [Tables](#/tables).
- **Sanity checks:** probability in $[0;1]$, variance ≥ 0, a distribution table sums to 1, a CDF grows to 1.
- **Activity = 4 free points.** Volunteer from the first classes (max 1 point per class).
- **Don’t skip classes** — more than 3 absences means failing.

# Most common mistakes

| mistake | correct |
|---|---|
| $N(\mu,\sigma)$: using the variance instead of σ | variance 144 → $\sigma = 12$ |
| $P(X\ge k) = 1 - P(X\le k)$ for discrete | $P(X\ge k) = 1 - P(X\le k-1)$ |
| variance with divisor $n$ | $s^2$ with divisor $n-1$ |
| $V(X-Y) = VX - VY$ | $V(X-Y) = VX+VY$ (independent) |
| two-sided test with $z_{1-\alpha}$ | two-sided → $z_{1-\alpha/2}$ |
| “we accept $H_0$” | “no grounds to reject $H_0$” |
| proportion interval with $p_0$ / test with $\hat p$ | interval: $\hat p$; test: $p_0$ |
| two-sample test instead of paired | same objects twice → differences $d_i$ |
| swapped χ² quantiles in the σ² interval | the larger quantile goes under the left end |

# Reading a problem

- “at least / at most / more than / less than” → write the inequality immediately and check whether the boundary is included.
- “on average” → expected value; “how many out of N” → $N\cdot p$.
- “assume normality, σ unknown” → t test / t interval.
- “can we claim that…” → what we “claim” goes into $H_1$.

# Using this site

- Every topic has a **📋 Cheat sheet** button (printable).
- Exercises have three levels of help: try yourself → **Hint** → **Solution**.
- Mark a topic as **Done** — the home page shows your progress (stored only in your browser).
- **Excel** code switches EN/PL; **Python** is only for checking results at home.

::: warn
The exercises here are **written from scratch** — don’t submit them as “solutions to the class lists”. Learn the method and solve the class problems yourself.
:::
`
  },
  ru: {
    kicker: 'От автора сайта',
    title: 'Как учить SAD и сдать без стресса',
    lead: 'Вся эта страница — мои советы, их нет в материалах курса. {own}',
    body: SAD.md`
::: own | План на неделю (15 недель)
1. **После лекции** (30–40 мин): прочитайте тему на этом сайте, решите 2–3 задачи.
2. **Перед занятием** (10 мин): пробегитесь по конспекту 📋 темы — на занятии быстрее включитесь и легче получите балл за активность.
3. **После занятия**: дорешайте задачи на сайте, особенно те, что «пролетели».
4. **За неделю до коллоквиума**: пробный коллоквиум на время + повторение конспектов.
:::

# Главные привычки

- **Пишите схему, а не только ответ.** За верные предпосылки, гипотезы и критическую область обычно дают баллы, даже если арифметика подвела.
- **Единицы и обозначения.** Всегда пишите, что есть что: «$X$ — время обслуживания [мин], $X\sim N(\mu, 2)$».
- **Таблицы под рукой.** Научитесь быстро читать $\Phi(z)$, $t_{p,k}$ и $\chi^2_{p,k}$ — см. [Таблицы](#/tables).
- **Проверка здравым смыслом:** вероятность в $[0;1]$, дисперсия ≥ 0, сумма в таблице = 1, функция распределения растёт до 1.
- **Активность = 4 бесплатных балла.** Выходите к доске с первых занятий (макс. 1 балл за занятие).
- **Не пропускайте занятия** — больше 3 пропусков означает незачёт.

# Самые частые ошибки

| ошибка | правильно |
|---|---|
| $N(\mu,\sigma)$: подстановка дисперсии вместо σ | дисперсия 144 → $\sigma = 12$ |
| $P(X\ge k) = 1 - P(X\le k)$ для дискретных | $P(X\ge k) = 1 - P(X\le k-1)$ |
| дисперсия с делителем $n$ | $s^2$ с делителем $n-1$ |
| $V(X-Y) = VX - VY$ | $V(X-Y) = VX+VY$ (независимые) |
| двусторонний тест с $z_{1-\alpha}$ | двусторонний → $z_{1-\alpha/2}$ |
| «принимаем $H_0$» | «нет оснований отвергнуть $H_0$» |
| интервал для доли с $p_0$ / тест с $\hat p$ | интервал: $\hat p$; тест: $p_0$ |
| тест двух выборок вместо парного | одни и те же объекты дважды → разности $d_i$ |
| перепутанные квантили χ² в интервале для σ² | больший квантиль — под левым концом |

# Как читать условие

- «не меньше / не больше / больше / меньше» → сразу запишите неравенство и проверьте, входит ли граница.
- «в среднем» → математическое ожидание; «сколько из N» → $N\cdot p$.
- «распределение нормальное, σ неизвестно» → t-тест / t-интервал.
- «можно ли утверждать, что…» → то, что «утверждаем», идёт в $H_1$.

# Как пользоваться сайтом

- В каждой теме кнопка **📋 Конспект** (можно распечатать).
- У задач три уровня помощи: сначала сами → **Подсказка** → **Решение**.
- Отмечайте тему как **Пройдено** — на главной виден прогресс (хранится только в вашем браузере).
- Код **Excel** переключается EN/PL, **Python** — только для проверки ответов дома.

::: warn
Задачи на этом сайте **составлены заново** — не сдавайте их как «решения списков с занятий». Учите метод, а задачи с занятий решайте сами.
:::
`
  }
};
