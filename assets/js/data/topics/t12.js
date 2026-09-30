/* Topic 12 — Correlation and simple linear regression (lecture W11–12; no separate class list) */
(function () {
  var md = SAD.md;

  var adX = [5, 6, 7, 8, 9], adY = [4.5, 6.5, 8.4, 7.6, 8.4];
  var ansX = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5];
  var ans = [
    [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68],
    [9.14, 8.14, 8.74, 8.77, 9.26, 8.1, 6.13, 3.1, 9.13, 7.26, 4.74],
    [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73]
  ];
  var x4 = [8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8], y4 = [6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.5, 5.56, 7.91, 6.89];
  function pts(xs, ys) { return xs.map(function (x, i) { return [x, ys[i]]; }); }
  var ansLine = { b0: 3, b1: 0.5, label: 'y = 3 + 0,5x, R² ≈ 0,67' };
  var box = { xRange: [2, 20], yRange: [2, 14], height: 240 };

  var charts = {
    adScatter: { type: 'scatter', points: pts(adX, adY), line: { b0: 0.85, b1: 0.89, label: 'ŷ = 0,85 + 0,89x' }, residuals: true,
      xLabel: { pl: 'reklama [10 tys. zł]', en: 'advertising [10k PLN]', ru: 'реклама [10 тыс. зл]' }, yLabel: { pl: 'dochód [100 tys. zł]', en: 'revenue [100k PLN]', ru: 'доход [100 тыс. зл]' },
      caption: { pl: 'Wykres rozrzutu, prosta regresji i rezydua (przerywane) — przykład z wykładu W11–12', en: 'Scatter plot, regression line and residuals (dashed) — lecture W11–12 example', ru: 'Диаграмма рассеяния, линия регрессии и остатки (пунктир) — пример из лекции W11–12' } },
    adResid: { type: 'scatter', points: [[5, -0.8], [6, 0.31], [7, 1.32], [8, -0.37], [9, -0.46]], line: { b0: 0, b1: 0 }, yRange: [-1.6, 1.6], xRange: [4.5, 9.5], height: 220,
      xLabel: 'x', yLabel: 'eᵢ',
      caption: { pl: 'Wykres rezyduów: punkty powinny tworzyć bezładną chmurę wokół zera', en: 'Residual plot: the points should form a structureless cloud around zero', ru: 'График остатков: точки должны образовывать бесформенное облако вокруг нуля' } },
    ans1: Object.assign({ type: 'scatter', points: pts(ansX, ans[0]), line: ansLine, caption: 'I' }, box),
    ans2: Object.assign({ type: 'scatter', points: pts(ansX, ans[1]), line: ansLine, caption: 'II' }, box),
    ans3: Object.assign({ type: 'scatter', points: pts(ansX, ans[2]), line: ansLine, caption: 'III' }, box),
    ans4: Object.assign({ type: 'scatter', points: pts(x4, y4), line: ansLine, caption: 'IV' }, box),
    exStudy: { type: 'scatter', points: [[2, 34], [4, 50], [5, 49], [7, 63], [8, 66], [10, 80]], line: { b0: 24.143, b1: 5.476, label: 'ŷ = 24,14 + 5,48x' },
      xLabel: { pl: 'godziny nauki', en: 'hours of study', ru: 'часы учёбы' }, yLabel: { pl: 'punkty', en: 'points', ru: 'баллы' } }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Czy wydatki na reklamę „przekładają się” na sprzedaż? Mierzymy siłę związku liniowego **współczynnikiem korelacji**, dopasowujemy **prostą regresji** metodą najmniejszych kwadratów, oceniamy ją ($R^2$, testy) i robimy **prognozy**.',
    lecture: md`
# Wykres rozrzutu i korelacja z próby

Mamy próbkę par $(x_1,y_1),\dots,(x_n,y_n)$. Badamy zależność $Y$ od $X$: $X$ — zmienna **objaśniająca** (niezależna), $Y$ — **objaśniana** (zależna). Pierwszy krok: **wykres rozrzutu** — każda para to punkt na płaszczyźnie. {lecture:W11–12}

::: def W11–12 | Współczynnik korelacji z próby
$$r = \frac{1}{n-1}\sum_{i=1}^n\left(\frac{x_i-\bar x}{s_X}\right)\left(\frac{y_i-\bar y}{s_Y}\right) = \frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum(x_i-\bar x)^2\,\sum(y_i-\bar y)^2}}$$
Własności jak dla $\rho$ z tematu 6: $-1\le r\le1$; $|r| = 1$ — punkty dokładnie na prostej; znak = kierunek zależności.
:::

::: tip own | Jak czytać wartość r (orientacyjnie)
$|r|<0{,}3$ — słaba zależność liniowa · $0{,}3$–$0{,}7$ — umiarkowana · $>0{,}7$ — silna. To tylko umowna skala, nie reguła z wykładu.
:::

::: warn own | Korelacja ≠ przyczynowość
Sprzedaż lodów i liczba utonięć są dodatnio skorelowane — bo obie rosną latem. Silne $r$ nie mówi, **co jest przyczyną**. A $r\approx0$ nie znaczy „brak związku” — tylko brak związku **liniowego** (przypomnij sobie $Y = X^2$ z tematu 6).
:::

# Prosta regresji — metoda najmniejszych kwadratów

Szukamy prostej $\hat y = b_0 + b_1x$, która „najlepiej” pasuje do punktów. Dla każdego punktu **rezyduum** (błąd) to $e_i = y_i - \hat y_i$. Minimalizujemy sumę kwadratów błędów:
$$S(b_0,b_1) = \sum_{i=1}^n\big(y_i - (b_0+b_1x_i)\big)^2 \to \min$$
Przyrównując pochodne cząstkowe do zera, dostajemy:

::: formula W11–12 | Współczynniki prostej regresji
$$b_1 = \frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2} = \frac{S_{xy}}{S_{xx}},\qquad b_0 = \bar y - b_1\bar x$$
$b_1$ — współczynnik kierunkowy (o ile średnio zmienia się $y$, gdy $x$ rośnie o 1), $b_0$ — wyraz wolny. Prosta zawsze przechodzi przez punkt $(\bar x, \bar y)$.
:::

::: formula own | Wzory rachunkowe (z sum)
$$S_{xx} = \sum x_i^2 - \frac{(\sum x_i)^2}{n},\quad S_{yy} = \sum y_i^2 - \frac{(\sum y_i)^2}{n},\quad S_{xy} = \sum x_iy_i - \frac{\sum x_i\sum y_i}{n}$$
$$b_1 = \frac{S_{xy}}{S_{xx}} = r\,\frac{s_Y}{s_X},\qquad r = \frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}$$
:::

::: example W11–12 | Reklama i dochód
| miesiąc | 1 | 2 | 3 | 4 | 5 |
|---|---:|---:|---:|---:|---:|
| reklama $x$ [10 tys. zł] | 5 | 6 | 7 | 8 | 9 |
| dochód $y$ [100 tys. zł] | 4,5 | 6,5 | 8,4 | 7,6 | 8,4 |

$\bar x = 7$, $\bar y = 7{,}08$, $s_X = 1{,}58$, $s_Y = 1{,}64$, $r\approx0{,}858$ — silna dodatnia korelacja.
$b_1 = \frac{8{,}9}{10} = 0{,}89$, $b_0 = 7{,}08 - 0{,}89\cdot7 = 0{,}85$, czyli $\hat y = 0{,}85 + 0{,}89x$.
Prognoza przy wydatkach 100 tys. zł ($x = 10$): $\hat y = 0{,}85 + 8{,}9 = 9{,}75$ (czyli 975 tys. zł).
:::

@chart adScatter

# Jak dobrze prosta pasuje? R²

::: formula W11–12 | Rozkład zmienności
$$\underbrace{\sum(y_i-\bar y)^2}_{SST\ \text{(całkowita)}} = \underbrace{\sum(y_i-\hat y_i)^2}_{SSE\ \text{(błędy)}} + \underbrace{\sum(\hat y_i-\bar y)^2}_{SSR\ \text{(wyjaśniona)}}$$
$$R^2 = \frac{SSR}{SST} = 1-\frac{SSE}{SST}\qquad\text{i w regresji z jedną zmienną: } R^2 = r^2$$
:::

$R^2$ (**współczynnik determinacji**) to odsetek zmienności $Y$ „wyjaśniony” przez liniową zależność od $X$.

::: example W11–12 | ciąg dalszy
$SST = 10{,}748$, $SSE = 2{,}827$, $SSR = 7{,}921$, $R^2 = \frac{7{,}921}{10{,}748}\approx0{,}737$ ($= 0{,}858^2$). Zmienność dochodu jest w **ok. 74%** wyjaśniona przez zmienność wydatków na reklamę.
:::

# Model regresji liniowej

Żeby testować i budować przedziały, potrzebny jest model probabilistyczny:

::: def W11–12 | Model regresji liniowej
$$Y_i = \beta_0 + \beta_1x_i + \varepsilon_i,\qquad i = 1,\dots,n$$
$\varepsilon_i$ — niezależne błędy losowe o średniej 0 i wariancji $\sigma^2$; $x_i$ — znane liczby (nie wszystkie równe). $b_0$, $b_1$ są **nieobciążonymi** estymatorami $\beta_0$, $\beta_1$.
:::

::: formula W11–12 | Błędy standardowe
$$S^2 = \frac{SSE}{n-2}\ \text{(błąd średniokwadratowy, } n-2 \text{ st. sw.)},\qquad S = \sqrt{S^2}$$
$$SE(b_1) = \frac{S}{\sqrt{S_{xx}}},\qquad SE(b_0) = S\sqrt{\frac1n+\frac{\bar x^2}{S_{xx}}}$$
Jeśli $\varepsilon_i\sim N(0,\sigma)$, to $\dfrac{b_1-\beta_1}{SE(b_1)}\sim t_{n-2}$ i $\dfrac{b_0-\beta_0}{SE(b_0)}\sim t_{n-2}$.
:::

## Testy i przedziały dla współczynników

::: formula W11–12 | Test dla β₁ (najważniejszy: czy X w ogóle wpływa na Y?)
$$H_0:\ \beta_1 = \beta_{1,0}\quad(\text{najczęściej } 0),\qquad T = \frac{b_1-\beta_{1,0}}{SE(b_1)}\sim t_{n-2}$$
Zbiory krytyczne jak zwykle: $|t|\ge t_{1-\alpha/2,\,n-2}$ (dwustronny) itd. Przedział ufności: $b_1\pm t_{1-\alpha/2,\,n-2}\,SE(b_1)$ (analogicznie dla $\beta_0$).
:::

::: note W11–12 | Test F
$H_0:\ \beta_1 = 0$ można też badać statystyką $F = \frac{SSR/1}{SSE/(n-2)}\sim F(1, n-2)$. Ponieważ $F = T^2$, to ten sam test co test t. Liczby stopni swobody: $SST$ — $n-1$ = $SSE$ — $n-2$ + $SSR$ — 1.
:::

::: example W11–12 | Zadanie z wykładu: produkcja a energia
Dla 115 par obserwacji: $\widehat{\text{PRODUKCJA}} = 6{,}40 + 2{,}20\cdot\text{ENERGIA}$ (tys. zł), $SE(b_0) = 2{,}20$, $SE(b_1) = 0{,}11$, $R^2 = 0{,}86$.
- (a) prognoza dla energii 2 tys. zł: $6{,}40+2{,}20\cdot2 = 10{,}8$ tys. zł;
- (b) model wyjaśnia **86%** zmienności produkcji;
- (c) $H_0:\ \beta_1 = 0$, $H_1:\ \beta_1\ne0$; $t = \frac{2{,}20}{0{,}11} = 20$; 113 st. sw. → kwantyl ≈ $z_{0{,}995} = 2{,}576$; $20\ge2{,}576$ → współczynnik kierunkowy jest **istotny** ($\alpha = 0{,}01$).
:::

# Prognoza

Dla nowej wartości $x_0$ mamy $\hat y_0 = b_0+b_1x_0$. Są **dwa różne** przedziały:

::: formula W11–12 | Przedział dla średniej wartości Y przy x₀ i dla pojedynczej prognozy
$$\text{średnia } \mu_Y(x_0):\quad \hat y_0\pm t_{1-\alpha/2,\,n-2}\cdot S\sqrt{\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$$
$$\text{pojedyncza wartość } Y(x_0):\quad \hat y_0\pm t_{1-\alpha/2,\,n-2}\cdot S\sqrt{1+\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$$
:::

::: intuition
Przedział dla **średniej** mówi, gdzie leży „prawdziwa prosta” w punkcie $x_0$. Przedział **prognozy** dotyczy konkretnego przyszłego miesiąca — musi uwzględnić jeszcze losowy błąd $\varepsilon$ tego miesiąca (dodatkowe „1+” pod pierwiastkiem), więc jest zawsze szerszy. Oba rosną, gdy $x_0$ oddala się od $\bar x$ — **ekstrapolacja** jest ryzykowna.
:::

::: example W11–12 | Reklama: przedziały 90% przy x₀ = 10
$S^2 = \frac{2{,}827}{3}\approx0{,}9423$, więc $S\approx0{,}971$; $S_{xx} = 10$; $t_{0{,}95;3} = 2{,}353$.
- średnia: $SE = 0{,}971\sqrt{0{,}2+0{,}9}\approx1{,}018$ → $9{,}75\pm2{,}40 = [7{,}35;\ 12{,}15]$;
- prognoza: $SE = 0{,}971\sqrt{1+0{,}2+0{,}9}\approx1{,}407$ → $9{,}75\pm3{,}31 = [6{,}44;\ 13{,}06]$.

::: own | Uwaga do slajdu
Na slajdzie liczba 0,9423 została podpisana jako $S$, ale to jest $S^2$; poprawnie $S = \sqrt{0{,}9423}\approx0{,}971$. Wyniki w tabeli komputerowej z wykładu (7,354–12,146 oraz 6,439–13,061) odpowiadają właśnie tej poprawnej wartości.
:::
:::

# Analiza rezyduów — czy model jest dobry?

Wnioski z testów są poprawne tylko, jeśli model liniowy pasuje. Rezydua $e_i = y_i-\hat y_i$ powinny wyglądać jak **losowy szum**: bezładna chmura wokół zera, bez trendu i „lejka”. {lecture:W11–12}

@chart adResid

Typowe problemy i co robić:
- **rozkład błędów nie jest normalny** — widać na histogramie / wykresie kwantylowym rezyduów;
- **zależność nie jest liniowa** (np. $Y = x^2+\varepsilon$) — rezydua układają się w łuk; pomaga przekształcenie zmiennej ($x' = x^2$, $\log x$, $\sqrt x$);
- **wariancja błędów nie jest stała** (rezydua rozszerzają się jak lejek) — ważona metoda najmniejszych kwadratów z wagami $w_i = 1/\sigma_i^2$;
- **brakuje innych zmiennych objaśniających** — model jest nieadekwatny.

Rezydua **studentyzowane**: $r_i = \dfrac{e_i}{SE(e_i)}$, gdzie $SE(e_i) = S\sqrt{1-\frac1n-\frac{(x_i-\bar x)^2}{S_{xx}}}$; wartości $|r_i|>2$ są podejrzane.

## Kwartet Anscombe'a — zawsze rysuj dane!

Cztery zestawy danych mają (prawie) identyczne: średnie, wariancje, $r$, prostą regresji $\hat y = 3+0{,}5x$ i $R^2\approx0{,}67$. A wyglądają zupełnie inaczej: {lecture:W11–12}

::: grid
@chart ans1
@chart ans2
@chart ans3
@chart ans4
:::

I — typowa zależność liniowa z szumem; II — wyraźny **łuk** (zależność nieliniowa); III — idealna prosta z jedną **obserwacją odstającą**; IV — cała „zależność” wynika z **jednego punktu**. Same liczby tego nie pokażą — potrzebny jest wykres rozrzutu i wykres rezyduów.

# W Excelu

~~~excel Regresja liniowa (x w A2:A6, y w B2:B6)
D1: =CORREL(A2:A6,B2:B6)            // r = 0,858
D2: =SLOPE(B2:B6,A2:A6)             // b1 = 0,89   (uwaga: najpierw y, potem x!)
D3: =INTERCEPT(B2:B6,A2:A6)         // b0 = 0,85
D4: =RSQ(B2:B6,A2:A6)               // R² = 0,737
D5: =FORECAST(10,B2:B6,A2:A6)       // prognoza dla x = 10 → 9,75
D6: =STEYX(B2:B6,A2:A6)             // S = 0,971 (błąd standardowy regresji)
D7: =D6/SQRT(DEVSQ(A2:A6))          // SE(b1)
D8: =D2/D7                          // t dla H0: β1 = 0
D9: =T.DIST.2T(ABS(D8),COUNT(A2:A6)-2)   // p-wartość
~~~

::: tip own
Wszystko naraz: *Dane → Analiza danych → Regresja* (dodatek Analysis ToolPak) — daje współczynniki, ich błędy standardowe, statystyki t, p-wartości, $R^2$, tabelę ANOVA i rezydua. Na wykresie punktowym: *Dodaj linię trendu → Liniowa → Wyświetl równanie i R²*.
:::

~~~python Regresja w scipy
import numpy as np
from scipy import stats

x = np.array([5, 6, 7, 8, 9]); y = np.array([4.5, 6.5, 8.4, 7.6, 8.4])
res = stats.linregress(x, y)
print(res.slope, res.intercept, res.rvalue**2)   # 0.89, 0.85, 0.737
print(res.stderr, res.pvalue)                    # SE(b1) ≈ 0.307, p-wartość testu β1 = 0

n, x0 = len(x), 10
y_hat = res.intercept + res.slope * x0
S = np.sqrt(np.sum((y - (res.intercept + res.slope * x))**2) / (n - 2))
Sxx = np.sum((x - x.mean())**2)
t = stats.t.ppf(0.95, n - 2)
print(y_hat - t * S * np.sqrt(1 + 1/n + (x0 - x.mean())**2 / Sxx),
      y_hat + t * S * np.sqrt(1 + 1/n + (x0 - x.mean())**2 / Sxx))   # przedział prognozy 90%
~~~

::: summary
- $r = \frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}$, $-1\le r\le1$; korelacja ≠ przyczynowość; $r=0$ ≠ brak związku.
- MNK: $b_1 = \frac{S_{xy}}{S_{xx}}$, $b_0 = \bar y - b_1\bar x$; prosta przechodzi przez $(\bar x,\bar y)$.
- $SST = SSE+SSR$, $R^2 = SSR/SST = r^2$.
- $S^2 = SSE/(n-2)$, $SE(b_1) = S/\sqrt{S_{xx}}$; test $\beta_1 = 0$: $t = b_1/SE(b_1)\sim t_{n-2}$.
- Przedział dla średniej $\mu_Y(x_0)$ vs szerszy przedział prognozy (dodatkowe „1+”).
- Zawsze patrz na wykres rozrzutu i rezyduów (kwartet Anscombe'a).
:::
`,

    cheatsheet: md`
## Sumy pomocnicze
$S_{xx}=\sum(x-\bar x)^2=\sum x^2-\frac{(\sum x)^2}{n}$ · $S_{yy}$ analogicznie · $S_{xy}=\sum(x-\bar x)(y-\bar y)=\sum xy-\frac{\sum x\sum y}{n}$

## Korelacja i prosta
$$r=\frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}\qquad b_1=\frac{S_{xy}}{S_{xx}}=r\frac{s_y}{s_x}\qquad b_0=\bar y-b_1\bar x$$
- $\hat y=b_0+b_1x$ przechodzi przez $(\bar x,\bar y)$; rezyduum $e_i=y_i-\hat y_i$, $\sum e_i=0$

## Dopasowanie
$SST=S_{yy}$ · $SSR=b_1S_{xy}$ · $SSE=SST-SSR$ · $R^2=\frac{SSR}{SST}=r^2$

## Wnioskowanie (błędy normalne)
- $S^2=\frac{SSE}{n-2}$, $SE(b_1)=\frac{S}{\sqrt{S_{xx}}}$, $SE(b_0)=S\sqrt{\frac1n+\frac{\bar x^2}{S_{xx}}}$
- test $\beta_1=0$: $t=\frac{b_1}{SE(b_1)}\sim t_{n-2}$; $F=t^2$
- przedział dla $\beta_1$: $b_1\pm t_{1-\alpha/2,n-2}SE(b_1)$

## Prognoza w x₀
- średnia: $\hat y_0\pm t\,S\sqrt{\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$
- pojedyncza: $\hat y_0\pm t\,S\sqrt{1+\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$

## Excel
‹CORREL› ‹SLOPE(y,x)› ‹INTERCEPT(y,x)› ‹RSQ› ‹FORECAST(x0,y,x)› ‹STEYX› ‹LINEST› · PL: ‹WSP.KORELACJI› ‹NACHYLENIE› ‹ODCIĘTA› ‹R.KWADRAT› ‹REGLINX› ‹REGBŁSTD›
`,

    exercises: [
      {
        id: 'e1', own: true, title: 'Godziny nauki a wynik egzaminu — pełna analiza',
        text: md`
Sześciu studentów podało liczbę godzin nauki $x$ i wynik egzaminu $y$ (pkt):

| $x$ | 2 | 4 | 5 | 7 | 8 | 10 |
|---|---:|---:|---:|---:|---:|---:|
| $y$ | 34 | 50 | 49 | 63 | 66 | 80 |

a) Oblicz współczynnik korelacji. b) Wyznacz prostą regresji $y$ względem $x$ i zinterpretuj $b_1$. c) Oblicz $R^2$. d) Na poziomie 0,05 zbadaj istotność współczynnika kierunkowego. e) Wyznacz prognozę i przedziały 95% (dla średniej i dla pojedynczego studenta) przy $x_0 = 9$ h.
`,
        hint: md`$\bar x = 6$, $\bar y = 57$. Policz $S_{xx}$, $S_{yy}$, $S_{xy}$ w tabelce odchyleń. $t_{0{,}975;4} = 2{,}776$.`,
        solution: md`
Odchylenia $x-6$: −4, −2, −1, 1, 2, 4; $y-57$: −23, −7, −8, 6, 9, 23.
$S_{xx} = 42$, $S_{yy} = 1288$, $S_{xy} = 92+14+8+6+18+92 = 230$.

**a)** $r = \frac{230}{\sqrt{42\cdot1288}}\approx0{,}989$ — bardzo silna dodatnia zależność.
**b)** $b_1 = \frac{230}{42}\approx5{,}476$, $b_0 = 57-5{,}476\cdot6\approx24{,}14$: $\hat y = 24{,}14+5{,}48x$. Każda dodatkowa godzina nauki to średnio ok. **5,5 pkt** więcej.
**c)** $SSR = b_1S_{xy}\approx1259{,}5$, $SSE\approx28{,}5$, $R^2\approx0{,}978$ — model wyjaśnia ok. 98% zmienności wyników.
**d)** $S^2 = \frac{28{,}48}{4}\approx7{,}12$, $S\approx2{,}668$, $SE(b_1) = \frac{2{,}668}{\sqrt{42}}\approx0{,}412$; $t = \frac{5{,}476}{0{,}412}\approx13{,}3\ge2{,}776$ → $\beta_1$ **istotny**.
**e)** $\hat y_0 = 24{,}14+5{,}476\cdot9\approx73{,}4$ pkt.
- średnia: $SE = 2{,}668\sqrt{\frac16+\frac{9}{42}}\approx1{,}647$ → $73{,}4\pm4{,}57 = [68{,}9;\ 78{,}0]$;
- pojedynczy student: $SE = 2{,}668\sqrt{1+\frac16+\frac{9}{42}}\approx3{,}136$ → $73{,}4\pm8{,}71 = [64{,}7;\ 82{,}1]$.

@chart exStudy
`,
        answer: md`$r\approx0{,}989$; $\hat y = 24{,}14+5{,}48x$; $R^2\approx0{,}978$; $t\approx13{,}3$ (istotny); $\hat y(9)\approx73{,}4$, przedziały [68,9; 78,0] i [64,7; 82,1].`
      },
      {
        id: 'e2', own: true, title: 'Odczyt wydruku regresji: cena mieszkania',
        text: md`
Na podstawie 52 ogłoszeń dopasowano model: $\widehat{\text{cena}} = 12{,}5 + 0{,}8\cdot\text{powierzchnia}$ (cena w tys. zł, powierzchnia w m²), $SE(b_0) = 3{,}1$, $SE(b_1) = 0{,}2$, $R^2 = 0{,}64$.
a) Jaka jest przewidywana cena mieszkania 60 m²? b) Jaki procent zmienności cen wyjaśnia model? c) Czy na poziomie 0,05 powierzchnia istotnie wpływa na cenę? d) Podaj przedział ufności 95% dla $\beta_1$.
`,
        hint: md`To zadanie w stylu przykładu „PRODUKCJA–ENERGIA” z wykładu. 50 stopni swobody: $t_{0{,}975;50}\approx2{,}009$.`,
        solution: md`
a) $12{,}5+0{,}8\cdot60 = 60{,}5$ tys. zł.
b) $R^2 = 0{,}64$ → **64%**.
c) $H_0:\ \beta_1=0$, $H_1:\ \beta_1\ne0$; $t = \frac{0{,}8}{0{,}2} = 4$; $|t|\ge2{,}009$ → **odrzucamy $H_0$**: powierzchnia istotnie wpływa na cenę.
d) $0{,}8\pm2{,}009\cdot0{,}2 = [0{,}40;\ 1{,}20]$ tys. zł za m² (przedział nie zawiera 0 — zgodnie z testem).
`,
        answer: md`a) 60,5 tys. zł; b) 64%; c) $t = 4$ → istotny; d) [0,40; 1,20].`
      },
      {
        id: 'e3', own: true, title: 'Regresja z samych sum',
        text: md`
Dla $n = 10$ par obliczono: $\sum x = 50$, $\sum y = 120$, $\sum x^2 = 300$, $\sum y^2 = 1580$, $\sum xy = 660$. Wyznacz $r$, prostą regresji i $R^2$.
`,
        hint: md`Wzory rachunkowe: $S_{xx} = \sum x^2 - (\sum x)^2/n$ itd.`,
        solution: md`
$S_{xx} = 300-\frac{2500}{10} = 50$; $S_{yy} = 1580-\frac{14\,400}{10} = 140$; $S_{xy} = 660-\frac{50\cdot120}{10} = 60$.
$r = \frac{60}{\sqrt{50\cdot140}}\approx0{,}717$; $b_1 = \frac{60}{50} = 1{,}2$; $b_0 = 12-1{,}2\cdot5 = 6$ → $\hat y = 6+1{,}2x$; $R^2 = r^2\approx0{,}514$.
`,
        answer: md`$r\approx0{,}717$; $\hat y = 6+1{,}2x$; $R^2\approx0{,}51$.`
      },
      {
        id: 'e4', own: true, title: 'Prawda czy fałsz? (interpretacja)',
        text: md`
1. Jeśli $r = 0$, to między $X$ i $Y$ nie ma żadnego związku.
2. Jeśli $R^2 = 0{,}81$, to $r = 0{,}9$ lub $r = -0{,}9$.
3. Wysoka korelacja między liczbą strażaków na miejscu pożaru a wysokością strat dowodzi, że strażacy powodują straty.
4. Przedział prognozy dla pojedynczej wartości jest zawsze szerszy niż przedział dla średniej przy tym samym $x_0$.
5. Prognozowanie daleko poza zakresem obserwowanych $x$ jest tak samo wiarygodne jak w środku danych.
`,
        hint: md`Przypomnij sobie przykład $Y = X^2$ (temat 6), wzór $R^2 = r^2$ i dodatkowe „1+” w przedziale prognozy.`,
        solution: md`
1. **Fałsz** — $r = 0$ oznacza brak związku **liniowego** (może być np. paraboliczny).
2. **Prawda** — w regresji z jedną zmienną $R^2 = r^2$; znak $r$ = znak $b_1$.
3. **Fałsz** — korelacja ≠ przyczynowość; obie wielkości zależą od wielkości pożaru (zmienna ukryta).
4. **Prawda** — dochodzi losowy błąd pojedynczej obserwacji („1+” pod pierwiastkiem).
5. **Fałsz** — człon $(x_0-\bar x)^2$ powiększa przedziały, a poza danymi nie wiemy nawet, czy zależność jest liniowa.
`,
        answer: md`Prawdziwe: 2 i 4.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'Does advertising spending “translate” into sales? We measure the strength of a linear relationship with the **correlation coefficient**, fit a **regression line** by least squares, assess it ($R^2$, tests) and make **predictions**.',
    lecture: md`
# Scatter plot and sample correlation

We have a sample of pairs $(x_1,y_1),\dots,(x_n,y_n)$. We study how $Y$ depends on $X$: $X$ — the **explanatory** (independent) variable, $Y$ — the **response** (dependent) variable. First step: a **scatter plot** — every pair is a point in the plane. {lecture:W11–12}

::: def W11–12 | Sample correlation coefficient
$$r = \frac{1}{n-1}\sum_{i=1}^n\left(\frac{x_i-\bar x}{s_X}\right)\left(\frac{y_i-\bar y}{s_Y}\right) = \frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum(x_i-\bar x)^2\,\sum(y_i-\bar y)^2}}$$
Properties as for $\rho$ in topic 6: $-1\le r\le1$; $|r| = 1$ — points exactly on a line; sign = direction of the relationship.
:::

::: tip own | Reading the value of r (roughly)
$|r|<0.3$ — weak linear relationship · $0.3$–$0.7$ — moderate · $>0.7$ — strong. This is only a convention, not a rule from the lecture.
:::

::: warn own | Correlation ≠ causation
Ice-cream sales and drownings are positively correlated — because both rise in summer. A strong $r$ says nothing about **what causes what**. And $r\approx0$ doesn’t mean “no relationship” — only no **linear** one (recall $Y = X^2$ from topic 6).
:::

# The regression line — least squares

We look for the line $\hat y = b_0 + b_1x$ that fits the points “best”. For each point the **residual** (error) is $e_i = y_i - \hat y_i$. We minimise the sum of squared errors:
$$S(b_0,b_1) = \sum_{i=1}^n\big(y_i - (b_0+b_1x_i)\big)^2 \to \min$$
Setting the partial derivatives to zero gives:

::: formula W11–12 | Regression coefficients
$$b_1 = \frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2} = \frac{S_{xy}}{S_{xx}},\qquad b_0 = \bar y - b_1\bar x$$
$b_1$ — the slope (how much $y$ changes on average when $x$ grows by 1), $b_0$ — the intercept. The line always passes through $(\bar x, \bar y)$.
:::

::: formula own | Computational formulas (from sums)
$$S_{xx} = \sum x_i^2 - \frac{(\sum x_i)^2}{n},\quad S_{yy} = \sum y_i^2 - \frac{(\sum y_i)^2}{n},\quad S_{xy} = \sum x_iy_i - \frac{\sum x_i\sum y_i}{n}$$
$$b_1 = \frac{S_{xy}}{S_{xx}} = r\,\frac{s_Y}{s_X},\qquad r = \frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}$$
:::

::: example W11–12 | Advertising and revenue
| month | 1 | 2 | 3 | 4 | 5 |
|---|---:|---:|---:|---:|---:|
| advertising $x$ [10k PLN] | 5 | 6 | 7 | 8 | 9 |
| revenue $y$ [100k PLN] | 4.5 | 6.5 | 8.4 | 7.6 | 8.4 |

$\bar x = 7$, $\bar y = 7.08$, $s_X = 1.58$, $s_Y = 1.64$, $r\approx0.858$ — a strong positive correlation.
$b_1 = \frac{8.9}{10} = 0.89$, $b_0 = 7.08 - 0.89\cdot7 = 0.85$, so $\hat y = 0.85 + 0.89x$.
Prediction for spending of 100k PLN ($x = 10$): $\hat y = 0.85 + 8.9 = 9.75$ (i.e. 975k PLN).
:::

@chart adScatter

# How well does the line fit? R²

::: formula W11–12 | Decomposition of variability
$$\underbrace{\sum(y_i-\bar y)^2}_{SST\ \text{(total)}} = \underbrace{\sum(y_i-\hat y_i)^2}_{SSE\ \text{(errors)}} + \underbrace{\sum(\hat y_i-\bar y)^2}_{SSR\ \text{(explained)}}$$
$$R^2 = \frac{SSR}{SST} = 1-\frac{SSE}{SST}\qquad\text{and in simple regression: } R^2 = r^2$$
:::

$R^2$ (the **coefficient of determination**) is the share of the variability of $Y$ “explained” by the linear dependence on $X$.

::: example W11–12 | continued
$SST = 10.748$, $SSE = 2.827$, $SSR = 7.921$, $R^2 = \frac{7.921}{10.748}\approx0.737$ ($= 0.858^2$). About **74%** of the variability of revenue is explained by the variability of advertising spending.
:::

# The linear regression model

To test and build intervals we need a probabilistic model:

::: def W11–12 | Linear regression model
$$Y_i = \beta_0 + \beta_1x_i + \varepsilon_i,\qquad i = 1,\dots,n$$
$\varepsilon_i$ — independent random errors with mean 0 and variance $\sigma^2$; $x_i$ — known numbers (not all equal). $b_0$, $b_1$ are **unbiased** estimators of $\beta_0$, $\beta_1$.
:::

::: formula W11–12 | Standard errors
$$S^2 = \frac{SSE}{n-2}\ \text{(mean squared error, } n-2 \text{ df)},\qquad S = \sqrt{S^2}$$
$$SE(b_1) = \frac{S}{\sqrt{S_{xx}}},\qquad SE(b_0) = S\sqrt{\frac1n+\frac{\bar x^2}{S_{xx}}}$$
If $\varepsilon_i\sim N(0,\sigma)$, then $\dfrac{b_1-\beta_1}{SE(b_1)}\sim t_{n-2}$ and $\dfrac{b_0-\beta_0}{SE(b_0)}\sim t_{n-2}$.
:::

## Tests and intervals for the coefficients

::: formula W11–12 | Test for β₁ (the key one: does X affect Y at all?)
$$H_0:\ \beta_1 = \beta_{1,0}\quad(\text{usually } 0),\qquad T = \frac{b_1-\beta_{1,0}}{SE(b_1)}\sim t_{n-2}$$
Critical regions as usual: $|t|\ge t_{1-\alpha/2,\,n-2}$ (two-sided) etc. Confidence interval: $b_1\pm t_{1-\alpha/2,\,n-2}\,SE(b_1)$ (similarly for $\beta_0$).
:::

::: note W11–12 | The F test
$H_0:\ \beta_1 = 0$ can also be tested with $F = \frac{SSR/1}{SSE/(n-2)}\sim F(1, n-2)$. Since $F = T^2$, it is the same test as the t test. Degrees of freedom: $SST$ — $n-1$ = $SSE$ — $n-2$ + $SSR$ — 1.
:::

::: example W11–12 | A lecture problem: production and energy
For 115 pairs: $\widehat{\text{PRODUCTION}} = 6.40 + 2.20\cdot\text{ENERGY}$ (thousand PLN), $SE(b_0) = 2.20$, $SE(b_1) = 0.11$, $R^2 = 0.86$.
- (a) prediction for energy worth 2k PLN: $6.40+2.20\cdot2 = 10.8$k PLN;
- (b) the model explains **86%** of the variability of production;
- (c) $H_0:\ \beta_1 = 0$, $H_1:\ \beta_1\ne0$; $t = \frac{2.20}{0.11} = 20$; 113 df → quantile ≈ $z_{0.995} = 2.576$; $20\ge2.576$ → the slope is **significant** ($\alpha = 0.01$).
:::

# Prediction

For a new value $x_0$ we have $\hat y_0 = b_0+b_1x_0$. There are **two different** intervals:

::: formula W11–12 | Interval for the mean of Y at x₀ and for a single prediction
$$\text{mean } \mu_Y(x_0):\quad \hat y_0\pm t_{1-\alpha/2,\,n-2}\cdot S\sqrt{\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$$
$$\text{single value } Y(x_0):\quad \hat y_0\pm t_{1-\alpha/2,\,n-2}\cdot S\sqrt{1+\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$$
:::

::: intuition
The interval for the **mean** says where the “true line” lies at $x_0$. The **prediction** interval is about one specific future month — it must also include that month’s random error $\varepsilon$ (the extra “1+” under the root), so it is always wider. Both grow as $x_0$ moves away from $\bar x$ — **extrapolation** is risky.
:::

::: example W11–12 | Advertising: 90% intervals at x₀ = 10
$S^2 = \frac{2.827}{3}\approx0.9423$, so $S\approx0.971$; $S_{xx} = 10$; $t_{0.95;3} = 2.353$.
- mean: $SE = 0.971\sqrt{0.2+0.9}\approx1.018$ → $9.75\pm2.40 = [7.35;\ 12.15]$;
- prediction: $SE = 0.971\sqrt{1+0.2+0.9}\approx1.407$ → $9.75\pm3.31 = [6.44;\ 13.06]$.

::: own | A note on the slide
On the slide 0.9423 is labelled $S$, but it is $S^2$; correctly $S = \sqrt{0.9423}\approx0.971$. The results in the lecture’s computer table (7.354–12.146 and 6.439–13.061) correspond exactly to this correct value.
:::
:::

# Residual analysis — is the model good?

Test conclusions are valid only if the linear model fits. The residuals $e_i = y_i-\hat y_i$ should look like **random noise**: a structureless cloud around zero, with no trend and no “funnel”. {lecture:W11–12}

@chart adResid

Typical problems and remedies:
- **errors not normal** — visible on a histogram / quantile plot of the residuals;
- **relationship not linear** (e.g. $Y = x^2+\varepsilon$) — residuals form an arc; transform the variable ($x' = x^2$, $\log x$, $\sqrt x$);
- **non-constant error variance** (residuals widen like a funnel) — weighted least squares with weights $w_i = 1/\sigma_i^2$;
- **missing explanatory variables** — the model is inadequate.

**Studentised** residuals: $r_i = \dfrac{e_i}{SE(e_i)}$, where $SE(e_i) = S\sqrt{1-\frac1n-\frac{(x_i-\bar x)^2}{S_{xx}}}$; values $|r_i|>2$ are suspicious.

## Anscombe’s quartet — always plot the data!

Four data sets have (almost) identical means, variances, $r$, regression line $\hat y = 3+0.5x$ and $R^2\approx0.67$. Yet they look completely different: {lecture:W11–12}

::: grid
@chart ans1
@chart ans2
@chart ans3
@chart ans4
:::

I — a typical linear relationship with noise; II — a clear **arc** (a non-linear relationship); III — a perfect line with one **outlier**; IV — the whole “relationship” comes from **one point**. The numbers alone won’t show it — you need a scatter plot and a residual plot.

# In Excel

~~~excel Linear regression (x in A2:A6, y in B2:B6)
D1: =CORREL(A2:A6,B2:B6)            // r = 0.858
D2: =SLOPE(B2:B6,A2:A6)             // b1 = 0.89   (note: y first, then x!)
D3: =INTERCEPT(B2:B6,A2:A6)         // b0 = 0.85
D4: =RSQ(B2:B6,A2:A6)               // R² = 0.737
D5: =FORECAST(10,B2:B6,A2:A6)       // prediction for x = 10 → 9.75
D6: =STEYX(B2:B6,A2:A6)             // S = 0.971 (standard error of the regression)
D7: =D6/SQRT(DEVSQ(A2:A6))          // SE(b1)
D8: =D2/D7                          // t for H0: β1 = 0
D9: =T.DIST.2T(ABS(D8),COUNT(A2:A6)-2)   // p-value
~~~

::: tip own
Everything at once: *Data → Data Analysis → Regression* (Analysis ToolPak) — gives the coefficients, their standard errors, t statistics, p-values, $R^2$, the ANOVA table and residuals. On a scatter chart: *Add Trendline → Linear → Display equation and R²*.
:::

~~~python Regression in scipy
import numpy as np
from scipy import stats

x = np.array([5, 6, 7, 8, 9]); y = np.array([4.5, 6.5, 8.4, 7.6, 8.4])
res = stats.linregress(x, y)
print(res.slope, res.intercept, res.rvalue**2)   # 0.89, 0.85, 0.737
print(res.stderr, res.pvalue)                    # SE(b1) ≈ 0.307, p-value of β1 = 0

n, x0 = len(x), 10
y_hat = res.intercept + res.slope * x0
S = np.sqrt(np.sum((y - (res.intercept + res.slope * x))**2) / (n - 2))
Sxx = np.sum((x - x.mean())**2)
t = stats.t.ppf(0.95, n - 2)
print(y_hat - t * S * np.sqrt(1 + 1/n + (x0 - x.mean())**2 / Sxx),
      y_hat + t * S * np.sqrt(1 + 1/n + (x0 - x.mean())**2 / Sxx))   # 90% prediction interval
~~~

::: summary
- $r = \frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}$, $-1\le r\le1$; correlation ≠ causation; $r=0$ ≠ no relationship.
- Least squares: $b_1 = \frac{S_{xy}}{S_{xx}}$, $b_0 = \bar y - b_1\bar x$; the line passes through $(\bar x,\bar y)$.
- $SST = SSE+SSR$, $R^2 = SSR/SST = r^2$.
- $S^2 = SSE/(n-2)$, $SE(b_1) = S/\sqrt{S_{xx}}$; test $\beta_1 = 0$: $t = b_1/SE(b_1)\sim t_{n-2}$.
- Interval for the mean $\mu_Y(x_0)$ vs the wider prediction interval (extra “1+”).
- Always look at the scatter and residual plots (Anscombe’s quartet).
:::
`,

    cheatsheet: md`
## Helper sums
$S_{xx}=\sum(x-\bar x)^2=\sum x^2-\frac{(\sum x)^2}{n}$ · $S_{yy}$ likewise · $S_{xy}=\sum(x-\bar x)(y-\bar y)=\sum xy-\frac{\sum x\sum y}{n}$

## Correlation and the line
$$r=\frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}\qquad b_1=\frac{S_{xy}}{S_{xx}}=r\frac{s_y}{s_x}\qquad b_0=\bar y-b_1\bar x$$
- $\hat y=b_0+b_1x$ passes through $(\bar x,\bar y)$; residual $e_i=y_i-\hat y_i$, $\sum e_i=0$

## Fit
$SST=S_{yy}$ · $SSR=b_1S_{xy}$ · $SSE=SST-SSR$ · $R^2=\frac{SSR}{SST}=r^2$

## Inference (normal errors)
- $S^2=\frac{SSE}{n-2}$, $SE(b_1)=\frac{S}{\sqrt{S_{xx}}}$, $SE(b_0)=S\sqrt{\frac1n+\frac{\bar x^2}{S_{xx}}}$
- test $\beta_1=0$: $t=\frac{b_1}{SE(b_1)}\sim t_{n-2}$; $F=t^2$
- interval for $\beta_1$: $b_1\pm t_{1-\alpha/2,n-2}SE(b_1)$

## Prediction at x₀
- mean: $\hat y_0\pm t\,S\sqrt{\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$
- single: $\hat y_0\pm t\,S\sqrt{1+\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$

## Excel
‹CORREL› ‹SLOPE(y,x)› ‹INTERCEPT(y,x)› ‹RSQ› ‹FORECAST(x0,y,x)› ‹STEYX› ‹LINEST›
`,

    exercises: [
      {
        id: 'e1', own: true, title: 'Hours of study and exam score — full analysis',
        text: md`
Six students reported their hours of study $x$ and exam score $y$ (points):

| $x$ | 2 | 4 | 5 | 7 | 8 | 10 |
|---|---:|---:|---:|---:|---:|---:|
| $y$ | 34 | 50 | 49 | 63 | 66 | 80 |

a) Compute the correlation coefficient. b) Find the regression line of $y$ on $x$ and interpret $b_1$. c) Compute $R^2$. d) At level 0.05 test the significance of the slope. e) Give the prediction and 95% intervals (for the mean and for a single student) at $x_0 = 9$ h.
`,
        hint: md`$\bar x = 6$, $\bar y = 57$. Compute $S_{xx}$, $S_{yy}$, $S_{xy}$ from a table of deviations. $t_{0.975;4} = 2.776$.`,
        solution: md`
Deviations $x-6$: −4, −2, −1, 1, 2, 4; $y-57$: −23, −7, −8, 6, 9, 23.
$S_{xx} = 42$, $S_{yy} = 1288$, $S_{xy} = 230$.

**a)** $r = \frac{230}{\sqrt{42\cdot1288}}\approx0.989$ — a very strong positive relationship.
**b)** $b_1\approx5.476$, $b_0\approx24.14$: $\hat y = 24.14+5.48x$. Each extra hour of study gives on average about **5.5 points** more.
**c)** $SSR\approx1259.5$, $SSE\approx28.5$, $R^2\approx0.978$.
**d)** $S^2\approx7.12$, $S\approx2.668$, $SE(b_1)\approx0.412$; $t\approx13.3\ge2.776$ → $\beta_1$ **significant**.
**e)** $\hat y_0\approx73.4$ points.
- mean: $SE\approx1.647$ → $[68.9;\ 78.0]$;
- single student: $SE\approx3.136$ → $[64.7;\ 82.1]$.

@chart exStudy
`,
        answer: md`$r\approx0.989$; $\hat y = 24.14+5.48x$; $R^2\approx0.978$; $t\approx13.3$ (significant); $\hat y(9)\approx73.4$, intervals [68.9; 78.0] and [64.7; 82.1].`
      },
      {
        id: 'e2', own: true, title: 'Reading a regression output: flat prices',
        text: md`
From 52 listings the model was fitted: $\widehat{\text{price}} = 12.5 + 0.8\cdot\text{area}$ (price in thousand PLN, area in m²), $SE(b_0) = 3.1$, $SE(b_1) = 0.2$, $R^2 = 0.64$.
a) What is the predicted price of a 60 m² flat? b) What percentage of price variability does the model explain? c) At level 0.05, does area significantly affect price? d) Give a 95% confidence interval for $\beta_1$.
`,
        hint: md`This follows the “PRODUCTION–ENERGY” lecture example. 50 df: $t_{0.975;50}\approx2.009$.`,
        solution: md`
a) $12.5+0.8\cdot60 = 60.5$k PLN. b) **64%**.
c) $t = \frac{0.8}{0.2} = 4\ge2.009$ → **reject $H_0$**: area significantly affects price.
d) $0.8\pm2.009\cdot0.2 = [0.40;\ 1.20]$k PLN per m² (does not contain 0 — consistent with the test).
`,
        answer: md`a) 60.5k PLN; b) 64%; c) $t = 4$ → significant; d) [0.40; 1.20].`
      },
      {
        id: 'e3', own: true, title: 'Regression from sums only',
        text: md`
For $n = 10$ pairs: $\sum x = 50$, $\sum y = 120$, $\sum x^2 = 300$, $\sum y^2 = 1580$, $\sum xy = 660$. Find $r$, the regression line and $R^2$.
`,
        hint: md`Computational formulas: $S_{xx} = \sum x^2 - (\sum x)^2/n$ etc.`,
        solution: md`
$S_{xx} = 50$; $S_{yy} = 140$; $S_{xy} = 60$. $r = \frac{60}{\sqrt{7000}}\approx0.717$; $b_1 = 1.2$; $b_0 = 12-6 = 6$ → $\hat y = 6+1.2x$; $R^2\approx0.514$.
`,
        answer: md`$r\approx0.717$; $\hat y = 6+1.2x$; $R^2\approx0.51$.`
      },
      {
        id: 'e4', own: true, title: 'True or false? (interpretation)',
        text: md`
1. If $r = 0$, there is no relationship at all between $X$ and $Y$.
2. If $R^2 = 0.81$, then $r = 0.9$ or $r = -0.9$.
3. A high correlation between the number of firefighters at a fire and the amount of damage proves that firefighters cause damage.
4. The prediction interval for a single value is always wider than the interval for the mean at the same $x_0$.
5. Predicting far outside the observed range of $x$ is as reliable as in the middle of the data.
`,
        hint: md`Recall $Y = X^2$ (topic 6), $R^2 = r^2$ and the extra “1+” in the prediction interval.`,
        solution: md`
1. **False** — $r = 0$ means no **linear** relationship (it may be e.g. parabolic).
2. **True** — in simple regression $R^2 = r^2$; the sign of $r$ = the sign of $b_1$.
3. **False** — correlation ≠ causation; both depend on the size of the fire (a hidden variable).
4. **True** — the random error of a single observation adds the “1+” under the root.
5. **False** — the term $(x_0-\bar x)^2$ widens the intervals, and outside the data we don’t even know whether the relationship is linear.
`,
        answer: md`True: 2 and 4.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'Превращаются ли расходы на рекламу в продажи? Измеряем силу линейной связи **коэффициентом корреляции**, строим **линию регрессии** методом наименьших квадратов, оцениваем её ($R^2$, тесты) и делаем **прогнозы**.',
    lecture: md`
# Диаграмма рассеяния и выборочная корреляция

Есть выборка пар $(x_1,y_1),\dots,(x_n,y_n)$. Изучаем зависимость $Y$ от $X$: $X$ — **объясняющая** (независимая) переменная, $Y$ — **объясняемая** (зависимая). Первый шаг — **диаграмма рассеяния**: каждая пара — точка на плоскости. {lecture:W11–12}

::: def W11–12 | Выборочный коэффициент корреляции
$$r = \frac{1}{n-1}\sum_{i=1}^n\left(\frac{x_i-\bar x}{s_X}\right)\left(\frac{y_i-\bar y}{s_Y}\right) = \frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum(x_i-\bar x)^2\,\sum(y_i-\bar y)^2}}$$
Свойства как у $\rho$ из темы 6: $-1\le r\le1$; $|r| = 1$ — точки ровно на прямой; знак = направление связи.
:::

::: tip own | Как читать значение r (ориентировочно)
$|r|<0{,}3$ — слабая линейная связь · $0{,}3$–$0{,}7$ — умеренная · $>0{,}7$ — сильная. Это условная шкала, а не правило из лекции.
:::

::: warn own | Корреляция ≠ причинность
Продажи мороженого и число утоплений положительно коррелируют — потому что оба растут летом. Большое $r$ ничего не говорит о том, **что причина**. А $r\approx0$ не значит «нет связи» — только нет **линейной** (вспомните $Y = X^2$ из темы 6).
:::

# Линия регрессии — метод наименьших квадратов

Ищем прямую $\hat y = b_0 + b_1x$, которая «лучше всего» подходит к точкам. Для каждой точки **остаток** (ошибка) $e_i = y_i - \hat y_i$. Минимизируем сумму квадратов ошибок:
$$S(b_0,b_1) = \sum_{i=1}^n\big(y_i - (b_0+b_1x_i)\big)^2 \to \min$$
Приравнивая частные производные к нулю, получаем:

::: formula W11–12 | Коэффициенты линии регрессии
$$b_1 = \frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sum(x_i-\bar x)^2} = \frac{S_{xy}}{S_{xx}},\qquad b_0 = \bar y - b_1\bar x$$
$b_1$ — угловой коэффициент (на сколько в среднем меняется $y$, когда $x$ растёт на 1), $b_0$ — свободный член. Прямая всегда проходит через $(\bar x, \bar y)$.
:::

::: formula own | Расчётные формулы (через суммы)
$$S_{xx} = \sum x_i^2 - \frac{(\sum x_i)^2}{n},\quad S_{yy} = \sum y_i^2 - \frac{(\sum y_i)^2}{n},\quad S_{xy} = \sum x_iy_i - \frac{\sum x_i\sum y_i}{n}$$
$$b_1 = \frac{S_{xy}}{S_{xx}} = r\,\frac{s_Y}{s_X},\qquad r = \frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}$$
:::

::: example W11–12 | Реклама и доход
| месяц | 1 | 2 | 3 | 4 | 5 |
|---|---:|---:|---:|---:|---:|
| реклама $x$ [10 тыс. зл] | 5 | 6 | 7 | 8 | 9 |
| доход $y$ [100 тыс. зл] | 4,5 | 6,5 | 8,4 | 7,6 | 8,4 |

$\bar x = 7$, $\bar y = 7{,}08$, $s_X = 1{,}58$, $s_Y = 1{,}64$, $r\approx0{,}858$ — сильная положительная корреляция.
$b_1 = \frac{8{,}9}{10} = 0{,}89$, $b_0 = 7{,}08 - 0{,}89\cdot7 = 0{,}85$, т.е. $\hat y = 0{,}85 + 0{,}89x$.
Прогноз при расходах 100 тыс. зл ($x = 10$): $\hat y = 0{,}85 + 8{,}9 = 9{,}75$ (т.е. 975 тыс. зл).
:::

@chart adScatter

# Насколько хорошо прямая подходит? R²

::: formula W11–12 | Разложение изменчивости
$$\underbrace{\sum(y_i-\bar y)^2}_{SST\ \text{(общая)}} = \underbrace{\sum(y_i-\hat y_i)^2}_{SSE\ \text{(ошибки)}} + \underbrace{\sum(\hat y_i-\bar y)^2}_{SSR\ \text{(объяснённая)}}$$
$$R^2 = \frac{SSR}{SST} = 1-\frac{SSE}{SST}\qquad\text{и в парной регрессии: } R^2 = r^2$$
:::

$R^2$ (**коэффициент детерминации**) — доля изменчивости $Y$, «объяснённая» линейной зависимостью от $X$.

::: example W11–12 | продолжение
$SST = 10{,}748$, $SSE = 2{,}827$, $SSR = 7{,}921$, $R^2 = \frac{7{,}921}{10{,}748}\approx0{,}737$ ($= 0{,}858^2$). Изменчивость дохода примерно **на 74%** объясняется изменчивостью расходов на рекламу.
:::

# Модель линейной регрессии

Чтобы проверять гипотезы и строить интервалы, нужна вероятностная модель:

::: def W11–12 | Модель линейной регрессии
$$Y_i = \beta_0 + \beta_1x_i + \varepsilon_i,\qquad i = 1,\dots,n$$
$\varepsilon_i$ — независимые случайные ошибки со средним 0 и дисперсией $\sigma^2$; $x_i$ — известные числа (не все равные). $b_0$, $b_1$ — **несмещённые** оценки $\beta_0$, $\beta_1$.
:::

::: formula W11–12 | Стандартные ошибки
$$S^2 = \frac{SSE}{n-2}\ \text{(среднеквадратичная ошибка, } n-2 \text{ ст. св.)},\qquad S = \sqrt{S^2}$$
$$SE(b_1) = \frac{S}{\sqrt{S_{xx}}},\qquad SE(b_0) = S\sqrt{\frac1n+\frac{\bar x^2}{S_{xx}}}$$
Если $\varepsilon_i\sim N(0,\sigma)$, то $\dfrac{b_1-\beta_1}{SE(b_1)}\sim t_{n-2}$ и $\dfrac{b_0-\beta_0}{SE(b_0)}\sim t_{n-2}$.
:::

## Тесты и интервалы для коэффициентов

::: formula W11–12 | Тест для β₁ (главный: влияет ли X на Y вообще?)
$$H_0:\ \beta_1 = \beta_{1,0}\quad(\text{обычно } 0),\qquad T = \frac{b_1-\beta_{1,0}}{SE(b_1)}\sim t_{n-2}$$
Критические области как обычно: $|t|\ge t_{1-\alpha/2,\,n-2}$ (двусторонний) и т.д. Доверительный интервал: $b_1\pm t_{1-\alpha/2,\,n-2}\,SE(b_1)$ (аналогично для $\beta_0$).
:::

::: note W11–12 | F-тест
$H_0:\ \beta_1 = 0$ можно проверять и статистикой $F = \frac{SSR/1}{SSE/(n-2)}\sim F(1, n-2)$. Поскольку $F = T^2$, это тот же тест, что и t-тест. Степени свободы: $SST$ — $n-1$ = $SSE$ — $n-2$ + $SSR$ — 1.
:::

::: example W11–12 | Задача из лекции: производство и энергия
По 115 парам: $\widehat{\text{ПРОИЗВ}} = 6{,}40 + 2{,}20\cdot\text{ЭНЕРГИЯ}$ (тыс. зл), $SE(b_0) = 2{,}20$, $SE(b_1) = 0{,}11$, $R^2 = 0{,}86$.
- (a) прогноз при энергии на 2 тыс. зл: $6{,}40+2{,}20\cdot2 = 10{,}8$ тыс. зл;
- (b) модель объясняет **86%** изменчивости производства;
- (c) $H_0:\ \beta_1 = 0$, $H_1:\ \beta_1\ne0$; $t = \frac{2{,}20}{0{,}11} = 20$; 113 ст. св. → квантиль ≈ $z_{0{,}995} = 2{,}576$; $20\ge2{,}576$ → угловой коэффициент **значим** ($\alpha = 0{,}01$).
:::

# Прогноз

Для нового значения $x_0$: $\hat y_0 = b_0+b_1x_0$. Есть **два разных** интервала:

::: formula W11–12 | Интервал для среднего Y при x₀ и для отдельного прогноза
$$\text{среднее } \mu_Y(x_0):\quad \hat y_0\pm t_{1-\alpha/2,\,n-2}\cdot S\sqrt{\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$$
$$\text{отдельное значение } Y(x_0):\quad \hat y_0\pm t_{1-\alpha/2,\,n-2}\cdot S\sqrt{1+\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$$
:::

::: intuition
Интервал для **среднего** показывает, где проходит «истинная прямая» в точке $x_0$. Интервал **прогноза** — про конкретный будущий месяц: он должен учесть ещё случайную ошибку $\varepsilon$ этого месяца (дополнительное «1+» под корнем), поэтому всегда шире. Оба растут, когда $x_0$ удаляется от $\bar x$ — **экстраполяция** рискованна.
:::

::: example W11–12 | Реклама: интервалы 90% при x₀ = 10
$S^2 = \frac{2{,}827}{3}\approx0{,}9423$, значит $S\approx0{,}971$; $S_{xx} = 10$; $t_{0{,}95;3} = 2{,}353$.
- среднее: $SE = 0{,}971\sqrt{0{,}2+0{,}9}\approx1{,}018$ → $9{,}75\pm2{,}40 = [7{,}35;\ 12{,}15]$;
- прогноз: $SE = 0{,}971\sqrt{1+0{,}2+0{,}9}\approx1{,}407$ → $9{,}75\pm3{,}31 = [6{,}44;\ 13{,}06]$.

::: own | Замечание к слайду
На слайде число 0,9423 подписано как $S$, но это $S^2$; правильно $S = \sqrt{0{,}9423}\approx0{,}971$. Результаты в компьютерной таблице из лекции (7,354–12,146 и 6,439–13,061) соответствуют именно этому правильному значению.
:::
:::

# Анализ остатков — хороша ли модель?

Выводы тестов верны только если линейная модель подходит. Остатки $e_i = y_i-\hat y_i$ должны выглядеть как **случайный шум**: бесформенное облако вокруг нуля, без тренда и «воронки». {lecture:W11–12}

@chart adResid

Типичные проблемы и что делать:
- **ошибки не нормальны** — видно на гистограмме / квантильном графике остатков;
- **зависимость нелинейна** (например, $Y = x^2+\varepsilon$) — остатки выстраиваются дугой; помогает преобразование ($x' = x^2$, $\log x$, $\sqrt x$);
- **дисперсия ошибок непостоянна** (остатки расходятся воронкой) — взвешенный МНК с весами $w_i = 1/\sigma_i^2$;
- **не хватает других объясняющих переменных** — модель неадекватна.

**Стьюдентизированные** остатки: $r_i = \dfrac{e_i}{SE(e_i)}$, где $SE(e_i) = S\sqrt{1-\frac1n-\frac{(x_i-\bar x)^2}{S_{xx}}}$; значения $|r_i|>2$ подозрительны.

## Квартет Энскомба — всегда рисуйте данные!

У четырёх наборов данных (почти) одинаковые средние, дисперсии, $r$, линия $\hat y = 3+0{,}5x$ и $R^2\approx0{,}67$. А выглядят они совсем по-разному: {lecture:W11–12}

::: grid
@chart ans1
@chart ans2
@chart ans3
@chart ans4
:::

I — типичная линейная зависимость с шумом; II — явная **дуга** (нелинейная зависимость); III — идеальная прямая с одним **выбросом**; IV — вся «зависимость» держится на **одной точке**. Одни числа этого не покажут — нужны диаграмма рассеяния и график остатков.

# В Excel

~~~excel Линейная регрессия (x в A2:A6, y в B2:B6)
D1: =CORREL(A2:A6,B2:B6)            // r = 0,858
D2: =SLOPE(B2:B6,A2:A6)             // b1 = 0,89   (внимание: сначала y, потом x!)
D3: =INTERCEPT(B2:B6,A2:A6)         // b0 = 0,85
D4: =RSQ(B2:B6,A2:A6)               // R² = 0,737
D5: =FORECAST(10,B2:B6,A2:A6)       // прогноз при x = 10 → 9,75
D6: =STEYX(B2:B6,A2:A6)             // S = 0,971 (стандартная ошибка регрессии)
D7: =D6/SQRT(DEVSQ(A2:A6))          // SE(b1)
D8: =D2/D7                          // t для H0: β1 = 0
D9: =T.DIST.2T(ABS(D8),COUNT(A2:A6)-2)   // p-значение
~~~

::: tip own
Всё сразу: *Данные → Анализ данных → Регрессия* (надстройка Analysis ToolPak) — коэффициенты, их стандартные ошибки, t-статистики, p-значения, $R^2$, таблица ANOVA и остатки. На точечной диаграмме: *Добавить линию тренда → Линейная → Показать уравнение и R²*.
:::

~~~python Регрессия в scipy
import numpy as np
from scipy import stats

x = np.array([5, 6, 7, 8, 9]); y = np.array([4.5, 6.5, 8.4, 7.6, 8.4])
res = stats.linregress(x, y)
print(res.slope, res.intercept, res.rvalue**2)   # 0.89, 0.85, 0.737
print(res.stderr, res.pvalue)                    # SE(b1) ≈ 0.307, p-значение теста β1 = 0

n, x0 = len(x), 10
y_hat = res.intercept + res.slope * x0
S = np.sqrt(np.sum((y - (res.intercept + res.slope * x))**2) / (n - 2))
Sxx = np.sum((x - x.mean())**2)
t = stats.t.ppf(0.95, n - 2)
print(y_hat - t * S * np.sqrt(1 + 1/n + (x0 - x.mean())**2 / Sxx),
      y_hat + t * S * np.sqrt(1 + 1/n + (x0 - x.mean())**2 / Sxx))   # 90% интервал прогноза
~~~

::: summary
- $r = \frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}$, $-1\le r\le1$; корреляция ≠ причинность; $r=0$ ≠ нет связи.
- МНК: $b_1 = \frac{S_{xy}}{S_{xx}}$, $b_0 = \bar y - b_1\bar x$; прямая проходит через $(\bar x,\bar y)$.
- $SST = SSE+SSR$, $R^2 = SSR/SST = r^2$.
- $S^2 = SSE/(n-2)$, $SE(b_1) = S/\sqrt{S_{xx}}$; тест $\beta_1 = 0$: $t = b_1/SE(b_1)\sim t_{n-2}$.
- Интервал для среднего $\mu_Y(x_0)$ и более широкий интервал прогноза (дополнительное «1+»).
- Всегда смотрите на диаграмму рассеяния и график остатков (квартет Энскомба).
:::
`,

    cheatsheet: md`
## Вспомогательные суммы
$S_{xx}=\sum(x-\bar x)^2=\sum x^2-\frac{(\sum x)^2}{n}$ · $S_{yy}$ аналогично · $S_{xy}=\sum(x-\bar x)(y-\bar y)=\sum xy-\frac{\sum x\sum y}{n}$

## Корреляция и прямая
$$r=\frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}}\qquad b_1=\frac{S_{xy}}{S_{xx}}=r\frac{s_y}{s_x}\qquad b_0=\bar y-b_1\bar x$$
- $\hat y=b_0+b_1x$ проходит через $(\bar x,\bar y)$; остаток $e_i=y_i-\hat y_i$, $\sum e_i=0$

## Качество подгонки
$SST=S_{yy}$ · $SSR=b_1S_{xy}$ · $SSE=SST-SSR$ · $R^2=\frac{SSR}{SST}=r^2$

## Вывод (нормальные ошибки)
- $S^2=\frac{SSE}{n-2}$, $SE(b_1)=\frac{S}{\sqrt{S_{xx}}}$, $SE(b_0)=S\sqrt{\frac1n+\frac{\bar x^2}{S_{xx}}}$
- тест $\beta_1=0$: $t=\frac{b_1}{SE(b_1)}\sim t_{n-2}$; $F=t^2$
- интервал для $\beta_1$: $b_1\pm t_{1-\alpha/2,n-2}SE(b_1)$

## Прогноз в x₀
- среднее: $\hat y_0\pm t\,S\sqrt{\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$
- отдельное: $\hat y_0\pm t\,S\sqrt{1+\frac1n+\frac{(x_0-\bar x)^2}{S_{xx}}}$

## Excel
‹CORREL› ‹SLOPE(y,x)› ‹INTERCEPT(y,x)› ‹RSQ› ‹FORECAST(x0,y,x)› ‹STEYX› ‹LINEST› · PL: ‹WSP.KORELACJI› ‹NACHYLENIE› ‹ODCIĘTA› ‹R.KWADRAT› ‹REGLINX› ‹REGBŁSTD›
`,

    exercises: [
      {
        id: 'e1', own: true, title: 'Часы учёбы и результат экзамена — полный анализ',
        text: md`
Шесть студентов указали число часов учёбы $x$ и результат экзамена $y$ (баллы):

| $x$ | 2 | 4 | 5 | 7 | 8 | 10 |
|---|---:|---:|---:|---:|---:|---:|
| $y$ | 34 | 50 | 49 | 63 | 66 | 80 |

а) Найдите коэффициент корреляции. б) Найдите линию регрессии $y$ по $x$ и проинтерпретируйте $b_1$. в) Найдите $R^2$. г) На уровне 0,05 проверьте значимость углового коэффициента. д) Дайте прогноз и 95% интервалы (для среднего и для отдельного студента) при $x_0 = 9$ ч.
`,
        hint: md`$\bar x = 6$, $\bar y = 57$. Посчитайте $S_{xx}$, $S_{yy}$, $S_{xy}$ по таблице отклонений. $t_{0{,}975;4} = 2{,}776$.`,
        solution: md`
Отклонения $x-6$: −4, −2, −1, 1, 2, 4; $y-57$: −23, −7, −8, 6, 9, 23.
$S_{xx} = 42$, $S_{yy} = 1288$, $S_{xy} = 230$.

**а)** $r = \frac{230}{\sqrt{42\cdot1288}}\approx0{,}989$ — очень сильная положительная связь.
**б)** $b_1\approx5{,}476$, $b_0\approx24{,}14$: $\hat y = 24{,}14+5{,}48x$. Каждый дополнительный час учёбы даёт в среднем около **5,5 балла**.
**в)** $SSR\approx1259{,}5$, $SSE\approx28{,}5$, $R^2\approx0{,}978$.
**г)** $S^2\approx7{,}12$, $S\approx2{,}668$, $SE(b_1)\approx0{,}412$; $t\approx13{,}3\ge2{,}776$ → $\beta_1$ **значим**.
**д)** $\hat y_0\approx73{,}4$ балла.
- среднее: $SE\approx1{,}647$ → $[68{,}9;\ 78{,}0]$;
- отдельный студент: $SE\approx3{,}136$ → $[64{,}7;\ 82{,}1]$.

@chart exStudy
`,
        answer: md`$r\approx0{,}989$; $\hat y = 24{,}14+5{,}48x$; $R^2\approx0{,}978$; $t\approx13{,}3$ (значим); $\hat y(9)\approx73{,}4$, интервалы [68,9; 78,0] и [64,7; 82,1].`
      },
      {
        id: 'e2', own: true, title: 'Чтение распечатки регрессии: цена квартиры',
        text: md`
По 52 объявлениям построена модель: $\widehat{\text{цена}} = 12{,}5 + 0{,}8\cdot\text{площадь}$ (цена в тыс. зл, площадь в м²), $SE(b_0) = 3{,}1$, $SE(b_1) = 0{,}2$, $R^2 = 0{,}64$.
а) Какова прогнозируемая цена квартиры 60 м²? б) Какой процент изменчивости цен объясняет модель? в) Значимо ли на уровне 0,05 влияние площади на цену? г) Дайте 95% доверительный интервал для $\beta_1$.
`,
        hint: md`По образцу примера «ПРОИЗВОДСТВО–ЭНЕРГИЯ» из лекции. 50 ст. св.: $t_{0{,}975;50}\approx2{,}009$.`,
        solution: md`
а) $12{,}5+0{,}8\cdot60 = 60{,}5$ тыс. зл. б) **64%**.
в) $t = \frac{0{,}8}{0{,}2} = 4\ge2{,}009$ → **отвергаем $H_0$**: площадь значимо влияет на цену.
г) $0{,}8\pm2{,}009\cdot0{,}2 = [0{,}40;\ 1{,}20]$ тыс. зл за м² (не содержит 0 — согласуется с тестом).
`,
        answer: md`а) 60,5 тыс. зл; б) 64%; в) $t = 4$ → значим; г) [0,40; 1,20].`
      },
      {
        id: 'e3', own: true, title: 'Регрессия только по суммам',
        text: md`
Для $n = 10$ пар: $\sum x = 50$, $\sum y = 120$, $\sum x^2 = 300$, $\sum y^2 = 1580$, $\sum xy = 660$. Найдите $r$, линию регрессии и $R^2$.
`,
        hint: md`Расчётные формулы: $S_{xx} = \sum x^2 - (\sum x)^2/n$ и т.д.`,
        solution: md`
$S_{xx} = 50$; $S_{yy} = 140$; $S_{xy} = 60$. $r = \frac{60}{\sqrt{7000}}\approx0{,}717$; $b_1 = 1{,}2$; $b_0 = 12-6 = 6$ → $\hat y = 6+1{,}2x$; $R^2\approx0{,}514$.
`,
        answer: md`$r\approx0{,}717$; $\hat y = 6+1{,}2x$; $R^2\approx0{,}51$.`
      },
      {
        id: 'e4', own: true, title: 'Верно или неверно? (интерпретация)',
        text: md`
1. Если $r = 0$, между $X$ и $Y$ нет никакой связи.
2. Если $R^2 = 0{,}81$, то $r = 0{,}9$ или $r = -0{,}9$.
3. Высокая корреляция между числом пожарных на пожаре и размером ущерба доказывает, что пожарные причиняют ущерб.
4. Интервал прогноза для отдельного значения всегда шире интервала для среднего при том же $x_0$.
5. Прогноз далеко за пределами наблюдаемых $x$ так же надёжен, как в середине данных.
`,
        hint: md`Вспомните $Y = X^2$ (тема 6), $R^2 = r^2$ и дополнительное «1+» в интервале прогноза.`,
        solution: md`
1. **Неверно** — $r = 0$ означает отсутствие **линейной** связи (может быть, например, параболическая).
2. **Верно** — в парной регрессии $R^2 = r^2$; знак $r$ = знак $b_1$.
3. **Неверно** — корреляция ≠ причинность; обе величины зависят от размера пожара (скрытая переменная).
4. **Верно** — добавляется случайная ошибка отдельного наблюдения («1+» под корнем).
5. **Неверно** — член $(x_0-\bar x)^2$ расширяет интервалы, а вне данных мы даже не знаем, линейна ли зависимость.
`,
        answer: md`Верны: 2 и 4.`
      }
    ]
  };

  SAD.registerTopic('t12', { charts: charts, pl: pl, en: en, ru: ru });
})();
