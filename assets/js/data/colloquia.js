/*
 * Practice tests. Written by the site author following the LOGIC of the sample tests
 * (C08 — test 1, C14 — test 2) with new stories and numbers. Loaded on demand.
 */
(function () {
  var md = SAD.md;

  function fKol1(x) { return x >= 0 && x <= 1 ? 0.5 : (x > 1 && x <= 3 ? (3 - x) / 4 : 0); }

  var charts1 = {
    k1dens: { type: 'pdf', dist: fKol1, range: [-0.5, 3.5], steps: 500, ymax: 0.7,
      shade: [{ from: 2, to: 3, label: '0,125', labelY: 0.05 }], xLabel: 'x', yLabel: 'f(x)' },
    k1cdf: { type: 'cdf', dist: { name: 'custom', cdf: function (x) { return x < 0 ? 0 : x <= 1 ? x / 2 : x <= 3 ? 0.5 + (6 * x - x * x - 5) / 8 : 1; } }, range: [-0.5, 3.5], xLabel: 'x' }
  };

  var intro1 = {
    pl: md`
::: own | O tym zestawie
Zestaw ułożony przez autora strony na wzór **przykładowego kolokwium 1** (zajęcia nr 8): wzór na prawdopodobieństwo całkowite + Bayes, rozkład normalny, gęstość i dystrybuanta. Zadanie 4 (zmienna dyskretna) dodałem, bo materiał zajęć 3–7 też może się pojawić. Punktacja jest orientacyjna (razem 45 pkt, jak na prawdziwym kolokwium). {own}
:::

**Jak ćwiczyć:** ustaw stoper na 90 minut {ask}, rozwiąż wszystko na kartce z tablicami, dopiero potem sprawdź rozwiązania. Pamiętaj: do zaliczenia potrzebujesz **min. 20 pkt**, do oceny 4+ — **min. 25 pkt**.
`,
    en: md`
::: own | About this set
Written by the site author following the **sample test 1** (class no. 8): total probability + Bayes, the normal distribution, density and CDF. I added exercise 4 (a discrete variable) because material from classes 3–7 may also appear. The points are indicative (45 in total, as in the real test). {own}
:::

**How to practise:** set a 90-minute timer {ask}, solve everything on paper with the tables, and only then check the solutions. Remember: you need **at least 20 points** to pass and **at least 25** for grade 4+.
`,
    ru: md`
::: own | Об этом варианте
Вариант составлен автором сайта по образцу **примерного коллоквиума 1** (занятие № 8): формула полной вероятности + Байес, нормальное распределение, плотность и функция распределения. Задачу 4 (дискретная величина) я добавил, потому что может встретиться материал занятий 3–7. Баллы ориентировочные (всего 45, как на настоящем коллоквиуме). {own}
:::

**Как тренироваться:** поставьте таймер на 90 минут {ask}, решите всё на бумаге с таблицами и только потом смотрите решения. Помните: для зачёта нужно **не меньше 20 баллов**, для оценки 4+ — **не меньше 25**.
`
  };

  var kol1 = {
    charts: charts1,
    pl: {
      title: 'Kolokwium 1 — zestaw próbny',
      intro: intro1.pl,
      tasks: [
        {
          id: 'k1', points: 11, title: 'Filtr antyspamowy',
          text: md`
30% przychodzących maili to spam. Filtr oznacza jako spam 95% maili będących spamem, ale także 2% zwykłych maili. Jakie jest prawdopodobieństwo, że losowy mail **trafi do skrzynki odbiorczej** (nie zostanie oznaczony)? Oblicz prawdopodobieństwo, że mail, który trafił do skrzynki, **nie jest spamem**.
`,
          hint: md`Hipotezy: spam (0,3) / zwykły (0,7). Zdarzenie: „nieoznaczony” — dla spamu 0,05, dla zwykłego 0,98.`,
          solution: md`
$S$ — spam, $Z$ — zwykły, $N$ — mail nieoznaczony (trafia do skrzynki).
$$P(N) = P(S)P(N\mid S)+P(Z)P(N\mid Z) = 0{,}3\cdot0{,}05+0{,}7\cdot0{,}98 = 0{,}015+0{,}686 = 0{,}701$$
$$P(Z\mid N) = \frac{0{,}686}{0{,}701}\approx0{,}979$$
Około 2,1% maili w skrzynce to wciąż spam.
`,
          answer: md`$P(N)=0{,}701$; $P(Z\mid N)\approx0{,}979$.`
        },
        {
          id: 'k2', points: 12, title: 'Czas pracy baterii (rozkład normalny)',
          text: md`
Czas pracy baterii telefonu na jednym ładowaniu ma rozkład normalny ze średnią 18 h i odchyleniem standardowym 2 h.
a) Ile średnio spośród 200 baterii będzie działać krócej niż 15,5 h?
b) Jakie jest prawdopodobieństwo, że losowa bateria działa od 14 do 19 h?
c) Wyznacz czas pracy, który osiąga co najmniej 90% baterii.
`,
          hint: md`c) Szukasz $t$ z $P(X\ge t) = 0{,}9$, czyli kwantyla rzędu 0,1: $t = \mu - 1{,}2816\,\sigma$.`,
          solution: md`
a) $P(X<15{,}5) = \Phi(-1{,}25) = 0{,}1056$; $200\cdot0{,}1056\approx21$ baterii.
b) $P(14<X<19) = \Phi(0{,}5)-\Phi(-2) = 0{,}6915-0{,}0228 = 0{,}6687$.
c) $t = 18 - 1{,}2816\cdot2\approx15{,}44$ h.
`,
          answer: md`a) ≈ 21; b) ≈ 0,669; c) ≈ 15,4 h.`
        },
        {
          id: 'k3', points: 11, title: 'Gęstość z parametrem',
          text: md`
Dobierz stałą $a$ tak, aby funkcja
$$f(x) = \begin{cases}a, & 0\le x\le1\\ \dfrac{a(3-x)}{2}, & 1<x\le3\\ 0, & \text{poza tym}\end{cases}$$
była gęstością zmiennej losowej $X$. Wyznacz i narysuj dystrybuantę, oblicz $P(X>2)$ i podaj medianę.
`,
          hint: md`Pole = pole prostokąta $[0;1]$ + pole trójkąta nad $[1;3]$.`,
          solution: md`
$\int_0^1a\,dx + \int_1^3\frac{a(3-x)}{2}dx = a + a = 2a = 1\Rightarrow a = \frac12$.
$$F(x) = \begin{cases}0 & x<0\\ \frac x2 & 0\le x\le1\\ \frac12+\frac{6x-x^2-5}{8} & 1<x\le3\\ 1 & x>3\end{cases}$$
$P(X>2) = 1-F(2) = 1-\left(\frac12+\frac38\right) = \frac18$. Mediana: $F(1) = \frac12$ → **mediana = 1**.

@chart k1dens

@chart k1cdf
`,
          answer: md`$a=\frac12$; $P(X>2)=0{,}125$; mediana = 1.`
        },
        {
          id: 'k4', points: 11, own: true, title: 'Uszkodzone paczki (dwumianowy i Poisson)',
          text: md`
Paczka zostaje uszkodzona w transporcie z prawdopodobieństwem 0,08, niezależnie od innych. Kurier wiezie 50 paczek. Podaj rozkład liczby uszkodzonych paczek $X$, jego wartość oczekiwaną i wariancję. Oblicz $P(X\le2)$ dokładnie i przybliżeniem Poissona.
`,
          hint: md`$X\sim$ Bin(50; 0,08), $\lambda = np = 4$.`,
          solution: md`
$X\sim$ Bin(50; 0,08), $E(X) = 4$, $V(X) = 50\cdot0{,}08\cdot0{,}92 = 3{,}68$.
Dokładnie: $P(X\le2) = \sum_{k=0}^2\binom{50}{k}0{,}08^k0{,}92^{50-k}\approx0{,}226$.
Poisson: $e^{-4}\left(1+4+\frac{16}{2}\right) = 13e^{-4}\approx0{,}238$.
`,
          answer: md`Bin(50; 0,08), $E=4$, $V=3{,}68$; $P(X\le2)\approx0{,}226$ (Poisson ≈ 0,238).`
        }
      ]
    },
    en: {
      title: 'Test 1 — practice set',
      intro: intro1.en,
      tasks: [
        {
          id: 'k1', points: 11, title: 'A spam filter',
          text: md`
30% of incoming e-mails are spam. A filter flags 95% of spam e-mails, but also 2% of normal e-mails. What is the probability that a random e-mail **reaches the inbox** (is not flagged)? Find the probability that an e-mail in the inbox **is not spam**.
`,
          hint: md`Hypotheses: spam (0.3) / normal (0.7). Event “not flagged”: 0.05 for spam, 0.98 for normal.`,
          solution: md`
$S$ — spam, $Z$ — normal, $N$ — not flagged.
$$P(N) = 0.3\cdot0.05+0.7\cdot0.98 = 0.015+0.686 = 0.701$$
$$P(Z\mid N) = \frac{0.686}{0.701}\approx0.979$$
About 2.1% of the e-mails in the inbox are still spam.
`,
          answer: md`$P(N)=0.701$; $P(Z\mid N)\approx0.979$.`
        },
        {
          id: 'k2', points: 12, title: 'Battery life (normal distribution)',
          text: md`
A phone battery’s life on one charge is normal with mean 18 h and standard deviation 2 h.
a) On average, how many of 200 batteries last less than 15.5 h?
b) What is the probability that a random battery lasts between 14 and 19 h?
c) Find the life reached by at least 90% of batteries.
`,
          hint: md`c) You need $t$ with $P(X\ge t) = 0.9$, i.e. the 0.1 quantile: $t = \mu - 1.2816\,\sigma$.`,
          solution: md`
a) $\Phi(-1.25) = 0.1056$; $200\cdot0.1056\approx21$ batteries.
b) $\Phi(0.5)-\Phi(-2) = 0.6915-0.0228 = 0.6687$.
c) $t = 18 - 1.2816\cdot2\approx15.44$ h.
`,
          answer: md`a) ≈ 21; b) ≈ 0.669; c) ≈ 15.4 h.`
        },
        {
          id: 'k3', points: 11, title: 'A density with a parameter',
          text: md`
Choose $a$ so that
$$f(x) = \begin{cases}a, & 0\le x\le1\\ \dfrac{a(3-x)}{2}, & 1<x\le3\\ 0, & \text{elsewhere}\end{cases}$$
is the density of a random variable $X$. Find and sketch the CDF, compute $P(X>2)$ and give the median.
`,
          hint: md`Area = rectangle over $[0;1]$ + triangle over $[1;3]$.`,
          solution: md`
$a + a = 2a = 1\Rightarrow a = \frac12$.
$$F(x) = \begin{cases}0 & x<0\\ \frac x2 & 0\le x\le1\\ \frac12+\frac{6x-x^2-5}{8} & 1<x\le3\\ 1 & x>3\end{cases}$$
$P(X>2) = 1-\left(\frac12+\frac38\right) = \frac18$. Median: $F(1) = \frac12$ → **median = 1**.

@chart k1dens

@chart k1cdf
`,
          answer: md`$a=\frac12$; $P(X>2)=0.125$; median = 1.`
        },
        {
          id: 'k4', points: 11, own: true, title: 'Damaged parcels (binomial and Poisson)',
          text: md`
A parcel is damaged in transport with probability 0.08, independently of others. A courier carries 50 parcels. Give the distribution of the number of damaged parcels $X$, its expected value and variance. Compute $P(X\le2)$ exactly and with the Poisson approximation.
`,
          hint: md`$X\sim$ Bin(50; 0.08), $\lambda = np = 4$.`,
          solution: md`
$E(X) = 4$, $V(X) = 3.68$. Exactly: $P(X\le2)\approx0.226$. Poisson: $13e^{-4}\approx0.238$.
`,
          answer: md`Bin(50; 0.08), $E=4$, $V=3.68$; $P(X\le2)\approx0.226$ (Poisson ≈ 0.238).`
        }
      ]
    },
    ru: {
      title: 'Коллоквиум 1 — пробный вариант',
      intro: intro1.ru,
      tasks: [
        {
          id: 'k1', points: 11, title: 'Спам-фильтр',
          text: md`
30% входящих писем — спам. Фильтр помечает 95% спам-писем, но также 2% обычных писем. Какова вероятность, что случайное письмо **попадёт во входящие** (не будет помечено)? Найдите вероятность того, что письмо во входящих **не спам**.
`,
          hint: md`Гипотезы: спам (0,3) / обычное (0,7). Событие «не помечено»: 0,05 для спама, 0,98 для обычного.`,
          solution: md`
$S$ — спам, $Z$ — обычное, $N$ — не помечено.
$$P(N) = 0{,}3\cdot0{,}05+0{,}7\cdot0{,}98 = 0{,}015+0{,}686 = 0{,}701$$
$$P(Z\mid N) = \frac{0{,}686}{0{,}701}\approx0{,}979$$
Около 2,1% писем во входящих — всё ещё спам.
`,
          answer: md`$P(N)=0{,}701$; $P(Z\mid N)\approx0{,}979$.`
        },
        {
          id: 'k2', points: 12, title: 'Время работы батареи (нормальное распределение)',
          text: md`
Время работы батареи телефона на одном заряде распределено нормально со средним 18 ч и стандартным отклонением 2 ч.
а) Сколько в среднем из 200 батарей проработают меньше 15,5 ч?
б) Какова вероятность, что случайная батарея проработает от 14 до 19 ч?
в) Найдите время работы, которого достигают не меньше 90% батарей.
`,
          hint: md`в) Нужно $t$ с $P(X\ge t) = 0{,}9$, т.е. квантиль порядка 0,1: $t = \mu - 1{,}2816\,\sigma$.`,
          solution: md`
а) $\Phi(-1{,}25) = 0{,}1056$; $200\cdot0{,}1056\approx21$ батарея.
б) $\Phi(0{,}5)-\Phi(-2) = 0{,}6915-0{,}0228 = 0{,}6687$.
в) $t = 18 - 1{,}2816\cdot2\approx15{,}44$ ч.
`,
          answer: md`а) ≈ 21; б) ≈ 0,669; в) ≈ 15,4 ч.`
        },
        {
          id: 'k3', points: 11, title: 'Плотность с параметром',
          text: md`
Подберите $a$ так, чтобы
$$f(x) = \begin{cases}a, & 0\le x\le1\\ \dfrac{a(3-x)}{2}, & 1<x\le3\\ 0, & \text{иначе}\end{cases}$$
была плотностью случайной величины $X$. Найдите и нарисуйте функцию распределения, найдите $P(X>2)$ и медиану.
`,
          hint: md`Площадь = прямоугольник над $[0;1]$ + треугольник над $[1;3]$.`,
          solution: md`
$a + a = 2a = 1\Rightarrow a = \frac12$.
$$F(x) = \begin{cases}0 & x<0\\ \frac x2 & 0\le x\le1\\ \frac12+\frac{6x-x^2-5}{8} & 1<x\le3\\ 1 & x>3\end{cases}$$
$P(X>2) = 1-\left(\frac12+\frac38\right) = \frac18$. Медиана: $F(1) = \frac12$ → **медиана = 1**.

@chart k1dens

@chart k1cdf
`,
          answer: md`$a=\frac12$; $P(X>2)=0{,}125$; медиана = 1.`
        },
        {
          id: 'k4', points: 11, own: true, title: 'Повреждённые посылки (биномиальное и Пуассон)',
          text: md`
Посылка повреждается при перевозке с вероятностью 0,08 независимо от других. Курьер везёт 50 посылок. Укажите распределение числа повреждённых посылок $X$, его математическое ожидание и дисперсию. Найдите $P(X\le2)$ точно и приближением Пуассона.
`,
          hint: md`$X\sim$ Bin(50; 0,08), $\lambda = np = 4$.`,
          solution: md`
$E(X) = 4$, $V(X) = 3{,}68$. Точно: $P(X\le2)\approx0{,}226$. Пуассон: $13e^{-4}\approx0{,}238$.
`,
          answer: md`Bin(50; 0,08), $E=4$, $V=3{,}68$; $P(X\le2)\approx0{,}226$ (Пуассон ≈ 0,238).`
        }
      ]
    }
  };

  /* ======================================================================= */
  var intro2 = {
    pl: md`
::: own | O tym zestawie
Zestaw autorski na wzór **przykładowego kolokwium 2** (zajęcia nr 14): przedział ufności, test dla wariancji, rozkład dwumianowy + CTG, rozkład dwuwymiarowy. Punktacja jak w przykładzie (11 + 11 + 12 + 11 = 45 pkt). {own}
:::

**Jak ćwiczyć:** rozwiązuj z tablicami rozkładu normalnego, t-Studenta i χ² (są na stronie [Tablice](#/tables)). Przy testach zawsze pisz pełny schemat: hipotezy → statystyka → wartość → zbiór krytyczny → decyzja.
`,
    en: md`
::: own | About this set
The author’s set following **sample test 2** (class no. 14): a confidence interval, a variance test, binomial + CLT, a two-dimensional distribution. Points as in the sample (11 + 11 + 12 + 11 = 45). {own}
:::

**How to practise:** use the normal, Student’s t and χ² tables (see [Tables](#/tables)). For tests always write the full template: hypotheses → statistic → value → critical region → decision.
`,
    ru: md`
::: own | Об этом варианте
Авторский вариант по образцу **примерного коллоквиума 2** (занятие № 14): доверительный интервал, тест для дисперсии, биномиальное + ЦПТ, двумерное распределение. Баллы как в образце (11 + 11 + 12 + 11 = 45). {own}
:::

**Как тренироваться:** решайте с таблицами нормального, Стьюдента и χ² распределений (страница [Таблицы](#/tables)). В тестах всегда пишите полную схему: гипотезы → статистика → значение → критическая область → решение.
`
  };

  var kol2 = {
    pl: {
      title: 'Kolokwium 2 — zestaw próbny',
      intro: intro2.pl,
      tasks: [
        {
          id: 'k1', points: 11, title: 'Czas odpowiedzi API — przedział ufności',
          text: md`
Zmierzono czas odpowiedzi serwera API dla 20 losowych zapytań: $\bar x = 240$ ms, $s = 15$ ms. Zakładając normalność czasu odpowiedzi, wyznacz 95% realizację przedziału ufności dla średniego czasu odpowiedzi.
`,
          hint: md`$\sigma$ nieznane → rozkład t z 19 st. sw.: $t_{0{,}975;19} = 2{,}093$.`,
          solution: md`
Model: rozkład normalny, $\sigma$ nieznane → $\bar x\pm t_{1-\alpha/2,\,n-1}\frac{s}{\sqrt n}$.
$t_{0{,}975;19} = 2{,}093$, $\frac{s}{\sqrt n} = \frac{15}{\sqrt{20}}\approx3{,}354$; połowa długości $\approx7{,}02$.
$$[240-7{,}02;\ 240+7{,}02] = [232{,}98;\ 247{,}02]\ \text{ms}$$
Z ufnością 95% średni czas odpowiedzi mieści się między ok. 233 a 247 ms ($n=20$).
`,
          answer: md`[232,98; 247,02] ms.`
        },
        {
          id: 'k2', points: 11, title: 'Zmienność czasu ładowania — test dla odchylenia',
          text: md`
W 10 doświadczeniach zmierzono wydłużenie czasu ładowania telefonu po aktualizacji (min): 4, 9, 3, 8, 6, 2, 7, 5, 10, 6. Wysunięto hipotezę, że odchylenie standardowe wydłużenia jest **większe niż 2 min**. Zakładając normalność, zweryfikuj ją na poziomie istotności 0,1.
`,
          hint: md`$\sigma>2 \Leftrightarrow \sigma^2>4$. $\chi^2_{0{,}9;9} = 14{,}684$.`,
          solution: md`
$\bar x = 6$, $\sum(x_i-\bar x)^2 = 60$, $s^2 = \frac{60}{9}\approx6{,}667$.
1. $H_0:\ \sigma^2 = 4$, $H_1:\ \sigma^2>4$.
2. $\chi^2 = \frac{(n-1)S^2}{\sigma_0^2}\sim\chi^2_9$ przy $H_0$.
3. $\chi^2 = \frac{60}{4} = 15{,}0$.
4. $C = [14{,}684;\infty)$.
5. $15{,}0\in C$ → **odrzucamy $H_0$**: na poziomie 0,1 odchylenie standardowe wydłużenia jest większe niż 2 min.
`,
          answer: md`$\chi^2 = 15{,}0\ge14{,}684$ → odrzucamy $H_0$.`
        },
        {
          id: 'k3', points: 12, title: 'Leworęczni w próbie — dokładnie i z CTG',
          text: md`
W pewnej populacji 8% osób jest leworęcznych. Niech $X$ — liczba leworęcznych w losowej próbie 150 osób. Podaj rozkład $X$. Zapisz wzór na **dokładną** wartość prawdopodobieństwa, że w próbie jest co najwyżej 8 leworęcznych, i podaj jej wartość przybliżoną z CTG.
`,
          hint: md`$np = 12$, $\sqrt{np(1-p)} = \sqrt{11{,}04}\approx3{,}32$. Zastosuj poprawkę ciągłości.`,
          solution: md`
$X\sim$ Bin(150; 0,08).
Dokładnie: $P(X\le8) = \sum_{k=0}^{8}\binom{150}{k}0{,}08^k\,0{,}92^{150-k}$ ($\approx0{,}144$).
CTG z poprawką: $P(X\le8)\approx\Phi\left(\frac{8{,}5-12}{3{,}32}\right) = \Phi(-1{,}05)\approx0{,}146$.
`,
          answer: md`Bin(150; 0,08); wzór $\sum_{k=0}^8\binom{150}{k}0{,}08^k0{,}92^{150-k}$; CTG ≈ 0,146.`
        },
        {
          id: 'k4', points: 11, title: 'Rozkład dwuwymiarowy — warunki i niezależność',
          text: md`
Rozkład zmiennej $(X, Y)$:

| X \ Y | −1 | 0 | 1 |
|---|---:|---:|---:|
| **−1** | 0,05 | 0,15 | 0,10 |
| **0** | 0,10 | 0,20 | 0,10 |
| **1** | 0,05 | 0,15 | 0,10 |

a) Wyznacz rozkład warunkowy $Y$ pod warunkiem $X = 0$.
b) Oblicz $P(X = 1\mid X+Y>0)$.
c) Sprawdź, czy $X$ i $Y$ są niezależne. Oblicz $\mathrm{Cov}(X,Y)$ — co zauważasz?
`,
          hint: md`b) $X+Y>0$ zachodzi w komórkach (0, 1), (1, 0), (1, 1).`,
          solution: md`
**a)** Wiersz $X=0$: 0,10; 0,20; 0,10 (suma 0,40) → $P(Y=-1\mid X=0) = 0{,}25$, $P(Y=0\mid X=0) = 0{,}5$, $P(Y=1\mid X=0) = 0{,}25$.
**b)** $P(X+Y>0) = 0{,}10+0{,}15+0{,}10 = 0{,}35$; $P(X=1, X+Y>0) = 0{,}15+0{,}10 = 0{,}25$ → $P = \frac{0{,}25}{0{,}35} = \frac57\approx0{,}714$.
**c)** $p_X$: 0,3; 0,4; 0,3; $p_Y$: 0,2; 0,5; 0,3. $p(-1,-1) = 0{,}05\ne0{,}3\cdot0{,}2 = 0{,}06$ → **zależne**.
$E(X) = 0$, $E(XY) = (-1)(-1)0{,}05+(-1)(1)0{,}10+(1)(-1)0{,}05+(1)(1)0{,}10 = 0$ → $\mathrm{Cov} = 0$: zmienne są **nieskorelowane, choć zależne**.
`,
          answer: md`a) 0,25/0,5/0,25; b) $\frac57$; c) zależne, ale $\mathrm{Cov}=0$.`
        }
      ]
    },
    en: {
      title: 'Test 2 — practice set',
      intro: intro2.en,
      tasks: [
        {
          id: 'k1', points: 11, title: 'API response time — a confidence interval',
          text: md`
The response time of an API server was measured for 20 random requests: $\bar x = 240$ ms, $s = 15$ ms. Assuming normality, find a 95% confidence interval for the mean response time.
`,
          hint: md`$\sigma$ unknown → t with 19 df: $t_{0.975;19} = 2.093$.`,
          solution: md`
$\bar x\pm t_{0.975;19}\frac{s}{\sqrt n} = 240\pm2.093\cdot3.354 = 240\pm7.02 = [232.98;\ 247.02]$ ms.
With 95% confidence the mean response time is between about 233 and 247 ms ($n=20$).
`,
          answer: md`[232.98; 247.02] ms.`
        },
        {
          id: 'k2', points: 11, title: 'Charging-time variability — a test for σ',
          text: md`
In 10 experiments the increase of a phone’s charging time after an update was measured (min): 4, 9, 3, 8, 6, 2, 7, 5, 10, 6. It is conjectured that the standard deviation of the increase is **greater than 2 min**. Assuming normality, test it at significance level 0.1.
`,
          hint: md`$\sigma>2 \Leftrightarrow \sigma^2>4$. $\chi^2_{0.9;9} = 14.684$.`,
          solution: md`
$\bar x = 6$, $\sum(x_i-\bar x)^2 = 60$, $s^2\approx6.667$.
$H_0:\ \sigma^2 = 4$, $H_1:\ \sigma^2>4$; $\chi^2 = \frac{60}{4} = 15.0$; $C = [14.684;\infty)$.
$15.0\in C$ → **reject $H_0$**: at level 0.1 the standard deviation exceeds 2 min.
`,
          answer: md`$\chi^2 = 15.0\ge14.684$ → reject $H_0$.`
        },
        {
          id: 'k3', points: 12, title: 'Left-handers in a sample — exact and CLT',
          text: md`
In a population 8% of people are left-handed. Let $X$ be the number of left-handers in a random sample of 150. Give the distribution of $X$. Write the formula for the **exact** probability that there are at most 8 left-handers, and give its approximate value from the CLT.
`,
          hint: md`$np = 12$, $\sqrt{np(1-p)}\approx3.32$. Use the continuity correction.`,
          solution: md`
$X\sim$ Bin(150; 0.08). Exactly: $P(X\le8) = \sum_{k=0}^{8}\binom{150}{k}0.08^k0.92^{150-k}$ ($\approx0.144$).
CLT with correction: $\Phi\left(\frac{8.5-12}{3.32}\right) = \Phi(-1.05)\approx0.146$.
`,
          answer: md`Bin(150; 0.08); formula $\sum_{k=0}^8\binom{150}{k}0.08^k0.92^{150-k}$; CLT ≈ 0.146.`
        },
        {
          id: 'k4', points: 11, title: 'A two-dimensional distribution — conditions and independence',
          text: md`
The distribution of $(X, Y)$:

| X \ Y | −1 | 0 | 1 |
|---|---:|---:|---:|
| **−1** | 0.05 | 0.15 | 0.10 |
| **0** | 0.10 | 0.20 | 0.10 |
| **1** | 0.05 | 0.15 | 0.10 |

a) Find the conditional distribution of $Y$ given $X = 0$.
b) Compute $P(X = 1\mid X+Y>0)$.
c) Check whether $X$ and $Y$ are independent. Compute $\mathrm{Cov}(X,Y)$ — what do you notice?
`,
          hint: md`b) $X+Y>0$ holds in cells (0, 1), (1, 0), (1, 1).`,
          solution: md`
**a)** Row $X=0$ / 0.40 → 0.25; 0.5; 0.25.
**b)** $P(X+Y>0) = 0.35$; $P(X=1, X+Y>0) = 0.25$ → $\frac57\approx0.714$.
**c)** $p(-1,-1) = 0.05\ne0.3\cdot0.2$ → **dependent**. $E(X) = 0$, $E(XY) = 0.05-0.10-0.05+0.10 = 0$ → $\mathrm{Cov} = 0$: **uncorrelated yet dependent**.
`,
          answer: md`a) 0.25/0.5/0.25; b) $\frac57$; c) dependent, but $\mathrm{Cov}=0$.`
        }
      ]
    },
    ru: {
      title: 'Коллоквиум 2 — пробный вариант',
      intro: intro2.ru,
      tasks: [
        {
          id: 'k1', points: 11, title: 'Время ответа API — доверительный интервал',
          text: md`
Измерили время ответа API-сервера для 20 случайных запросов: $\bar x = 240$ мс, $s = 15$ мс. Предполагая нормальность, найдите 95% доверительный интервал для среднего времени ответа.
`,
          hint: md`$\sigma$ неизвестно → распределение Стьюдента с 19 ст. св.: $t_{0{,}975;19} = 2{,}093$.`,
          solution: md`
$\bar x\pm t_{0{,}975;19}\frac{s}{\sqrt n} = 240\pm2{,}093\cdot3{,}354 = 240\pm7{,}02 = [232{,}98;\ 247{,}02]$ мс.
С доверием 95% среднее время ответа — примерно от 233 до 247 мс ($n=20$).
`,
          answer: md`[232,98; 247,02] мс.`
        },
        {
          id: 'k2', points: 11, title: 'Разброс времени зарядки — тест для σ',
          text: md`
В 10 опытах измерили увеличение времени зарядки телефона после обновления (мин): 4, 9, 3, 8, 6, 2, 7, 5, 10, 6. Выдвинута гипотеза, что стандартное отклонение увеличения **больше 2 мин**. Предполагая нормальность, проверьте её на уровне значимости 0,1.
`,
          hint: md`$\sigma>2 \Leftrightarrow \sigma^2>4$. $\chi^2_{0{,}9;9} = 14{,}684$.`,
          solution: md`
$\bar x = 6$, $\sum(x_i-\bar x)^2 = 60$, $s^2\approx6{,}667$.
$H_0:\ \sigma^2 = 4$, $H_1:\ \sigma^2>4$; $\chi^2 = \frac{60}{4} = 15{,}0$; $C = [14{,}684;\infty)$.
$15{,}0\in C$ → **отвергаем $H_0$**: на уровне 0,1 стандартное отклонение больше 2 мин.
`,
          answer: md`$\chi^2 = 15{,}0\ge14{,}684$ → отвергаем $H_0$.`
        },
        {
          id: 'k3', points: 12, title: 'Левши в выборке — точно и по ЦПТ',
          text: md`
В некоторой совокупности 8% людей — левши. Пусть $X$ — число левшей в случайной выборке из 150 человек. Укажите распределение $X$. Запишите формулу **точной** вероятности того, что левшей не больше 8, и дайте её приближённое значение по ЦПТ.
`,
          hint: md`$np = 12$, $\sqrt{np(1-p)}\approx3{,}32$. Используйте поправку на непрерывность.`,
          solution: md`
$X\sim$ Bin(150; 0,08). Точно: $P(X\le8) = \sum_{k=0}^{8}\binom{150}{k}0{,}08^k0{,}92^{150-k}$ ($\approx0{,}144$).
ЦПТ с поправкой: $\Phi\left(\frac{8{,}5-12}{3{,}32}\right) = \Phi(-1{,}05)\approx0{,}146$.
`,
          answer: md`Bin(150; 0,08); формула $\sum_{k=0}^8\binom{150}{k}0{,}08^k0{,}92^{150-k}$; ЦПТ ≈ 0,146.`
        },
        {
          id: 'k4', points: 11, title: 'Двумерное распределение — условия и независимость',
          text: md`
Распределение $(X, Y)$:

| X \ Y | −1 | 0 | 1 |
|---|---:|---:|---:|
| **−1** | 0,05 | 0,15 | 0,10 |
| **0** | 0,10 | 0,20 | 0,10 |
| **1** | 0,05 | 0,15 | 0,10 |

а) Найдите условное распределение $Y$ при $X = 0$.
б) Найдите $P(X = 1\mid X+Y>0)$.
в) Проверьте, независимы ли $X$ и $Y$. Найдите $\mathrm{Cov}(X,Y)$ — что вы замечаете?
`,
          hint: md`б) $X+Y>0$ выполняется в клетках (0, 1), (1, 0), (1, 1).`,
          solution: md`
**а)** Строка $X=0$ / 0,40 → 0,25; 0,5; 0,25.
**б)** $P(X+Y>0) = 0{,}35$; $P(X=1, X+Y>0) = 0{,}25$ → $\frac57\approx0{,}714$.
**в)** $p(-1,-1) = 0{,}05\ne0{,}3\cdot0{,}2$ → **зависимы**. $E(X) = 0$, $E(XY) = 0{,}05-0{,}10-0{,}05+0{,}10 = 0$ → $\mathrm{Cov} = 0$: **некоррелированы, но зависимы**.
`,
          answer: md`а) 0,25/0,5/0,25; б) $\frac57$; в) зависимы, но $\mathrm{Cov}=0$.`
        }
      ]
    }
  };

  SAD.registerData('colloquia', { 1: kol1, 2: kol2 });
})();
