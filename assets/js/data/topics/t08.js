/* Topic 8 — Law of large numbers and the Central Limit Theorem (lecture W07, classes C10) */
(function () {
  var md = SAD.md;

  var charts = {
    sleepBin: { type: 'pmf', dist: { name: 'binom', n: 100, p: 0.39 }, normal: { mu: 39, sigma: 4.8775 },
      highlight: function (k) { return k <= 33; }, xLabel: 'k', yLabel: 'P(X = k)',
      caption: { pl: 'Bin(100; 0,39) i przybliżająca ją krzywa N(39; 4,88). Pomarańczowe słupki: k ≤ 33.', en: 'Bin(100; 0.39) and the approximating curve N(39; 4.88). Orange bars: k ≤ 33.', ru: 'Bin(100; 0,39) и приближающая кривая N(39; 4,88). Оранжевые столбики: k ≤ 33.' } },
    poisNorm: { type: 'pmf', dist: { name: 'poisson', lambda: 25 }, normal: { mu: 25, sigma: 5 }, xLabel: 'k', yLabel: 'P(X = k)',
      caption: { pl: 'Poisson(25) ≈ N(25; 5): przy dużym λ rozkład Poissona też staje się „dzwonem”', en: 'Poisson(25) ≈ N(25; 5): for large λ the Poisson distribution also becomes a “bell”', ru: 'Пуассон(25) ≈ N(25; 5): при большом λ распределение Пуассона тоже становится «колоколом»' } }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Dwa filary statystyki: **prawo wielkich liczb** (średnia z dużej próby jest blisko prawdziwej średniej) i **centralne twierdzenie graniczne** (suma wielu niezależnych składników ma w przybliżeniu rozkład normalny — nawet gdy składniki normalne nie są).',
    lecture: md`
# Próba losowa

::: def W07 | Prosta próba losowa
**Prostą próbą losową** o liczności $n$ nazywamy ciąg **niezależnych** zmiennych $X_1,\dots,X_n$ o **takim samym rozkładzie** (rozkładzie badanej cechy). Konkretne liczby $x_1,\dots,x_n$, które zaobserwujemy, to **realizacja** próby, czyli **próbka**.
:::

::: intuition
Próba losowa to „przepis na pomiar” zanim go wykonasz: każdy $X_i$ to losowy wynik $i$-tego pomiaru. Gdy już zmierzysz — masz próbkę, zwykłe liczby.
:::

**Zadanie statystyki:** poznać własności rozkładu cechy na podstawie próbki. Np.: jak ocenić nieznaną średnią $\mu$? Dlaczego $\bar x$ jest dobrą oceną? Jaki jest rozkład średniej z próby? {lecture:W07}

::: formula W07 | Średnia z próby losowej
$$\bar X = \frac1n\sum_{i=1}^n X_i,\qquad E(\bar X) = \mu,\qquad V(\bar X) = \frac{\sigma^2}{n}$$
Jeśli dodatkowo $X\sim N(\mu,\sigma)$, to **dokładnie** $\bar X\sim N\left(\mu,\ \frac{\sigma}{\sqrt n}\right)$.
:::

::: example W07 | Średni wzrost
Wzrost Polaków $\sim N(\mu;\ 6{,}5\ \text{cm})$, $\mu$ nieznane. Jaka jest szansa, że średnia ze 100 osób różni się od $\mu$ o więcej niż 1,5 cm?
$\bar X\sim N(\mu;\ 0{,}65)$, więc
$$P(|\bar X-\mu|>1{,}5) = 2\left(1-\Phi\left(\tfrac{1{,}5}{0{,}65}\right)\right) = 2(1-\Phi(2{,}31))\approx0{,}021$$
Zaledwie ok. 2% — średnia ze 100 osób jest bardzo dobrą oceną $\mu$.
:::

# Prawo wielkich liczb

::: def W07 | Prawo wielkich liczb (PWL)
Dla prostej próby losowej z rozkładu o średniej $\mu$ i dowolnie małego $\varepsilon>0$:
$$P\big(\bar X\in[\mu-\varepsilon,\ \mu+\varepsilon]\big)\ \xrightarrow{\ n\to\infty\ }\ 1$$
:::

::: intuition
Rzucasz monetą: po 10 rzutach możesz mieć 70% orłów, po 10 000 — praktycznie na pewno między 49% a 51%. Częstość „stabilizuje się” przy prawdopodobieństwie. To właśnie uzasadnia częstościową definicję prawdopodobieństwa z tematu 2.
:::

# Centralne twierdzenie graniczne

::: def W07 | Centralne twierdzenie graniczne (CTG)
Jeśli $X_1,\dots,X_n$ są niezależne, o tym samym rozkładzie ze średnią $\mu$ i wariancją $\sigma^2$, to dla $S_n = X_1+\dots+X_n$:
$$P\left(a\le\frac{S_n - n\mu}{\sigma\sqrt n}\le b\right)\ \xrightarrow{\ n\to\infty\ }\ \Phi(b)-\Phi(a)$$
W praktyce (zwykle już dla $n\ge30$):
$$S_n\approx N\left(n\mu,\ \sigma\sqrt n\right),\qquad \bar X\approx N\left(\mu,\ \frac{\sigma}{\sqrt n}\right)$$
:::

::: intuition
Pojedyncza kostka ma rozkład „płaski”. Suma dwóch kostek — trójkąt. Suma dziesięciu — już ładny dzwon. **Rozkład pojedynczego składnika przestaje mieć znaczenie**: liczą się tylko $\mu$ i $\sigma$. Dlatego rozkład normalny pojawia się wszędzie tam, gdzie wynik jest sumą wielu drobnych, niezależnych wpływów.
:::

@widget clt-dice

::: steps | Zadanie z CTG — schemat
1. Zidentyfikuj pojedynczy składnik $X_i$: policz jego $\mu = E(X_i)$ i $\sigma^2 = V(X_i)$.
2. Suma: $E(S_n) = n\mu$, $\sigma_{S_n} = \sigma\sqrt n$ (albo średnia: $\mu$, $\sigma/\sqrt n$).
3. Standaryzuj granice: $z = \dfrac{x - n\mu}{\sigma\sqrt n}$.
4. Odczytaj $\Phi(z)$; dla sum wartości całkowitych użyj **poprawki ciągłości** (poniżej).
:::

# CTG dla rozkładu dwumianowego (Moivre–Laplace)

Zmienna $S_n\sim\text{Bin}(n,p)$ to suma $n$ zmiennych zero-jedynkowych ($\mu = p$, $\sigma^2 = p(1-p)$), więc:

::: formula W07 | Twierdzenie Moivre'a–Laplace'a
$$P\left(a\le\frac{S_n-np}{\sqrt{np(1-p)}}\le b\right)\ \longrightarrow\ \Phi(b)-\Phi(a),\qquad S_n\approx N\big(np,\ \sqrt{np(1-p)}\big)$$
:::

::: formula W07 | Poprawka ciągłości
Rozkład dwumianowy jest skokowy (wartości całkowite), a normalny ciągły. Ponieważ $P(X\le x) = P(X<x+1)$, lepiej przybliżać
$$P(X\le x)\approx\Phi\left(\frac{x+\frac12-np}{\sqrt{np(1-p)}}\right)$$
Stosujemy, gdy $np\ge5$ i $n(1-p)\ge5$; poprawka jest szczególnie ważna dla $n\le100$.
:::

::: tip own | Poprawka ciągłości — ściąga
| zdarzenie (wartości całkowite) | zamień na |
|---|---|
| $X\le k$ | $X< k+0{,}5$ |
| $X<k$ | $X<k-0{,}5$ |
| $X\ge k$ | $X>k-0{,}5$ |
| $X>k$ | $X>k+0{,}5$ |
| $a\le X\le b$ | $a-0{,}5<X<b+0{,}5$ |
:::

::: example W07 | Kłopoty ze snem
39% dorosłych ma kłopoty ze snem. Jaka jest szansa, że wśród 100 losowych osób odsetek ten nie przekroczy 33%? $S\sim$ Bin(100; 0,39), $np = 39$, $\sqrt{np(1-p)}\approx4{,}88$.
$$P(\hat p\le0{,}33) = P(S\le33)\approx\Phi\left(\frac{33{,}5-39}{4{,}88}\right) = \Phi(-1{,}13)\approx0{,}129$$
Wartość dokładna 0,1292; **bez** poprawki ciągłości wyszłoby 0,109 — wyraźnie gorzej.
:::

@chart sleepBin

::: note W07 | CTG dla rozkładu Poissona
Zmienna Poisson($\lambda$) to suma wielu niezależnych Poissonów o małych parametrach, więc dla dużego $\lambda$: $X\approx N(\lambda,\ \sqrt\lambda)$ (też z poprawką ciągłości).
:::

@chart poisNorm

# Rozkład częstości (proporcji)

Niech $p$ = odsetek elementów populacji z daną własnością, $X_i = 1$, gdy $i$-ty wylosowany ją ma. **Częstość w próbie**:
$$\hat p = \frac{S_n}{n} = \bar X,\qquad E(\hat p) = p,\qquad V(\hat p) = \frac{p(1-p)}{n}$$
Z CTG: $\dfrac{\hat p - p}{\sqrt{p(1-p)/n}}\approx N(0,1)$, a także (co przyda się w przedziałach ufności) $\dfrac{\hat p-p}{\sqrt{\hat p(1-\hat p)/n}}\approx N(0,1)$. {lecture:W07}

# Estymator — zapowiedź

::: def W07 | Estymator i nieobciążoność
**Estymator** parametru $\theta$ to statystyka $\hat\theta = h(X_1,\dots,X_n)$, której wartości są „rozsądnymi” ocenami $\theta$. Estymator jest **nieobciążony**, jeśli $E(\hat\theta) = \theta$. Przykłady: $\bar X$ dla $\mu$, $\hat p$ dla $p$, $S^2$ (z dzielnikiem $n-1$) dla $\sigma^2$. Więcej w temacie 9.
:::

# W Excelu

~~~excel CTG w praktyce
A1: =1-BINOM.DIST(33,100,0.39,TRUE)                     // dokładnie P(S > 33)
A2: =BINOM.DIST(33,100,0.39,TRUE)                       // dokładnie P(S <= 33)
A3: =NORM.DIST(33.5,100*0.39,SQRT(100*0.39*0.61),TRUE)  // CTG z poprawką ciągłości
A4: =NORM.DIST(33,100*0.39,SQRT(100*0.39*0.61),TRUE)    // CTG bez poprawki
A5: =(1.96*SQRT(35/12)/0.1)^2                           // minimalne n dla kostki (zadanie 9)
~~~

~~~python Porównanie: dokładnie vs CTG
from scipy.stats import binom, norm
n, p = 100, 0.39
mu, sd = n * p, (n * p * (1 - p)) ** 0.5
print(binom.cdf(33, n, p))              # dokładnie        0.1292
print(norm.cdf((33.5 - mu) / sd))       # z poprawką       0.1297
print(norm.cdf((33 - mu) / sd))         # bez poprawki     0.1093
~~~

::: summary
- $E(\bar X) = \mu$, $V(\bar X) = \sigma^2/n$; PWL: $\bar X\to\mu$.
- CTG: $S_n\approx N(n\mu, \sigma\sqrt n)$, $\bar X\approx N(\mu,\sigma/\sqrt n)$ — dla **dowolnego** rozkładu składników.
- Bin(n, p) ≈ $N(np, \sqrt{np(1-p)})$ przy $np\ge5$, $n(1-p)\ge5$; **poprawka ciągłości** ±0,5.
- Poisson(λ) ≈ $N(\lambda,\sqrt\lambda)$ dla dużego λ.
- $\hat p$: $E=p$, $V = p(1-p)/n$.
:::
`,

    cheatsheet: md`
## Średnia z próby
$E(\bar X)=\mu$ · $V(\bar X)=\sigma^2/n$ · $X\sim N\Rightarrow\bar X\sim N(\mu,\sigma/\sqrt n)$ dokładnie

## CTG (n ≥ 30, dowolny rozkład)
$$S_n\approx N(n\mu,\ \sigma\sqrt n)\qquad \bar X\approx N\Big(\mu,\ \frac{\sigma}{\sqrt n}\Big)\qquad z=\frac{S_n-n\mu}{\sigma\sqrt n}$$

## Bin(n, p) ≈ N(np, √(np(1−p)))
warunek: $np\ge5$, $n(1-p)\ge5$
| zdarzenie | z poprawką |
|---|---|
| $X\le k$ | $\Phi\big(\frac{k+0{,}5-np}{\sqrt{npq}}\big)$ |
| $X\ge k$ | $1-\Phi\big(\frac{k-0{,}5-np}{\sqrt{npq}}\big)$ |
| $a\le X\le b$ | $\Phi\big(\frac{b+0{,}5-np}{\sqrt{npq}}\big)-\Phi\big(\frac{a-0{,}5-np}{\sqrt{npq}}\big)$ |

## Poisson(λ) ≈ N(λ, √λ) · wykładniczy(λ): μ = σ = 1/λ

## Szukanie n (typowe)
Warunek $P(\dots)\ge0{,}95$ → nierówność z $z_{0{,}95}=1{,}645$ lub $z_{0{,}975}=1{,}96$ → podstaw $u=\sqrt n$ (równanie kwadratowe) lub sprawdzaj kolejne $n$. Zaokrąglaj $n$ **w górę**.

## Częstość
$\hat p=S_n/n$: $E=p$, $V=\frac{p(1-p)}{n}$
`,

    exercises: [
      {
        id: 'e1', tag: 'C10', title: 'Tryb ciemny w aplikacji',
        text: md`
35% użytkowników aplikacji używa trybu ciemnego. Jakie jest prawdopodobieństwo, że wśród 600 losowych użytkowników trybu ciemnego używa **więcej niż 190, ale nie więcej niż 230** osób? Użyj CTG z poprawką ciągłości i porównaj z wynikiem bez poprawki.
`,
        hint: md`$P(190<X\le230) = P(X\le230) - P(X\le190)$. $np = 210$, $\sqrt{np(1-p)}\approx11{,}68$.`,
        solution: md`
$X\sim$ Bin(600; 0,35), $np = 210$, $\sigma = \sqrt{600\cdot0{,}35\cdot0{,}65}\approx11{,}68$.
Z poprawką: $P(190{,}5 < X < 230{,}5)\approx\Phi\left(\frac{230{,}5-210}{11{,}68}\right)-\Phi\left(\frac{190{,}5-210}{11{,}68}\right) = \Phi(1{,}75)-\Phi(-1{,}67)\approx0{,}9599-0{,}0475 = 0{,}912$.
Bez poprawki: $\Phi(1{,}71)-\Phi(-1{,}71)\approx0{,}913$. Dokładnie (Excel): 0,9129 — przy dużym $n$ poprawka ma niewielkie znaczenie.
`,
        answer: md`≈ 0,913.`
      },
      {
        id: 'e2', tag: 'C10', title: 'Baterie wymieniane na bieżąco',
        text: md`
Mamy 64 baterie; czas pracy każdej ma rozkład wykładniczy ze średnią 10 h. Używamy jednej naraz, a zużytą natychmiast wymieniamy. Wyznacz prawdopodobieństwo, że po 600 godzinach
1. w zapasie zostanie jeszcze co najmniej jedna bateria;
2. jakaś bateria nadal działa.
`,
        hint: md`Dla wykładniczego: $\mu = \sigma = 10$. „Zostaje zapas” ⇔ pierwsze 63 baterie wystarczyły na ponad 600 h: $S_{63}>600$.`,
        solution: md`
1. $S_{63}\approx N(630;\ 10\sqrt{63}\approx79{,}37)$: $P(S_{63}>600) = 1-\Phi(-0{,}378)\approx0{,}647$.
2. $S_{64}\approx N(640;\ 80)$: $P(S_{64}>600) = 1-\Phi(-0{,}5) = 0{,}6915$.
`,
        answer: md`1) ≈ 0,647; 2) ≈ 0,692.`
      },
      {
        id: 'e3', tag: 'C10', title: 'Trzy metody na jedno prawdopodobieństwo',
        text: md`
Podzespół spełnia podwyższone wymagania z prawdopodobieństwem 0,25. Kupujemy 40 podzespołów. Oblicz prawdopodobieństwo, że co najmniej 14 spełni wymagania: a) dokładnie; b) przybliżeniem Poissona; c) z CTG.
`,
        hint: md`$X\sim$ Bin(40; 0,25), $np = 10$, $\sqrt{np(1-p)} = \sqrt{7{,}5}$.`,
        solution: md`
a) $P(X\ge14) = 1-\sum_{k=0}^{13}\binom{40}{k}0{,}25^k0{,}75^{40-k}\approx0{,}103$.
b) Poisson(10): $1-F(13;10)\approx0{,}136$ — słabo, bo $p=0{,}25$ nie jest „małe”.
c) CTG z poprawką: $1-\Phi\left(\frac{13{,}5-10}{2{,}739}\right) = 1-\Phi(1{,}28)\approx0{,}101$ — bardzo blisko wyniku dokładnego.
`,
        answer: md`a) ≈ 0,103; b) ≈ 0,136; c) ≈ 0,101.`
      },
      {
        id: 'e4', tag: 'C10', title: 'Ile serwerów w klastrze?',
        text: md`
Każdy z $n$ serwerów jest (niezależnie) aktywny z prawdopodobieństwem 0,6. Jakie musi być $n$, żeby z prawdopodobieństwem co najmniej 0,95 aktywnych było **co najmniej 30** serwerów?
`,
        hint: md`Warunek z poprawką: $\frac{29{,}5-0{,}6n}{\sqrt{0{,}24n}}\le-1{,}645$. Podstaw $u=\sqrt n$.`,
        solution: md`
$0{,}6n - 1{,}645\sqrt{0{,}24n}\ge29{,}5$. Dla $u=\sqrt n$: $0{,}6u^2-0{,}806u-29{,}5\ge0$ → $u\ge\frac{0{,}806+\sqrt{0{,}650+70{,}8}}{1{,}2}\approx7{,}716$ → $n\ge59{,}5$.
Sprawdzenie: $n=59$: $P\approx0{,}942$ ✗; $n=60$: $P\approx0{,}957$ ✓. Potrzeba **60 serwerów**.
`,
        answer: md`$n = 60$.`
      },
      {
        id: 'e5', tag: 'C10', title: 'Ile wyprodukować, żeby zmieścić zamówienie?',
        text: md`
Przy produkcji 5% elementów to braki. Ile elementów trzeba zaplanować, aby z prawdopodobieństwem co najmniej 0,95 otrzymać **co najmniej 500 dobrych**?
`,
        hint: md`Liczba dobrych $\sim$ Bin(n; 0,95). Szukamy najmniejszego $n$, dla którego $P(X\ge500)\ge0{,}95$.`,
        solution: md`
Warunek z poprawką: $\frac{499{,}5-0{,}95n}{\sqrt{0{,}0475n}}\le-1{,}645$.
Sprawdzając: $n=534$: $P\approx0{,}939$ ✗; $n=535$: $P\approx0{,}959$ ✓ (dokładnie 0,954).
Trzeba zaplanować **535 elementów**.
`,
        answer: md`535 elementów.`
      },
      {
        id: 'e6', tag: 'C10', title: 'Overbooking w samolocie',
        text: md`
Samolot ma 180 miejsc. Tylko 92% pasażerów z biletem faktycznie się stawia. Linia sprzedaje więcej biletów niż miejsc.
a) Jakie jest prawdopodobieństwo, że przy 190 sprzedanych biletach zabraknie miejsc?
b) Ile najwięcej biletów można sprzedać, żeby z prawdopodobieństwem co najmniej 95% dla nikogo nie zabrakło miejsca?
`,
        hint: md`Brak miejsc ⇔ stawi się co najmniej 181 osób. b) sprawdzaj $P(X\le180)$ dla kolejnych $N$.`,
        solution: md`
a) $X\sim$ Bin(190; 0,92), $np = 174{,}8$, $\sigma\approx3{,}74$. $P(X\ge181)\approx1-\Phi\left(\frac{180{,}5-174{,}8}{3{,}74}\right) = 1-\Phi(1{,}52)\approx0{,}064$ (dokładnie 0,056).
b) $N = 189$: $P(X\le180)\approx\Phi\left(\frac{180{,}5-173{,}88}{3{,}73}\right)\approx0{,}962$ ✓; $N=190$: ≈ 0,936 ✗. Maksymalnie **189 biletów** (9 ponad liczbę miejsc).
`,
        answer: md`a) ≈ 0,064; b) 189 biletów.`
      },
      {
        id: 'e7', tag: 'C10', title: 'CTG dla zmiennej ciągłej',
        text: md`
$X_1,\dots,X_{100}$ są niezależne, każda z gęstością $f(x) = 2x$ na $[0;1]$. Oszacuj $P\left(64\le\sum X_i\le70\right)$.
`,
        hint: md`$E(X) = \frac23$, $E(X^2) = \frac12$, więc $V(X) = \frac1{18}$.`,
        solution: md`
$E(S) = 100\cdot\frac23\approx66{,}67$, $\sigma_S = \sqrt{100/18}\approx2{,}357$.
$P(64\le S\le70)\approx\Phi\left(\frac{70-66{,}67}{2{,}357}\right)-\Phi\left(\frac{64-66{,}67}{2{,}357}\right) = \Phi(1{,}41)-\Phi(-1{,}13)\approx0{,}921-0{,}129 = 0{,}792$.
(Zmienna ciągła — bez poprawki ciągłości.)
`,
        answer: md`≈ 0,792.`
      },
      {
        id: 'e8', tag: 'C09', title: 'Literówki w pracy dyplomowej',
        text: md`
Praca ma 250 stron; średnio jest 1 literówka na 10 stron, a liczba literówek na stronie ma rozkład Poissona. Podaj wzór na prawdopodobieństwo, że w całej pracy jest od 20 do 30 literówek, i przybliż je z CTG.
`,
        hint: md`Suma 250 Poissonów(0,1) to Poisson(25) ≈ $N(25; 5)$. Wartości całkowite → poprawka ciągłości.`,
        solution: md`
$X\sim$ Poisson(25): $P(20\le X\le30) = \sum_{k=20}^{30}e^{-25}\frac{25^k}{k!}$ (dokładnie ≈ 0,730).
CTG z poprawką: $\Phi\left(\frac{30{,}5-25}{5}\right)-\Phi\left(\frac{19{,}5-25}{5}\right) = \Phi(1{,}1)-\Phi(-1{,}1) = 2\cdot0{,}8643-1\approx0{,}729$.
`,
        answer: md`Wzór: $\sum_{k=20}^{30}e^{-25}25^k/k!$; CTG ≈ 0,729.`
      },
      {
        id: 'e9', own: true, title: 'Ile rzutów kostką?',
        text: md`
Ile razy trzeba rzucić uczciwą kostką, żeby z prawdopodobieństwem co najmniej 0,95 średnia liczba oczek różniła się od 3,5 o nie więcej niż 0,1?
`,
        hint: md`$V(X) = E(X^2) - 3{,}5^2 = \frac{91}{6}-12{,}25 = \frac{35}{12}$. Warunek: $1{,}96\cdot\frac{\sigma}{\sqrt n}\le0{,}1$.`,
        solution: md`
$\sigma = \sqrt{35/12}\approx1{,}708$. $n\ge\left(\frac{1{,}96\cdot1{,}708}{0{,}1}\right)^2\approx1120{,}5$ → **1121 rzutów**.
To ilustracja prawa wielkich liczb: dokładność 0,1 „kosztuje” ponad tysiąc rzutów, a dokładność 0,05 — cztery razy więcej.
`,
        answer: md`$n = 1121$.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'Two pillars of statistics: the **law of large numbers** (the mean of a large sample is close to the true mean) and the **central limit theorem** (a sum of many independent terms is approximately normal — even if the terms are not).',
    lecture: md`
# The random sample

::: def W07 | Simple random sample
A **simple random sample** of size $n$ is a sequence of **independent** variables $X_1,\dots,X_n$ with the **same distribution** (the distribution of the feature). The concrete numbers $x_1,\dots,x_n$ we observe are a **realisation** of the sample.
:::

::: intuition
A random sample is a “recipe for a measurement” before you do it: each $X_i$ is the random result of the $i$-th measurement. Once measured, you have plain numbers.
:::

**The task of statistics:** learn about the distribution of a feature from a sample. E.g.: how to estimate an unknown mean $\mu$? Why is $\bar x$ a good estimate? What is the distribution of the sample mean? {lecture:W07}

::: formula W07 | Mean of a random sample
$$\bar X = \frac1n\sum_{i=1}^n X_i,\qquad E(\bar X) = \mu,\qquad V(\bar X) = \frac{\sigma^2}{n}$$
If moreover $X\sim N(\mu,\sigma)$, then **exactly** $\bar X\sim N\left(\mu,\ \frac{\sigma}{\sqrt n}\right)$.
:::

::: example W07 | Mean height
Height of Poles $\sim N(\mu;\ 6.5\ \text{cm})$, $\mu$ unknown. What is the chance that the mean of 100 people differs from $\mu$ by more than 1.5 cm?
$\bar X\sim N(\mu;\ 0.65)$, so
$$P(|\bar X-\mu|>1.5) = 2\left(1-\Phi\left(\tfrac{1.5}{0.65}\right)\right) = 2(1-\Phi(2.31))\approx0.021$$
Only about 2% — the mean of 100 people is a very good estimate of $\mu$.
:::

# The law of large numbers

::: def W07 | Law of large numbers (LLN)
For a simple random sample from a distribution with mean $\mu$ and any small $\varepsilon>0$:
$$P\big(\bar X\in[\mu-\varepsilon,\ \mu+\varepsilon]\big)\ \xrightarrow{\ n\to\infty\ }\ 1$$
:::

::: intuition
Toss a coin: after 10 tosses you might have 70% heads, after 10,000 — practically surely between 49% and 51%. The frequency “settles” at the probability. This justifies the frequency definition of probability from topic 2.
:::

# The Central Limit Theorem

::: def W07 | Central Limit Theorem (CLT)
If $X_1,\dots,X_n$ are independent and identically distributed with mean $\mu$ and variance $\sigma^2$, then for $S_n = X_1+\dots+X_n$:
$$P\left(a\le\frac{S_n - n\mu}{\sigma\sqrt n}\le b\right)\ \xrightarrow{\ n\to\infty\ }\ \Phi(b)-\Phi(a)$$
In practice (usually already for $n\ge30$):
$$S_n\approx N\left(n\mu,\ \sigma\sqrt n\right),\qquad \bar X\approx N\left(\mu,\ \frac{\sigma}{\sqrt n}\right)$$
:::

::: intuition
A single die has a “flat” distribution. The sum of two dice — a triangle. The sum of ten — already a nice bell. **The distribution of a single term stops mattering**: only $\mu$ and $\sigma$ count. That is why the normal distribution appears wherever a result is a sum of many small, independent influences.
:::

@widget clt-dice

::: steps | A CLT problem — template
1. Identify a single term $X_i$: compute $\mu = E(X_i)$ and $\sigma^2 = V(X_i)$.
2. Sum: $E(S_n) = n\mu$, $\sigma_{S_n} = \sigma\sqrt n$ (or the mean: $\mu$, $\sigma/\sqrt n$).
3. Standardise the bounds: $z = \dfrac{x - n\mu}{\sigma\sqrt n}$.
4. Read $\Phi(z)$; for sums of integer values use the **continuity correction** (below).
:::

# CLT for the binomial distribution (de Moivre–Laplace)

$S_n\sim\text{Bin}(n,p)$ is a sum of $n$ zero-one variables ($\mu = p$, $\sigma^2 = p(1-p)$), so:

::: formula W07 | De Moivre–Laplace theorem
$$P\left(a\le\frac{S_n-np}{\sqrt{np(1-p)}}\le b\right)\ \longrightarrow\ \Phi(b)-\Phi(a),\qquad S_n\approx N\big(np,\ \sqrt{np(1-p)}\big)$$
:::

::: formula W07 | Continuity correction
The binomial is discrete (integers), the normal continuous. Since $P(X\le x) = P(X<x+1)$, it is better to approximate
$$P(X\le x)\approx\Phi\left(\frac{x+\frac12-np}{\sqrt{np(1-p)}}\right)$$
Use it when $np\ge5$ and $n(1-p)\ge5$; it matters especially for $n\le100$.
:::

::: tip own | Continuity correction — cheat sheet
| event (integer values) | replace with |
|---|---|
| $X\le k$ | $X< k+0.5$ |
| $X<k$ | $X<k-0.5$ |
| $X\ge k$ | $X>k-0.5$ |
| $X>k$ | $X>k+0.5$ |
| $a\le X\le b$ | $a-0.5<X<b+0.5$ |
:::

::: example W07 | Sleeping problems
39% of adults have sleeping problems. What is the chance that among 100 random people this share is at most 33%? $S\sim$ Bin(100; 0.39), $np = 39$, $\sqrt{np(1-p)}\approx4.88$.
$$P(\hat p\le0.33) = P(S\le33)\approx\Phi\left(\frac{33.5-39}{4.88}\right) = \Phi(-1.13)\approx0.129$$
The exact value is 0.1292; **without** the continuity correction we would get 0.109 — clearly worse.
:::

@chart sleepBin

::: note W07 | CLT for the Poisson distribution
A Poisson($\lambda$) variable is a sum of many independent Poissons with small parameters, so for large $\lambda$: $X\approx N(\lambda,\ \sqrt\lambda)$ (again with the continuity correction).
:::

@chart poisNorm

# The distribution of a proportion

Let $p$ = the share of the population with some property, $X_i = 1$ when the $i$-th sampled element has it. The **sample proportion**:
$$\hat p = \frac{S_n}{n} = \bar X,\qquad E(\hat p) = p,\qquad V(\hat p) = \frac{p(1-p)}{n}$$
By the CLT: $\dfrac{\hat p - p}{\sqrt{p(1-p)/n}}\approx N(0,1)$, and also (useful for confidence intervals) $\dfrac{\hat p-p}{\sqrt{\hat p(1-\hat p)/n}}\approx N(0,1)$. {lecture:W07}

# Estimators — a preview

::: def W07 | Estimator and unbiasedness
An **estimator** of a parameter $\theta$ is a statistic $\hat\theta = h(X_1,\dots,X_n)$ whose values are “reasonable” estimates of $\theta$. It is **unbiased** if $E(\hat\theta) = \theta$. Examples: $\bar X$ for $\mu$, $\hat p$ for $p$, $S^2$ (divisor $n-1$) for $\sigma^2$. More in topic 9.
:::

# In Excel

~~~excel CLT in practice
A1: =1-BINOM.DIST(33,100,0.39,TRUE)                     // exactly P(S > 33)
A2: =BINOM.DIST(33,100,0.39,TRUE)                       // exactly P(S <= 33)
A3: =NORM.DIST(33.5,100*0.39,SQRT(100*0.39*0.61),TRUE)  // CLT with continuity correction
A4: =NORM.DIST(33,100*0.39,SQRT(100*0.39*0.61),TRUE)    // CLT without correction
A5: =(1.96*SQRT(35/12)/0.1)^2                           // minimal n for the die (exercise 9)
~~~

~~~python Exact vs CLT
from scipy.stats import binom, norm
n, p = 100, 0.39
mu, sd = n * p, (n * p * (1 - p)) ** 0.5
print(binom.cdf(33, n, p))              # exact            0.1292
print(norm.cdf((33.5 - mu) / sd))       # with correction  0.1297
print(norm.cdf((33 - mu) / sd))         # no correction    0.1093
~~~

::: summary
- $E(\bar X) = \mu$, $V(\bar X) = \sigma^2/n$; LLN: $\bar X\to\mu$.
- CLT: $S_n\approx N(n\mu, \sigma\sqrt n)$, $\bar X\approx N(\mu,\sigma/\sqrt n)$ — for **any** distribution of the terms.
- Bin(n, p) ≈ $N(np, \sqrt{np(1-p)})$ when $np\ge5$, $n(1-p)\ge5$; **continuity correction** ±0.5.
- Poisson(λ) ≈ $N(\lambda,\sqrt\lambda)$ for large λ.
- $\hat p$: $E=p$, $V = p(1-p)/n$.
:::
`,

    cheatsheet: md`
## Sample mean
$E(\bar X)=\mu$ · $V(\bar X)=\sigma^2/n$ · $X\sim N\Rightarrow\bar X\sim N(\mu,\sigma/\sqrt n)$ exactly

## CLT (n ≥ 30, any distribution)
$$S_n\approx N(n\mu,\ \sigma\sqrt n)\qquad \bar X\approx N\Big(\mu,\ \frac{\sigma}{\sqrt n}\Big)\qquad z=\frac{S_n-n\mu}{\sigma\sqrt n}$$

## Bin(n, p) ≈ N(np, √(np(1−p)))
condition: $np\ge5$, $n(1-p)\ge5$
| event | with correction |
|---|---|
| $X\le k$ | $\Phi\big(\frac{k+0.5-np}{\sqrt{npq}}\big)$ |
| $X\ge k$ | $1-\Phi\big(\frac{k-0.5-np}{\sqrt{npq}}\big)$ |
| $a\le X\le b$ | $\Phi\big(\frac{b+0.5-np}{\sqrt{npq}}\big)-\Phi\big(\frac{a-0.5-np}{\sqrt{npq}}\big)$ |

## Poisson(λ) ≈ N(λ, √λ) · exponential(λ): μ = σ = 1/λ

## Finding n (typical)
Condition $P(\dots)\ge0.95$ → inequality with $z_{0.95}=1.645$ or $z_{0.975}=1.96$ → substitute $u=\sqrt n$ (quadratic) or try successive $n$. Round $n$ **up**.

## Proportion
$\hat p=S_n/n$: $E=p$, $V=\frac{p(1-p)}{n}$
`,

    exercises: [
      {
        id: 'e1', tag: 'C10', title: 'Dark mode in an app',
        text: md`
35% of an app’s users use dark mode. What is the probability that among 600 random users **more than 190 but at most 230** use it? Use the CLT with the continuity correction and compare with the result without it.
`,
        hint: md`$P(190<X\le230) = P(X\le230) - P(X\le190)$. $np = 210$, $\sqrt{np(1-p)}\approx11.68$.`,
        solution: md`
$X\sim$ Bin(600; 0.35), $np = 210$, $\sigma\approx11.68$.
With correction: $\Phi\left(\frac{230.5-210}{11.68}\right)-\Phi\left(\frac{190.5-210}{11.68}\right) = \Phi(1.75)-\Phi(-1.67)\approx0.9599-0.0475 = 0.912$.
Without: $\Phi(1.71)-\Phi(-1.71)\approx0.913$. Exact (Excel): 0.9129 — for large $n$ the correction matters little.
`,
        answer: md`≈ 0.913.`
      },
      {
        id: 'e2', tag: 'C10', title: 'Batteries replaced on the fly',
        text: md`
We have 64 batteries; each lasts an exponential time with mean 10 h. We use one at a time and replace a dead one immediately. Find the probability that after 600 hours
1. at least one battery is still in reserve;
2. some battery is still working.
`,
        hint: md`For the exponential: $\mu = \sigma = 10$. “A spare remains” ⇔ the first 63 batteries lasted more than 600 h: $S_{63}>600$.`,
        solution: md`
1. $S_{63}\approx N(630;\ 79.37)$: $P(S_{63}>600) = 1-\Phi(-0.378)\approx0.647$.
2. $S_{64}\approx N(640;\ 80)$: $P(S_{64}>600) = 1-\Phi(-0.5) = 0.6915$.
`,
        answer: md`1) ≈ 0.647; 2) ≈ 0.692.`
      },
      {
        id: 'e3', tag: 'C10', title: 'Three methods for one probability',
        text: md`
A component meets higher requirements with probability 0.25. We buy 40 components. Compute the probability that at least 14 meet them: a) exactly; b) with the Poisson approximation; c) with the CLT.
`,
        hint: md`$X\sim$ Bin(40; 0.25), $np = 10$, $\sqrt{np(1-p)} = \sqrt{7.5}$.`,
        solution: md`
a) $P(X\ge14)\approx0.103$.
b) Poisson(10): $1-F(13;10)\approx0.136$ — poor, because $p=0.25$ is not “small”.
c) CLT with correction: $1-\Phi\left(\frac{13.5-10}{2.739}\right) = 1-\Phi(1.28)\approx0.101$ — very close to the exact value.
`,
        answer: md`a) ≈ 0.103; b) ≈ 0.136; c) ≈ 0.101.`
      },
      {
        id: 'e4', tag: 'C10', title: 'How many servers in a cluster?',
        text: md`
Each of $n$ servers is (independently) active with probability 0.6. How large must $n$ be so that with probability at least 0.95 **at least 30** servers are active?
`,
        hint: md`Condition with correction: $\frac{29.5-0.6n}{\sqrt{0.24n}}\le-1.645$. Substitute $u=\sqrt n$.`,
        solution: md`
$0.6u^2-0.806u-29.5\ge0$ → $u\ge7.716$ → $n\ge59.5$.
Check: $n=59$: $P\approx0.942$ ✗; $n=60$: $P\approx0.957$ ✓. We need **60 servers**.
`,
        answer: md`$n = 60$.`
      },
      {
        id: 'e5', tag: 'C10', title: 'How many to produce to fill an order?',
        text: md`
5% of produced items are defective. How many items must be planned so that with probability at least 0.95 we get **at least 500 good ones**?
`,
        hint: md`The number of good items $\sim$ Bin(n; 0.95). Find the smallest $n$ with $P(X\ge500)\ge0.95$.`,
        solution: md`
Condition with correction: $\frac{499.5-0.95n}{\sqrt{0.0475n}}\le-1.645$.
Checking: $n=534$: $P\approx0.939$ ✗; $n=535$: $P\approx0.959$ ✓ (exactly 0.954). Plan **535 items**.
`,
        answer: md`535 items.`
      },
      {
        id: 'e6', tag: 'C10', title: 'Overbooking a flight',
        text: md`
A plane has 180 seats. Only 92% of ticket holders actually show up. The airline sells more tickets than seats.
a) What is the probability that with 190 tickets sold there are not enough seats?
b) What is the maximum number of tickets so that with probability at least 95% nobody is left without a seat?
`,
        hint: md`No seats ⇔ at least 181 people show up. b) check $P(X\le180)$ for successive $N$.`,
        solution: md`
a) $X\sim$ Bin(190; 0.92), $np = 174.8$, $\sigma\approx3.74$. $P(X\ge181)\approx1-\Phi(1.52)\approx0.064$ (exactly 0.056).
b) $N = 189$: $P(X\le180)\approx0.962$ ✓; $N=190$: ≈ 0.936 ✗. At most **189 tickets** (9 over capacity).
`,
        answer: md`a) ≈ 0.064; b) 189 tickets.`
      },
      {
        id: 'e7', tag: 'C10', title: 'CLT for a continuous variable',
        text: md`
$X_1,\dots,X_{100}$ are independent, each with density $f(x) = 2x$ on $[0;1]$. Estimate $P\left(64\le\sum X_i\le70\right)$.
`,
        hint: md`$E(X) = \frac23$, $E(X^2) = \frac12$, so $V(X) = \frac1{18}$.`,
        solution: md`
$E(S)\approx66.67$, $\sigma_S = \sqrt{100/18}\approx2.357$.
$P\approx\Phi(1.41)-\Phi(-1.13)\approx0.921-0.129 = 0.792$ (continuous variable — no continuity correction).
`,
        answer: md`≈ 0.792.`
      },
      {
        id: 'e8', tag: 'C09', title: 'Typos in a thesis',
        text: md`
A thesis has 250 pages; there is on average 1 typo per 10 pages, and the number of typos per page is Poisson. Write the formula for the probability that the whole thesis has between 20 and 30 typos, and approximate it with the CLT.
`,
        hint: md`The sum of 250 Poisson(0.1) is Poisson(25) ≈ $N(25; 5)$. Integer values → continuity correction.`,
        solution: md`
$X\sim$ Poisson(25): $P(20\le X\le30) = \sum_{k=20}^{30}e^{-25}\frac{25^k}{k!}$ (exactly ≈ 0.730).
CLT with correction: $\Phi(1.1)-\Phi(-1.1) = 2\cdot0.8643-1\approx0.729$.
`,
        answer: md`Formula: $\sum_{k=20}^{30}e^{-25}25^k/k!$; CLT ≈ 0.729.`
      },
      {
        id: 'e9', own: true, title: 'How many die rolls?',
        text: md`
How many times must a fair die be rolled so that with probability at least 0.95 the mean number of dots differs from 3.5 by at most 0.1?
`,
        hint: md`$V(X) = \frac{91}{6}-12.25 = \frac{35}{12}$. Condition: $1.96\cdot\frac{\sigma}{\sqrt n}\le0.1$.`,
        solution: md`
$\sigma\approx1.708$. $n\ge\left(\frac{1.96\cdot1.708}{0.1}\right)^2\approx1120.5$ → **1121 rolls**.
An illustration of the LLN: a precision of 0.1 “costs” over a thousand rolls, a precision of 0.05 — four times more.
`,
        answer: md`$n = 1121$.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'Две опоры статистики: **закон больших чисел** (среднее большой выборки близко к истинному среднему) и **центральная предельная теорема** (сумма многих независимых слагаемых приблизительно нормальна — даже если слагаемые не нормальны).',
    lecture: md`
# Случайная выборка

::: def W07 | Простая случайная выборка
**Простая случайная выборка** объёма $n$ — последовательность **независимых** величин $X_1,\dots,X_n$ с **одинаковым распределением** (распределением изучаемого признака). Конкретные числа $x_1,\dots,x_n$, которые мы наблюдаем, — **реализация** выборки.
:::

::: intuition
Случайная выборка — это «рецепт измерения» до того, как вы его сделали: каждое $X_i$ — случайный результат $i$-го измерения. После измерения у вас обычные числа.
:::

**Задача статистики:** узнать свойства распределения признака по выборке. Например: как оценить неизвестное среднее $\mu$? Почему $\bar x$ — хорошая оценка? Каково распределение выборочного среднего? {lecture:W07}

::: formula W07 | Среднее случайной выборки
$$\bar X = \frac1n\sum_{i=1}^n X_i,\qquad E(\bar X) = \mu,\qquad V(\bar X) = \frac{\sigma^2}{n}$$
Если к тому же $X\sim N(\mu,\sigma)$, то **точно** $\bar X\sim N\left(\mu,\ \frac{\sigma}{\sqrt n}\right)$.
:::

::: example W07 | Средний рост
Рост поляков $\sim N(\mu;\ 6{,}5\ \text{см})$, $\mu$ неизвестно. Каков шанс, что среднее по 100 людям отличается от $\mu$ больше чем на 1,5 см?
$\bar X\sim N(\mu;\ 0{,}65)$, значит
$$P(|\bar X-\mu|>1{,}5) = 2\left(1-\Phi\left(\tfrac{1{,}5}{0{,}65}\right)\right) = 2(1-\Phi(2{,}31))\approx0{,}021$$
Всего около 2% — среднее по 100 людям очень хорошо оценивает $\mu$.
:::

# Закон больших чисел

::: def W07 | Закон больших чисел (ЗБЧ)
Для простой случайной выборки из распределения со средним $\mu$ и любого малого $\varepsilon>0$:
$$P\big(\bar X\in[\mu-\varepsilon,\ \mu+\varepsilon]\big)\ \xrightarrow{\ n\to\infty\ }\ 1$$
:::

::: intuition
Бросаете монету: после 10 бросков может быть 70% орлов, после 10 000 — практически наверняка от 49% до 51%. Частота «успокаивается» около вероятности. Это и обосновывает частотное определение вероятности из темы 2.
:::

# Центральная предельная теорема

::: def W07 | Центральная предельная теорема (ЦПТ)
Если $X_1,\dots,X_n$ независимы и одинаково распределены со средним $\mu$ и дисперсией $\sigma^2$, то для $S_n = X_1+\dots+X_n$:
$$P\left(a\le\frac{S_n - n\mu}{\sigma\sqrt n}\le b\right)\ \xrightarrow{\ n\to\infty\ }\ \Phi(b)-\Phi(a)$$
На практике (обычно уже при $n\ge30$):
$$S_n\approx N\left(n\mu,\ \sigma\sqrt n\right),\qquad \bar X\approx N\left(\mu,\ \frac{\sigma}{\sqrt n}\right)$$
:::

::: intuition
У одного кубика распределение «плоское». Сумма двух — треугольник. Сумма десяти — уже красивый колокол. **Распределение отдельного слагаемого перестаёт иметь значение**: важны только $\mu$ и $\sigma$. Поэтому нормальное распределение появляется везде, где результат — сумма многих мелких независимых влияний.
:::

@widget clt-dice

::: steps | Задача на ЦПТ — схема
1. Определите одно слагаемое $X_i$: найдите $\mu = E(X_i)$ и $\sigma^2 = V(X_i)$.
2. Сумма: $E(S_n) = n\mu$, $\sigma_{S_n} = \sigma\sqrt n$ (или среднее: $\mu$, $\sigma/\sqrt n$).
3. Стандартизуйте границы: $z = \dfrac{x - n\mu}{\sigma\sqrt n}$.
4. Найдите $\Phi(z)$; для сумм целых значений используйте **поправку на непрерывность** (ниже).
:::

# ЦПТ для биномиального распределения (Муавр–Лаплас)

$S_n\sim\text{Bin}(n,p)$ — сумма $n$ нуль-единичных величин ($\mu = p$, $\sigma^2 = p(1-p)$), поэтому:

::: formula W07 | Теорема Муавра–Лапласа
$$P\left(a\le\frac{S_n-np}{\sqrt{np(1-p)}}\le b\right)\ \longrightarrow\ \Phi(b)-\Phi(a),\qquad S_n\approx N\big(np,\ \sqrt{np(1-p)}\big)$$
:::

::: formula W07 | Поправка на непрерывность
Биномиальное распределение дискретно (целые значения), а нормальное — непрерывно. Так как $P(X\le x) = P(X<x+1)$, лучше приближать
$$P(X\le x)\approx\Phi\left(\frac{x+\frac12-np}{\sqrt{np(1-p)}}\right)$$
Применяем при $np\ge5$ и $n(1-p)\ge5$; особенно важно при $n\le100$.
:::

::: tip own | Поправка на непрерывность — шпаргалка
| событие (целые значения) | заменить на |
|---|---|
| $X\le k$ | $X< k+0{,}5$ |
| $X<k$ | $X<k-0{,}5$ |
| $X\ge k$ | $X>k-0{,}5$ |
| $X>k$ | $X>k+0{,}5$ |
| $a\le X\le b$ | $a-0{,}5<X<b+0{,}5$ |
:::

::: example W07 | Проблемы со сном
39% взрослых имеют проблемы со сном. Каков шанс, что среди 100 случайных людей эта доля не превысит 33%? $S\sim$ Bin(100; 0,39), $np = 39$, $\sqrt{np(1-p)}\approx4{,}88$.
$$P(\hat p\le0{,}33) = P(S\le33)\approx\Phi\left(\frac{33{,}5-39}{4{,}88}\right) = \Phi(-1{,}13)\approx0{,}129$$
Точное значение 0,1292; **без** поправки получилось бы 0,109 — заметно хуже.
:::

@chart sleepBin

::: note W07 | ЦПТ для распределения Пуассона
Величина Пуассона($\lambda$) — сумма многих независимых пуассоновских с малыми параметрами, поэтому при большом $\lambda$: $X\approx N(\lambda,\ \sqrt\lambda)$ (тоже с поправкой на непрерывность).
:::

@chart poisNorm

# Распределение доли (частоты)

Пусть $p$ — доля элементов совокупности с данным свойством, $X_i = 1$, если $i$-й отобранный им обладает. **Выборочная доля**:
$$\hat p = \frac{S_n}{n} = \bar X,\qquad E(\hat p) = p,\qquad V(\hat p) = \frac{p(1-p)}{n}$$
По ЦПТ: $\dfrac{\hat p - p}{\sqrt{p(1-p)/n}}\approx N(0,1)$, а также (пригодится для доверительных интервалов) $\dfrac{\hat p-p}{\sqrt{\hat p(1-\hat p)/n}}\approx N(0,1)$. {lecture:W07}

# Оценка (estymator) — анонс

::: def W07 | Оценка и несмещённость
**Оценка** параметра $\theta$ — статистика $\hat\theta = h(X_1,\dots,X_n)$, значения которой — «разумные» приближения $\theta$. Оценка **несмещённая**, если $E(\hat\theta) = \theta$. Примеры: $\bar X$ для $\mu$, $\hat p$ для $p$, $S^2$ (делитель $n-1$) для $\sigma^2$. Подробнее — в теме 9.
:::

# В Excel

~~~excel ЦПТ на практике
A1: =1-BINOM.DIST(33,100,0.39,TRUE)                     // точно P(S > 33)
A2: =BINOM.DIST(33,100,0.39,TRUE)                       // точно P(S <= 33)
A3: =NORM.DIST(33.5,100*0.39,SQRT(100*0.39*0.61),TRUE)  // ЦПТ с поправкой
A4: =NORM.DIST(33,100*0.39,SQRT(100*0.39*0.61),TRUE)    // ЦПТ без поправки
A5: =(1.96*SQRT(35/12)/0.1)^2                           // минимальное n для кубика (задача 9)
~~~

~~~python Точно vs ЦПТ
from scipy.stats import binom, norm
n, p = 100, 0.39
mu, sd = n * p, (n * p * (1 - p)) ** 0.5
print(binom.cdf(33, n, p))              # точно             0.1292
print(norm.cdf((33.5 - mu) / sd))       # с поправкой       0.1297
print(norm.cdf((33 - mu) / sd))         # без поправки      0.1093
~~~

::: summary
- $E(\bar X) = \mu$, $V(\bar X) = \sigma^2/n$; ЗБЧ: $\bar X\to\mu$.
- ЦПТ: $S_n\approx N(n\mu, \sigma\sqrt n)$, $\bar X\approx N(\mu,\sigma/\sqrt n)$ — для **любого** распределения слагаемых.
- Bin(n, p) ≈ $N(np, \sqrt{np(1-p)})$ при $np\ge5$, $n(1-p)\ge5$; **поправка на непрерывность** ±0,5.
- Пуассон(λ) ≈ $N(\lambda,\sqrt\lambda)$ при большом λ.
- $\hat p$: $E=p$, $V = p(1-p)/n$.
:::
`,

    cheatsheet: md`
## Выборочное среднее
$E(\bar X)=\mu$ · $V(\bar X)=\sigma^2/n$ · $X\sim N\Rightarrow\bar X\sim N(\mu,\sigma/\sqrt n)$ точно

## ЦПТ (n ≥ 30, любое распределение)
$$S_n\approx N(n\mu,\ \sigma\sqrt n)\qquad \bar X\approx N\Big(\mu,\ \frac{\sigma}{\sqrt n}\Big)\qquad z=\frac{S_n-n\mu}{\sigma\sqrt n}$$

## Bin(n, p) ≈ N(np, √(np(1−p)))
условие: $np\ge5$, $n(1-p)\ge5$
| событие | с поправкой |
|---|---|
| $X\le k$ | $\Phi\big(\frac{k+0{,}5-np}{\sqrt{npq}}\big)$ |
| $X\ge k$ | $1-\Phi\big(\frac{k-0{,}5-np}{\sqrt{npq}}\big)$ |
| $a\le X\le b$ | $\Phi\big(\frac{b+0{,}5-np}{\sqrt{npq}}\big)-\Phi\big(\frac{a-0{,}5-np}{\sqrt{npq}}\big)$ |

## Пуассон(λ) ≈ N(λ, √λ) · показательное(λ): μ = σ = 1/λ

## Поиск n (типично)
Условие $P(\dots)\ge0{,}95$ → неравенство с $z_{0{,}95}=1{,}645$ или $z_{0{,}975}=1{,}96$ → замена $u=\sqrt n$ (квадратное уравнение) или перебор $n$. Округляйте $n$ **вверх**.

## Доля
$\hat p=S_n/n$: $E=p$, $V=\frac{p(1-p)}{n}$
`,

    exercises: [
      {
        id: 'e1', tag: 'C10', title: 'Тёмная тема в приложении',
        text: md`
35% пользователей приложения используют тёмную тему. Какова вероятность, что среди 600 случайных пользователей ею пользуются **больше 190, но не больше 230** человек? Используйте ЦПТ с поправкой на непрерывность и сравните с результатом без поправки.
`,
        hint: md`$P(190<X\le230) = P(X\le230) - P(X\le190)$. $np = 210$, $\sqrt{np(1-p)}\approx11{,}68$.`,
        solution: md`
$X\sim$ Bin(600; 0,35), $np = 210$, $\sigma\approx11{,}68$.
С поправкой: $\Phi\left(\frac{230{,}5-210}{11{,}68}\right)-\Phi\left(\frac{190{,}5-210}{11{,}68}\right) = \Phi(1{,}75)-\Phi(-1{,}67)\approx0{,}9599-0{,}0475 = 0{,}912$.
Без поправки: $\Phi(1{,}71)-\Phi(-1{,}71)\approx0{,}913$. Точно (Excel): 0,9129 — при большом $n$ поправка почти не важна.
`,
        answer: md`≈ 0,913.`
      },
      {
        id: 'e2', tag: 'C10', title: 'Батарейки с заменой на ходу',
        text: md`
Есть 64 батарейки; каждая работает показательно распределённое время со средним 10 ч. Используем по одной, севшую сразу меняем. Найдите вероятность того, что через 600 часов
1. в запасе останется хотя бы одна батарейка;
2. какая-то батарейка ещё работает.
`,
        hint: md`Для показательного: $\mu = \sigma = 10$. «Остался запас» ⇔ первых 63 батареек хватило больше чем на 600 ч: $S_{63}>600$.`,
        solution: md`
1. $S_{63}\approx N(630;\ 79{,}37)$: $P(S_{63}>600) = 1-\Phi(-0{,}378)\approx0{,}647$.
2. $S_{64}\approx N(640;\ 80)$: $P(S_{64}>600) = 1-\Phi(-0{,}5) = 0{,}6915$.
`,
        answer: md`1) ≈ 0,647; 2) ≈ 0,692.`
      },
      {
        id: 'e3', tag: 'C10', title: 'Три метода для одной вероятности',
        text: md`
Комплектующая удовлетворяет повышенным требованиям с вероятностью 0,25. Покупаем 40 штук. Найдите вероятность, что требованиям удовлетворят хотя бы 14: а) точно; б) приближением Пуассона; в) по ЦПТ.
`,
        hint: md`$X\sim$ Bin(40; 0,25), $np = 10$, $\sqrt{np(1-p)} = \sqrt{7{,}5}$.`,
        solution: md`
а) $P(X\ge14)\approx0{,}103$.
б) Пуассон(10): $1-F(13;10)\approx0{,}136$ — плохо, потому что $p=0{,}25$ не «малое».
в) ЦПТ с поправкой: $1-\Phi\left(\frac{13{,}5-10}{2{,}739}\right) = 1-\Phi(1{,}28)\approx0{,}101$ — очень близко к точному.
`,
        answer: md`а) ≈ 0,103; б) ≈ 0,136; в) ≈ 0,101.`
      },
      {
        id: 'e4', tag: 'C10', title: 'Сколько серверов в кластере?',
        text: md`
Каждый из $n$ серверов (независимо) активен с вероятностью 0,6. Каким должно быть $n$, чтобы с вероятностью не меньше 0,95 активными были **не меньше 30** серверов?
`,
        hint: md`Условие с поправкой: $\frac{29{,}5-0{,}6n}{\sqrt{0{,}24n}}\le-1{,}645$. Замена $u=\sqrt n$.`,
        solution: md`
$0{,}6u^2-0{,}806u-29{,}5\ge0$ → $u\ge7{,}716$ → $n\ge59{,}5$.
Проверка: $n=59$: $P\approx0{,}942$ ✗; $n=60$: $P\approx0{,}957$ ✓. Нужно **60 серверов**.
`,
        answer: md`$n = 60$.`
      },
      {
        id: 'e5', tag: 'C10', title: 'Сколько произвести, чтобы хватило на заказ?',
        text: md`
5% произведённых изделий — брак. Сколько изделий нужно запланировать, чтобы с вероятностью не меньше 0,95 получить **не меньше 500 годных**?
`,
        hint: md`Число годных $\sim$ Bin(n; 0,95). Ищем наименьшее $n$, при котором $P(X\ge500)\ge0{,}95$.`,
        solution: md`
Условие с поправкой: $\frac{499{,}5-0{,}95n}{\sqrt{0{,}0475n}}\le-1{,}645$.
Проверка: $n=534$: $P\approx0{,}939$ ✗; $n=535$: $P\approx0{,}959$ ✓ (точно 0,954). Нужно **535 изделий**.
`,
        answer: md`535 изделий.`
      },
      {
        id: 'e6', tag: 'C10', title: 'Овербукинг в самолёте',
        text: md`
В самолёте 180 мест. Приходят только 92% пассажиров с билетами. Авиакомпания продаёт билетов больше, чем мест.
а) Какова вероятность, что при 190 проданных билетах мест не хватит?
б) Сколько билетов можно продать максимум, чтобы с вероятностью не меньше 95% всем хватило мест?
`,
        hint: md`Мест не хватит ⇔ придут не меньше 181 человека. б) проверяйте $P(X\le180)$ для последовательных $N$.`,
        solution: md`
а) $X\sim$ Bin(190; 0,92), $np = 174{,}8$, $\sigma\approx3{,}74$. $P(X\ge181)\approx1-\Phi(1{,}52)\approx0{,}064$ (точно 0,056).
б) $N = 189$: $P(X\le180)\approx0{,}962$ ✓; $N=190$: ≈ 0,936 ✗. Максимум **189 билетов** (на 9 больше мест).
`,
        answer: md`а) ≈ 0,064; б) 189 билетов.`
      },
      {
        id: 'e7', tag: 'C10', title: 'ЦПТ для непрерывной величины',
        text: md`
$X_1,\dots,X_{100}$ независимы, у каждой плотность $f(x) = 2x$ на $[0;1]$. Оцените $P\left(64\le\sum X_i\le70\right)$.
`,
        hint: md`$E(X) = \frac23$, $E(X^2) = \frac12$, значит $V(X) = \frac1{18}$.`,
        solution: md`
$E(S)\approx66{,}67$, $\sigma_S = \sqrt{100/18}\approx2{,}357$.
$P\approx\Phi(1{,}41)-\Phi(-1{,}13)\approx0{,}921-0{,}129 = 0{,}792$ (непрерывная величина — без поправки).
`,
        answer: md`≈ 0,792.`
      },
      {
        id: 'e8', tag: 'C09', title: 'Опечатки в дипломной работе',
        text: md`
В работе 250 страниц; в среднем 1 опечатка на 10 страниц, число опечаток на странице распределено по Пуассону. Запишите формулу вероятности того, что во всей работе от 20 до 30 опечаток, и приблизьте её по ЦПТ.
`,
        hint: md`Сумма 250 Пуассонов(0,1) — Пуассон(25) ≈ $N(25; 5)$. Целые значения → поправка на непрерывность.`,
        solution: md`
$X\sim$ Пуассон(25): $P(20\le X\le30) = \sum_{k=20}^{30}e^{-25}\frac{25^k}{k!}$ (точно ≈ 0,730).
ЦПТ с поправкой: $\Phi(1{,}1)-\Phi(-1{,}1) = 2\cdot0{,}8643-1\approx0{,}729$.
`,
        answer: md`Формула: $\sum_{k=20}^{30}e^{-25}25^k/k!$; ЦПТ ≈ 0,729.`
      },
      {
        id: 'e9', own: true, title: 'Сколько бросков кубика?',
        text: md`
Сколько раз нужно бросить честный кубик, чтобы с вероятностью не меньше 0,95 среднее число очков отличалось от 3,5 не больше чем на 0,1?
`,
        hint: md`$V(X) = \frac{91}{6}-12{,}25 = \frac{35}{12}$. Условие: $1{,}96\cdot\frac{\sigma}{\sqrt n}\le0{,}1$.`,
        solution: md`
$\sigma\approx1{,}708$. $n\ge\left(\frac{1{,}96\cdot1{,}708}{0{,}1}\right)^2\approx1120{,}5$ → **1121 бросок**.
Иллюстрация ЗБЧ: точность 0,1 «стоит» больше тысячи бросков, а точность 0,05 — вчетверо больше.
`,
        answer: md`$n = 1121$.`
      }
    ]
  };

  SAD.registerTopic('t08', { charts: charts, pl: pl, en: en, ru: ru });
})();
