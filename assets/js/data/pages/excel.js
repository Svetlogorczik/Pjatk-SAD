/* Page: Excel guide for the course (lab ≈ 30% of classes) */
SAD.content = SAD.content || {};
SAD.content.excel = {
  pl: {
    kicker: 'Laboratorium',
    title: 'Excel na SAD',
    lead: 'Ok. 30% ćwiczeń to laboratorium w Excelu. Tu masz najważniejsze funkcje w jednym miejscu — z nazwami angielskimi i polskimi.',
    body: SAD.md`
::: warn own | Polska wersja Excela
W polskim Excelu: nazwy funkcji są **po polsku**, argumenty oddziela się **średnikiem**, a część dziesiętną **przecinkiem** (‹=ROZKŁ.NORMALNY.S(1,96;PRAWDA)›). Każdy blok kodu na tej stronie ma przełącznik **EN / PL**, który robi tę zamianę automatycznie. Jeśli jakaś polska nazwa nie działa w Twojej wersji — wstaw funkcję przez kreator *fx*.
:::

# Funkcje według tematów

| temat | EN | co robi |
|---|---|---|
| 1 | ‹AVERAGE›, ‹MEDIAN›, ‹MODE.SNGL› | średnia, mediana, moda |
| 1 | ‹VAR.S›, ‹STDEV.S› | wariancja i odchylenie próbkowe ($n-1$) |
| 1 | ‹QUARTILE.EXC›, ‹QUARTILE.INC› | kwartyle (dwie metody!) |
| 1 | ‹COUNTIF›, ‹COUNTIFS›, ‹FREQUENCY› | liczebności klas |
| 2 | ‹COMBIN›, ‹PERMUT›, ‹FACT› | kombinatoryka |
| 3 | ‹SUMPRODUCT› | $E(X)=\sum x_ip_i$ |
| 3 | ‹BINOM.DIST›, ‹POISSON.DIST› | rozkład dwumianowy, Poissona |
| 5 | ‹NORM.DIST›, ‹NORM.S.DIST›, ‹NORM.INV›, ‹NORM.S.INV› | rozkład normalny i kwantyle |
| 5 | ‹EXPON.DIST› | rozkład wykładniczy |
| 9 | ‹T.INV.2T›, ‹CHISQ.INV›, ‹CONFIDENCE.T› | kwantyle, przedziały ufności |
| 10–11 | ‹T.DIST›, ‹T.TEST›, ‹CHISQ.TEST› | p-wartości testów |
| 12 | ‹CORREL›, ‹SLOPE›, ‹INTERCEPT›, ‹RSQ›, ‹FORECAST› | korelacja i regresja |

# Przykład: pełna statystyka opisowa

~~~excel Dane w A2:A31
C2: =COUNT(A2:A31)
C3: =AVERAGE(A2:A31)
C4: =MEDIAN(A2:A31)
C5: =STDEV.S(A2:A31)
C6: =QUARTILE.EXC(A2:A31,1)
C7: =QUARTILE.EXC(A2:A31,3)
C8: =C7-C6                        // IQR
C9: =C6-1.5*C8                    // dolny płotek
C10: =C7+1.5*C8                   // górny płotek
~~~

# Przykład: prawdopodobieństwa

~~~excel Rozkłady
A1: =BINOM.DIST(2,10,0.1,TRUE)     // P(X <= 2), Bin(10; 0,1)
A2: =POISSON.DIST(3,1.8,FALSE)     // P(X = 3), Poisson(1,8)
A3: =NORM.DIST(80,65,12,TRUE)      // P(X <= 80), N(65; 12)
A4: =NORM.INV(0.8,65,12)           // kwantyl 0,8
A5: =T.INV.2T(0.05,6)              // t_{0,975; 6}
A6: =CHISQ.INV.RT(0.05,3)          // χ²_{0,95; 3}
~~~

::: tip own | Dodatek Analysis ToolPak
*Plik → Opcje → Dodatki → Dodatki programu Excel → Analysis ToolPak*. Potem w *Dane → Analiza danych* masz: Statystykę opisową, Histogram, testy t, Regresję — wszystko jednym kliknięciem.
:::

# Słownik funkcji EN ↔ PL {own}

@widget excel-dict
`
  },
  en: {
    kicker: 'Lab',
    title: 'Excel for SAD',
    lead: 'About 30% of classes are an Excel lab. Here are the key functions in one place — with English and Polish names.',
    body: SAD.md`
::: warn own | Polish Excel
In Polish Excel function names are **in Polish**, arguments are separated by a **semicolon** and decimals use a **comma** (‹=ROZKŁ.NORMALNY.S(1,96;PRAWDA)›). Every code block here has an **EN / PL** switch that converts automatically. If a Polish name doesn’t work in your version, insert the function via the *fx* wizard.
:::

# Functions by topic

| topic | EN | what it does |
|---|---|---|
| 1 | ‹AVERAGE›, ‹MEDIAN›, ‹MODE.SNGL› | mean, median, mode |
| 1 | ‹VAR.S›, ‹STDEV.S› | sample variance and SD ($n-1$) |
| 1 | ‹QUARTILE.EXC›, ‹QUARTILE.INC› | quartiles (two methods!) |
| 1 | ‹COUNTIF›, ‹COUNTIFS›, ‹FREQUENCY› | class counts |
| 2 | ‹COMBIN›, ‹PERMUT›, ‹FACT› | combinatorics |
| 3 | ‹SUMPRODUCT› | $E(X)=\sum x_ip_i$ |
| 3 | ‹BINOM.DIST›, ‹POISSON.DIST› | binomial, Poisson |
| 5 | ‹NORM.DIST›, ‹NORM.S.DIST›, ‹NORM.INV›, ‹NORM.S.INV› | normal distribution and quantiles |
| 5 | ‹EXPON.DIST› | exponential |
| 9 | ‹T.INV.2T›, ‹CHISQ.INV›, ‹CONFIDENCE.T› | quantiles, confidence intervals |
| 10–11 | ‹T.DIST›, ‹T.TEST›, ‹CHISQ.TEST› | p-values of tests |
| 12 | ‹CORREL›, ‹SLOPE›, ‹INTERCEPT›, ‹RSQ›, ‹FORECAST› | correlation and regression |

# Example: full descriptive statistics

~~~excel Data in A2:A31
C2: =COUNT(A2:A31)
C3: =AVERAGE(A2:A31)
C4: =MEDIAN(A2:A31)
C5: =STDEV.S(A2:A31)
C6: =QUARTILE.EXC(A2:A31,1)
C7: =QUARTILE.EXC(A2:A31,3)
C8: =C7-C6                        // IQR
C9: =C6-1.5*C8                    // lower fence
C10: =C7+1.5*C8                   // upper fence
~~~

# Example: probabilities

~~~excel Distributions
A1: =BINOM.DIST(2,10,0.1,TRUE)     // P(X <= 2), Bin(10; 0.1)
A2: =POISSON.DIST(3,1.8,FALSE)     // P(X = 3), Poisson(1.8)
A3: =NORM.DIST(80,65,12,TRUE)      // P(X <= 80), N(65; 12)
A4: =NORM.INV(0.8,65,12)           // 0.8 quantile
A5: =T.INV.2T(0.05,6)              // t_{0.975; 6}
A6: =CHISQ.INV.RT(0.05,3)          // χ²_{0.95; 3}
~~~

::: tip own | Analysis ToolPak add-in
*File → Options → Add-ins → Excel Add-ins → Analysis ToolPak*. Then *Data → Data Analysis* gives Descriptive Statistics, Histogram, t tests, Regression — all in one click.
:::

# EN ↔ PL function dictionary {own}

@widget excel-dict
`
  },
  ru: {
    kicker: 'Лабораторные',
    title: 'Excel для SAD',
    lead: 'Около 30% занятий — лабораторные в Excel. Здесь главные функции в одном месте — с английскими и польскими названиями.',
    body: SAD.md`
::: warn own | Польский Excel
В польском Excel названия функций **польские**, аргументы разделяются **точкой с запятой**, а дробная часть — **запятой** (‹=ROZKŁ.NORMALNY.S(1,96;PRAWDA)›). У каждого блока кода есть переключатель **EN / PL**, который делает замену автоматически. Если польское название не работает в вашей версии — вставьте функцию через мастер *fx*.
:::

# Функции по темам

| тема | EN | что делает |
|---|---|---|
| 1 | ‹AVERAGE›, ‹MEDIAN›, ‹MODE.SNGL› | среднее, медиана, мода |
| 1 | ‹VAR.S›, ‹STDEV.S› | выборочная дисперсия и отклонение ($n-1$) |
| 1 | ‹QUARTILE.EXC›, ‹QUARTILE.INC› | квартили (два метода!) |
| 1 | ‹COUNTIF›, ‹COUNTIFS›, ‹FREQUENCY› | частоты классов |
| 2 | ‹COMBIN›, ‹PERMUT›, ‹FACT› | комбинаторика |
| 3 | ‹SUMPRODUCT› | $E(X)=\sum x_ip_i$ |
| 3 | ‹BINOM.DIST›, ‹POISSON.DIST› | биномиальное, Пуассона |
| 5 | ‹NORM.DIST›, ‹NORM.S.DIST›, ‹NORM.INV›, ‹NORM.S.INV› | нормальное и квантили |
| 5 | ‹EXPON.DIST› | показательное |
| 9 | ‹T.INV.2T›, ‹CHISQ.INV›, ‹CONFIDENCE.T› | квантили, доверительные интервалы |
| 10–11 | ‹T.DIST›, ‹T.TEST›, ‹CHISQ.TEST› | p-значения тестов |
| 12 | ‹CORREL›, ‹SLOPE›, ‹INTERCEPT›, ‹RSQ›, ‹FORECAST› | корреляция и регрессия |

# Пример: описательная статистика

~~~excel Данные в A2:A31
C2: =COUNT(A2:A31)
C3: =AVERAGE(A2:A31)
C4: =MEDIAN(A2:A31)
C5: =STDEV.S(A2:A31)
C6: =QUARTILE.EXC(A2:A31,1)
C7: =QUARTILE.EXC(A2:A31,3)
C8: =C7-C6                        // IQR
C9: =C6-1.5*C8                    // нижний забор
C10: =C7+1.5*C8                   // верхний забор
~~~

# Пример: вероятности

~~~excel Распределения
A1: =BINOM.DIST(2,10,0.1,TRUE)     // P(X <= 2), Bin(10; 0,1)
A2: =POISSON.DIST(3,1.8,FALSE)     // P(X = 3), Пуассон(1,8)
A3: =NORM.DIST(80,65,12,TRUE)      // P(X <= 80), N(65; 12)
A4: =NORM.INV(0.8,65,12)           // квантиль 0,8
A5: =T.INV.2T(0.05,6)              // t_{0,975; 6}
A6: =CHISQ.INV.RT(0.05,3)          // χ²_{0,95; 3}
~~~

::: tip own | Надстройка Analysis ToolPak
*Файл → Параметры → Надстройки → Надстройки Excel → Пакет анализа*. Затем в *Данные → Анализ данных*: описательная статистика, гистограмма, t-тесты, регрессия — в один клик.
:::

# Словарь функций EN ↔ PL {own}

@widget excel-dict
`
  }
};
