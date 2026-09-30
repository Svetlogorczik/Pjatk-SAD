/* Topic 4 — Continuous random variables (lecture W04a, classes C05) */
(function () {
  var md = SAD.md;
  var S = SAD.stats;

  // simulated sample → normalised histogram (the lecture's "histogram → density" idea)
  var rnd = S.rng(2025), n = 3000, edges = [], counts = [];
  for (var e = -3.2; e <= 3.21; e += 0.4) { edges.push(+e.toFixed(1)); }
  for (var c = 0; c < edges.length - 1; c++) { counts.push(0); }
  for (var i = 0; i < n; i++) {
    var z = Math.sqrt(-2 * Math.log(rnd() || 1e-9)) * Math.cos(2 * Math.PI * rnd());
    var b = Math.floor((z + 3.2) / 0.4);
    if (b >= 0 && b < counts.length) { counts[b]++; }
  }

  function f1(x) { return x >= 0 && x <= 3 ? x * x / 9 : 0; }
  function F1(x) { return x < 0 ? 0 : x > 3 ? 1 : x * x * x / 27; }
  function fEx3(x) { return x >= -2 && x < 0 ? 0.25 : (x >= 0 && x <= 1 ? x : 0); }

  var charts = {
    histDensity: { type: 'hist', edges: edges, counts: counts, density: true, total: n, showValues: false,
      curve: { name: 'normal', mu: 0, sigma: 1 }, xTicks: [-3, -2, -1, 0, 1, 2, 3], xDecimals: 0,
      caption: { pl: 'Histogram unormowany 3000 pomiarów (pole = 1) i gęstość, do której dąży przy n → ∞', en: 'Normalised histogram of 3000 measurements (area = 1) and the density it approaches as n → ∞', ru: 'Нормированная гистограмма 3000 измерений (площадь = 1) и плотность, к которой она стремится при n → ∞' } },
    density1: { type: 'pdf', dist: f1, range: [-0.5, 3.5], steps: 400,
      shade: [{ from: 1, to: 2, label: { pl: 'P(1 ≤ X ≤ 2) = 7/27', en: 'P(1 ≤ X ≤ 2) = 7/27', ru: 'P(1 ≤ X ≤ 2) = 7/27' }, labelY: 0.12 }],
      xLabel: 'x', yLabel: 'f(x)',
      caption: { pl: 'Gęstość f(x) = x²/9 na [0; 3]: prawdopodobieństwo = pole pod wykresem', en: 'Density f(x) = x²/9 on [0; 3]: probability = area under the curve', ru: 'Плотность f(x) = x²/9 на [0; 3]: вероятность = площадь под графиком' } },
    cdf1: { type: 'cdf', dist: { name: 'custom', cdf: F1 }, range: [-0.5, 3.5], xLabel: 'x',
      markers: [{ x: 2.381, label: { pl: 'Me ≈ 2,38', en: 'Me ≈ 2.38', ru: 'Me ≈ 2,38' } }],
      caption: { pl: 'Dystrybuanta F(x) = x³/27 jest ciągła; mediana to punkt, w którym F = 0,5', en: 'The CDF F(x) = x³/27 is continuous; the median is where F = 0.5', ru: 'Функция распределения F(x) = x³/27 непрерывна; медиана — точка, где F = 0,5' } },
    quantile: { type: 'pdf', dist: { name: 'normal', mu: 0, sigma: 1 }, range: [-3.5, 3.5],
      shade: [{ from: -3.5, to: 1, label: { pl: '0,84', en: '0.84', ru: '0,84' } }], markers: [{ x: 1, label: { pl: 'q₀,₈₄ = 1', en: 'q₀.₈₄ = 1', ru: 'q₀,₈₄ = 1' } }],
      caption: { pl: 'Kwantyl rzędu p: pole na lewo od niego = p (tu: N(0,1), q₀,₈₄ ≈ 1)', en: 'Quantile of order p: the area to its left = p (here N(0,1), q₀.₈₄ ≈ 1)', ru: 'Квантиль порядка p: площадь слева = p (здесь N(0,1), q₀,₈₄ ≈ 1)' } },
    exPiece: { type: 'pdf', dist: fEx3, range: [-2.5, 1.5], steps: 500, ymax: 1.15,
      shade: [{ from: -0.25, to: 0.75, label: '11/32', labelY: 0.12 }], xLabel: 'x', yLabel: 'f(x)' },
    exDisk: { type: 'pdf', dist: function (x) { return x > 0 ? x * Math.exp(-x) : 0; }, range: [0, 9],
      shade: [{ from: 3, to: 9, label: { pl: '4e⁻³ ≈ 0,199', en: '4e⁻³ ≈ 0.199', ru: '4e⁻³ ≈ 0,199' }, labelX: 4.6, labelY: 0.06 }], xLabel: { pl: 'lata', en: 'years', ru: 'годы' }, yLabel: 'f(x)' }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Czas, waga, napięcie — wartości „ciągłe”. Dla nich prawdopodobieństwo to **pole pod wykresem gęstości**. Nauczysz się liczyć dystrybuantę, średnią, wariancję i kwantyle takiej zmiennej.',
    lecture: md`
# Od histogramu do gęstości

Weź bardzo dużo niezależnych pomiarów cechy ciągłej i narysuj **histogram unormowany** (wysokość słupka = częstość / szerokość klasy, więc suma pól = 1). Gdy liczba pomiarów rośnie, a klasy są coraz węższe, łamana częstości staje się gładka i zbliża się do pewnej idealnej krzywej — **gęstości** cechy. {lecture:W04a}

@chart histDensity

Dla dużej próbki:
$$\text{częstość obserwacji w przedziale} \approx \text{pole pod wykresem gęstości nad tym przedziałem}$$

# Gęstość i dystrybuanta

::: def | Zmienna losowa ciągła
$X$ jest **ciągła**, jeśli istnieje nieujemna funkcja $f$ (**gęstość**) taka, że dla dowolnych $a\le b$:
$$P(a\le X\le b) = \int_a^b f(x)\,dx.$$
**Dystrybuanta**: $F(x) = P(X\le x) = \displaystyle\int_{-\infty}^{x} f(s)\,ds$. {lecture:W04a}
:::

::: formula | Warunki i związki
$$f(x)\ge0,\qquad \int_{-\infty}^{\infty} f(x)\,dx = 1,\qquad F'(x) = f(x)\ \text{(tam, gdzie } f \text{ ciągła)}$$
$$P(X = c) = 0\ \text{ dla każdego } c$$
:::

::: intuition
Pytanie „jakie jest prawdopodobieństwo, że ktoś ma **dokładnie** 175,000000… cm wzrostu?” ma odpowiedź 0 — pojedynczy punkt ma zerową szerokość, więc zerowe pole. Sensowne pytania dotyczą **przedziałów**: „między 170 a 180 cm”.
:::

::: tip
Skoro $P(X=c)=0$, dla zmiennej ciągłej **nie ma różnicy** między $<$ i $\le$: $P(a<X<b) = P(a\le X\le b) = F(b) - F(a)$. (Dla zmiennych dyskretnych ta różnica jest ważna!)
:::

::: steps | Typowe zadanie: gęstość z parametrem
1. **Stała**: z warunku $\int f = 1$ wyznacz parametr (sprawdź też $f\ge0$!).
2. **Dystrybuanta**: $F(x) = \int_{-\infty}^x f$ — osobno na każdym przedziale; na końcu $F=1$.
3. **Prawdopodobieństwa**: $P(a<X<b) = F(b)-F(a)$ (albo całka z $f$).
4. **Wykres**: $f$ może mieć skoki, $F$ jest zawsze ciągła i niemalejąca.
:::

::: example own | f(x) = c·x² na [0; 3]
1. $\int_0^3 cx^2dx = c\cdot\frac{27}{3} = 9c = 1 \Rightarrow c = \frac19$.
2. $F(x) = 0$ dla $x<0$; $F(x) = \int_0^x \frac{s^2}{9}ds = \frac{x^3}{27}$ dla $0\le x\le3$; $F(x)=1$ dla $x>3$.
3. $P(1\le X\le2) = F(2)-F(1) = \frac{8-1}{27} = \frac7{27}\approx0{,}259$.
:::

@chart density1

@chart cdf1

# Wartość oczekiwana i wariancja

::: formula | Zmienna ciągła
$$E(X) = \int_{-\infty}^{\infty} x\,f(x)\,dx,\qquad E[g(X)] = \int_{-\infty}^{\infty} g(x)\,f(x)\,dx$$
$$V(X) = E(X^2) - (EX)^2,\qquad \sigma = \sqrt{V(X)}$$
Wszystko jak w przypadku dyskretnym, tylko **suma → całka**, a $p_i$ → $f(x)\,dx$.
:::

$E(X)$ to **środek ciężkości** figury między wykresem gęstości a osią OX. Własności: $E(aX+b) = aE(X)+b$, $V(aX+b) = a^2V(X)$. {lecture:W04a}

::: example own | ciąg dalszy: f(x) = x²/9
$$E(X) = \int_0^3 x\cdot\frac{x^2}{9}dx = \frac19\cdot\frac{81}{4} = 2{,}25,\qquad E(X^2) = \int_0^3\frac{x^4}{9}dx = \frac19\cdot\frac{243}{5} = 5{,}4$$
$$V(X) = 5{,}4 - 2{,}25^2 = 0{,}3375,\qquad \sigma\approx0{,}581$$
:::

# Kwantyle, mediana, kwartyle

::: def | Kwantyl rzędu p
Dla $0<p<1$ **kwantyl rzędu $p$** to taki punkt $q_p$, że **pole pod gęstością na lewo od niego wynosi $p$**:
$$F(q_p) = p\qquad\Longleftrightarrow\qquad \int_{-\infty}^{q_p} f(x)\,dx = p.$$
{lecture:W04a}
:::

@chart quantile

| Parametr próbki (temat 1) | Parametr gęstości |
|---|---|
| średnia $\bar x$ | wartość średnia $\mu = E(X)$ |
| odchylenie $s$ | odchylenie $\sigma$ |
| dolny kwartyl $Q_1$ | $q_{0{,}25}$ |
| mediana $x_{med}$ | $q_{0{,}5}$ |
| górny kwartyl $Q_3$ | $q_{0{,}75}$ |
| IQR | $q_{0{,}75} - q_{0{,}25}$ |

::: example own | Mediana dla f(x) = x²/9
$F(m) = \frac{m^3}{27} = 0{,}5 \Rightarrow m = \sqrt[3]{13{,}5}\approx 2{,}381$. Mediana (2,38) jest tu **większa** od średniej (2,25), bo gęstość rośnie w prawo i ma długi „ogon” w lewo (skośność ujemna).
:::

# Standaryzacja

::: def W04a | Zmienna standaryzowana
$$Z = \frac{X - \mu}{\sigma}\qquad\Rightarrow\qquad E(Z) = 0,\quad V(Z) = 1$$
Dowód: $E(Z) = \frac1\sigma(E X - \mu) = 0$, $\;V(Z) = \frac{1}{\sigma^2}V(X) = 1$.
:::

Standaryzacja mówi, **o ile odchyleń standardowych** wartość leży od średniej. Dzięki niej wystarczy jedna tablica rozkładu normalnego (temat 5).

# Nierówność Czebyszewa

::: formula W04a | Nierówność Czebyszewa
Dla dowolnej zmiennej o średniej $\mu$ i wariancji $\sigma^2$ oraz dowolnego $\varepsilon>0$:
$$P(|X-\mu|\ge\varepsilon) \le \frac{\sigma^2}{\varepsilon^2}$$
:::

::: example own | Co to daje?
Dla $\varepsilon = 2\sigma$: $P(|X-\mu|\ge2\sigma)\le\frac14$ — **dla każdego rozkładu** co najwyżej 25% wartości leży dalej niż $2\sigma$ od średniej. Dla rozkładu normalnego faktycznie jest to tylko ok. 4,6% — nierówność jest „ostrożna”, ale działa zawsze.
:::

# W Excelu i Pythonie

Całki liczymy na kartce. Excel przydaje się do sprawdzenia wyniku — np. całkowanie numeryczne metodą trapezów:

~~~excel Całka numeryczna ∫₀³ x²/9 dx (siatka x w A2:A302 co 0,01)
A2: 0                      // potem A3: =A2+0.01 i przeciągnij do A302 (x = 3)
B2: =A2^2/9                // f(x); przeciągnij
C3: =(B2+B3)/2*(A3-A2)     // pole trapezu; przeciągnij od C3 do C302
E1: =SUM(C3:C302)          // ≈ 1 (sprawdzenie stałej c)
~~~

~~~python Całki i kwantyle symbolicznie (sympy) i numerycznie (scipy)
import sympy as sp
x, c = sp.symbols('x c', positive=True)
f = c * x**2
c_val = sp.solve(sp.integrate(f, (x, 0, 3)) - 1, c)[0]      # 1/9
f = f.subs(c, c_val)
F = sp.integrate(f, (x, 0, x))                              # x**3/27
EX = sp.integrate(x * f, (x, 0, 3))                         # 9/4
VX = sp.integrate(x**2 * f, (x, 0, 3)) - EX**2              # 27/80
print(c_val, F, EX, VX, sp.nsolve(F - sp.Rational(1, 2), x, 2))   # mediana ≈ 2.381
~~~

::: summary
- Gęstość $f\ge0$, $\int f = 1$; $P(a\le X\le b) = \int_a^b f = F(b)-F(a)$; $P(X=c)=0$.
- $F(x) = \int_{-\infty}^x f$, $F' = f$; $F$ ciągła, niemalejąca.
- $E(X) = \int xf$, $V(X) = \int x^2f - (EX)^2$.
- Kwantyl: $F(q_p)=p$; mediana $q_{0{,}5}$, kwartyle $q_{0{,}25}$, $q_{0{,}75}$.
- Standaryzacja $Z=(X-\mu)/\sigma$; Czebyszew $P(|X-\mu|\ge\varepsilon)\le\sigma^2/\varepsilon^2$.
:::
`,

    cheatsheet: md`
## Gęstość i dystrybuanta
- $f(x)\ge0$, $\int_{-\infty}^{\infty}f=1$ → wyznacz stałą
- $F(x)=\int_{-\infty}^{x}f(s)\,ds$; $F'=f$; $F$ ciągła, od 0 do 1
- $P(a<X<b)=P(a\le X\le b)=F(b)-F(a)=\int_a^b f$; $P(X=c)=0$
- $P(X>a)=1-F(a)$; $P(|X-m|<d) = F(m+d)-F(m-d)$

## Parametry
$$E(X)=\int xf(x)dx \qquad E(X^2)=\int x^2f(x)dx \qquad V=E(X^2)-(EX)^2$$
- $E(aX+b)=aEX+b$, $V(aX+b)=a^2VX$
- kwantyl: $F(q_p)=p$; mediana: $F(m)=0{,}5$
- $Z=(X-\mu)/\sigma$: $EZ=0$, $VZ=1$
- Czebyszew: $P(|X-\mu|\ge\varepsilon)\le\sigma^2/\varepsilon^2$

## Jak liczyć F dla gęstości „kawałkami”
Na każdym przedziale: $F(x) = F(\text{początek}) + \int_{\text{początek}}^{x} f$. Sprawdź: $F$ na końcu = 1, brak skoków.

## Całki, które często wracają
$\int x^n dx = \frac{x^{n+1}}{n+1}$ · $\int_0^\infty x^n e^{-x}dx = n!$ · $\int x e^{-x}dx = -(x+1)e^{-x}$
`,

    exercises: [
      {
        id: 'e1', tag: 'C05', title: 'Gęstość stała na przedziale',
        text: md`
Zmienna losowa $X$ ma gęstość $f(x) = A$ dla $x\in[-1; 4]$ i $f(x)=0$ poza tym przedziałem.
a) Ile wynosi $A$?
b) Wyznacz dystrybuantę i narysuj jej wykres.
c) Oblicz $P(X\le 2)$, $P(X>0)$, $P(X=1)$, $P(-3\le X\le 1)$.
d) Zinterpretuj te prawdopodobieństwa na wykresach gęstości i dystrybuanty.
`,
        hint: md`Pole prostokąta o podstawie 5 musi być 1. Część przedziału $[-3; 1]$ leży poza nośnikiem — tam $f=0$.`,
        solution: md`
**a)** $A\cdot 5 = 1 \Rightarrow A = \frac15$.

**b)** $F(x) = 0$ dla $x<-1$; $F(x) = \frac{x+1}{5}$ dla $-1\le x\le4$; $F(x)=1$ dla $x>4$ (linia prosta od 0 do 1).

**c)**
- $P(X\le2) = F(2) = \frac35$
- $P(X>0) = 1 - F(0) = 1-\frac15 = \frac45$
- $P(X=1) = 0$ (zmienna ciągła)
- $P(-3\le X\le1) = F(1)-F(-3) = \frac25 - 0 = \frac25$

**d)** Na wykresie gęstości to **pola prostokątów** o wysokości $\frac15$ nad odpowiednimi przedziałami (np. nad $[-1;2]$: $3\cdot\frac15$). Na wykresie dystrybuanty — **różnice wysokości** $F$ na końcach przedziałów; $P(X=1)$ to „skok” w punkcie 1, którego nie ma (brak skoku = 0).
`,
        answer: md`$A=\frac15$; $P(X\le2)=0{,}6$; $P(X>0)=0{,}8$; $P(X=1)=0$; $P(-3\le X\le1)=0{,}4$.`
      },
      {
        id: 'e2', tag: 'C05', title: 'Pułapka ze znakiem stałej',
        text: md`
Dla jakiej wartości $A$ funkcja $f(x) = A(x-3)$ dla $x\in[1; 3]$ (i $0$ poza tym przedziałem) jest gęstością? Wyznacz dystrybuantę.
`,
        hint: md`Na $[1;3]$ mamy $x-3\le0$. Żeby $f\ge0$, stała musi być **ujemna**.`,
        solution: md`
$\int_1^3 (x-3)\,dx = \left[\frac{x^2}{2}-3x\right]_1^3 = (4{,}5-9)-(0{,}5-3) = -2$, więc $A\cdot(-2) = 1 \Rightarrow A = -\frac12$.
Zatem $f(x) = \frac{3-x}{2}\ge0$ na $[1;3]$ ✓.

$$F(x) = \int_1^x\frac{3-s}{2}ds = \frac{6x - x^2 - 5}{4}\quad (1\le x\le3),$$
$F(x)=0$ dla $x<1$, $F(x) = 1$ dla $x>3$. Kontrola: $F(1) = 0$, $F(3) = \frac{18-9-5}{4} = 1$ ✓.
`,
        answer: md`$A=-\frac12$; $F(x)=\frac{6x-x^2-5}{4}$ na $[1;3]$.`
      },
      {
        id: 'e3', tag: 'C05', title: 'Gęstość złożona z dwóch kawałków',
        text: md`
Zmienna $X$ ma gęstość $f(x) = \frac14$ dla $x\in[-2;0)$, $f(x) = x$ dla $x\in[0;1]$ i $f(x)=0$ poza $[-2;1]$.
a) Wyznacz dystrybuantę.
b) Oblicz $P\left(\left|X-\frac14\right|<\frac12\right)$.
c) Wyznacz $E(X)$, medianę i odchylenie standardowe.
`,
        hint: md`Na $[0;1]$ dystrybuanta startuje od $F(0) = 2\cdot\frac14 = \frac12$. Warunek $|X-\frac14|<\frac12$ to przedział $(-\frac14; \frac34)$.`,
        solution: md`
**a)**
$$F(x) = \begin{cases}0 & x<-2\\ \frac{x+2}{4} & -2\le x<0\\ \frac12 + \frac{x^2}{2} & 0\le x\le 1\\ 1 & x>1\end{cases}$$

**b)** $P(-\tfrac14<X<\tfrac34) = F(\tfrac34)-F(-\tfrac14) = \left(\frac12+\frac{9}{32}\right) - \frac{7/4}{4} = \frac{25}{32}-\frac{14}{32} = \frac{11}{32}\approx0{,}344$.

@chart exPiece

**c)** $E(X) = \int_{-2}^0\frac x4dx + \int_0^1 x^2dx = -\frac12+\frac13 = -\frac16$.
$E(X^2) = \int_{-2}^0\frac{x^2}{4}dx+\int_0^1x^3dx = \frac23+\frac14 = \frac{11}{12}$; $V(X) = \frac{11}{12}-\frac1{36} = \frac89$, $\sigma = \frac{2\sqrt2}{3}\approx0{,}943$.
Mediana: $F(0) = \frac12$, więc **mediana = 0**.
`,
        answer: md`$P=\frac{11}{32}$; $E(X)=-\frac16$; mediana $=0$; $\sigma\approx0{,}943$.`
      },
      {
        id: 'e4', tag: 'C05', title: 'Z dystrybuanty do gęstości',
        text: md`
Dystrybuanta $X$: $F(x) = 0$ dla $x<2$, $F(x) = \frac{x-2}{8}$ dla $2\le x<10$, $F(x) = 1$ dla $x\ge10$.
a) Wyznacz gęstość.
b) Oblicz $P(|X-6|>3)$.
c) Wyznacz $E(X)$ i odchylenie standardowe.
`,
        hint: md`$f = F'$. $|X-6|>3$ oznacza $X<3$ lub $X>9$.`,
        solution: md`
**a)** $f(x) = \frac18$ na $[2;10]$, 0 poza — to rozkład jednostajny.

**b)** $P(X<3) + P(X>9) = F(3) + 1 - F(9) = \frac18 + \frac18 = \frac14$.

**c)** $E(X) = \int_2^{10}\frac x8dx = \frac{100-4}{16} = 6$; $E(X^2) = \int_2^{10}\frac{x^2}{8}dx = \frac{1000-8}{24} = 41{,}33$; $V = 41{,}33-36 = 5{,}33 = \frac{64}{12}$, $\sigma = \frac{8}{\sqrt{12}}\approx2{,}309$.
`,
        answer: md`$f=\frac18$ na $[2;10]$; $P=\frac14$; $E(X)=6$; $\sigma\approx2{,}31$.`
      },
      {
        id: 'e5', tag: 'C05', title: 'Czas życia urządzenia',
        text: md`
Czas bezawaryjnej pracy urządzenia (w latach) ma gęstość $f(x) = c\,x\,e^{-x}$ dla $x>0$ i $0$ dla $x\le0$. Wyznacz $c$, oblicz prawdopodobieństwo, że urządzenie przepracuje **co najmniej 3 lata**, oraz średni czas pracy.
`,
        hint: md`Całkuj przez części: $\int x e^{-x}dx = -(x+1)e^{-x}$. Przyda się też $\int_0^\infty x^n e^{-x}dx = n!$.`,
        solution: md`
$\int_0^\infty x e^{-x}dx = 1! = 1 \Rightarrow c = 1$.

$$P(X\ge3) = \int_3^\infty xe^{-x}dx = \Big[-(x+1)e^{-x}\Big]_3^\infty = 4e^{-3}\approx 0{,}199$$

@chart exDisk

$E(X) = \int_0^\infty x^2e^{-x}dx = 2! = 2$ lata.
`,
        answer: md`$c=1$; $P(X\ge3)=4e^{-3}\approx0{,}199$; $E(X)=2$ lata.`
      },
      {
        id: 'e6', own: true, title: 'Kwantyle i nierówność Czebyszewa',
        text: md`
$X$ ma gęstość $f(x) = 2x$ na $[0;1]$. Wyznacz medianę i kwantyl rzędu 0,9. Oblicz $E(X)$, $\sigma$, a następnie porównaj oszacowanie Czebyszewa $P(|X-E X|\ge0{,}4)$ z wartością dokładną.
`,
        hint: md`$F(x) = x^2$. Nierówność: $P\le\sigma^2/\varepsilon^2$.`,
        solution: md`
$F(x) = x^2$ na $[0;1]$. Mediana: $m^2 = 0{,}5\Rightarrow m\approx0{,}707$; $q_{0{,}9} = \sqrt{0{,}9}\approx0{,}949$.
$E(X) = \int_0^1 2x^2dx = \frac23$, $E(X^2) = \int_0^12x^3dx = \frac12$, $V = \frac12-\frac49 = \frac1{18}$, $\sigma\approx0{,}236$.

Czebyszew: $P(|X-\frac23|\ge0{,}4)\le\dfrac{1/18}{0{,}16}\approx0{,}347$.
Dokładnie: $X\le0{,}2667$ (bo $X\ge1{,}0667$ jest niemożliwe): $0{,}2667^2\approx0{,}071$.
Oszacowanie jest prawdziwe, ale bardzo „z zapasem” — za to działa dla **każdego** rozkładu.
`,
        answer: md`Me ≈ 0,707; $q_{0{,}9}\approx0{,}949$; $E=\frac23$; $\sigma\approx0{,}236$; Czebyszew ≤ 0,347, dokładnie ≈ 0,071.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'Time, weight, voltage — “continuous” values. For them probability is the **area under the density curve**. You will learn to compute the CDF, mean, variance and quantiles of such a variable.',
    lecture: md`
# From the histogram to the density

Take very many independent measurements of a continuous feature and draw a **normalised histogram** (bar height = frequency / class width, so the total area = 1). As the number of measurements grows and the classes get narrower, the frequency polygon becomes smooth and approaches an ideal curve — the **density** of the feature. {lecture:W04a}

@chart histDensity

For a large sample:
$$\text{frequency of observations in an interval} \approx \text{area under the density over that interval}$$

# Density and CDF

::: def | Continuous random variable
$X$ is **continuous** if there is a non-negative function $f$ (the **density**) such that for any $a\le b$:
$$P(a\le X\le b) = \int_a^b f(x)\,dx.$$
**CDF**: $F(x) = P(X\le x) = \displaystyle\int_{-\infty}^{x} f(s)\,ds$. {lecture:W04a}
:::

::: formula | Conditions and relations
$$f(x)\ge0,\qquad \int_{-\infty}^{\infty} f(x)\,dx = 1,\qquad F'(x) = f(x)\ \text{(where } f \text{ is continuous)}$$
$$P(X = c) = 0\ \text{ for every } c$$
:::

::: intuition
“What is the probability that someone is **exactly** 175.000000… cm tall?” — the answer is 0: a single point has zero width, hence zero area. Sensible questions are about **intervals**: “between 170 and 180 cm”.
:::

::: tip
Since $P(X=c)=0$, for a continuous variable there is **no difference** between $<$ and $\le$: $P(a<X<b) = P(a\le X\le b) = F(b) - F(a)$. (For discrete variables the difference matters!)
:::

::: steps | Typical problem: a density with a parameter
1. **Constant**: find the parameter from $\int f = 1$ (also check $f\ge0$!).
2. **CDF**: $F(x) = \int_{-\infty}^x f$ — separately on every interval; at the end $F=1$.
3. **Probabilities**: $P(a<X<b) = F(b)-F(a)$ (or the integral of $f$).
4. **Plot**: $f$ may jump, $F$ is always continuous and non-decreasing.
:::

::: example own | f(x) = c·x² on [0; 3]
1. $\int_0^3 cx^2dx = c\cdot\frac{27}{3} = 9c = 1 \Rightarrow c = \frac19$.
2. $F(x) = 0$ for $x<0$; $F(x) = \int_0^x \frac{s^2}{9}ds = \frac{x^3}{27}$ for $0\le x\le3$; $F(x)=1$ for $x>3$.
3. $P(1\le X\le2) = F(2)-F(1) = \frac{8-1}{27} = \frac7{27}\approx0.259$.
:::

@chart density1

@chart cdf1

# Expected value and variance

::: formula | Continuous variable
$$E(X) = \int_{-\infty}^{\infty} x\,f(x)\,dx,\qquad E[g(X)] = \int_{-\infty}^{\infty} g(x)\,f(x)\,dx$$
$$V(X) = E(X^2) - (EX)^2,\qquad \sigma = \sqrt{V(X)}$$
Everything as in the discrete case, only **sum → integral** and $p_i$ → $f(x)\,dx$.
:::

$E(X)$ is the **centre of gravity** of the region between the density and the x-axis. Properties: $E(aX+b) = aE(X)+b$, $V(aX+b) = a^2V(X)$. {lecture:W04a}

::: example own | continued: f(x) = x²/9
$$E(X) = \int_0^3 x\cdot\frac{x^2}{9}dx = \frac19\cdot\frac{81}{4} = 2.25,\qquad E(X^2) = \int_0^3\frac{x^4}{9}dx = \frac19\cdot\frac{243}{5} = 5.4$$
$$V(X) = 5.4 - 2.25^2 = 0.3375,\qquad \sigma\approx0.581$$
:::

# Quantiles, median, quartiles

::: def | Quantile of order p
For $0<p<1$ the **quantile of order $p$** is the point $q_p$ such that **the area under the density to its left equals $p$**:
$$F(q_p) = p\qquad\Longleftrightarrow\qquad \int_{-\infty}^{q_p} f(x)\,dx = p.$$
{lecture:W04a}
:::

@chart quantile

| Sample parameter (topic 1) | Density parameter |
|---|---|
| mean $\bar x$ | mean $\mu = E(X)$ |
| deviation $s$ | deviation $\sigma$ |
| lower quartile $Q_1$ | $q_{0.25}$ |
| median $x_{med}$ | $q_{0.5}$ |
| upper quartile $Q_3$ | $q_{0.75}$ |
| IQR | $q_{0.75} - q_{0.25}$ |

::: example own | Median for f(x) = x²/9
$F(m) = \frac{m^3}{27} = 0.5 \Rightarrow m = \sqrt[3]{13.5}\approx 2.381$. Here the median is **larger** than the mean (2.25), because the density grows to the right and has a long tail to the left (negative skew).
:::

# Standardisation

::: def W04a | Standardised variable
$$Z = \frac{X - \mu}{\sigma}\qquad\Rightarrow\qquad E(Z) = 0,\quad V(Z) = 1$$
Proof: $E(Z) = \frac1\sigma(E X - \mu) = 0$, $\;V(Z) = \frac{1}{\sigma^2}V(X) = 1$.
:::

Standardisation tells you **how many standard deviations** a value lies from the mean. Thanks to it one table of the normal distribution is enough (topic 5).

# Chebyshev’s inequality

::: formula W04a | Chebyshev’s inequality
For any variable with mean $\mu$ and variance $\sigma^2$ and any $\varepsilon>0$:
$$P(|X-\mu|\ge\varepsilon) \le \frac{\sigma^2}{\varepsilon^2}$$
:::

::: example own | What does it give?
For $\varepsilon = 2\sigma$: $P(|X-\mu|\ge2\sigma)\le\frac14$ — **for every distribution** at most 25% of the values lie further than $2\sigma$ from the mean. For the normal distribution it is actually only about 4.6% — the inequality is “cautious”, but always works.
:::

# In Excel and Python

Integrals are done on paper. Excel helps to check the result — e.g. numerical integration with the trapezoidal rule:

~~~excel Numerical integral ∫₀³ x²/9 dx (grid x in A2:A302, step 0.01)
A2: 0                      // then A3: =A2+0.01 and fill down to A302 (x = 3)
B2: =A2^2/9                // f(x); fill down
C3: =(B2+B3)/2*(A3-A2)     // trapezoid area; fill from C3 to C302
E1: =SUM(C3:C302)          // ≈ 1 (checks the constant c)
~~~

~~~python Integrals and quantiles symbolically (sympy) and numerically
import sympy as sp
x, c = sp.symbols('x c', positive=True)
f = c * x**2
c_val = sp.solve(sp.integrate(f, (x, 0, 3)) - 1, c)[0]      # 1/9
f = f.subs(c, c_val)
F = sp.integrate(f, (x, 0, x))                              # x**3/27
EX = sp.integrate(x * f, (x, 0, 3))                         # 9/4
VX = sp.integrate(x**2 * f, (x, 0, 3)) - EX**2              # 27/80
print(c_val, F, EX, VX, sp.nsolve(F - sp.Rational(1, 2), x, 2))   # median ≈ 2.381
~~~

::: summary
- Density $f\ge0$, $\int f = 1$; $P(a\le X\le b) = \int_a^b f = F(b)-F(a)$; $P(X=c)=0$.
- $F(x) = \int_{-\infty}^x f$, $F' = f$; $F$ continuous, non-decreasing.
- $E(X) = \int xf$, $V(X) = \int x^2f - (EX)^2$.
- Quantile: $F(q_p)=p$; median $q_{0.5}$, quartiles $q_{0.25}$, $q_{0.75}$.
- Standardisation $Z=(X-\mu)/\sigma$; Chebyshev $P(|X-\mu|\ge\varepsilon)\le\sigma^2/\varepsilon^2$.
:::
`,

    cheatsheet: md`
## Density and CDF
- $f(x)\ge0$, $\int_{-\infty}^{\infty}f=1$ → find the constant
- $F(x)=\int_{-\infty}^{x}f(s)\,ds$; $F'=f$; $F$ continuous, from 0 to 1
- $P(a<X<b)=P(a\le X\le b)=F(b)-F(a)=\int_a^b f$; $P(X=c)=0$
- $P(X>a)=1-F(a)$; $P(|X-m|<d) = F(m+d)-F(m-d)$

## Parameters
$$E(X)=\int xf(x)dx \qquad E(X^2)=\int x^2f(x)dx \qquad V=E(X^2)-(EX)^2$$
- $E(aX+b)=aEX+b$, $V(aX+b)=a^2VX$
- quantile: $F(q_p)=p$; median: $F(m)=0.5$
- $Z=(X-\mu)/\sigma$: $EZ=0$, $VZ=1$
- Chebyshev: $P(|X-\mu|\ge\varepsilon)\le\sigma^2/\varepsilon^2$

## CDF of a piecewise density
On every interval: $F(x) = F(\text{start}) + \int_{\text{start}}^{x} f$. Check: $F$ at the end = 1, no jumps.

## Integrals that keep coming back
$\int x^n dx = \frac{x^{n+1}}{n+1}$ · $\int_0^\infty x^n e^{-x}dx = n!$ · $\int x e^{-x}dx = -(x+1)e^{-x}$
`,

    exercises: [
      {
        id: 'e1', tag: 'C05', title: 'A constant density on an interval',
        text: md`
$X$ has density $f(x) = A$ for $x\in[-1; 4]$ and $f(x)=0$ outside.
a) What is $A$?
b) Find the CDF and sketch it.
c) Compute $P(X\le 2)$, $P(X>0)$, $P(X=1)$, $P(-3\le X\le 1)$.
d) Interpret these probabilities on the density and CDF plots.
`,
        hint: md`The area of a rectangle with base 5 must be 1. Part of $[-3; 1]$ lies outside the support — there $f=0$.`,
        solution: md`
**a)** $A\cdot 5 = 1 \Rightarrow A = \frac15$.

**b)** $F(x) = 0$ for $x<-1$; $F(x) = \frac{x+1}{5}$ for $-1\le x\le4$; $F(x)=1$ for $x>4$ (a straight line from 0 to 1).

**c)**
- $P(X\le2) = F(2) = \frac35$
- $P(X>0) = 1 - F(0) = \frac45$
- $P(X=1) = 0$ (continuous variable)
- $P(-3\le X\le1) = F(1)-F(-3) = \frac25$

**d)** On the density plot these are **areas of rectangles** of height $\frac15$ over the intervals. On the CDF plot — **differences of the heights** of $F$ at the interval ends; $P(X=1)$ would be a jump at 1, and there is none (no jump = 0).
`,
        answer: md`$A=\frac15$; $P(X\le2)=0.6$; $P(X>0)=0.8$; $P(X=1)=0$; $P(-3\le X\le1)=0.4$.`
      },
      {
        id: 'e2', tag: 'C05', title: 'The sign trap',
        text: md`
For which $A$ is $f(x) = A(x-3)$ for $x\in[1; 3]$ (and $0$ outside) a density? Find the CDF.
`,
        hint: md`On $[1;3]$ we have $x-3\le0$. For $f\ge0$ the constant must be **negative**.`,
        solution: md`
$\int_1^3 (x-3)\,dx = \left[\frac{x^2}{2}-3x\right]_1^3 = (4.5-9)-(0.5-3) = -2$, so $A\cdot(-2) = 1 \Rightarrow A = -\frac12$.
Hence $f(x) = \frac{3-x}{2}\ge0$ on $[1;3]$ ✓.

$$F(x) = \int_1^x\frac{3-s}{2}ds = \frac{6x - x^2 - 5}{4}\quad (1\le x\le3),$$
$F(x)=0$ for $x<1$, $F(x) = 1$ for $x>3$. Check: $F(1) = 0$, $F(3) = \frac{18-9-5}{4} = 1$ ✓.
`,
        answer: md`$A=-\frac12$; $F(x)=\frac{6x-x^2-5}{4}$ on $[1;3]$.`
      },
      {
        id: 'e3', tag: 'C05', title: 'A two-piece density',
        text: md`
$X$ has density $f(x) = \frac14$ for $x\in[-2;0)$, $f(x) = x$ for $x\in[0;1]$ and $f(x)=0$ outside $[-2;1]$.
a) Find the CDF.
b) Compute $P\left(\left|X-\frac14\right|<\frac12\right)$.
c) Find $E(X)$, the median and the standard deviation.
`,
        hint: md`On $[0;1]$ the CDF starts at $F(0) = 2\cdot\frac14 = \frac12$. The condition $|X-\frac14|<\frac12$ is the interval $(-\frac14; \frac34)$.`,
        solution: md`
**a)**
$$F(x) = \begin{cases}0 & x<-2\\ \frac{x+2}{4} & -2\le x<0\\ \frac12 + \frac{x^2}{2} & 0\le x\le 1\\ 1 & x>1\end{cases}$$

**b)** $P(-\tfrac14<X<\tfrac34) = F(\tfrac34)-F(-\tfrac14) = \left(\frac12+\frac{9}{32}\right) - \frac{7}{16} = \frac{11}{32}\approx0.344$.

@chart exPiece

**c)** $E(X) = \int_{-2}^0\frac x4dx + \int_0^1 x^2dx = -\frac12+\frac13 = -\frac16$.
$E(X^2) = \frac23+\frac14 = \frac{11}{12}$; $V(X) = \frac{11}{12}-\frac1{36} = \frac89$, $\sigma = \frac{2\sqrt2}{3}\approx0.943$.
Median: $F(0) = \frac12$, so **the median = 0**.
`,
        answer: md`$P=\frac{11}{32}$; $E(X)=-\frac16$; median $=0$; $\sigma\approx0.943$.`
      },
      {
        id: 'e4', tag: 'C05', title: 'From the CDF to the density',
        text: md`
The CDF of $X$: $F(x) = 0$ for $x<2$, $F(x) = \frac{x-2}{8}$ for $2\le x<10$, $F(x) = 1$ for $x\ge10$.
a) Find the density.
b) Compute $P(|X-6|>3)$.
c) Find $E(X)$ and the standard deviation.
`,
        hint: md`$f = F'$. $|X-6|>3$ means $X<3$ or $X>9$.`,
        solution: md`
**a)** $f(x) = \frac18$ on $[2;10]$, 0 outside — a uniform distribution.

**b)** $P(X<3) + P(X>9) = F(3) + 1 - F(9) = \frac18 + \frac18 = \frac14$.

**c)** $E(X) = \int_2^{10}\frac x8dx = 6$; $E(X^2) = \frac{1000-8}{24} = 41.33$; $V = 5.33 = \frac{64}{12}$, $\sigma = \frac{8}{\sqrt{12}}\approx2.309$.
`,
        answer: md`$f=\frac18$ on $[2;10]$; $P=\frac14$; $E(X)=6$; $\sigma\approx2.31$.`
      },
      {
        id: 'e5', tag: 'C05', title: 'Lifetime of a device',
        text: md`
The failure-free working time of a device (years) has density $f(x) = c\,x\,e^{-x}$ for $x>0$ and $0$ for $x\le0$. Find $c$, the probability that the device works **at least 3 years**, and the mean working time.
`,
        hint: md`Integrate by parts: $\int x e^{-x}dx = -(x+1)e^{-x}$. Also useful: $\int_0^\infty x^n e^{-x}dx = n!$.`,
        solution: md`
$\int_0^\infty x e^{-x}dx = 1! = 1 \Rightarrow c = 1$.

$$P(X\ge3) = \int_3^\infty xe^{-x}dx = \Big[-(x+1)e^{-x}\Big]_3^\infty = 4e^{-3}\approx 0.199$$

@chart exDisk

$E(X) = \int_0^\infty x^2e^{-x}dx = 2! = 2$ years.
`,
        answer: md`$c=1$; $P(X\ge3)=4e^{-3}\approx0.199$; $E(X)=2$ years.`
      },
      {
        id: 'e6', own: true, title: 'Quantiles and Chebyshev’s inequality',
        text: md`
$X$ has density $f(x) = 2x$ on $[0;1]$. Find the median and the 0.9-quantile. Compute $E(X)$, $\sigma$, and compare Chebyshev’s bound for $P(|X-E X|\ge0.4)$ with the exact value.
`,
        hint: md`$F(x) = x^2$. The inequality: $P\le\sigma^2/\varepsilon^2$.`,
        solution: md`
$F(x) = x^2$ on $[0;1]$. Median: $m^2 = 0.5\Rightarrow m\approx0.707$; $q_{0.9} = \sqrt{0.9}\approx0.949$.
$E(X) = \frac23$, $E(X^2) = \frac12$, $V = \frac1{18}$, $\sigma\approx0.236$.

Chebyshev: $P(|X-\frac23|\ge0.4)\le\dfrac{1/18}{0.16}\approx0.347$.
Exactly: $X\le0.2667$ (as $X\ge1.0667$ is impossible): $0.2667^2\approx0.071$.
The bound is true but very “generous” — in exchange it works for **every** distribution.
`,
        answer: md`Me ≈ 0.707; $q_{0.9}\approx0.949$; $E=\frac23$; $\sigma\approx0.236$; Chebyshev ≤ 0.347, exact ≈ 0.071.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'Время, вес, напряжение — «непрерывные» величины. Для них вероятность — это **площадь под графиком плотности**. Научимся находить функцию распределения, среднее, дисперсию и квантили.',
    lecture: md`
# От гистограммы к плотности

Возьмите очень много независимых измерений непрерывного признака и постройте **нормированную гистограмму** (высота столбика = частота / ширина класса, сумма площадей = 1). Когда число измерений растёт, а классы сужаются, полигон частот становится гладким и приближается к идеальной кривой — **плотности** признака. {lecture:W04a}

@chart histDensity

Для большой выборки:
$$\text{частота наблюдений в интервале} \approx \text{площадь под плотностью над этим интервалом}$$

# Плотность и функция распределения

::: def | Непрерывная случайная величина
$X$ **непрерывна**, если существует неотрицательная функция $f$ (**плотность**) такая, что при любых $a\le b$:
$$P(a\le X\le b) = \int_a^b f(x)\,dx.$$
**Функция распределения**: $F(x) = P(X\le x) = \displaystyle\int_{-\infty}^{x} f(s)\,ds$. {lecture:W04a}
:::

::: formula | Условия и связи
$$f(x)\ge0,\qquad \int_{-\infty}^{\infty} f(x)\,dx = 1,\qquad F'(x) = f(x)\ \text{(где } f \text{ непрерывна)}$$
$$P(X = c) = 0\ \text{ для любого } c$$
:::

::: intuition
«Какова вероятность, что рост человека **ровно** 175,000000… см?» — ответ 0: у точки нулевая ширина, значит нулевая площадь. Осмысленные вопросы — про **интервалы**: «от 170 до 180 см».
:::

::: tip
Раз $P(X=c)=0$, для непрерывной величины **нет разницы** между $<$ и $\le$: $P(a<X<b) = P(a\le X\le b) = F(b) - F(a)$. (Для дискретных эта разница важна!)
:::

::: steps | Типичная задача: плотность с параметром
1. **Константа**: из условия $\int f = 1$ найдите параметр (и проверьте $f\ge0$!).
2. **Функция распределения**: $F(x) = \int_{-\infty}^x f$ — отдельно на каждом промежутке; в конце $F=1$.
3. **Вероятности**: $P(a<X<b) = F(b)-F(a)$ (или интеграл от $f$).
4. **График**: у $f$ могут быть скачки, $F$ всегда непрерывна и не убывает.
:::

::: example own | f(x) = c·x² на [0; 3]
1. $\int_0^3 cx^2dx = c\cdot\frac{27}{3} = 9c = 1 \Rightarrow c = \frac19$.
2. $F(x) = 0$ при $x<0$; $F(x) = \int_0^x \frac{s^2}{9}ds = \frac{x^3}{27}$ при $0\le x\le3$; $F(x)=1$ при $x>3$.
3. $P(1\le X\le2) = F(2)-F(1) = \frac{8-1}{27} = \frac7{27}\approx0{,}259$.
:::

@chart density1

@chart cdf1

# Математическое ожидание и дисперсия

::: formula | Непрерывная величина
$$E(X) = \int_{-\infty}^{\infty} x\,f(x)\,dx,\qquad E[g(X)] = \int_{-\infty}^{\infty} g(x)\,f(x)\,dx$$
$$V(X) = E(X^2) - (EX)^2,\qquad \sigma = \sqrt{V(X)}$$
Всё как в дискретном случае, только **сумма → интеграл**, а $p_i$ → $f(x)\,dx$.
:::

$E(X)$ — **центр тяжести** фигуры между графиком плотности и осью OX. Свойства: $E(aX+b) = aE(X)+b$, $V(aX+b) = a^2V(X)$. {lecture:W04a}

::: example own | продолжение: f(x) = x²/9
$$E(X) = \int_0^3 x\cdot\frac{x^2}{9}dx = \frac19\cdot\frac{81}{4} = 2{,}25,\qquad E(X^2) = \int_0^3\frac{x^4}{9}dx = \frac19\cdot\frac{243}{5} = 5{,}4$$
$$V(X) = 5{,}4 - 2{,}25^2 = 0{,}3375,\qquad \sigma\approx0{,}581$$
:::

# Квантили, медиана, квартили

::: def | Квантиль порядка p
При $0<p<1$ **квантиль порядка $p$** — такая точка $q_p$, что **площадь под плотностью слева от неё равна $p$**:
$$F(q_p) = p\qquad\Longleftrightarrow\qquad \int_{-\infty}^{q_p} f(x)\,dx = p.$$
{lecture:W04a}
:::

@chart quantile

| Параметр выборки (тема 1) | Параметр плотности |
|---|---|
| среднее $\bar x$ | среднее $\mu = E(X)$ |
| отклонение $s$ | отклонение $\sigma$ |
| нижний квартиль $Q_1$ | $q_{0{,}25}$ |
| медиана $x_{med}$ | $q_{0{,}5}$ |
| верхний квартиль $Q_3$ | $q_{0{,}75}$ |
| IQR | $q_{0{,}75} - q_{0{,}25}$ |

::: example own | Медиана для f(x) = x²/9
$F(m) = \frac{m^3}{27} = 0{,}5 \Rightarrow m = \sqrt[3]{13{,}5}\approx 2{,}381$. Здесь медиана **больше** среднего (2,25), потому что плотность растёт вправо и имеет длинный «хвост» влево (отрицательная асимметрия).
:::

# Стандартизация

::: def W04a | Стандартизованная величина
$$Z = \frac{X - \mu}{\sigma}\qquad\Rightarrow\qquad E(Z) = 0,\quad V(Z) = 1$$
Доказательство: $E(Z) = \frac1\sigma(E X - \mu) = 0$, $\;V(Z) = \frac{1}{\sigma^2}V(X) = 1$.
:::

Стандартизация показывает, **на сколько стандартных отклонений** значение отстоит от среднего. Благодаря ей хватает одной таблицы нормального распределения (тема 5).

# Неравенство Чебышёва

::: formula W04a | Неравенство Чебышёва
Для любой величины со средним $\mu$ и дисперсией $\sigma^2$ и любого $\varepsilon>0$:
$$P(|X-\mu|\ge\varepsilon) \le \frac{\sigma^2}{\varepsilon^2}$$
:::

::: example own | Что это даёт?
При $\varepsilon = 2\sigma$: $P(|X-\mu|\ge2\sigma)\le\frac14$ — **для любого распределения** не больше 25% значений лежат дальше $2\sigma$ от среднего. Для нормального распределения на самом деле всего около 4,6% — неравенство «осторожное», зато работает всегда.
:::

# В Excel и Python

Интегралы считаем на бумаге. Excel поможет проверить ответ — например, численным интегрированием методом трапеций:

~~~excel Численный интеграл ∫₀³ x²/9 dx (сетка x в A2:A302, шаг 0,01)
A2: 0                      // затем A3: =A2+0.01 и протяните до A302 (x = 3)
B2: =A2^2/9                // f(x); протяните
C3: =(B2+B3)/2*(A3-A2)     // площадь трапеции; протяните от C3 до C302
E1: =SUM(C3:C302)          // ≈ 1 (проверка константы c)
~~~

~~~python Интегралы и квантили символьно (sympy) и численно
import sympy as sp
x, c = sp.symbols('x c', positive=True)
f = c * x**2
c_val = sp.solve(sp.integrate(f, (x, 0, 3)) - 1, c)[0]      # 1/9
f = f.subs(c, c_val)
F = sp.integrate(f, (x, 0, x))                              # x**3/27
EX = sp.integrate(x * f, (x, 0, 3))                         # 9/4
VX = sp.integrate(x**2 * f, (x, 0, 3)) - EX**2              # 27/80
print(c_val, F, EX, VX, sp.nsolve(F - sp.Rational(1, 2), x, 2))   # медиана ≈ 2.381
~~~

::: summary
- Плотность $f\ge0$, $\int f = 1$; $P(a\le X\le b) = \int_a^b f = F(b)-F(a)$; $P(X=c)=0$.
- $F(x) = \int_{-\infty}^x f$, $F' = f$; $F$ непрерывна, не убывает.
- $E(X) = \int xf$, $V(X) = \int x^2f - (EX)^2$.
- Квантиль: $F(q_p)=p$; медиана $q_{0{,}5}$, квартили $q_{0{,}25}$, $q_{0{,}75}$.
- Стандартизация $Z=(X-\mu)/\sigma$; Чебышёв $P(|X-\mu|\ge\varepsilon)\le\sigma^2/\varepsilon^2$.
:::
`,

    cheatsheet: md`
## Плотность и функция распределения
- $f(x)\ge0$, $\int_{-\infty}^{\infty}f=1$ → найдите константу
- $F(x)=\int_{-\infty}^{x}f(s)\,ds$; $F'=f$; $F$ непрерывна, от 0 до 1
- $P(a<X<b)=P(a\le X\le b)=F(b)-F(a)=\int_a^b f$; $P(X=c)=0$
- $P(X>a)=1-F(a)$; $P(|X-m|<d) = F(m+d)-F(m-d)$

## Параметры
$$E(X)=\int xf(x)dx \qquad E(X^2)=\int x^2f(x)dx \qquad V=E(X^2)-(EX)^2$$
- $E(aX+b)=aEX+b$, $V(aX+b)=a^2VX$
- квантиль: $F(q_p)=p$; медиана: $F(m)=0{,}5$
- $Z=(X-\mu)/\sigma$: $EZ=0$, $VZ=1$
- Чебышёв: $P(|X-\mu|\ge\varepsilon)\le\sigma^2/\varepsilon^2$

## Функция распределения для «кусочной» плотности
На каждом промежутке: $F(x) = F(\text{начало}) + \int_{\text{начало}}^{x} f$. Проверка: в конце $F = 1$, скачков нет.

## Интегралы, которые часто встречаются
$\int x^n dx = \frac{x^{n+1}}{n+1}$ · $\int_0^\infty x^n e^{-x}dx = n!$ · $\int x e^{-x}dx = -(x+1)e^{-x}$
`,

    exercises: [
      {
        id: 'e1', tag: 'C05', title: 'Постоянная плотность на отрезке',
        text: md`
Величина $X$ имеет плотность $f(x) = A$ при $x\in[-1; 4]$ и $f(x)=0$ вне отрезка.
а) Чему равно $A$?
б) Найдите функцию распределения и нарисуйте её график.
в) Найдите $P(X\le 2)$, $P(X>0)$, $P(X=1)$, $P(-3\le X\le 1)$.
г) Проинтерпретируйте эти вероятности на графиках плотности и функции распределения.
`,
        hint: md`Площадь прямоугольника с основанием 5 должна быть 1. Часть отрезка $[-3; 1]$ лежит вне носителя — там $f=0$.`,
        solution: md`
**а)** $A\cdot 5 = 1 \Rightarrow A = \frac15$.

**б)** $F(x) = 0$ при $x<-1$; $F(x) = \frac{x+1}{5}$ при $-1\le x\le4$; $F(x)=1$ при $x>4$ (прямая от 0 до 1).

**в)**
- $P(X\le2) = F(2) = \frac35$
- $P(X>0) = 1 - F(0) = \frac45$
- $P(X=1) = 0$ (непрерывная величина)
- $P(-3\le X\le1) = F(1)-F(-3) = \frac25$

**г)** На графике плотности это **площади прямоугольников** высотой $\frac15$ над интервалами. На графике функции распределения — **разности высот** $F$ на концах интервалов; $P(X=1)$ — это скачок в точке 1, а его нет (нет скачка = 0).
`,
        answer: md`$A=\frac15$; $P(X\le2)=0{,}6$; $P(X>0)=0{,}8$; $P(X=1)=0$; $P(-3\le X\le1)=0{,}4$.`
      },
      {
        id: 'e2', tag: 'C05', title: 'Ловушка со знаком константы',
        text: md`
При каком $A$ функция $f(x) = A(x-3)$ при $x\in[1; 3]$ (и $0$ вне отрезка) является плотностью? Найдите функцию распределения.
`,
        hint: md`На $[1;3]$ имеем $x-3\le0$. Чтобы $f\ge0$, константа должна быть **отрицательной**.`,
        solution: md`
$\int_1^3 (x-3)\,dx = \left[\frac{x^2}{2}-3x\right]_1^3 = (4{,}5-9)-(0{,}5-3) = -2$, значит $A\cdot(-2) = 1 \Rightarrow A = -\frac12$.
Итак, $f(x) = \frac{3-x}{2}\ge0$ на $[1;3]$ ✓.

$$F(x) = \int_1^x\frac{3-s}{2}ds = \frac{6x - x^2 - 5}{4}\quad (1\le x\le3),$$
$F(x)=0$ при $x<1$, $F(x) = 1$ при $x>3$. Проверка: $F(1) = 0$, $F(3) = \frac{18-9-5}{4} = 1$ ✓.
`,
        answer: md`$A=-\frac12$; $F(x)=\frac{6x-x^2-5}{4}$ на $[1;3]$.`
      },
      {
        id: 'e3', tag: 'C05', title: 'Плотность из двух кусков',
        text: md`
Величина $X$ имеет плотность $f(x) = \frac14$ при $x\in[-2;0)$, $f(x) = x$ при $x\in[0;1]$ и $f(x)=0$ вне $[-2;1]$.
а) Найдите функцию распределения.
б) Найдите $P\left(\left|X-\frac14\right|<\frac12\right)$.
в) Найдите $E(X)$, медиану и стандартное отклонение.
`,
        hint: md`На $[0;1]$ функция распределения начинается с $F(0) = 2\cdot\frac14 = \frac12$. Условие $|X-\frac14|<\frac12$ — это интервал $(-\frac14; \frac34)$.`,
        solution: md`
**а)**
$$F(x) = \begin{cases}0 & x<-2\\ \frac{x+2}{4} & -2\le x<0\\ \frac12 + \frac{x^2}{2} & 0\le x\le 1\\ 1 & x>1\end{cases}$$

**б)** $P(-\tfrac14<X<\tfrac34) = F(\tfrac34)-F(-\tfrac14) = \left(\frac12+\frac{9}{32}\right) - \frac{7}{16} = \frac{11}{32}\approx0{,}344$.

@chart exPiece

**в)** $E(X) = \int_{-2}^0\frac x4dx + \int_0^1 x^2dx = -\frac12+\frac13 = -\frac16$.
$E(X^2) = \frac23+\frac14 = \frac{11}{12}$; $V(X) = \frac{11}{12}-\frac1{36} = \frac89$, $\sigma = \frac{2\sqrt2}{3}\approx0{,}943$.
Медиана: $F(0) = \frac12$, значит **медиана = 0**.
`,
        answer: md`$P=\frac{11}{32}$; $E(X)=-\frac16$; медиана $=0$; $\sigma\approx0{,}943$.`
      },
      {
        id: 'e4', tag: 'C05', title: 'От функции распределения к плотности',
        text: md`
Функция распределения $X$: $F(x) = 0$ при $x<2$, $F(x) = \frac{x-2}{8}$ при $2\le x<10$, $F(x) = 1$ при $x\ge10$.
а) Найдите плотность.
б) Найдите $P(|X-6|>3)$.
в) Найдите $E(X)$ и стандартное отклонение.
`,
        hint: md`$f = F'$. $|X-6|>3$ означает $X<3$ или $X>9$.`,
        solution: md`
**а)** $f(x) = \frac18$ на $[2;10]$, 0 вне — равномерное распределение.

**б)** $P(X<3) + P(X>9) = F(3) + 1 - F(9) = \frac18 + \frac18 = \frac14$.

**в)** $E(X) = \int_2^{10}\frac x8dx = 6$; $E(X^2) = \frac{1000-8}{24} = 41{,}33$; $V = 5{,}33 = \frac{64}{12}$, $\sigma = \frac{8}{\sqrt{12}}\approx2{,}309$.
`,
        answer: md`$f=\frac18$ на $[2;10]$; $P=\frac14$; $E(X)=6$; $\sigma\approx2{,}31$.`
      },
      {
        id: 'e5', tag: 'C05', title: 'Время жизни устройства',
        text: md`
Время безотказной работы устройства (в годах) имеет плотность $f(x) = c\,x\,e^{-x}$ при $x>0$ и $0$ при $x\le0$. Найдите $c$, вероятность того, что устройство проработает **не меньше 3 лет**, и среднее время работы.
`,
        hint: md`Интегрируйте по частям: $\int x e^{-x}dx = -(x+1)e^{-x}$. Пригодится и $\int_0^\infty x^n e^{-x}dx = n!$.`,
        solution: md`
$\int_0^\infty x e^{-x}dx = 1! = 1 \Rightarrow c = 1$.

$$P(X\ge3) = \int_3^\infty xe^{-x}dx = \Big[-(x+1)e^{-x}\Big]_3^\infty = 4e^{-3}\approx 0{,}199$$

@chart exDisk

$E(X) = \int_0^\infty x^2e^{-x}dx = 2! = 2$ года.
`,
        answer: md`$c=1$; $P(X\ge3)=4e^{-3}\approx0{,}199$; $E(X)=2$ года.`
      },
      {
        id: 'e6', own: true, title: 'Квантили и неравенство Чебышёва',
        text: md`
$X$ имеет плотность $f(x) = 2x$ на $[0;1]$. Найдите медиану и квантиль порядка 0,9. Найдите $E(X)$, $\sigma$ и сравните оценку Чебышёва для $P(|X-E X|\ge0{,}4)$ с точным значением.
`,
        hint: md`$F(x) = x^2$. Неравенство: $P\le\sigma^2/\varepsilon^2$.`,
        solution: md`
$F(x) = x^2$ на $[0;1]$. Медиана: $m^2 = 0{,}5\Rightarrow m\approx0{,}707$; $q_{0{,}9} = \sqrt{0{,}9}\approx0{,}949$.
$E(X) = \frac23$, $E(X^2) = \frac12$, $V = \frac1{18}$, $\sigma\approx0{,}236$.

Чебышёв: $P(|X-\frac23|\ge0{,}4)\le\dfrac{1/18}{0{,}16}\approx0{,}347$.
Точно: $X\le0{,}2667$ (так как $X\ge1{,}0667$ невозможно): $0{,}2667^2\approx0{,}071$.
Оценка верна, но с большим «запасом» — зато работает для **любого** распределения.
`,
        answer: md`Me ≈ 0,707; $q_{0{,}9}\approx0{,}949$; $E=\frac23$; $\sigma\approx0{,}236$; Чебышёв ≤ 0,347, точно ≈ 0,071.`
      }
    ]
  };

  SAD.registerTopic('t04', { charts: charts, pl: pl, en: en, ru: ru });
})();
