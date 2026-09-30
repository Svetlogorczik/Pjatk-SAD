/* Topic 9 — Estimation and confidence intervals (lecture W08, classes C11) */
(function () {
  var md = SAD.md;

  var charts = {
    ciSim: { type: 'ci', mu: 50, sigma: 10, n: 25, count: 30, level: 0.95, seed: 4,
      caption: { pl: '30 próbek po 25 elementów z N(50, 10): każda daje inny przedział 95%. Około 95% z nich „łapie” prawdziwe μ = 50.', en: '30 samples of 25 from N(50, 10): each gives a different 95% interval. About 95% of them “catch” the true μ = 50.', ru: '30 выборок по 25 из N(50, 10): каждая даёт свой 95% интервал. Около 95% из них «ловят» истинное μ = 50.' } },
    zCrit: { type: 'pdf', dist: { name: 'normal', mu: 0, sigma: 1 }, range: [-3.5, 3.5],
      shade: [{ from: -1.96, to: 1.96, label: '1 − α = 0,95', labelY: 0.15 }, { from: -3.5, to: -1.96, cls: '2' }, { from: 1.96, to: 3.5, cls: '2' }],
      markers: [{ x: -1.96, label: '−z' }, { x: 1.96, label: 'z₁₋α/₂' }],
      caption: { pl: 'Przedział ufności bierze środkowe 1 − α pola; w każdym ogonie zostaje α/2', en: 'A confidence interval takes the central 1 − α of the area; α/2 is left in each tail', ru: 'Доверительный интервал берёт центральные 1 − α площади; в каждом хвосте остаётся α/2' } },
    tVsNormal: { type: 'pdf', range: [-4, 4],
      curves: [{ dist: { name: 'normal', mu: 0, sigma: 1 }, label: 'N(0,1)' }, { dist: { name: 't', df: 4 }, label: 't₄' }, { dist: { name: 't', df: 1 }, label: 't₁', dashed: true }],
      caption: { pl: 'Rozkład t-Studenta ma „grubsze ogony” niż normalny; dla k > 30 prawie się z nim pokrywa', en: 'Student’s t has “heavier tails” than the normal; for k > 30 they almost coincide', ru: 'У распределения Стьюдента «тяжелее хвосты», чем у нормального; при k > 30 они почти совпадают' } },
    chi2: { type: 'pdf', range: [0, 25],
      curves: [{ dist: { name: 'chi2', df: 3 }, label: 'k = 3' }, { dist: { name: 'chi2', df: 6 }, label: 'k = 6' }, { dist: { name: 'chi2', df: 10 }, label: 'k = 10' }],
      caption: { pl: 'Rozkład chi-kwadrat: niesymetryczny, tylko wartości dodatnie', en: 'Chi-square distribution: asymmetric, positive values only', ru: 'Распределение хи-квадрат: несимметричное, только положительные значения' } }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Z próbki nie poznamy parametru dokładnie — ale możemy podać **najlepszą ocenę** (estymacja punktowa) i **przedział**, który z zadanym prawdopodobieństwem go zawiera (przedział ufności).',
    lecture: md`
# Estymacja punktowa

::: def W08 | Estymator
Niech $X_1,\dots,X_n$ — prosta próba losowa z rozkładu z nieznanym parametrem $\theta$. **Estymator** to statystyka $\hat\theta = h(X_1,\dots,X_n)$, której wartości dla konkretnych próbek są rozsądnymi ocenami $\theta$. Estymator jest **nieobciążony**, gdy $E(\hat\theta) = \theta$ — „średnio trafia”.
:::

| Parametr | Estymator | Nieobciążony? |
|---|---|---|
| średnia $\mu$ | $\bar X = \frac1n\sum X_i$ | tak |
| wariancja $\sigma^2$ | $S^2 = \frac{1}{n-1}\sum(X_i-\bar X)^2$ | tak |
| wariancja $\sigma^2$ | $\frac1n\sum(X_i-\bar X)^2$ | **nie** (średnio zaniża o czynnik $\frac{n-1}{n}$) {own} |
| proporcja $p$ | $\hat p = \frac{\text{liczba sukcesów}}{n}$ | tak |

To jest wyjaśnienie obiecane w temacie 1: dzielimy przez $n-1$, żeby $S^2$ było nieobciążone.

# Idea przedziału ufności

Ocena punktowa $\bar x = 4{,}2$ nic nie mówi o tym, **jak bardzo** może się mylić. Przedział ufności to losowy przedział, który **z prawdopodobieństwem $1-\alpha$** (poziom ufności, np. 0,95) zawiera nieznany parametr.

@chart zCrit

::: intuition
Wyobraź sobie rzut kółkiem do palika, którego nie widzisz. Palik to prawdziwe $\mu$, kółko to przedział. „95% ufności” znaczy: **ta metoda rzucania** trafia w 95 rzutach na 100. Konkretny przedział albo zawiera $\mu$, albo nie — nie wiemy, czy akurat trafiliśmy.
:::

@chart ciSim

::: warn W08 | Interpretacja częstościowa
Poprawnie: „przy wielokrotnym powtarzaniu badania ok. 95% tak skonstruowanych przedziałów pokryje $\mu$”. Niepoprawnie: „$\mu$ z prawdopodobieństwem 95% leży w **tym** przedziale [4,0; 4,4]” — $\mu$ nie jest losowe, losowy jest przedział.
:::

# Model 1: średnia, rozkład normalny, σ znane

$X\sim N(\mu,\sigma)$, $\sigma$ znane. Ponieważ $Z = \dfrac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)$, to $P(-z_{1-\alpha/2}\le Z\le z_{1-\alpha/2}) = 1-\alpha$. Przekształcając nierówność względem $\mu$:

::: formula W08 | Przedział ufności — model 1
$$\left[\bar x - z_{1-\alpha/2}\frac{\sigma}{\sqrt n},\ \ \bar x + z_{1-\alpha/2}\frac{\sigma}{\sqrt n}\right]$$
$z_{1-\alpha/2}$ — kwantyl N(0, 1): dla 90% → 1,645; 95% → 1,96; 98% → 2,326; 99% → 2,576.
:::

::: example W08 | Stacja paliw
W ciągu 9 dni sprzedano 8019 l gazu, $\sigma = 90$ l. $\bar x = 891$ l, $\sigma/\sqrt n = 30$.
- 98%: $891 \pm 2{,}33\cdot30 = [821{,}1;\ 960{,}9]$
- 80%: $891\pm1{,}28\cdot30 = [852{,}6;\ 929{,}4]$
Niższy poziom ufności → **krótszy** przedział (ale częściej się myli).
:::

## Jak duża próba?

Długość przedziału $2z_{1-\alpha/2}\frac{\sigma}{\sqrt n}$ nie zależy od próbki. Chcemy, żeby błąd $|\bar X-\mu|$ nie przekroczył $d$ z prawdopodobieństwem $1-\alpha$:

::: formula W08 | Minimalna liczność próby
$$n \ge \left(\frac{z_{1-\alpha/2}\,\sigma}{d}\right)^2\qquad\text{(zaokrąglamy w górę)}$$
:::

::: example W08 | Nikotyna w papierosach
$\sigma = 8$ mg, $d = 1{,}5$ mg, poziom 0,95: $n\ge\left(\frac{1{,}96\cdot8}{1{,}5}\right)^2\approx109{,}3$ → trzeba zbadać **110 paczek** (na slajdzie zapisano $n\ge109$ — w praktyce zawsze zaokrąglamy w górę {own}).
:::

# Model 2: średnia, rozkład normalny, σ nieznane

Zastępujemy $\sigma$ jej oceną $S$. Nowa statystyka ma już inny rozkład:

::: def W08 | Rozkład t-Studenta
Jeśli $Z_0, Z_1,\dots,Z_k$ są niezależne $N(0,1)$, to $V = \dfrac{Z_0}{\sqrt{(Z_1^2+\dots+Z_k^2)/k}}$ ma **rozkład t-Studenta z $k$ stopniami swobody** ($t_k$). Gęstość symetryczna, podobna do normalnej, ale z grubszymi ogonami; dla $k>30$ praktycznie $t_k\approx N(0,1)$. (W. S. Gosset, pseudonim „Student”.)
$$T = \frac{\bar X-\mu}{S/\sqrt n}\sim t_{n-1}$$
:::

@chart tVsNormal

::: formula W08 | Przedział ufności — model 2
$$\left[\bar x - t_{1-\alpha/2,\,n-1}\frac{s}{\sqrt n},\ \ \bar x + t_{1-\alpha/2,\,n-1}\frac{s}{\sqrt n}\right]$$
:::

::: example W08 | Zużycie cukru
Tygodniowe zużycie cukru (kg) w 5 tygodniach: 3,8; 4,5; 5,2; 4,0; 5,5. Przedział 90%:
$\bar x = 4{,}6$, $\sum(x_i-\bar x)^2 = 2{,}18$, $s^2 = 0{,}545$, $s\approx0{,}738$, $t_{0{,}95;\,4} = 2{,}132$:
$$4{,}6\pm2{,}132\cdot\frac{0{,}738}{\sqrt5} = [3{,}896;\ 5{,}304]$$
:::

::: example W08 | Duża próba
Czasy obsługi 64 klientów banku: $\bar x = 3{,}2$ min, $s^2 = 1{,}44$. Dla $n>30$ kwantyl $t$ ≈ kwantyl normalny: $t_{0{,}99;\,63}\approx z_{0{,}99} = 2{,}33$. Przedział 98%: $3{,}2\pm2{,}33\cdot\frac{1{,}2}{8} = [2{,}85;\ 3{,}55]$.
:::

::: note | Model 3: dowolny rozkład, duża próba
Gdy rozkład cechy **nie jest** normalny (lub nieznany), ale próba jest duża (w arkuszu wzorów: $n\ge50$), z CTG: $\bar x\pm z_{1-\alpha/2}\frac{s}{\sqrt n}$.
:::

# Przedział ufności dla wariancji

::: def W08 | Rozkład chi-kwadrat
Jeśli $Z_1,\dots,Z_n$ są niezależne $N(0,1)$, to $\chi^2 = \sum Z_i^2$ ma **rozkład chi-kwadrat z $n$ stopniami swobody**. Dla próby z $N(\mu,\sigma)$:
$$\frac{(n-1)S^2}{\sigma^2}\sim\chi^2_{n-1}$$
:::

@chart chi2

::: formula W08 | Przedział ufności dla σ² i σ (rozkład normalny)
$$\sigma^2\in\left[\frac{(n-1)s^2}{\chi^2_{1-\alpha/2,\,n-1}},\ \ \frac{(n-1)s^2}{\chi^2_{\alpha/2,\,n-1}}\right],\qquad \sigma\in\left[\sqrt{\frac{(n-1)s^2}{\chi^2_{1-\alpha/2,\,n-1}}},\ \sqrt{\frac{(n-1)s^2}{\chi^2_{\alpha/2,\,n-1}}}\right]$$
Uwaga: **większy** kwantyl stoi w mianowniku **lewego** końca. Przedział **nie jest** symetryczny wokół $s^2$.
:::

::: example own
10 pomiarów, $s^2 = 0{,}052$. Przedział 95% dla $\sigma^2$: $\chi^2_{0{,}025;9} = 2{,}700$, $\chi^2_{0{,}975;9} = 19{,}023$, $(n-1)s^2 = 0{,}468$:
$$\sigma^2\in\left[\frac{0{,}468}{19{,}023};\ \frac{0{,}468}{2{,}700}\right] = [0{,}0246;\ 0{,}1733]$$
:::

# Przedział ufności dla proporcji

$X_i$ zero-jedynkowe, $\hat p = \bar X$. Z CTG (gdy $n\hat p\ge5$, $n(1-\hat p)\ge5$; w arkuszu wzorów: $n\ge100$):

::: formula W08 | Przedział ufności dla p
$$\left[\hat p - z_{1-\alpha/2}\sqrt{\frac{\hat p(1-\hat p)}{n}},\ \ \hat p + z_{1-\alpha/2}\sqrt{\frac{\hat p(1-\hat p)}{n}}\right]$$
:::

::: example W08 | Sondaż o Unii Europejskiej
70% z 1000 ankietowanych uważa obecność w UE za korzystną. 95%: $0{,}7\pm1{,}96\sqrt{\frac{0{,}7\cdot0{,}3}{1000}} = 0{,}7\pm0{,}028 = [0{,}67;\ 0{,}73]$.
:::

::: example W08 | Czy ufać producentowi?
Producent twierdzi, że niezawodność elementów to 0,9. Wśród 100 elementów 15 okazało się zawodnych: $\hat p = 0{,}85$. Przedział 95%: $0{,}85\pm1{,}96\sqrt{\frac{0{,}85\cdot0{,}15}{100}} = [0{,}78;\ 0{,}92]$ — wartość 0,9 **mieści się** w przedziale, więc dane nie przeczą twierdzeniu producenta.
:::

::: tip W08 | Dlaczego sondaże mają ok. 1000 osób?
Żeby błąd nie przekroczył 3 punktów procentowych przy 95% ufności, w najgorszym przypadku $p(1-p) = 0{,}25$: $n\ge0{,}25\left(\frac{1{,}96}{0{,}03}\right)^2\approx1067$.
:::

# Który model wybrać?

| Co szacujemy? | Założenia | Kwantyl | Wzór |
|---|---|---|---|
| średnia | normalny, **σ znane** | $z_{1-\alpha/2}$ | $\bar x\pm z\frac{\sigma}{\sqrt n}$ |
| średnia | normalny, **σ nieznane** | $t_{1-\alpha/2,\,n-1}$ | $\bar x\pm t\frac{s}{\sqrt n}$ |
| średnia | dowolny, duże $n$ | $z_{1-\alpha/2}$ | $\bar x\pm z\frac{s}{\sqrt n}$ |
| wariancja / σ | normalny | $\chi^2_{\alpha/2},\ \chi^2_{1-\alpha/2}$ | $\left[\frac{(n-1)s^2}{\chi^2_{1-\alpha/2}}, \frac{(n-1)s^2}{\chi^2_{\alpha/2}}\right]$ |
| proporcja | duże $n$ | $z_{1-\alpha/2}$ | $\hat p\pm z\sqrt{\frac{\hat p(1-\hat p)}{n}}$ |

::: tip own | Dane pogrupowane (częsty typ zadania)
Gdy dane są w tabeli przedziałów: licz $\bar x = \frac1n\sum n_i\tilde x_i$ i $s^2 = \frac{1}{n-1}\sum n_i(\tilde x_i-\bar x)^2$ ze **środków klas** $\tilde x_i$, a potem używaj zwykłych wzorów.
:::

::: note W08 | Zasady etyczne podawania wyników
Zawsze podawaj: ocenę punktową **i** przedział, **poziom ufności**, **liczność próby** oraz **interpretację** przedziału.
:::

# W Excelu

~~~excel Przedziały ufności
B1: =AVERAGE(A2:A8)                        // średnia
B2: =STDEV.S(A2:A8)                        // s
B3: =COUNT(A2:A8)                          // n
B4: =T.INV.2T(0.05,B3-1)                   // t_{0,975; n-1}
B5: =B1-B4*B2/SQRT(B3)                     // lewy koniec (model 2)
B6: =B1+B4*B2/SQRT(B3)                     // prawy koniec
B7: =CONFIDENCE.T(0.05,B2,B3)              // połowa długości — to samo szybciej
B8: =CONFIDENCE.NORM(0.05,2.1,49)          // model 1: z*σ/√n
B9: =(B3-1)*B2^2/CHISQ.INV(0.975,B3-1)     // lewy koniec dla σ²
B10: =(B3-1)*B2^2/CHISQ.INV(0.025,B3-1)    // prawy koniec dla σ²
~~~

::: warn own | Uwaga na funkcje Excela
‹T.INV.2T(α; df)› zwraca od razu $t_{1-\alpha/2}$ (dwustronny), a ‹T.INV(p; df)› — kwantyl rzędu $p$. ‹CHISQ.INV(p; df)› to kwantyl rzędu $p$ (lewy ogon), a ‹CHISQ.INV.RT(p; df)› — prawy ogon.
:::

~~~python Przedziały ufności w scipy
import numpy as np
from scipy import stats

x = np.array([41.2, 39.8, 42.5, 40.1, 43.0, 41.7, 40.6])
n, m, s = len(x), x.mean(), x.std(ddof=1)                 # ddof=1 → dzielnik n-1
print(stats.t.interval(0.95, n - 1, loc=m, scale=s / np.sqrt(n)))
chi_lo, chi_hi = stats.chi2.ppf([0.025, 0.975], n - 1)
print((n - 1) * s**2 / chi_hi, (n - 1) * s**2 / chi_lo)   # przedział dla σ²
p_hat, N = 945 / 1500, 1500
print(stats.norm.interval(0.95, loc=p_hat, scale=np.sqrt(p_hat * (1 - p_hat) / N)))
~~~

::: summary
- Estymatory nieobciążone: $\bar X$, $S^2$ (dzielnik $n-1$), $\hat p$.
- Przedział $1-\alpha$: w długim okresie $(1-\alpha)\cdot100\%$ przedziałów pokrywa parametr.
- σ znane → $z$; σ nieznane → $t_{n-1}$; wariancja → $\chi^2_{n-1}$ (dwa różne kwantyle); proporcja → $z$ z $\hat p$.
- Wyższy poziom ufności lub mniejsze $n$ → dłuższy przedział; $n\ge(z\sigma/d)^2$.
:::
`,

    cheatsheet: md`
## Estymatory (nieobciążone)
$\bar X$ → μ · $S^2=\frac{1}{n-1}\sum(X_i-\bar X)^2$ → σ² · $\hat p = k/n$ → p

## Przedziały ufności (poziom 1 − α)
| sytuacja | przedział |
|---|---|
| N(μ, σ), σ znane | $\bar x\pm z_{1-\alpha/2}\,\sigma/\sqrt n$ |
| N(μ, σ), σ nieznane | $\bar x\pm t_{1-\alpha/2,n-1}\,s/\sqrt n$ |
| dowolny, duże n | $\bar x\pm z_{1-\alpha/2}\,s/\sqrt n$ |
| σ² (normalny) | $\big[\frac{(n-1)s^2}{\chi^2_{1-\alpha/2,n-1}};\frac{(n-1)s^2}{\chi^2_{\alpha/2,n-1}}\big]$ |
| σ | pierwiastki z końców dla σ² |
| p (duże n) | $\hat p\pm z_{1-\alpha/2}\sqrt{\hat p(1-\hat p)/n}$ |

## Kwantyle $z_{1-\alpha/2}$
90% → 1,645 · 95% → 1,96 · 98% → 2,326 · 99% → 2,576

## Liczność próby
$n\ge\big(z_{1-\alpha/2}\sigma/d\big)^2$ · proporcja: $n\ge p(1-p)\big(z/d\big)^2$, najgorzej $p(1-p)=0{,}25$ · zaokrąglaj w górę

## Dane pogrupowane
$\bar x=\frac1n\sum n_i\tilde x_i$, $s^2=\frac1{n-1}\sum n_i(\tilde x_i-\bar x)^2$ ($\tilde x_i$ = środki klas)

## Excel
‹CONFIDENCE.NORM(α,σ,n)› ‹CONFIDENCE.T(α,s,n)› ‹T.INV.2T(α,df)› ‹CHISQ.INV(p,df)› ‹NORM.S.INV(p)›

## Odpowiedź zawsze z: poziomem ufności, n, interpretacją
`,

    exercises: [
      {
        id: 'e1', tag: 'C11', title: 'Czas pobierania pliku (σ znane)',
        text: md`
Na podstawie 49 losowych pobrań pliku obliczono średni czas 12,6 s. Z wcześniejszych badań wiadomo, że odchylenie standardowe czasu wynosi 2,1 s, a czas ma rozkład normalny.
a) Podaj ocenę punktową średniego czasu i wybierz model do estymacji przedziałowej.
b) Wyznacz przedziały ufności na poziomach 0,95 i 0,99. Porównaj ich długości.
`,
        hint: md`$\sigma$ znane → model 1. $\sigma/\sqrt n = 2{,}1/7 = 0{,}3$.`,
        solution: md`
a) Ocena punktowa $\bar x = 12{,}6$ s; rozkład normalny, $\sigma$ znane → **model 1**.
b)
- 0,95: $12{,}6\pm1{,}96\cdot0{,}3 = [12{,}012;\ 13{,}188]$, długość 1,176.
- 0,99: $12{,}6\pm2{,}576\cdot0{,}3 = [11{,}827;\ 13{,}373]$, długość 1,546.

Wyższy poziom ufności → **dłuższy** przedział: żeby częściej „trafiać” w $\mu$, trzeba rzucać szerszym kółkiem.
`,
        answer: md`95%: [12,01; 13,19]; 99%: [11,83; 13,37].`
      },
      {
        id: 'e2', tag: 'C11', title: 'Czas kompilacji (σ nieznane) + przedział dla σ',
        text: md`
Czas kompilacji projektu (s) w 7 niezależnych uruchomieniach: 41,2; 39,8; 42,5; 40,1; 43,0; 41,7; 40,6. Zakładamy rozkład normalny. Na poziomie ufności 0,95:
a) oszacuj punktowo i przedziałowo średni czas kompilacji;
b) oszacuj punktowo i przedziałowo odchylenie standardowe.
`,
        hint: md`a) model 2, $t_{0{,}975;6} = 2{,}447$. b) $\chi^2_{0{,}025;6} = 1{,}237$, $\chi^2_{0{,}975;6} = 14{,}449$.`,
        solution: md`
$\bar x\approx41{,}27$ s, $\sum(x_i-\bar x)^2\approx8{,}674$, $s^2\approx1{,}446$, $s\approx1{,}202$ s.

**a)** $41{,}27\pm2{,}447\cdot\frac{1{,}202}{\sqrt7} = 41{,}27\pm1{,}11 = [40{,}16;\ 42{,}38]$.

**b)** Ocena punktowa $s\approx1{,}20$ s. Dla $\sigma^2$: $\left[\frac{8{,}674}{14{,}449};\ \frac{8{,}674}{1{,}237}\right] = [0{,}600;\ 7{,}010]$, więc $\sigma\in[0{,}77;\ 2{,}65]$ s.
Przy tak małej próbie przedział dla $\sigma$ jest bardzo szeroki (od 0,8 do 2,6).
`,
        answer: md`μ ∈ [40,16; 42,38] s; σ ∈ [0,77; 2,65] s.`
      },
      {
        id: 'e3', tag: 'C11', title: 'Sen studentów — dane pogrupowane',
        text: md`
Liczba godzin snu 40 losowych studentów:

| godziny | 4–5 | 5–6 | 6–7 | 7–8 | 8–9 |
|---|---:|---:|---:|---:|---:|
| liczba studentów | 3 | 8 | 15 | 10 | 4 |

a) Oszacuj punktowo średni czas snu i wariancję.
b) Wyznacz przedziały ufności 95% dla średniej i dla wariancji (rozkład normalny).
`,
        hint: md`Środki klas: 4,5; 5,5; 6,5; 7,5; 8,5. $t_{0{,}975;39}\approx2{,}023$; $\chi^2_{0{,}025;39}\approx23{,}65$, $\chi^2_{0{,}975;39}\approx58{,}12$.`,
        solution: md`
**a)** $\bar x = \frac{3\cdot4{,}5+8\cdot5{,}5+15\cdot6{,}5+10\cdot7{,}5+4\cdot8{,}5}{40} = \frac{264}{40} = 6{,}6$ h.
$\sum n_i(\tilde x_i-\bar x)^2 = 3\cdot4{,}41+8\cdot1{,}21+15\cdot0{,}01+10\cdot0{,}81+4\cdot3{,}61 = 45{,}6$, $s^2 = \frac{45{,}6}{39}\approx1{,}169$, $s\approx1{,}081$.

**b)** Średnia: $6{,}6\pm2{,}023\cdot\frac{1{,}081}{\sqrt{40}} = 6{,}6\pm0{,}346 = [6{,}25;\ 6{,}95]$ h.
Wariancja: $\left[\frac{45{,}6}{58{,}12};\ \frac{45{,}6}{23{,}65}\right] = [0{,}785;\ 1{,}928]$ h².
`,
        answer: md`$\bar x=6{,}6$ h, $s^2\approx1{,}17$; μ ∈ [6,25; 6,95]; σ² ∈ [0,79; 1,93].`
      },
      {
        id: 'e4', tag: 'C11', title: 'Nowa funkcja w aplikacji — proporcja',
        text: md`
Spośród 1500 losowych użytkowników 945 wybrało nową wersję interfejsu. Oszacuj punktowo i przedziałowo (95%) odsetek użytkowników preferujących nową wersję.
`,
        hint: md`$\hat p = 945/1500$. Sprawdź warunki $n\hat p\ge5$, $n(1-\hat p)\ge5$.`,
        solution: md`
$\hat p = 0{,}63$; warunki spełnione (945 i 555). $\sqrt{\frac{0{,}63\cdot0{,}37}{1500}}\approx0{,}01247$.
$0{,}63\pm1{,}96\cdot0{,}01247 = [0{,}606;\ 0{,}654]$ → od ok. 60,6% do 65,4% (95% ufności, $n=1500$).
`,
        answer: md`$\hat p = 63\%$; przedział [60,6%; 65,4%].`
      },
      {
        id: 'e5', tag: 'C11', title: 'Czas dostawy jedzenia — średnia i odsetek',
        text: md`
Czas dostawy 250 losowych zamówień (min):

| czas | 10–20 | 20–30 | 30–40 | 40–50 | 50–60 |
|---|---:|---:|---:|---:|---:|
| zamówienia | 30 | 85 | 90 | 35 | 10 |

Oszacuj punktowo i przedziałowo (95%) średni czas dostawy oraz odsetek zamówień dostarczonych w mniej niż 30 minut.
`,
        hint: md`Duża próba o nieznanym rozkładzie → model 3 ($z$ i $s$). Zamówienia < 30 min: pierwsze dwie klasy.`,
        solution: md`
Środki: 15, 25, 35, 45, 55. $\bar x = \frac{7850}{250} = 31{,}4$ min; $s^2 = \frac{24\,760}{249}\approx99{,}44$, $s\approx9{,}97$.
Średnia: $31{,}4\pm1{,}96\cdot\frac{9{,}97}{\sqrt{250}} = 31{,}4\pm1{,}24 = [30{,}16;\ 32{,}64]$ min.
Odsetek: $\hat p = \frac{115}{250} = 0{,}46$; $0{,}46\pm1{,}96\sqrt{\frac{0{,}46\cdot0{,}54}{250}} = 0{,}46\pm0{,}062 = [0{,}398;\ 0{,}522]$.
`,
        answer: md`μ ∈ [30,2; 32,6] min; p ∈ [39,8%; 52,2%].`
      },
      {
        id: 'e6', own: true, title: 'Jak duża próba?',
        text: md`
a) Odchylenie standardowe czasu pobierania wynosi 2,1 s. Ile pobrań trzeba zmierzyć, żeby z ufnością 95% błąd oceny średniej nie przekroczył 0,5 s?
b) Ile osób trzeba zapytać w sondażu, żeby błąd oceny odsetka nie przekroczył 2 punktów procentowych (95%), jeśli nic nie wiemy o $p$?
`,
        hint: md`a) $n\ge(z\sigma/d)^2$. b) najgorszy przypadek $p(1-p) = 0{,}25$.`,
        solution: md`
a) $n\ge\left(\frac{1{,}96\cdot2{,}1}{0{,}5}\right)^2\approx67{,}8$ → **68 pobrań**.
b) $n\ge0{,}25\left(\frac{1{,}96}{0{,}02}\right)^2 = 2401$ → **2401 osób**. (Dla błędu 3 pp wystarczy 1068 — stąd typowe sondaże na ~1000 osobach.)
`,
        answer: md`a) 68; b) 2401.`
      },
      {
        id: 'e7', own: true, title: 'Co naprawdę znaczy „95% ufności”?',
        text: md`
Na podstawie próbki wyznaczono przedział ufności 95% dla średniego czasu: [12,0; 13,2] s. Które zdania są prawdziwe?
1. Prawdziwa średnia $\mu$ z prawdopodobieństwem 0,95 należy do [12,0; 13,2].
2. Gdybyśmy wiele razy powtarzali badanie, ok. 95% tak wyznaczonych przedziałów zawierałoby $\mu$.
3. 95% wszystkich pobrań trwa od 12,0 do 13,2 s.
4. Przedział 99% wyznaczony z tej samej próbki byłby dłuższy.
`,
        hint: md`Co jest losowe: $\mu$ czy przedział? Czy przedział dotyczy pojedynczych obserwacji, czy średniej?`,
        solution: md`
1. **Fałsz** (w interpretacji częstościowej z wykładu) — $\mu$ jest stałą; ten konkretny przedział albo ją zawiera, albo nie.
2. **Prawda** — to jest właśnie interpretacja częstościowa.
3. **Fałsz** — przedział dotyczy **średniej**, a nie pojedynczych obserwacji (te rozrzucają się dużo szerzej, o $\sigma$, a nie $\sigma/\sqrt n$).
4. **Prawda** — większy kwantyl ($2{,}576>1{,}96$) → dłuższy przedział.
`,
        answer: md`Prawdziwe: 2 i 4.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'A sample never tells us a parameter exactly — but we can give the **best guess** (point estimation) and an **interval** that contains it with a chosen probability (a confidence interval).',
    lecture: md`
# Point estimation

::: def W08 | Estimator
Let $X_1,\dots,X_n$ be a simple random sample from a distribution with an unknown parameter $\theta$. An **estimator** is a statistic $\hat\theta = h(X_1,\dots,X_n)$ whose values for concrete samples are reasonable estimates of $\theta$. It is **unbiased** when $E(\hat\theta) = \theta$ — it “hits on average”.
:::

| Parameter | Estimator | Unbiased? |
|---|---|---|
| mean $\mu$ | $\bar X = \frac1n\sum X_i$ | yes |
| variance $\sigma^2$ | $S^2 = \frac{1}{n-1}\sum(X_i-\bar X)^2$ | yes |
| variance $\sigma^2$ | $\frac1n\sum(X_i-\bar X)^2$ | **no** (underestimates by the factor $\frac{n-1}{n}$ on average) {own} |
| proportion $p$ | $\hat p = \frac{\text{number of successes}}{n}$ | yes |

This is the explanation promised in topic 1: we divide by $n-1$ so that $S^2$ is unbiased.

# The idea of a confidence interval

A point estimate $\bar x = 4.2$ says nothing about **how far off** it might be. A confidence interval is a random interval that **with probability $1-\alpha$** (the confidence level, e.g. 0.95) contains the unknown parameter.

@chart zCrit

::: intuition
Imagine throwing a ring at a peg you can’t see. The peg is the true $\mu$, the ring is the interval. “95% confidence” means: **this way of throwing** hits 95 times out of 100. A particular interval either contains $\mu$ or not — we don’t know whether this throw was a hit.
:::

@chart ciSim

::: warn W08 | Frequency interpretation
Correct: “if the study were repeated many times, about 95% of intervals built this way would cover $\mu$”. Incorrect: “$\mu$ lies in **this** interval [4.0; 4.4] with probability 95%” — $\mu$ is not random, the interval is.
:::

# Model 1: mean, normal distribution, σ known

$X\sim N(\mu,\sigma)$, $\sigma$ known. Since $Z = \dfrac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)$, $P(-z_{1-\alpha/2}\le Z\le z_{1-\alpha/2}) = 1-\alpha$. Solving the inequality for $\mu$:

::: formula W08 | Confidence interval — model 1
$$\left[\bar x - z_{1-\alpha/2}\frac{\sigma}{\sqrt n},\ \ \bar x + z_{1-\alpha/2}\frac{\sigma}{\sqrt n}\right]$$
$z_{1-\alpha/2}$ — N(0, 1) quantile: 90% → 1.645; 95% → 1.96; 98% → 2.326; 99% → 2.576.
:::

::: example W08 | A petrol station
In 9 days 8019 l of gas were sold, $\sigma = 90$ l. $\bar x = 891$ l, $\sigma/\sqrt n = 30$.
- 98%: $891 \pm 2.33\cdot30 = [821.1;\ 960.9]$
- 80%: $891\pm1.28\cdot30 = [852.6;\ 929.4]$
Lower confidence → a **shorter** interval (but wrong more often).
:::

## How large a sample?

The length $2z_{1-\alpha/2}\frac{\sigma}{\sqrt n}$ doesn’t depend on the sample. We want the error $|\bar X-\mu|$ to be at most $d$ with probability $1-\alpha$:

::: formula W08 | Minimal sample size
$$n \ge \left(\frac{z_{1-\alpha/2}\,\sigma}{d}\right)^2\qquad\text{(round up)}$$
:::

::: example W08 | Nicotine in cigarettes
$\sigma = 8$ mg, $d = 1.5$ mg, level 0.95: $n\ge\left(\frac{1.96\cdot8}{1.5}\right)^2\approx109.3$ → **110 packs** must be tested (the slide says $n\ge109$ — in practice always round up {own}).
:::

# Model 2: mean, normal distribution, σ unknown

We replace $\sigma$ by its estimate $S$. The new statistic has a different distribution:

::: def W08 | Student’s t distribution
If $Z_0, Z_1,\dots,Z_k$ are independent $N(0,1)$, then $V = \dfrac{Z_0}{\sqrt{(Z_1^2+\dots+Z_k^2)/k}}$ has **Student’s t distribution with $k$ degrees of freedom** ($t_k$). Symmetric density, similar to the normal but with heavier tails; for $k>30$ practically $t_k\approx N(0,1)$. (W. S. Gosset, pen name “Student”.)
$$T = \frac{\bar X-\mu}{S/\sqrt n}\sim t_{n-1}$$
:::

@chart tVsNormal

::: formula W08 | Confidence interval — model 2
$$\left[\bar x - t_{1-\alpha/2,\,n-1}\frac{s}{\sqrt n},\ \ \bar x + t_{1-\alpha/2,\,n-1}\frac{s}{\sqrt n}\right]$$
:::

::: example W08 | Sugar consumption
Weekly sugar consumption (kg) in 5 weeks: 3.8; 4.5; 5.2; 4.0; 5.5. A 90% interval:
$\bar x = 4.6$, $\sum(x_i-\bar x)^2 = 2.18$, $s^2 = 0.545$, $s\approx0.738$, $t_{0.95;\,4} = 2.132$:
$$4.6\pm2.132\cdot\frac{0.738}{\sqrt5} = [3.896;\ 5.304]$$
:::

::: example W08 | A large sample
Service times of 64 bank customers: $\bar x = 3.2$ min, $s^2 = 1.44$. For $n>30$ the t quantile ≈ the normal one: $t_{0.99;\,63}\approx z_{0.99} = 2.33$. A 98% interval: $3.2\pm2.33\cdot\frac{1.2}{8} = [2.85;\ 3.55]$.
:::

::: note | Model 3: any distribution, large sample
When the distribution is **not** normal (or unknown) but the sample is large (formula sheet: $n\ge50$), by the CLT: $\bar x\pm z_{1-\alpha/2}\frac{s}{\sqrt n}$.
:::

# Confidence interval for the variance

::: def W08 | Chi-square distribution
If $Z_1,\dots,Z_n$ are independent $N(0,1)$, then $\chi^2 = \sum Z_i^2$ has the **chi-square distribution with $n$ degrees of freedom**. For a sample from $N(\mu,\sigma)$:
$$\frac{(n-1)S^2}{\sigma^2}\sim\chi^2_{n-1}$$
:::

@chart chi2

::: formula W08 | Confidence interval for σ² and σ (normal distribution)
$$\sigma^2\in\left[\frac{(n-1)s^2}{\chi^2_{1-\alpha/2,\,n-1}},\ \ \frac{(n-1)s^2}{\chi^2_{\alpha/2,\,n-1}}\right],\qquad \sigma\in\left[\sqrt{\frac{(n-1)s^2}{\chi^2_{1-\alpha/2,\,n-1}}},\ \sqrt{\frac{(n-1)s^2}{\chi^2_{\alpha/2,\,n-1}}}\right]$$
Note: the **larger** quantile goes into the denominator of the **left** end. The interval is **not** symmetric around $s^2$.
:::

::: example own
10 measurements, $s^2 = 0.052$. A 95% interval for $\sigma^2$: $\chi^2_{0.025;9} = 2.700$, $\chi^2_{0.975;9} = 19.023$, $(n-1)s^2 = 0.468$:
$$\sigma^2\in\left[\frac{0.468}{19.023};\ \frac{0.468}{2.700}\right] = [0.0246;\ 0.1733]$$
:::

# Confidence interval for a proportion

$X_i$ zero-one, $\hat p = \bar X$. By the CLT (when $n\hat p\ge5$, $n(1-\hat p)\ge5$; formula sheet: $n\ge100$):

::: formula W08 | Confidence interval for p
$$\left[\hat p - z_{1-\alpha/2}\sqrt{\frac{\hat p(1-\hat p)}{n}},\ \ \hat p + z_{1-\alpha/2}\sqrt{\frac{\hat p(1-\hat p)}{n}}\right]$$
:::

::: example W08 | A poll about the European Union
70% of 1000 respondents consider EU membership beneficial. 95%: $0.7\pm1.96\sqrt{\frac{0.7\cdot0.3}{1000}} = 0.7\pm0.028 = [0.67;\ 0.73]$.
:::

::: example W08 | Should we trust the producer?
The producer claims a reliability of 0.9. Among 100 items 15 failed: $\hat p = 0.85$. A 95% interval: $0.85\pm1.96\sqrt{\frac{0.85\cdot0.15}{100}} = [0.78;\ 0.92]$ — 0.9 **lies inside**, so the data do not contradict the claim.
:::

::: tip W08 | Why do polls use about 1000 people?
For an error of at most 3 percentage points at 95% confidence, in the worst case $p(1-p) = 0.25$: $n\ge0.25\left(\frac{1.96}{0.03}\right)^2\approx1067$.
:::

# Which model?

| What do we estimate? | Assumptions | Quantile | Formula |
|---|---|---|---|
| mean | normal, **σ known** | $z_{1-\alpha/2}$ | $\bar x\pm z\frac{\sigma}{\sqrt n}$ |
| mean | normal, **σ unknown** | $t_{1-\alpha/2,\,n-1}$ | $\bar x\pm t\frac{s}{\sqrt n}$ |
| mean | any, large $n$ | $z_{1-\alpha/2}$ | $\bar x\pm z\frac{s}{\sqrt n}$ |
| variance / σ | normal | $\chi^2_{\alpha/2},\ \chi^2_{1-\alpha/2}$ | $\left[\frac{(n-1)s^2}{\chi^2_{1-\alpha/2}}, \frac{(n-1)s^2}{\chi^2_{\alpha/2}}\right]$ |
| proportion | large $n$ | $z_{1-\alpha/2}$ | $\hat p\pm z\sqrt{\frac{\hat p(1-\hat p)}{n}}$ |

::: tip own | Grouped data (a common problem type)
When the data are in a table of intervals: compute $\bar x = \frac1n\sum n_i\tilde x_i$ and $s^2 = \frac{1}{n-1}\sum n_i(\tilde x_i-\bar x)^2$ from the **class midpoints** $\tilde x_i$, then use the usual formulas.
:::

::: note W08 | Ethics of reporting
Always report: the point estimate **and** the interval, the **confidence level**, the **sample size** and the **interpretation** of the interval.
:::

# In Excel

~~~excel Confidence intervals
B1: =AVERAGE(A2:A8)                        // mean
B2: =STDEV.S(A2:A8)                        // s
B3: =COUNT(A2:A8)                          // n
B4: =T.INV.2T(0.05,B3-1)                   // t_{0.975; n-1}
B5: =B1-B4*B2/SQRT(B3)                     // left end (model 2)
B6: =B1+B4*B2/SQRT(B3)                     // right end
B7: =CONFIDENCE.T(0.05,B2,B3)              // half-width — the same, faster
B8: =CONFIDENCE.NORM(0.05,2.1,49)          // model 1: z*σ/√n
B9: =(B3-1)*B2^2/CHISQ.INV(0.975,B3-1)     // left end for σ²
B10: =(B3-1)*B2^2/CHISQ.INV(0.025,B3-1)    // right end for σ²
~~~

::: warn own | Watch the Excel functions
‹T.INV.2T(α; df)› returns $t_{1-\alpha/2}$ directly (two-tailed), while ‹T.INV(p; df)› returns the quantile of order $p$. ‹CHISQ.INV(p; df)› is the quantile of order $p$ (left tail), ‹CHISQ.INV.RT(p; df)› — right tail.
:::

~~~python Confidence intervals with scipy
import numpy as np
from scipy import stats

x = np.array([41.2, 39.8, 42.5, 40.1, 43.0, 41.7, 40.6])
n, m, s = len(x), x.mean(), x.std(ddof=1)                 # ddof=1 → divisor n-1
print(stats.t.interval(0.95, n - 1, loc=m, scale=s / np.sqrt(n)))
chi_lo, chi_hi = stats.chi2.ppf([0.025, 0.975], n - 1)
print((n - 1) * s**2 / chi_hi, (n - 1) * s**2 / chi_lo)   # interval for σ²
p_hat, N = 945 / 1500, 1500
print(stats.norm.interval(0.95, loc=p_hat, scale=np.sqrt(p_hat * (1 - p_hat) / N)))
~~~

::: summary
- Unbiased estimators: $\bar X$, $S^2$ (divisor $n-1$), $\hat p$.
- A $1-\alpha$ interval: in the long run $(1-\alpha)\cdot100\%$ of intervals cover the parameter.
- σ known → $z$; σ unknown → $t_{n-1}$; variance → $\chi^2_{n-1}$ (two different quantiles); proportion → $z$ with $\hat p$.
- Higher confidence or smaller $n$ → a longer interval; $n\ge(z\sigma/d)^2$.
:::
`,

    cheatsheet: md`
## Estimators (unbiased)
$\bar X$ → μ · $S^2=\frac{1}{n-1}\sum(X_i-\bar X)^2$ → σ² · $\hat p = k/n$ → p

## Confidence intervals (level 1 − α)
| situation | interval |
|---|---|
| N(μ, σ), σ known | $\bar x\pm z_{1-\alpha/2}\,\sigma/\sqrt n$ |
| N(μ, σ), σ unknown | $\bar x\pm t_{1-\alpha/2,n-1}\,s/\sqrt n$ |
| any, large n | $\bar x\pm z_{1-\alpha/2}\,s/\sqrt n$ |
| σ² (normal) | $\big[\frac{(n-1)s^2}{\chi^2_{1-\alpha/2,n-1}};\frac{(n-1)s^2}{\chi^2_{\alpha/2,n-1}}\big]$ |
| σ | square roots of the σ² ends |
| p (large n) | $\hat p\pm z_{1-\alpha/2}\sqrt{\hat p(1-\hat p)/n}$ |

## Quantiles $z_{1-\alpha/2}$
90% → 1.645 · 95% → 1.96 · 98% → 2.326 · 99% → 2.576

## Sample size
$n\ge\big(z_{1-\alpha/2}\sigma/d\big)^2$ · proportion: $n\ge p(1-p)\big(z/d\big)^2$, worst case $p(1-p)=0.25$ · round up

## Grouped data
$\bar x=\frac1n\sum n_i\tilde x_i$, $s^2=\frac1{n-1}\sum n_i(\tilde x_i-\bar x)^2$ ($\tilde x_i$ = class midpoints)

## Excel
‹CONFIDENCE.NORM(α,σ,n)› ‹CONFIDENCE.T(α,s,n)› ‹T.INV.2T(α,df)› ‹CHISQ.INV(p,df)› ‹NORM.S.INV(p)›

## Always answer with: confidence level, n, interpretation
`,

    exercises: [
      {
        id: 'e1', tag: 'C11', title: 'File download time (σ known)',
        text: md`
From 49 random downloads the mean time was 12.6 s. Earlier studies show the standard deviation of the time is 2.1 s and the time is normal.
a) Give a point estimate of the mean time and choose a model for interval estimation.
b) Find confidence intervals at levels 0.95 and 0.99. Compare their lengths.
`,
        hint: md`$\sigma$ known → model 1. $\sigma/\sqrt n = 2.1/7 = 0.3$.`,
        solution: md`
a) Point estimate $\bar x = 12.6$ s; normal, $\sigma$ known → **model 1**.
b)
- 0.95: $12.6\pm1.96\cdot0.3 = [12.012;\ 13.188]$, length 1.176.
- 0.99: $12.6\pm2.576\cdot0.3 = [11.827;\ 13.373]$, length 1.546.

Higher confidence → a **longer** interval: to “hit” $\mu$ more often you need a bigger ring.
`,
        answer: md`95%: [12.01; 13.19]; 99%: [11.83; 13.37].`
      },
      {
        id: 'e2', tag: 'C11', title: 'Compile time (σ unknown) + interval for σ',
        text: md`
A project’s compile time (s) in 7 independent runs: 41.2; 39.8; 42.5; 40.1; 43.0; 41.7; 40.6. Assume normality. At confidence 0.95:
a) estimate the mean compile time (point and interval);
b) estimate the standard deviation (point and interval).
`,
        hint: md`a) model 2, $t_{0.975;6} = 2.447$. b) $\chi^2_{0.025;6} = 1.237$, $\chi^2_{0.975;6} = 14.449$.`,
        solution: md`
$\bar x\approx41.27$ s, $\sum(x_i-\bar x)^2\approx8.674$, $s^2\approx1.446$, $s\approx1.202$ s.

**a)** $41.27\pm2.447\cdot\frac{1.202}{\sqrt7} = 41.27\pm1.11 = [40.16;\ 42.38]$.

**b)** Point estimate $s\approx1.20$ s. For $\sigma^2$: $\left[\frac{8.674}{14.449};\ \frac{8.674}{1.237}\right] = [0.600;\ 7.010]$, so $\sigma\in[0.77;\ 2.65]$ s.
With such a small sample the interval for $\sigma$ is very wide.
`,
        answer: md`μ ∈ [40.16; 42.38] s; σ ∈ [0.77; 2.65] s.`
      },
      {
        id: 'e3', tag: 'C11', title: 'Students’ sleep — grouped data',
        text: md`
Hours of sleep of 40 random students:

| hours | 4–5 | 5–6 | 6–7 | 7–8 | 8–9 |
|---|---:|---:|---:|---:|---:|
| students | 3 | 8 | 15 | 10 | 4 |

a) Give point estimates of the mean sleep time and the variance.
b) Find 95% confidence intervals for the mean and for the variance (normal distribution).
`,
        hint: md`Midpoints: 4.5; 5.5; 6.5; 7.5; 8.5. $t_{0.975;39}\approx2.023$; $\chi^2_{0.025;39}\approx23.65$, $\chi^2_{0.975;39}\approx58.12$.`,
        solution: md`
**a)** $\bar x = \frac{264}{40} = 6.6$ h; $\sum n_i(\tilde x_i-\bar x)^2 = 45.6$, $s^2 = \frac{45.6}{39}\approx1.169$, $s\approx1.081$.

**b)** Mean: $6.6\pm2.023\cdot\frac{1.081}{\sqrt{40}} = [6.25;\ 6.95]$ h. Variance: $\left[\frac{45.6}{58.12};\ \frac{45.6}{23.65}\right] = [0.785;\ 1.928]$ h².
`,
        answer: md`$\bar x=6.6$ h, $s^2\approx1.17$; μ ∈ [6.25; 6.95]; σ² ∈ [0.79; 1.93].`
      },
      {
        id: 'e4', tag: 'C11', title: 'A new app feature — proportion',
        text: md`
Of 1500 random users, 945 chose the new interface. Estimate (point and 95% interval) the share of users preferring the new version.
`,
        hint: md`$\hat p = 945/1500$. Check $n\hat p\ge5$, $n(1-\hat p)\ge5$.`,
        solution: md`
$\hat p = 0.63$; conditions hold (945 and 555). $\sqrt{\frac{0.63\cdot0.37}{1500}}\approx0.01247$.
$0.63\pm1.96\cdot0.01247 = [0.606;\ 0.654]$ → from about 60.6% to 65.4% (95% confidence, $n=1500$).
`,
        answer: md`$\hat p = 63\%$; interval [60.6%; 65.4%].`
      },
      {
        id: 'e5', tag: 'C11', title: 'Food delivery time — mean and share',
        text: md`
Delivery time of 250 random orders (min):

| time | 10–20 | 20–30 | 30–40 | 40–50 | 50–60 |
|---|---:|---:|---:|---:|---:|
| orders | 30 | 85 | 90 | 35 | 10 |

Estimate (point and 95% interval) the mean delivery time and the share of orders delivered in under 30 minutes.
`,
        hint: md`A large sample with an unknown distribution → model 3 ($z$ and $s$). Orders < 30 min: the first two classes.`,
        solution: md`
Midpoints: 15, 25, 35, 45, 55. $\bar x = 31.4$ min; $s^2\approx99.44$, $s\approx9.97$.
Mean: $31.4\pm1.96\cdot\frac{9.97}{\sqrt{250}} = [30.16;\ 32.64]$ min.
Share: $\hat p = 0.46$; $0.46\pm1.96\sqrt{\frac{0.46\cdot0.54}{250}} = [0.398;\ 0.522]$.
`,
        answer: md`μ ∈ [30.2; 32.6] min; p ∈ [39.8%; 52.2%].`
      },
      {
        id: 'e6', own: true, title: 'How large a sample?',
        text: md`
a) The standard deviation of the download time is 2.1 s. How many downloads must be measured so that with 95% confidence the error of the mean is at most 0.5 s?
b) How many people must be polled for an error of at most 2 percentage points (95%) if we know nothing about $p$?
`,
        hint: md`a) $n\ge(z\sigma/d)^2$. b) worst case $p(1-p) = 0.25$.`,
        solution: md`
a) $n\ge\left(\frac{1.96\cdot2.1}{0.5}\right)^2\approx67.8$ → **68 downloads**.
b) $n\ge0.25\left(\frac{1.96}{0.02}\right)^2 = 2401$ → **2401 people**. (For a 3 pp error 1068 suffice — hence typical polls of ~1000.)
`,
        answer: md`a) 68; b) 2401.`
      },
      {
        id: 'e7', own: true, title: 'What does “95% confidence” really mean?',
        text: md`
From a sample, a 95% confidence interval for the mean time was found: [12.0; 13.2] s. Which statements are true?
1. The true mean $\mu$ lies in [12.0; 13.2] with probability 0.95.
2. If the study were repeated many times, about 95% of intervals built this way would contain $\mu$.
3. 95% of all downloads take between 12.0 and 13.2 s.
4. A 99% interval from the same sample would be longer.
`,
        hint: md`What is random: $\mu$ or the interval? Is the interval about single observations or about the mean?`,
        solution: md`
1. **False** (in the lecture’s frequency interpretation) — $\mu$ is a constant; this interval either contains it or not.
2. **True** — that is the frequency interpretation.
3. **False** — the interval is about the **mean**, not single observations (those spread much wider, by $\sigma$, not $\sigma/\sqrt n$).
4. **True** — a larger quantile ($2.576>1.96$) → a longer interval.
`,
        answer: md`True: 2 and 4.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'По выборке параметр точно не узнать — но можно дать **лучшую оценку** (точечное оценивание) и **интервал**, который с заданной вероятностью его содержит (доверительный интервал).',
    lecture: md`
# Точечное оценивание

::: def W08 | Оценка (estymator)
Пусть $X_1,\dots,X_n$ — простая случайная выборка из распределения с неизвестным параметром $\theta$. **Оценка** — статистика $\hat\theta = h(X_1,\dots,X_n)$, значения которой для конкретных выборок — разумные приближения $\theta$. Оценка **несмещённая**, если $E(\hat\theta) = \theta$ — «в среднем попадает».
:::

| Параметр | Оценка | Несмещённая? |
|---|---|---|
| среднее $\mu$ | $\bar X = \frac1n\sum X_i$ | да |
| дисперсия $\sigma^2$ | $S^2 = \frac{1}{n-1}\sum(X_i-\bar X)^2$ | да |
| дисперсия $\sigma^2$ | $\frac1n\sum(X_i-\bar X)^2$ | **нет** (в среднем занижает в $\frac{n-1}{n}$ раз) {own} |
| доля $p$ | $\hat p = \frac{\text{число успехов}}{n}$ | да |

Это и есть объяснение, обещанное в теме 1: делим на $n-1$, чтобы $S^2$ была несмещённой.

# Идея доверительного интервала

Точечная оценка $\bar x = 4{,}2$ ничего не говорит о том, **насколько** она может ошибаться. Доверительный интервал — случайный интервал, который **с вероятностью $1-\alpha$** (доверительная вероятность, например 0,95) содержит неизвестный параметр.

@chart zCrit

::: intuition
Представьте, что вы бросаете кольцо на колышек, которого не видно. Колышек — истинное $\mu$, кольцо — интервал. «95% доверия» значит: **этот способ бросать** попадает 95 раз из 100. Конкретный интервал либо содержит $\mu$, либо нет — мы не знаем, попали ли именно сейчас.
:::

@chart ciSim

::: warn W08 | Частотная интерпретация
Верно: «при многократном повторении исследования около 95% построенных так интервалов накроют $\mu$». Неверно: «$\mu$ с вероятностью 95% лежит в **этом** интервале [4,0; 4,4]» — $\mu$ не случайна, случаен интервал.
:::

# Модель 1: среднее, нормальное распределение, σ известно

$X\sim N(\mu,\sigma)$, $\sigma$ известно. Так как $Z = \dfrac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)$, то $P(-z_{1-\alpha/2}\le Z\le z_{1-\alpha/2}) = 1-\alpha$. Решая неравенство относительно $\mu$:

::: formula W08 | Доверительный интервал — модель 1
$$\left[\bar x - z_{1-\alpha/2}\frac{\sigma}{\sqrt n},\ \ \bar x + z_{1-\alpha/2}\frac{\sigma}{\sqrt n}\right]$$
$z_{1-\alpha/2}$ — квантиль N(0, 1): 90% → 1,645; 95% → 1,96; 98% → 2,326; 99% → 2,576.
:::

::: example W08 | Заправка
За 9 дней продали 8019 л газа, $\sigma = 90$ л. $\bar x = 891$ л, $\sigma/\sqrt n = 30$.
- 98%: $891 \pm 2{,}33\cdot30 = [821{,}1;\ 960{,}9]$
- 80%: $891\pm1{,}28\cdot30 = [852{,}6;\ 929{,}4]$
Ниже доверие → **короче** интервал (но он чаще ошибается).
:::

## Какой нужен объём выборки?

Длина интервала $2z_{1-\alpha/2}\frac{\sigma}{\sqrt n}$ не зависит от выборки. Хотим, чтобы ошибка $|\bar X-\mu|$ не превысила $d$ с вероятностью $1-\alpha$:

::: formula W08 | Минимальный объём выборки
$$n \ge \left(\frac{z_{1-\alpha/2}\,\sigma}{d}\right)^2\qquad\text{(округляем вверх)}$$
:::

::: example W08 | Никотин в сигаретах
$\sigma = 8$ мг, $d = 1{,}5$ мг, уровень 0,95: $n\ge\left(\frac{1{,}96\cdot8}{1{,}5}\right)^2\approx109{,}3$ → нужно проверить **110 пачек** (на слайде записано $n\ge109$ — на практике всегда округляем вверх {own}).
:::

# Модель 2: среднее, нормальное распределение, σ неизвестно

Заменяем $\sigma$ её оценкой $S$. У новой статистики уже другое распределение:

::: def W08 | Распределение Стьюдента
Если $Z_0, Z_1,\dots,Z_k$ независимы и $N(0,1)$, то $V = \dfrac{Z_0}{\sqrt{(Z_1^2+\dots+Z_k^2)/k}}$ имеет **распределение Стьюдента с $k$ степенями свободы** ($t_k$). Плотность симметрична, похожа на нормальную, но с более тяжёлыми хвостами; при $k>30$ практически $t_k\approx N(0,1)$. (У. С. Госсет, псевдоним «Student».)
$$T = \frac{\bar X-\mu}{S/\sqrt n}\sim t_{n-1}$$
:::

@chart tVsNormal

::: formula W08 | Доверительный интервал — модель 2
$$\left[\bar x - t_{1-\alpha/2,\,n-1}\frac{s}{\sqrt n},\ \ \bar x + t_{1-\alpha/2,\,n-1}\frac{s}{\sqrt n}\right]$$
:::

::: example W08 | Расход сахара
Недельный расход сахара (кг) за 5 недель: 3,8; 4,5; 5,2; 4,0; 5,5. Интервал 90%:
$\bar x = 4{,}6$, $\sum(x_i-\bar x)^2 = 2{,}18$, $s^2 = 0{,}545$, $s\approx0{,}738$, $t_{0{,}95;\,4} = 2{,}132$:
$$4{,}6\pm2{,}132\cdot\frac{0{,}738}{\sqrt5} = [3{,}896;\ 5{,}304]$$
:::

::: example W08 | Большая выборка
Время обслуживания 64 клиентов банка: $\bar x = 3{,}2$ мин, $s^2 = 1{,}44$. При $n>30$ квантиль $t$ ≈ нормальному: $t_{0{,}99;\,63}\approx z_{0{,}99} = 2{,}33$. Интервал 98%: $3{,}2\pm2{,}33\cdot\frac{1{,}2}{8} = [2{,}85;\ 3{,}55]$.
:::

::: note | Модель 3: любое распределение, большая выборка
Если распределение **не** нормальное (или неизвестно), но выборка большая (в листе формул: $n\ge50$), по ЦПТ: $\bar x\pm z_{1-\alpha/2}\frac{s}{\sqrt n}$.
:::

# Доверительный интервал для дисперсии

::: def W08 | Распределение хи-квадрат
Если $Z_1,\dots,Z_n$ независимы и $N(0,1)$, то $\chi^2 = \sum Z_i^2$ имеет **распределение хи-квадрат с $n$ степенями свободы**. Для выборки из $N(\mu,\sigma)$:
$$\frac{(n-1)S^2}{\sigma^2}\sim\chi^2_{n-1}$$
:::

@chart chi2

::: formula W08 | Доверительный интервал для σ² и σ (нормальное распределение)
$$\sigma^2\in\left[\frac{(n-1)s^2}{\chi^2_{1-\alpha/2,\,n-1}},\ \ \frac{(n-1)s^2}{\chi^2_{\alpha/2,\,n-1}}\right],\qquad \sigma\in\left[\sqrt{\frac{(n-1)s^2}{\chi^2_{1-\alpha/2,\,n-1}}},\ \sqrt{\frac{(n-1)s^2}{\chi^2_{\alpha/2,\,n-1}}}\right]$$
Внимание: **больший** квантиль — в знаменателе **левого** конца. Интервал **не** симметричен относительно $s^2$.
:::

::: example own
10 измерений, $s^2 = 0{,}052$. Интервал 95% для $\sigma^2$: $\chi^2_{0{,}025;9} = 2{,}700$, $\chi^2_{0{,}975;9} = 19{,}023$, $(n-1)s^2 = 0{,}468$:
$$\sigma^2\in\left[\frac{0{,}468}{19{,}023};\ \frac{0{,}468}{2{,}700}\right] = [0{,}0246;\ 0{,}1733]$$
:::

# Доверительный интервал для доли

$X_i$ нуль-единичные, $\hat p = \bar X$. По ЦПТ (при $n\hat p\ge5$, $n(1-\hat p)\ge5$; в листе формул: $n\ge100$):

::: formula W08 | Доверительный интервал для p
$$\left[\hat p - z_{1-\alpha/2}\sqrt{\frac{\hat p(1-\hat p)}{n}},\ \ \hat p + z_{1-\alpha/2}\sqrt{\frac{\hat p(1-\hat p)}{n}}\right]$$
:::

::: example W08 | Опрос о Евросоюзе
70% из 1000 опрошенных считают членство в ЕС выгодным. 95%: $0{,}7\pm1{,}96\sqrt{\frac{0{,}7\cdot0{,}3}{1000}} = 0{,}7\pm0{,}028 = [0{,}67;\ 0{,}73]$.
:::

::: example W08 | Верить ли производителю?
Производитель утверждает, что надёжность изделий 0,9. Из 100 изделий 15 отказали: $\hat p = 0{,}85$. Интервал 95%: $0{,}85\pm1{,}96\sqrt{\frac{0{,}85\cdot0{,}15}{100}} = [0{,}78;\ 0{,}92]$ — значение 0,9 **попадает** в интервал, так что данные не противоречат утверждению.
:::

::: tip W08 | Почему в опросах около 1000 человек?
Чтобы ошибка не превысила 3 процентных пункта при 95% доверии, в худшем случае $p(1-p) = 0{,}25$: $n\ge0{,}25\left(\frac{1{,}96}{0{,}03}\right)^2\approx1067$.
:::

# Какую модель выбрать?

| Что оцениваем? | Предпосылки | Квантиль | Формула |
|---|---|---|---|
| среднее | нормальное, **σ известно** | $z_{1-\alpha/2}$ | $\bar x\pm z\frac{\sigma}{\sqrt n}$ |
| среднее | нормальное, **σ неизвестно** | $t_{1-\alpha/2,\,n-1}$ | $\bar x\pm t\frac{s}{\sqrt n}$ |
| среднее | любое, большое $n$ | $z_{1-\alpha/2}$ | $\bar x\pm z\frac{s}{\sqrt n}$ |
| дисперсия / σ | нормальное | $\chi^2_{\alpha/2},\ \chi^2_{1-\alpha/2}$ | $\left[\frac{(n-1)s^2}{\chi^2_{1-\alpha/2}}, \frac{(n-1)s^2}{\chi^2_{\alpha/2}}\right]$ |
| доля | большое $n$ | $z_{1-\alpha/2}$ | $\hat p\pm z\sqrt{\frac{\hat p(1-\hat p)}{n}}$ |

::: tip own | Сгруппированные данные (частый тип задач)
Если данные в таблице интервалов: считайте $\bar x = \frac1n\sum n_i\tilde x_i$ и $s^2 = \frac{1}{n-1}\sum n_i(\tilde x_i-\bar x)^2$ по **серединам классов** $\tilde x_i$, а затем применяйте обычные формулы.
:::

::: note W08 | Этика представления результатов
Всегда указывайте: точечную оценку **и** интервал, **уровень доверия**, **объём выборки** и **интерпретацию** интервала.
:::

# В Excel

~~~excel Доверительные интервалы
B1: =AVERAGE(A2:A8)                        // среднее
B2: =STDEV.S(A2:A8)                        // s
B3: =COUNT(A2:A8)                          // n
B4: =T.INV.2T(0.05,B3-1)                   // t_{0,975; n-1}
B5: =B1-B4*B2/SQRT(B3)                     // левый конец (модель 2)
B6: =B1+B4*B2/SQRT(B3)                     // правый конец
B7: =CONFIDENCE.T(0.05,B2,B3)              // полуширина — то же, быстрее
B8: =CONFIDENCE.NORM(0.05,2.1,49)          // модель 1: z*σ/√n
B9: =(B3-1)*B2^2/CHISQ.INV(0.975,B3-1)     // левый конец для σ²
B10: =(B3-1)*B2^2/CHISQ.INV(0.025,B3-1)    // правый конец для σ²
~~~

::: warn own | Осторожно с функциями Excel
‹T.INV.2T(α; df)› сразу возвращает $t_{1-\alpha/2}$ (двусторонний), а ‹T.INV(p; df)› — квантиль порядка $p$. ‹CHISQ.INV(p; df)› — квантиль порядка $p$ (левый хвост), ‹CHISQ.INV.RT(p; df)› — правый хвост.
:::

~~~python Доверительные интервалы в scipy
import numpy as np
from scipy import stats

x = np.array([41.2, 39.8, 42.5, 40.1, 43.0, 41.7, 40.6])
n, m, s = len(x), x.mean(), x.std(ddof=1)                 # ddof=1 → делитель n-1
print(stats.t.interval(0.95, n - 1, loc=m, scale=s / np.sqrt(n)))
chi_lo, chi_hi = stats.chi2.ppf([0.025, 0.975], n - 1)
print((n - 1) * s**2 / chi_hi, (n - 1) * s**2 / chi_lo)   # интервал для σ²
p_hat, N = 945 / 1500, 1500
print(stats.norm.interval(0.95, loc=p_hat, scale=np.sqrt(p_hat * (1 - p_hat) / N)))
~~~

::: summary
- Несмещённые оценки: $\bar X$, $S^2$ (делитель $n-1$), $\hat p$.
- Интервал $1-\alpha$: в долгосрочной перспективе $(1-\alpha)\cdot100\%$ интервалов накрывают параметр.
- σ известно → $z$; σ неизвестно → $t_{n-1}$; дисперсия → $\chi^2_{n-1}$ (два разных квантиля); доля → $z$ с $\hat p$.
- Выше доверие или меньше $n$ → длиннее интервал; $n\ge(z\sigma/d)^2$.
:::
`,

    cheatsheet: md`
## Оценки (несмещённые)
$\bar X$ → μ · $S^2=\frac{1}{n-1}\sum(X_i-\bar X)^2$ → σ² · $\hat p = k/n$ → p

## Доверительные интервалы (уровень 1 − α)
| ситуация | интервал |
|---|---|
| N(μ, σ), σ известно | $\bar x\pm z_{1-\alpha/2}\,\sigma/\sqrt n$ |
| N(μ, σ), σ неизвестно | $\bar x\pm t_{1-\alpha/2,n-1}\,s/\sqrt n$ |
| любое, большое n | $\bar x\pm z_{1-\alpha/2}\,s/\sqrt n$ |
| σ² (нормальное) | $\big[\frac{(n-1)s^2}{\chi^2_{1-\alpha/2,n-1}};\frac{(n-1)s^2}{\chi^2_{\alpha/2,n-1}}\big]$ |
| σ | корни из концов для σ² |
| p (большое n) | $\hat p\pm z_{1-\alpha/2}\sqrt{\hat p(1-\hat p)/n}$ |

## Квантили $z_{1-\alpha/2}$
90% → 1,645 · 95% → 1,96 · 98% → 2,326 · 99% → 2,576

## Объём выборки
$n\ge\big(z_{1-\alpha/2}\sigma/d\big)^2$ · доля: $n\ge p(1-p)\big(z/d\big)^2$, худший случай $p(1-p)=0{,}25$ · округлять вверх

## Сгруппированные данные
$\bar x=\frac1n\sum n_i\tilde x_i$, $s^2=\frac1{n-1}\sum n_i(\tilde x_i-\bar x)^2$ ($\tilde x_i$ — середины классов)

## Excel
‹CONFIDENCE.NORM(α,σ,n)› ‹CONFIDENCE.T(α,s,n)› ‹T.INV.2T(α,df)› ‹CHISQ.INV(p,df)› ‹NORM.S.INV(p)›

## В ответе всегда: уровень доверия, n, интерпретация
`,

    exercises: [
      {
        id: 'e1', tag: 'C11', title: 'Время скачивания файла (σ известно)',
        text: md`
По 49 случайным скачиваниям среднее время 12,6 с. Из прежних исследований известно, что стандартное отклонение времени 2,1 с, а время распределено нормально.
а) Дайте точечную оценку среднего времени и выберите модель для интервальной оценки.
б) Найдите доверительные интервалы на уровнях 0,95 и 0,99. Сравните их длины.
`,
        hint: md`$\sigma$ известно → модель 1. $\sigma/\sqrt n = 2{,}1/7 = 0{,}3$.`,
        solution: md`
а) Точечная оценка $\bar x = 12{,}6$ с; нормальное, $\sigma$ известно → **модель 1**.
б)
- 0,95: $12{,}6\pm1{,}96\cdot0{,}3 = [12{,}012;\ 13{,}188]$, длина 1,176.
- 0,99: $12{,}6\pm2{,}576\cdot0{,}3 = [11{,}827;\ 13{,}373]$, длина 1,546.

Выше доверие → **длиннее** интервал: чтобы чаще «попадать» в $\mu$, нужно кольцо побольше.
`,
        answer: md`95%: [12,01; 13,19]; 99%: [11,83; 13,37].`
      },
      {
        id: 'e2', tag: 'C11', title: 'Время компиляции (σ неизвестно) + интервал для σ',
        text: md`
Время компиляции проекта (с) в 7 независимых запусках: 41,2; 39,8; 42,5; 40,1; 43,0; 41,7; 40,6. Предполагаем нормальность. На уровне 0,95:
а) оцените точечно и интервально среднее время компиляции;
б) оцените точечно и интервально стандартное отклонение.
`,
        hint: md`а) модель 2, $t_{0{,}975;6} = 2{,}447$. б) $\chi^2_{0{,}025;6} = 1{,}237$, $\chi^2_{0{,}975;6} = 14{,}449$.`,
        solution: md`
$\bar x\approx41{,}27$ с, $\sum(x_i-\bar x)^2\approx8{,}674$, $s^2\approx1{,}446$, $s\approx1{,}202$ с.

**а)** $41{,}27\pm2{,}447\cdot\frac{1{,}202}{\sqrt7} = [40{,}16;\ 42{,}38]$.

**б)** Точечная оценка $s\approx1{,}20$ с. Для $\sigma^2$: $\left[\frac{8{,}674}{14{,}449};\ \frac{8{,}674}{1{,}237}\right] = [0{,}600;\ 7{,}010]$, значит $\sigma\in[0{,}77;\ 2{,}65]$ с. При такой маленькой выборке интервал для $\sigma$ очень широкий.
`,
        answer: md`μ ∈ [40,16; 42,38] с; σ ∈ [0,77; 2,65] с.`
      },
      {
        id: 'e3', tag: 'C11', title: 'Сон студентов — сгруппированные данные',
        text: md`
Часы сна 40 случайных студентов:

| часы | 4–5 | 5–6 | 6–7 | 7–8 | 8–9 |
|---|---:|---:|---:|---:|---:|
| студентов | 3 | 8 | 15 | 10 | 4 |

а) Дайте точечные оценки среднего времени сна и дисперсии.
б) Найдите 95% доверительные интервалы для среднего и для дисперсии (нормальное распределение).
`,
        hint: md`Середины: 4,5; 5,5; 6,5; 7,5; 8,5. $t_{0{,}975;39}\approx2{,}023$; $\chi^2_{0{,}025;39}\approx23{,}65$, $\chi^2_{0{,}975;39}\approx58{,}12$.`,
        solution: md`
**а)** $\bar x = \frac{264}{40} = 6{,}6$ ч; $\sum n_i(\tilde x_i-\bar x)^2 = 45{,}6$, $s^2 = \frac{45{,}6}{39}\approx1{,}169$, $s\approx1{,}081$.

**б)** Среднее: $6{,}6\pm2{,}023\cdot\frac{1{,}081}{\sqrt{40}} = [6{,}25;\ 6{,}95]$ ч. Дисперсия: $\left[\frac{45{,}6}{58{,}12};\ \frac{45{,}6}{23{,}65}\right] = [0{,}785;\ 1{,}928]$ ч².
`,
        answer: md`$\bar x=6{,}6$ ч, $s^2\approx1{,}17$; μ ∈ [6,25; 6,95]; σ² ∈ [0,79; 1,93].`
      },
      {
        id: 'e4', tag: 'C11', title: 'Новая функция в приложении — доля',
        text: md`
Из 1500 случайных пользователей 945 выбрали новый интерфейс. Оцените точечно и интервально (95%) долю пользователей, предпочитающих новую версию.
`,
        hint: md`$\hat p = 945/1500$. Проверьте $n\hat p\ge5$, $n(1-\hat p)\ge5$.`,
        solution: md`
$\hat p = 0{,}63$; условия выполнены (945 и 555). $\sqrt{\frac{0{,}63\cdot0{,}37}{1500}}\approx0{,}01247$.
$0{,}63\pm1{,}96\cdot0{,}01247 = [0{,}606;\ 0{,}654]$ → примерно от 60,6% до 65,4% (95% доверия, $n=1500$).
`,
        answer: md`$\hat p = 63\%$; интервал [60,6%; 65,4%].`
      },
      {
        id: 'e5', tag: 'C11', title: 'Время доставки еды — среднее и доля',
        text: md`
Время доставки 250 случайных заказов (мин):

| время | 10–20 | 20–30 | 30–40 | 40–50 | 50–60 |
|---|---:|---:|---:|---:|---:|
| заказов | 30 | 85 | 90 | 35 | 10 |

Оцените точечно и интервально (95%) среднее время доставки и долю заказов, доставленных быстрее 30 минут.
`,
        hint: md`Большая выборка с неизвестным распределением → модель 3 ($z$ и $s$). Заказы < 30 мин — первые два класса.`,
        solution: md`
Середины: 15, 25, 35, 45, 55. $\bar x = 31{,}4$ мин; $s^2\approx99{,}44$, $s\approx9{,}97$.
Среднее: $31{,}4\pm1{,}96\cdot\frac{9{,}97}{\sqrt{250}} = [30{,}16;\ 32{,}64]$ мин.
Доля: $\hat p = 0{,}46$; $0{,}46\pm1{,}96\sqrt{\frac{0{,}46\cdot0{,}54}{250}} = [0{,}398;\ 0{,}522]$.
`,
        answer: md`μ ∈ [30,2; 32,6] мин; p ∈ [39,8%; 52,2%].`
      },
      {
        id: 'e6', own: true, title: 'Какой нужен объём выборки?',
        text: md`
а) Стандартное отклонение времени скачивания 2,1 с. Сколько скачиваний нужно измерить, чтобы с доверием 95% ошибка среднего не превышала 0,5 с?
б) Сколько людей нужно опросить, чтобы ошибка оценки доли не превысила 2 процентных пункта (95%), если о $p$ ничего не известно?
`,
        hint: md`а) $n\ge(z\sigma/d)^2$. б) худший случай $p(1-p) = 0{,}25$.`,
        solution: md`
а) $n\ge\left(\frac{1{,}96\cdot2{,}1}{0{,}5}\right)^2\approx67{,}8$ → **68 скачиваний**.
б) $n\ge0{,}25\left(\frac{1{,}96}{0{,}02}\right)^2 = 2401$ → **2401 человек**. (Для ошибки 3 п.п. хватит 1068 — отсюда типичные опросы примерно на 1000 человек.)
`,
        answer: md`а) 68; б) 2401.`
      },
      {
        id: 'e7', own: true, title: 'Что на самом деле значит «95% доверия»?',
        text: md`
По выборке построен 95% доверительный интервал для среднего времени: [12,0; 13,2] с. Какие утверждения верны?
1. Истинное среднее $\mu$ с вероятностью 0,95 лежит в [12,0; 13,2].
2. Если много раз повторить исследование, около 95% построенных так интервалов будут содержать $\mu$.
3. 95% всех скачиваний длятся от 12,0 до 13,2 с.
4. 99% интервал по той же выборке был бы длиннее.
`,
        hint: md`Что случайно: $\mu$ или интервал? Интервал про отдельные наблюдения или про среднее?`,
        solution: md`
1. **Неверно** (в частотной интерпретации из лекции) — $\mu$ постоянна; этот интервал либо её содержит, либо нет.
2. **Верно** — это и есть частотная интерпретация.
3. **Неверно** — интервал про **среднее**, а не про отдельные наблюдения (они разбросаны гораздо шире, на $\sigma$, а не на $\sigma/\sqrt n$).
4. **Верно** — больший квантиль ($2{,}576>1{,}96$) → длиннее интервал.
`,
        answer: md`Верны: 2 и 4.`
      }
    ]
  };

  SAD.registerTopic('t09', { charts: charts, pl: pl, en: en, ru: ru });
})();
