/* Topic 3 — Discrete random variables (lecture W03, classes C04) */
(function () {
  var md = SAD.md;
  var S = SAD.stats;

  var ks = [], binV = [], poiV = [];
  for (var k = 0; k <= 20; k++) { ks.push(String(k)); binV.push(+S.binomPmf(k, 500, 0.02).toFixed(4)); poiV.push(+S.poissonPmf(k, 10).toFixed(4)); }

  var charts = {
    coinsCdf: { type: 'cdf', xs: [0, 1, 2, 3], ps: [1 / 8, 3 / 8, 3 / 8, 1 / 8], xLabel: 'x',
      caption: { pl: 'Dystrybuanta liczby orłów w 3 rzutach (W03): funkcja schodkowa, skoki = P(X = x)', en: 'CDF of the number of heads in 3 tosses (W03): a step function, jumps = P(X = x)', ru: 'Функция распределения числа орлов в 3 бросках (W03): ступенчатая, скачки = P(X = x)' } },
    coinsPmf: { type: 'pmf', dist: { xs: [0, 1, 2, 3], ps: [0.125, 0.375, 0.375, 0.125] }, showValues: true, xLabel: 'x', yLabel: 'P(X = x)',
      caption: { pl: 'Funkcja prawdopodobieństwa tej samej zmiennej', en: 'The probability mass function of the same variable', ru: 'Ряд распределения той же величины' } },
    bin03: { type: 'pmf', dist: { name: 'binom', n: 10, p: 0.3 }, showValues: true, xLabel: 'k', yLabel: 'P(X = k)',
      caption: { pl: 'Bin(10; 0,3): najbardziej prawdopodobne k = 3', en: 'Bin(10; 0.3): the most likely k = 3', ru: 'Bin(10; 0,3): наиболее вероятное k = 3' } },
    bin07: { type: 'pmf', dist: { name: 'binom', n: 10, p: 0.7 }, showValues: true, xLabel: 'k', yLabel: 'P(X = k)',
      caption: { pl: 'Bin(10; 0,7): lustrzane odbicie Bin(10; 0,3)', en: 'Bin(10; 0.7): a mirror image of Bin(10; 0.3)', ru: 'Bin(10; 0,7): зеркальное отражение Bin(10; 0,3)' } },
    binVsPois: { type: 'bar', labels: ks, values: binV, values2: poiV, showValues: false,
      legend: [{ pl: 'Bin(500; 0,02)', en: 'Bin(500; 0.02)', ru: 'Bin(500; 0,02)' }, { pl: 'Poisson(10)', en: 'Poisson(10)', ru: 'Пуассон(10)' }],
      xLabel: 'k', yLabel: 'P(X = k)',
      caption: { pl: 'Rozkład dwumianowy z dużym n i małym p prawie pokrywa się z rozkładem Poissona o λ = np', en: 'A binomial distribution with large n and small p almost coincides with Poisson with λ = np', ru: 'Биномиальное распределение с большим n и малым p почти совпадает с пуассоновским при λ = np' } },

    exCdf1: { type: 'cdf', xs: [-1, 0, 3, 4], ps: [0.2, 0.3, 0.1, 0.4], xLabel: 'x' },
    exShots: { type: 'pmf', dist: { xs: [2, 3, 4, 5], ps: [0.64, 0.256, 0.0768, 0.0272] }, showValues: true, xLabel: { pl: 'liczba rzutów', en: 'attempts', ru: 'число бросков' }, yLabel: 'P(X = x)' },
    exShotsCdf: { type: 'cdf', xs: [2, 3, 4, 5], ps: [0.64, 0.256, 0.0768, 0.0272], xLabel: 'x' }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Zmienna losowa zamienia wynik doświadczenia na liczbę. Poznasz dystrybuantę, funkcję prawdopodobieństwa, wartość oczekiwaną, wariancję oraz dwa najważniejsze rozkłady dyskretne: dwumianowy i Poissona.',
    lecture: md`
# Zmienna losowa — co to jest?

W doświadczeniu zwykle nie interesują nas wszystkie szczegóły wyniku, tylko **jedna liczba**: suma oczek na dwóch kostkach, liczba wadliwych elementów w dostawie, czas do awarii. {lecture:W03}

::: def | Zmienna losowa
**Zmienna losowa** $X$ to funkcja, która każdemu zdarzeniu elementarnemu przypisuje liczbę rzeczywistą: $X:\Omega\to\mathbb{R}$ (i taka, że $\{X\le x\}$ jest zdarzeniem dla każdego $x$). Zbiór wartości $\mathcal{X}$ nazywamy **nośnikiem**. Zmienne losowe oznaczamy dużymi literami z końca alfabetu: $X, Y, Z$. {lecture:W03}
:::

::: intuition
Zmienna losowa to „przepis na liczbę”: rzucasz trzy razy monetą (wynik: np. ORO), a $X$ mówi „policz orły” → 2. Losowość jest w doświadczeniu, a $X$ tylko tłumaczy wynik na liczbę.
:::

# Dystrybuanta

::: def | Dystrybuanta (CDF)
$$F(x) = P(X\le x),\qquad x\in\mathbb{R}$$
czyli prawdopodobieństwo, że $X$ przyjmie wartość **nie większą** niż $x$ („skumulowane” prawdopodobieństwo, ang. *cumulative distribution function*). {lecture:W03}
:::

Każda dystrybuanta:
1. $\lim\limits_{x\to-\infty}F(x) = 0$ i $\lim\limits_{x\to\infty}F(x) = 1$,
2. jest **niemalejąca**,
3. jest **prawostronnie ciągła**.
Te trzy warunki są konieczne i wystarczające, żeby funkcja była dystrybuantą. {lecture:W03}

::: formula | Jak z dystrybuanty liczyć prawdopodobieństwa
$$P(a < X \le b) = F(b) - F(a)$$
$$P(X = a) = F(a) - F(a^-)\quad(\text{wysokość skoku w } a)$$
$$P(a\le X\le b) = F(b) - F(a^-),\qquad P(X>a) = 1 - F(a)$$
gdzie $F(a^-)$ to granica lewostronna. Jeśli $F$ jest ciągła w $a$, to $P(X=a)=0$.
:::

::: example W03 | Liczba orłów w trzech rzutach
$\Omega = \{OOO, OOR, ORO, ROO, ORR, ROR, RRO, RRR\}$, $X$ = liczba orłów, nośnik $\{0,1,2,3\}$:
$P(X=0) = \frac18$, $P(X=1) = \frac38$, $P(X=2)=\frac38$, $P(X=3)=\frac18$.
$$F(x) = \begin{cases} 0 & x<0\\ 1/8 & 0\le x<1\\ 1/2 & 1\le x<2\\ 7/8 & 2\le x<3\\ 1 & x\ge 3\end{cases}$$
:::

@chart coinsCdf

# Zmienne dyskretne i funkcja prawdopodobieństwa

::: def | Zmienna typu dyskretnego
$X$ jest **dyskretna**, gdy jej nośnik jest przeliczalny: $\mathcal X = \{x_1, x_2, \dots\}$. **Funkcja prawdopodobieństwa**: $p(x_i) = P(X = x_i)$. Warunki (konieczne i wystarczające):
$$p(x_i)\ge 0,\qquad \sum_i p(x_i) = 1.$$
:::

Dystrybuanta dyskretnej zmiennej jest **schodkowa**: stała między punktami nośnika, a w punkcie $x_i$ skacze o $p(x_i)$:
$$F(x) = \sum_{x_i\le x} p(x_i).$$

@chart coinsPmf

::: example W03 | Od tabelki do dystrybuanty
| $x$ | 1 | 2 | 3 | 4 |
|---|---:|---:|---:|---:|
| $p(x)$ | 0,4 | 0,3 | 0,2 | 0,1 |

Sumujemy narastająco: $F(1) = 0{,}4$, $F(2) = 0{,}7$, $F(3) = 0{,}9$, $F(4) = 1$, więc
$F(x)=0$ dla $x<1$; $0{,}4$ dla $1\le x<2$; $0{,}7$ dla $2\le x<3$; $0{,}9$ dla $3\le x<4$; $1$ dla $x\ge4$.
:::

::: warn
Uważaj na nierówności ostre i nieostre! Dla zmiennej dyskretnej $P(X<2)\ne P(X\le 2)$, bo różnią się o $P(X=2)$. Na przykładzie wyżej: $P(X<2) = 0{,}4$, $P(X\le2)=0{,}7$.
:::

**Rozkład jednostajny dyskretny** na $\{x_1,\dots,x_n\}$: $P(X=x_i) = \frac1n$ (np. rzut kostką). {lecture:W03}

# Wartość oczekiwana

::: def | Wartość oczekiwana (średnia) zmiennej dyskretnej
$$E(X) = \sum_i x_i\,P(X = x_i)$$
(o ile szereg jest bezwzględnie zbieżny). To **średnia ważona** wartości z wagami = prawdopodobieństwa, „środek masy prawdopodobieństwa”. {lecture:W03}
:::

::: intuition
Grasz wiele razy w tę samą grę. $E(X)$ to **średni wynik na jedną grę w długim okresie**. Nie musi być możliwym wynikiem: średnia liczba oczek w rzucie kostką to $3{,}5$, choć takiej ścianki nie ma.
:::

::: formula | Własności
$$E[g(X)] = \sum_i g(x_i)\,P(X=x_i)\qquad E(aX+b) = aE(X)+b$$
:::

# Momenty, wariancja, odchylenie standardowe

- **Moment zwykły** rzędu $n$: $m_n = E(X^n)$; $m_1 = E(X)$.
- **Moment centralny** rzędu $n$: $\mu_n = E[(X-\mu)^n]$, gdzie $\mu = E(X)$. {lecture:W03}

::: def | Wariancja
$$V(X) = \sigma^2 = E\big[(X-\mu)^2\big]$$
**Wzór obliczeniowy** (używaj go w zadaniach!):
$$V(X) = E(X^2) - \big(E(X)\big)^2,\qquad \sigma = \sqrt{V(X)}$$
:::

Wariancja mierzy rozrzut wokół średniej — w mechanice odpowiada **momentowi bezwładności**. Własność: $V(aX+b) = a^2V(X)$ (przesunięcie nie zmienia rozrzutu, skala mnoży go przez $a^2$). {lecture:W04a}

::: steps | E(X) i V(X) z tabelki
1. Dopisz wiersz $x_i\,p_i$ i zsumuj → $E(X)$.
2. Dopisz wiersz $x_i^2\,p_i$ i zsumuj → $E(X^2)$.
3. $V(X) = E(X^2) - (E X)^2$, $\sigma=\sqrt{V}$.
4. Kontrola: wariancja nigdy nie jest ujemna.
:::

# Rozkład Bernoulliego i dwumianowy

**Rozkład Bernoulliego (zero-jedynkowy)**: $X=1$ (sukces) z prawdopodobieństwem $p$, $X=0$ z prawdopodobieństwem $1-p$. $E(X) = p$, $V(X) = p(1-p)$. {lecture:W03}

**Doświadczenie dwumianowe** spełnia warunki:
1. składa się z $n$ prób, $n$ ustalone z góry,
2. każda próba kończy się sukcesem albo porażką, $P(\text{sukces}) = p$ w każdej próbie,
3. próby są **niezależne**.

::: def | Rozkład dwumianowy Bin(n, p)
$X$ = liczba sukcesów w $n$ niezależnych próbach Bernoulliego:
$$P(X = k) = \binom nk p^k(1-p)^{n-k},\qquad k=0,1,\dots,n$$
$$E(X) = np,\qquad V(X) = np(1-p),\qquad \sigma = \sqrt{np(1-p)}$$
:::

@chart bin03

@chart bin07

::: formula W03 | Najbardziej prawdopodobna liczba sukcesów
$$k^* = \lfloor (n+1)p\rfloor,\quad\text{a gdy } (n+1)p \text{ jest całkowite: } k^* = (n+1)p \text{ lub } (n+1)p-1$$
Dla Bin(10; 0,3): $(n+1)p = 3{,}3$ → $k^*=3$.
:::

::: example W03 | System 3 czy 5 elementów?
System działa, gdy działa **co najmniej połowa** jego elementów (niezależnych, niezawodność $p$). Dla 5 elementów: $\binom53p^3(1-p)^2+\binom54p^4(1-p)+p^5$; dla 3: $\binom32p^2(1-p)+p^3$. Porównanie daje: system 5-elementowy jest lepszy **wtedy i tylko wtedy**, gdy $p\ge 0{,}5$.
:::

::: example W03 | Koszt gwarancji (funkcja zmiennej losowej)
Płyty DVD są wadliwe z $p = 0{,}01$, sprzedawane w paczkach po 10. Firma zwraca koszt 1 płyty ($c$), gdy wadliwa jest dokładnie jedna, a koszt całej paczki ($10c$), gdy wadliwych jest więcej. $X\sim$ Bin(10; 0,01), koszt $Y = g(X)$:

| $y$ | 0 | $c$ | $10c$ |
|---|---:|---:|---:|
| $P(Y=y)$ | 0,904 | 0,091 | 0,005 |

$E(Y) = 0\cdot0{,}904 + c\cdot0{,}091 + 10c\cdot 0{,}005 = 0{,}141c$ — średni dodatkowy koszt na paczkę.
:::

# Rozkład Poissona

Gdy **$n$ jest duże, a $p$ małe**, liczenie $\binom nk$ jest uciążliwe. Lemat Poissona mówi, że jeśli $n\,p_n\to\lambda$, to $\binom nk p_n^k(1-p_n)^{n-k}\to e^{-\lambda}\frac{\lambda^k}{k!}$. {lecture:W03}

::: def | Rozkład Poissona P(λ)
$$P(X=k) = e^{-\lambda}\frac{\lambda^k}{k!},\qquad k = 0,1,2,\dots\qquad E(X) = V(X) = \lambda$$
:::

Model Poissona opisuje **liczbę zdarzeń w ustalonym czasie** (cząstki w liczniku Geigera, klienci na stacji, pomyłki telefoniczne), gdy: w krótkim czasie $\Delta t$ jedno zdarzenie zachodzi z prawdopodobieństwem $\approx\lambda\Delta t$, dwa naraz praktycznie nigdy, a liczby zdarzeń w rozłącznych przedziałach są niezależne. Wtedy liczba zdarzeń do chwili $t$ ma rozkład Poissona z parametrem $\lambda t$. {lecture:W03}

::: tip own
Parametr $\lambda$ skaluje się z czasem: jeśli średnio są 2 zgłoszenia na godzinę, to w ciągu 3 godzin liczba zgłoszeń ma rozkład Poissona z $\lambda = 6$.
:::

::: formula W03 | Przybliżenie Poissona
Dla $n\ge 25$ i $np\le 10$:
$$\binom nk p^k(1-p)^{n-k}\approx e^{-np}\frac{(np)^k}{k!}$$
:::

::: example W03 | Szczepionka
Wirus przeżywa szczepionkę z $p=0{,}02$. Jaka jest szansa, że z 500 wirusów przeżyje co najmniej 15? $\lambda = 500\cdot0{,}02 = 10$:
$$P(X\ge15) = 1 - P(X\le 14) \approx 1 - F(14;10) = 1 - 0{,}9165 = 0{,}0835$$
(dokładnie z rozkładu dwumianowego: 0,0814). $F(k;\lambda)$ odczytujemy z tablic rozkładu Poissona.
:::

@chart binVsPois

# W Excelu

~~~excel Wartość oczekiwana i wariancja z tabelki (x w C4:F4, p w C5:F5)
C7: =SUMPRODUCT(C4:F4,C5:F5)          // E(X)
C8: =SUMPRODUCT(C4:F4,C4:F4,C5:F5)    // E(X^2)
C9: =C8-C7^2                          // V(X)
C10: =SQRT(C9)                        // odchylenie standardowe
~~~

~~~excel Rozkład dwumianowy i Poissona
A1: =BINOM.DIST(3,10,0.3,FALSE)       // P(X = 3) dla Bin(10; 0,3)
A2: =BINOM.DIST(3,10,0.3,TRUE)        // P(X <= 3)
A3: =1-BINOM.DIST(14,500,0.02,TRUE)   // P(X >= 15), dokładnie
A4: =1-POISSON.DIST(14,10,TRUE)       // to samo, przybliżenie Poissona
A5: =POISSON.DIST(2,1.8,FALSE)        // P(X = 2) dla P(1,8)
~~~

::: warn own
Ostatni argument: ‹FALSE› (FAŁSZ) = $P(X=k)$, ‹TRUE› (PRAWDA) = $P(X\le k)$. „Co najmniej $k$” to ‹1 - ...(k-1, ..., TRUE)›, a nie ‹(k, TRUE)›!
:::

~~~python Rozkłady dyskretne w Pythonie (scipy)
from scipy.stats import binom, poisson

print(binom.pmf(3, 10, 0.3))           # P(X = 3)
print(binom.cdf(3, 10, 0.3))           # P(X <= 3)
print(binom.sf(14, 500, 0.02))         # P(X > 14) = P(X >= 15)  -> 0.0814
print(poisson.sf(14, 10))              # przybliżenie Poissona  -> 0.0835
print(binom.mean(10, 0.3), binom.var(10, 0.3))   # np, np(1-p)
~~~

::: summary
- $F(x) = P(X\le x)$: niemalejąca, prawostronnie ciągła, od 0 do 1; $P(a<X\le b) = F(b)-F(a)$.
- Dyskretna: $p(x_i)\ge0$, $\sum p(x_i) = 1$; dystrybuanta schodkowa.
- $E(X) = \sum x_ip_i$, $V(X) = E(X^2)-(EX)^2$, $E(aX+b)=aEX+b$, $V(aX+b)=a^2VX$.
- Bin(n, p): $\binom nk p^k(1-p)^{n-k}$, $E=np$, $V=np(1-p)$.
- Poisson: $e^{-\lambda}\lambda^k/k!$, $E=V=\lambda$; przybliża Bin przy $n\ge25$, $np\le10$ ($\lambda=np$).
:::
`,

    cheatsheet: md`
## Dystrybuanta
$F(x) = P(X\le x)$ · $P(a<X\le b) = F(b)-F(a)$ · $P(X=a)$ = skok w $a$ · $P(X>a)=1-F(a)$

## Zmienna dyskretna
- $p_i\ge0$, $\sum p_i=1$; $F$ schodkowa (sumy narastające)
- $E(X)=\sum x_ip_i$, $E(X^2)=\sum x_i^2p_i$
- $V(X)=E(X^2)-(EX)^2$, $\sigma=\sqrt V$
- $E(aX+b)=aEX+b$, $V(aX+b)=a^2VX$, $E[g(X)]=\sum g(x_i)p_i$

## Rozkłady
| rozkład | $P(X=k)$ | $E$ | $V$ |
|---|---|---|---|
| Bernoulli | $p^k(1-p)^{1-k}$ | $p$ | $p(1-p)$ |
| Bin(n, p) | $\binom nk p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ |
| Poisson(λ) | $e^{-\lambda}\lambda^k/k!$ | $\lambda$ | $\lambda$ |

- Poisson ≈ Bin, gdy $n\ge25$, $np\le10$: $\lambda=np$
- $k^*=\lfloor(n+1)p\rfloor$ — najbardziej prawdopodobna liczba sukcesów
- $\lambda$ rośnie proporcjonalnie do czasu/obszaru

## Pułapki
- $P(X<k)=P(X\le k-1)$ dla całkowitych
- „co najmniej $k$” $=1-P(X\le k-1)$

## Excel
‹BINOM.DIST(k,n,p,FALSE/TRUE)› · ‹POISSON.DIST(k,λ,FALSE/TRUE)› · ‹SUMPRODUCT› (PL: ‹ROZKŁ.DWUM›, ‹ROZKŁ.POISSON›, ‹SUMA.ILOCZYNÓW›)
`,

    exercises: [
      {
        id: 'e1', tag: 'C04', title: 'Tabelka rozkładu: prawdopodobieństwa, dystrybuanta, E i V',
        text: md`
Zmienna losowa $X$ ma rozkład:

| $x_i$ | −1 | 0 | 3 | 4 |
|---|---:|---:|---:|---:|
| $P(X=x_i)$ | 0,2 | 0,3 | 0,1 | 0,4 |

a) Oblicz $P(X=3)$, $P(X<3)$, $P(-1<X<4)$.
b) Wyznacz i narysuj dystrybuantę.
c) Oblicz $E(X)$ i $V(X)$.
`,
        hint: md`b) Sumuj prawdopodobieństwa narastająco; dystrybuanta jest stała między punktami −1, 0, 3, 4. c) Użyj $V = E(X^2) - (EX)^2$.`,
        solution: md`
**a)** $P(X=3) = 0{,}1$; $P(X<3) = P(-1)+P(0) = 0{,}5$; $P(-1<X<4) = P(0)+P(3) = 0{,}4$ (końce −1 i 4 **nie** wchodzą).

**b)**
$$F(x)=\begin{cases}0 & x<-1\\ 0{,}2 & -1\le x<0\\ 0{,}5 & 0\le x<3\\ 0{,}6 & 3\le x<4\\ 1 & x\ge4\end{cases}$$

@chart exCdf1

**c)**
| $x_i$ | −1 | 0 | 3 | 4 | suma |
|---|---:|---:|---:|---:|---:|
| $x_ip_i$ | −0,2 | 0 | 0,3 | 1,6 | **1,7** |
| $x_i^2p_i$ | 0,2 | 0 | 0,9 | 6,4 | **7,5** |

$E(X) = 1{,}7$, $V(X) = 7{,}5 - 1{,}7^2 = 7{,}5 - 2{,}89 = 4{,}61$, $\sigma\approx 2{,}147$.
`,
        answer: md`$P(X=3)=0{,}1$; $P(X<3)=0{,}5$; $P(-1<X<4)=0{,}4$; $E(X)=1{,}7$; $V(X)=4{,}61$.`
      },
      {
        id: 'e2', tag: 'C04', title: 'Od dystrybuanty do średniej',
        text: md`
Dystrybuanta zmiennej losowej $X$:
$$F(x) = \begin{cases} 0 & x<0\\ 0{,}25 & 0\le x<2\\ 0{,}6 & 2\le x<5\\ 1 & x\ge 5\end{cases}$$
Oblicz wartość oczekiwaną, wariancję i odchylenie standardowe $X$.
`,
        hint: md`Punkty nośnika to miejsca skoków, a prawdopodobieństwa to **wysokości skoków**.`,
        solution: md`
Skoki: w 0 o 0,25; w 2 o $0{,}6-0{,}25 = 0{,}35$; w 5 o $1-0{,}6 = 0{,}4$.

| $x_i$ | 0 | 2 | 5 |
|---|---:|---:|---:|
| $p_i$ | 0,25 | 0,35 | 0,40 |

$E(X) = 0 + 0{,}7 + 2 = 2{,}7$; $E(X^2) = 0 + 1{,}4 + 10 = 11{,}4$;
$V(X) = 11{,}4 - 7{,}29 = 4{,}11$; $\sigma = \sqrt{4{,}11}\approx 2{,}027$.
`,
        answer: md`$E(X)=2{,}7$, $V(X)=4{,}11$, $\sigma\approx2{,}03$.`
      },
      {
        id: 'e3', tag: 'C04', title: 'Nowe routery',
        text: md`
Kupiono 12 routerów. Każdy, niezależnie od innych, jest wadliwy z prawdopodobieństwem 0,05.
a) Jakie jest prawdopodobieństwo, że wadliwy jest co najwyżej jeden?
b) Losowo wybrany router przetestowano i okazał się wadliwy. Jakie jest prawdopodobieństwo, że wszystkie pozostałe są sprawne?
`,
        hint: md`a) $X\sim$ Bin(12; 0,05), liczysz $P(0)+P(1)$. b) Routery są niezależne — stan testowanego nic nie mówi o pozostałych 11.`,
        solution: md`
**a)** $P(X\le1) = 0{,}95^{12} + 12\cdot0{,}05\cdot0{,}95^{11} \approx 0{,}5404 + 0{,}3413 = 0{,}8816$.

**b)** Chodzi o $P(\text{pozostałe 11 sprawne}\mid\text{testowany wadliwy})$. Z niezależności warunek „odpada”:
$$P = 0{,}95^{11}\approx 0{,}5688$$
(Formalnie: $\frac{0{,}05\cdot0{,}95^{11}}{0{,}05} = 0{,}95^{11}$.)
`,
        answer: md`a) ≈ 0,8816; b) $0{,}95^{11}\approx0{,}5688$.`
      },
      {
        id: 'e4', tag: 'C04', title: 'Rzuty do kosza do dwóch trafień',
        text: md`
Koszykarz ma **5 rzutów**. Test zalicza po **2 trafieniach** — wtedy przestaje rzucać; rzuca też do wyczerpania prób. Każdy rzut trafia niezależnie z prawdopodobieństwem 0,8. Niech $X$ = liczba oddanych rzutów. Wyznacz rozkład $X$, naszkicuj dystrybuantę i oblicz $E(X)$.
`,
        hint: md`$X=k$ dla $k<5$ oznacza: w pierwszych $k-1$ rzutach dokładnie 1 trafienie, a $k$-ty rzut celny. $X=5$ — gdy po 4 rzutach jest mniej niż 2 trafienia.`,
        solution: md`
Niech $p=0{,}8$, $q=0{,}2$.
- $X=2$: TT → $p^2 = 0{,}64$
- $X=3$: jedno trafienie w 2 rzutach, potem trafienie → $2pq\cdot p = 0{,}256$
- $X=4$: jedno trafienie w 3 rzutach, potem trafienie → $3pq^2\cdot p = 0{,}0768$
- $X=5$: w 4 pierwszych co najwyżej 1 trafienie → $q^4 + 4pq^3 = 0{,}0016+0{,}0256 = 0{,}0272$

Suma = 1 ✓.

@chart exShots

@chart exShotsCdf

$E(X) = 2\cdot0{,}64 + 3\cdot0{,}256 + 4\cdot0{,}0768 + 5\cdot0{,}0272 = 2{,}4912$.
`,
        answer: md`$P(X=2,3,4,5) = 0{,}64;\ 0{,}256;\ 0{,}0768;\ 0{,}0272$; $E(X)\approx2{,}49$.`
      },
      {
        id: 'e5', tag: 'C04', title: 'Kości pamięci: dokładnie i Poissonem',
        text: md`
Kość pamięci nie przechodzi testu z prawdopodobieństwem 0,02. Oblicz prawdopodobieństwo, że wśród 150 kości **co najwyżej 3** nie przejdą testu. Potem przybliż je rozkładem Poissona.
`,
        hint: md`Dokładnie: Bin(150; 0,02), suma dla $k=0,\dots,3$. Przybliżenie: $\lambda = np = 3$ — warunki $n\ge25$, $np\le10$ spełnione.`,
        solution: md`
**Dokładnie:** $P(X\le 3) = \sum_{k=0}^{3}\binom{150}{k}0{,}02^k\,0{,}98^{150-k}\approx 0{,}6472$.

**Poisson** ($\lambda = 3$): $P(X\le3) \approx e^{-3}\left(1 + 3 + \frac{9}{2} + \frac{27}{6}\right) = e^{-3}\cdot 13 \approx 0{,}6472$.

Przybliżenie jest bardzo dobre (różnica na 5. miejscu po przecinku).

~~~excel
A1: =BINOM.DIST(3,150,0.02,TRUE)
A2: =POISSON.DIST(3,3,TRUE)
~~~
`,
        answer: md`Dokładnie ≈ 0,6472; Poisson ≈ 0,6472.`
      },
      {
        id: 'e6', tag: 'C04', title: 'Zgłoszenia błędów w aplikacji',
        text: md`
Liczba zgłoszeń błędów w aplikacji w ciągu dnia ma rozkład Poissona ze średnią 2,4.
a) Zapisz funkcję prawdopodobieństwa.
b) Oblicz prawdopodobieństwo, że jednego dnia będą **więcej niż 2** zgłoszenia.
c) Ile średnio zgłoszeń przychodzi w ciągu 5 dni roboczych?
`,
        hint: md`„Więcej niż 2” = $1 - P(0) - P(1) - P(2)$. W c) $\lambda$ skaluje się z czasem.`,
        solution: md`
**a)** $P(X=k) = e^{-2{,}4}\dfrac{2{,}4^k}{k!}$, $k = 0,1,2,\dots$

**b)** $P(0)\approx0{,}0907$, $P(1)\approx0{,}2177$, $P(2)\approx0{,}2613$, więc
$$P(X>2) = 1 - 0{,}5697 \approx 0{,}4303$$

**c)** W 5 dni: $\lambda = 5\cdot2{,}4 = 12$ zgłoszeń średnio (a liczba zgłoszeń ma rozkład Poissona z $\lambda=12$).
`,
        answer: md`b) ≈ 0,430; c) średnio 12 zgłoszeń.`
      },
      {
        id: 'e7', tag: 'C04', title: 'Kampania mailowa',
        text: md`
Szacuje się, że w link w mailu klika 1,5% odbiorców. Mail wysłano do 600 losowych osób. Jakie jest prawdopodobieństwo, że klikną **co najmniej 12** osoby? Podaj wartość dokładną i przybliżenie Poissona. Ile kliknięć można średnio oczekiwać?
`,
        hint: md`$X\sim$ Bin(600; 0,015), $\lambda = 9$. „Co najmniej 12” $= 1 - P(X\le 11)$.`,
        solution: md`
$E(X) = np = 600\cdot0{,}015 = 9$.

- dokładnie: $P(X\ge12) = 1 - \sum_{k=0}^{11}\binom{600}{k}0{,}015^k0{,}985^{600-k}\approx 0{,}1955$,
- Poisson: $1 - F(11; 9)\approx 1 - 0{,}8030 = 0{,}1970$.

~~~excel
A1: =1-BINOM.DIST(11,600,0.015,TRUE)   // 0,1955
A2: =1-POISSON.DIST(11,9,TRUE)         // 0,1970
~~~
`,
        answer: md`≈ 0,1955 (Poisson: ≈ 0,1970); średnio 9 kliknięć.`
      },
      {
        id: 'e8', own: true, title: 'Gwarancja na żarówki i najbardziej prawdopodobna liczba',
        text: md`
Żarówki sprzedaje się w paczkach po 8 sztuk; każda jest wadliwa niezależnie z prawdopodobieństwem 0,05. Sklep zwraca 5 zł, gdy w paczce jest dokładnie jedna wadliwa, a 40 zł (całą paczkę), gdy wadliwe są co najmniej dwie. Wyznacz rozkład kosztu $Y$ jednej paczki i $E(Y)$. Jaka jest najbardziej prawdopodobna liczba wadliwych żarówek w paczce?
`,
        hint: md`To zadanie w stylu przykładu z płytami DVD z wykładu: $X\sim$ Bin(8; 0,05), $Y = g(X)$.`,
        solution: md`
$P(X=0) = 0{,}95^8\approx0{,}6634$, $P(X=1) = 8\cdot0{,}05\cdot0{,}95^7\approx0{,}2793$, $P(X\ge2) = 1-0{,}6634-0{,}2793 \approx 0{,}0572$.

| $y$ [zł] | 0 | 5 | 40 |
|---|---:|---:|---:|
| $P(Y=y)$ | 0,6634 | 0,2793 | 0,0572 |

$E(Y) = 5\cdot0{,}2793 + 40\cdot 0{,}0572 \approx 3{,}69$ zł na paczkę.

Najbardziej prawdopodobna liczba: $(n+1)p = 9\cdot0{,}05 = 0{,}45$ → $k^* = 0$.
`,
        answer: md`$Y\in\{0, 5, 40\}$ z prawdop. 0,6634; 0,2793; 0,0572; $E(Y)\approx3{,}69$ zł; $k^*=0$.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'A random variable turns the result of an experiment into a number. You will learn the CDF, the probability mass function, expected value, variance, and the two most important discrete distributions: binomial and Poisson.',
    lecture: md`
# What is a random variable?

In an experiment we usually don’t care about every detail of the result, just **one number**: the sum of two dice, the number of faulty items in a delivery, the time to failure. {lecture:W03}

::: def | Random variable
A **random variable** $X$ is a function assigning a real number to every elementary event: $X:\Omega\to\mathbb{R}$ (such that $\{X\le x\}$ is an event for every $x$). The set of its values $\mathcal{X}$ is called the **support**. Random variables are denoted by capital letters from the end of the alphabet: $X, Y, Z$. {lecture:W03}
:::

::: intuition
A random variable is a “recipe for a number”: you toss a coin three times (result: e.g. HTH) and $X$ says “count the heads” → 2. The randomness is in the experiment; $X$ only translates the result into a number.
:::

# The cumulative distribution function

::: def | CDF
$$F(x) = P(X\le x),\qquad x\in\mathbb{R}$$
the probability that $X$ takes a value **not greater** than $x$ (the *cumulative distribution function*). {lecture:W03}
:::

Every CDF:
1. $\lim\limits_{x\to-\infty}F(x) = 0$ and $\lim\limits_{x\to\infty}F(x) = 1$,
2. is **non-decreasing**,
3. is **right-continuous**.
These three conditions are necessary and sufficient for a function to be a CDF. {lecture:W03}

::: formula | Probabilities from the CDF
$$P(a < X \le b) = F(b) - F(a)$$
$$P(X = a) = F(a) - F(a^-)\quad(\text{the jump at } a)$$
$$P(a\le X\le b) = F(b) - F(a^-),\qquad P(X>a) = 1 - F(a)$$
where $F(a^-)$ is the left-hand limit. If $F$ is continuous at $a$, then $P(X=a)=0$.
:::

::: example W03 | Number of heads in three tosses
$\Omega = \{HHH, HHT, HTH, THH, HTT, THT, TTH, TTT\}$, $X$ = number of heads, support $\{0,1,2,3\}$:
$P(X=0) = \frac18$, $P(X=1) = \frac38$, $P(X=2)=\frac38$, $P(X=3)=\frac18$.
$$F(x) = \begin{cases} 0 & x<0\\ 1/8 & 0\le x<1\\ 1/2 & 1\le x<2\\ 7/8 & 2\le x<3\\ 1 & x\ge 3\end{cases}$$
:::

@chart coinsCdf

# Discrete variables and the probability mass function

::: def | Discrete random variable
$X$ is **discrete** when its support is countable: $\mathcal X = \{x_1, x_2, \dots\}$. The **probability mass function**: $p(x_i) = P(X = x_i)$. Conditions (necessary and sufficient):
$$p(x_i)\ge 0,\qquad \sum_i p(x_i) = 1.$$
:::

The CDF of a discrete variable is a **step function**: constant between support points and jumping by $p(x_i)$ at $x_i$:
$$F(x) = \sum_{x_i\le x} p(x_i).$$

@chart coinsPmf

::: example W03 | From a table to the CDF
| $x$ | 1 | 2 | 3 | 4 |
|---|---:|---:|---:|---:|
| $p(x)$ | 0.4 | 0.3 | 0.2 | 0.1 |

Add cumulatively: $F(1) = 0.4$, $F(2) = 0.7$, $F(3) = 0.9$, $F(4) = 1$, so
$F(x)=0$ for $x<1$; $0.4$ for $1\le x<2$; $0.7$ for $2\le x<3$; $0.9$ for $3\le x<4$; $1$ for $x\ge4$.
:::

::: warn
Watch strict vs non-strict inequalities! For a discrete variable $P(X<2)\ne P(X\le 2)$, they differ by $P(X=2)$. Above: $P(X<2) = 0.4$, $P(X\le2)=0.7$.
:::

**Discrete uniform distribution** on $\{x_1,\dots,x_n\}$: $P(X=x_i) = \frac1n$ (e.g. a die roll). {lecture:W03}

# Expected value

::: def | Expected value (mean) of a discrete variable
$$E(X) = \sum_i x_i\,P(X = x_i)$$
(if the series converges absolutely). It is a **weighted average** of the values with probabilities as weights — the “centre of mass of probability”. {lecture:W03}
:::

::: intuition
You play the same game many times. $E(X)$ is the **average result per game in the long run**. It need not be a possible result: the average number of dots on a die is $3.5$, although no face shows 3.5.
:::

::: formula | Properties
$$E[g(X)] = \sum_i g(x_i)\,P(X=x_i)\qquad E(aX+b) = aE(X)+b$$
:::

# Moments, variance, standard deviation

- **Raw moment** of order $n$: $m_n = E(X^n)$; $m_1 = E(X)$.
- **Central moment** of order $n$: $\mu_n = E[(X-\mu)^n]$, where $\mu = E(X)$. {lecture:W03}

::: def | Variance
$$V(X) = \sigma^2 = E\big[(X-\mu)^2\big]$$
**Computational formula** (use it in problems!):
$$V(X) = E(X^2) - \big(E(X)\big)^2,\qquad \sigma = \sqrt{V(X)}$$
:::

The variance measures spread around the mean — in mechanics it corresponds to the **moment of inertia**. Property: $V(aX+b) = a^2V(X)$ (a shift doesn’t change spread, scaling multiplies it by $a^2$). {lecture:W04a}

::: steps | E(X) and V(X) from a table
1. Add a row $x_i\,p_i$ and sum it → $E(X)$.
2. Add a row $x_i^2\,p_i$ and sum it → $E(X^2)$.
3. $V(X) = E(X^2) - (E X)^2$, $\sigma=\sqrt{V}$.
4. Check: a variance is never negative.
:::

# Bernoulli and binomial distributions

**Bernoulli (zero-one) distribution**: $X=1$ (success) with probability $p$, $X=0$ with probability $1-p$. $E(X) = p$, $V(X) = p(1-p)$. {lecture:W03}

A **binomial experiment** satisfies:
1. it consists of $n$ trials, $n$ fixed in advance,
2. each trial ends in success or failure, $P(\text{success}) = p$ in every trial,
3. the trials are **independent**.

::: def | Binomial distribution Bin(n, p)
$X$ = the number of successes in $n$ independent Bernoulli trials:
$$P(X = k) = \binom nk p^k(1-p)^{n-k},\qquad k=0,1,\dots,n$$
$$E(X) = np,\qquad V(X) = np(1-p),\qquad \sigma = \sqrt{np(1-p)}$$
:::

@chart bin03

@chart bin07

::: formula W03 | The most probable number of successes
$$k^* = \lfloor (n+1)p\rfloor,\quad\text{and when } (n+1)p \text{ is an integer: } k^* = (n+1)p \text{ or } (n+1)p-1$$
For Bin(10; 0.3): $(n+1)p = 3.3$ → $k^*=3$.
:::

::: example W03 | A system of 3 or 5 elements?
A system works when **at least half** of its elements work (independent, reliability $p$). For 5 elements: $\binom53p^3(1-p)^2+\binom54p^4(1-p)+p^5$; for 3: $\binom32p^2(1-p)+p^3$. Comparing gives: the 5-element system is better **if and only if** $p\ge 0.5$.
:::

::: example W03 | Warranty cost (a function of a random variable)
DVDs are faulty with $p = 0.01$ and sold in packs of 10. The company refunds 1 disc ($c$) when exactly one is faulty, and the whole pack ($10c$) when more are faulty. $X\sim$ Bin(10; 0.01), cost $Y = g(X)$:

| $y$ | 0 | $c$ | $10c$ |
|---|---:|---:|---:|
| $P(Y=y)$ | 0.904 | 0.091 | 0.005 |

$E(Y) = 0\cdot0.904 + c\cdot0.091 + 10c\cdot 0.005 = 0.141c$ — the average extra cost per pack.
:::

# The Poisson distribution

When **$n$ is large and $p$ small**, computing $\binom nk$ is tedious. Poisson’s lemma says that if $n\,p_n\to\lambda$, then $\binom nk p_n^k(1-p_n)^{n-k}\to e^{-\lambda}\frac{\lambda^k}{k!}$. {lecture:W03}

::: def | Poisson distribution P(λ)
$$P(X=k) = e^{-\lambda}\frac{\lambda^k}{k!},\qquad k = 0,1,2,\dots\qquad E(X) = V(X) = \lambda$$
:::

The Poisson model describes the **number of events in a fixed time** (particles in a Geiger counter, customers at a petrol station, wrong-number calls) when: in a short time $\Delta t$ one event happens with probability $\approx\lambda\Delta t$, two at once practically never, and counts in disjoint intervals are independent. Then the number of events up to time $t$ is Poisson with parameter $\lambda t$. {lecture:W03}

::: tip own
The parameter $\lambda$ scales with time: if there are on average 2 requests per hour, then in 3 hours the number of requests is Poisson with $\lambda = 6$.
:::

::: formula W03 | Poisson approximation
For $n\ge 25$ and $np\le 10$:
$$\binom nk p^k(1-p)^{n-k}\approx e^{-np}\frac{(np)^k}{k!}$$
:::

::: example W03 | A vaccine
A virus survives the vaccine with $p=0.02$. What is the chance that at least 15 out of 500 viruses survive? $\lambda = 500\cdot0.02 = 10$:
$$P(X\ge15) = 1 - P(X\le 14) \approx 1 - F(14;10) = 1 - 0.9165 = 0.0835$$
(exactly from the binomial: 0.0814). $F(k;\lambda)$ is read from Poisson tables.
:::

@chart binVsPois

# In Excel

~~~excel Expected value and variance from a table (x in C4:F4, p in C5:F5)
C7: =SUMPRODUCT(C4:F4,C5:F5)          // E(X)
C8: =SUMPRODUCT(C4:F4,C4:F4,C5:F5)    // E(X^2)
C9: =C8-C7^2                          // V(X)
C10: =SQRT(C9)                        // standard deviation
~~~

~~~excel Binomial and Poisson
A1: =BINOM.DIST(3,10,0.3,FALSE)       // P(X = 3) for Bin(10; 0.3)
A2: =BINOM.DIST(3,10,0.3,TRUE)        // P(X <= 3)
A3: =1-BINOM.DIST(14,500,0.02,TRUE)   // P(X >= 15), exact
A4: =1-POISSON.DIST(14,10,TRUE)       // the same, Poisson approximation
A5: =POISSON.DIST(2,1.8,FALSE)        // P(X = 2) for P(1.8)
~~~

::: warn own
The last argument: ‹FALSE› = $P(X=k)$, ‹TRUE› = $P(X\le k)$. “At least $k$” is ‹1 - ...(k-1, ..., TRUE)›, not ‹(k, TRUE)›!
:::

~~~python Discrete distributions in Python (scipy)
from scipy.stats import binom, poisson

print(binom.pmf(3, 10, 0.3))           # P(X = 3)
print(binom.cdf(3, 10, 0.3))           # P(X <= 3)
print(binom.sf(14, 500, 0.02))         # P(X > 14) = P(X >= 15)  -> 0.0814
print(poisson.sf(14, 10))              # Poisson approximation   -> 0.0835
print(binom.mean(10, 0.3), binom.var(10, 0.3))   # np, np(1-p)
~~~

::: summary
- $F(x) = P(X\le x)$: non-decreasing, right-continuous, from 0 to 1; $P(a<X\le b) = F(b)-F(a)$.
- Discrete: $p(x_i)\ge0$, $\sum p(x_i) = 1$; step-shaped CDF.
- $E(X) = \sum x_ip_i$, $V(X) = E(X^2)-(EX)^2$, $E(aX+b)=aEX+b$, $V(aX+b)=a^2VX$.
- Bin(n, p): $\binom nk p^k(1-p)^{n-k}$, $E=np$, $V=np(1-p)$.
- Poisson: $e^{-\lambda}\lambda^k/k!$, $E=V=\lambda$; approximates Bin for $n\ge25$, $np\le10$ ($\lambda=np$).
:::
`,

    cheatsheet: md`
## CDF
$F(x) = P(X\le x)$ · $P(a<X\le b) = F(b)-F(a)$ · $P(X=a)$ = jump at $a$ · $P(X>a)=1-F(a)$

## Discrete variable
- $p_i\ge0$, $\sum p_i=1$; $F$ is a step function (cumulative sums)
- $E(X)=\sum x_ip_i$, $E(X^2)=\sum x_i^2p_i$
- $V(X)=E(X^2)-(EX)^2$, $\sigma=\sqrt V$
- $E(aX+b)=aEX+b$, $V(aX+b)=a^2VX$, $E[g(X)]=\sum g(x_i)p_i$

## Distributions
| distribution | $P(X=k)$ | $E$ | $V$ |
|---|---|---|---|
| Bernoulli | $p^k(1-p)^{1-k}$ | $p$ | $p(1-p)$ |
| Bin(n, p) | $\binom nk p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ |
| Poisson(λ) | $e^{-\lambda}\lambda^k/k!$ | $\lambda$ | $\lambda$ |

- Poisson ≈ Bin when $n\ge25$, $np\le10$: $\lambda=np$
- $k^*=\lfloor(n+1)p\rfloor$ — most probable number of successes
- $\lambda$ grows in proportion to time/area

## Traps
- $P(X<k)=P(X\le k-1)$ for integers
- “at least $k$” $=1-P(X\le k-1)$

## Excel
‹BINOM.DIST(k,n,p,FALSE/TRUE)› · ‹POISSON.DIST(k,λ,FALSE/TRUE)› · ‹SUMPRODUCT›
`,

    exercises: [
      {
        id: 'e1', tag: 'C04', title: 'A distribution table: probabilities, CDF, E and V',
        text: md`
A random variable $X$ has the distribution:

| $x_i$ | −1 | 0 | 3 | 4 |
|---|---:|---:|---:|---:|
| $P(X=x_i)$ | 0.2 | 0.3 | 0.1 | 0.4 |

a) Compute $P(X=3)$, $P(X<3)$, $P(-1<X<4)$.
b) Find and sketch the CDF.
c) Compute $E(X)$ and $V(X)$.
`,
        hint: md`b) Add the probabilities cumulatively; the CDF is constant between −1, 0, 3, 4. c) Use $V = E(X^2) - (EX)^2$.`,
        solution: md`
**a)** $P(X=3) = 0.1$; $P(X<3) = P(-1)+P(0) = 0.5$; $P(-1<X<4) = P(0)+P(3) = 0.4$ (the endpoints −1 and 4 are **not** included).

**b)**
$$F(x)=\begin{cases}0 & x<-1\\ 0.2 & -1\le x<0\\ 0.5 & 0\le x<3\\ 0.6 & 3\le x<4\\ 1 & x\ge4\end{cases}$$

@chart exCdf1

**c)**
| $x_i$ | −1 | 0 | 3 | 4 | sum |
|---|---:|---:|---:|---:|---:|
| $x_ip_i$ | −0.2 | 0 | 0.3 | 1.6 | **1.7** |
| $x_i^2p_i$ | 0.2 | 0 | 0.9 | 6.4 | **7.5** |

$E(X) = 1.7$, $V(X) = 7.5 - 1.7^2 = 7.5 - 2.89 = 4.61$, $\sigma\approx 2.147$.
`,
        answer: md`$P(X=3)=0.1$; $P(X<3)=0.5$; $P(-1<X<4)=0.4$; $E(X)=1.7$; $V(X)=4.61$.`
      },
      {
        id: 'e2', tag: 'C04', title: 'From the CDF to the mean',
        text: md`
The CDF of a random variable $X$:
$$F(x) = \begin{cases} 0 & x<0\\ 0.25 & 0\le x<2\\ 0.6 & 2\le x<5\\ 1 & x\ge 5\end{cases}$$
Compute the expected value, variance and standard deviation of $X$.
`,
        hint: md`Support points are where $F$ jumps, and the probabilities are the **jump heights**.`,
        solution: md`
Jumps: at 0 by 0.25; at 2 by $0.6-0.25 = 0.35$; at 5 by $1-0.6 = 0.4$.

| $x_i$ | 0 | 2 | 5 |
|---|---:|---:|---:|
| $p_i$ | 0.25 | 0.35 | 0.40 |

$E(X) = 0 + 0.7 + 2 = 2.7$; $E(X^2) = 0 + 1.4 + 10 = 11.4$;
$V(X) = 11.4 - 7.29 = 4.11$; $\sigma = \sqrt{4.11}\approx 2.027$.
`,
        answer: md`$E(X)=2.7$, $V(X)=4.11$, $\sigma\approx2.03$.`
      },
      {
        id: 'e3', tag: 'C04', title: 'New routers',
        text: md`
12 routers were bought. Each, independently of the others, is faulty with probability 0.05.
a) What is the probability that at most one is faulty?
b) A randomly chosen router was tested and turned out faulty. What is the probability that all the others work?
`,
        hint: md`a) $X\sim$ Bin(12; 0.05), compute $P(0)+P(1)$. b) The routers are independent — the state of the tested one says nothing about the other 11.`,
        solution: md`
**a)** $P(X\le1) = 0.95^{12} + 12\cdot0.05\cdot0.95^{11} \approx 0.5404 + 0.3413 = 0.8816$.

**b)** We need $P(\text{other 11 work}\mid\text{tested faulty})$. By independence the condition “drops out”:
$$P = 0.95^{11}\approx 0.5688$$
(Formally: $\frac{0.05\cdot0.95^{11}}{0.05} = 0.95^{11}$.)
`,
        answer: md`a) ≈ 0.8816; b) $0.95^{11}\approx0.5688$.`
      },
      {
        id: 'e4', tag: 'C04', title: 'Shooting hoops until two hits',
        text: md`
A basketball player has **5 attempts**. The test is passed after **2 hits** — then the player stops; otherwise shoots until the attempts run out. Each shot hits independently with probability 0.8. Let $X$ = the number of attempts taken. Find the distribution of $X$, sketch the CDF and compute $E(X)$.
`,
        hint: md`$X=k$ for $k<5$ means: exactly 1 hit in the first $k-1$ shots and the $k$-th shot hits. $X=5$ — when after 4 shots there are fewer than 2 hits.`,
        solution: md`
Let $p=0.8$, $q=0.2$.
- $X=2$: HH → $p^2 = 0.64$
- $X=3$: one hit in 2 shots, then a hit → $2pq\cdot p = 0.256$
- $X=4$: one hit in 3 shots, then a hit → $3pq^2\cdot p = 0.0768$
- $X=5$: at most 1 hit in the first 4 → $q^4 + 4pq^3 = 0.0016+0.0256 = 0.0272$

Sum = 1 ✓.

@chart exShots

@chart exShotsCdf

$E(X) = 2\cdot0.64 + 3\cdot0.256 + 4\cdot0.0768 + 5\cdot0.0272 = 2.4912$.
`,
        answer: md`$P(X=2,3,4,5) = 0.64;\ 0.256;\ 0.0768;\ 0.0272$; $E(X)\approx2.49$.`
      },
      {
        id: 'e5', tag: 'C04', title: 'Memory chips: exact and Poisson',
        text: md`
A memory chip fails a test with probability 0.02. Find the probability that among 150 chips **at most 3** fail. Then approximate it with the Poisson distribution.
`,
        hint: md`Exact: Bin(150; 0.02), sum for $k=0,\dots,3$. Approximation: $\lambda = np = 3$ — the conditions $n\ge25$, $np\le10$ hold.`,
        solution: md`
**Exact:** $P(X\le 3) = \sum_{k=0}^{3}\binom{150}{k}0.02^k\,0.98^{150-k}\approx 0.6472$.

**Poisson** ($\lambda = 3$): $P(X\le3) \approx e^{-3}\left(1 + 3 + \frac{9}{2} + \frac{27}{6}\right) = 13e^{-3} \approx 0.6472$.

The approximation is very good (they differ in the 5th decimal).

~~~excel
A1: =BINOM.DIST(3,150,0.02,TRUE)
A2: =POISSON.DIST(3,3,TRUE)
~~~
`,
        answer: md`Exact ≈ 0.6472; Poisson ≈ 0.6472.`
      },
      {
        id: 'e6', tag: 'C04', title: 'Bug reports in an app',
        text: md`
The number of bug reports per day for an app is Poisson with mean 2.4.
a) Write the probability mass function.
b) Find the probability that there are **more than 2** reports on a given day.
c) How many reports arrive on average in 5 working days?
`,
        hint: md`“More than 2” = $1 - P(0) - P(1) - P(2)$. In c) $\lambda$ scales with time.`,
        solution: md`
**a)** $P(X=k) = e^{-2.4}\dfrac{2.4^k}{k!}$, $k = 0,1,2,\dots$

**b)** $P(0)\approx0.0907$, $P(1)\approx0.2177$, $P(2)\approx0.2613$, so
$$P(X>2) = 1 - 0.5697 \approx 0.4303$$

**c)** In 5 days: $\lambda = 5\cdot2.4 = 12$ reports on average (and the count is Poisson with $\lambda=12$).
`,
        answer: md`b) ≈ 0.430; c) 12 reports on average.`
      },
      {
        id: 'e7', tag: 'C04', title: 'E-mail campaign',
        text: md`
About 1.5% of recipients click the link in an e-mail. The e-mail was sent to 600 random people. What is the probability that **at least 12** people click? Give the exact value and the Poisson approximation. How many clicks can we expect on average?
`,
        hint: md`$X\sim$ Bin(600; 0.015), $\lambda = 9$. “At least 12” $= 1 - P(X\le 11)$.`,
        solution: md`
$E(X) = np = 600\cdot0.015 = 9$.

- exact: $P(X\ge12) = 1 - \sum_{k=0}^{11}\binom{600}{k}0.015^k0.985^{600-k}\approx 0.1955$,
- Poisson: $1 - F(11; 9)\approx 1 - 0.8030 = 0.1970$.

~~~excel
A1: =1-BINOM.DIST(11,600,0.015,TRUE)   // 0.1955
A2: =1-POISSON.DIST(11,9,TRUE)         // 0.1970
~~~
`,
        answer: md`≈ 0.1955 (Poisson: ≈ 0.1970); 9 clicks on average.`
      },
      {
        id: 'e8', own: true, title: 'Light-bulb warranty and the most probable number',
        text: md`
Light bulbs are sold in packs of 8; each is faulty independently with probability 0.05. The shop refunds 5 PLN when exactly one bulb in a pack is faulty, and 40 PLN (the whole pack) when at least two are. Find the distribution of the cost $Y$ per pack and $E(Y)$. What is the most probable number of faulty bulbs in a pack?
`,
        hint: md`This follows the DVD example from the lecture: $X\sim$ Bin(8; 0.05), $Y = g(X)$.`,
        solution: md`
$P(X=0) = 0.95^8\approx0.6634$, $P(X=1) = 8\cdot0.05\cdot0.95^7\approx0.2793$, $P(X\ge2) = 1-0.6634-0.2793 \approx 0.0572$.

| $y$ [PLN] | 0 | 5 | 40 |
|---|---:|---:|---:|
| $P(Y=y)$ | 0.6634 | 0.2793 | 0.0572 |

$E(Y) = 5\cdot0.2793 + 40\cdot 0.0572 \approx 3.69$ PLN per pack.

Most probable number: $(n+1)p = 9\cdot0.05 = 0.45$ → $k^* = 0$.
`,
        answer: md`$Y\in\{0, 5, 40\}$ with prob. 0.6634; 0.2793; 0.0572; $E(Y)\approx3.69$ PLN; $k^*=0$.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'Случайная величина превращает результат эксперимента в число. Разберём функцию распределения, ряд распределения, математическое ожидание, дисперсию и два главных дискретных распределения: биномиальное и Пуассона.',
    lecture: md`
# Что такое случайная величина?

В эксперименте нас обычно интересуют не все детали результата, а **одно число**: сумма очков на двух кубиках, число бракованных изделий в поставке, время до отказа. {lecture:W03}

::: def | Случайная величина
**Случайная величина** $X$ — функция, которая каждому элементарному событию ставит в соответствие действительное число: $X:\Omega\to\mathbb{R}$ (и такая, что $\{X\le x\}$ — событие при любом $x$). Множество её значений $\mathcal{X}$ называют **носителем**. Случайные величины обозначают большими буквами из конца алфавита: $X, Y, Z$. {lecture:W03}
:::

::: intuition
Случайная величина — это «рецепт числа»: вы трижды бросаете монету (результат, например, ОРО), а $X$ говорит «посчитай орлы» → 2. Случайность — в эксперименте, а $X$ только переводит результат в число.
:::

# Функция распределения

::: def | Функция распределения (CDF)
$$F(x) = P(X\le x),\qquad x\in\mathbb{R}$$
— вероятность того, что $X$ примет значение **не больше** $x$ («накопленная» вероятность, англ. *cumulative distribution function*). {lecture:W03}
:::

Любая функция распределения:
1. $\lim\limits_{x\to-\infty}F(x) = 0$ и $\lim\limits_{x\to\infty}F(x) = 1$,
2. **неубывающая**,
3. **непрерывна справа**.
Эти три условия необходимы и достаточны, чтобы функция была функцией распределения. {lecture:W03}

::: formula | Как считать вероятности через F
$$P(a < X \le b) = F(b) - F(a)$$
$$P(X = a) = F(a) - F(a^-)\quad(\text{высота скачка в } a)$$
$$P(a\le X\le b) = F(b) - F(a^-),\qquad P(X>a) = 1 - F(a)$$
где $F(a^-)$ — левосторонний предел. Если $F$ непрерывна в $a$, то $P(X=a)=0$.
:::

::: example W03 | Число орлов в трёх бросках
$\Omega = \{OOO, OOR, ORO, ROO, ORR, ROR, RRO, RRR\}$, $X$ = число орлов, носитель $\{0,1,2,3\}$:
$P(X=0) = \frac18$, $P(X=1) = \frac38$, $P(X=2)=\frac38$, $P(X=3)=\frac18$.
$$F(x) = \begin{cases} 0 & x<0\\ 1/8 & 0\le x<1\\ 1/2 & 1\le x<2\\ 7/8 & 2\le x<3\\ 1 & x\ge 3\end{cases}$$
:::

@chart coinsCdf

# Дискретные величины и ряд распределения

::: def | Дискретная случайная величина
$X$ **дискретна**, если её носитель счётен: $\mathcal X = \{x_1, x_2, \dots\}$. **Ряд (функция) вероятностей**: $p(x_i) = P(X = x_i)$. Условия (необходимые и достаточные):
$$p(x_i)\ge 0,\qquad \sum_i p(x_i) = 1.$$
:::

Функция распределения дискретной величины **ступенчатая**: постоянна между точками носителя, а в точке $x_i$ прыгает на $p(x_i)$:
$$F(x) = \sum_{x_i\le x} p(x_i).$$

@chart coinsPmf

::: example W03 | От таблицы к функции распределения
| $x$ | 1 | 2 | 3 | 4 |
|---|---:|---:|---:|---:|
| $p(x)$ | 0,4 | 0,3 | 0,2 | 0,1 |

Суммируем нарастающим итогом: $F(1) = 0{,}4$, $F(2) = 0{,}7$, $F(3) = 0{,}9$, $F(4) = 1$, значит
$F(x)=0$ при $x<1$; $0{,}4$ при $1\le x<2$; $0{,}7$ при $2\le x<3$; $0{,}9$ при $3\le x<4$; $1$ при $x\ge4$.
:::

::: warn
Следите за строгими и нестрогими неравенствами! Для дискретной величины $P(X<2)\ne P(X\le 2)$ — они различаются на $P(X=2)$. В примере выше: $P(X<2) = 0{,}4$, $P(X\le2)=0{,}7$.
:::

**Дискретное равномерное распределение** на $\{x_1,\dots,x_n\}$: $P(X=x_i) = \frac1n$ (например, бросок кубика). {lecture:W03}

# Математическое ожидание

::: def | Математическое ожидание дискретной величины
$$E(X) = \sum_i x_i\,P(X = x_i)$$
(если ряд сходится абсолютно). Это **взвешенное среднее** значений с весами-вероятностями, «центр масс вероятности». {lecture:W03}
:::

::: intuition
Вы много раз играете в одну и ту же игру. $E(X)$ — **средний результат одной игры в долгосрочной перспективе**. Он не обязан быть возможным результатом: среднее число очков на кубике $3{,}5$, хотя такой грани нет.
:::

::: formula | Свойства
$$E[g(X)] = \sum_i g(x_i)\,P(X=x_i)\qquad E(aX+b) = aE(X)+b$$
:::

# Моменты, дисперсия, стандартное отклонение

- **Начальный момент** порядка $n$: $m_n = E(X^n)$; $m_1 = E(X)$.
- **Центральный момент** порядка $n$: $\mu_n = E[(X-\mu)^n]$, где $\mu = E(X)$. {lecture:W03}

::: def | Дисперсия
$$V(X) = \sigma^2 = E\big[(X-\mu)^2\big]$$
**Рабочая формула** (используйте её в задачах!):
$$V(X) = E(X^2) - \big(E(X)\big)^2,\qquad \sigma = \sqrt{V(X)}$$
:::

Дисперсия измеряет разброс вокруг среднего — в механике ей соответствует **момент инерции**. Свойство: $V(aX+b) = a^2V(X)$ (сдвиг не меняет разброс, масштаб умножает его на $a^2$). {lecture:W04a}

::: steps | E(X) и V(X) по таблице
1. Допишите строку $x_i\,p_i$ и просуммируйте → $E(X)$.
2. Допишите строку $x_i^2\,p_i$ и просуммируйте → $E(X^2)$.
3. $V(X) = E(X^2) - (E X)^2$, $\sigma=\sqrt{V}$.
4. Проверка: дисперсия никогда не бывает отрицательной.
:::

# Распределения Бернулли и биномиальное

**Распределение Бернулли (нуль-единичное)**: $X=1$ (успех) с вероятностью $p$, $X=0$ с вероятностью $1-p$. $E(X) = p$, $V(X) = p(1-p)$. {lecture:W03}

**Биномиальный эксперимент** удовлетворяет условиям:
1. состоит из $n$ испытаний, $n$ задано заранее,
2. каждое испытание — успех или неудача, $P(\text{успех}) = p$ в каждом,
3. испытания **независимы**.

::: def | Биномиальное распределение Bin(n, p)
$X$ = число успехов в $n$ независимых испытаниях Бернулли:
$$P(X = k) = \binom nk p^k(1-p)^{n-k},\qquad k=0,1,\dots,n$$
$$E(X) = np,\qquad V(X) = np(1-p),\qquad \sigma = \sqrt{np(1-p)}$$
:::

@chart bin03

@chart bin07

::: formula W03 | Наиболее вероятное число успехов
$$k^* = \lfloor (n+1)p\rfloor,\quad\text{а если } (n+1)p \text{ целое: } k^* = (n+1)p \text{ или } (n+1)p-1$$
Для Bin(10; 0,3): $(n+1)p = 3{,}3$ → $k^*=3$.
:::

::: example W03 | Система из 3 или из 5 элементов?
Система работает, если работает **хотя бы половина** элементов (независимых, надёжность $p$). Для 5 элементов: $\binom53p^3(1-p)^2+\binom54p^4(1-p)+p^5$; для 3: $\binom32p^2(1-p)+p^3$. Сравнение даёт: 5-элементная система лучше **тогда и только тогда**, когда $p\ge 0{,}5$.
:::

::: example W03 | Стоимость гарантии (функция от случайной величины)
DVD-диски бракованные с $p = 0{,}01$, продаются пачками по 10. Фирма возвращает стоимость 1 диска ($c$), если бракованный ровно один, и всей пачки ($10c$), если их больше. $X\sim$ Bin(10; 0,01), затраты $Y = g(X)$:

| $y$ | 0 | $c$ | $10c$ |
|---|---:|---:|---:|
| $P(Y=y)$ | 0,904 | 0,091 | 0,005 |

$E(Y) = 0\cdot0{,}904 + c\cdot0{,}091 + 10c\cdot 0{,}005 = 0{,}141c$ — средние дополнительные затраты на пачку.
:::

# Распределение Пуассона

Когда **$n$ велико, а $p$ мало**, считать $\binom nk$ неудобно. Лемма Пуассона: если $n\,p_n\to\lambda$, то $\binom nk p_n^k(1-p_n)^{n-k}\to e^{-\lambda}\frac{\lambda^k}{k!}$. {lecture:W03}

::: def | Распределение Пуассона P(λ)
$$P(X=k) = e^{-\lambda}\frac{\lambda^k}{k!},\qquad k = 0,1,2,\dots\qquad E(X) = V(X) = \lambda$$
:::

Модель Пуассона описывает **число событий за фиксированное время** (частицы в счётчике Гейгера, клиенты на заправке, ошибочные звонки), когда: за малое время $\Delta t$ одно событие происходит с вероятностью $\approx\lambda\Delta t$, два сразу — практически никогда, а числа событий в непересекающихся интервалах независимы. Тогда число событий до момента $t$ распределено по Пуассону с параметром $\lambda t$. {lecture:W03}

::: tip own
Параметр $\lambda$ масштабируется со временем: если в среднем 2 заявки в час, то за 3 часа число заявок распределено по Пуассону с $\lambda = 6$.
:::

::: formula W03 | Приближение Пуассона
При $n\ge 25$ и $np\le 10$:
$$\binom nk p^k(1-p)^{n-k}\approx e^{-np}\frac{(np)^k}{k!}$$
:::

::: example W03 | Вакцина
Вирус выживает после вакцины с $p=0{,}02$. Каков шанс, что из 500 вирусов выживут хотя бы 15? $\lambda = 500\cdot0{,}02 = 10$:
$$P(X\ge15) = 1 - P(X\le 14) \approx 1 - F(14;10) = 1 - 0{,}9165 = 0{,}0835$$
(точно по биномиальному: 0,0814). $F(k;\lambda)$ берём из таблиц распределения Пуассона.
:::

@chart binVsPois

# В Excel

~~~excel Математическое ожидание и дисперсия по таблице (x в C4:F4, p в C5:F5)
C7: =SUMPRODUCT(C4:F4,C5:F5)          // E(X)
C8: =SUMPRODUCT(C4:F4,C4:F4,C5:F5)    // E(X^2)
C9: =C8-C7^2                          // V(X)
C10: =SQRT(C9)                        // стандартное отклонение
~~~

~~~excel Биномиальное и Пуассона
A1: =BINOM.DIST(3,10,0.3,FALSE)       // P(X = 3) для Bin(10; 0,3)
A2: =BINOM.DIST(3,10,0.3,TRUE)        // P(X <= 3)
A3: =1-BINOM.DIST(14,500,0.02,TRUE)   // P(X >= 15), точно
A4: =1-POISSON.DIST(14,10,TRUE)       // то же, приближение Пуассона
A5: =POISSON.DIST(2,1.8,FALSE)        // P(X = 2) для P(1,8)
~~~

::: warn own
Последний аргумент: ‹FALSE› = $P(X=k)$, ‹TRUE› = $P(X\le k)$. «Не меньше $k$» — это ‹1 - ...(k-1, ..., TRUE)›, а не ‹(k, TRUE)›!
:::

~~~python Дискретные распределения в Python (scipy)
from scipy.stats import binom, poisson

print(binom.pmf(3, 10, 0.3))           # P(X = 3)
print(binom.cdf(3, 10, 0.3))           # P(X <= 3)
print(binom.sf(14, 500, 0.02))         # P(X > 14) = P(X >= 15)  -> 0.0814
print(poisson.sf(14, 10))              # приближение Пуассона    -> 0.0835
print(binom.mean(10, 0.3), binom.var(10, 0.3))   # np, np(1-p)
~~~

::: summary
- $F(x) = P(X\le x)$: неубывающая, непрерывна справа, от 0 до 1; $P(a<X\le b) = F(b)-F(a)$.
- Дискретная: $p(x_i)\ge0$, $\sum p(x_i) = 1$; ступенчатая функция распределения.
- $E(X) = \sum x_ip_i$, $V(X) = E(X^2)-(EX)^2$, $E(aX+b)=aEX+b$, $V(aX+b)=a^2VX$.
- Bin(n, p): $\binom nk p^k(1-p)^{n-k}$, $E=np$, $V=np(1-p)$.
- Пуассон: $e^{-\lambda}\lambda^k/k!$, $E=V=\lambda$; приближает Bin при $n\ge25$, $np\le10$ ($\lambda=np$).
:::
`,

    cheatsheet: md`
## Функция распределения
$F(x) = P(X\le x)$ · $P(a<X\le b) = F(b)-F(a)$ · $P(X=a)$ = скачок в $a$ · $P(X>a)=1-F(a)$

## Дискретная величина
- $p_i\ge0$, $\sum p_i=1$; $F$ ступенчатая (накопленные суммы)
- $E(X)=\sum x_ip_i$, $E(X^2)=\sum x_i^2p_i$
- $V(X)=E(X^2)-(EX)^2$, $\sigma=\sqrt V$
- $E(aX+b)=aEX+b$, $V(aX+b)=a^2VX$, $E[g(X)]=\sum g(x_i)p_i$

## Распределения
| распределение | $P(X=k)$ | $E$ | $V$ |
|---|---|---|---|
| Бернулли | $p^k(1-p)^{1-k}$ | $p$ | $p(1-p)$ |
| Bin(n, p) | $\binom nk p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ |
| Пуассон(λ) | $e^{-\lambda}\lambda^k/k!$ | $\lambda$ | $\lambda$ |

- Пуассон ≈ Bin при $n\ge25$, $np\le10$: $\lambda=np$
- $k^*=\lfloor(n+1)p\rfloor$ — наиболее вероятное число успехов
- $\lambda$ растёт пропорционально времени/площади

## Ловушки
- $P(X<k)=P(X\le k-1)$ для целых
- «не меньше $k$» $=1-P(X\le k-1)$

## Excel
‹BINOM.DIST(k,n,p,FALSE/TRUE)› · ‹POISSON.DIST(k,λ,FALSE/TRUE)› · ‹SUMPRODUCT› (PL: ‹ROZKŁ.DWUM›, ‹ROZKŁ.POISSON›, ‹SUMA.ILOCZYNÓW›)
`,

    exercises: [
      {
        id: 'e1', tag: 'C04', title: 'Таблица распределения: вероятности, F, E и V',
        text: md`
Случайная величина $X$ имеет распределение:

| $x_i$ | −1 | 0 | 3 | 4 |
|---|---:|---:|---:|---:|
| $P(X=x_i)$ | 0,2 | 0,3 | 0,1 | 0,4 |

а) Найдите $P(X=3)$, $P(X<3)$, $P(-1<X<4)$.
б) Найдите и нарисуйте функцию распределения.
в) Найдите $E(X)$ и $V(X)$.
`,
        hint: md`б) Суммируйте вероятности нарастающим итогом; функция постоянна между −1, 0, 3, 4. в) Используйте $V = E(X^2) - (EX)^2$.`,
        solution: md`
**а)** $P(X=3) = 0{,}1$; $P(X<3) = P(-1)+P(0) = 0{,}5$; $P(-1<X<4) = P(0)+P(3) = 0{,}4$ (концы −1 и 4 **не** входят).

**б)**
$$F(x)=\begin{cases}0 & x<-1\\ 0{,}2 & -1\le x<0\\ 0{,}5 & 0\le x<3\\ 0{,}6 & 3\le x<4\\ 1 & x\ge4\end{cases}$$

@chart exCdf1

**в)**
| $x_i$ | −1 | 0 | 3 | 4 | сумма |
|---|---:|---:|---:|---:|---:|
| $x_ip_i$ | −0,2 | 0 | 0,3 | 1,6 | **1,7** |
| $x_i^2p_i$ | 0,2 | 0 | 0,9 | 6,4 | **7,5** |

$E(X) = 1{,}7$, $V(X) = 7{,}5 - 1{,}7^2 = 7{,}5 - 2{,}89 = 4{,}61$, $\sigma\approx 2{,}147$.
`,
        answer: md`$P(X=3)=0{,}1$; $P(X<3)=0{,}5$; $P(-1<X<4)=0{,}4$; $E(X)=1{,}7$; $V(X)=4{,}61$.`
      },
      {
        id: 'e2', tag: 'C04', title: 'От функции распределения к среднему',
        text: md`
Функция распределения случайной величины $X$:
$$F(x) = \begin{cases} 0 & x<0\\ 0{,}25 & 0\le x<2\\ 0{,}6 & 2\le x<5\\ 1 & x\ge 5\end{cases}$$
Найдите математическое ожидание, дисперсию и стандартное отклонение $X$.
`,
        hint: md`Точки носителя — места скачков, а вероятности — **высоты скачков**.`,
        solution: md`
Скачки: в 0 на 0,25; в 2 на $0{,}6-0{,}25 = 0{,}35$; в 5 на $1-0{,}6 = 0{,}4$.

| $x_i$ | 0 | 2 | 5 |
|---|---:|---:|---:|
| $p_i$ | 0,25 | 0,35 | 0,40 |

$E(X) = 0 + 0{,}7 + 2 = 2{,}7$; $E(X^2) = 0 + 1{,}4 + 10 = 11{,}4$;
$V(X) = 11{,}4 - 7{,}29 = 4{,}11$; $\sigma = \sqrt{4{,}11}\approx 2{,}027$.
`,
        answer: md`$E(X)=2{,}7$, $V(X)=4{,}11$, $\sigma\approx2{,}03$.`
      },
      {
        id: 'e3', tag: 'C04', title: 'Новые роутеры',
        text: md`
Купили 12 роутеров. Каждый, независимо от других, неисправен с вероятностью 0,05.
а) Какова вероятность, что неисправен не больше чем один?
б) Случайно выбранный роутер проверили — он неисправен. Какова вероятность, что все остальные исправны?
`,
        hint: md`а) $X\sim$ Bin(12; 0,05), считаем $P(0)+P(1)$. б) Роутеры независимы — состояние проверенного ничего не говорит об остальных 11.`,
        solution: md`
**а)** $P(X\le1) = 0{,}95^{12} + 12\cdot0{,}05\cdot0{,}95^{11} \approx 0{,}5404 + 0{,}3413 = 0{,}8816$.

**б)** Нужно $P(\text{остальные 11 исправны}\mid\text{проверенный неисправен})$. Из независимости условие «пропадает»:
$$P = 0{,}95^{11}\approx 0{,}5688$$
(Формально: $\frac{0{,}05\cdot0{,}95^{11}}{0{,}05} = 0{,}95^{11}$.)
`,
        answer: md`а) ≈ 0,8816; б) $0{,}95^{11}\approx0{,}5688$.`
      },
      {
        id: 'e4', tag: 'C04', title: 'Броски в кольцо до двух попаданий',
        text: md`
У баскетболиста **5 бросков**. Тест засчитывается после **2 попаданий** — тогда он прекращает бросать; иначе бросает до конца попыток. Каждый бросок попадает независимо с вероятностью 0,8. Пусть $X$ — число сделанных бросков. Найдите распределение $X$, нарисуйте функцию распределения и найдите $E(X)$.
`,
        hint: md`$X=k$ при $k<5$: в первых $k-1$ бросках ровно 1 попадание, а $k$-й бросок точный. $X=5$ — если после 4 бросков меньше 2 попаданий.`,
        solution: md`
Пусть $p=0{,}8$, $q=0{,}2$.
- $X=2$: ПП → $p^2 = 0{,}64$
- $X=3$: одно попадание в 2 бросках, затем попадание → $2pq\cdot p = 0{,}256$
- $X=4$: одно попадание в 3 бросках, затем попадание → $3pq^2\cdot p = 0{,}0768$
- $X=5$: в первых 4 не больше 1 попадания → $q^4 + 4pq^3 = 0{,}0016+0{,}0256 = 0{,}0272$

Сумма = 1 ✓.

@chart exShots

@chart exShotsCdf

$E(X) = 2\cdot0{,}64 + 3\cdot0{,}256 + 4\cdot0{,}0768 + 5\cdot0{,}0272 = 2{,}4912$.
`,
        answer: md`$P(X=2,3,4,5) = 0{,}64;\ 0{,}256;\ 0{,}0768;\ 0{,}0272$; $E(X)\approx2{,}49$.`
      },
      {
        id: 'e5', tag: 'C04', title: 'Модули памяти: точно и по Пуассону',
        text: md`
Модуль памяти не проходит тест с вероятностью 0,02. Найдите вероятность того, что из 150 модулей **не больше 3** не пройдут тест. Затем приблизьте её распределением Пуассона.
`,
        hint: md`Точно: Bin(150; 0,02), сумма для $k=0,\dots,3$. Приближение: $\lambda = np = 3$ — условия $n\ge25$, $np\le10$ выполнены.`,
        solution: md`
**Точно:** $P(X\le 3) = \sum_{k=0}^{3}\binom{150}{k}0{,}02^k\,0{,}98^{150-k}\approx 0{,}6472$.

**Пуассон** ($\lambda = 3$): $P(X\le3) \approx e^{-3}\left(1 + 3 + \frac{9}{2} + \frac{27}{6}\right) = 13e^{-3} \approx 0{,}6472$.

Приближение очень хорошее (разница в 5-м знаке).

~~~excel
A1: =BINOM.DIST(3,150,0.02,TRUE)
A2: =POISSON.DIST(3,3,TRUE)
~~~
`,
        answer: md`Точно ≈ 0,6472; Пуассон ≈ 0,6472.`
      },
      {
        id: 'e6', tag: 'C04', title: 'Сообщения об ошибках в приложении',
        text: md`
Число сообщений об ошибках в приложении за день распределено по Пуассону со средним 2,4.
а) Запишите ряд распределения.
б) Найдите вероятность, что за день придёт **больше 2** сообщений.
в) Сколько сообщений в среднем приходит за 5 рабочих дней?
`,
        hint: md`«Больше 2» = $1 - P(0) - P(1) - P(2)$. В в) $\lambda$ масштабируется со временем.`,
        solution: md`
**а)** $P(X=k) = e^{-2{,}4}\dfrac{2{,}4^k}{k!}$, $k = 0,1,2,\dots$

**б)** $P(0)\approx0{,}0907$, $P(1)\approx0{,}2177$, $P(2)\approx0{,}2613$, значит
$$P(X>2) = 1 - 0{,}5697 \approx 0{,}4303$$

**в)** За 5 дней: $\lambda = 5\cdot2{,}4 = 12$ сообщений в среднем (и число сообщений распределено по Пуассону с $\lambda=12$).
`,
        answer: md`б) ≈ 0,430; в) в среднем 12 сообщений.`
      },
      {
        id: 'e7', tag: 'C04', title: 'Email-рассылка',
        text: md`
По ссылке в письме кликают около 1,5% получателей. Письмо отправили 600 случайным людям. Какова вероятность, что кликнут **не меньше 12** человек? Дайте точное значение и приближение Пуассона. Сколько кликов в среднем можно ожидать?
`,
        hint: md`$X\sim$ Bin(600; 0,015), $\lambda = 9$. «Не меньше 12» $= 1 - P(X\le 11)$.`,
        solution: md`
$E(X) = np = 600\cdot0{,}015 = 9$.

- точно: $P(X\ge12) = 1 - \sum_{k=0}^{11}\binom{600}{k}0{,}015^k0{,}985^{600-k}\approx 0{,}1955$,
- Пуассон: $1 - F(11; 9)\approx 1 - 0{,}8030 = 0{,}1970$.

~~~excel
A1: =1-BINOM.DIST(11,600,0.015,TRUE)   // 0,1955
A2: =1-POISSON.DIST(11,9,TRUE)         // 0,1970
~~~
`,
        answer: md`≈ 0,1955 (Пуассон: ≈ 0,1970); в среднем 9 кликов.`
      },
      {
        id: 'e8', own: true, title: 'Гарантия на лампочки и наиболее вероятное число',
        text: md`
Лампочки продают упаковками по 8 штук; каждая бракованная независимо с вероятностью 0,05. Магазин возвращает 5 зл, если в упаковке ровно одна бракованная, и 40 зл (всю упаковку), если бракованных хотя бы две. Найдите распределение затрат $Y$ на одну упаковку и $E(Y)$. Каково наиболее вероятное число бракованных лампочек в упаковке?
`,
        hint: md`Задача по образцу примера с DVD из лекции: $X\sim$ Bin(8; 0,05), $Y = g(X)$.`,
        solution: md`
$P(X=0) = 0{,}95^8\approx0{,}6634$, $P(X=1) = 8\cdot0{,}05\cdot0{,}95^7\approx0{,}2793$, $P(X\ge2) = 1-0{,}6634-0{,}2793 \approx 0{,}0572$.

| $y$ [зл] | 0 | 5 | 40 |
|---|---:|---:|---:|
| $P(Y=y)$ | 0,6634 | 0,2793 | 0,0572 |

$E(Y) = 5\cdot0{,}2793 + 40\cdot 0{,}0572 \approx 3{,}69$ зл на упаковку.

Наиболее вероятное число: $(n+1)p = 9\cdot0{,}05 = 0{,}45$ → $k^* = 0$.
`,
        answer: md`$Y\in\{0, 5, 40\}$ с вероятностями 0,6634; 0,2793; 0,0572; $E(Y)\approx3{,}69$ зл; $k^*=0$.`
      }
    ]
  };

  SAD.registerTopic('t03', { charts: charts, pl: pl, en: en, ru: ru });
})();
