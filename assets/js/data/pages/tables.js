/* Page: statistical tables and calculators (values computed in the browser by lib/stats.js) */
SAD.content = SAD.content || {};
SAD.content.tables = {
  pl: {
    kicker: 'Narzędzia',
    title: 'Tablice statystyczne i kalkulatory',
    lead: 'Te same tablice, co na zajęciach — plus kalkulatory, które liczą dokładnie (bez interpolacji).',
    body: SAD.md`
::: own | Skąd te liczby?
Tablice na tej stronie są **liczone na żywo** w przeglądarce (algorytmy numeryczne, dokładność ≥ 4 miejsc po przecinku) — zgadzają się z drukowanymi tablicami z materiałów przedmiotu. Na kolokwium korzystaj z tego, na co pozwoli prowadzący. {ask}
:::

# Kalkulatory

::: grid
@widget calc-normal
@widget calc-t
@widget calc-chi2
@widget calc-binom
@widget calc-poisson
:::

# Najczęściej potrzebne kwantyle N(0, 1)

| poziom | $1-\alpha = 0{,}90$ | $0{,}95$ | $0{,}98$ | $0{,}99$ |
|---|---:|---:|---:|---:|
| test/przedział **dwustronny**: $z_{1-\alpha/2}$ | 1,645 | 1,960 | 2,326 | 2,576 |
| test **jednostronny**: $z_{1-\alpha}$ | 1,282 | 1,645 | 2,054 | 2,326 |

# Dystrybuanta rozkładu N(0, 1): Φ(z)

Wiersz = z z dokładnością do 0,1; kolumna = druga cyfra po przecinku. Przykład: $\Phi(1{,}96)$ → wiersz 1,9, kolumna 0,06 → **0,9750**.

::: tip | Ujemne z
Tablica ma tylko $z \ge 0$. Dla ujemnych: $\Phi(-z) = 1-\Phi(z)$, np. $\Phi(-1{,}25) = 1-0{,}8944 = 0{,}1056$.
:::

@widget table-phi

# Kwantyle rozkładu t-Studenta: $t_{p,\,k}$

$P(T \le t_{p,k}) = p$, gdzie $k$ = liczba stopni swobody (np. $n-1$). Dla $k>30$ rozkład t jest prawie normalny. Przykład: przedział 95% przy $n=5$ → $t_{0{,}975;\,4} = 2{,}776$.

@widget table-t

# Kwantyle rozkładu chi-kwadrat: $\chi^2_{p,\,k}$

$P(\chi^2 \le \chi^2_{p,k}) = p$. Uwaga: rozkład nie jest symetryczny, więc do przedziału dla wariancji potrzebujesz **dwóch** różnych kwantyli: $\chi^2_{\alpha/2}$ i $\chi^2_{1-\alpha/2}$.

@widget table-chi2

# Rozkład Poissona

Wykład korzysta z $F(k;\lambda) = P(X\le k)$ {lecture:W03}; przełącz na $P(X=k)$, jeśli potrzebujesz pojedynczych prawdopodobieństw.

@widget table-poisson
`
  },

  en: {
    kicker: 'Tools',
    title: 'Statistical tables and calculators',
    lead: 'The same tables as in class — plus calculators that compute exactly (no interpolation).',
    body: SAD.md`
::: own | Where do the numbers come from?
The tables here are **computed live** in your browser (numerical algorithms, accuracy ≥ 4 decimals) — they match the printed tables from the course materials. In a test use only what your instructor allows. {ask}
:::

# Calculators

::: grid
@widget calc-normal
@widget calc-t
@widget calc-chi2
@widget calc-binom
@widget calc-poisson
:::

# Most used quantiles of N(0, 1)

| level | $1-\alpha = 0.90$ | $0.95$ | $0.98$ | $0.99$ |
|---|---:|---:|---:|---:|
| **two-sided** test/interval: $z_{1-\alpha/2}$ | 1.645 | 1.960 | 2.326 | 2.576 |
| **one-sided** test: $z_{1-\alpha}$ | 1.282 | 1.645 | 2.054 | 2.326 |

# CDF of N(0, 1): Φ(z)

Row = z to one decimal; column = second decimal. Example: $\Phi(1.96)$ → row 1.9, column 0.06 → **0.9750**.

::: tip | Negative z
The table only has $z \ge 0$. For negative values: $\Phi(-z) = 1-\Phi(z)$, e.g. $\Phi(-1.25) = 1-0.8944 = 0.1056$.
:::

@widget table-phi

# Quantiles of Student’s t: $t_{p,\,k}$

$P(T \le t_{p,k}) = p$, where $k$ = degrees of freedom (e.g. $n-1$). For $k>30$ the t distribution is almost normal. Example: a 95% interval with $n=5$ → $t_{0.975;\,4} = 2.776$.

@widget table-t

# Chi-square quantiles: $\chi^2_{p,\,k}$

$P(\chi^2 \le \chi^2_{p,k}) = p$. Note: the distribution is not symmetric, so an interval for the variance needs **two** different quantiles: $\chi^2_{\alpha/2}$ and $\chi^2_{1-\alpha/2}$.

@widget table-chi2

# Poisson distribution

The lecture uses $F(k;\lambda) = P(X\le k)$ {lecture:W03}; switch to $P(X=k)$ for single probabilities.

@widget table-poisson
`
  },

  ru: {
    kicker: 'Инструменты',
    title: 'Статистические таблицы и калькуляторы',
    lead: 'Те же таблицы, что на занятиях, — плюс калькуляторы, которые считают точно (без интерполяции).',
    body: SAD.md`
::: own | Откуда эти числа?
Таблицы на этой странице **вычисляются прямо в браузере** (численные алгоритмы, точность ≥ 4 знаков) — они совпадают с печатными таблицами из материалов курса. На коллоквиуме пользуйтесь тем, что разрешит преподаватель. {ask}
:::

# Калькуляторы

::: grid
@widget calc-normal
@widget calc-t
@widget calc-chi2
@widget calc-binom
@widget calc-poisson
:::

# Самые нужные квантили N(0, 1)

| уровень | $1-\alpha = 0{,}90$ | $0{,}95$ | $0{,}98$ | $0{,}99$ |
|---|---:|---:|---:|---:|
| **двусторонний** тест/интервал: $z_{1-\alpha/2}$ | 1,645 | 1,960 | 2,326 | 2,576 |
| **односторонний** тест: $z_{1-\alpha}$ | 1,282 | 1,645 | 2,054 | 2,326 |

# Функция распределения N(0, 1): Φ(z)

Строка = z с точностью до 0,1; столбец = вторая цифра после запятой. Пример: $\Phi(1{,}96)$ → строка 1,9, столбец 0,06 → **0,9750**.

::: tip | Отрицательные z
В таблице только $z \ge 0$. Для отрицательных: $\Phi(-z) = 1-\Phi(z)$, например $\Phi(-1{,}25) = 1-0{,}8944 = 0{,}1056$.
:::

@widget table-phi

# Квантили распределения Стьюдента: $t_{p,\,k}$

$P(T \le t_{p,k}) = p$, где $k$ — число степеней свободы (например, $n-1$). При $k>30$ распределение t почти нормальное. Пример: 95% интервал при $n=5$ → $t_{0{,}975;\,4} = 2{,}776$.

@widget table-t

# Квантили хи-квадрат: $\chi^2_{p,\,k}$

$P(\chi^2 \le \chi^2_{p,k}) = p$. Внимание: распределение несимметрично, поэтому для интервала дисперсии нужны **два** разных квантиля: $\chi^2_{\alpha/2}$ и $\chi^2_{1-\alpha/2}$.

@widget table-chi2

# Распределение Пуассона

В лекции используется $F(k;\lambda) = P(X\le k)$ {lecture:W03}; переключитесь на $P(X=k)$, если нужны отдельные вероятности.

@widget table-poisson
`
  }
};
