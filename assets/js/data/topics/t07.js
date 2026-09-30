/* Topic 7 — Many random variables and sums (lecture W06, classes C09) */
(function () {
  var md = SAD.md;

  var charts = {
    meanShrink: { type: 'pdf', range: [0, 40], xLabel: 'x', yLabel: 'f(x)',
      curves: [{ dist: { name: 'normal', mu: 20, sigma: 4 }, label: 'n = 1' }, { dist: { name: 'normal', mu: 20, sigma: 2 }, label: 'n = 4' }, { dist: { name: 'normal', mu: 20, sigma: 1 }, label: 'n = 16' }],
      caption: { pl: 'Rozkład średniej z n pomiarów N(20, 4): im większe n, tym węższy (σ/√n)', en: 'Distribution of the mean of n measurements of N(20, 4): the larger n, the narrower (σ/√n)', ru: 'Распределение среднего из n измерений N(20, 4): чем больше n, тем уже (σ/√n)' } },
    elevator: { type: 'pdf', dist: { name: 'normal', mu: 600, sigma: 33.94 }, range: [480, 720], xLabel: 'kg',
      shade: [{ from: 650, to: 720, cls: '2', label: '≈ 0,070', labelX: 675, labelY: 0.0015 }], markers: [{ x: 650, label: '650 kg' }],
      caption: { pl: 'Łączna masa 8 osób ~ N(600; 33,9): szansa przekroczenia 650 kg', en: 'Total mass of 8 people ~ N(600; 33.9): chance of exceeding 650 kg', ru: 'Суммарная масса 8 человек ~ N(600; 33,9): шанс превысить 650 кг' } }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Co się dzieje, gdy **dodajemy** zmienne losowe? Średnie się dodają zawsze, wariancje — gdy zmienne są niezależne. Poznasz też „twierdzenia o dodawaniu”: suma Poissonów to Poisson, suma normalnych to normalny.',
    lecture: md`
# Zmienna losowa n-wymiarowa

Wszystko z tematu 6 przenosi się na $n$ zmiennych $X_1,\dots,X_n$ na wspólnej przestrzeni: dystrybuanta łączna $F(x_1,\dots,x_n) = P(X_1\le x_1,\dots,X_n\le x_n)$, funkcja prawdopodobieństwa lub gęstość łączna, rozkłady brzegowe (sumujemy/całkujemy po pozostałych zmiennych). {lecture:W06}

::: def W06 | Niezależność n zmiennych
$X_1,\dots,X_n$ są niezależne, gdy
$$F(x_1,\dots,x_n) = F_{X_1}(x_1)\cdots F_{X_n}(x_n)$$
(równoważnie: iloczyn funkcji prawdopodobieństwa / gęstości). Oznacza to, że **każdy** podzbiór zmiennych (każda para, trójka…) ma rozkład łączny równy iloczynowi brzegowych.
:::

# Średnia i wariancja kombinacji liniowej

::: formula W06 | Kombinacja liniowa n zmiennych
$$E\Big(\sum_{i=1}^n a_iX_i\Big) = \sum_{i=1}^n a_i E(X_i)\qquad\text{(zawsze!)}$$
$$V\Big(\sum_{i=1}^n a_iX_i\Big) = \sum_{i=1}^n a_i^2V(X_i) + 2\sum_{i<j}a_ia_j\,\mathrm{Cov}(X_i,X_j)$$
Dla zmiennych **parami niezależnych** (wtedy wszystkie kowariancje = 0):
$$V\Big(\sum a_iX_i\Big) = \sum a_i^2V(X_i)$$
:::

::: warn own | Różnica też ma wariancję „z plusem”
$V(X - Y) = V(X) + (-1)^2V(Y) = V(X)+V(Y)$ dla niezależnych. Odejmowanie zmiennych **nie zmniejsza** niepewności — obie „chwieją się” niezależnie, więc różnica chwieje się bardziej.
:::

# Średnia z próby

::: formula W06 | Średnia n niezależnych zmiennych o tym samym rozkładzie
Jeśli $E(X_i) = \mu$ i $V(X_i) = \sigma^2$, to dla $\bar X = \frac1n\sum X_i$:
$$E(\bar X) = \mu,\qquad V(\bar X) = \frac{\sigma^2}{n},\qquad \sigma_{\bar X} = \frac{\sigma}{\sqrt n}$$
:::

::: intuition
Pojedynczy pomiar może się mocno pomylić. Średnia z 16 pomiarów „myli się” średnio **4 razy mniej** ($\sqrt{16} = 4$), bo błędy w różne strony częściowo się znoszą. To fundament całej statystyki: im więcej danych, tym dokładniejsza średnia.
:::

@chart meanShrink

# Twierdzenia o dodawaniu

Bardzo ważne jest, żeby umieć wyznaczyć **rozkład sumy** niezależnych zmiennych. Dla poznanych rozkładów mamy gotowe wyniki (bez dowodu): {lecture:W06}

| Składniki (niezależne) | Suma $S = X_1+\dots+X_n$ |
|---|---|
| $X_i\sim$ Bernoulli$(p)$ | $S\sim\text{Bin}(n, p)$ |
| $X_i\sim\text{Bin}(n_i, p)$ — **to samo $p$** | $S\sim\text{Bin}(\sum n_i, p)$ |
| $X_i\sim\text{Poisson}(\lambda_i)$ | $S\sim\text{Poisson}(\sum\lambda_i)$ |
| $X_i\sim N(\mu_i,\sigma_i)$ | $S\sim N\left(\sum\mu_i,\ \sqrt{\sum\sigma_i^2}\right)$ |

::: warn
W sumie rozkładów normalnych dodajemy **wariancje**, a nie odchylenia: $\sigma_S = \sqrt{\sigma_1^2+\sigma_2^2+\dots}$, a **nie** $\sigma_1+\sigma_2+\dots$
:::

::: formula own | Przydatne szczególne przypadki
- $n$ niezależnych $N(\mu,\sigma)$: suma $\sim N(n\mu,\ \sigma\sqrt n)$, średnia $\sim N(\mu,\ \sigma/\sqrt n)$.
- Różnica niezależnych normalnych: $X - Y\sim N(\mu_X-\mu_Y,\ \sqrt{\sigma_X^2+\sigma_Y^2})$.
- Każdą zmienną Bin$(n,p)$ można zapisać jako sumę $n$ niezależnych zmiennych zero-jedynkowych — stąd $E = np$, $V = np(1-p)$.
:::

::: example W06 | Wadliwe telewizory i zestawy stereo
Liczba wadliwych telewizorów dziennie ~ Poisson(2), zestawów stereo ~ Poisson(3), wszystko niezależne. Liczba wadliwych produktów w ciągu 2 dni:
$$S = X_1+X_2+X_3+X_4\sim\text{Poisson}(2+2+3+3 = 10),\qquad P(S\le5) = F(5;10)\approx0{,}0671$$
:::

::: example own | Winda
W windzie jedzie 8 osób o masach niezależnych $N(75, 12)$ kg. Masa łączna $\sim N(8\cdot75,\ 12\sqrt8) = N(600;\ 33{,}9)$.
$$P(\text{masa}>650) = 1-\Phi\left(\frac{650-600}{33{,}9}\right) = 1-\Phi(1{,}47)\approx0{,}071$$
:::

@chart elevator

# W Excelu

~~~excel Sumy zmiennych
A1: =POISSON.DIST(5,10,TRUE)                      // P(S <= 5), S ~ Poisson(2+2+3+3)
A2: =12*SQRT(8)                                   // σ sumy 8 osób
A3: =1-NORM.DIST(650,8*75,12*SQRT(8),TRUE)        // P(suma > 650)
A4: =NORM.DIST(19,20,4/SQRT(25),TRUE)             // P(średnia z 25 < 19)
~~~

~~~python Symulacja: czy wariancja sumy się zgadza?
import numpy as np
rng = np.random.default_rng(1)
X = rng.normal(75, 12, size=(100_000, 8))      # 100 tys. „wind” po 8 osób
S = X.sum(axis=1)
print(S.mean(), S.std())                        # ≈ 600 i ≈ 33.9 = 12*sqrt(8)
print((S > 650).mean())                         # ≈ 0.07
~~~

::: summary
- $E(\sum a_iX_i) = \sum a_iE(X_i)$ zawsze; $V(\sum a_iX_i) = \sum a_i^2V(X_i)$ dla niezależnych (+ kowariancje, jeśli zależne).
- $E(\bar X) = \mu$, $V(\bar X) = \sigma^2/n$.
- Bernoulli → Bin; Bin + Bin (to samo $p$) → Bin; Poisson + Poisson → Poisson ($\lambda$ się dodają); normalny + normalny → normalny (wariancje się dodają).
:::
`,

    cheatsheet: md`
## Kombinacje liniowe
$$E\Big(\sum a_iX_i\Big)=\sum a_iEX_i \qquad V\Big(\sum a_iX_i\Big)=\sum a_i^2VX_i+2\sum_{i<j}a_ia_j\mathrm{Cov}_{ij}$$
- niezależne → kowariancje = 0
- $V(X-Y)=VX+VY$ (niezależne) — **plus**!
- $\bar X$: $E=\mu$, $V=\sigma^2/n$, $\sigma_{\bar X}=\sigma/\sqrt n$

## Twierdzenia o dodawaniu (niezależne)
| składniki | suma |
|---|---|
| Bernoulli(p) × n | Bin(n, p) |
| Bin(nᵢ, p) | Bin(Σnᵢ, p) |
| Poisson(λᵢ) | Poisson(Σλᵢ) |
| N(μᵢ, σᵢ) | N(Σμᵢ, √Σσᵢ²) |

- $n$ razy $N(\mu,\sigma)$: suma $N(n\mu, \sigma\sqrt n)$, średnia $N(\mu,\sigma/\sqrt n)$
- $X-Y\sim N(\mu_X-\mu_Y, \sqrt{\sigma_X^2+\sigma_Y^2})$
- λ na dzień → na $k$ dni: $k\lambda$
`,

    exercises: [
      {
        id: 'e1', tag: 'C09', title: 'Błędy na serwerze (suma Poissonów)',
        text: md`
Na serwerze pojawiają się błędy dwóch typów: typu A średnio 1,5 na godzinę, typu B średnio 2,5 na godzinę; liczby błędów mają rozkłady Poissona i są niezależne. Wyznacz prawdopodobieństwo, że w ciągu 3 godzin łącznie pojawi się **nie więcej niż 10** błędów.
`,
        hint: md`Dodaj parametry: po 3 godziny dla każdego typu.`,
        solution: md`
$S\sim\text{Poisson}(3\cdot1{,}5 + 3\cdot2{,}5) = \text{Poisson}(12)$.
$$P(S\le10) = \sum_{k=0}^{10}e^{-12}\frac{12^k}{k!}\approx0{,}347$$
Excel: ‹=POISSON.DIST(10,12,TRUE)›.
`,
        answer: md`$S\sim$ Poisson(12); $P(S\le10)\approx0{,}347$.`
      },
      {
        id: 'e2', tag: 'C09', title: 'Puszki farby w kartonie (suma normalnych)',
        text: md`
Objętość farby w puszce ma rozkład normalny $N(5\ \text{l};\ 0{,}1\ \text{l})$. W kartonie jest 16 niezależnych puszek. Jaki procent kartonów (nominalnie 80 l) zawiera mniej niż 79,5 l farby?
`,
        hint: md`Suma 16 niezależnych $N(5; 0{,}1)$ ma odchylenie $0{,}1\sqrt{16}$.`,
        solution: md`
$S\sim N(80;\ 0{,}1\cdot4 = 0{,}4)$. $P(S<79{,}5) = \Phi\left(\frac{79{,}5-80}{0{,}4}\right) = \Phi(-1{,}25) = 0{,}1056$ → ok. **10,6%** kartonów.
`,
        answer: md`≈ 10,6%.`
      },
      {
        id: 'e3', own: true, title: 'Dwie linie produkcyjne (suma dwumianowych)',
        text: md`
Z linii A sprawdzono 20 elementów, z linii B — 30; na obu liniach element jest wadliwy z prawdopodobieństwem 0,1 (niezależnie). Jaki jest rozkład łącznej liczby wadliwych elementów? Oblicz jej wartość oczekiwaną, wariancję oraz $P(S\le3)$.
`,
        hint: md`To samo $p$ → sumujemy liczby prób.`,
        solution: md`
$S\sim\text{Bin}(20+30,\ 0{,}1) = \text{Bin}(50;\ 0{,}1)$; $E(S) = 5$, $V(S) = 50\cdot0{,}1\cdot0{,}9 = 4{,}5$.
$P(S\le3) = \sum_{k=0}^{3}\binom{50}{k}0{,}1^k0{,}9^{50-k}\approx0{,}250$.
`,
        answer: md`Bin(50; 0,1); $E=5$; $V=4{,}5$; $P(S\le3)\approx0{,}250$.`
      },
      {
        id: 'e4', own: true, title: 'Winda',
        text: md`
Masa pasażera ma rozkład $N(75\ \text{kg};\ 12\ \text{kg})$, masy są niezależne. a) Jakie jest prawdopodobieństwo, że 8 osób przekroczy udźwig 650 kg? b) Ile osób najwyżej może wejść do windy, żeby prawdopodobieństwo przekroczenia 650 kg było nie większe niż 1%?
`,
        hint: md`b) Warunek: $75n + z_{0{,}99}\cdot12\sqrt n\le650$, $z_{0{,}99} = 2{,}326$. Sprawdź kolejne $n$.`,
        solution: md`
**a)** $S\sim N(600;\ 12\sqrt8\approx33{,}94)$; $P(S>650) = 1-\Phi(1{,}47)\approx0{,}070$.

**b)**
- $n = 8$: $600 + 2{,}326\cdot33{,}94\approx679 > 650$ ✗ (prawdopodobieństwo 7%)
- $n = 7$: $525 + 2{,}326\cdot31{,}75\approx599 \le 650$ ✓ (prawdopodobieństwo ≈ 0,00004)

Maksymalnie **7 osób**.
`,
        answer: md`a) ≈ 0,070; b) 7 osób.`
      },
      {
        id: 'e5', own: true, title: 'Który pomiar większy? (różnica normalnych)',
        text: md`
Wynik pomiaru przyrządem A ma rozkład $N(10{,}0;\ 0{,}3)$, przyrządem B — $N(9{,}8;\ 0{,}4)$, niezależnie. Jakie jest prawdopodobieństwo, że A pokaże więcej niż B?
`,
        hint: md`$P(A>B) = P(A-B>0)$; $A-B$ jest normalna.`,
        solution: md`
$A-B\sim N(0{,}2;\ \sqrt{0{,}09+0{,}16} = 0{,}5)$.
$P(A-B>0) = 1-\Phi\left(\frac{0-0{,}2}{0{,}5}\right) = \Phi(0{,}4) = 0{,}6554$.
`,
        answer: md`≈ 0,655.`
      },
      {
        id: 'e6', own: true, title: 'Średnia z próby jest pewniejsza',
        text: md`
Czas pracy baterii ma rozkład $N(20\ \text{h};\ 4\ \text{h})$. Oblicz prawdopodobieństwo, że a) pojedyncza bateria działa krócej niż 19 h; b) **średni** czas 25 losowych baterii jest krótszy niż 19 h.
`,
        hint: md`$\bar X\sim N(20;\ 4/\sqrt{25})$.`,
        solution: md`
a) $\Phi\left(\frac{19-20}{4}\right) = \Phi(-0{,}25)\approx0{,}401$.
b) $\bar X\sim N(20;\ 0{,}8)$: $\Phi\left(\frac{19-20}{0{,}8}\right) = \Phi(-1{,}25)\approx0{,}106$.
Średnia z 25 baterii rzadziej „odjeżdża” od 20 h niż pojedyncza bateria.
`,
        answer: md`a) ≈ 0,401; b) ≈ 0,106.`
      },
      {
        id: 'e7', own: true, title: 'Kombinacja trzech zmiennych z kowariancją',
        text: md`
$E(X_1) = 10$, $E(X_2) = 20$, $E(X_3) = 30$; $V(X_1) = 4$, $V(X_2) = 9$, $V(X_3) = 16$; $\mathrm{Cov}(X_1, X_2) = 2$, pozostałe kowariancje równe 0. Oblicz $E(Y)$ i $\sigma_Y$ dla $Y = X_1 + 2X_2 - X_3$.
`,
        hint: md`Współczynniki: $a_1 = 1$, $a_2 = 2$, $a_3 = -1$; człon kowariancyjny: $2a_1a_2\mathrm{Cov}(X_1,X_2)$.`,
        solution: md`
$E(Y) = 10 + 40 - 30 = 20$.
$V(Y) = 1^2\cdot4 + 2^2\cdot9 + (-1)^2\cdot16 + 2\cdot1\cdot2\cdot2 = 4+36+16+8 = 64$, $\sigma_Y = 8$.
`,
        answer: md`$E(Y)=20$, $\sigma_Y=8$.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'What happens when we **add** random variables? Means always add up, variances — when the variables are independent. You will also meet the “addition theorems”: a sum of Poissons is Poisson, a sum of normals is normal.',
    lecture: md`
# n-dimensional random variables

Everything from topic 6 carries over to $n$ variables $X_1,\dots,X_n$ on a common space: the joint CDF $F(x_1,\dots,x_n) = P(X_1\le x_1,\dots,X_n\le x_n)$, the joint pmf or density, marginal distributions (sum/integrate over the other variables). {lecture:W06}

::: def W06 | Independence of n variables
$X_1,\dots,X_n$ are independent when
$$F(x_1,\dots,x_n) = F_{X_1}(x_1)\cdots F_{X_n}(x_n)$$
(equivalently: the pmf / density factorises). This means that **every** subset of the variables (every pair, triple…) has a joint distribution equal to the product of the marginals.
:::

# Mean and variance of a linear combination

::: formula W06 | Linear combination of n variables
$$E\Big(\sum_{i=1}^n a_iX_i\Big) = \sum_{i=1}^n a_i E(X_i)\qquad\text{(always!)}$$
$$V\Big(\sum_{i=1}^n a_iX_i\Big) = \sum_{i=1}^n a_i^2V(X_i) + 2\sum_{i<j}a_ia_j\,\mathrm{Cov}(X_i,X_j)$$
For **pairwise independent** variables (all covariances = 0):
$$V\Big(\sum a_iX_i\Big) = \sum a_i^2V(X_i)$$
:::

::: warn own | A difference also has a “plus” variance
$V(X - Y) = V(X) + (-1)^2V(Y) = V(X)+V(Y)$ for independent variables. Subtracting **does not reduce** uncertainty — both “wobble” independently, so the difference wobbles more.
:::

# The sample mean

::: formula W06 | Mean of n independent identically distributed variables
If $E(X_i) = \mu$ and $V(X_i) = \sigma^2$, then for $\bar X = \frac1n\sum X_i$:
$$E(\bar X) = \mu,\qquad V(\bar X) = \frac{\sigma^2}{n},\qquad \sigma_{\bar X} = \frac{\sigma}{\sqrt n}$$
:::

::: intuition
A single measurement can be far off. The mean of 16 measurements is off **4 times less** on average ($\sqrt{16} = 4$), because errors in different directions partly cancel. This is the foundation of all statistics: the more data, the more precise the mean.
:::

@chart meanShrink

# Addition theorems

It is very important to know the **distribution of a sum** of independent variables. For the distributions we know there are ready results (without proof): {lecture:W06}

| Terms (independent) | Sum $S = X_1+\dots+X_n$ |
|---|---|
| $X_i\sim$ Bernoulli$(p)$ | $S\sim\text{Bin}(n, p)$ |
| $X_i\sim\text{Bin}(n_i, p)$ — **same $p$** | $S\sim\text{Bin}(\sum n_i, p)$ |
| $X_i\sim\text{Poisson}(\lambda_i)$ | $S\sim\text{Poisson}(\sum\lambda_i)$ |
| $X_i\sim N(\mu_i,\sigma_i)$ | $S\sim N\left(\sum\mu_i,\ \sqrt{\sum\sigma_i^2}\right)$ |

::: warn
For a sum of normals we add **variances**, not standard deviations: $\sigma_S = \sqrt{\sigma_1^2+\sigma_2^2+\dots}$, **not** $\sigma_1+\sigma_2+\dots$
:::

::: formula own | Useful special cases
- $n$ independent $N(\mu,\sigma)$: sum $\sim N(n\mu,\ \sigma\sqrt n)$, mean $\sim N(\mu,\ \sigma/\sqrt n)$.
- Difference of independent normals: $X - Y\sim N(\mu_X-\mu_Y,\ \sqrt{\sigma_X^2+\sigma_Y^2})$.
- Every Bin$(n,p)$ variable is a sum of $n$ independent zero-one variables — hence $E = np$, $V = np(1-p)$.
:::

::: example W06 | Faulty TV sets and stereos
Faulty TV sets per day ~ Poisson(2), faulty stereos ~ Poisson(3), all independent. The number of faulty products over 2 days:
$$S = X_1+X_2+X_3+X_4\sim\text{Poisson}(2+2+3+3 = 10),\qquad P(S\le5) = F(5;10)\approx0.0671$$
:::

::: example own | A lift
8 people ride a lift; their masses are independent $N(75, 12)$ kg. Total mass $\sim N(8\cdot75,\ 12\sqrt8) = N(600;\ 33.9)$.
$$P(\text{mass}>650) = 1-\Phi\left(\frac{650-600}{33.9}\right) = 1-\Phi(1.47)\approx0.071$$
:::

@chart elevator

# In Excel

~~~excel Sums of variables
A1: =POISSON.DIST(5,10,TRUE)                      // P(S <= 5), S ~ Poisson(2+2+3+3)
A2: =12*SQRT(8)                                   // σ of the sum of 8 people
A3: =1-NORM.DIST(650,8*75,12*SQRT(8),TRUE)        // P(sum > 650)
A4: =NORM.DIST(19,20,4/SQRT(25),TRUE)             // P(mean of 25 < 19)
~~~

~~~python Simulation: does the variance of a sum match?
import numpy as np
rng = np.random.default_rng(1)
X = rng.normal(75, 12, size=(100_000, 8))      # 100k “lifts” of 8 people
S = X.sum(axis=1)
print(S.mean(), S.std())                        # ≈ 600 and ≈ 33.9 = 12*sqrt(8)
print((S > 650).mean())                         # ≈ 0.07
~~~

::: summary
- $E(\sum a_iX_i) = \sum a_iE(X_i)$ always; $V(\sum a_iX_i) = \sum a_i^2V(X_i)$ for independent ones (+ covariances if dependent).
- $E(\bar X) = \mu$, $V(\bar X) = \sigma^2/n$.
- Bernoulli → Bin; Bin + Bin (same $p$) → Bin; Poisson + Poisson → Poisson ($\lambda$s add); normal + normal → normal (variances add).
:::
`,

    cheatsheet: md`
## Linear combinations
$$E\Big(\sum a_iX_i\Big)=\sum a_iEX_i \qquad V\Big(\sum a_iX_i\Big)=\sum a_i^2VX_i+2\sum_{i<j}a_ia_j\mathrm{Cov}_{ij}$$
- independent → covariances = 0
- $V(X-Y)=VX+VY$ (independent) — **plus**!
- $\bar X$: $E=\mu$, $V=\sigma^2/n$, $\sigma_{\bar X}=\sigma/\sqrt n$

## Addition theorems (independent)
| terms | sum |
|---|---|
| Bernoulli(p) × n | Bin(n, p) |
| Bin(nᵢ, p) | Bin(Σnᵢ, p) |
| Poisson(λᵢ) | Poisson(Σλᵢ) |
| N(μᵢ, σᵢ) | N(Σμᵢ, √Σσᵢ²) |

- $n$ times $N(\mu,\sigma)$: sum $N(n\mu, \sigma\sqrt n)$, mean $N(\mu,\sigma/\sqrt n)$
- $X-Y\sim N(\mu_X-\mu_Y, \sqrt{\sigma_X^2+\sigma_Y^2})$
- λ per day → per $k$ days: $k\lambda$
`,

    exercises: [
      {
        id: 'e1', tag: 'C09', title: 'Server errors (sum of Poissons)',
        text: md`
Two kinds of errors occur on a server: type A on average 1.5 per hour, type B on average 2.5 per hour; the counts are Poisson and independent. Find the probability that within 3 hours there are **at most 10** errors in total.
`,
        hint: md`Add the parameters: 3 hours of each type.`,
        solution: md`
$S\sim\text{Poisson}(4.5 + 7.5) = \text{Poisson}(12)$.
$$P(S\le10) = \sum_{k=0}^{10}e^{-12}\frac{12^k}{k!}\approx0.347$$
Excel: ‹=POISSON.DIST(10,12,TRUE)›.
`,
        answer: md`$S\sim$ Poisson(12); $P(S\le10)\approx0.347$.`
      },
      {
        id: 'e2', tag: 'C09', title: 'Paint cans in a box (sum of normals)',
        text: md`
The volume of paint in a can is normal $N(5\ \text{l};\ 0.1\ \text{l})$. A box holds 16 independent cans. What percentage of boxes (nominally 80 l) contains less than 79.5 l of paint?
`,
        hint: md`The sum of 16 independent $N(5; 0.1)$ has standard deviation $0.1\sqrt{16}$.`,
        solution: md`
$S\sim N(80;\ 0.4)$. $P(S<79.5) = \Phi(-1.25) = 0.1056$ → about **10.6%** of boxes.
`,
        answer: md`≈ 10.6%.`
      },
      {
        id: 'e3', own: true, title: 'Two production lines (sum of binomials)',
        text: md`
20 items from line A and 30 from line B were checked; on both lines an item is faulty with probability 0.1 (independently). What is the distribution of the total number of faulty items? Compute its expected value, variance and $P(S\le3)$.
`,
        hint: md`Same $p$ → add the numbers of trials.`,
        solution: md`
$S\sim\text{Bin}(50;\ 0.1)$; $E(S) = 5$, $V(S) = 4.5$.
$P(S\le3) = \sum_{k=0}^{3}\binom{50}{k}0.1^k0.9^{50-k}\approx0.250$.
`,
        answer: md`Bin(50; 0.1); $E=5$; $V=4.5$; $P(S\le3)\approx0.250$.`
      },
      {
        id: 'e4', own: true, title: 'A lift',
        text: md`
A passenger’s mass is $N(75\ \text{kg};\ 12\ \text{kg})$, masses are independent. a) What is the probability that 8 people exceed the 650 kg limit? b) What is the maximum number of people so that the probability of exceeding 650 kg is at most 1%?
`,
        hint: md`b) Condition: $75n + z_{0.99}\cdot12\sqrt n\le650$, $z_{0.99} = 2.326$. Try successive $n$.`,
        solution: md`
**a)** $S\sim N(600;\ 33.94)$; $P(S>650) = 1-\Phi(1.47)\approx0.070$.

**b)** $n = 8$: $600 + 2.326\cdot33.94\approx679 > 650$ ✗; $n = 7$: $525 + 2.326\cdot31.75\approx599 \le 650$ ✓. At most **7 people**.
`,
        answer: md`a) ≈ 0.070; b) 7 people.`
      },
      {
        id: 'e5', own: true, title: 'Which reading is larger? (difference of normals)',
        text: md`
Instrument A reads $N(10.0;\ 0.3)$, instrument B reads $N(9.8;\ 0.4)$, independently. What is the probability that A shows more than B?
`,
        hint: md`$P(A>B) = P(A-B>0)$; $A-B$ is normal.`,
        solution: md`
$A-B\sim N(0.2;\ \sqrt{0.09+0.16} = 0.5)$. $P(A-B>0) = \Phi(0.4) = 0.6554$.
`,
        answer: md`≈ 0.655.`
      },
      {
        id: 'e6', own: true, title: 'The sample mean is more reliable',
        text: md`
Battery life is $N(20\ \text{h};\ 4\ \text{h})$. Find the probability that a) a single battery lasts less than 19 h; b) the **mean** life of 25 random batteries is less than 19 h.
`,
        hint: md`$\bar X\sim N(20;\ 4/\sqrt{25})$.`,
        solution: md`
a) $\Phi(-0.25)\approx0.401$. b) $\bar X\sim N(20;\ 0.8)$: $\Phi(-1.25)\approx0.106$.
The mean of 25 batteries strays from 20 h much less often than a single battery.
`,
        answer: md`a) ≈ 0.401; b) ≈ 0.106.`
      },
      {
        id: 'e7', own: true, title: 'A combination of three variables with covariance',
        text: md`
$E(X_1) = 10$, $E(X_2) = 20$, $E(X_3) = 30$; $V(X_1) = 4$, $V(X_2) = 9$, $V(X_3) = 16$; $\mathrm{Cov}(X_1, X_2) = 2$, other covariances 0. Find $E(Y)$ and $\sigma_Y$ for $Y = X_1 + 2X_2 - X_3$.
`,
        hint: md`Coefficients: $a_1 = 1$, $a_2 = 2$, $a_3 = -1$; covariance term: $2a_1a_2\mathrm{Cov}(X_1,X_2)$.`,
        solution: md`
$E(Y) = 10 + 40 - 30 = 20$. $V(Y) = 4+36+16+8 = 64$, $\sigma_Y = 8$.
`,
        answer: md`$E(Y)=20$, $\sigma_Y=8$.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'Что происходит, когда мы **складываем** случайные величины? Средние складываются всегда, дисперсии — если величины независимы. Узнаете и «теоремы сложения»: сумма пуассоновских — пуассоновская, сумма нормальных — нормальная.',
    lecture: md`
# n-мерная случайная величина

Всё из темы 6 переносится на $n$ величин $X_1,\dots,X_n$ на общем пространстве: совместная функция распределения $F(x_1,\dots,x_n) = P(X_1\le x_1,\dots,X_n\le x_n)$, совместный ряд или плотность, маргинальные распределения (суммируем/интегрируем по остальным переменным). {lecture:W06}

::: def W06 | Независимость n величин
$X_1,\dots,X_n$ независимы, если
$$F(x_1,\dots,x_n) = F_{X_1}(x_1)\cdots F_{X_n}(x_n)$$
(равносильно: ряд / плотность распадается в произведение). Значит, **любое** подмножество величин (пара, тройка…) имеет совместное распределение, равное произведению маргинальных.
:::

# Среднее и дисперсия линейной комбинации

::: formula W06 | Линейная комбинация n величин
$$E\Big(\sum_{i=1}^n a_iX_i\Big) = \sum_{i=1}^n a_i E(X_i)\qquad\text{(всегда!)}$$
$$V\Big(\sum_{i=1}^n a_iX_i\Big) = \sum_{i=1}^n a_i^2V(X_i) + 2\sum_{i<j}a_ia_j\,\mathrm{Cov}(X_i,X_j)$$
Для **попарно независимых** (все ковариации = 0):
$$V\Big(\sum a_iX_i\Big) = \sum a_i^2V(X_i)$$
:::

::: warn own | У разности дисперсия тоже «с плюсом»
$V(X - Y) = V(X) + (-1)^2V(Y) = V(X)+V(Y)$ для независимых. Вычитание **не уменьшает** неопределённость — обе величины «шатаются» независимо, поэтому разность шатается сильнее.
:::

# Выборочное среднее

::: formula W06 | Среднее n независимых одинаково распределённых величин
Если $E(X_i) = \mu$ и $V(X_i) = \sigma^2$, то для $\bar X = \frac1n\sum X_i$:
$$E(\bar X) = \mu,\qquad V(\bar X) = \frac{\sigma^2}{n},\qquad \sigma_{\bar X} = \frac{\sigma}{\sqrt n}$$
:::

::: intuition
Одно измерение может сильно ошибиться. Среднее из 16 измерений ошибается в среднем **в 4 раза меньше** ($\sqrt{16} = 4$), потому что ошибки в разные стороны частично гасят друг друга. Это фундамент всей статистики: чем больше данных, тем точнее среднее.
:::

@chart meanShrink

# Теоремы сложения

Очень важно уметь находить **распределение суммы** независимых величин. Для знакомых распределений есть готовые результаты (без доказательства): {lecture:W06}

| Слагаемые (независимые) | Сумма $S = X_1+\dots+X_n$ |
|---|---|
| $X_i\sim$ Бернулли$(p)$ | $S\sim\text{Bin}(n, p)$ |
| $X_i\sim\text{Bin}(n_i, p)$ — **одно и то же $p$** | $S\sim\text{Bin}(\sum n_i, p)$ |
| $X_i\sim\text{Poisson}(\lambda_i)$ | $S\sim\text{Poisson}(\sum\lambda_i)$ |
| $X_i\sim N(\mu_i,\sigma_i)$ | $S\sim N\left(\sum\mu_i,\ \sqrt{\sum\sigma_i^2}\right)$ |

::: warn
В сумме нормальных складываются **дисперсии**, а не отклонения: $\sigma_S = \sqrt{\sigma_1^2+\sigma_2^2+\dots}$, а **не** $\sigma_1+\sigma_2+\dots$
:::

::: formula own | Полезные частные случаи
- $n$ независимых $N(\mu,\sigma)$: сумма $\sim N(n\mu,\ \sigma\sqrt n)$, среднее $\sim N(\mu,\ \sigma/\sqrt n)$.
- Разность независимых нормальных: $X - Y\sim N(\mu_X-\mu_Y,\ \sqrt{\sigma_X^2+\sigma_Y^2})$.
- Любая Bin$(n,p)$ — сумма $n$ независимых нуль-единичных величин, отсюда $E = np$, $V = np(1-p)$.
:::

::: example W06 | Бракованные телевизоры и стереосистемы
Число бракованных телевизоров в день ~ Poisson(2), стереосистем ~ Poisson(3), всё независимо. Число бракованных изделий за 2 дня:
$$S = X_1+X_2+X_3+X_4\sim\text{Poisson}(2+2+3+3 = 10),\qquad P(S\le5) = F(5;10)\approx0{,}0671$$
:::

::: example own | Лифт
В лифте едут 8 человек, массы независимы $N(75, 12)$ кг. Суммарная масса $\sim N(8\cdot75,\ 12\sqrt8) = N(600;\ 33{,}9)$.
$$P(\text{масса}>650) = 1-\Phi\left(\frac{650-600}{33{,}9}\right) = 1-\Phi(1{,}47)\approx0{,}071$$
:::

@chart elevator

# В Excel

~~~excel Суммы величин
A1: =POISSON.DIST(5,10,TRUE)                      // P(S <= 5), S ~ Poisson(2+2+3+3)
A2: =12*SQRT(8)                                   // σ суммы 8 человек
A3: =1-NORM.DIST(650,8*75,12*SQRT(8),TRUE)        // P(сумма > 650)
A4: =NORM.DIST(19,20,4/SQRT(25),TRUE)             // P(среднее из 25 < 19)
~~~

~~~python Симуляция: сходится ли дисперсия суммы?
import numpy as np
rng = np.random.default_rng(1)
X = rng.normal(75, 12, size=(100_000, 8))      # 100 тыс. «лифтов» по 8 человек
S = X.sum(axis=1)
print(S.mean(), S.std())                        # ≈ 600 и ≈ 33.9 = 12*sqrt(8)
print((S > 650).mean())                         # ≈ 0.07
~~~

::: summary
- $E(\sum a_iX_i) = \sum a_iE(X_i)$ всегда; $V(\sum a_iX_i) = \sum a_i^2V(X_i)$ для независимых (+ ковариации, если зависимы).
- $E(\bar X) = \mu$, $V(\bar X) = \sigma^2/n$.
- Бернулли → Bin; Bin + Bin (одно $p$) → Bin; Пуассон + Пуассон → Пуассон ($\lambda$ складываются); нормальное + нормальное → нормальное (дисперсии складываются).
:::
`,

    cheatsheet: md`
## Линейные комбинации
$$E\Big(\sum a_iX_i\Big)=\sum a_iEX_i \qquad V\Big(\sum a_iX_i\Big)=\sum a_i^2VX_i+2\sum_{i<j}a_ia_j\mathrm{Cov}_{ij}$$
- независимы → ковариации = 0
- $V(X-Y)=VX+VY$ (независимы) — **плюс**!
- $\bar X$: $E=\mu$, $V=\sigma^2/n$, $\sigma_{\bar X}=\sigma/\sqrt n$

## Теоремы сложения (независимые)
| слагаемые | сумма |
|---|---|
| Бернулли(p) × n | Bin(n, p) |
| Bin(nᵢ, p) | Bin(Σnᵢ, p) |
| Poisson(λᵢ) | Poisson(Σλᵢ) |
| N(μᵢ, σᵢ) | N(Σμᵢ, √Σσᵢ²) |

- $n$ раз $N(\mu,\sigma)$: сумма $N(n\mu, \sigma\sqrt n)$, среднее $N(\mu,\sigma/\sqrt n)$
- $X-Y\sim N(\mu_X-\mu_Y, \sqrt{\sigma_X^2+\sigma_Y^2})$
- λ в день → за $k$ дней: $k\lambda$
`,

    exercises: [
      {
        id: 'e1', tag: 'C09', title: 'Ошибки на сервере (сумма пуассоновских)',
        text: md`
На сервере возникают ошибки двух типов: типа A в среднем 1,5 в час, типа B в среднем 2,5 в час; числа ошибок распределены по Пуассону и независимы. Найдите вероятность того, что за 3 часа всего будет **не больше 10** ошибок.
`,
        hint: md`Сложите параметры: по 3 часа каждого типа.`,
        solution: md`
$S\sim\text{Poisson}(4{,}5 + 7{,}5) = \text{Poisson}(12)$.
$$P(S\le10) = \sum_{k=0}^{10}e^{-12}\frac{12^k}{k!}\approx0{,}347$$
Excel: ‹=POISSON.DIST(10,12,TRUE)›.
`,
        answer: md`$S\sim$ Poisson(12); $P(S\le10)\approx0{,}347$.`
      },
      {
        id: 'e2', tag: 'C09', title: 'Банки краски в коробке (сумма нормальных)',
        text: md`
Объём краски в банке распределён нормально $N(5\ \text{л};\ 0{,}1\ \text{л})$. В коробке 16 независимых банок. Какой процент коробок (номинально 80 л) содержит меньше 79,5 л краски?
`,
        hint: md`Сумма 16 независимых $N(5; 0{,}1)$ имеет отклонение $0{,}1\sqrt{16}$.`,
        solution: md`
$S\sim N(80;\ 0{,}4)$. $P(S<79{,}5) = \Phi(-1{,}25) = 0{,}1056$ → около **10,6%** коробок.
`,
        answer: md`≈ 10,6%.`
      },
      {
        id: 'e3', own: true, title: 'Две производственные линии (сумма биномиальных)',
        text: md`
С линии A проверили 20 изделий, с линии B — 30; на обеих линиях изделие бракованное с вероятностью 0,1 (независимо). Каково распределение общего числа бракованных? Найдите его математическое ожидание, дисперсию и $P(S\le3)$.
`,
        hint: md`Одно и то же $p$ → складываем числа испытаний.`,
        solution: md`
$S\sim\text{Bin}(50;\ 0{,}1)$; $E(S) = 5$, $V(S) = 4{,}5$.
$P(S\le3) = \sum_{k=0}^{3}\binom{50}{k}0{,}1^k0{,}9^{50-k}\approx0{,}250$.
`,
        answer: md`Bin(50; 0,1); $E=5$; $V=4{,}5$; $P(S\le3)\approx0{,}250$.`
      },
      {
        id: 'e4', own: true, title: 'Лифт',
        text: md`
Масса пассажира $N(75\ \text{кг};\ 12\ \text{кг})$, массы независимы. а) Какова вероятность, что 8 человек превысят грузоподъёмность 650 кг? б) Сколько человек максимум может войти, чтобы вероятность превышения 650 кг была не больше 1%?
`,
        hint: md`б) Условие: $75n + z_{0{,}99}\cdot12\sqrt n\le650$, $z_{0{,}99} = 2{,}326$. Проверьте последовательные $n$.`,
        solution: md`
**а)** $S\sim N(600;\ 33{,}94)$; $P(S>650) = 1-\Phi(1{,}47)\approx0{,}070$.

**б)** $n = 8$: $600 + 2{,}326\cdot33{,}94\approx679 > 650$ ✗; $n = 7$: $525 + 2{,}326\cdot31{,}75\approx599 \le 650$ ✓. Максимум **7 человек**.
`,
        answer: md`а) ≈ 0,070; б) 7 человек.`
      },
      {
        id: 'e5', own: true, title: 'Какое показание больше? (разность нормальных)',
        text: md`
Прибор A показывает $N(10{,}0;\ 0{,}3)$, прибор B — $N(9{,}8;\ 0{,}4)$, независимо. Какова вероятность, что A покажет больше, чем B?
`,
        hint: md`$P(A>B) = P(A-B>0)$; $A-B$ нормальна.`,
        solution: md`
$A-B\sim N(0{,}2;\ \sqrt{0{,}09+0{,}16} = 0{,}5)$. $P(A-B>0) = \Phi(0{,}4) = 0{,}6554$.
`,
        answer: md`≈ 0,655.`
      },
      {
        id: 'e6', own: true, title: 'Выборочное среднее надёжнее',
        text: md`
Время работы батарейки $N(20\ \text{ч};\ 4\ \text{ч})$. Найдите вероятность того, что а) одна батарейка проработает меньше 19 ч; б) **среднее** время 25 случайных батареек меньше 19 ч.
`,
        hint: md`$\bar X\sim N(20;\ 4/\sqrt{25})$.`,
        solution: md`
а) $\Phi(-0{,}25)\approx0{,}401$. б) $\bar X\sim N(20;\ 0{,}8)$: $\Phi(-1{,}25)\approx0{,}106$.
Среднее из 25 батареек гораздо реже «уходит» от 20 ч, чем одна батарейка.
`,
        answer: md`а) ≈ 0,401; б) ≈ 0,106.`
      },
      {
        id: 'e7', own: true, title: 'Комбинация трёх величин с ковариацией',
        text: md`
$E(X_1) = 10$, $E(X_2) = 20$, $E(X_3) = 30$; $V(X_1) = 4$, $V(X_2) = 9$, $V(X_3) = 16$; $\mathrm{Cov}(X_1, X_2) = 2$, остальные ковариации 0. Найдите $E(Y)$ и $\sigma_Y$ для $Y = X_1 + 2X_2 - X_3$.
`,
        hint: md`Коэффициенты: $a_1 = 1$, $a_2 = 2$, $a_3 = -1$; ковариационный член: $2a_1a_2\mathrm{Cov}(X_1,X_2)$.`,
        solution: md`
$E(Y) = 10 + 40 - 30 = 20$. $V(Y) = 4+36+16+8 = 64$, $\sigma_Y = 8$.
`,
        answer: md`$E(Y)=20$, $\sigma_Y=8$.`
      }
    ]
  };

  SAD.registerTopic('t07', { charts: charts, pl: pl, en: en, ru: ru });
})();
