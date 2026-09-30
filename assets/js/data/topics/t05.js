/* Topic 5 — Uniform, normal and exponential distributions (lecture W04b, classes C06) */
(function () {
  var md = SAD.md;

  var charts = {
    unifPdf: { type: 'pdf', dist: { name: 'unif', a: 1, b: 3 }, range: [0, 4], steps: 400, ymax: 0.7, xLabel: 'x', yLabel: 'f(x)',
      shade: [{ from: 1.5, to: 2, label: '0,25' }],
      caption: { pl: 'U(1, 3): gęstość 1/(b − a) = 0,5; każdy przedział długości 0,5 ma prawdopodobieństwo 0,25', en: 'U(1, 3): density 1/(b − a) = 0.5; every interval of length 0.5 has probability 0.25', ru: 'U(1, 3): плотность 1/(b − a) = 0,5; любой интервал длины 0,5 имеет вероятность 0,25' } },
    unifCdf: { type: 'cdf', dist: { name: 'unif', a: 1, b: 3 }, range: [0, 4], xLabel: 'x',
      caption: { pl: 'Dystrybuanta U(1, 3): odcinek prostej od 0 do 1', en: 'CDF of U(1, 3): a straight segment from 0 to 1', ru: 'Функция распределения U(1, 3): отрезок прямой от 0 до 1' } },
    normSigma: { type: 'pdf', range: [-3, 7], xLabel: 'x', yLabel: 'f(x)',
      curves: [{ dist: { name: 'normal', mu: 2, sigma: 0.5 }, label: 'σ = 0,5' }, { dist: { name: 'normal', mu: 2, sigma: 1 }, label: 'σ = 1' }, { dist: { name: 'normal', mu: 2, sigma: 2 }, label: 'σ = 2' }],
      caption: { pl: 'N(2, σ): im większe σ, tym niższy i szerszy dzwon (pole zawsze = 1)', en: 'N(2, σ): the larger σ, the lower and wider the bell (area always = 1)', ru: 'N(2, σ): чем больше σ, тем ниже и шире колокол (площадь всегда = 1)' } },
    normMu: { type: 'pdf', range: [-3, 7], xLabel: 'x', yLabel: 'f(x)',
      curves: [{ dist: { name: 'normal', mu: 1, sigma: 1 }, label: 'μ = 1' }, { dist: { name: 'normal', mu: 2, sigma: 1 }, label: 'μ = 2' }, { dist: { name: 'normal', mu: 3, sigma: 1 }, label: 'μ = 3' }],
      caption: { pl: 'N(μ, 1): μ przesuwa krzywą, nie zmieniając kształtu', en: 'N(μ, 1): μ shifts the curve without changing its shape', ru: 'N(μ, 1): μ сдвигает кривую, не меняя формы' } },
    phiArea: { type: 'pdf', dist: { name: 'normal', mu: 0, sigma: 1 }, range: [-3.5, 3.5],
      shade: [{ from: -3.5, to: 1.25, label: { pl: 'Φ(1,25) = 0,8944', en: 'Φ(1.25) = 0.8944', ru: 'Φ(1,25) = 0,8944' } }], markers: [{ x: 1.25, label: 'z = 1,25' }],
      caption: { pl: 'Φ(z) = pole pod krzywą N(0,1) na lewo od z — to właśnie podają tablice', en: 'Φ(z) = area under the N(0,1) curve to the left of z — that is what the tables give', ru: 'Φ(z) = площадь под кривой N(0,1) слева от z — это и дают таблицы' } },
    twoSided: { type: 'pdf', dist: { name: 'normal', mu: 0, sigma: 1 }, range: [-3.5, 3.5],
      shade: [{ from: -3.5, to: -1.96, cls: '2', label: '2,5%', labelX: -2.6, labelY: 0.05 }, { from: 1.96, to: 3.5, cls: '2', label: '2,5%', labelX: 2.6, labelY: 0.05 }],
      markers: [{ x: -1.96, label: '−1,96' }, { x: 1.96, label: '1,96' }],
      caption: { pl: 'P(|U| > 1,96) = 0,05: po 2,5% w każdym ogonie', en: 'P(|U| > 1.96) = 0.05: 2.5% in each tail', ru: 'P(|U| > 1,96) = 0,05: по 2,5% в каждом хвосте' } },
    expPdf: { type: 'pdf', range: [0, 5], xLabel: 'x', yLabel: 'f(x)',
      curves: [{ dist: { name: 'exp', lambda: 0.5 }, label: 'λ = 0,5' }, { dist: { name: 'exp', lambda: 1 }, label: 'λ = 1' }, { dist: { name: 'exp', lambda: 2 }, label: 'λ = 2' }],
      caption: { pl: 'Gęstości rozkładu wykładniczego: im większe λ, tym szybciej „zdarzenie” następuje (średnio po 1/λ)', en: 'Exponential densities: the larger λ, the sooner the “event” happens (on average after 1/λ)', ru: 'Плотности показательного распределения: чем больше λ, тем быстрее наступает «событие» (в среднем через 1/λ)' } },

    exIQ: { type: 'pdf', dist: { name: 'normal', mu: 65, sigma: 12 }, range: [20, 110],
      shade: [{ from: 60, to: 75, label: '≈ 0,46' }, { from: 80, to: 110, cls: '2', label: '≈ 0,106', labelX: 90, labelY: 0.004 }], xLabel: { pl: 'punkty', en: 'points', ru: 'баллы' } },
    exWater: { type: 'pdf', range: [475, 530], xLabel: 'ml',
      curves: [{ dist: { name: 'normal', mu: 505, sigma: 6 }, label: 'μ = 505' }, { dist: { name: 'normal', mu: 503, sigma: 6 }, label: 'μ = 503', dashed: true }],
      markers: [{ x: 490, label: '490' }, { x: 480, label: '480' }] }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Trzy rozkłady ciągłe, które spotkasz na każdym kroku: **jednostajny** (każda wartość równie możliwa), **normalny** (krzywa Gaussa) i **wykładniczy** (czas oczekiwania, brak pamięci).',
    lecture: md`
# Rozkład jednostajny U(a, b)

::: def W04b | Rozkład jednostajny na [a, b]
$X\sim U(a,b)$, gdy gęstość jest **stała** na $[a,b]$:
$$f(x) = \begin{cases}\dfrac{1}{b-a} & a\le x\le b\\[4pt] 0 & \text{poza}\end{cases}\qquad F(x) = \begin{cases}0 & x<a\\ \dfrac{x-a}{b-a} & a\le x<b\\ 1 & x\ge b\end{cases}$$
$$E(X) = \frac{a+b}{2},\qquad V(X) = \frac{(b-a)^2}{12}$$
:::

::: intuition
„Każdy moment jest równie prawdopodobny”: przychodzisz na przystanek nie znając rozkładu jazdy. Prawdopodobieństwo zależy tylko od **długości** przedziału, a nie od jego położenia: $P(X\in[c,d]) = \frac{d-c}{b-a}$.
:::

@chart unifPdf

@chart unifCdf

::: example W04b | Autobusy co 20 minut
Od 6:00 autobusy przyjeżdżają co 20 minut. Pasażer przychodzi w losowym momencie między 7:00 a 7:40 ($X\sim U$, długość 40 min).
- Czeka **mniej niż 10 min**, jeśli przyjdzie w 7:10–7:20 lub 7:30–7:40: $\frac{10}{40}+\frac{10}{40} = \frac12$.
- Czeka **co najmniej 15 min**, jeśli przyjdzie w 7:00–7:05 lub 7:20–7:25: $\frac{5}{40}+\frac5{40} = \frac14$.
:::

# Rozkład normalny N(μ, σ)

Rozkład normalny (krzywa Gaussa, „dzwon”) opisuje **błędy pomiarów** powstające z nakładania się wielu drobnych, niezależnych przyczyn. Wprowadził go de Moivre (1733); dzięki **Centralnemu Twierdzeniu Granicznemu** (temat 8) stosuje się go niemal wszędzie. {lecture:W04b}

::: def W04b | Rozkład normalny
$X\sim N(\mu,\sigma)$, $\mu\in\mathbb R$, $\sigma>0$:
$$f(x) = \frac{1}{\sqrt{2\pi}\,\sigma}\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right),\qquad E(X) = \mu,\quad V(X) = \sigma^2$$
$\mu$ — parametr **położenia** (środek dzwonu), $\sigma$ — parametr **skali** (szerokość dzwonu).
:::

::: warn
W tym przedmiocie zapis $N(\mu, \sigma)$ ma **odchylenie standardowe** jako drugi parametr (nie wariancję!). Jeśli treść podaje wariancję 225, to $\sigma = 15$.
:::

@chart normSigma

@chart normMu

## Standaryzacja i tablice Φ

::: formula W04b | Najważniejsza sztuczka
Jeśli $X\sim N(\mu,\sigma)$, to $aX+b\sim N(a\mu+b, |a|\sigma)$, w szczególności
$$U = \frac{X-\mu}{\sigma}\sim N(0,1)\qquad\text{i}\qquad F(x) = P(X\le x) = \Phi\!\left(\frac{x-\mu}{\sigma}\right)$$
gdzie $\Phi$ — dystrybuanta **standardowego** rozkładu normalnego N(0, 1).
:::

$\Phi$ nie da się wyrazić wzorem elementarnym — jej wartości liczy się numerycznie i czyta z **tablic** (albo z [kalkulatora](#/tables)). Gęstość jest symetryczna, więc tablice podają tylko $z\ge0$:
$$\Phi(-z) = 1 - \Phi(z)$$

@chart phiArea

::: steps | Jak liczyć prawdopodobieństwa dla N(μ, σ)
1. Zamień każdą granicę na $z = \dfrac{x-\mu}{\sigma}$.
2. $P(X<x) = \Phi(z)$; $\;P(X>x) = 1-\Phi(z)$; $\;P(a<X<b) = \Phi(z_b) - \Phi(z_a)$.
3. Dla ujemnych $z$: $\Phi(-z) = 1-\Phi(z)$.
4. „Ile sztuk z $N$” = $N\cdot$ prawdopodobieństwo.
:::

::: example own | Wzrost
Wzrost dorosłych mężczyzn: $X\sim N(178, 7)$ [cm]. Jaka część ma ponad 190 cm?
$z = \frac{190-178}{7}\approx 1{,}71$, $P(X>190) = 1 - \Phi(1{,}71) = 1 - 0{,}9564 = 0{,}0436$ — ok. 4,4%.
:::

## Reguła 3σ

::: example W04b | P(|X − μ| ≤ kσ)
$$P(|X-\mu|\le k\sigma) = \Phi(k)-\Phi(-k) = 2\Phi(k)-1 = \begin{cases}0{,}6826 & k=1\\ 0{,}9544 & k=2\\ 0{,}9974 & k=3\end{cases}$$
Poza przedziałem $\mu\pm3\sigma$ leży tylko 0,26% wartości — to **prawo trzech sigm**.
:::

## Kwantyle N(0, 1)

Kwantyl $z_p$: $\Phi(z_p) = p$. Najważniejsze: $z_{0{,}9} = 1{,}282$, $z_{0{,}95} = 1{,}645$, $z_{0{,}975} = 1{,}960$, $z_{0{,}99} = 2{,}326$, $z_{0{,}995} = 2{,}576$.

- $P(U>c) = \alpha \Rightarrow c = z_{1-\alpha}$ (jeden ogon),
- $P(|U|>c) = \alpha \Rightarrow c = z_{1-\alpha/2}$ (dwa ogony, po $\alpha/2$).

@chart twoSided

Kwantyl dowolnego $N(\mu,\sigma)$: $x_p = \mu + \sigma\,z_p$.

::: example own | Kwantyl w praktyce
Wzrost $N(178, 7)$: jakiego wzrostu nie przekracza 90% mężczyzn? $x_{0{,}9} = 178 + 7\cdot1{,}282 \approx 187$ cm.
:::

@widget normal-explorer

# Rozkład wykładniczy Exp(λ)

::: def W04b | Rozkład wykładniczy
$$f(x) = \begin{cases}\lambda e^{-\lambda x} & x\ge0\\ 0 & x<0\end{cases}\qquad F(x) = 1-e^{-\lambda x}\ (x\ge0),\qquad P(X>x) = e^{-\lambda x}$$
$$E(X) = \frac1\lambda,\qquad V(X) = \frac{1}{\lambda^2}$$
Opisuje **czas do zdarzenia**: czas życia elementu, czas obsługi, czas do następnego klienta.
:::

@chart expPdf

::: def W04b | Własność braku pamięci
$$P(X > s+t\mid X>t) = P(X>s)\qquad\text{dla wszystkich } s,t\ge0$$
Urządzenie, które działa już $t$ godzin, „nie pamięta” tego — szansa, że przetrwa kolejne $s$ godzin, jest taka jak dla nowego. Rozkład wykładniczy to **jedyny** ciągły rozkład z tą własnością (z równania $Q(t+s) = Q(t)Q(s)$ dla $Q(t) = P(X>t)$ wynika $Q(t) = e^{-\lambda t}$).
:::

::: example W04b | Używany samochód
Dystans do złomowania (tys. mil) ma rozkład wykładniczy z $\lambda = \frac1{20}$. Auto przejechało już 10 tys. mil. Szansa, że przejedzie jeszcze **co najmniej 20 tys.**:
$$P(X>30\mid X>10) = P(X>20) = e^{-20/20} = e^{-1}\approx0{,}368$$
Gdyby dystans miał rozkład $U(0, 40)$: $\frac{P(X>30)}{P(X>10)} = \frac{1/4}{3/4} = \frac13$ — tu przebieg **ma** znaczenie.
:::

::: formula own | Kwantyle rozkładu wykładniczego
$$F(t_p) = p \;\Rightarrow\; t_p = -\frac{\ln(1-p)}{\lambda},\qquad \text{mediana} = \frac{\ln 2}{\lambda}\approx\frac{0{,}693}{\lambda}$$
„Czas, który osiąga co najmniej 95% elementów” to $t$ z $P(X\ge t) = 0{,}95$, czyli $t = -\ln(0{,}95)/\lambda$.
:::

# W Excelu

~~~excel Rozkład normalny i wykładniczy
A1: =NORM.S.DIST(1.25,TRUE)          // Φ(1,25) = 0,8944
A2: =NORM.DIST(190,178,7,TRUE)       // P(X <= 190) dla N(178, 7)
A3: =1-NORM.DIST(190,178,7,TRUE)     // P(X > 190)
A4: =NORM.S.INV(0.975)               // z_0,975 = 1,96
A5: =NORM.INV(0.9,178,7)             // kwantyl 0,9 dla N(178, 7)
A6: =STANDARDIZE(190,178,7)          // z = (x - μ)/σ
A7: =EXPON.DIST(650,0.001,TRUE)      // P(X <= 650) dla Exp(0,001)
A8: =-LN(1-0.5)/0.001                // mediana Exp(0,001)
~~~

~~~python scipy.stats: norm, expon, uniform
from scipy.stats import norm, expon, uniform

print(norm.cdf(1.25))                    # Φ(1.25)
print(norm.sf(190, loc=178, scale=7))    # P(X > 190)
print(norm.ppf(0.975))                   # z_0.975
print(expon.sf(650, scale=1/0.001))      # P(X > 650), scale = 1/λ
print(uniform.cdf(7.5, loc=0, scale=8))  # U(0, 8): P(X <= 7.5)
~~~

::: summary
- $U(a,b)$: $f = \frac1{b-a}$, $E=\frac{a+b}2$, $V=\frac{(b-a)^2}{12}$; prawdopodobieństwo = długość/(b − a).
- $N(\mu,\sigma)$: $E=\mu$, $V=\sigma^2$; $P(X\le x)=\Phi\left(\frac{x-\mu}{\sigma}\right)$, $\Phi(-z)=1-\Phi(z)$; $x_p = \mu+\sigma z_p$.
- $\pm1\sigma$: 68,3%, $\pm2\sigma$: 95,4%, $\pm3\sigma$: 99,7%.
- $Exp(\lambda)$: $P(X>x)=e^{-\lambda x}$, $E=1/\lambda$; brak pamięci.
:::
`,

    cheatsheet: md`
## Jednostajny U(a, b)
$f=\frac1{b-a}$ · $F=\frac{x-a}{b-a}$ · $E=\frac{a+b}2$ · $V=\frac{(b-a)^2}{12}$ · $P$ = długość / $(b-a)$ · kwantyl: $a+p(b-a)$

## Normalny N(μ, σ) — σ to odchylenie!
- $z=\frac{x-\mu}{\sigma}$; $P(X<x)=\Phi(z)$; $P(X>x)=1-\Phi(z)$
- $P(a<X<b)=\Phi(z_b)-\Phi(z_a)$; $\Phi(-z)=1-\Phi(z)$
- kwantyl: $x_p=\mu+\sigma z_p$
- $P(|X-\mu|\le k\sigma)=2\Phi(k)-1$: 0,6826 / 0,9544 / 0,9974
- $P(U>c)=\alpha\Rightarrow c=z_{1-\alpha}$; $P(|U|>c)=\alpha\Rightarrow c=z_{1-\alpha/2}$

| $p$ | 0,90 | 0,95 | 0,975 | 0,99 | 0,995 |
|---|---|---|---|---|---|
| $z_p$ | 1,282 | 1,645 | 1,960 | 2,326 | 2,576 |

## Wykładniczy Exp(λ)
$F=1-e^{-\lambda x}$ · $P(X>x)=e^{-\lambda x}$ · $E=\frac1\lambda$ · $V=\frac1{\lambda^2}$ · mediana $\frac{\ln2}{\lambda}$
Brak pamięci: $P(X>s+t\mid X>t)=P(X>s)$. Średnia 2 h → $\lambda = 0{,}5$ na godzinę.

## Excel
‹NORM.S.DIST(z,TRUE)› ‹NORM.DIST(x,μ,σ,TRUE)› ‹NORM.S.INV(p)› ‹NORM.INV(p,μ,σ)› ‹EXPON.DIST(x,λ,TRUE)›
`,

    exercises: [
      {
        id: 'e1', tag: 'C06', title: 'Metro co 8 minut',
        text: md`
Pociągi metra odjeżdżają co 8 minut. Pasażer przychodzi na peron w losowym momencie (nie zna rozkładu jazdy).
1. Jakie jest prawdopodobieństwo, że poczeka co najmniej 5 minut?
2. Ile średnio czeka?
3. Wyznacz czas, dla którego czas oczekiwania ma 90% szans być krótszy.
`,
        hint: md`Czas oczekiwania $X\sim U(0, 8)$. W punkcie 3 szukasz kwantyla rzędu 0,9.`,
        solution: md`
$X\sim U(0,8)$, $F(x) = x/8$.
1. $P(X\ge5) = \frac{8-5}{8} = \frac38 = 0{,}375$.
2. $E(X) = \frac{0+8}{2} = 4$ min.
3. $F(t) = 0{,}9 \Rightarrow t = 0{,}9\cdot8 = 7{,}2$ min.
`,
        answer: md`0,375; 4 min; 7,2 min.`
      },
      {
        id: 'e2', tag: 'C06', title: 'Temperatura w marcu',
        text: md`
Temperatura w południe w marcu (°C) w pewnym mieście ma rozkład jednostajny na $[-6; 10]$.
1. Jakie jest prawdopodobieństwo, że losowego dnia temperatura przekroczy 4°C?
2. Jaka jest średnia temperatura i jej odchylenie standardowe?
`,
        hint: md`Długość przedziału: 16.`,
        solution: md`
1. $P(X>4) = \frac{10-4}{16} = \frac{6}{16} = 0{,}375$.
2. $E(X) = \frac{-6+10}{2} = 2$°C; $V(X) = \frac{16^2}{12}\approx21{,}33$, $\sigma\approx4{,}62$°C.
`,
        answer: md`0,375; średnio 2°C, $\sigma\approx4{,}62$°C.`
      },
      {
        id: 'e3', tag: 'C06', title: 'Żywotność dysku SSD',
        text: md`
Czas pracy dysku SSD (w godzinach) ma rozkład wykładniczy z parametrem $\lambda = 0{,}0002$ (1/h).
1. Ile godzin średnio pracuje dysk?
2. Jakie jest prawdopodobieństwo, że nowy dysk przepracuje co najmniej 3000 h?
3. Wyznacz czas pracy, który osiąga co najmniej (i) 50% dysków, (ii) 95% dysków.
`,
        hint: md`„Osiąga co najmniej $q$ dysków” oznacza $P(X\ge t) = q$, czyli $e^{-\lambda t} = q$.`,
        solution: md`
1. $E(X) = \frac1\lambda = 5000$ h.
2. $P(X\ge3000) = e^{-0{,}0002\cdot3000} = e^{-0{,}6}\approx0{,}549$.
3. (i) $e^{-\lambda t} = 0{,}5 \Rightarrow t = \frac{\ln2}{\lambda}\approx3466$ h (mediana); (ii) $e^{-\lambda t} = 0{,}95\Rightarrow t = -\frac{\ln0{,}95}{\lambda}\approx256{,}5$ h.

Zwróć uwagę: mediana (3466 h) jest **mniejsza** od średniej (5000 h) — rozkład wykładniczy ma długi prawy ogon.
`,
        answer: md`5000 h; ≈ 0,549; (i) ≈ 3466 h; (ii) ≈ 256,5 h.`
      },
      {
        id: 'e4', tag: 'C06', title: 'Rozmowa na infolinii — brak pamięci',
        text: md`
Czas rozmowy na infolinii ma rozkład wykładniczy, średnio 4 minuty.
a) Jakie jest prawdopodobieństwo, że rozmowa potrwa ponad 6 minut?
b) Rozmowa trwa już 10 minut. Jakie jest prawdopodobieństwo, że skończy się w ciągu najbliższych 3 minut?
`,
        hint: md`$\lambda = \frac14$ na minutę. b) Brak pamięci: przeszłe 10 minut „się nie liczy”.`,
        solution: md`
a) $P(X>6) = e^{-6/4} = e^{-1{,}5}\approx0{,}223$.
b) $P(X\le13\mid X>10) = 1 - P(X>13\mid X>10) = 1 - P(X>3) = 1-e^{-0{,}75}\approx0{,}528$.
`,
        answer: md`a) ≈ 0,223; b) ≈ 0,528.`
      },
      {
        id: 'e5', tag: 'C06', title: 'Stałe dla standardowego rozkładu normalnego',
        text: md`
Niech $U\sim N(0,1)$. Wyznacz stałe $c_1$, $c_2$, $c_3$ takie, że $P(U>c_1) = 0{,}10$, $P(|U|>c_2) = 0{,}10$, $P(U<c_3) = 0{,}025$.
`,
        hint: md`Jeden ogon → $z_{1-\alpha}$; dwa ogony → $z_{1-\alpha/2}$; lewy ogon → kwantyl ujemny.`,
        solution: md`
- $P(U>c_1) = 0{,}1 \Rightarrow \Phi(c_1) = 0{,}9 \Rightarrow c_1 = z_{0{,}9}\approx1{,}282$.
- $P(|U|>c_2) = 0{,}1$ → po 0,05 w każdym ogonie → $\Phi(c_2) = 0{,}95 \Rightarrow c_2\approx1{,}645$.
- $P(U<c_3) = 0{,}025 \Rightarrow c_3 = z_{0{,}025} = -z_{0{,}975} = -1{,}96$.
`,
        answer: md`$c_1\approx1{,}282$; $c_2\approx1{,}645$; $c_3=-1{,}96$.`
      },
      {
        id: 'e6', tag: 'C06', title: 'Wyniki egzaminu',
        text: md`
Liczba punktów z egzaminu ma rozkład normalny ze średnią 65 i **wariancją 144**.
a) Jakie jest prawdopodobieństwo, że losowy student ma ponad 80 punktów?
b) Jaki odsetek studentów ma od 60 do 75 punktów?
c) Jakiego wyniku nie przekracza 80% studentów?
`,
        hint: md`Wariancja 144 → $\sigma = 12$.`,
        solution: md`
$X\sim N(65, 12)$.
a) $z = \frac{80-65}{12} = 1{,}25$; $P(X>80) = 1-\Phi(1{,}25) = 1-0{,}8944 = 0{,}1056$.
b) $z_1 = \frac{60-65}{12}\approx-0{,}42$, $z_2 = \frac{75-65}{12}\approx0{,}83$; $P = \Phi(0{,}83)-\Phi(-0{,}42) = 0{,}7967 - 0{,}3372 \approx 0{,}46$.
c) $x_{0{,}8} = 65 + 12\cdot z_{0{,}8} = 65 + 12\cdot0{,}8416\approx75{,}1$ pkt.

@chart exIQ
`,
        answer: md`a) ≈ 0,106; b) ≈ 46%; c) ≈ 75,1 pkt.`
      },
      {
        id: 'e7', tag: 'C06', title: 'Paczki kawy',
        text: md`
Masa paczki kawy ma rozkład normalny o średniej 250 g i odchyleniu standardowym 4 g. Ile średnio spośród 2000 paczek waży od 244 g do 255 g?
`,
        hint: md`Policz prawdopodobieństwo dla jednej paczki i pomnóż przez 2000.`,
        solution: md`
$z_1 = \frac{244-250}{4} = -1{,}5$, $z_2 = \frac{255-250}{4} = 1{,}25$.
$P = \Phi(1{,}25) - \Phi(-1{,}5) = 0{,}8944 - (1-0{,}9332) = 0{,}8276$.
Średnio $2000\cdot0{,}8276\approx1655$ paczek.
`,
        answer: md`≈ 1655 paczek.`
      },
      {
        id: 'e8', tag: 'C06', title: 'Butelkowana woda i przepisy',
        text: md`
Maszyna nalewa wodę do butelek 500 ml; objętość ma rozkład normalny z $\sigma = 6$ ml, a średnią można ustawić z dokładnością do 1 ml. Przepisy wymagają, żeby:
(1) średnio w butelce było co najmniej 500 ml;
(2) nie więcej niż 2,5% butelek miało mniej niż 490 ml;
(3) nie więcej niż 1 na 10 000 butelek miała mniej niż 480 ml.
Maszyna jest ustawiona na średnio 505 ml.
a) Jaki procent butelek ma mniej niż 490 ml? b) Mniej niż 480 ml? c) Jaka jest **minimalna** średnia, przy której wszystkie przepisy są spełnione?
`,
        hint: md`c) Z każdego warunku wyznacz dolne ograniczenie na $\mu$: $P(X<a)\le q \Leftrightarrow \frac{a-\mu}{\sigma}\le z_q \Leftrightarrow \mu \ge a - \sigma z_q$. Weź największe z ograniczeń i zaokrąglij **w górę**.`,
        solution: md`
a) $P(X<490) = \Phi\left(\frac{490-505}{6}\right) = \Phi(-2{,}5) = 1-0{,}9938 = 0{,}0062$ → **0,62%**.
b) $P(X<480) = \Phi(-4{,}17)\approx0{,}000015$ → **0,0015%**.
c) Ograniczenia:
- (1) $\mu\ge500$;
- (2) $\frac{490-\mu}{6}\le z_{0{,}025} = -1{,}96 \Rightarrow \mu\ge 490 + 1{,}96\cdot6 = 501{,}76$;
- (3) $\frac{480-\mu}{6}\le z_{0{,}0001} = -3{,}719 \Rightarrow \mu\ge480+3{,}719\cdot6 = 502{,}31$.

Najsilniejsze jest (3); z dokładnością do 1 ml: **$\mu = 503$ ml**.

@chart exWater
`,
        answer: md`a) ≈ 0,62%; b) ≈ 0,0015%; c) $\mu_{\min} = 503$ ml.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'Three continuous distributions you will meet everywhere: **uniform** (every value equally possible), **normal** (the Gaussian curve) and **exponential** (waiting time, no memory).',
    lecture: md`
# The uniform distribution U(a, b)

::: def W04b | Uniform distribution on [a, b]
$X\sim U(a,b)$ when the density is **constant** on $[a,b]$:
$$f(x) = \begin{cases}\dfrac{1}{b-a} & a\le x\le b\\[4pt] 0 & \text{elsewhere}\end{cases}\qquad F(x) = \begin{cases}0 & x<a\\ \dfrac{x-a}{b-a} & a\le x<b\\ 1 & x\ge b\end{cases}$$
$$E(X) = \frac{a+b}{2},\qquad V(X) = \frac{(b-a)^2}{12}$$
:::

::: intuition
“Every moment is equally likely”: you come to a bus stop without knowing the timetable. The probability depends only on the **length** of an interval, not on its position: $P(X\in[c,d]) = \frac{d-c}{b-a}$.
:::

@chart unifPdf

@chart unifCdf

::: example W04b | Buses every 20 minutes
From 6:00 buses arrive every 20 minutes. A passenger arrives at a random moment between 7:00 and 7:40 ($X\sim U$, length 40 min).
- Waits **less than 10 min** if arriving 7:10–7:20 or 7:30–7:40: $\frac{10}{40}+\frac{10}{40} = \frac12$.
- Waits **at least 15 min** if arriving 7:00–7:05 or 7:20–7:25: $\frac{5}{40}+\frac5{40} = \frac14$.
:::

# The normal distribution N(μ, σ)

The normal distribution (the Gaussian “bell” curve) describes **measurement errors** that arise from many small independent causes. De Moivre introduced it (1733); thanks to the **Central Limit Theorem** (topic 8) it is used almost everywhere. {lecture:W04b}

::: def W04b | Normal distribution
$X\sim N(\mu,\sigma)$, $\mu\in\mathbb R$, $\sigma>0$:
$$f(x) = \frac{1}{\sqrt{2\pi}\,\sigma}\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right),\qquad E(X) = \mu,\quad V(X) = \sigma^2$$
$\mu$ — the **location** parameter (centre of the bell), $\sigma$ — the **scale** parameter (width of the bell).
:::

::: warn
In this course $N(\mu, \sigma)$ has the **standard deviation** as its second parameter (not the variance!). If a problem gives a variance of 225, then $\sigma = 15$.
:::

@chart normSigma

@chart normMu

## Standardisation and Φ tables

::: formula W04b | The most important trick
If $X\sim N(\mu,\sigma)$, then $aX+b\sim N(a\mu+b, |a|\sigma)$, in particular
$$U = \frac{X-\mu}{\sigma}\sim N(0,1)\qquad\text{and}\qquad F(x) = P(X\le x) = \Phi\!\left(\frac{x-\mu}{\sigma}\right)$$
where $\Phi$ is the CDF of the **standard** normal distribution N(0, 1).
:::

$\Phi$ has no elementary formula — its values are computed numerically and read from **tables** (or the [calculator](#/tables)). The density is symmetric, so tables list only $z\ge0$:
$$\Phi(-z) = 1 - \Phi(z)$$

@chart phiArea

::: steps | Computing probabilities for N(μ, σ)
1. Convert every bound to $z = \dfrac{x-\mu}{\sigma}$.
2. $P(X<x) = \Phi(z)$; $\;P(X>x) = 1-\Phi(z)$; $\;P(a<X<b) = \Phi(z_b) - \Phi(z_a)$.
3. For negative $z$: $\Phi(-z) = 1-\Phi(z)$.
4. “How many out of $N$” = $N\cdot$ probability.
:::

::: example own | Height
Height of adult men: $X\sim N(178, 7)$ [cm]. What share is taller than 190 cm?
$z = \frac{190-178}{7}\approx 1.71$, $P(X>190) = 1 - \Phi(1.71) = 1 - 0.9564 = 0.0436$ — about 4.4%.
:::

## The 3σ rule

::: example W04b | P(|X − μ| ≤ kσ)
$$P(|X-\mu|\le k\sigma) = \Phi(k)-\Phi(-k) = 2\Phi(k)-1 = \begin{cases}0.6826 & k=1\\ 0.9544 & k=2\\ 0.9974 & k=3\end{cases}$$
Only 0.26% of values lie outside $\mu\pm3\sigma$ — the **three-sigma rule**.
:::

## Quantiles of N(0, 1)

Quantile $z_p$: $\Phi(z_p) = p$. The key ones: $z_{0.9} = 1.282$, $z_{0.95} = 1.645$, $z_{0.975} = 1.960$, $z_{0.99} = 2.326$, $z_{0.995} = 2.576$.

- $P(U>c) = \alpha \Rightarrow c = z_{1-\alpha}$ (one tail),
- $P(|U|>c) = \alpha \Rightarrow c = z_{1-\alpha/2}$ (two tails, $\alpha/2$ each).

@chart twoSided

A quantile of any $N(\mu,\sigma)$: $x_p = \mu + \sigma\,z_p$.

::: example own | A quantile in practice
Height $N(178, 7)$: which height do 90% of men not exceed? $x_{0.9} = 178 + 7\cdot1.282 \approx 187$ cm.
:::

@widget normal-explorer

# The exponential distribution Exp(λ)

::: def W04b | Exponential distribution
$$f(x) = \begin{cases}\lambda e^{-\lambda x} & x\ge0\\ 0 & x<0\end{cases}\qquad F(x) = 1-e^{-\lambda x}\ (x\ge0),\qquad P(X>x) = e^{-\lambda x}$$
$$E(X) = \frac1\lambda,\qquad V(X) = \frac{1}{\lambda^2}$$
It describes a **time until an event**: lifetime of a component, service time, time to the next customer.
:::

@chart expPdf

::: def W04b | Memorylessness
$$P(X > s+t\mid X>t) = P(X>s)\qquad\text{for all } s,t\ge0$$
A device that has already worked for $t$ hours “doesn’t remember” it — the chance of surviving another $s$ hours is the same as for a new one. The exponential distribution is the **only** continuous distribution with this property (from $Q(t+s) = Q(t)Q(s)$ for $Q(t) = P(X>t)$ it follows that $Q(t) = e^{-\lambda t}$).
:::

::: example W04b | A used car
The distance until scrapping (thousand miles) is exponential with $\lambda = \frac1{20}$. The car has done 10 thousand miles. The chance it does **at least 20 thousand more**:
$$P(X>30\mid X>10) = P(X>20) = e^{-20/20} = e^{-1}\approx0.368$$
If the distance were $U(0, 40)$: $\frac{P(X>30)}{P(X>10)} = \frac{1/4}{3/4} = \frac13$ — here the mileage **does** matter.
:::

::: formula own | Quantiles of the exponential distribution
$$F(t_p) = p \;\Rightarrow\; t_p = -\frac{\ln(1-p)}{\lambda},\qquad \text{median} = \frac{\ln 2}{\lambda}\approx\frac{0.693}{\lambda}$$
“The time reached by at least 95% of components” is $t$ with $P(X\ge t) = 0.95$, i.e. $t = -\ln(0.95)/\lambda$.
:::

# In Excel

~~~excel Normal and exponential distributions
A1: =NORM.S.DIST(1.25,TRUE)          // Φ(1.25) = 0.8944
A2: =NORM.DIST(190,178,7,TRUE)       // P(X <= 190) for N(178, 7)
A3: =1-NORM.DIST(190,178,7,TRUE)     // P(X > 190)
A4: =NORM.S.INV(0.975)               // z_0.975 = 1.96
A5: =NORM.INV(0.9,178,7)             // 0.9 quantile of N(178, 7)
A6: =STANDARDIZE(190,178,7)          // z = (x - μ)/σ
A7: =EXPON.DIST(650,0.001,TRUE)      // P(X <= 650) for Exp(0.001)
A8: =-LN(1-0.5)/0.001                // median of Exp(0.001)
~~~

~~~python scipy.stats: norm, expon, uniform
from scipy.stats import norm, expon, uniform

print(norm.cdf(1.25))                    # Φ(1.25)
print(norm.sf(190, loc=178, scale=7))    # P(X > 190)
print(norm.ppf(0.975))                   # z_0.975
print(expon.sf(650, scale=1/0.001))      # P(X > 650), scale = 1/λ
print(uniform.cdf(7.5, loc=0, scale=8))  # U(0, 8): P(X <= 7.5)
~~~

::: summary
- $U(a,b)$: $f = \frac1{b-a}$, $E=\frac{a+b}2$, $V=\frac{(b-a)^2}{12}$; probability = length/(b − a).
- $N(\mu,\sigma)$: $E=\mu$, $V=\sigma^2$; $P(X\le x)=\Phi\left(\frac{x-\mu}{\sigma}\right)$, $\Phi(-z)=1-\Phi(z)$; $x_p = \mu+\sigma z_p$.
- $\pm1\sigma$: 68.3%, $\pm2\sigma$: 95.4%, $\pm3\sigma$: 99.7%.
- $Exp(\lambda)$: $P(X>x)=e^{-\lambda x}$, $E=1/\lambda$; memoryless.
:::
`,

    cheatsheet: md`
## Uniform U(a, b)
$f=\frac1{b-a}$ · $F=\frac{x-a}{b-a}$ · $E=\frac{a+b}2$ · $V=\frac{(b-a)^2}{12}$ · $P$ = length / $(b-a)$ · quantile: $a+p(b-a)$

## Normal N(μ, σ) — σ is the standard deviation!
- $z=\frac{x-\mu}{\sigma}$; $P(X<x)=\Phi(z)$; $P(X>x)=1-\Phi(z)$
- $P(a<X<b)=\Phi(z_b)-\Phi(z_a)$; $\Phi(-z)=1-\Phi(z)$
- quantile: $x_p=\mu+\sigma z_p$
- $P(|X-\mu|\le k\sigma)=2\Phi(k)-1$: 0.6826 / 0.9544 / 0.9974
- $P(U>c)=\alpha\Rightarrow c=z_{1-\alpha}$; $P(|U|>c)=\alpha\Rightarrow c=z_{1-\alpha/2}$

| $p$ | 0.90 | 0.95 | 0.975 | 0.99 | 0.995 |
|---|---|---|---|---|---|
| $z_p$ | 1.282 | 1.645 | 1.960 | 2.326 | 2.576 |

## Exponential Exp(λ)
$F=1-e^{-\lambda x}$ · $P(X>x)=e^{-\lambda x}$ · $E=\frac1\lambda$ · $V=\frac1{\lambda^2}$ · median $\frac{\ln2}{\lambda}$
Memoryless: $P(X>s+t\mid X>t)=P(X>s)$. Mean 2 h → $\lambda = 0.5$ per hour.

## Excel
‹NORM.S.DIST(z,TRUE)› ‹NORM.DIST(x,μ,σ,TRUE)› ‹NORM.S.INV(p)› ‹NORM.INV(p,μ,σ)› ‹EXPON.DIST(x,λ,TRUE)›
`,

    exercises: [
      {
        id: 'e1', tag: 'C06', title: 'Metro every 8 minutes',
        text: md`
Metro trains leave every 8 minutes. A passenger arrives at a random moment (not knowing the timetable).
1. What is the probability of waiting at least 5 minutes?
2. What is the average waiting time?
3. Find the time such that the waiting time is shorter with 90% probability.
`,
        hint: md`The waiting time $X\sim U(0, 8)$. In 3 you need the 0.9 quantile.`,
        solution: md`
$X\sim U(0,8)$, $F(x) = x/8$.
1. $P(X\ge5) = \frac{8-5}{8} = \frac38 = 0.375$.
2. $E(X) = \frac{0+8}{2} = 4$ min.
3. $F(t) = 0.9 \Rightarrow t = 0.9\cdot8 = 7.2$ min.
`,
        answer: md`0.375; 4 min; 7.2 min.`
      },
      {
        id: 'e2', tag: 'C06', title: 'Temperature in March',
        text: md`
The midday temperature in March (°C) in some town is uniform on $[-6; 10]$.
1. What is the probability that on a random day it exceeds 4°C?
2. What are the mean temperature and its standard deviation?
`,
        hint: md`Interval length: 16.`,
        solution: md`
1. $P(X>4) = \frac{10-4}{16} = 0.375$.
2. $E(X) = \frac{-6+10}{2} = 2$°C; $V(X) = \frac{16^2}{12}\approx21.33$, $\sigma\approx4.62$°C.
`,
        answer: md`0.375; mean 2°C, $\sigma\approx4.62$°C.`
      },
      {
        id: 'e3', tag: 'C06', title: 'SSD lifetime',
        text: md`
The working time of an SSD (hours) is exponential with $\lambda = 0.0002$ (1/h).
1. How many hours does a drive work on average?
2. What is the probability that a new drive works at least 3000 h?
3. Find the working time reached by at least (i) 50% of drives, (ii) 95% of drives.
`,
        hint: md`“Reached by at least $q$ of drives” means $P(X\ge t) = q$, i.e. $e^{-\lambda t} = q$.`,
        solution: md`
1. $E(X) = \frac1\lambda = 5000$ h.
2. $P(X\ge3000) = e^{-0.6}\approx0.549$.
3. (i) $t = \frac{\ln2}{\lambda}\approx3466$ h (median); (ii) $t = -\frac{\ln0.95}{\lambda}\approx256.5$ h.

Note: the median (3466 h) is **smaller** than the mean (5000 h) — the exponential distribution has a long right tail.
`,
        answer: md`5000 h; ≈ 0.549; (i) ≈ 3466 h; (ii) ≈ 256.5 h.`
      },
      {
        id: 'e4', tag: 'C06', title: 'A help-line call — memorylessness',
        text: md`
The duration of a help-line call is exponential with mean 4 minutes.
a) What is the probability that a call lasts more than 6 minutes?
b) A call has already lasted 10 minutes. What is the probability that it ends within the next 3 minutes?
`,
        hint: md`$\lambda = \frac14$ per minute. b) Memorylessness: the past 10 minutes “don’t count”.`,
        solution: md`
a) $P(X>6) = e^{-1.5}\approx0.223$.
b) $P(X\le13\mid X>10) = 1 - P(X>3) = 1-e^{-0.75}\approx0.528$.
`,
        answer: md`a) ≈ 0.223; b) ≈ 0.528.`
      },
      {
        id: 'e5', tag: 'C06', title: 'Constants for the standard normal distribution',
        text: md`
Let $U\sim N(0,1)$. Find $c_1$, $c_2$, $c_3$ such that $P(U>c_1) = 0.10$, $P(|U|>c_2) = 0.10$, $P(U<c_3) = 0.025$.
`,
        hint: md`One tail → $z_{1-\alpha}$; two tails → $z_{1-\alpha/2}$; left tail → a negative quantile.`,
        solution: md`
- $\Phi(c_1) = 0.9 \Rightarrow c_1\approx1.282$.
- 0.05 in each tail → $\Phi(c_2) = 0.95 \Rightarrow c_2\approx1.645$.
- $c_3 = z_{0.025} = -z_{0.975} = -1.96$.
`,
        answer: md`$c_1\approx1.282$; $c_2\approx1.645$; $c_3=-1.96$.`
      },
      {
        id: 'e6', tag: 'C06', title: 'Exam scores',
        text: md`
Exam scores are normal with mean 65 and **variance 144**.
a) What is the probability that a random student scores more than 80?
b) What share of students score between 60 and 75?
c) Which score do 80% of students not exceed?
`,
        hint: md`Variance 144 → $\sigma = 12$.`,
        solution: md`
$X\sim N(65, 12)$.
a) $z = 1.25$; $P(X>80) = 1-0.8944 = 0.1056$.
b) $z_1\approx-0.42$, $z_2\approx0.83$; $P = 0.7967 - 0.3372 \approx 0.46$.
c) $x_{0.8} = 65 + 12\cdot0.8416\approx75.1$ points.

@chart exIQ
`,
        answer: md`a) ≈ 0.106; b) ≈ 46%; c) ≈ 75.1 points.`
      },
      {
        id: 'e7', tag: 'C06', title: 'Coffee packs',
        text: md`
The mass of a coffee pack is normal with mean 250 g and standard deviation 4 g. On average, how many of 2000 packs weigh between 244 g and 255 g?
`,
        hint: md`Compute the probability for one pack and multiply by 2000.`,
        solution: md`
$z_1 = -1.5$, $z_2 = 1.25$. $P = 0.8944 - (1-0.9332) = 0.8276$. On average $2000\cdot0.8276\approx1655$ packs.
`,
        answer: md`≈ 1655 packs.`
      },
      {
        id: 'e8', tag: 'C06', title: 'Bottled water and regulations',
        text: md`
A machine fills 500 ml bottles; the volume is normal with $\sigma = 6$ ml, and the mean can be set to the nearest 1 ml. Regulations require that:
(1) the average volume is at least 500 ml;
(2) at most 2.5% of bottles contain less than 490 ml;
(3) at most 1 in 10,000 bottles contains less than 480 ml.
The machine is set to 505 ml on average.
a) What percentage of bottles has less than 490 ml? b) Less than 480 ml? c) What is the **minimal** mean that satisfies all rules?
`,
        hint: md`c) Each rule gives a lower bound for $\mu$: $P(X<a)\le q \Leftrightarrow \mu \ge a - \sigma z_q$. Take the largest bound and round **up**.`,
        solution: md`
a) $\Phi(-2.5) = 0.0062$ → **0.62%**.
b) $\Phi(-4.17)\approx0.000015$ → **0.0015%**.
c) Bounds: (1) $\mu\ge500$; (2) $\mu\ge 490 + 1.96\cdot6 = 501.76$; (3) $\mu\ge480+3.719\cdot6 = 502.31$.
The strongest is (3); to the nearest ml: **$\mu = 503$ ml**.

@chart exWater
`,
        answer: md`a) ≈ 0.62%; b) ≈ 0.0015%; c) $\mu_{\min} = 503$ ml.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'Три непрерывных распределения, которые встречаются на каждом шагу: **равномерное** (все значения одинаково возможны), **нормальное** (кривая Гаусса) и **показательное** (время ожидания, отсутствие памяти).',
    lecture: md`
# Равномерное распределение U(a, b)

::: def W04b | Равномерное распределение на [a, b]
$X\sim U(a,b)$, если плотность **постоянна** на $[a,b]$:
$$f(x) = \begin{cases}\dfrac{1}{b-a} & a\le x\le b\\[4pt] 0 & \text{вне}\end{cases}\qquad F(x) = \begin{cases}0 & x<a\\ \dfrac{x-a}{b-a} & a\le x<b\\ 1 & x\ge b\end{cases}$$
$$E(X) = \frac{a+b}{2},\qquad V(X) = \frac{(b-a)^2}{12}$$
:::

::: intuition
«Любой момент одинаково вероятен»: вы приходите на остановку, не зная расписания. Вероятность зависит только от **длины** интервала, а не от его положения: $P(X\in[c,d]) = \frac{d-c}{b-a}$.
:::

@chart unifPdf

@chart unifCdf

::: example W04b | Автобусы каждые 20 минут
С 6:00 автобусы приходят каждые 20 минут. Пассажир приходит в случайный момент между 7:00 и 7:40 ($X\sim U$, длина 40 мин).
- Ждёт **меньше 10 мин**, если придёт в 7:10–7:20 или 7:30–7:40: $\frac{10}{40}+\frac{10}{40} = \frac12$.
- Ждёт **не меньше 15 мин**, если придёт в 7:00–7:05 или 7:20–7:25: $\frac{5}{40}+\frac5{40} = \frac14$.
:::

# Нормальное распределение N(μ, σ)

Нормальное распределение (кривая Гаусса, «колокол») описывает **ошибки измерений**, возникающие от наложения многих мелких независимых причин. Его ввёл де Муавр (1733); благодаря **центральной предельной теореме** (тема 8) оно применяется почти везде. {lecture:W04b}

::: def W04b | Нормальное распределение
$X\sim N(\mu,\sigma)$, $\mu\in\mathbb R$, $\sigma>0$:
$$f(x) = \frac{1}{\sqrt{2\pi}\,\sigma}\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right),\qquad E(X) = \mu,\quad V(X) = \sigma^2$$
$\mu$ — параметр **положения** (центр колокола), $\sigma$ — параметр **масштаба** (ширина колокола).
:::

::: warn
В этом курсе в записи $N(\mu, \sigma)$ второй параметр — **стандартное отклонение** (а не дисперсия!). Если в условии дисперсия 225, то $\sigma = 15$.
:::

@chart normSigma

@chart normMu

## Стандартизация и таблицы Φ

::: formula W04b | Главный приём
Если $X\sim N(\mu,\sigma)$, то $aX+b\sim N(a\mu+b, |a|\sigma)$, в частности
$$U = \frac{X-\mu}{\sigma}\sim N(0,1)\qquad\text{и}\qquad F(x) = P(X\le x) = \Phi\!\left(\frac{x-\mu}{\sigma}\right)$$
где $\Phi$ — функция распределения **стандартного** нормального закона N(0, 1).
:::

$\Phi$ не выражается элементарной формулой — её значения считают численно и берут из **таблиц** (или из [калькулятора](#/tables)). Плотность симметрична, поэтому в таблицах только $z\ge0$:
$$\Phi(-z) = 1 - \Phi(z)$$

@chart phiArea

::: steps | Как считать вероятности для N(μ, σ)
1. Переведите каждую границу в $z = \dfrac{x-\mu}{\sigma}$.
2. $P(X<x) = \Phi(z)$; $\;P(X>x) = 1-\Phi(z)$; $\;P(a<X<b) = \Phi(z_b) - \Phi(z_a)$.
3. Для отрицательных $z$: $\Phi(-z) = 1-\Phi(z)$.
4. «Сколько штук из $N$» = $N\cdot$ вероятность.
:::

::: example own | Рост
Рост взрослых мужчин: $X\sim N(178, 7)$ [см]. Какая доля выше 190 см?
$z = \frac{190-178}{7}\approx 1{,}71$, $P(X>190) = 1 - \Phi(1{,}71) = 1 - 0{,}9564 = 0{,}0436$ — около 4,4%.
:::

## Правило 3σ

::: example W04b | P(|X − μ| ≤ kσ)
$$P(|X-\mu|\le k\sigma) = \Phi(k)-\Phi(-k) = 2\Phi(k)-1 = \begin{cases}0{,}6826 & k=1\\ 0{,}9544 & k=2\\ 0{,}9974 & k=3\end{cases}$$
Вне интервала $\mu\pm3\sigma$ лежит всего 0,26% значений — это **правило трёх сигм**.
:::

## Квантили N(0, 1)

Квантиль $z_p$: $\Phi(z_p) = p$. Главные: $z_{0{,}9} = 1{,}282$, $z_{0{,}95} = 1{,}645$, $z_{0{,}975} = 1{,}960$, $z_{0{,}99} = 2{,}326$, $z_{0{,}995} = 2{,}576$.

- $P(U>c) = \alpha \Rightarrow c = z_{1-\alpha}$ (один хвост),
- $P(|U|>c) = \alpha \Rightarrow c = z_{1-\alpha/2}$ (два хвоста, по $\alpha/2$).

@chart twoSided

Квантиль любого $N(\mu,\sigma)$: $x_p = \mu + \sigma\,z_p$.

::: example own | Квантиль на практике
Рост $N(178, 7)$: какой рост не превышают 90% мужчин? $x_{0{,}9} = 178 + 7\cdot1{,}282 \approx 187$ см.
:::

@widget normal-explorer

# Показательное распределение Exp(λ)

::: def W04b | Показательное (экспоненциальное) распределение
$$f(x) = \begin{cases}\lambda e^{-\lambda x} & x\ge0\\ 0 & x<0\end{cases}\qquad F(x) = 1-e^{-\lambda x}\ (x\ge0),\qquad P(X>x) = e^{-\lambda x}$$
$$E(X) = \frac1\lambda,\qquad V(X) = \frac{1}{\lambda^2}$$
Описывает **время до события**: срок службы элемента, время обслуживания, время до следующего клиента.
:::

@chart expPdf

::: def W04b | Отсутствие памяти
$$P(X > s+t\mid X>t) = P(X>s)\qquad\text{для всех } s,t\ge0$$
Устройство, которое уже проработало $t$ часов, «не помнит» этого — шанс проработать ещё $s$ часов такой же, как у нового. Показательное распределение — **единственное** непрерывное с этим свойством (из $Q(t+s) = Q(t)Q(s)$ для $Q(t) = P(X>t)$ следует $Q(t) = e^{-\lambda t}$).
:::

::: example W04b | Подержанный автомобиль
Пробег до утилизации (тыс. миль) распределён показательно с $\lambda = \frac1{20}$. Машина уже проехала 10 тыс. миль. Шанс, что она проедет ещё **не меньше 20 тыс.**:
$$P(X>30\mid X>10) = P(X>20) = e^{-20/20} = e^{-1}\approx0{,}368$$
Если бы пробег был $U(0, 40)$: $\frac{P(X>30)}{P(X>10)} = \frac{1/4}{3/4} = \frac13$ — здесь пробег **имеет** значение.
:::

::: formula own | Квантили показательного распределения
$$F(t_p) = p \;\Rightarrow\; t_p = -\frac{\ln(1-p)}{\lambda},\qquad \text{медиана} = \frac{\ln 2}{\lambda}\approx\frac{0{,}693}{\lambda}$$
«Время, которое проработают не меньше 95% элементов» — это $t$ из $P(X\ge t) = 0{,}95$, т.е. $t = -\ln(0{,}95)/\lambda$.
:::

# В Excel

~~~excel Нормальное и показательное распределения
A1: =NORM.S.DIST(1.25,TRUE)          // Φ(1,25) = 0,8944
A2: =NORM.DIST(190,178,7,TRUE)       // P(X <= 190) для N(178, 7)
A3: =1-NORM.DIST(190,178,7,TRUE)     // P(X > 190)
A4: =NORM.S.INV(0.975)               // z_0,975 = 1,96
A5: =NORM.INV(0.9,178,7)             // квантиль 0,9 для N(178, 7)
A6: =STANDARDIZE(190,178,7)          // z = (x - μ)/σ
A7: =EXPON.DIST(650,0.001,TRUE)      // P(X <= 650) для Exp(0,001)
A8: =-LN(1-0.5)/0.001                // медиана Exp(0,001)
~~~

~~~python scipy.stats: norm, expon, uniform
from scipy.stats import norm, expon, uniform

print(norm.cdf(1.25))                    # Φ(1.25)
print(norm.sf(190, loc=178, scale=7))    # P(X > 190)
print(norm.ppf(0.975))                   # z_0.975
print(expon.sf(650, scale=1/0.001))      # P(X > 650), scale = 1/λ
print(uniform.cdf(7.5, loc=0, scale=8))  # U(0, 8): P(X <= 7.5)
~~~

::: summary
- $U(a,b)$: $f = \frac1{b-a}$, $E=\frac{a+b}2$, $V=\frac{(b-a)^2}{12}$; вероятность = длина/(b − a).
- $N(\mu,\sigma)$: $E=\mu$, $V=\sigma^2$; $P(X\le x)=\Phi\left(\frac{x-\mu}{\sigma}\right)$, $\Phi(-z)=1-\Phi(z)$; $x_p = \mu+\sigma z_p$.
- $\pm1\sigma$: 68,3%, $\pm2\sigma$: 95,4%, $\pm3\sigma$: 99,7%.
- $Exp(\lambda)$: $P(X>x)=e^{-\lambda x}$, $E=1/\lambda$; отсутствие памяти.
:::
`,

    cheatsheet: md`
## Равномерное U(a, b)
$f=\frac1{b-a}$ · $F=\frac{x-a}{b-a}$ · $E=\frac{a+b}2$ · $V=\frac{(b-a)^2}{12}$ · $P$ = длина / $(b-a)$ · квантиль: $a+p(b-a)$

## Нормальное N(μ, σ) — σ это отклонение!
- $z=\frac{x-\mu}{\sigma}$; $P(X<x)=\Phi(z)$; $P(X>x)=1-\Phi(z)$
- $P(a<X<b)=\Phi(z_b)-\Phi(z_a)$; $\Phi(-z)=1-\Phi(z)$
- квантиль: $x_p=\mu+\sigma z_p$
- $P(|X-\mu|\le k\sigma)=2\Phi(k)-1$: 0,6826 / 0,9544 / 0,9974
- $P(U>c)=\alpha\Rightarrow c=z_{1-\alpha}$; $P(|U|>c)=\alpha\Rightarrow c=z_{1-\alpha/2}$

| $p$ | 0,90 | 0,95 | 0,975 | 0,99 | 0,995 |
|---|---|---|---|---|---|
| $z_p$ | 1,282 | 1,645 | 1,960 | 2,326 | 2,576 |

## Показательное Exp(λ)
$F=1-e^{-\lambda x}$ · $P(X>x)=e^{-\lambda x}$ · $E=\frac1\lambda$ · $V=\frac1{\lambda^2}$ · медиана $\frac{\ln2}{\lambda}$
Без памяти: $P(X>s+t\mid X>t)=P(X>s)$. Среднее 2 ч → $\lambda = 0{,}5$ в час.

## Excel
‹NORM.S.DIST(z,TRUE)› ‹NORM.DIST(x,μ,σ,TRUE)› ‹NORM.S.INV(p)› ‹NORM.INV(p,μ,σ)› ‹EXPON.DIST(x,λ,TRUE)›
`,

    exercises: [
      {
        id: 'e1', tag: 'C06', title: 'Метро каждые 8 минут',
        text: md`
Поезда метро уходят каждые 8 минут. Пассажир приходит на платформу в случайный момент (не зная расписания).
1. Какова вероятность прождать не меньше 5 минут?
2. Сколько в среднем он ждёт?
3. Найдите время, короче которого ожидание будет с вероятностью 90%.
`,
        hint: md`Время ожидания $X\sim U(0, 8)$. В п. 3 нужен квантиль порядка 0,9.`,
        solution: md`
$X\sim U(0,8)$, $F(x) = x/8$.
1. $P(X\ge5) = \frac38 = 0{,}375$.
2. $E(X) = 4$ мин.
3. $F(t) = 0{,}9 \Rightarrow t = 7{,}2$ мин.
`,
        answer: md`0,375; 4 мин; 7,2 мин.`
      },
      {
        id: 'e2', tag: 'C06', title: 'Температура в марте',
        text: md`
Полуденная температура в марте (°C) в некотором городе распределена равномерно на $[-6; 10]$.
1. Какова вероятность, что в случайный день она превысит 4°C?
2. Каковы средняя температура и её стандартное отклонение?
`,
        hint: md`Длина отрезка: 16.`,
        solution: md`
1. $P(X>4) = \frac{6}{16} = 0{,}375$.
2. $E(X) = 2$°C; $V(X) = \frac{16^2}{12}\approx21{,}33$, $\sigma\approx4{,}62$°C.
`,
        answer: md`0,375; в среднем 2°C, $\sigma\approx4{,}62$°C.`
      },
      {
        id: 'e3', tag: 'C06', title: 'Срок службы SSD',
        text: md`
Время работы SSD-диска (в часах) распределено показательно с $\lambda = 0{,}0002$ (1/ч).
1. Сколько часов в среднем работает диск?
2. Какова вероятность, что новый диск проработает не меньше 3000 ч?
3. Найдите время работы, которого достигают не меньше (i) 50% дисков, (ii) 95% дисков.
`,
        hint: md`«Достигают не меньше $q$ дисков» означает $P(X\ge t) = q$, т.е. $e^{-\lambda t} = q$.`,
        solution: md`
1. $E(X) = \frac1\lambda = 5000$ ч.
2. $P(X\ge3000) = e^{-0{,}6}\approx0{,}549$.
3. (i) $t = \frac{\ln2}{\lambda}\approx3466$ ч (медиана); (ii) $t = -\frac{\ln0{,}95}{\lambda}\approx256{,}5$ ч.

Заметьте: медиана (3466 ч) **меньше** среднего (5000 ч) — у показательного распределения длинный правый хвост.
`,
        answer: md`5000 ч; ≈ 0,549; (i) ≈ 3466 ч; (ii) ≈ 256,5 ч.`
      },
      {
        id: 'e4', tag: 'C06', title: 'Звонок на горячую линию — отсутствие памяти',
        text: md`
Длительность звонка на горячую линию распределена показательно, в среднем 4 минуты.
а) Какова вероятность, что звонок продлится больше 6 минут?
б) Звонок длится уже 10 минут. Какова вероятность, что он закончится в ближайшие 3 минуты?
`,
        hint: md`$\lambda = \frac14$ в минуту. б) Отсутствие памяти: прошедшие 10 минут «не считаются».`,
        solution: md`
а) $P(X>6) = e^{-1{,}5}\approx0{,}223$.
б) $P(X\le13\mid X>10) = 1 - P(X>3) = 1-e^{-0{,}75}\approx0{,}528$.
`,
        answer: md`а) ≈ 0,223; б) ≈ 0,528.`
      },
      {
        id: 'e5', tag: 'C06', title: 'Константы для стандартного нормального',
        text: md`
Пусть $U\sim N(0,1)$. Найдите $c_1$, $c_2$, $c_3$ такие, что $P(U>c_1) = 0{,}10$, $P(|U|>c_2) = 0{,}10$, $P(U<c_3) = 0{,}025$.
`,
        hint: md`Один хвост → $z_{1-\alpha}$; два хвоста → $z_{1-\alpha/2}$; левый хвост → отрицательный квантиль.`,
        solution: md`
- $\Phi(c_1) = 0{,}9 \Rightarrow c_1\approx1{,}282$.
- по 0,05 в каждом хвосте → $\Phi(c_2) = 0{,}95 \Rightarrow c_2\approx1{,}645$.
- $c_3 = z_{0{,}025} = -z_{0{,}975} = -1{,}96$.
`,
        answer: md`$c_1\approx1{,}282$; $c_2\approx1{,}645$; $c_3=-1{,}96$.`
      },
      {
        id: 'e6', tag: 'C06', title: 'Результаты экзамена',
        text: md`
Баллы за экзамен распределены нормально со средним 65 и **дисперсией 144**.
а) Какова вероятность, что случайный студент наберёт больше 80?
б) Какая доля студентов набирает от 60 до 75?
в) Какой результат не превышают 80% студентов?
`,
        hint: md`Дисперсия 144 → $\sigma = 12$.`,
        solution: md`
$X\sim N(65, 12)$.
а) $z = 1{,}25$; $P(X>80) = 1-0{,}8944 = 0{,}1056$.
б) $z_1\approx-0{,}42$, $z_2\approx0{,}83$; $P = 0{,}7967 - 0{,}3372 \approx 0{,}46$.
в) $x_{0{,}8} = 65 + 12\cdot0{,}8416\approx75{,}1$ балла.

@chart exIQ
`,
        answer: md`а) ≈ 0,106; б) ≈ 46%; в) ≈ 75,1 балла.`
      },
      {
        id: 'e7', tag: 'C06', title: 'Пачки кофе',
        text: md`
Масса пачки кофе распределена нормально со средним 250 г и стандартным отклонением 4 г. Сколько в среднем из 2000 пачек весят от 244 г до 255 г?
`,
        hint: md`Найдите вероятность для одной пачки и умножьте на 2000.`,
        solution: md`
$z_1 = -1{,}5$, $z_2 = 1{,}25$. $P = 0{,}8944 - (1-0{,}9332) = 0{,}8276$. В среднем $2000\cdot0{,}8276\approx1655$ пачек.
`,
        answer: md`≈ 1655 пачек.`
      },
      {
        id: 'e8', tag: 'C06', title: 'Бутилированная вода и нормативы',
        text: md`
Автомат разливает воду в бутылки 500 мл; объём распределён нормально с $\sigma = 6$ мл, а среднее можно выставить с точностью до 1 мл. Нормативы требуют, чтобы:
(1) в среднем было не меньше 500 мл;
(2) не больше 2,5% бутылок содержали меньше 490 мл;
(3) не больше 1 из 10 000 бутылок содержала меньше 480 мл.
Автомат настроен на 505 мл.
а) Какой процент бутылок содержит меньше 490 мл? б) Меньше 480 мл? в) Каково **минимальное** среднее, при котором выполнены все нормативы?
`,
        hint: md`в) Каждое условие даёт нижнюю границу для $\mu$: $P(X<a)\le q \Leftrightarrow \mu \ge a - \sigma z_q$. Возьмите наибольшую границу и округлите **вверх**.`,
        solution: md`
а) $\Phi(-2{,}5) = 0{,}0062$ → **0,62%**.
б) $\Phi(-4{,}17)\approx0{,}000015$ → **0,0015%**.
в) Границы: (1) $\mu\ge500$; (2) $\mu\ge 490 + 1{,}96\cdot6 = 501{,}76$; (3) $\mu\ge480+3{,}719\cdot6 = 502{,}31$.
Самое сильное — (3); с точностью до 1 мл: **$\mu = 503$ мл**.

@chart exWater
`,
        answer: md`а) ≈ 0,62%; б) ≈ 0,0015%; в) $\mu_{\min} = 503$ мл.`
      }
    ]
  };

  SAD.registerTopic('t05', { charts: charts, pl: pl, en: en, ru: ru });
})();
