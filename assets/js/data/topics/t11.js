/* Topic 11 — Two populations and chi-square tests (lecture W10, classes C13 and C15) */
(function () {
  var md = SAD.md;

  var charts = {
    chiFit: { type: 'pdf', dist: { name: 'chi2', df: 3 }, range: [0, 16],
      shade: [{ from: 7.81, to: 16, cls: '2', label: 'α = 0,05', labelX: 10.5, labelY: 0.03 }],
      markers: [{ x: 7.81, label: '7,81' }, { x: 8.23, label: 'χ² = 8,23', anchor: 'start' }],
      caption: { pl: 'Test zgodności χ² (3 st. sw.): zbiór krytyczny jest zawsze prawostronny', en: 'χ² goodness-of-fit test (3 df): the critical region is always right-sided', ru: 'Критерий согласия χ² (3 ст. св.): критическая область всегда правосторонняя' } },
    groups: { type: 'bar', labels: ['A', 'B', 'AB', '0'], values: [148, 96, 50, 106], values2: [160, 80, 40, 120],
      legend: [{ pl: 'obserwowane', en: 'observed', ru: 'наблюдаемые' }, { pl: 'oczekiwane', en: 'expected', ru: 'ожидаемые' }],
      yLabel: { pl: 'liczba osób', en: 'people', ru: 'человек' },
      caption: { pl: 'Grupy krwi: liczności obserwowane vs oczekiwane przy H₀ (W10)', en: 'Blood groups: observed vs expected counts under H₀ (W10)', ru: 'Группы крови: наблюдаемые и ожидаемые при H₀ частоты (W10)' } }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Porównujemy **dwie grupy**: średnie, dane „przed i po”, proporcje. Potem dwa testy chi-kwadrat: **zgodności** (czy dane pasują do zakładanego rozkładu) i **niezależności** (czy dwie cechy są powiązane).',
    lecture: md`
# Dwie średnie — który model?

Mamy dwie **niezależne** próby: $X_1,\dots,X_{n_1}$ z populacji 1 i $Y_1,\dots,Y_{n_2}$ z populacji 2. Testujemy $H_0:\ \mu_1 = \mu_2$ (czyli $\mu_1-\mu_2 = 0$). {lecture:W10}

::: intuition
Pytamy: czy różnica średnich w próbkach $\bar x-\bar y$ jest „duża” w porównaniu z tym, ile mogłaby wynieść przypadkiem? Mianownik statystyki to właśnie **typowy przypadkowy rozrzut** tej różnicy.
:::

## Model 5: rozkłady normalne, wariancje znane

::: formula W10 | Test Z dla dwóch średnich (σ₁, σ₂ znane)
$$Z = \frac{\bar X-\bar Y}{\sqrt{\dfrac{\sigma_1^2}{n_1}+\dfrac{\sigma_2^2}{n_2}}}\ \sim N(0,1)\ \text{przy } H_0$$
Zbiory krytyczne jak w teście jednej średniej: $[z_{1-\alpha};\infty)$, $(-\infty;-z_{1-\alpha}]$ lub $|z|\ge z_{1-\alpha/2}$.
:::

::: example W10 | Europejczycy i Amerykanie
Średnia waga 15 Europejczyków $\bar x = 154$ funty, 18 Amerykanów $\bar y = 162$; $\sigma_1^2 = 100$, $\sigma_2^2 = 169$. Czy średnie wagi się różnią ($\alpha = 0{,}05$)?
$H_0:\ \mu_1=\mu_2$, $H_1:\ \mu_1\ne\mu_2$; $z = \frac{154-162}{\sqrt{100/15+169/18}}\approx\frac{-8}{4{,}01} = -2$; $|z| = 2\ge1{,}96$ → **odrzucamy $H_0$**: średnie wagi się różnią (dane sugerują, że Amerykanie ważą więcej).
:::

## Model 6: rozkłady normalne, wariancje nieznane, ale równe

Łączymy obie próby, żeby oszacować wspólną wariancję:

::: formula W10 | Test t dla dwóch średnich (σ₁ = σ₂ nieznane)
$$S_p^2 = \frac{(n_1-1)S_1^2+(n_2-1)S_2^2}{n_1+n_2-2},\qquad T = \frac{\bar X-\bar Y}{S_p\sqrt{\dfrac1{n_1}+\dfrac1{n_2}}}\ \sim t_{n_1+n_2-2}$$
:::

::: example W10 | Tranzystory
Czas magazynowania ładunku: stara technologia $\bar x = 6{,}6$ ns, nowa $\bar y = 6{,}3$ ns, po 50 elementów, $s_p = 0{,}5$. $H_1:\ \mu_1>\mu_2$ (nowa zmniejszyła czas).
$t = \frac{6{,}6-6{,}3}{0{,}5\sqrt{1/50+1/50}} = 3{,}0$; $t_{0{,}95;98}\approx1{,}66$ → **odrzucamy $H_0$**: nowa technologia skróciła czas.
:::

::: note | Model 7: duże próby, dowolne rozkłady
Dla $n_1, n_2\ge100$ (arkusz wzorów): $Z = \dfrac{\bar X-\bar Y}{\sqrt{S_1^2/n_1+S_2^2/n_2}}\approx N(0,1)$.
:::

::: warn own | Niezależne czy sparowane?
**Dwie różne grupy** ludzi/obiektów (np. pracownicy w 2021 i inni w 2022) → modele 5–7. **Te same obiekty** zmierzone dwukrotnie (przed/po) → **test dla danych sparowanych** (model 9 z tematu 10): liczysz różnice $d_i$ i test t dla $\mu_D$. Pomylenie tych sytuacji to jeden z najczęstszych błędów!
:::

# Dwie proporcje

::: formula W10 | Test dla różnicy proporcji (model 11)
$K_1$, $K_2$ — liczby „sukcesów” w próbach o licznościach $n_1$, $n_2$. $\hat p_1 = \frac{K_1}{n_1}$, $\hat p_2 = \frac{K_2}{n_2}$, a przy $H_0:\ p_1=p_2$ wspólne $\hat p = \frac{K_1+K_2}{n_1+n_2}$:
$$Z = \frac{\hat p_1-\hat p_2}{\sqrt{\hat p(1-\hat p)\left(\dfrac1{n_1}+\dfrac1{n_2}\right)}}\ \approx N(0,1)$$
Warunek: $n_i\hat p_i\ge5$, $n_i(1-\hat p_i)\ge5$.
:::

::: example W10 | Awaryjność monitorów
Firma A: 10 z 200 monitorów wymagało naprawy; firma B: 12 ze 150. Czy A jest mniej awaryjna? $\alpha = 0{,}06$.
$\hat p_1 = 0{,}05$, $\hat p_2 = 0{,}08$, $\hat p = \frac{22}{350}\approx0{,}063$; $z = \frac{0{,}05-0{,}08}{\sqrt{0{,}063\cdot0{,}937\cdot(1/200+1/150)}}\approx-1{,}14$; $C = (-\infty;-z_{0{,}94}] = (-\infty;-1{,}55]$.
$-1{,}14\notin C$ → **brak podstaw do odrzucenia $H_0$**: nie można twierdzić, że monitory A psują się rzadziej.
:::

# Test zgodności chi-kwadrat

Cecha przyjmuje $k$ kategorii. Hipoteza mówi, jakie powinny być ich prawdopodobieństwa: $H_0:\ P(X=c_i) = p_i$, $i=1..k$. W próbie o liczności $n$ obserwujemy liczności $N_1,\dots,N_k$; przy $H_0$ **oczekujemy** $np_1,\dots,np_k$. {lecture:W10}

::: formula W10 | Test zgodności χ² Pearsona
$$\chi^2 = \sum_{i=1}^{k}\frac{(N_i - np_i)^2}{np_i}\ \approx\chi^2_{k-1}\ \text{przy } H_0$$
Zbiór krytyczny (zawsze **prawostronny** — duże odchylenia przeczą $H_0$): $C = [\chi^2_{1-\alpha,\,k-1};\ \infty)$.
Warunek: wszystkie liczności oczekiwane $np_i\ge5$; jeśli nie — **łączymy** klasę z sąsiednią (i zmniejszamy $k$).
:::

::: intuition
„Obserwowane minus oczekiwane, do kwadratu, podzielone przez oczekiwane” — to miara, jak bardzo rzeczywistość odbiega od hipotezy. Zero = idealna zgodność. Im większa liczba, tym trudniej uwierzyć w $H_0$.
:::

::: example W10 | Grupy krwi
Przypuszczenie: A — 40%, B — 20%, AB — 10%, 0 — 30%. Wśród 400 osób: 148, 96, 50, 106. $\alpha = 0{,}05$.

| grupa | $N_i$ | $np_i$ | $(N_i-np_i)^2/np_i$ |
|---|---:|---:|---:|
| A | 148 | 160 | 0,90 |
| B | 96 | 80 | 3,20 |
| AB | 50 | 40 | 2,50 |
| 0 | 106 | 120 | 1,63 |
| **suma** | 400 | 400 | **8,23** |

$k-1 = 3$, $\chi^2_{0{,}95;3} = 7{,}81$; $8{,}23\ge7{,}81$ → **odrzucamy $H_0$**: rozkład grup krwi jest inny niż zakładany.
:::

@chart groups

@chart chiFit

# Test niezależności chi-kwadrat

Dwie cechy jakościowe $X$ (k kategorii) i $Y$ (r kategorii). Dane w **tablicy kontyngencji** $n_{ij}$ z sumami wierszy $n_{i\cdot}$ i kolumn $n_{\cdot j}$. $H_0$: cechy są **niezależne**.

::: formula W10 | Test niezależności χ²
Liczności oczekiwane przy niezależności: $\hat n_{ij} = \dfrac{n_{i\cdot}\,n_{\cdot j}}{n}$ („suma wiersza × suma kolumny / całość”).
$$\chi^2 = \sum_{i=1}^{k}\sum_{j=1}^{r}\frac{(n_{ij}-\hat n_{ij})^2}{\hat n_{ij}}\ \approx\chi^2_{(k-1)(r-1)},\qquad C = [\chi^2_{1-\alpha,\,(k-1)(r-1)};\ \infty)$$
Warunek: wszystkie $\hat n_{ij}\ge5$.
:::

::: example W10 | Wyniki egzaminu a wydział
| wydział | zdał | nie zdał | razem |
|---|---:|---:|---:|
| A | 350 | 50 | 400 |
| B | 450 | 150 | 600 |
| C | 200 | 100 | 300 |
| **razem** | 1000 | 300 | 1300 |

Np. $\hat n_{A,\text{zdał}} = \frac{400\cdot1000}{1300}\approx307{,}7$. Po zsumowaniu 6 składników $\chi^2\approx44{,}2$. Stopnie swobody $(3-1)(2-1) = 2$, $\chi^2_{0{,}99;2} = 9{,}21$ → $44{,}2\in C$ → **odrzucamy $H_0$**: wynik egzaminu zależy od wydziału ($\alpha = 0{,}01$).
:::

::: steps | Test niezależności — procedura
1. Dopisz sumy wierszy, kolumn i $n$.
2. Dla każdej komórki: $\hat n_{ij} = n_{i\cdot}n_{\cdot j}/n$ (sprawdź, że ≥ 5).
3. Dla każdej komórki: $(n_{ij}-\hat n_{ij})^2/\hat n_{ij}$; zsumuj.
4. Stopnie swobody $(k-1)(r-1)$; kwantyl $\chi^2_{1-\alpha}$.
5. $\chi^2\ge$ kwantyl → cechy **zależne**; inaczej brak podstaw do odrzucenia niezależności.
:::

::: tip own | Tablica 2×2
Dla tablicy $\begin{smallmatrix}a&b\\c&d\end{smallmatrix}$ jest skrót: $\chi^2 = \dfrac{n(ad-bc)^2}{(a+b)(c+d)(a+c)(b+d)}$, 1 stopień swobody. Dobry sposób na sprawdzenie wyniku.
:::

# W Excelu

~~~excel Dwie średnie i chi-kwadrat
A1: =T.TEST(B2:B10,C2:C12,1,2)      // p-wartość: t dla 2 prób, jednostronny, równe wariancje
A2: =T.TEST(B2:B9,C2:C9,1,1)        // p-wartość: dane sparowane
A3: =T.TEST(B2:B10,C2:C12,2,3)      // dwustronny, nierówne wariancje (Welch)
A4: =CHISQ.TEST(B15:E15,B16:E16)    // p-wartość testu zgodności (obserwowane, oczekiwane)
A5: =CHISQ.INV.RT(0.05,3)           // kwantyl χ²_{0,95; 3} = 7,81
F2: =$D2*B$5/$D$5                   // liczność oczekiwana w tablicy kontyngencji (suma wiersza × suma kolumny / n)
~~~

~~~python scipy: dwie próby i testy χ²
import numpy as np
from scipy import stats

before = np.array([312, 298, 335, 301, 322, 289, 340, 315])
after  = np.array([295, 301, 310, 290, 305, 284, 318, 309])
print(stats.ttest_rel(before, after, alternative='greater'))     # dane sparowane

print(stats.chisquare([148, 96, 50, 106], f_exp=[160, 80, 40, 120]))   # zgodność: χ² = 8.23

table = np.array([[350, 50], [450, 150], [200, 100]])
chi2, p, dof, expected = stats.chi2_contingency(table, correction=False)
print(chi2, p, dof)                                              # 44.2, p ≈ 2.5e-10, 2
~~~

::: warn own
‹chi2_contingency› dla tablic 2×2 domyślnie stosuje poprawkę Yatesa (‹correction=True›) — na zajęciach liczymy **bez** niej, więc ustaw ‹correction=False›.
:::

::: summary
- Dwie średnie: σ znane → $Z$ (model 5); σ równe nieznane → $T$ z $S_p$, $n_1+n_2-2$ st. sw. (model 6); duże próby → $Z$ z $S_1,S_2$ (model 7).
- Te same obiekty dwukrotnie → dane sparowane (test t na różnicach).
- Dwie proporcje: $Z$ ze wspólnym $\hat p = \frac{K_1+K_2}{n_1+n_2}$.
- Zgodność χ²: $\sum\frac{(N_i-np_i)^2}{np_i}$, $k-1$ st. sw., oczekiwane ≥ 5.
- Niezależność χ²: $\hat n_{ij} = \frac{n_{i\cdot}n_{\cdot j}}{n}$, $(k-1)(r-1)$ st. sw.; zbiór krytyczny zawsze prawostronny.
:::
`,

    cheatsheet: md`
## Dwie średnie (niezależne próby), $H_0:\ \mu_1=\mu_2$
| model | statystyka | rozkład |
|---|---|---|
| 5: normalne, σ znane | $\frac{\bar x-\bar y}{\sqrt{\sigma_1^2/n_1+\sigma_2^2/n_2}}$ | $N(0,1)$ |
| 6: normalne, σ₁=σ₂ nieznane | $\frac{\bar x-\bar y}{s_p\sqrt{1/n_1+1/n_2}}$ | $t_{n_1+n_2-2}$ |
| 7: duże próby | $\frac{\bar x-\bar y}{\sqrt{s_1^2/n_1+s_2^2/n_2}}$ | ≈ $N(0,1)$ |

$s_p^2=\frac{(n_1-1)s_1^2+(n_2-1)s_2^2}{n_1+n_2-2}$

## Sparowane (przed/po)
$d_i = x_i - y_i$ → $t=\frac{\bar d}{s_d}\sqrt n$, $t_{n-1}$

## Dwie proporcje
$\hat p=\frac{K_1+K_2}{n_1+n_2}$ · $z=\frac{\hat p_1-\hat p_2}{\sqrt{\hat p(1-\hat p)(1/n_1+1/n_2)}}$

## Chi-kwadrat (zawsze prawostronny: $\chi^2\ge\chi^2_{1-\alpha}$ → odrzucamy)
- **zgodność**: $\sum\frac{(N_i-np_i)^2}{np_i}$, st. sw. $k-1$
- **niezależność**: $\hat n_{ij}=\frac{n_{i\cdot}n_{\cdot j}}{n}$, $\sum\frac{(n_{ij}-\hat n_{ij})^2}{\hat n_{ij}}$, st. sw. $(k-1)(r-1)$
- 2×2: $\chi^2=\frac{n(ad-bc)^2}{(a+b)(c+d)(a+c)(b+d)}$
- oczekiwane < 5 → łącz klasy

## Kwantyle χ² (0,95 / 0,99)
1 st.: 3,841 / 6,635 · 2: 5,991 / 9,210 · 3: 7,815 / 11,345 · 4: 9,488 / 13,277 · 5: 11,070 / 15,086

## Excel
‹T.TEST(r1,r2,ogony,typ)› (typ 1 = sparowane, 2 = równe σ, 3 = różne) · ‹CHISQ.TEST(obs,oczek)› · ‹CHISQ.INV.RT(α,df)›
`,

    exercises: [
      {
        id: 'e1', tag: 'C13', title: 'Dwa zespoły supportu (równe wariancje)',
        text: md`
Zespół A zamyka tygodniowo średnio 52 zgłoszenia ($n_1 = 9$ tygodni, $s_1 = 6$), zespół B — 58 zgłoszeń ($n_2 = 11$ tygodni, $s_2 = 7$). Zakładamy rozkłady normalne o równych wariancjach. Czy na poziomie 0,05 można uznać, że zespół B zamyka średnio **więcej** zgłoszeń?
`,
        hint: md`Model 6: $s_p^2$, $t_{0{,}95;18} = 1{,}734$. $H_1:\ \mu_A<\mu_B$.`,
        solution: md`
1. Założenia: normalność, $\sigma_1=\sigma_2$ nieznane; $n_1=9$, $n_2=11$.
2. $H_0:\ \mu_A=\mu_B$, $H_1:\ \mu_A<\mu_B$.
3. $s_p^2 = \frac{8\cdot36+10\cdot49}{18} = \frac{778}{18}\approx43{,}22$, $s_p\approx6{,}574$.
4. $t = \frac{52-58}{6{,}574\sqrt{1/9+1/11}}\approx\frac{-6}{2{,}955}\approx-2{,}03$.
5. $C = (-\infty;-1{,}734]$.
6. $-2{,}03\in C$ → **odrzucamy $H_0$**: zespół B zamyka średnio więcej zgłoszeń ($\alpha = 0{,}05$).
`,
        answer: md`$t\approx-2{,}03\le-1{,}734$ → odrzucamy $H_0$.`
      },
      {
        id: 'e2', tag: 'C13', title: 'Dwie marki baterii (σ znane)',
        text: md`
Czas pracy baterii (h) dwóch marek; odchylenia standardowe są znane: $\sigma_A = 3$, $\sigma_B = 4$, rozkłady normalne.

| marka | czasy |
|---|---|
| A | 31,2; 28,4; 33,1; 29,8; 32,5; 30,6 |
| B | 26,9; 30,2; 24,8; 28,1; 27,5; 25,3; 29,0 |

Czy baterie A działają średnio **dłużej**? $\alpha = 0{,}05$.
`,
        hint: md`Model 5: $z = \frac{\bar x_A-\bar x_B}{\sqrt{9/6+16/7}}$.`,
        solution: md`
$\bar x_A = \frac{185{,}6}{6}\approx30{,}93$, $\bar x_B = \frac{191{,}8}{7} = 27{,}40$.
$H_0:\ \mu_A=\mu_B$, $H_1:\ \mu_A>\mu_B$; $z = \frac{3{,}53}{\sqrt{1{,}5+2{,}286}}\approx\frac{3{,}53}{1{,}946}\approx1{,}82$; $C = [1{,}645;\infty)$.
$1{,}82\in C$ → **odrzucamy $H_0$**: baterie A działają średnio dłużej.
`,
        answer: md`$z\approx1{,}82\ge1{,}645$ → odrzucamy $H_0$.`
      },
      {
        id: 'e3', tag: 'C13', title: 'Czas reakcji przed i po kawie (sparowane)',
        text: md`
Czas reakcji (ms) 8 osób zmierzono przed i po wypiciu kawy:

| osoba | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| przed | 312 | 298 | 335 | 301 | 322 | 289 | 340 | 315 |
| po | 295 | 301 | 310 | 290 | 305 | 284 | 318 | 309 |

Zakładamy normalność różnic. Czy kawa skraca czas reakcji? $\alpha = 0{,}01$.
`,
        hint: md`Te same osoby → różnice $d = \text{przed}-\text{po}$, $t_{0{,}99;7} = 2{,}998$.`,
        solution: md`
$d_i$: 17, −3, 25, 11, 17, 5, 22, 6; $\bar d = 12{,}5$, $s_d\approx9{,}47$.
$H_0:\ \mu_D=0$, $H_1:\ \mu_D>0$; $t = \frac{12{,}5}{9{,}47}\sqrt8\approx3{,}73$; $C = [2{,}998;\infty)$.
$3{,}73\in C$ → **odrzucamy $H_0$**: kawa skraca średni czas reakcji ($\alpha=0{,}01$).
`,
        answer: md`$t\approx3{,}73\ge2{,}998$ → odrzucamy $H_0$.`
      },
      {
        id: 'e4', tag: 'C13', title: 'Szybkość pisania przed i po kursie (sparowane)',
        text: md`
Szybkość pisania (słowa/min) 7 osób przed i po kursie:

| osoba | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---:|---:|---:|---:|---:|---:|---:|
| przed | 42 | 55 | 38 | 61 | 47 | 50 | 44 |
| po | 48 | 54 | 45 | 66 | 52 | 49 | 51 |

Czy kurs poprawia szybkość pisania? $\alpha = 0{,}05$, rozkład różnic normalny.
`,
        hint: md`$d = \text{po}-\text{przed}$, $t_{0{,}95;6} = 1{,}943$.`,
        solution: md`
$d_i$: 6, −1, 7, 5, 5, −1, 7; $\bar d = 4$, $s_d\approx3{,}51$.
$H_0:\ \mu_D = 0$, $H_1:\ \mu_D>0$; $t = \frac{4}{3{,}51}\sqrt7\approx3{,}01$; $C = [1{,}943;\infty)$.
$3{,}01\in C$ → **odrzucamy $H_0$**: kurs poprawia szybkość pisania.
`,
        answer: md`$t\approx3{,}01\ge1{,}943$ → odrzucamy $H_0$.`
      },
      {
        id: 'e5', tag: 'C13', title: 'Test A/B strony (dwie proporcje)',
        text: md`
Wersja A strony: 180 zakupów na 400 odwiedzin; wersja B: 150 na 400. Czy na poziomie 0,01 można twierdzić, że wersja A ma **wyższą** konwersję? A na poziomie 0,05?
`,
        hint: md`$\hat p = \frac{330}{800}$. $z_{0{,}99} = 2{,}326$, $z_{0{,}95} = 1{,}645$.`,
        solution: md`
$\hat p_A = 0{,}45$, $\hat p_B = 0{,}375$, $\hat p = 0{,}4125$.
$z = \frac{0{,}075}{\sqrt{0{,}4125\cdot0{,}5875\cdot(1/400+1/400)}}\approx\frac{0{,}075}{0{,}0348}\approx2{,}15$.
- $\alpha = 0{,}01$: $C = [2{,}326;\infty)$, $2{,}15\notin C$ → **brak podstaw** do odrzucenia $H_0$.
- $\alpha = 0{,}05$: $C = [1{,}645;\infty)$, $2{,}15\in C$ → odrzucamy $H_0$.

Wniosek zależy od przyjętego $\alpha$ — dlatego poziom istotności ustala się **przed** badaniem.
`,
        answer: md`$z\approx2{,}15$: przy 0,01 brak podstaw do odrzucenia; przy 0,05 — A lepsza.`
      },
      {
        id: 'e6', tag: 'C13', title: 'Zgłoszenia błędów w dni tygodnia (zgodność)',
        text: md`
W ciągu kwartału zarejestrowano 150 zgłoszeń błędów: poniedziałek 36, wtorek 28, środa 25, czwartek 27, piątek 34. Czy można przyjąć, że zgłoszenia rozkładają się **równomiernie** na dni robocze? $\alpha = 0{,}05$.
`,
        hint: md`Przy $H_0$ każdego dnia oczekujemy $150/5 = 30$ zgłoszeń; 4 stopnie swobody.`,
        solution: md`
$\chi^2 = \frac{36+4+25+9+16}{30} = \frac{90}{30} = 3{,}0$ (liczniki to kwadraty odchyleń: $6^2, 2^2, 5^2, 3^2, 4^2$).
$\chi^2_{0{,}95;4} = 9{,}488$; $3{,}0<9{,}488$ → **brak podstaw do odrzucenia $H_0$**: dane zgodne z równomiernym rozkładem.
`,
        answer: md`$\chi^2 = 3{,}0<9{,}49$ → brak podstaw do odrzucenia $H_0$.`
      },
      {
        id: 'e7', tag: 'C13', title: 'Udziały przeglądarek (zgodność)',
        text: md`
Hipoteza: udziały przeglądarek wynoszą Chrome 65%, Safari 18%, Firefox 7%, inne 10%. W losowej próbie 300 użytkowników: 180, 66, 18, 36. Zweryfikuj hipotezę na poziomie 0,01.
`,
        hint: md`Oczekiwane: 195, 54, 21, 30 (wszystkie ≥ 5). 3 stopnie swobody.`,
        solution: md`
$\chi^2 = \frac{15^2}{195}+\frac{12^2}{54}+\frac{3^2}{21}+\frac{6^2}{30}\approx1{,}15+2{,}67+0{,}43+1{,}20 = 5{,}45$.
$\chi^2_{0{,}99;3} = 11{,}345$; $5{,}45<11{,}345$ → **brak podstaw do odrzucenia $H_0$**.
`,
        answer: md`$\chi^2\approx5{,}45<11{,}35$ → brak podstaw do odrzucenia $H_0$.`
      },
      {
        id: 'e8', tag: 'C15', title: 'System operacyjny a kierunek studiów (niezależność 2×2)',
        text: md`
Zapytano 220 studentów o preferowany system:

| | Windows | macOS |
|---|---:|---:|
| informatyka | 78 | 42 |
| grafika | 35 | 65 |

Czy wybór systemu zależy od kierunku? $\alpha = 0{,}01$.
`,
        hint: md`Sumy wierszy 120 i 100, kolumn 113 i 107. 1 stopień swobody, $\chi^2_{0{,}99;1} = 6{,}635$.`,
        solution: md`
Oczekiwane: $\frac{120\cdot113}{220}\approx61{,}64$; $58{,}36$; $51{,}36$; $48{,}64$.
$\chi^2 = \frac{16{,}36^2}{61{,}64}+\frac{16{,}36^2}{58{,}36}+\frac{16{,}36^2}{51{,}36}+\frac{16{,}36^2}{48{,}64}\approx4{,}34+4{,}59+5{,}21+5{,}50 = 19{,}65$.
(Skrót 2×2: $\frac{220\cdot(78\cdot65-42\cdot35)^2}{120\cdot100\cdot113\cdot107} = 19{,}65$ ✓.)
$19{,}65\ge6{,}635$ → **odrzucamy $H_0$**: wybór systemu zależy od kierunku.
`,
        answer: md`$\chi^2\approx19{,}65\ge6{,}635$ → cechy zależne.`
      },
      {
        id: 'e9', tag: 'C15', title: 'Sport a jakość snu (niezależność 2×3)',
        text: md`
Ankieta wśród 300 osób:

| sen \ sport | wcale | 1–2 razy/tydz. | ≥ 3 razy/tydz. |
|---|---:|---:|---:|
| dobry | 40 | 70 | 60 |
| zły | 60 | 45 | 25 |

Czy jakość snu zależy od częstości uprawiania sportu? $\alpha = 0{,}05$.
`,
        hint: md`$(2-1)(3-1) = 2$ stopnie swobody, $\chi^2_{0{,}95;2} = 5{,}991$.`,
        solution: md`
Sumy: wiersze 170 i 130; kolumny 100, 115, 85; $n = 300$.
Oczekiwane: dobry — 56,67; 65,17; 48,17; zły — 43,33; 49,83; 36,83 (wszystkie ≥ 5).
$\chi^2\approx4{,}90+0{,}36+2{,}91+6{,}41+0{,}47+3{,}80\approx18{,}85$.
$18{,}85\ge5{,}991$ → **odrzucamy $H_0$**: jakość snu zależy od aktywności fizycznej (w próbie: im więcej sportu, tym lepszy sen).
`,
        answer: md`$\chi^2\approx18{,}85\ge5{,}99$ → cechy zależne.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'We compare **two groups**: means, “before and after” data, proportions. Then two chi-square tests: **goodness of fit** (do the data match an assumed distribution) and **independence** (are two features related).',
    lecture: md`
# Two means — which model?

We have two **independent** samples: $X_1,\dots,X_{n_1}$ from population 1 and $Y_1,\dots,Y_{n_2}$ from population 2. We test $H_0:\ \mu_1 = \mu_2$ (i.e. $\mu_1-\mu_2 = 0$). {lecture:W10}

::: intuition
We ask: is the difference of sample means $\bar x-\bar y$ “large” compared with what it could be by chance? The denominator of the statistic is exactly the **typical random spread** of that difference.
:::

## Model 5: normal distributions, known variances

::: formula W10 | Z test for two means (σ₁, σ₂ known)
$$Z = \frac{\bar X-\bar Y}{\sqrt{\dfrac{\sigma_1^2}{n_1}+\dfrac{\sigma_2^2}{n_2}}}\ \sim N(0,1)\ \text{under } H_0$$
Critical regions as for one mean: $[z_{1-\alpha};\infty)$, $(-\infty;-z_{1-\alpha}]$ or $|z|\ge z_{1-\alpha/2}$.
:::

::: example W10 | Europeans and Americans
The mean weight of 15 Europeans $\bar x = 154$ lb, of 18 Americans $\bar y = 162$; $\sigma_1^2 = 100$, $\sigma_2^2 = 169$. Do the mean weights differ ($\alpha = 0.05$)?
$H_0:\ \mu_1=\mu_2$, $H_1:\ \mu_1\ne\mu_2$; $z = \frac{154-162}{\sqrt{100/15+169/18}}\approx\frac{-8}{4.01} = -2$; $|z| = 2\ge1.96$ → **reject $H_0$**: the mean weights differ (the data suggest Americans weigh more).
:::

## Model 6: normal distributions, unknown but equal variances

We pool both samples to estimate the common variance:

::: formula W10 | t test for two means (σ₁ = σ₂ unknown)
$$S_p^2 = \frac{(n_1-1)S_1^2+(n_2-1)S_2^2}{n_1+n_2-2},\qquad T = \frac{\bar X-\bar Y}{S_p\sqrt{\dfrac1{n_1}+\dfrac1{n_2}}}\ \sim t_{n_1+n_2-2}$$
:::

::: example W10 | Transistors
Charge storage time: old technology $\bar x = 6.6$ ns, new $\bar y = 6.3$ ns, 50 items each, $s_p = 0.5$. $H_1:\ \mu_1>\mu_2$ (the new one reduced the time).
$t = \frac{6.6-6.3}{0.5\sqrt{1/50+1/50}} = 3.0$; $t_{0.95;98}\approx1.66$ → **reject $H_0$**: the new technology shortened the time.
:::

::: note | Model 7: large samples, any distributions
For $n_1, n_2\ge100$ (formula sheet): $Z = \dfrac{\bar X-\bar Y}{\sqrt{S_1^2/n_1+S_2^2/n_2}}\approx N(0,1)$.
:::

::: warn own | Independent or paired?
**Two different groups** of people/objects (e.g. employees in 2021 and other ones in 2022) → models 5–7. **The same objects** measured twice (before/after) → the **paired test** (model 9 from topic 10): compute differences $d_i$ and a t test for $\mu_D$. Mixing these up is one of the most common mistakes!
:::

# Two proportions

::: formula W10 | Test for a difference of proportions (model 11)
$K_1$, $K_2$ — numbers of “successes” in samples of sizes $n_1$, $n_2$. $\hat p_1 = \frac{K_1}{n_1}$, $\hat p_2 = \frac{K_2}{n_2}$, and under $H_0:\ p_1=p_2$ the pooled $\hat p = \frac{K_1+K_2}{n_1+n_2}$:
$$Z = \frac{\hat p_1-\hat p_2}{\sqrt{\hat p(1-\hat p)\left(\dfrac1{n_1}+\dfrac1{n_2}\right)}}\ \approx N(0,1)$$
Condition: $n_i\hat p_i\ge5$, $n_i(1-\hat p_i)\ge5$.
:::

::: example W10 | Monitor failures
Company A: 10 of 200 monitors needed repair; company B: 12 of 150. Is A less failure-prone? $\alpha = 0.06$.
$\hat p_1 = 0.05$, $\hat p_2 = 0.08$, $\hat p = \frac{22}{350}\approx0.063$; $z\approx-1.14$; $C = (-\infty;-z_{0.94}] = (-\infty;-1.55]$.
$-1.14\notin C$ → **no grounds to reject $H_0$**: we cannot claim A’s monitors fail less often.
:::

# Chi-square goodness-of-fit test

A feature has $k$ categories. The hypothesis states their probabilities: $H_0:\ P(X=c_i) = p_i$, $i=1..k$. In a sample of size $n$ we observe counts $N_1,\dots,N_k$; under $H_0$ we **expect** $np_1,\dots,np_k$. {lecture:W10}

::: formula W10 | Pearson’s χ² goodness-of-fit test
$$\chi^2 = \sum_{i=1}^{k}\frac{(N_i - np_i)^2}{np_i}\ \approx\chi^2_{k-1}\ \text{under } H_0$$
Critical region (always **right-sided** — large deviations contradict $H_0$): $C = [\chi^2_{1-\alpha,\,k-1};\ \infty)$.
Condition: all expected counts $np_i\ge5$; otherwise **merge** a class with a neighbour (and reduce $k$).
:::

::: intuition
“Observed minus expected, squared, divided by expected” measures how far reality is from the hypothesis. Zero = a perfect fit. The larger it is, the harder it is to believe $H_0$.
:::

::: example W10 | Blood groups
Conjecture: A — 40%, B — 20%, AB — 10%, 0 — 30%. Among 400 people: 148, 96, 50, 106. $\alpha = 0.05$.

| group | $N_i$ | $np_i$ | $(N_i-np_i)^2/np_i$ |
|---|---:|---:|---:|
| A | 148 | 160 | 0.90 |
| B | 96 | 80 | 3.20 |
| AB | 50 | 40 | 2.50 |
| 0 | 106 | 120 | 1.63 |
| **sum** | 400 | 400 | **8.23** |

$k-1 = 3$, $\chi^2_{0.95;3} = 7.81$; $8.23\ge7.81$ → **reject $H_0$**: the blood-group distribution differs from the assumed one.
:::

@chart groups

@chart chiFit

# Chi-square test of independence

Two qualitative features $X$ (k categories) and $Y$ (r categories). The data form a **contingency table** $n_{ij}$ with row sums $n_{i\cdot}$ and column sums $n_{\cdot j}$. $H_0$: the features are **independent**.

::: formula W10 | χ² test of independence
Expected counts under independence: $\hat n_{ij} = \dfrac{n_{i\cdot}\,n_{\cdot j}}{n}$ (“row sum × column sum / total”).
$$\chi^2 = \sum_{i=1}^{k}\sum_{j=1}^{r}\frac{(n_{ij}-\hat n_{ij})^2}{\hat n_{ij}}\ \approx\chi^2_{(k-1)(r-1)},\qquad C = [\chi^2_{1-\alpha,\,(k-1)(r-1)};\ \infty)$$
Condition: all $\hat n_{ij}\ge5$.
:::

::: example W10 | Exam results and faculty
| faculty | passed | failed | total |
|---|---:|---:|---:|
| A | 350 | 50 | 400 |
| B | 450 | 150 | 600 |
| C | 200 | 100 | 300 |
| **total** | 1000 | 300 | 1300 |

E.g. $\hat n_{A,\text{passed}} = \frac{400\cdot1000}{1300}\approx307.7$. Summing the 6 terms gives $\chi^2\approx44.2$. Degrees of freedom $(3-1)(2-1) = 2$, $\chi^2_{0.99;2} = 9.21$ → $44.2\in C$ → **reject $H_0$**: the exam result depends on the faculty ($\alpha = 0.01$).
:::

::: steps | Test of independence — procedure
1. Add row sums, column sums and $n$.
2. For each cell: $\hat n_{ij} = n_{i\cdot}n_{\cdot j}/n$ (check it is ≥ 5).
3. For each cell: $(n_{ij}-\hat n_{ij})^2/\hat n_{ij}$; add up.
4. Degrees of freedom $(k-1)(r-1)$; quantile $\chi^2_{1-\alpha}$.
5. $\chi^2\ge$ quantile → the features are **dependent**; otherwise no grounds to reject independence.
:::

::: tip own | A 2×2 table
For the table $\begin{smallmatrix}a&b\\c&d\end{smallmatrix}$ there is a shortcut: $\chi^2 = \dfrac{n(ad-bc)^2}{(a+b)(c+d)(a+c)(b+d)}$, 1 degree of freedom. A good way to check your result.
:::

# In Excel

~~~excel Two means and chi-square
A1: =T.TEST(B2:B10,C2:C12,1,2)      // p-value: two-sample t, one-tailed, equal variances
A2: =T.TEST(B2:B9,C2:C9,1,1)        // p-value: paired data
A3: =T.TEST(B2:B10,C2:C12,2,3)      // two-tailed, unequal variances (Welch)
A4: =CHISQ.TEST(B15:E15,B16:E16)    // p-value of the goodness-of-fit test (observed, expected)
A5: =CHISQ.INV.RT(0.05,3)           // quantile χ²_{0.95; 3} = 7.81
F2: =$D2*B$5/$D$5                   // expected count in a contingency table (row sum × column sum / n)
~~~

~~~python scipy: two samples and χ² tests
import numpy as np
from scipy import stats

before = np.array([312, 298, 335, 301, 322, 289, 340, 315])
after  = np.array([295, 301, 310, 290, 305, 284, 318, 309])
print(stats.ttest_rel(before, after, alternative='greater'))     # paired data

print(stats.chisquare([148, 96, 50, 106], f_exp=[160, 80, 40, 120]))   # goodness of fit: χ² = 8.23

table = np.array([[350, 50], [450, 150], [200, 100]])
chi2, p, dof, expected = stats.chi2_contingency(table, correction=False)
print(chi2, p, dof)                                              # 44.2, p ≈ 2.5e-10, 2
~~~

::: warn own
‹chi2_contingency› applies Yates’ correction to 2×2 tables by default (‹correction=True›) — in class we compute **without** it, so set ‹correction=False›.
:::

::: summary
- Two means: σ known → $Z$ (model 5); equal unknown σ → $T$ with $S_p$, $n_1+n_2-2$ df (model 6); large samples → $Z$ with $S_1,S_2$ (model 7).
- The same objects twice → paired data (t test on differences).
- Two proportions: $Z$ with the pooled $\hat p = \frac{K_1+K_2}{n_1+n_2}$.
- χ² goodness of fit: $\sum\frac{(N_i-np_i)^2}{np_i}$, $k-1$ df, expected ≥ 5.
- χ² independence: $\hat n_{ij} = \frac{n_{i\cdot}n_{\cdot j}}{n}$, $(k-1)(r-1)$ df; the critical region is always right-sided.
:::
`,

    cheatsheet: md`
## Two means (independent samples), $H_0:\ \mu_1=\mu_2$
| model | statistic | distribution |
|---|---|---|
| 5: normal, σ known | $\frac{\bar x-\bar y}{\sqrt{\sigma_1^2/n_1+\sigma_2^2/n_2}}$ | $N(0,1)$ |
| 6: normal, σ₁=σ₂ unknown | $\frac{\bar x-\bar y}{s_p\sqrt{1/n_1+1/n_2}}$ | $t_{n_1+n_2-2}$ |
| 7: large samples | $\frac{\bar x-\bar y}{\sqrt{s_1^2/n_1+s_2^2/n_2}}$ | ≈ $N(0,1)$ |

$s_p^2=\frac{(n_1-1)s_1^2+(n_2-1)s_2^2}{n_1+n_2-2}$

## Paired (before/after)
$d_i = x_i - y_i$ → $t=\frac{\bar d}{s_d}\sqrt n$, $t_{n-1}$

## Two proportions
$\hat p=\frac{K_1+K_2}{n_1+n_2}$ · $z=\frac{\hat p_1-\hat p_2}{\sqrt{\hat p(1-\hat p)(1/n_1+1/n_2)}}$

## Chi-square (always right-sided: $\chi^2\ge\chi^2_{1-\alpha}$ → reject)
- **goodness of fit**: $\sum\frac{(N_i-np_i)^2}{np_i}$, df $k-1$
- **independence**: $\hat n_{ij}=\frac{n_{i\cdot}n_{\cdot j}}{n}$, $\sum\frac{(n_{ij}-\hat n_{ij})^2}{\hat n_{ij}}$, df $(k-1)(r-1)$
- 2×2: $\chi^2=\frac{n(ad-bc)^2}{(a+b)(c+d)(a+c)(b+d)}$
- expected < 5 → merge classes

## χ² quantiles (0.95 / 0.99)
1 df: 3.841 / 6.635 · 2: 5.991 / 9.210 · 3: 7.815 / 11.345 · 4: 9.488 / 13.277 · 5: 11.070 / 15.086

## Excel
‹T.TEST(r1,r2,tails,type)› (type 1 = paired, 2 = equal σ, 3 = unequal) · ‹CHISQ.TEST(obs,exp)› · ‹CHISQ.INV.RT(α,df)›
`,

    exercises: [
      {
        id: 'e1', tag: 'C13', title: 'Two support teams (equal variances)',
        text: md`
Team A closes on average 52 tickets per week ($n_1 = 9$ weeks, $s_1 = 6$), team B — 58 tickets ($n_2 = 11$ weeks, $s_2 = 7$). Assume normal distributions with equal variances. At level 0.05, can we conclude that team B closes **more** tickets on average?
`,
        hint: md`Model 6: $s_p^2$, $t_{0.95;18} = 1.734$. $H_1:\ \mu_A<\mu_B$.`,
        solution: md`
$H_0:\ \mu_A=\mu_B$, $H_1:\ \mu_A<\mu_B$.
$s_p^2 = \frac{8\cdot36+10\cdot49}{18}\approx43.22$, $s_p\approx6.574$.
$t = \frac{52-58}{6.574\sqrt{1/9+1/11}}\approx-2.03$; $C = (-\infty;-1.734]$.
$-2.03\in C$ → **reject $H_0$**: team B closes more tickets on average ($\alpha = 0.05$).
`,
        answer: md`$t\approx-2.03\le-1.734$ → reject $H_0$.`
      },
      {
        id: 'e2', tag: 'C13', title: 'Two battery brands (σ known)',
        text: md`
Battery life (h) of two brands; the standard deviations are known: $\sigma_A = 3$, $\sigma_B = 4$, normal distributions.

| brand | times |
|---|---|
| A | 31.2; 28.4; 33.1; 29.8; 32.5; 30.6 |
| B | 26.9; 30.2; 24.8; 28.1; 27.5; 25.3; 29.0 |

Do A batteries last **longer** on average? $\alpha = 0.05$.
`,
        hint: md`Model 5: $z = \frac{\bar x_A-\bar x_B}{\sqrt{9/6+16/7}}$.`,
        solution: md`
$\bar x_A\approx30.93$, $\bar x_B = 27.40$. $H_1:\ \mu_A>\mu_B$; $z\approx\frac{3.53}{1.946}\approx1.82$; $C = [1.645;\infty)$.
$1.82\in C$ → **reject $H_0$**: A batteries last longer on average.
`,
        answer: md`$z\approx1.82\ge1.645$ → reject $H_0$.`
      },
      {
        id: 'e3', tag: 'C13', title: 'Reaction time before and after coffee (paired)',
        text: md`
The reaction time (ms) of 8 people was measured before and after drinking coffee:

| person | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| before | 312 | 298 | 335 | 301 | 322 | 289 | 340 | 315 |
| after | 295 | 301 | 310 | 290 | 305 | 284 | 318 | 309 |

Assume the differences are normal. Does coffee shorten the reaction time? $\alpha = 0.01$.
`,
        hint: md`The same people → differences $d = \text{before}-\text{after}$, $t_{0.99;7} = 2.998$.`,
        solution: md`
$d_i$: 17, −3, 25, 11, 17, 5, 22, 6; $\bar d = 12.5$, $s_d\approx9.47$.
$H_1:\ \mu_D>0$; $t = \frac{12.5}{9.47}\sqrt8\approx3.73$; $C = [2.998;\infty)$ → **reject $H_0$**: coffee shortens the mean reaction time.
`,
        answer: md`$t\approx3.73\ge2.998$ → reject $H_0$.`
      },
      {
        id: 'e4', tag: 'C13', title: 'Typing speed before and after a course (paired)',
        text: md`
Typing speed (words/min) of 7 people before and after a course:

| person | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---:|---:|---:|---:|---:|---:|---:|
| before | 42 | 55 | 38 | 61 | 47 | 50 | 44 |
| after | 48 | 54 | 45 | 66 | 52 | 49 | 51 |

Does the course improve typing speed? $\alpha = 0.05$, differences normal.
`,
        hint: md`$d = \text{after}-\text{before}$, $t_{0.95;6} = 1.943$.`,
        solution: md`
$d_i$: 6, −1, 7, 5, 5, −1, 7; $\bar d = 4$, $s_d\approx3.51$; $t = \frac{4}{3.51}\sqrt7\approx3.01$; $C = [1.943;\infty)$ → **reject $H_0$**: the course improves typing speed.
`,
        answer: md`$t\approx3.01\ge1.943$ → reject $H_0$.`
      },
      {
        id: 'e5', tag: 'C13', title: 'An A/B test of a website (two proportions)',
        text: md`
Page version A: 180 purchases from 400 visits; version B: 150 from 400. At level 0.01, can we claim that A has a **higher** conversion rate? And at 0.05?
`,
        hint: md`$\hat p = \frac{330}{800}$. $z_{0.99} = 2.326$, $z_{0.95} = 1.645$.`,
        solution: md`
$\hat p_A = 0.45$, $\hat p_B = 0.375$, $\hat p = 0.4125$; $z\approx\frac{0.075}{0.0348}\approx2.15$.
- $\alpha = 0.01$: $2.15<2.326$ → **no grounds** to reject $H_0$.
- $\alpha = 0.05$: $2.15\ge1.645$ → reject $H_0$.

The conclusion depends on $\alpha$ — that is why the significance level is fixed **before** the study.
`,
        answer: md`$z\approx2.15$: at 0.01 no grounds to reject; at 0.05 — A is better.`
      },
      {
        id: 'e6', tag: 'C13', title: 'Bug reports by weekday (goodness of fit)',
        text: md`
In a quarter 150 bug reports were registered: Monday 36, Tuesday 28, Wednesday 25, Thursday 27, Friday 34. Can we assume the reports are **uniformly** spread over working days? $\alpha = 0.05$.
`,
        hint: md`Under $H_0$ we expect $150/5 = 30$ reports per day; 4 degrees of freedom.`,
        solution: md`
$\chi^2 = \frac{36+4+25+9+16}{30} = 3.0$. $\chi^2_{0.95;4} = 9.488$; $3.0<9.488$ → **no grounds to reject $H_0$**: consistent with a uniform distribution.
`,
        answer: md`$\chi^2 = 3.0<9.49$ → no grounds to reject $H_0$.`
      },
      {
        id: 'e7', tag: 'C13', title: 'Browser market shares (goodness of fit)',
        text: md`
Hypothesis: browser shares are Chrome 65%, Safari 18%, Firefox 7%, others 10%. In a random sample of 300 users: 180, 66, 18, 36. Test the hypothesis at level 0.01.
`,
        hint: md`Expected: 195, 54, 21, 30 (all ≥ 5). 3 degrees of freedom.`,
        solution: md`
$\chi^2\approx1.15+2.67+0.43+1.20 = 5.45$; $\chi^2_{0.99;3} = 11.345$ → **no grounds to reject $H_0$**.
`,
        answer: md`$\chi^2\approx5.45<11.35$ → no grounds to reject $H_0$.`
      },
      {
        id: 'e8', tag: 'C15', title: 'Operating system and field of study (2×2 independence)',
        text: md`
220 students were asked about their preferred system:

| | Windows | macOS |
|---|---:|---:|
| computer science | 78 | 42 |
| graphic design | 35 | 65 |

Does the choice of system depend on the field? $\alpha = 0.01$.
`,
        hint: md`Row sums 120 and 100, column sums 113 and 107. 1 df, $\chi^2_{0.99;1} = 6.635$.`,
        solution: md`
Expected: 61.64; 58.36; 51.36; 48.64. $\chi^2\approx4.34+4.59+5.21+5.50 = 19.65$ (2×2 shortcut: $\frac{220\cdot(78\cdot65-42\cdot35)^2}{120\cdot100\cdot113\cdot107} = 19.65$ ✓).
$19.65\ge6.635$ → **reject $H_0$**: the choice of system depends on the field.
`,
        answer: md`$\chi^2\approx19.65\ge6.635$ → dependent.`
      },
      {
        id: 'e9', tag: 'C15', title: 'Sport and sleep quality (2×3 independence)',
        text: md`
A survey of 300 people:

| sleep \ sport | never | 1–2 times/week | ≥ 3 times/week |
|---|---:|---:|---:|
| good | 40 | 70 | 60 |
| poor | 60 | 45 | 25 |

Does sleep quality depend on how often people do sport? $\alpha = 0.05$.
`,
        hint: md`$(2-1)(3-1) = 2$ df, $\chi^2_{0.95;2} = 5.991$.`,
        solution: md`
Sums: rows 170 and 130; columns 100, 115, 85; $n = 300$. Expected: good — 56.67; 65.17; 48.17; poor — 43.33; 49.83; 36.83.
$\chi^2\approx18.85\ge5.991$ → **reject $H_0$**: sleep quality depends on physical activity (in the sample: more sport, better sleep).
`,
        answer: md`$\chi^2\approx18.85\ge5.99$ → dependent.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'Сравниваем **две группы**: средние, данные «до и после», доли. Затем два теста хи-квадрат: **согласия** (подходят ли данные к предполагаемому распределению) и **независимости** (связаны ли два признака).',
    lecture: md`
# Два средних — какая модель?

Есть две **независимые** выборки: $X_1,\dots,X_{n_1}$ из совокупности 1 и $Y_1,\dots,Y_{n_2}$ из совокупности 2. Проверяем $H_0:\ \mu_1 = \mu_2$ (т.е. $\mu_1-\mu_2 = 0$). {lecture:W10}

::: intuition
Спрашиваем: «велика» ли разность выборочных средних $\bar x-\bar y$ по сравнению с тем, какой она могла бы быть случайно? Знаменатель статистики — это как раз **типичный случайный разброс** этой разности.
:::

## Модель 5: нормальные распределения, дисперсии известны

::: formula W10 | Z-тест для двух средних (σ₁, σ₂ известны)
$$Z = \frac{\bar X-\bar Y}{\sqrt{\dfrac{\sigma_1^2}{n_1}+\dfrac{\sigma_2^2}{n_2}}}\ \sim N(0,1)\ \text{при } H_0$$
Критические области как в тесте для одного среднего: $[z_{1-\alpha};\infty)$, $(-\infty;-z_{1-\alpha}]$ или $|z|\ge z_{1-\alpha/2}$.
:::

::: example W10 | Европейцы и американцы
Средний вес 15 европейцев $\bar x = 154$ фунта, 18 американцев $\bar y = 162$; $\sigma_1^2 = 100$, $\sigma_2^2 = 169$. Различаются ли средние веса ($\alpha = 0{,}05$)?
$H_0:\ \mu_1=\mu_2$, $H_1:\ \mu_1\ne\mu_2$; $z = \frac{154-162}{\sqrt{100/15+169/18}}\approx\frac{-8}{4{,}01} = -2$; $|z| = 2\ge1{,}96$ → **отвергаем $H_0$**: средние веса различаются (данные говорят, что американцы тяжелее).
:::

## Модель 6: нормальные распределения, дисперсии неизвестны, но равны

Объединяем выборки, чтобы оценить общую дисперсию:

::: formula W10 | t-тест для двух средних (σ₁ = σ₂ неизвестны)
$$S_p^2 = \frac{(n_1-1)S_1^2+(n_2-1)S_2^2}{n_1+n_2-2},\qquad T = \frac{\bar X-\bar Y}{S_p\sqrt{\dfrac1{n_1}+\dfrac1{n_2}}}\ \sim t_{n_1+n_2-2}$$
:::

::: example W10 | Транзисторы
Время хранения заряда: старая технология $\bar x = 6{,}6$ нс, новая $\bar y = 6{,}3$ нс, по 50 элементов, $s_p = 0{,}5$. $H_1:\ \mu_1>\mu_2$ (новая уменьшила время).
$t = \frac{6{,}6-6{,}3}{0{,}5\sqrt{1/50+1/50}} = 3{,}0$; $t_{0{,}95;98}\approx1{,}66$ → **отвергаем $H_0$**: новая технология сократила время.
:::

::: note | Модель 7: большие выборки, любые распределения
При $n_1, n_2\ge100$ (лист формул): $Z = \dfrac{\bar X-\bar Y}{\sqrt{S_1^2/n_1+S_2^2/n_2}}\approx N(0,1)$.
:::

::: warn own | Независимые или парные?
**Две разные группы** людей/объектов (например, сотрудники в 2021 и другие в 2022) → модели 5–7. **Одни и те же объекты**, измеренные дважды (до/после) → **тест для парных данных** (модель 9 из темы 10): разности $d_i$ и t-тест для $\mu_D$. Путать эти ситуации — одна из самых частых ошибок!
:::

# Две доли

::: formula W10 | Тест для разности долей (модель 11)
$K_1$, $K_2$ — числа «успехов» в выборках объёмов $n_1$, $n_2$. $\hat p_1 = \frac{K_1}{n_1}$, $\hat p_2 = \frac{K_2}{n_2}$, а при $H_0:\ p_1=p_2$ общая $\hat p = \frac{K_1+K_2}{n_1+n_2}$:
$$Z = \frac{\hat p_1-\hat p_2}{\sqrt{\hat p(1-\hat p)\left(\dfrac1{n_1}+\dfrac1{n_2}\right)}}\ \approx N(0,1)$$
Условие: $n_i\hat p_i\ge5$, $n_i(1-\hat p_i)\ge5$.
:::

::: example W10 | Надёжность мониторов
Фирма A: 10 из 200 мониторов потребовали ремонта; фирма B: 12 из 150. Реже ли ломаются мониторы A? $\alpha = 0{,}06$.
$\hat p_1 = 0{,}05$, $\hat p_2 = 0{,}08$, $\hat p = \frac{22}{350}\approx0{,}063$; $z\approx-1{,}14$; $C = (-\infty;-z_{0{,}94}] = (-\infty;-1{,}55]$.
$-1{,}14\notin C$ → **нет оснований отвергнуть $H_0$**: нельзя утверждать, что мониторы A ломаются реже.
:::

# Критерий согласия хи-квадрат

Признак принимает $k$ категорий. Гипотеза задаёт их вероятности: $H_0:\ P(X=c_i) = p_i$, $i=1..k$. В выборке объёма $n$ наблюдаем частоты $N_1,\dots,N_k$; при $H_0$ **ожидаем** $np_1,\dots,np_k$. {lecture:W10}

::: formula W10 | Критерий согласия χ² Пирсона
$$\chi^2 = \sum_{i=1}^{k}\frac{(N_i - np_i)^2}{np_i}\ \approx\chi^2_{k-1}\ \text{при } H_0$$
Критическая область (всегда **правосторонняя** — большие отклонения противоречат $H_0$): $C = [\chi^2_{1-\alpha,\,k-1};\ \infty)$.
Условие: все ожидаемые частоты $np_i\ge5$; иначе **объединяем** класс с соседним (и уменьшаем $k$).
:::

::: intuition
«Наблюдаемое минус ожидаемое, в квадрате, делённое на ожидаемое» — мера того, насколько реальность отличается от гипотезы. Ноль — идеальное согласие. Чем больше число, тем труднее верить в $H_0$.
:::

::: example W10 | Группы крови
Предположение: A — 40%, B — 20%, AB — 10%, 0 — 30%. Среди 400 человек: 148, 96, 50, 106. $\alpha = 0{,}05$.

| группа | $N_i$ | $np_i$ | $(N_i-np_i)^2/np_i$ |
|---|---:|---:|---:|
| A | 148 | 160 | 0,90 |
| B | 96 | 80 | 3,20 |
| AB | 50 | 40 | 2,50 |
| 0 | 106 | 120 | 1,63 |
| **сумма** | 400 | 400 | **8,23** |

$k-1 = 3$, $\chi^2_{0{,}95;3} = 7{,}81$; $8{,}23\ge7{,}81$ → **отвергаем $H_0$**: распределение групп крови отличается от предполагаемого.
:::

@chart groups

@chart chiFit

# Критерий независимости хи-квадрат

Два качественных признака $X$ (k категорий) и $Y$ (r категорий). Данные — **таблица сопряжённости** $n_{ij}$ с суммами строк $n_{i\cdot}$ и столбцов $n_{\cdot j}$. $H_0$: признаки **независимы**.

::: formula W10 | Критерий независимости χ²
Ожидаемые частоты при независимости: $\hat n_{ij} = \dfrac{n_{i\cdot}\,n_{\cdot j}}{n}$ («сумма строки × сумма столбца / всего»).
$$\chi^2 = \sum_{i=1}^{k}\sum_{j=1}^{r}\frac{(n_{ij}-\hat n_{ij})^2}{\hat n_{ij}}\ \approx\chi^2_{(k-1)(r-1)},\qquad C = [\chi^2_{1-\alpha,\,(k-1)(r-1)};\ \infty)$$
Условие: все $\hat n_{ij}\ge5$.
:::

::: example W10 | Результат экзамена и факультет
| факультет | сдал | не сдал | всего |
|---|---:|---:|---:|
| A | 350 | 50 | 400 |
| B | 450 | 150 | 600 |
| C | 200 | 100 | 300 |
| **всего** | 1000 | 300 | 1300 |

Например, $\hat n_{A,\text{сдал}} = \frac{400\cdot1000}{1300}\approx307{,}7$. Сумма 6 слагаемых даёт $\chi^2\approx44{,}2$. Степени свободы $(3-1)(2-1) = 2$, $\chi^2_{0{,}99;2} = 9{,}21$ → $44{,}2\in C$ → **отвергаем $H_0$**: результат экзамена зависит от факультета ($\alpha = 0{,}01$).
:::

::: steps | Критерий независимости — процедура
1. Допишите суммы строк, столбцов и $n$.
2. Для каждой клетки: $\hat n_{ij} = n_{i\cdot}n_{\cdot j}/n$ (проверьте, что ≥ 5).
3. Для каждой клетки: $(n_{ij}-\hat n_{ij})^2/\hat n_{ij}$; сложите.
4. Степени свободы $(k-1)(r-1)$; квантиль $\chi^2_{1-\alpha}$.
5. $\chi^2\ge$ квантиля → признаки **зависимы**; иначе нет оснований отвергнуть независимость.
:::

::: tip own | Таблица 2×2
Для таблицы $\begin{smallmatrix}a&b\\c&d\end{smallmatrix}$ есть короткая формула: $\chi^2 = \dfrac{n(ad-bc)^2}{(a+b)(c+d)(a+c)(b+d)}$, 1 степень свободы. Удобно для проверки.
:::

# В Excel

~~~excel Два средних и хи-квадрат
A1: =T.TEST(B2:B10,C2:C12,1,2)      // p-значение: t для 2 выборок, односторонний, равные дисперсии
A2: =T.TEST(B2:B9,C2:C9,1,1)        // p-значение: парные данные
A3: =T.TEST(B2:B10,C2:C12,2,3)      // двусторонний, неравные дисперсии (Уэлч)
A4: =CHISQ.TEST(B15:E15,B16:E16)    // p-значение критерия согласия (наблюд., ожидаемые)
A5: =CHISQ.INV.RT(0.05,3)           // квантиль χ²_{0,95; 3} = 7,81
F2: =$D2*B$5/$D$5                   // ожидаемая частота в таблице сопряжённости
~~~

~~~python scipy: две выборки и тесты χ²
import numpy as np
from scipy import stats

before = np.array([312, 298, 335, 301, 322, 289, 340, 315])
after  = np.array([295, 301, 310, 290, 305, 284, 318, 309])
print(stats.ttest_rel(before, after, alternative='greater'))     # парные данные

print(stats.chisquare([148, 96, 50, 106], f_exp=[160, 80, 40, 120]))   # согласие: χ² = 8.23

table = np.array([[350, 50], [450, 150], [200, 100]])
chi2, p, dof, expected = stats.chi2_contingency(table, correction=False)
print(chi2, p, dof)                                              # 44.2, p ≈ 2.5e-10, 2
~~~

::: warn own
‹chi2_contingency› для таблиц 2×2 по умолчанию применяет поправку Йейтса (‹correction=True›) — на занятиях считаем **без** неё, поэтому ставьте ‹correction=False›.
:::

::: summary
- Два средних: σ известны → $Z$ (модель 5); σ равны, неизвестны → $T$ с $S_p$, $n_1+n_2-2$ ст. св. (модель 6); большие выборки → $Z$ с $S_1,S_2$ (модель 7).
- Одни и те же объекты дважды → парные данные (t-тест по разностям).
- Две доли: $Z$ с общей $\hat p = \frac{K_1+K_2}{n_1+n_2}$.
- Согласие χ²: $\sum\frac{(N_i-np_i)^2}{np_i}$, $k-1$ ст. св., ожидаемые ≥ 5.
- Независимость χ²: $\hat n_{ij} = \frac{n_{i\cdot}n_{\cdot j}}{n}$, $(k-1)(r-1)$ ст. св.; критическая область всегда правосторонняя.
:::
`,

    cheatsheet: md`
## Два средних (независимые выборки), $H_0:\ \mu_1=\mu_2$
| модель | статистика | распределение |
|---|---|---|
| 5: нормальные, σ известны | $\frac{\bar x-\bar y}{\sqrt{\sigma_1^2/n_1+\sigma_2^2/n_2}}$ | $N(0,1)$ |
| 6: нормальные, σ₁=σ₂ неизвестны | $\frac{\bar x-\bar y}{s_p\sqrt{1/n_1+1/n_2}}$ | $t_{n_1+n_2-2}$ |
| 7: большие выборки | $\frac{\bar x-\bar y}{\sqrt{s_1^2/n_1+s_2^2/n_2}}$ | ≈ $N(0,1)$ |

$s_p^2=\frac{(n_1-1)s_1^2+(n_2-1)s_2^2}{n_1+n_2-2}$

## Парные (до/после)
$d_i = x_i - y_i$ → $t=\frac{\bar d}{s_d}\sqrt n$, $t_{n-1}$

## Две доли
$\hat p=\frac{K_1+K_2}{n_1+n_2}$ · $z=\frac{\hat p_1-\hat p_2}{\sqrt{\hat p(1-\hat p)(1/n_1+1/n_2)}}$

## Хи-квадрат (всегда правосторонний: $\chi^2\ge\chi^2_{1-\alpha}$ → отвергаем)
- **согласие**: $\sum\frac{(N_i-np_i)^2}{np_i}$, ст. св. $k-1$
- **независимость**: $\hat n_{ij}=\frac{n_{i\cdot}n_{\cdot j}}{n}$, $\sum\frac{(n_{ij}-\hat n_{ij})^2}{\hat n_{ij}}$, ст. св. $(k-1)(r-1)$
- 2×2: $\chi^2=\frac{n(ad-bc)^2}{(a+b)(c+d)(a+c)(b+d)}$
- ожидаемые < 5 → объединяйте классы

## Квантили χ² (0,95 / 0,99)
1 ст.: 3,841 / 6,635 · 2: 5,991 / 9,210 · 3: 7,815 / 11,345 · 4: 9,488 / 13,277 · 5: 11,070 / 15,086

## Excel
‹T.TEST(r1,r2,хвосты,тип)› (тип 1 = парные, 2 = равные σ, 3 = разные) · ‹CHISQ.TEST(набл,ожид)› · ‹CHISQ.INV.RT(α,df)›
`,

    exercises: [
      {
        id: 'e1', tag: 'C13', title: 'Две команды поддержки (равные дисперсии)',
        text: md`
Команда A закрывает в неделю в среднем 52 заявки ($n_1 = 9$ недель, $s_1 = 6$), команда B — 58 заявок ($n_2 = 11$ недель, $s_2 = 7$). Распределения нормальные с равными дисперсиями. Можно ли на уровне 0,05 считать, что команда B закрывает в среднем **больше** заявок?
`,
        hint: md`Модель 6: $s_p^2$, $t_{0{,}95;18} = 1{,}734$. $H_1:\ \mu_A<\mu_B$.`,
        solution: md`
$H_0:\ \mu_A=\mu_B$, $H_1:\ \mu_A<\mu_B$.
$s_p^2 = \frac{8\cdot36+10\cdot49}{18}\approx43{,}22$, $s_p\approx6{,}574$.
$t = \frac{52-58}{6{,}574\sqrt{1/9+1/11}}\approx-2{,}03$; $C = (-\infty;-1{,}734]$.
$-2{,}03\in C$ → **отвергаем $H_0$**: команда B закрывает в среднем больше заявок ($\alpha = 0{,}05$).
`,
        answer: md`$t\approx-2{,}03\le-1{,}734$ → отвергаем $H_0$.`
      },
      {
        id: 'e2', tag: 'C13', title: 'Две марки батареек (σ известны)',
        text: md`
Время работы батареек (ч) двух марок; стандартные отклонения известны: $\sigma_A = 3$, $\sigma_B = 4$, распределения нормальные.

| марка | время |
|---|---|
| A | 31,2; 28,4; 33,1; 29,8; 32,5; 30,6 |
| B | 26,9; 30,2; 24,8; 28,1; 27,5; 25,3; 29,0 |

Работают ли батарейки A в среднем **дольше**? $\alpha = 0{,}05$.
`,
        hint: md`Модель 5: $z = \frac{\bar x_A-\bar x_B}{\sqrt{9/6+16/7}}$.`,
        solution: md`
$\bar x_A\approx30{,}93$, $\bar x_B = 27{,}40$. $H_1:\ \mu_A>\mu_B$; $z\approx\frac{3{,}53}{1{,}946}\approx1{,}82$; $C = [1{,}645;\infty)$.
$1{,}82\in C$ → **отвергаем $H_0$**: батарейки A работают в среднем дольше.
`,
        answer: md`$z\approx1{,}82\ge1{,}645$ → отвергаем $H_0$.`
      },
      {
        id: 'e3', tag: 'C13', title: 'Время реакции до и после кофе (парные)',
        text: md`
Время реакции (мс) 8 человек измерили до и после кофе:

| человек | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| до | 312 | 298 | 335 | 301 | 322 | 289 | 340 | 315 |
| после | 295 | 301 | 310 | 290 | 305 | 284 | 318 | 309 |

Разности распределены нормально. Сокращает ли кофе время реакции? $\alpha = 0{,}01$.
`,
        hint: md`Одни и те же люди → разности $d = \text{до}-\text{после}$, $t_{0{,}99;7} = 2{,}998$.`,
        solution: md`
$d_i$: 17, −3, 25, 11, 17, 5, 22, 6; $\bar d = 12{,}5$, $s_d\approx9{,}47$.
$H_1:\ \mu_D>0$; $t = \frac{12{,}5}{9{,}47}\sqrt8\approx3{,}73$; $C = [2{,}998;\infty)$ → **отвергаем $H_0$**: кофе сокращает среднее время реакции.
`,
        answer: md`$t\approx3{,}73\ge2{,}998$ → отвергаем $H_0$.`
      },
      {
        id: 'e4', tag: 'C13', title: 'Скорость печати до и после курса (парные)',
        text: md`
Скорость печати (слов/мин) 7 человек до и после курса:

| человек | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---:|---:|---:|---:|---:|---:|---:|
| до | 42 | 55 | 38 | 61 | 47 | 50 | 44 |
| после | 48 | 54 | 45 | 66 | 52 | 49 | 51 |

Улучшает ли курс скорость печати? $\alpha = 0{,}05$, разности нормальны.
`,
        hint: md`$d = \text{после}-\text{до}$, $t_{0{,}95;6} = 1{,}943$.`,
        solution: md`
$d_i$: 6, −1, 7, 5, 5, −1, 7; $\bar d = 4$, $s_d\approx3{,}51$; $t = \frac{4}{3{,}51}\sqrt7\approx3{,}01$; $C = [1{,}943;\infty)$ → **отвергаем $H_0$**: курс улучшает скорость печати.
`,
        answer: md`$t\approx3{,}01\ge1{,}943$ → отвергаем $H_0$.`
      },
      {
        id: 'e5', tag: 'C13', title: 'A/B-тест сайта (две доли)',
        text: md`
Версия A страницы: 180 покупок на 400 посещений; версия B: 150 на 400. Можно ли на уровне 0,01 утверждать, что у A **выше** конверсия? А на уровне 0,05?
`,
        hint: md`$\hat p = \frac{330}{800}$. $z_{0{,}99} = 2{,}326$, $z_{0{,}95} = 1{,}645$.`,
        solution: md`
$\hat p_A = 0{,}45$, $\hat p_B = 0{,}375$, $\hat p = 0{,}4125$; $z\approx\frac{0{,}075}{0{,}0348}\approx2{,}15$.
- $\alpha = 0{,}01$: $2{,}15<2{,}326$ → **нет оснований** отвергнуть $H_0$.
- $\alpha = 0{,}05$: $2{,}15\ge1{,}645$ → отвергаем $H_0$.

Вывод зависит от $\alpha$ — поэтому уровень значимости фиксируют **до** исследования.
`,
        answer: md`$z\approx2{,}15$: при 0,01 нет оснований отвергнуть; при 0,05 — A лучше.`
      },
      {
        id: 'e6', tag: 'C13', title: 'Сообщения об ошибках по дням недели (согласие)',
        text: md`
За квартал зарегистрировано 150 сообщений об ошибках: понедельник 36, вторник 28, среда 25, четверг 27, пятница 34. Можно ли считать, что сообщения распределены **равномерно** по рабочим дням? $\alpha = 0{,}05$.
`,
        hint: md`При $H_0$ ожидаем $150/5 = 30$ сообщений в день; 4 степени свободы.`,
        solution: md`
$\chi^2 = \frac{36+4+25+9+16}{30} = 3{,}0$. $\chi^2_{0{,}95;4} = 9{,}488$; $3{,}0<9{,}488$ → **нет оснований отвергнуть $H_0$**: данные согласуются с равномерным распределением.
`,
        answer: md`$\chi^2 = 3{,}0<9{,}49$ → нет оснований отвергнуть $H_0$.`
      },
      {
        id: 'e7', tag: 'C13', title: 'Доли браузеров (согласие)',
        text: md`
Гипотеза: доли браузеров — Chrome 65%, Safari 18%, Firefox 7%, остальные 10%. В случайной выборке 300 пользователей: 180, 66, 18, 36. Проверьте гипотезу на уровне 0,01.
`,
        hint: md`Ожидаемые: 195, 54, 21, 30 (все ≥ 5). 3 степени свободы.`,
        solution: md`
$\chi^2\approx1{,}15+2{,}67+0{,}43+1{,}20 = 5{,}45$; $\chi^2_{0{,}99;3} = 11{,}345$ → **нет оснований отвергнуть $H_0$**.
`,
        answer: md`$\chi^2\approx5{,}45<11{,}35$ → нет оснований отвергнуть $H_0$.`
      },
      {
        id: 'e8', tag: 'C15', title: 'Операционная система и специальность (независимость 2×2)',
        text: md`
220 студентов спросили о предпочитаемой системе:

| | Windows | macOS |
|---|---:|---:|
| информатика | 78 | 42 |
| графический дизайн | 35 | 65 |

Зависит ли выбор системы от специальности? $\alpha = 0{,}01$.
`,
        hint: md`Суммы строк 120 и 100, столбцов 113 и 107. 1 ст. св., $\chi^2_{0{,}99;1} = 6{,}635$.`,
        solution: md`
Ожидаемые: 61,64; 58,36; 51,36; 48,64. $\chi^2\approx4{,}34+4{,}59+5{,}21+5{,}50 = 19{,}65$ (формула 2×2: $\frac{220\cdot(78\cdot65-42\cdot35)^2}{120\cdot100\cdot113\cdot107} = 19{,}65$ ✓).
$19{,}65\ge6{,}635$ → **отвергаем $H_0$**: выбор системы зависит от специальности.
`,
        answer: md`$\chi^2\approx19{,}65\ge6{,}635$ → признаки зависимы.`
      },
      {
        id: 'e9', tag: 'C15', title: 'Спорт и качество сна (независимость 2×3)',
        text: md`
Опрос 300 человек:

| сон \ спорт | никогда | 1–2 раза/нед. | ≥ 3 раз/нед. |
|---|---:|---:|---:|
| хороший | 40 | 70 | 60 |
| плохой | 60 | 45 | 25 |

Зависит ли качество сна от частоты занятий спортом? $\alpha = 0{,}05$.
`,
        hint: md`$(2-1)(3-1) = 2$ ст. св., $\chi^2_{0{,}95;2} = 5{,}991$.`,
        solution: md`
Суммы: строки 170 и 130; столбцы 100, 115, 85; $n = 300$. Ожидаемые: хороший — 56,67; 65,17; 48,17; плохой — 43,33; 49,83; 36,83.
$\chi^2\approx18{,}85\ge5{,}991$ → **отвергаем $H_0$**: качество сна зависит от физической активности (в выборке: больше спорта — лучше сон).
`,
        answer: md`$\chi^2\approx18{,}85\ge5{,}99$ → признаки зависимы.`
      }
    ]
  };

  SAD.registerTopic('t11', { charts: charts, pl: pl, en: en, ru: ru });
})();
