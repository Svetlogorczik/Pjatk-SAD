/* Topic 10 — Hypothesis testing, one population (lecture W09, classes C12) */
(function () {
  var md = SAD.md;

  var charts = {
    rightTail: { type: 'pdf', dist: { name: 'normal', mu: 0, sigma: 1 }, range: [-3.5, 4],
      shade: [{ from: 2.33, to: 4, cls: '2', label: 'α = 0,01', labelX: 3.1, labelY: 0.04 }],
      markers: [{ x: 2.33, label: 'z₀,₉₉ = 2,33' }, { x: 3, label: 'z = 3' }],
      caption: { pl: 'Test prawostronny: zbiór krytyczny C = [2,33; ∞). Obliczone z = 3 wpada do C → odrzucamy H₀.', en: 'Right-tailed test: critical region C = [2.33; ∞). The computed z = 3 falls into C → reject H₀.', ru: 'Правосторонний тест: критическая область C = [2,33; ∞). Вычисленное z = 3 попадает в C → отвергаем H₀.' } },
    twoTailT: { type: 'pdf', dist: { name: 't', df: 3 }, range: [-5, 5],
      shade: [{ from: -5, to: -2.353, cls: '2', label: 'α = 0,05', labelX: -3.8, labelY: 0.03 }],
      markers: [{ x: -2.353, label: '−2,353' }, { x: -2.1, label: 't = −2,10', anchor: 'start' }],
      caption: { pl: 'Test lewostronny t (3 st. sw.): t = −2,10 nie wpada do C = (−∞; −2,353] → brak podstaw do odrzucenia H₀', en: 'Left-tailed t test (3 df): t = −2.10 is not in C = (−∞; −2.353] → no grounds to reject H₀', ru: 'Левосторонний t-тест (3 ст. св.): t = −2,10 не попадает в C = (−∞; −2,353] → нет оснований отвергнуть H₀' } },
    chiTwo: { type: 'pdf', dist: { name: 'chi2', df: 14 }, range: [0, 40],
      shade: [{ from: 0, to: 5.629, cls: '2' }, { from: 26.119, to: 40, cls: '2' }],
      markers: [{ x: 5.629, label: '5,629' }, { x: 26.119, label: '26,119' }, { x: 23.66, label: 'χ² = 23,66', anchor: 'end' }],
      caption: { pl: 'Test dwustronny dla wariancji (14 st. sw.): po α/2 = 0,025 w każdym ogonie', en: 'Two-sided variance test (14 df): α/2 = 0.025 in each tail', ru: 'Двусторонний тест для дисперсии (14 ст. св.): по α/2 = 0,025 в каждом хвосте' } }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Test statystyczny odpowiada na pytanie „czy dane przemawiają przeciw pewnemu twierdzeniu?”. Uczymy się formułować hipotezy, wybierać statystykę testową, wyznaczać zbiór krytyczny i poprawnie formułować wniosek.',
    lecture: md`
# Hipoteza statystyczna

**Hipoteza statystyczna** to przypuszczenie o nieznanej własności rozkładu badanej cechy. {lecture:W09}

::: example W09 | Przykłady hipotez
- Producent opon: trwałość ponad 60 000 km → $H:\ \mu > 60\,000$.
- Producent drukarek: średnio ponad 200 h bez awarii → $H:\ \mu>200$.
- Socjolog: dzieci w miastach mają lepsze wyniki → $H:\ p_1>p_2$.
- Fizycy: liczba cząstek ma rozkład Poissona → $H:\ X\sim P(\lambda)$.
:::

Trzy pierwsze to hipotezy **parametryczne** (dotyczą parametru), czwarta — **nieparametryczna** (dotyczy postaci rozkładu, temat 11).

::: def W09 | Hipoteza zerowa i alternatywna
- $H_0$ — **hipoteza zerowa**: testujemy ją w celu ewentualnego **odrzucenia**; zawsze zawiera „=” (np. $\mu = \mu_0$).
- $H_1$ — **hipoteza alternatywna**: przyjmiemy ją, gdy odrzucimy $H_0$; to zwykle to, co **chcemy wykazać**.
$H_0$ i $H_1$ muszą się **wykluczać** (np. nie można $H_0: p=\frac12$, $H_1: p\ge\frac13$ — wartość $\frac12$ należałaby do obu).
:::

::: example W09 | Nowa terapia
Stara terapia skuteczna w 80%. Nowa będzie wdrożona tylko, gdy „mamy pewność”, że jest lepsza: $H_0:\ p = 0{,}8$, $H_1:\ p>0{,}8$.
:::

::: intuition
Test to **proces sądowy**. $H_0$ = „oskarżony niewinny” (domniemanie niewinności). Prokurator (dane) musi przedstawić mocne dowody, żeby ją odrzucić. Jeśli dowodów brak, **nie** mówimy „jest niewinny”, tylko „**nie ma podstaw** do skazania”.
:::

# Jak działa test — krok po kroku

Przykład z wykładu: nowa technologia ma zmniejszyć emisję. $H_0:\ \mu = \mu_0$, $H_1:\ \mu<\mu_0$; pomiary $X_1,\dots,X_n\sim N(\mu,\sigma)$, $\sigma$ znane. Jeśli $H_0$ jest prawdziwa, to
$$Z = \frac{\bar X-\mu_0}{\sigma/\sqrt n}\sim N(0,1).$$
Gdy prawdziwa jest $H_1$, wartości $Z$ są przesunięte **w lewo**. Dlatego **bardzo małe** $z$ świadczą przeciw $H_0$: odrzucamy ją, gdy $z\le -z_{1-\alpha}$. {lecture:W09}

::: def W09 | Poziom istotności, zbiór krytyczny
- **Poziom istotności $\alpha$** — prawdopodobieństwo odrzucenia $H_0$, gdy jest ona prawdziwa (błąd I rodzaju); zwykle 0,01; 0,05; 0,1.
- **Zbiór krytyczny $C$** — wartości statystyki testowej, dla których odrzucamy $H_0$. Dobieramy go tak, żeby $P_{H_0}(Z\in C) = \alpha$.
:::

| | nie odrzucamy $H_0$ | odrzucamy $H_0$ (przyjmujemy $H_1$) |
|---|---|---|
| **$H_0$ prawdziwa** | decyzja poprawna | **błąd I rodzaju** (prawdop. $\alpha$) |
| **$H_1$ prawdziwa** | **błąd II rodzaju** | decyzja poprawna |

::: warn W09 | Poprawne sformułowanie wniosku
- $z\in C$ → „**odrzucamy $H_0$ na rzecz $H_1$** na poziomie istotności $\alpha$” (i piszemy wniosek w języku zadania).
- $z\notin C$ → „**nie ma podstaw do odrzucenia $H_0$**” — a **nie** „przyjmujemy $H_0$” / „udowodniliśmy $H_0$”. Nie kontrolujemy błędu II rodzaju.
:::

::: steps | Schemat rozwiązania każdego testu (tak piszemy na kolokwium)
1. **Założenia i dane**: jaka cecha, jaki rozkład, co znane ($n$, $\bar x$, $s$, $\sigma$, $\alpha$).
2. **Hipotezy**: $H_0$ (z „=”) i $H_1$ (z $<$, $>$ lub $\ne$ — z treści pytania).
3. **Statystyka testowa** i jej rozkład przy prawdziwej $H_0$ (wybór modelu).
4. **Wartość statystyki** z danych.
5. **Zbiór krytyczny** (kierunek jak w $H_1$, kwantyl z tablic).
6. **Decyzja + wniosek słowami** na poziomie $\alpha$.
:::

::: tip own | Jak wybrać H₁ z treści?
„wzrosła / większa / przekracza / ponad” → $>$ (prawostronny) · „zmalała / mniejsza / zawyża / poniżej” → $<$ (lewostronny) · „różni się / zmieniła się / istotnie inna” → $\ne$ (dwustronny).
:::

# Model 1: test dla średniej, σ znane

::: formula W09 | Test Z dla średniej (rozkład normalny, σ znane)
$$Z = \frac{\bar X-\mu_0}{\sigma}\sqrt n\ \sim N(0,1)\ \text{przy } H_0:\ \mu=\mu_0$$
| $H_1$ | zbiór krytyczny |
|---|---|
| $\mu>\mu_0$ | $[z_{1-\alpha};\ \infty)$ |
| $\mu<\mu_0$ | $(-\infty;\ -z_{1-\alpha}]$ |
| $\mu\ne\mu_0$ | $(-\infty; -z_{1-\alpha/2}]\cup[z_{1-\alpha/2};\infty)$ |
:::

::: example W09 | Czy reklamy zwiększyły sprzedaż?
Dotychczas sprzedaż dzienna $\sim N(1000;\ 100)$ USD. Po reklamach w 9 dniach: 1280, 1250, 990, 1100, 880, 1300, 1100, 950, 1050, $\bar x = 1100$. $\alpha = 0{,}01$.
1. $H_0:\ \mu = 1000$, $H_1:\ \mu>1000$.
2. $Z = \frac{\bar X-1000}{100/\sqrt9}$.
3. $z = \frac{1100-1000}{100/3} = 3$.
4. $C = [z_{0{,}99};\infty) = [2{,}33;\infty)$.
5. $3\in C$ → **odrzucamy $H_0$**: na poziomie 0,01 średnia sprzedaż wzrosła.
:::

@chart rightTail

# Model 2: test dla średniej, σ nieznane

::: formula W09 | Test t dla średniej (rozkład normalny, σ nieznane)
$$T = \frac{\bar X-\mu_0}{S}\sqrt n\ \sim t_{n-1}\ \text{przy } H_0$$
Zbiory krytyczne jak w modelu 1, ale z kwantylami $t_{1-\alpha,\,n-1}$ lub $t_{1-\alpha/2,\,n-1}$.
:::

::: example W09 | Czy producent zawyża przebieg?
Producent: średni przebieg bez serwisu 120 000 km. Test 4 aut: 110 000, 120 000, 118 000, 112 000. $\alpha=0{,}05$.
1. $H_0:\ \mu = 120\,000$, $H_1:\ \mu<120\,000$.
2. $\bar x = 115\,000$, $s^2 = \frac{68\cdot10^6}{3}\approx 22{,}67\cdot10^6$, $s\approx4761$.
3. $t = \frac{115\,000-120\,000}{4761/2}\approx-2{,}10$.
4. $C = (-\infty; -t_{0{,}95;3}] = (-\infty; -2{,}353]$.
5. $-2{,}10\notin C$ → **nie ma podstaw do odrzucenia $H_0$**: na poziomie 0,05 nie można twierdzić, że producent zawyża przebieg.
:::

@chart twoTailT

::: note W09 | Model 3: duża próba, dowolny rozkład
Dla $n\ge100$ (arkusz wzorów) i dowolnego rozkładu: $Z = \frac{\bar X-\mu_0}{S}\sqrt n\approx N(0,1)$ — kwantyle normalne.
:::

# p-wartość

::: def W09 | p-wartość
**p-wartość** to najmniejszy poziom istotności, przy którym zaobserwowana wartość statystyki prowadzi do odrzucenia $H_0$. Reguła: **p-wartość ≤ α → odrzucamy $H_0$**.
:::

W przykładzie z przebiegiem: $t=-2{,}10$, $P_{H_0}(T\le-2{,}10)\approx0{,}063$. Ponieważ $0{,}063>0{,}05$ — nie odrzucamy (ale przy $\alpha = 0{,}1$ już byśmy odrzucili). Im mniejsza p-wartość, tym mocniejsze dowody przeciw $H_0$.

::: intuition
p-wartość odpowiada na pytanie: „**gdyby $H_0$ była prawdziwa**, jak często dostalibyśmy wynik co najmniej tak ekstremalny jak nasz?”. Mała p-wartość = „to byłby bardzo dziwny zbieg okoliczności” → wątpimy w $H_0$.
:::

# Model 4: test dla wariancji

::: formula W09 | Test χ² dla wariancji (rozkład normalny)
$$\chi^2 = \frac{(n-1)S^2}{\sigma_0^2}\ \sim\chi^2_{n-1}\ \text{przy } H_0:\ \sigma^2=\sigma_0^2$$
| $H_1$ | zbiór krytyczny |
|---|---|
| $\sigma^2>\sigma_0^2$ | $[\chi^2_{1-\alpha,\,n-1};\ \infty)$ |
| $\sigma^2<\sigma_0^2$ | $(0;\ \chi^2_{\alpha,\,n-1}]$ |
| $\sigma^2\ne\sigma_0^2$ | $(0;\chi^2_{\alpha/2,\,n-1}]\cup[\chi^2_{1-\alpha/2,\,n-1};\infty)$ |
:::

::: example W09 | Żarówki
15 żarówek, $s = 13$ h. Czy odchylenie różni się od 10 h? $\alpha = 0{,}05$.
$H_0:\ \sigma = 10$, $H_1:\ \sigma\ne10$; $\chi^2 = \frac{14\cdot169}{100} = 23{,}66$; $C = (0; 5{,}629]\cup[26{,}119;\infty)$. $23{,}66\notin C$ → brak podstaw do odrzucenia $H_0$.
:::

@chart chiTwo

::: tip own
Hipoteza o odchyleniu $\sigma$ to to samo co hipoteza o wariancji: $\sigma>2 \Leftrightarrow \sigma^2>4$. W statystyce wstawiasz $\sigma_0^2$ (kwadrat!).
:::

# Model 9: dane sparowane (przed i po)

Gdy mierzymy **te same obiekty dwa razy** (przed i po leku, przed i po szkoleniu), liczymy różnice $D_i = X_i - Y_i$ i robimy zwykły test t dla średniej różnic. {lecture:W09}

::: formula W09 | Test dla danych sparowanych
$$H_0:\ \mu_D = 0,\qquad T = \frac{\bar D}{S_D}\sqrt n\ \sim t_{n-1}$$
:::

::: example W09 | Czy lek obniża ciśnienie?
| pacjent | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---:|---:|---:|---:|---:|---:|---:|
| przed | 210 | 180 | 260 | 270 | 190 | 250 | 180 |
| po | 180 | 160 | 220 | 260 | 200 | 230 | 180 |
| $d_i$ | 30 | 20 | 40 | 10 | −10 | 20 | 0 |

$H_0:\ \mu_D = 0$, $H_1:\ \mu_D>0$. $\bar d\approx15{,}7$, $s_D\approx15{,}9$, $t = \frac{15{,}7}{15{,}9}\sqrt7\approx2{,}24$; $t_{0{,}95;6} = 1{,}943$. $2{,}24\ge1{,}943$ → odrzucamy $H_0$: lek obniża średnie ciśnienie ($\alpha = 0{,}05$).
:::

# Model 10: test dla proporcji

::: formula W09 | Test dla proporcji (duża próba: $n\hat p\ge5$, $n(1-\hat p)\ge5$)
$$Z = \frac{\hat p - p_0}{\sqrt{p_0(1-p_0)/n}}\ \approx N(0,1)\ \text{przy } H_0:\ p=p_0$$
Uwaga: w mianowniku jest $p_0$ z hipotezy, a **nie** $\hat p$ (inaczej niż w przedziale ufności).
:::

::: example W09 | Samochody na gaz
Przypuszczamy, że odsetek aut na gaz w Warszawie jest mniejszy niż 0,15. W próbie 200 aut 21 było na gaz. $\alpha = 0{,}05$.
$H_0:\ p=0{,}15$, $H_1:\ p<0{,}15$; $\hat p = 0{,}105$; $z = \frac{0{,}105-0{,}15}{\sqrt{0{,}15\cdot0{,}85/200}}\approx-1{,}79$; $C = (-\infty;-1{,}645]$ → $z\in C$ → odrzucamy $H_0$: odsetek jest mniejszy niż 15%.
:::

# Wybór testu — podsumowanie

| Hipoteza o… | Założenia | Statystyka | Rozkład przy $H_0$ |
|---|---|---|---|
| średniej | normalny, σ znane | $\frac{\bar X-\mu_0}{\sigma}\sqrt n$ | $N(0,1)$ |
| średniej | normalny, σ nieznane | $\frac{\bar X-\mu_0}{S}\sqrt n$ | $t_{n-1}$ |
| średniej | dowolny, $n\ge100$ | $\frac{\bar X-\mu_0}{S}\sqrt n$ | ≈ $N(0,1)$ |
| wariancji | normalny | $\frac{(n-1)S^2}{\sigma_0^2}$ | $\chi^2_{n-1}$ |
| średniej różnic (sparowane) | różnice normalne | $\frac{\bar D}{S_D}\sqrt n$ | $t_{n-1}$ |
| proporcji | duże $n$ | $\frac{\hat p-p_0}{\sqrt{p_0(1-p_0)/n}}$ | ≈ $N(0,1)$ |

# W Excelu

~~~excel Test t dla średniej (dane w A2:A9, μ₀ w D1)
D1: 250
D2: =AVERAGE(A2:A9)
D3: =STDEV.S(A2:A9)
D4: =COUNT(A2:A9)
D5: =(D2-D1)/D3*SQRT(D4)          // statystyka t
D6: =-T.INV(0.95,D4-1)            // granica C dla H1: μ < μ0 (α = 0,05)
D7: =T.DIST(D5,D4-1,TRUE)         // p-wartość (test lewostronny)
D8: =T.DIST.RT(D5,D4-1)           // p-wartość (test prawostronny)
D9: =T.DIST.2T(ABS(D5),D4-1)      // p-wartość (test dwustronny)
~~~

~~~excel Wariancja i proporcja
E1: =(10-1)*0.052/0.04            // χ² dla wariancji
E2: =CHISQ.INV(0.025,9)           // lewa granica (dwustronny, α = 0,05)
E3: =CHISQ.INV.RT(0.025,9)        // prawa granica
E4: =(68/400-0.2)/SQRT(0.2*0.8/400)   // z dla proporcji
E5: =NORM.S.DIST(E4,TRUE)         // p-wartość (lewostronny)
~~~

~~~python Testy w scipy
import numpy as np
from scipy import stats

x = np.array([247, 251, 245, 249, 248, 246, 252, 244])
t, p = stats.ttest_1samp(x, popmean=250, alternative='less')
print(t, p)                                   # t ≈ -2.26, p ≈ 0.029 → odrzucamy przy α = 0.05

chi2 = (10 - 1) * 0.052 / 0.04
print(chi2, stats.chi2.ppf([0.025, 0.975], 9))
~~~

::: summary
- $H_0$ zawiera „=”; $H_1$ to teza do wykazania; kierunek $H_1$ ↔ kształt zbioru krytycznego.
- $\alpha$ = P(błąd I rodzaju); decyzja: statystyka ∈ C → odrzucamy $H_0$; inaczej „brak podstaw do odrzucenia”.
- p-wartość ≤ α ⇔ odrzucamy $H_0$.
- Średnia: $z$ (σ znane) lub $t_{n-1}$; wariancja: $\chi^2_{n-1}$; sparowane: $t$ dla różnic; proporcja: $z$ z $p_0$.
:::
`,

    cheatsheet: md`
## Schemat (6 kroków)
1) założenia i dane → 2) $H_0$ (=), $H_1$ ($<$, $>$, $\ne$) → 3) statystyka i jej rozkład → 4) wartość → 5) zbiór krytyczny → 6) decyzja + wniosek słowami

## Statystyki testowe
| test | statystyka | rozkład |
|---|---|---|
| μ, σ znane | $\frac{\bar x-\mu_0}{\sigma}\sqrt n$ | $N(0,1)$ |
| μ, σ nieznane | $\frac{\bar x-\mu_0}{s}\sqrt n$ | $t_{n-1}$ |
| μ, $n\ge100$ | $\frac{\bar x-\mu_0}{s}\sqrt n$ | ≈ $N(0,1)$ |
| σ² | $\frac{(n-1)s^2}{\sigma_0^2}$ | $\chi^2_{n-1}$ |
| sparowane | $\frac{\bar d}{s_d}\sqrt n$ | $t_{n-1}$ |
| p | $\frac{\hat p-p_0}{\sqrt{p_0(1-p_0)/n}}$ | ≈ $N(0,1)$ |

## Zbiory krytyczne (z, t)
- $H_1: >$ → $[q_{1-\alpha};\infty)$
- $H_1: <$ → $(-\infty;-q_{1-\alpha}]$
- $H_1: \ne$ → $|stat|\ge q_{1-\alpha/2}$
- χ²: $>$ → $[\chi^2_{1-\alpha};\infty)$; $<$ → $(0;\chi^2_\alpha]$; $\ne$ → $(0;\chi^2_{\alpha/2}]\cup[\chi^2_{1-\alpha/2};\infty)$

## Kwantyle N(0,1)
$z_{0{,}9}=1{,}282$ · $z_{0{,}95}=1{,}645$ · $z_{0{,}96}=1{,}751$ · $z_{0{,}975}=1{,}96$ · $z_{0{,}99}=2{,}326$ · $z_{0{,}995}=2{,}576$

## Wniosek
∈ C: „odrzucamy $H_0$ na rzecz $H_1$ na poziomie α” · ∉ C: „brak podstaw do odrzucenia $H_0$” · p-wartość ≤ α → odrzucamy

## Excel
‹NORM.S.INV› ‹T.INV(1-α,df)› ‹T.INV.2T(α,df)› ‹CHISQ.INV› ‹CHISQ.INV.RT› · p-wartości: ‹T.DIST› ‹T.DIST.RT› ‹T.DIST.2T› ‹NORM.S.DIST›
`,

    exercises: [
      {
        id: 'e1', tag: 'C12', title: 'Ile trwa tutorial? (σ znane)',
        text: md`
Czas przejścia tutorialu gry ma rozkład normalny z odchyleniem 4 min. Twórcy twierdzą, że tutorial trwa 20 minut, gracze — że dłużej. Zmierzono czasy 8 losowych graczy (min): 24, 19, 27, 22, 25, 21, 26, 23. Czy gracze mają rację? $\alpha = 0{,}05$.
`,
        hint: md`$\sigma$ znane → model 1, test prawostronny.`,
        solution: md`
1. $X\sim N(\mu, 4)$, $n = 8$, $\bar x = 23{,}375$, $\alpha = 0{,}05$.
2. $H_0:\ \mu = 20$, $H_1:\ \mu>20$.
3. $Z = \frac{\bar X-20}{4}\sqrt8\sim N(0,1)$ przy $H_0$.
4. $z = \frac{3{,}375}{4}\cdot2{,}828\approx2{,}39$.
5. $C = [z_{0{,}95};\infty) = [1{,}645;\infty)$.
6. $2{,}39\in C$ → **odrzucamy $H_0$**: na poziomie 0,05 średni czas tutorialu jest dłuższy niż 20 min — gracze mają rację (p-wartość ≈ 0,0085).
`,
        answer: md`$z\approx2{,}39\ge1{,}645$ → odrzucamy $H_0$; tutorial trwa dłużej niż 20 min.`
      },
      {
        id: 'e2', tag: 'C12', title: 'Paczki kawy 250 g (σ nieznane)',
        text: md`
Kontrola jakości zważyła 8 paczek kawy o nominalnej masie 250 g: 247, 251, 245, 249, 248, 246, 252, 244 g. Masa ma rozkład normalny. Na poziomie istotności 0,05 zweryfikuj przypuszczenie, że średnia masa paczki jest **mniejsza** niż 250 g.
`,
        hint: md`$\sigma$ nieznane → test t, 7 stopni swobody, $t_{0{,}95;7} = 1{,}895$.`,
        solution: md`
1. $n = 8$, $\bar x = 247{,}75$ g, $s^2\approx7{,}93$, $s\approx2{,}816$ g.
2. $H_0:\ \mu = 250$, $H_1:\ \mu<250$.
3. $T = \frac{\bar X-250}{S}\sqrt8\sim t_7$.
4. $t = \frac{-2{,}25}{2{,}816}\cdot2{,}828\approx-2{,}26$.
5. $C = (-\infty; -1{,}895]$.
6. $-2{,}26\in C$ → **odrzucamy $H_0$**: średnia masa paczki jest mniejsza niż 250 g (p-wartość ≈ 0,029).
`,
        answer: md`$t\approx-2{,}26\le-1{,}895$ → odrzucamy $H_0$: paczki są za lekkie.`
      },
      {
        id: 'e3', tag: 'C12', title: 'Dokładność przyrządu (test dla wariancji)',
        text: md`
Wykonano 10 pomiarów tego samego elementu nowym przyrządem i otrzymano wariancję z próby $s^2 = 0{,}052$. Na poziomie istotności 0,05 sprawdź, czy wariancja wskazań przyrządu **istotnie różni się** od 0,04. Rozkład pomiarów jest normalny.
`,
        hint: md`Test dwustronny: $\chi^2_{0{,}025;9} = 2{,}700$, $\chi^2_{0{,}975;9} = 19{,}023$.`,
        solution: md`
$H_0:\ \sigma^2 = 0{,}04$, $H_1:\ \sigma^2\ne0{,}04$.
$\chi^2 = \frac{9\cdot0{,}052}{0{,}04} = 11{,}7$; $C = (0; 2{,}700]\cup[19{,}023;\infty)$.
$11{,}7\notin C$ → **brak podstaw do odrzucenia $H_0$**: dane nie wskazują, że wariancja różni się od 0,04.
`,
        answer: md`$\chi^2 = 11{,}7\notin C$ → brak podstaw do odrzucenia $H_0$.`
      },
      {
        id: 'e4', tag: 'C12', title: 'Zawartość cukru w jabłkach (dane pogrupowane)',
        text: md`
Zbadano zawartość cukru (%) w 50 losowych jabłkach:

| cukier [%] | 8–10 | 10–12 | 12–14 | 14–16 | 16–18 |
|---|---:|---:|---:|---:|---:|
| liczba jabłek | 4 | 12 | 20 | 10 | 4 |

Zakładając rozkład normalny, na poziomie 0,1 zweryfikuj hipotezę, że wariancja zawartości cukru jest **większa** niż 3.
`,
        hint: md`Środki klas 9, 11, …, 17; $s^2$ z danych pogrupowanych. $\chi^2_{0{,}9;49}\approx62{,}04$.`,
        solution: md`
$\bar x = \frac{4\cdot9+12\cdot11+20\cdot13+10\cdot15+4\cdot17}{50} = 12{,}92$; $\sum n_i(\tilde x_i-\bar x)^2\approx215{,}68$, $s^2\approx4{,}40$.
$H_0:\ \sigma^2 = 3$, $H_1:\ \sigma^2>3$.
$\chi^2 = \frac{215{,}68}{3}\approx71{,}89$; $C = [62{,}04;\infty)$.
$71{,}89\in C$ → **odrzucamy $H_0$**: wariancja zawartości cukru jest większa niż 3 ($\alpha = 0{,}1$).
`,
        answer: md`$\chi^2\approx71{,}9\ge62{,}0$ → odrzucamy $H_0$; wariancja > 3.`
      },
      {
        id: 'e5', tag: 'C12', title: 'Czas przed ekranem (duża próba)',
        text: md`
150 studentów podało dzienny czas przed ekranem telefonu (h):

| czas | 0–2 | 2–4 | 4–6 | 6–8 | 8–10 |
|---|---:|---:|---:|---:|---:|
| studenci | 12 | 35 | 48 | 38 | 17 |

Czy można twierdzić, że studenci spędzają przed ekranem średnio **więcej niż 5 godzin** dziennie? Przyjmij $\alpha = 0{,}04$.
`,
        hint: md`Duża próba, rozkład nieznany → model 3 ($z$). $z_{0{,}96}\approx1{,}751$.`,
        solution: md`
$\bar x = \frac{12\cdot1+35\cdot3+48\cdot5+38\cdot7+17\cdot9}{150}\approx5{,}173$ h; $s^2\approx5{,}044$, $s\approx2{,}246$.
$H_0:\ \mu = 5$, $H_1:\ \mu>5$; $z = \frac{0{,}173}{2{,}246}\sqrt{150}\approx0{,}945$; $C = [1{,}751;\infty)$.
$0{,}945\notin C$ → **brak podstaw do odrzucenia $H_0$**: dane nie pozwalają twierdzić, że średni czas przekracza 5 h (p-wartość ≈ 0,17).
`,
        answer: md`$z\approx0{,}95<1{,}75$ → brak podstaw do odrzucenia $H_0$.`
      },
      {
        id: 'e6', tag: 'C12', title: 'Odpływ użytkowników (proporcja)',
        text: md`
Spośród 400 losowych użytkowników aplikacji 68 zrezygnowało z subskrypcji w ciągu miesiąca. Czy na poziomie istotności 0,05 można stwierdzić, że miesięczny odsetek rezygnacji jest **mniejszy niż 20%**?
`,
        hint: md`$\hat p = 0{,}17$; w mianowniku $p_0 = 0{,}2$.`,
        solution: md`
$H_0:\ p = 0{,}2$, $H_1:\ p<0{,}2$. $z = \frac{0{,}17-0{,}2}{\sqrt{0{,}2\cdot0{,}8/400}} = \frac{-0{,}03}{0{,}02} = -1{,}5$; $C = (-\infty;-1{,}645]$.
$-1{,}5\notin C$ → **brak podstaw do odrzucenia $H_0$**: nie można twierdzić, że odsetek rezygnacji jest mniejszy niż 20%.
`,
        answer: md`$z = -1{,}5 > -1{,}645$ → brak podstaw do odrzucenia $H_0$.`
      },
      {
        id: 'e7', tag: 'C12', title: 'Staż pracy w firmie IT (proporcja, test dwustronny)',
        text: md`
W ankiecie 180 pracowników firmy IT: 72 osoby pracują krócej niż rok, 54 — od roku do 3 lat, 54 — ponad 3 lata. Zweryfikuj hipotezę, że **75%** pracowników ma staż **nie dłuższy niż 3 lata**. $\alpha = 0{,}05$.
`,
        hint: md`„Nie dłuższy niż 3 lata” = pierwsze dwie grupy. Brak kierunku w treści → test dwustronny.`,
        solution: md`
$\hat p = \frac{72+54}{180} = 0{,}7$. $H_0:\ p = 0{,}75$, $H_1:\ p\ne0{,}75$.
$z = \frac{0{,}7-0{,}75}{\sqrt{0{,}75\cdot0{,}25/180}}\approx-1{,}55$; $C: |z|\ge1{,}96$.
$|{-1{,}55}|<1{,}96$ → **brak podstaw do odrzucenia $H_0$**: dane nie przeczą hipotezie, że 75% pracowników ma staż do 3 lat.
`,
        answer: md`$z\approx-1{,}55$, $|z|<1{,}96$ → brak podstaw do odrzucenia $H_0$.`
      },
      {
        id: 'e8', own: true, title: 'p-wartość zamiast zbioru krytycznego',
        text: md`
Dla zadania 2 (paczki kawy) wyznacz p-wartość testu. Przy jakich poziomach istotności odrzucilibyśmy $H_0$: 0,1? 0,05? 0,01?
`,
        hint: md`Test lewostronny: p-wartość $= P(T_7\le t)$ dla $t\approx-2{,}26$. Excel: ‹T.DIST(t; 7; TRUE)›.`,
        solution: md`
p-wartość $= P(T_7\le-2{,}26)\approx0{,}029$.
- $\alpha = 0{,}1$: $0{,}029\le0{,}1$ → odrzucamy;
- $\alpha = 0{,}05$: $0{,}029\le0{,}05$ → odrzucamy;
- $\alpha = 0{,}01$: $0{,}029>0{,}01$ → **nie** odrzucamy.

p-wartość pozwala od razu odpowiedzieć dla każdego $\alpha$ — dlatego programy statystyczne ją podają.
`,
        answer: md`p ≈ 0,029: odrzucamy przy 0,1 i 0,05, nie przy 0,01.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'A statistical test answers the question “do the data speak against a certain claim?”. We learn to state hypotheses, choose a test statistic, find the critical region and phrase the conclusion correctly.',
    lecture: md`
# Statistical hypothesis

A **statistical hypothesis** is a conjecture about an unknown property of the distribution of a feature. {lecture:W09}

::: example W09 | Examples of hypotheses
- A tyre maker: lifetime over 60,000 km → $H:\ \mu > 60{,}000$.
- A printer maker: on average over 200 h without failure → $H:\ \mu>200$.
- A sociologist: city children have better results → $H:\ p_1>p_2$.
- Physicists: the particle count is Poisson → $H:\ X\sim P(\lambda)$.
:::

The first three are **parametric** hypotheses (about a parameter), the fourth is **non-parametric** (about the form of the distribution, topic 11).

::: def W09 | Null and alternative hypotheses
- $H_0$ — the **null hypothesis**: we test it with a view to **rejecting** it; it always contains “=” (e.g. $\mu = \mu_0$).
- $H_1$ — the **alternative hypothesis**: we accept it if we reject $H_0$; usually what we **want to show**.
$H_0$ and $H_1$ must be **mutually exclusive** (e.g. not $H_0: p=\frac12$, $H_1: p\ge\frac13$ — $\frac12$ would belong to both).
:::

::: example W09 | A new therapy
The old therapy works in 80% of cases. The new one will be adopted only if we are “sure” it is better: $H_0:\ p = 0.8$, $H_1:\ p>0.8$.
:::

::: intuition
A test is a **trial in court**. $H_0$ = “the defendant is innocent” (presumption of innocence). The prosecutor (the data) must bring strong evidence to reject it. If there isn’t enough evidence, we do **not** say “innocent”, only “**no grounds** to convict”.
:::

# How a test works — step by step

Lecture example: a new technology should reduce emissions. $H_0:\ \mu = \mu_0$, $H_1:\ \mu<\mu_0$; measurements $X_1,\dots,X_n\sim N(\mu,\sigma)$, $\sigma$ known. If $H_0$ is true,
$$Z = \frac{\bar X-\mu_0}{\sigma/\sqrt n}\sim N(0,1).$$
When $H_1$ is true, the values of $Z$ are shifted **to the left**. So **very small** $z$ speak against $H_0$: we reject it when $z\le -z_{1-\alpha}$. {lecture:W09}

::: def W09 | Significance level, critical region
- **Significance level $\alpha$** — the probability of rejecting $H_0$ when it is true (type I error); usually 0.01; 0.05; 0.1.
- **Critical region $C$** — the values of the test statistic for which we reject $H_0$. It is chosen so that $P_{H_0}(Z\in C) = \alpha$.
:::

| | do not reject $H_0$ | reject $H_0$ (accept $H_1$) |
|---|---|---|
| **$H_0$ true** | correct decision | **type I error** (prob. $\alpha$) |
| **$H_1$ true** | **type II error** | correct decision |

::: warn W09 | Phrasing the conclusion correctly
- $z\in C$ → “**we reject $H_0$ in favour of $H_1$** at significance level $\alpha$” (and state the conclusion in the words of the problem).
- $z\notin C$ → “**there are no grounds to reject $H_0$**” — **not** “we accept $H_0$” / “we proved $H_0$”. We don’t control the type II error.
:::

::: steps | Template for every test (write it like this in a test)
1. **Assumptions and data**: which feature, which distribution, what is known ($n$, $\bar x$, $s$, $\sigma$, $\alpha$).
2. **Hypotheses**: $H_0$ (with “=”) and $H_1$ (with $<$, $>$ or $\ne$ — from the question).
3. **Test statistic** and its distribution under $H_0$ (choice of model).
4. **Value of the statistic** from the data.
5. **Critical region** (direction as in $H_1$, quantile from tables).
6. **Decision + conclusion in words** at level $\alpha$.
:::

::: tip own | Choosing H₁ from the text
“increased / larger / exceeds / over” → $>$ (right-tailed) · “decreased / smaller / overstates / below” → $<$ (left-tailed) · “differs / changed / significantly different” → $\ne$ (two-tailed).
:::

# Model 1: test for the mean, σ known

::: formula W09 | Z test for the mean (normal, σ known)
$$Z = \frac{\bar X-\mu_0}{\sigma}\sqrt n\ \sim N(0,1)\ \text{under } H_0:\ \mu=\mu_0$$
| $H_1$ | critical region |
|---|---|
| $\mu>\mu_0$ | $[z_{1-\alpha};\ \infty)$ |
| $\mu<\mu_0$ | $(-\infty;\ -z_{1-\alpha}]$ |
| $\mu\ne\mu_0$ | $(-\infty; -z_{1-\alpha/2}]\cup[z_{1-\alpha/2};\infty)$ |
:::

::: example W09 | Did the ads increase sales?
So far daily sales $\sim N(1000;\ 100)$ USD. After the ads, over 9 days: 1280, 1250, 990, 1100, 880, 1300, 1100, 950, 1050, $\bar x = 1100$. $\alpha = 0.01$.
1. $H_0:\ \mu = 1000$, $H_1:\ \mu>1000$.
2. $Z = \frac{\bar X-1000}{100/\sqrt9}$.
3. $z = \frac{1100-1000}{100/3} = 3$.
4. $C = [z_{0.99};\infty) = [2.33;\infty)$.
5. $3\in C$ → **reject $H_0$**: at level 0.01 mean sales increased.
:::

@chart rightTail

# Model 2: test for the mean, σ unknown

::: formula W09 | t test for the mean (normal, σ unknown)
$$T = \frac{\bar X-\mu_0}{S}\sqrt n\ \sim t_{n-1}\ \text{under } H_0$$
Critical regions as in model 1, but with the quantiles $t_{1-\alpha,\,n-1}$ or $t_{1-\alpha/2,\,n-1}$.
:::

::: example W09 | Does the producer overstate the mileage?
Producer: mean mileage without service is 120,000 km. A test of 4 cars: 110,000, 120,000, 118,000, 112,000. $\alpha=0.05$.
1. $H_0:\ \mu = 120{,}000$, $H_1:\ \mu<120{,}000$.
2. $\bar x = 115{,}000$, $s^2\approx 22.67\cdot10^6$, $s\approx4761$.
3. $t = \frac{115{,}000-120{,}000}{4761/2}\approx-2.10$.
4. $C = (-\infty; -t_{0.95;3}] = (-\infty; -2.353]$.
5. $-2.10\notin C$ → **no grounds to reject $H_0$**: at level 0.05 we cannot claim that the producer overstates the mileage.
:::

@chart twoTailT

::: note W09 | Model 3: large sample, any distribution
For $n\ge100$ (formula sheet) and any distribution: $Z = \frac{\bar X-\mu_0}{S}\sqrt n\approx N(0,1)$ — normal quantiles.
:::

# The p-value

::: def W09 | p-value
The **p-value** is the smallest significance level at which the observed value of the statistic leads to rejecting $H_0$. Rule: **p-value ≤ α → reject $H_0$**.
:::

In the mileage example: $t=-2.10$, $P_{H_0}(T\le-2.10)\approx0.063$. Since $0.063>0.05$ — we don’t reject (at $\alpha = 0.1$ we would). The smaller the p-value, the stronger the evidence against $H_0$.

::: intuition
The p-value answers: “**if $H_0$ were true**, how often would we get a result at least as extreme as ours?”. A small p-value = “that would be a very strange coincidence” → we doubt $H_0$.
:::

# Model 4: test for the variance

::: formula W09 | χ² test for the variance (normal)
$$\chi^2 = \frac{(n-1)S^2}{\sigma_0^2}\ \sim\chi^2_{n-1}\ \text{under } H_0:\ \sigma^2=\sigma_0^2$$
| $H_1$ | critical region |
|---|---|
| $\sigma^2>\sigma_0^2$ | $[\chi^2_{1-\alpha,\,n-1};\ \infty)$ |
| $\sigma^2<\sigma_0^2$ | $(0;\ \chi^2_{\alpha,\,n-1}]$ |
| $\sigma^2\ne\sigma_0^2$ | $(0;\chi^2_{\alpha/2,\,n-1}]\cup[\chi^2_{1-\alpha/2,\,n-1};\infty)$ |
:::

::: example W09 | Light bulbs
15 bulbs, $s = 13$ h. Does the standard deviation differ from 10 h? $\alpha = 0.05$.
$H_0:\ \sigma = 10$, $H_1:\ \sigma\ne10$; $\chi^2 = \frac{14\cdot169}{100} = 23.66$; $C = (0; 5.629]\cup[26.119;\infty)$. $23.66\notin C$ → no grounds to reject $H_0$.
:::

@chart chiTwo

::: tip own
A hypothesis about $\sigma$ is the same as one about the variance: $\sigma>2 \Leftrightarrow \sigma^2>4$. In the statistic you put $\sigma_0^2$ (squared!).
:::

# Model 9: paired data (before and after)

When we measure **the same objects twice** (before and after a drug, before and after training), we compute the differences $D_i = X_i - Y_i$ and do an ordinary t test for their mean. {lecture:W09}

::: formula W09 | Test for paired data
$$H_0:\ \mu_D = 0,\qquad T = \frac{\bar D}{S_D}\sqrt n\ \sim t_{n-1}$$
:::

::: example W09 | Does the drug lower blood pressure?
| patient | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---:|---:|---:|---:|---:|---:|---:|
| before | 210 | 180 | 260 | 270 | 190 | 250 | 180 |
| after | 180 | 160 | 220 | 260 | 200 | 230 | 180 |
| $d_i$ | 30 | 20 | 40 | 10 | −10 | 20 | 0 |

$H_0:\ \mu_D = 0$, $H_1:\ \mu_D>0$. $\bar d\approx15.7$, $s_D\approx15.9$, $t = \frac{15.7}{15.9}\sqrt7\approx2.24$; $t_{0.95;6} = 1.943$. $2.24\ge1.943$ → reject $H_0$: the drug lowers mean pressure ($\alpha = 0.05$).
:::

# Model 10: test for a proportion

::: formula W09 | Test for a proportion (large sample: $n\hat p\ge5$, $n(1-\hat p)\ge5$)
$$Z = \frac{\hat p - p_0}{\sqrt{p_0(1-p_0)/n}}\ \approx N(0,1)\ \text{under } H_0:\ p=p_0$$
Note: the denominator uses $p_0$ from the hypothesis, **not** $\hat p$ (unlike the confidence interval).
:::

::: example W09 | Cars on gas
We suspect that the share of cars running on gas in Warsaw is below 0.15. In a sample of 200 cars 21 ran on gas. $\alpha = 0.05$.
$H_0:\ p=0.15$, $H_1:\ p<0.15$; $\hat p = 0.105$; $z = \frac{0.105-0.15}{\sqrt{0.15\cdot0.85/200}}\approx-1.79$; $C = (-\infty;-1.645]$ → $z\in C$ → reject $H_0$: the share is below 15%.
:::

# Choosing the test — summary

| Hypothesis about… | Assumptions | Statistic | Distribution under $H_0$ |
|---|---|---|---|
| mean | normal, σ known | $\frac{\bar X-\mu_0}{\sigma}\sqrt n$ | $N(0,1)$ |
| mean | normal, σ unknown | $\frac{\bar X-\mu_0}{S}\sqrt n$ | $t_{n-1}$ |
| mean | any, $n\ge100$ | $\frac{\bar X-\mu_0}{S}\sqrt n$ | ≈ $N(0,1)$ |
| variance | normal | $\frac{(n-1)S^2}{\sigma_0^2}$ | $\chi^2_{n-1}$ |
| mean difference (paired) | normal differences | $\frac{\bar D}{S_D}\sqrt n$ | $t_{n-1}$ |
| proportion | large $n$ | $\frac{\hat p-p_0}{\sqrt{p_0(1-p_0)/n}}$ | ≈ $N(0,1)$ |

# In Excel

~~~excel t test for the mean (data in A2:A9, μ₀ in D1)
D1: 250
D2: =AVERAGE(A2:A9)
D3: =STDEV.S(A2:A9)
D4: =COUNT(A2:A9)
D5: =(D2-D1)/D3*SQRT(D4)          // t statistic
D6: =-T.INV(0.95,D4-1)            // bound of C for H1: μ < μ0 (α = 0.05)
D7: =T.DIST(D5,D4-1,TRUE)         // p-value (left-tailed)
D8: =T.DIST.RT(D5,D4-1)           // p-value (right-tailed)
D9: =T.DIST.2T(ABS(D5),D4-1)      // p-value (two-tailed)
~~~

~~~excel Variance and proportion
E1: =(10-1)*0.052/0.04            // χ² for the variance
E2: =CHISQ.INV(0.025,9)           // left bound (two-sided, α = 0.05)
E3: =CHISQ.INV.RT(0.025,9)        // right bound
E4: =(68/400-0.2)/SQRT(0.2*0.8/400)   // z for a proportion
E5: =NORM.S.DIST(E4,TRUE)         // p-value (left-tailed)
~~~

~~~python Tests in scipy
import numpy as np
from scipy import stats

x = np.array([247, 251, 245, 249, 248, 246, 252, 244])
t, p = stats.ttest_1samp(x, popmean=250, alternative='less')
print(t, p)                                   # t ≈ -2.26, p ≈ 0.029 → reject at α = 0.05

chi2 = (10 - 1) * 0.052 / 0.04
print(chi2, stats.chi2.ppf([0.025, 0.975], 9))
~~~

::: summary
- $H_0$ contains “=”; $H_1$ is the claim to show; the direction of $H_1$ ↔ the shape of the critical region.
- $\alpha$ = P(type I error); decision: statistic ∈ C → reject $H_0$; otherwise “no grounds to reject”.
- p-value ≤ α ⇔ reject $H_0$.
- Mean: $z$ (σ known) or $t_{n-1}$; variance: $\chi^2_{n-1}$; paired: $t$ on differences; proportion: $z$ with $p_0$.
:::
`,

    cheatsheet: md`
## Template (6 steps)
1) assumptions and data → 2) $H_0$ (=), $H_1$ ($<$, $>$, $\ne$) → 3) statistic and its distribution → 4) value → 5) critical region → 6) decision + conclusion in words

## Test statistics
| test | statistic | distribution |
|---|---|---|
| μ, σ known | $\frac{\bar x-\mu_0}{\sigma}\sqrt n$ | $N(0,1)$ |
| μ, σ unknown | $\frac{\bar x-\mu_0}{s}\sqrt n$ | $t_{n-1}$ |
| μ, $n\ge100$ | $\frac{\bar x-\mu_0}{s}\sqrt n$ | ≈ $N(0,1)$ |
| σ² | $\frac{(n-1)s^2}{\sigma_0^2}$ | $\chi^2_{n-1}$ |
| paired | $\frac{\bar d}{s_d}\sqrt n$ | $t_{n-1}$ |
| p | $\frac{\hat p-p_0}{\sqrt{p_0(1-p_0)/n}}$ | ≈ $N(0,1)$ |

## Critical regions (z, t)
- $H_1: >$ → $[q_{1-\alpha};\infty)$
- $H_1: <$ → $(-\infty;-q_{1-\alpha}]$
- $H_1: \ne$ → $|stat|\ge q_{1-\alpha/2}$
- χ²: $>$ → $[\chi^2_{1-\alpha};\infty)$; $<$ → $(0;\chi^2_\alpha]$; $\ne$ → $(0;\chi^2_{\alpha/2}]\cup[\chi^2_{1-\alpha/2};\infty)$

## N(0,1) quantiles
$z_{0.9}=1.282$ · $z_{0.95}=1.645$ · $z_{0.96}=1.751$ · $z_{0.975}=1.96$ · $z_{0.99}=2.326$ · $z_{0.995}=2.576$

## Conclusion
∈ C: “reject $H_0$ in favour of $H_1$ at level α” · ∉ C: “no grounds to reject $H_0$” · p-value ≤ α → reject

## Excel
‹NORM.S.INV› ‹T.INV(1-α,df)› ‹T.INV.2T(α,df)› ‹CHISQ.INV› ‹CHISQ.INV.RT› · p-values: ‹T.DIST› ‹T.DIST.RT› ‹T.DIST.2T› ‹NORM.S.DIST›
`,

    exercises: [
      {
        id: 'e1', tag: 'C12', title: 'How long is the tutorial? (σ known)',
        text: md`
The time to complete a game tutorial is normal with standard deviation 4 min. The developers claim it takes 20 minutes, the players — that it takes longer. The times of 8 random players (min): 24, 19, 27, 22, 25, 21, 26, 23. Are the players right? $\alpha = 0.05$.
`,
        hint: md`$\sigma$ known → model 1, right-tailed test.`,
        solution: md`
1. $X\sim N(\mu, 4)$, $n = 8$, $\bar x = 23.375$, $\alpha = 0.05$.
2. $H_0:\ \mu = 20$, $H_1:\ \mu>20$.
3. $Z = \frac{\bar X-20}{4}\sqrt8\sim N(0,1)$ under $H_0$.
4. $z = \frac{3.375}{4}\cdot2.828\approx2.39$.
5. $C = [1.645;\infty)$.
6. $2.39\in C$ → **reject $H_0$**: at level 0.05 the mean tutorial time exceeds 20 min — the players are right (p-value ≈ 0.0085).
`,
        answer: md`$z\approx2.39\ge1.645$ → reject $H_0$; the tutorial takes longer than 20 min.`
      },
      {
        id: 'e2', tag: 'C12', title: '250 g coffee packs (σ unknown)',
        text: md`
Quality control weighed 8 coffee packs with nominal mass 250 g: 247, 251, 245, 249, 248, 246, 252, 244 g. The mass is normal. At significance level 0.05 test the conjecture that the mean pack mass is **less** than 250 g.
`,
        hint: md`$\sigma$ unknown → t test, 7 degrees of freedom, $t_{0.95;7} = 1.895$.`,
        solution: md`
1. $n = 8$, $\bar x = 247.75$ g, $s^2\approx7.93$, $s\approx2.816$ g.
2. $H_0:\ \mu = 250$, $H_1:\ \mu<250$.
3. $T = \frac{\bar X-250}{S}\sqrt8\sim t_7$.
4. $t = \frac{-2.25}{2.816}\cdot2.828\approx-2.26$.
5. $C = (-\infty; -1.895]$.
6. $-2.26\in C$ → **reject $H_0$**: the mean pack mass is below 250 g (p-value ≈ 0.029).
`,
        answer: md`$t\approx-2.26\le-1.895$ → reject $H_0$: the packs are too light.`
      },
      {
        id: 'e3', tag: 'C12', title: 'Instrument precision (variance test)',
        text: md`
10 measurements of the same part with a new instrument gave a sample variance $s^2 = 0.052$. At significance level 0.05 check whether the variance of the readings **differs significantly** from 0.04. The measurements are normal.
`,
        hint: md`Two-sided test: $\chi^2_{0.025;9} = 2.700$, $\chi^2_{0.975;9} = 19.023$.`,
        solution: md`
$H_0:\ \sigma^2 = 0.04$, $H_1:\ \sigma^2\ne0.04$.
$\chi^2 = \frac{9\cdot0.052}{0.04} = 11.7$; $C = (0; 2.700]\cup[19.023;\infty)$.
$11.7\notin C$ → **no grounds to reject $H_0$**: the data do not indicate that the variance differs from 0.04.
`,
        answer: md`$\chi^2 = 11.7\notin C$ → no grounds to reject $H_0$.`
      },
      {
        id: 'e4', tag: 'C12', title: 'Sugar content of apples (grouped data)',
        text: md`
The sugar content (%) of 50 random apples:

| sugar [%] | 8–10 | 10–12 | 12–14 | 14–16 | 16–18 |
|---|---:|---:|---:|---:|---:|
| apples | 4 | 12 | 20 | 10 | 4 |

Assuming normality, at level 0.1 test the hypothesis that the variance of the sugar content is **greater** than 3.
`,
        hint: md`Midpoints 9, 11, …, 17; $s^2$ from grouped data. $\chi^2_{0.9;49}\approx62.04$.`,
        solution: md`
$\bar x = 12.92$; $\sum n_i(\tilde x_i-\bar x)^2\approx215.68$, $s^2\approx4.40$.
$H_0:\ \sigma^2 = 3$, $H_1:\ \sigma^2>3$; $\chi^2 = \frac{215.68}{3}\approx71.89$; $C = [62.04;\infty)$.
$71.89\in C$ → **reject $H_0$**: the variance of the sugar content exceeds 3 ($\alpha = 0.1$).
`,
        answer: md`$\chi^2\approx71.9\ge62.0$ → reject $H_0$; variance > 3.`
      },
      {
        id: 'e5', tag: 'C12', title: 'Screen time (large sample)',
        text: md`
150 students reported their daily phone screen time (h):

| time | 0–2 | 2–4 | 4–6 | 6–8 | 8–10 |
|---|---:|---:|---:|---:|---:|
| students | 12 | 35 | 48 | 38 | 17 |

Can we claim that students spend on average **more than 5 hours** a day in front of the screen? Use $\alpha = 0.04$.
`,
        hint: md`Large sample, unknown distribution → model 3 ($z$). $z_{0.96}\approx1.751$.`,
        solution: md`
$\bar x\approx5.173$ h; $s^2\approx5.044$, $s\approx2.246$.
$H_0:\ \mu = 5$, $H_1:\ \mu>5$; $z = \frac{0.173}{2.246}\sqrt{150}\approx0.945$; $C = [1.751;\infty)$.
$0.945\notin C$ → **no grounds to reject $H_0$**: the data don’t allow us to claim the mean exceeds 5 h (p-value ≈ 0.17).
`,
        answer: md`$z\approx0.95<1.75$ → no grounds to reject $H_0$.`
      },
      {
        id: 'e6', tag: 'C12', title: 'User churn (proportion)',
        text: md`
Of 400 random app users, 68 cancelled their subscription within a month. At significance level 0.05, can we claim that the monthly churn rate is **below 20%**?
`,
        hint: md`$\hat p = 0.17$; the denominator uses $p_0 = 0.2$.`,
        solution: md`
$H_0:\ p = 0.2$, $H_1:\ p<0.2$. $z = \frac{-0.03}{0.02} = -1.5$; $C = (-\infty;-1.645]$.
$-1.5\notin C$ → **no grounds to reject $H_0$**: we cannot claim the churn rate is below 20%.
`,
        answer: md`$z = -1.5 > -1.645$ → no grounds to reject $H_0$.`
      },
      {
        id: 'e7', tag: 'C12', title: 'Tenure in an IT company (proportion, two-sided)',
        text: md`
In a survey of 180 employees of an IT company: 72 have worked less than a year, 54 — one to 3 years, 54 — over 3 years. Test the hypothesis that **75%** of employees have a tenure of **at most 3 years**. $\alpha = 0.05$.
`,
        hint: md`“At most 3 years” = the first two groups. No direction in the text → two-sided test.`,
        solution: md`
$\hat p = 0.7$. $H_0:\ p = 0.75$, $H_1:\ p\ne0.75$. $z\approx-1.55$; $C: |z|\ge1.96$.
$|{-1.55}|<1.96$ → **no grounds to reject $H_0$**: the data do not contradict the hypothesis.
`,
        answer: md`$z\approx-1.55$, $|z|<1.96$ → no grounds to reject $H_0$.`
      },
      {
        id: 'e8', own: true, title: 'A p-value instead of a critical region',
        text: md`
For exercise 2 (coffee packs) find the p-value of the test. At which significance levels would we reject $H_0$: 0.1? 0.05? 0.01?
`,
        hint: md`Left-tailed: p-value $= P(T_7\le t)$ for $t\approx-2.26$. Excel: ‹T.DIST(t, 7, TRUE)›.`,
        solution: md`
p-value $= P(T_7\le-2.26)\approx0.029$.
- $\alpha = 0.1$: reject; $\alpha = 0.05$: reject; $\alpha = 0.01$: **don’t** reject.

The p-value answers the question for every $\alpha$ at once — that is why software reports it.
`,
        answer: md`p ≈ 0.029: reject at 0.1 and 0.05, not at 0.01.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'Статистический тест отвечает на вопрос «говорят ли данные против некоторого утверждения?». Учимся формулировать гипотезы, выбирать статистику критерия, находить критическую область и правильно формулировать вывод.',
    lecture: md`
# Статистическая гипотеза

**Статистическая гипотеза** — предположение о неизвестном свойстве распределения изучаемого признака. {lecture:W09}

::: example W09 | Примеры гипотез
- Производитель шин: ресурс больше 60 000 км → $H:\ \mu > 60\,000$.
- Производитель принтеров: в среднем больше 200 ч без отказа → $H:\ \mu>200$.
- Социолог: у городских детей результаты лучше → $H:\ p_1>p_2$.
- Физики: число частиц распределено по Пуассону → $H:\ X\sim P(\lambda)$.
:::

Первые три — **параметрические** гипотезы (о параметре), четвёртая — **непараметрическая** (о виде распределения, тема 11).

::: def W09 | Нулевая и альтернативная гипотезы
- $H_0$ — **нулевая гипотеза**: проверяем её с целью возможного **отклонения**; всегда содержит «=» (например, $\mu = \mu_0$).
- $H_1$ — **альтернативная гипотеза**: принимаем её, если отвергли $H_0$; обычно это то, что мы **хотим доказать**.
$H_0$ и $H_1$ должны **исключать** друг друга (нельзя $H_0: p=\frac12$, $H_1: p\ge\frac13$ — значение $\frac12$ принадлежало бы обеим).
:::

::: example W09 | Новая терапия
Старая терапия эффективна в 80% случаев. Новую внедрят, только если «уверены», что она лучше: $H_0:\ p = 0{,}8$, $H_1:\ p>0{,}8$.
:::

::: intuition
Тест — это **суд**. $H_0$ = «подсудимый невиновен» (презумпция невиновности). Обвинение (данные) должно представить сильные доказательства, чтобы её отвергнуть. Если доказательств не хватает, мы **не** говорим «невиновен», а говорим «**нет оснований** для обвинения».
:::

# Как работает тест — шаг за шагом

Пример из лекции: новая технология должна снизить выбросы. $H_0:\ \mu = \mu_0$, $H_1:\ \mu<\mu_0$; измерения $X_1,\dots,X_n\sim N(\mu,\sigma)$, $\sigma$ известно. Если верна $H_0$, то
$$Z = \frac{\bar X-\mu_0}{\sigma/\sqrt n}\sim N(0,1).$$
Если верна $H_1$, значения $Z$ сдвинуты **влево**. Поэтому **очень маленькие** $z$ говорят против $H_0$: отвергаем её при $z\le -z_{1-\alpha}$. {lecture:W09}

::: def W09 | Уровень значимости, критическая область
- **Уровень значимости $\alpha$** — вероятность отвергнуть $H_0$, когда она верна (ошибка I рода); обычно 0,01; 0,05; 0,1.
- **Критическая область $C$** — значения статистики, при которых отвергаем $H_0$. Выбираем её так, чтобы $P_{H_0}(Z\in C) = \alpha$.
:::

| | не отвергаем $H_0$ | отвергаем $H_0$ (принимаем $H_1$) |
|---|---|---|
| **$H_0$ верна** | правильное решение | **ошибка I рода** (вероятн. $\alpha$) |
| **$H_1$ верна** | **ошибка II рода** | правильное решение |

::: warn W09 | Правильная формулировка вывода
- $z\in C$ → «**отвергаем $H_0$ в пользу $H_1$** на уровне значимости $\alpha$» (и вывод словами задачи).
- $z\notin C$ → «**нет оснований отвергнуть $H_0$**» — а **не** «принимаем $H_0$» / «доказали $H_0$». Ошибку II рода мы не контролируем.
:::

::: steps | Схема решения любого теста (так пишем на коллоквиуме)
1. **Предпосылки и данные**: какой признак, какое распределение, что известно ($n$, $\bar x$, $s$, $\sigma$, $\alpha$).
2. **Гипотезы**: $H_0$ (с «=») и $H_1$ (с $<$, $>$ или $\ne$ — из вопроса).
3. **Статистика критерия** и её распределение при верной $H_0$ (выбор модели).
4. **Значение статистики** по данным.
5. **Критическая область** (направление как в $H_1$, квантиль из таблиц).
6. **Решение + вывод словами** на уровне $\alpha$.
:::

::: tip own | Как выбрать H₁ по тексту?
«выросла / больше / превышает / свыше» → $>$ (правосторонний) · «уменьшилась / меньше / завышает / ниже» → $<$ (левосторонний) · «отличается / изменилась / существенно иная» → $\ne$ (двусторонний).
:::

# Модель 1: тест для среднего, σ известно

::: formula W09 | Z-тест для среднего (нормальное, σ известно)
$$Z = \frac{\bar X-\mu_0}{\sigma}\sqrt n\ \sim N(0,1)\ \text{при } H_0:\ \mu=\mu_0$$
| $H_1$ | критическая область |
|---|---|
| $\mu>\mu_0$ | $[z_{1-\alpha};\ \infty)$ |
| $\mu<\mu_0$ | $(-\infty;\ -z_{1-\alpha}]$ |
| $\mu\ne\mu_0$ | $(-\infty; -z_{1-\alpha/2}]\cup[z_{1-\alpha/2};\infty)$ |
:::

::: example W09 | Увеличила ли реклама продажи?
Раньше дневные продажи $\sim N(1000;\ 100)$ долл. После рекламы за 9 дней: 1280, 1250, 990, 1100, 880, 1300, 1100, 950, 1050, $\bar x = 1100$. $\alpha = 0{,}01$.
1. $H_0:\ \mu = 1000$, $H_1:\ \mu>1000$.
2. $Z = \frac{\bar X-1000}{100/\sqrt9}$.
3. $z = \frac{1100-1000}{100/3} = 3$.
4. $C = [z_{0{,}99};\infty) = [2{,}33;\infty)$.
5. $3\in C$ → **отвергаем $H_0$**: на уровне 0,01 средние продажи выросли.
:::

@chart rightTail

# Модель 2: тест для среднего, σ неизвестно

::: formula W09 | t-тест для среднего (нормальное, σ неизвестно)
$$T = \frac{\bar X-\mu_0}{S}\sqrt n\ \sim t_{n-1}\ \text{при } H_0$$
Критические области как в модели 1, но с квантилями $t_{1-\alpha,\,n-1}$ или $t_{1-\alpha/2,\,n-1}$.
:::

::: example W09 | Завышает ли производитель пробег?
Производитель: средний пробег без сервиса 120 000 км. Тест 4 машин: 110 000, 120 000, 118 000, 112 000. $\alpha=0{,}05$.
1. $H_0:\ \mu = 120\,000$, $H_1:\ \mu<120\,000$.
2. $\bar x = 115\,000$, $s^2\approx 22{,}67\cdot10^6$, $s\approx4761$.
3. $t = \frac{115\,000-120\,000}{4761/2}\approx-2{,}10$.
4. $C = (-\infty; -t_{0{,}95;3}] = (-\infty; -2{,}353]$.
5. $-2{,}10\notin C$ → **нет оснований отвергнуть $H_0$**: на уровне 0,05 нельзя утверждать, что производитель завышает пробег.
:::

@chart twoTailT

::: note W09 | Модель 3: большая выборка, любое распределение
При $n\ge100$ (лист формул) и любом распределении: $Z = \frac{\bar X-\mu_0}{S}\sqrt n\approx N(0,1)$ — нормальные квантили.
:::

# p-значение

::: def W09 | p-значение (p-wartość)
**p-значение** — наименьший уровень значимости, при котором наблюдаемое значение статистики ведёт к отклонению $H_0$. Правило: **p-значение ≤ α → отвергаем $H_0$**.
:::

В примере с пробегом: $t=-2{,}10$, $P_{H_0}(T\le-2{,}10)\approx0{,}063$. Так как $0{,}063>0{,}05$ — не отвергаем (а при $\alpha = 0{,}1$ уже отвергли бы). Чем меньше p-значение, тем сильнее доказательства против $H_0$.

::: intuition
p-значение отвечает на вопрос: «**если бы $H_0$ была верна**, как часто мы получали бы результат не менее экстремальный, чем наш?». Маленькое p-значение = «это было бы очень странное совпадение» → сомневаемся в $H_0$.
:::

# Модель 4: тест для дисперсии

::: formula W09 | χ²-тест для дисперсии (нормальное)
$$\chi^2 = \frac{(n-1)S^2}{\sigma_0^2}\ \sim\chi^2_{n-1}\ \text{при } H_0:\ \sigma^2=\sigma_0^2$$
| $H_1$ | критическая область |
|---|---|
| $\sigma^2>\sigma_0^2$ | $[\chi^2_{1-\alpha,\,n-1};\ \infty)$ |
| $\sigma^2<\sigma_0^2$ | $(0;\ \chi^2_{\alpha,\,n-1}]$ |
| $\sigma^2\ne\sigma_0^2$ | $(0;\chi^2_{\alpha/2,\,n-1}]\cup[\chi^2_{1-\alpha/2,\,n-1};\infty)$ |
:::

::: example W09 | Лампочки
15 лампочек, $s = 13$ ч. Отличается ли стандартное отклонение от 10 ч? $\alpha = 0{,}05$.
$H_0:\ \sigma = 10$, $H_1:\ \sigma\ne10$; $\chi^2 = \frac{14\cdot169}{100} = 23{,}66$; $C = (0; 5{,}629]\cup[26{,}119;\infty)$. $23{,}66\notin C$ → нет оснований отвергнуть $H_0$.
:::

@chart chiTwo

::: tip own
Гипотеза об отклонении $\sigma$ — то же самое, что о дисперсии: $\sigma>2 \Leftrightarrow \sigma^2>4$. В статистику подставляется $\sigma_0^2$ (в квадрате!).
:::

# Модель 9: парные данные (до и после)

Когда **одни и те же объекты** измеряют дважды (до и после лекарства, до и после тренинга), считаем разности $D_i = X_i - Y_i$ и делаем обычный t-тест для их среднего. {lecture:W09}

::: formula W09 | Тест для парных данных
$$H_0:\ \mu_D = 0,\qquad T = \frac{\bar D}{S_D}\sqrt n\ \sim t_{n-1}$$
:::

::: example W09 | Снижает ли лекарство давление?
| пациент | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---:|---:|---:|---:|---:|---:|---:|
| до | 210 | 180 | 260 | 270 | 190 | 250 | 180 |
| после | 180 | 160 | 220 | 260 | 200 | 230 | 180 |
| $d_i$ | 30 | 20 | 40 | 10 | −10 | 20 | 0 |

$H_0:\ \mu_D = 0$, $H_1:\ \mu_D>0$. $\bar d\approx15{,}7$, $s_D\approx15{,}9$, $t = \frac{15{,}7}{15{,}9}\sqrt7\approx2{,}24$; $t_{0{,}95;6} = 1{,}943$. $2{,}24\ge1{,}943$ → отвергаем $H_0$: лекарство снижает среднее давление ($\alpha = 0{,}05$).
:::

# Модель 10: тест для доли

::: formula W09 | Тест для доли (большая выборка: $n\hat p\ge5$, $n(1-\hat p)\ge5$)
$$Z = \frac{\hat p - p_0}{\sqrt{p_0(1-p_0)/n}}\ \approx N(0,1)\ \text{при } H_0:\ p=p_0$$
Внимание: в знаменателе $p_0$ из гипотезы, а **не** $\hat p$ (в отличие от доверительного интервала).
:::

::: example W09 | Машины на газу
Предполагаем, что доля машин на газу в Варшаве меньше 0,15. В выборке из 200 машин 21 на газу. $\alpha = 0{,}05$.
$H_0:\ p=0{,}15$, $H_1:\ p<0{,}15$; $\hat p = 0{,}105$; $z = \frac{0{,}105-0{,}15}{\sqrt{0{,}15\cdot0{,}85/200}}\approx-1{,}79$; $C = (-\infty;-1{,}645]$ → $z\in C$ → отвергаем $H_0$: доля меньше 15%.
:::

# Выбор теста — итог

| Гипотеза о… | Предпосылки | Статистика | Распределение при $H_0$ |
|---|---|---|---|
| среднем | нормальное, σ известно | $\frac{\bar X-\mu_0}{\sigma}\sqrt n$ | $N(0,1)$ |
| среднем | нормальное, σ неизвестно | $\frac{\bar X-\mu_0}{S}\sqrt n$ | $t_{n-1}$ |
| среднем | любое, $n\ge100$ | $\frac{\bar X-\mu_0}{S}\sqrt n$ | ≈ $N(0,1)$ |
| дисперсии | нормальное | $\frac{(n-1)S^2}{\sigma_0^2}$ | $\chi^2_{n-1}$ |
| среднем разностей (парные) | разности нормальны | $\frac{\bar D}{S_D}\sqrt n$ | $t_{n-1}$ |
| доле | большое $n$ | $\frac{\hat p-p_0}{\sqrt{p_0(1-p_0)/n}}$ | ≈ $N(0,1)$ |

# В Excel

~~~excel t-тест для среднего (данные в A2:A9, μ₀ в D1)
D1: 250
D2: =AVERAGE(A2:A9)
D3: =STDEV.S(A2:A9)
D4: =COUNT(A2:A9)
D5: =(D2-D1)/D3*SQRT(D4)          // статистика t
D6: =-T.INV(0.95,D4-1)            // граница C для H1: μ < μ0 (α = 0,05)
D7: =T.DIST(D5,D4-1,TRUE)         // p-значение (левосторонний)
D8: =T.DIST.RT(D5,D4-1)           // p-значение (правосторонний)
D9: =T.DIST.2T(ABS(D5),D4-1)      // p-значение (двусторонний)
~~~

~~~excel Дисперсия и доля
E1: =(10-1)*0.052/0.04            // χ² для дисперсии
E2: =CHISQ.INV(0.025,9)           // левая граница (двусторонний, α = 0,05)
E3: =CHISQ.INV.RT(0.025,9)        // правая граница
E4: =(68/400-0.2)/SQRT(0.2*0.8/400)   // z для доли
E5: =NORM.S.DIST(E4,TRUE)         // p-значение (левосторонний)
~~~

~~~python Тесты в scipy
import numpy as np
from scipy import stats

x = np.array([247, 251, 245, 249, 248, 246, 252, 244])
t, p = stats.ttest_1samp(x, popmean=250, alternative='less')
print(t, p)                                   # t ≈ -2.26, p ≈ 0.029 → отвергаем при α = 0.05

chi2 = (10 - 1) * 0.052 / 0.04
print(chi2, stats.chi2.ppf([0.025, 0.975], 9))
~~~

::: summary
- $H_0$ содержит «=»; $H_1$ — то, что доказываем; направление $H_1$ ↔ форма критической области.
- $\alpha$ = P(ошибка I рода); решение: статистика ∈ C → отвергаем $H_0$; иначе «нет оснований отвергнуть».
- p-значение ≤ α ⇔ отвергаем $H_0$.
- Среднее: $z$ (σ известно) или $t_{n-1}$; дисперсия: $\chi^2_{n-1}$; парные: $t$ по разностям; доля: $z$ с $p_0$.
:::
`,

    cheatsheet: md`
## Схема (6 шагов)
1) предпосылки и данные → 2) $H_0$ (=), $H_1$ ($<$, $>$, $\ne$) → 3) статистика и её распределение → 4) значение → 5) критическая область → 6) решение + вывод словами

## Статистики критериев
| тест | статистика | распределение |
|---|---|---|
| μ, σ известно | $\frac{\bar x-\mu_0}{\sigma}\sqrt n$ | $N(0,1)$ |
| μ, σ неизвестно | $\frac{\bar x-\mu_0}{s}\sqrt n$ | $t_{n-1}$ |
| μ, $n\ge100$ | $\frac{\bar x-\mu_0}{s}\sqrt n$ | ≈ $N(0,1)$ |
| σ² | $\frac{(n-1)s^2}{\sigma_0^2}$ | $\chi^2_{n-1}$ |
| парные | $\frac{\bar d}{s_d}\sqrt n$ | $t_{n-1}$ |
| p | $\frac{\hat p-p_0}{\sqrt{p_0(1-p_0)/n}}$ | ≈ $N(0,1)$ |

## Критические области (z, t)
- $H_1: >$ → $[q_{1-\alpha};\infty)$
- $H_1: <$ → $(-\infty;-q_{1-\alpha}]$
- $H_1: \ne$ → $|stat|\ge q_{1-\alpha/2}$
- χ²: $>$ → $[\chi^2_{1-\alpha};\infty)$; $<$ → $(0;\chi^2_\alpha]$; $\ne$ → $(0;\chi^2_{\alpha/2}]\cup[\chi^2_{1-\alpha/2};\infty)$

## Квантили N(0,1)
$z_{0{,}9}=1{,}282$ · $z_{0{,}95}=1{,}645$ · $z_{0{,}96}=1{,}751$ · $z_{0{,}975}=1{,}96$ · $z_{0{,}99}=2{,}326$ · $z_{0{,}995}=2{,}576$

## Вывод
∈ C: «отвергаем $H_0$ в пользу $H_1$ на уровне α» · ∉ C: «нет оснований отвергнуть $H_0$» · p-значение ≤ α → отвергаем

## Excel
‹NORM.S.INV› ‹T.INV(1-α,df)› ‹T.INV.2T(α,df)› ‹CHISQ.INV› ‹CHISQ.INV.RT› · p-значения: ‹T.DIST› ‹T.DIST.RT› ‹T.DIST.2T› ‹NORM.S.DIST›
`,

    exercises: [
      {
        id: 'e1', tag: 'C12', title: 'Сколько длится обучение в игре? (σ известно)',
        text: md`
Время прохождения обучения в игре распределено нормально со стандартным отклонением 4 мин. Разработчики утверждают, что обучение длится 20 минут, игроки — что дольше. Время 8 случайных игроков (мин): 24, 19, 27, 22, 25, 21, 26, 23. Правы ли игроки? $\alpha = 0{,}05$.
`,
        hint: md`$\sigma$ известно → модель 1, правосторонний тест.`,
        solution: md`
1. $X\sim N(\mu, 4)$, $n = 8$, $\bar x = 23{,}375$, $\alpha = 0{,}05$.
2. $H_0:\ \mu = 20$, $H_1:\ \mu>20$.
3. $Z = \frac{\bar X-20}{4}\sqrt8\sim N(0,1)$ при $H_0$.
4. $z = \frac{3{,}375}{4}\cdot2{,}828\approx2{,}39$.
5. $C = [1{,}645;\infty)$.
6. $2{,}39\in C$ → **отвергаем $H_0$**: на уровне 0,05 среднее время обучения больше 20 мин — игроки правы (p-значение ≈ 0,0085).
`,
        answer: md`$z\approx2{,}39\ge1{,}645$ → отвергаем $H_0$; обучение длится дольше 20 мин.`
      },
      {
        id: 'e2', tag: 'C12', title: 'Пачки кофе 250 г (σ неизвестно)',
        text: md`
Контроль качества взвесил 8 пачек кофе номинальной массой 250 г: 247, 251, 245, 249, 248, 246, 252, 244 г. Масса распределена нормально. На уровне значимости 0,05 проверьте предположение, что средняя масса пачки **меньше** 250 г.
`,
        hint: md`$\sigma$ неизвестно → t-тест, 7 степеней свободы, $t_{0{,}95;7} = 1{,}895$.`,
        solution: md`
1. $n = 8$, $\bar x = 247{,}75$ г, $s^2\approx7{,}93$, $s\approx2{,}816$ г.
2. $H_0:\ \mu = 250$, $H_1:\ \mu<250$.
3. $T = \frac{\bar X-250}{S}\sqrt8\sim t_7$.
4. $t = \frac{-2{,}25}{2{,}816}\cdot2{,}828\approx-2{,}26$.
5. $C = (-\infty; -1{,}895]$.
6. $-2{,}26\in C$ → **отвергаем $H_0$**: средняя масса пачки меньше 250 г (p-значение ≈ 0,029).
`,
        answer: md`$t\approx-2{,}26\le-1{,}895$ → отвергаем $H_0$: пачки легче нормы.`
      },
      {
        id: 'e3', tag: 'C12', title: 'Точность прибора (тест для дисперсии)',
        text: md`
Новым прибором выполнили 10 измерений одной детали и получили выборочную дисперсию $s^2 = 0{,}052$. На уровне значимости 0,05 проверьте, **существенно ли отличается** дисперсия показаний от 0,04. Измерения распределены нормально.
`,
        hint: md`Двусторонний тест: $\chi^2_{0{,}025;9} = 2{,}700$, $\chi^2_{0{,}975;9} = 19{,}023$.`,
        solution: md`
$H_0:\ \sigma^2 = 0{,}04$, $H_1:\ \sigma^2\ne0{,}04$.
$\chi^2 = \frac{9\cdot0{,}052}{0{,}04} = 11{,}7$; $C = (0; 2{,}700]\cup[19{,}023;\infty)$.
$11{,}7\notin C$ → **нет оснований отвергнуть $H_0$**: данные не указывают, что дисперсия отличается от 0,04.
`,
        answer: md`$\chi^2 = 11{,}7\notin C$ → нет оснований отвергнуть $H_0$.`
      },
      {
        id: 'e4', tag: 'C12', title: 'Сахар в яблоках (сгруппированные данные)',
        text: md`
Содержание сахара (%) в 50 случайных яблоках:

| сахар [%] | 8–10 | 10–12 | 12–14 | 14–16 | 16–18 |
|---|---:|---:|---:|---:|---:|
| яблок | 4 | 12 | 20 | 10 | 4 |

Предполагая нормальность, на уровне 0,1 проверьте гипотезу, что дисперсия содержания сахара **больше** 3.
`,
        hint: md`Середины классов 9, 11, …, 17; $s^2$ по сгруппированным данным. $\chi^2_{0{,}9;49}\approx62{,}04$.`,
        solution: md`
$\bar x = 12{,}92$; $\sum n_i(\tilde x_i-\bar x)^2\approx215{,}68$, $s^2\approx4{,}40$.
$H_0:\ \sigma^2 = 3$, $H_1:\ \sigma^2>3$; $\chi^2 = \frac{215{,}68}{3}\approx71{,}89$; $C = [62{,}04;\infty)$.
$71{,}89\in C$ → **отвергаем $H_0$**: дисперсия содержания сахара больше 3 ($\alpha = 0{,}1$).
`,
        answer: md`$\chi^2\approx71{,}9\ge62{,}0$ → отвергаем $H_0$; дисперсия > 3.`
      },
      {
        id: 'e5', tag: 'C12', title: 'Экранное время (большая выборка)',
        text: md`
150 студентов указали ежедневное экранное время телефона (ч):

| время | 0–2 | 2–4 | 4–6 | 6–8 | 8–10 |
|---|---:|---:|---:|---:|---:|
| студентов | 12 | 35 | 48 | 38 | 17 |

Можно ли утверждать, что студенты проводят у экрана в среднем **больше 5 часов** в день? Примите $\alpha = 0{,}04$.
`,
        hint: md`Большая выборка, распределение неизвестно → модель 3 ($z$). $z_{0{,}96}\approx1{,}751$.`,
        solution: md`
$\bar x\approx5{,}173$ ч; $s^2\approx5{,}044$, $s\approx2{,}246$.
$H_0:\ \mu = 5$, $H_1:\ \mu>5$; $z = \frac{0{,}173}{2{,}246}\sqrt{150}\approx0{,}945$; $C = [1{,}751;\infty)$.
$0{,}945\notin C$ → **нет оснований отвергнуть $H_0$**: данные не позволяют утверждать, что среднее больше 5 ч (p-значение ≈ 0,17).
`,
        answer: md`$z\approx0{,}95<1{,}75$ → нет оснований отвергнуть $H_0$.`
      },
      {
        id: 'e6', tag: 'C12', title: 'Отток пользователей (доля)',
        text: md`
Из 400 случайных пользователей приложения 68 отказались от подписки в течение месяца. Можно ли на уровне значимости 0,05 утверждать, что месячный отток **меньше 20%**?
`,
        hint: md`$\hat p = 0{,}17$; в знаменателе $p_0 = 0{,}2$.`,
        solution: md`
$H_0:\ p = 0{,}2$, $H_1:\ p<0{,}2$. $z = \frac{-0{,}03}{0{,}02} = -1{,}5$; $C = (-\infty;-1{,}645]$.
$-1{,}5\notin C$ → **нет оснований отвергнуть $H_0$**: нельзя утверждать, что отток меньше 20%.
`,
        answer: md`$z = -1{,}5 > -1{,}645$ → нет оснований отвергнуть $H_0$.`
      },
      {
        id: 'e7', tag: 'C12', title: 'Стаж в IT-компании (доля, двусторонний тест)',
        text: md`
В опросе 180 сотрудников IT-компании: 72 работают меньше года, 54 — от года до 3 лет, 54 — больше 3 лет. Проверьте гипотезу, что у **75%** сотрудников стаж **не больше 3 лет**. $\alpha = 0{,}05$.
`,
        hint: md`«Не больше 3 лет» — первые две группы. В тексте нет направления → двусторонний тест.`,
        solution: md`
$\hat p = 0{,}7$. $H_0:\ p = 0{,}75$, $H_1:\ p\ne0{,}75$. $z\approx-1{,}55$; $C: |z|\ge1{,}96$.
$|{-1{,}55}|<1{,}96$ → **нет оснований отвергнуть $H_0$**: данные не противоречат гипотезе.
`,
        answer: md`$z\approx-1{,}55$, $|z|<1{,}96$ → нет оснований отвергнуть $H_0$.`
      },
      {
        id: 'e8', own: true, title: 'p-значение вместо критической области',
        text: md`
Для задачи 2 (пачки кофе) найдите p-значение теста. При каких уровнях значимости мы бы отвергли $H_0$: 0,1? 0,05? 0,01?
`,
        hint: md`Левосторонний: p-значение $= P(T_7\le t)$ при $t\approx-2{,}26$. Excel: ‹T.DIST(t; 7; TRUE)›.`,
        solution: md`
p-значение $= P(T_7\le-2{,}26)\approx0{,}029$.
- $\alpha = 0{,}1$: отвергаем; $\alpha = 0{,}05$: отвергаем; $\alpha = 0{,}01$: **не** отвергаем.

p-значение сразу отвечает на вопрос для любого $\alpha$ — поэтому программы его и показывают.
`,
        answer: md`p ≈ 0,029: отвергаем при 0,1 и 0,05, не при 0,01.`
      }
    ]
  };

  SAD.registerTopic('t10', { charts: charts, pl: pl, en: en, ru: ru });
})();
