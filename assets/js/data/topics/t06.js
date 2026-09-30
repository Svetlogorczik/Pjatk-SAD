/* Topic 6 — Two-dimensional random variables (lecture W05, classes C07 and C09) */
(function () {
  var md = SAD.md;
  var S = SAD.stats;

  function corrPoints(rho, seed) {
    var r = S.rng(seed), pts = [];
    for (var i = 0; i < 70; i++) {
      var x = Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
      var z = Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
      pts.push([+x.toFixed(3), +(rho * x + Math.sqrt(1 - rho * rho) * z).toFixed(3)]);
    }
    return pts;
  }

  var box = [-3.2, 3.2];
  var charts = {
    rhoPos: { type: 'scatter', points: corrPoints(0.9, 11), xRange: box, yRange: box, height: 260, caption: 'ρ ≈ 0,9' },
    rhoZero: { type: 'scatter', points: corrPoints(0, 12), xRange: box, yRange: box, height: 260, caption: 'ρ ≈ 0' },
    rhoNeg: { type: 'scatter', points: corrPoints(-0.7, 13), xRange: box, yRange: box, height: 260, caption: 'ρ ≈ −0,7' },
    parabola: { type: 'scatter', points: [[-2, 4], [-1.5, 2.25], [-1, 1], [-0.5, 0.25], [0, 0], [0.5, 0.25], [1, 1], [1.5, 2.25], [2, 4]], height: 260,
      caption: { pl: 'Y = X² przy symetrycznym X: silna zależność, a ρ = 0', en: 'Y = X² with a symmetric X: strong dependence, yet ρ = 0', ru: 'Y = X² при симметричном X: сильная зависимость, а ρ = 0' } }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Dwie zmienne naraz: wzrost i waga, przychód i koszty. Uczymy się czytać **tabelę rozkładu łącznego**, liczyć rozkłady brzegowe i warunkowe, sprawdzać niezależność oraz mierzyć zależność **kowariancją** i **korelacją**.',
    lecture: md`
# Zmienna losowa dwuwymiarowa

Często w jednym doświadczeniu obserwujemy **kilka powiązanych** wielkości i znajomość każdej z osobna nie wystarcza. {lecture:W05}

::: def W05 | Zmienna dwuwymiarowa i jej dystrybuanta
$(X, Y)$ to para zmiennych losowych określonych na tej samej przestrzeni $\Omega$. **Dystrybuanta łączna**:
$$F(x, y) = P(X\le x,\ Y\le y)$$
— prawdopodobieństwo, że punkt $(X, Y)$ wpadnie do „ćwiartki” na lewo i poniżej punktu $(x, y)$.
:::

Warunki konieczne i wystarczające na dystrybuantę dwuwymiarową: granice 0 w $-\infty$ i 1 w $+\infty$, monotoniczność i prawostronna ciągłość po każdej zmiennej, oraz **warunek prostokąta**: $F(x_1,y_1)+F(x_2,y_2)-F(x_1,y_2)-F(x_2,y_1)\ge0$ dla $x_1<x_2$, $y_1<y_2$ (to jest prawdopodobieństwo prostokąta, więc nie może być ujemne). Funkcja równa 1 dla $x+y\ge1$, $x,y\ge0$ spełnia trzy pierwsze warunki, ale dla prostokąta $[0,1]^2$ daje $-1$ — nie jest dystrybuantą. {lecture:W05}

# Przypadek dyskretny: tabela rozkładu łącznego

::: def | Rozkład łączny i brzegowy
$p(x, y) = P(X=x,\ Y=y)$, przy czym $p(x,y)\ge0$ i $\sum_x\sum_y p(x,y) = 1$.
**Rozkłady brzegowe** — sumy w wierszach i kolumnach:
$$p_X(x) = \sum_y p(x,y),\qquad p_Y(y) = \sum_x p(x,y)$$
:::

::: example W05 | Zniżki w towarzystwie ubezpieczeniowym
$X$ — zniżka na polisę komunikacyjną, $Y$ — na mieszkaniową (zł):

| X \ Y | 0 | 100 | 200 | 300 | $p_X$ |
|---|---:|---:|---:|---:|---:|
| **0** | 0,10 | 0,15 | 0,15 | 0,05 | **0,45** |
| **100** | 0,05 | 0,05 | 0,10 | 0,10 | **0,30** |
| **250** | 0,05 | 0,05 | 0,05 | 0,10 | **0,25** |
| $p_Y$ | **0,20** | **0,25** | **0,30** | **0,25** | 1 |

$P(Y\ge200) = p_Y(200)+p_Y(300) = 0{,}30+0{,}25 = 0{,}55$.
:::

::: intuition
Tabela łączna to „mapa” wszystkich możliwych par. Rozkład brzegowy to spojrzenie na tę mapę **z boku** — widzisz tylko jedną zmienną, bo drugą „zsumowałeś”. Stąd nazwa: sumy piszemy **na brzegu** tabeli.
:::

::: tip own | Dystrybuanta z tabeli
$F(x_0,y_0) = P(X\le x_0, Y\le y_0)$ = suma komórek w **lewym górnym rogu** tabeli (wiersze $x\le x_0$, kolumny $y\le y_0$). Wartości spoza nośnika (np. $F(1{,}5;\,3{,}5)$) zaokrąglaj „w dół” do najbliższych punktów nośnika.
:::

# Przypadek ciągły: gęstość łączna

::: def W05 | Gęstość łączna
$f(x,y)\ge0$, $\iint_{\mathbb R^2}f\,dx\,dy = 1$ i $P((X,Y)\in A) = \iint_A f(x,y)\,dx\,dy$. Wtedy
$$F(x,y) = \int_{-\infty}^x\int_{-\infty}^y f(u,v)\,dv\,du,\qquad f = \frac{\partial^2F}{\partial x\,\partial y},$$
$$f_X(x) = \int_{-\infty}^{\infty} f(x,y)\,dy,\qquad f_Y(y) = \int_{-\infty}^{\infty} f(x,y)\,dx.$$
:::

::: example W05 | Okienka w fast-foodzie
$X$, $Y$ — części czasu, gdy zajęte jest okienko dla kierowców / pieszych; $f(x,y) = \frac65(x+y^2)$ na $[0,1]^2$.
- Sprawdzenie: $\iint\frac65(x+y^2) = \frac65\left(\frac12+\frac13\right) = 1$ ✓.
- $P(X\le0{,}25,\ Y\le0{,}25) = \frac65\left(\frac{0{,}25^2}{2}\cdot0{,}25 + 0{,}25\cdot\frac{0{,}25^3}{3}\right) = \frac{7}{640}\approx0{,}0109$.
- $f_X(x) = \int_0^1\frac65(x+y^2)dy = \frac65x+\frac25$, $\;f_Y(y) = \frac65y^2+\frac35$, $\;P(0{,}25\le Y\le0{,}75) = \frac{37}{80} = 0{,}4625$.
:::

# Niezależność zmiennych

::: def W05 | Niezależność
$X$ i $Y$ są **niezależne**, gdy $F(x,y) = F_X(x)F_Y(y)$ dla wszystkich $x, y$. W praktyce:
- **dyskretne**: $p(x,y) = p_X(x)\,p_Y(y)$ dla **każdej** komórki tabeli,
- **ciągłe**: $f(x,y) = f_X(x)\,f_Y(y)$.
:::

::: steps | Jak sprawdzić niezależność z tabeli
1. Policz sumy wierszy ($p_X$) i kolumn ($p_Y$).
2. Dla każdej komórki porównaj $p(x,y)$ z $p_X(x)\cdot p_Y(y)$.
3. **Jedna** niezgodna komórka wystarczy → zależne. Niezależność wymaga zgodności **wszędzie**.
4. Szybki test: komórka z zerem, gdy $p_X>0$ i $p_Y>0$ → od razu **zależne**.
:::

::: example W05
W tabeli zniżek: $p(0,0) = 0{,}10 \ne 0{,}45\cdot0{,}20 = 0{,}09$ → $X$ i $Y$ są **zależne**. Zmienne niezależne o tych samych brzegach miałyby rozkład „produktowy” $p_X(x)p_Y(y)$, np. w pierwszej komórce 0,09.
:::

::: note W05
Dla zmiennych ciągłych: jeśli są niezależne, to obszar, gdzie $f>0$, jest **prostokątem** (iloczynem nośników). Gęstość $24xy$ na trójkącie $x+y\le1$ od razu daje zmienne **zależne**.
:::

::: example W05 | Dwa niezależne urządzenia
Czasy życia $X\sim Exp(\lambda_1)$, $Y\sim Exp(\lambda_2)$ niezależne, $\lambda_1 = \frac1{1000}$, $\lambda_2 = \frac1{1200}$. Oba przetrwają 1500 h:
$$P(X\ge1500, Y\ge1500) = e^{-1500/1000}\cdot e^{-1500/1200} = 0{,}2231\cdot0{,}2865 \approx 0{,}0639$$
:::

# Rozkłady warunkowe

::: def W05 | Rozkład warunkowy (dyskretny)
$$P(X=x\mid Y=y) = \frac{p(x,y)}{p_Y(y)},\qquad E(X\mid Y=y) = \sum_x x\,P(X=x\mid Y=y)$$
Czyli: bierzesz **jeden wiersz/kolumnę** tabeli i dzielisz przez jego sumę. W przypadku ciągłym: $f_{X|Y}(x|y) = \frac{f(x,y)}{f_Y(y)}$.
:::

::: example W05 | Y pod warunkiem X = 100
Wiersz $X=100$: 0,05; 0,05; 0,10; 0,10 (suma 0,30). Po podzieleniu: $\frac16, \frac16, \frac26, \frac26$.
$$E(Y\mid X=100) = 0\cdot\tfrac16+100\cdot\tfrac16+200\cdot\tfrac26+300\cdot\tfrac26 = \tfrac{1100}{6}\approx183{,}33$$
:::

# Funkcje dwóch zmiennych

Dla $Z = g(X, Y)$ (dyskretnych): $P(Z = z) = \sum\limits_{g(x,y)=z}p(x,y)$ — zbierasz wszystkie komórki, które dają tę samą wartość $z$. {lecture:W05}

::: example W05 | Suma i maksimum
| X \ Y | 0 | 1 | 2 | 3 |
|---|---:|---:|---:|---:|
| **0** | 0,1 | 0,1 | 0,2 | 0,1 |
| **1** | 0,1 | 0,1 | 0,1 | 0,0 |
| **2** | 0,1 | 0,0 | 0,0 | 0,1 |

$T = X+Y$: $P(T=0) = 0{,}1$; $P(T=1) = 0{,}2$; $P(T=2) = 0{,}4$; $P(T=3) = 0{,}2$; $P(T=4) = 0$; $P(T=5) = 0{,}1$.
$U = \max(X,Y)$: $P(U=0) = 0{,}1$; $P(U=1) = 0{,}3$; $P(U=2) = 0{,}4$; $P(U=3) = 0{,}2$.
:::

# Wartość oczekiwana, kowariancja, korelacja

$$E[h(X,Y)] = \sum_x\sum_y h(x,y)\,p(x,y)\quad\text{lub}\quad\iint h(x,y)f(x,y)\,dx\,dy$$

::: formula W05 | Kombinacja liniowa
$$E(aX+bY) = aE(X)+bE(Y)$$
$$V(aX+bY) = a^2V(X) + b^2V(Y) + 2ab\,\mathrm{Cov}(X,Y)$$
:::

::: def W05 | Kowariancja i współczynnik korelacji
$$\mathrm{Cov}(X,Y) = E\big[(X-EX)(Y-EY)\big] = E(XY) - E(X)E(Y)$$
$$\rho_{XY} = \frac{\mathrm{Cov}(X,Y)}{\sigma_X\,\sigma_Y}$$
Druga postać kowariancji (z iloczynem) wynika z rozpisania nawiasów i jest wygodniejsza w rachunkach.
:::

- $\mathrm{Cov}>0$: gdy $X$ rośnie, $Y$ **raczej** rośnie; $\mathrm{Cov}<0$ — raczej maleje. Wielkość kowariancji zależy jednak od jednostek, dlatego używamy **korelacji** (kowariancji zmiennych standaryzowanych).
- Własności: $|\rho|\le1$; $|\rho| = 1$ ⇔ $Y = aX+b$ z prawdopodobieństwem 1 (dokładna zależność liniowa); korelacja nie zmienia się (co do modułu) przy $aX+b$, $cY+d$. {lecture:W05}

::: grid
@chart rhoPos
@chart rhoZero
@chart rhoNeg
:::

::: warn W05 | Nieskorelowane ≠ niezależne
Niezależne ⇒ $E(XY) = E(X)E(Y)$ ⇒ $\mathrm{Cov} = 0$ (**nieskorelowane**). Ale **odwrotnie nie**: korelacja mierzy tylko zależność **liniową**. Przykład {own}: $X$ przyjmuje −1, 0, 1 z prawdopodobieństwem $\frac13$, $Y = X^2$. Wtedy $E(XY) = E(X^3) = 0 = E(X)E(Y)$, więc $\rho=0$, choć $Y$ jest **całkowicie** wyznaczona przez $X$.
:::

@chart parabola

::: steps | Kowariancja z tabeli
1. Brzegi → $E(X)$, $E(Y)$, $E(X^2)$, $E(Y^2)$ → $V(X)$, $V(Y)$.
2. $E(XY) = \sum x\,y\,p(x,y)$ — komórki z $x=0$ lub $y=0$ możesz pominąć.
3. $\mathrm{Cov} = E(XY) - E(X)E(Y)$, $\rho = \mathrm{Cov}/(\sigma_X\sigma_Y)$.
:::

# W Excelu

~~~excel Tabela łączna w B2:D3 (wartości X w A2:A3, Y w B1:D1)
E2: =SUM(B2:D2)                                  // p_X dla pierwszego wiersza (przeciągnij w dół)
B4: =SUM(B2:B3)                                  // p_Y dla pierwszej kolumny (przeciągnij w prawo)
G1: =SUMPRODUCT(A2:A3,E2:E3)                     // E(X)
G2: =SUMPRODUCT(B1:D1,B4:D4)                     // E(Y)
G3: =SUMPRODUCT(A2:A3*B1:D1*B2:D3)               // E(XY) (Excel 365; w starszym: Ctrl+Shift+Enter)
G4: =G3-G1*G2                                    // Cov(X,Y)
~~~

~~~python Rozkład łączny w numpy
import numpy as np
x = np.array([0, 100, 250]); y = np.array([0, 100, 200, 300])
P = np.array([[.10, .15, .15, .05],
              [.05, .05, .10, .10],
              [.05, .05, .05, .10]])
pX, pY = P.sum(axis=1), P.sum(axis=0)          # brzegi
EX, EY = x @ pX, y @ pY
EXY = x @ P @ y
cov = EXY - EX * EY
rho = cov / np.sqrt((x**2 @ pX - EX**2) * (y**2 @ pY - EY**2))
print(pX, pY, cov, rho, np.allclose(P, np.outer(pX, pY)))   # False = zależne
~~~

::: summary
- Tabela łączna: brzegi = sumy wierszy i kolumn; $F(x_0,y_0)$ = suma lewego górnego rogu.
- Niezależność: $p = p_Xp_Y$ w **każdej** komórce ($f = f_Xf_Y$).
- Warunkowy: wiersz/kolumna ÷ jego suma.
- $\mathrm{Cov} = E(XY)-EXEY$, $\rho = \mathrm{Cov}/(\sigma_X\sigma_Y)$, $|\rho|\le1$.
- $V(aX+bY) = a^2VX+b^2VY+2ab\,\mathrm{Cov}$.
- Niezależne ⇒ nieskorelowane; odwrotnie — nie.
:::
`,

    cheatsheet: md`
## Tabela łączna
- $\sum p(x,y)=1$ → brakujące $p$
- $p_X$ = suma wiersza, $p_Y$ = suma kolumny
- $F(x_0,y_0)$ = suma komórek z $x\le x_0$, $y\le y_0$
- $P(X=x\mid Y=y) = p(x,y)/p_Y(y)$; $E(X\mid Y=y)=\sum x\,P(X=x\mid Y=y)$

## Niezależność
- dyskretne: $p(x,y)=p_X(x)p_Y(y)$ **dla każdej** komórki
- ciągłe: $f=f_Xf_Y$; nośnik musi być prostokątem
- zero w tabeli przy dodatnich brzegach → zależne

## Gęstość łączna
$\iint f=1$ · $f_X=\int f\,dy$ · $f_Y=\int f\,dx$ · $P(A)=\iint_A f$

## Momenty
$$\mathrm{Cov}=E(XY)-E(X)E(Y)\qquad \rho=\frac{\mathrm{Cov}}{\sigma_X\sigma_Y}\in[-1,1]$$
$$E(aX+bY)=aEX+bEY$$
$$V(aX+bY)=a^2VX+b^2VY+2ab\,\mathrm{Cov}=a^2\sigma_X^2+b^2\sigma_Y^2+2ab\,\rho\,\sigma_X\sigma_Y$$
- zysk = przychód − koszt → $V = V_1+V_2-2\,\mathrm{Cov}$
- niezależne ⇒ $\mathrm{Cov}=0$ (odwrotnie nie!)

## Funkcja Z = g(X, Y)
Zbierz komórki z tym samym $g(x,y)$ i dodaj.
`,

    exercises: [
      {
        id: 'e1', tag: 'C07', title: 'Czy zmienne są niezależne? (2 × 2)',
        text: md`
Sprawdź niezależność zmiennych $X$, $Y$ o rozkładzie łącznym:
a) $p_{11} = 0{,}12$, $p_{12} = 0{,}28$, $p_{21} = 0{,}18$, $p_{22} = 0{,}42$;
b) $p_{11} = 0{,}15$, $p_{12} = 0{,}25$, $p_{21} = 0{,}15$, $p_{22} = 0{,}45$
($p_{ij} = P(X=x_i, Y=y_j)$).
`,
        hint: md`Policz sumy wierszy i kolumn i porównaj iloczyny z komórkami.`,
        solution: md`
**a)** Wiersze: 0,40 i 0,60; kolumny: 0,30 i 0,70. Iloczyny: $0{,}4\cdot0{,}3 = 0{,}12$ ✓, $0{,}4\cdot0{,}7=0{,}28$ ✓, $0{,}6\cdot0{,}3 = 0{,}18$ ✓, $0{,}6\cdot0{,}7=0{,}42$ ✓ → **niezależne**.

**b)** Wiersze: 0,40 i 0,60; kolumny: 0,30 i 0,70. Już $p_{11} = 0{,}15 \ne 0{,}4\cdot0{,}3 = 0{,}12$ → **zależne**.
`,
        answer: md`a) niezależne; b) zależne.`
      },
      {
        id: 'e2', tag: 'C07', title: 'Brzegi, niezależność, momenty drugiego rzędu',
        text: md`
| X \ Y | −2 | 0 | 2 |
|---|---:|---:|---:|
| **1** | 0,20 | 0,15 | 0,15 |
| **3** | 0,10 | 0,15 | 0,25 |

a) Wyznacz rozkłady brzegowe. b) Czy $X$ i $Y$ są niezależne? c) Oblicz momenty zwykłe drugiego rzędu $E(X^2)$ i $E(Y^2)$.
`,
        hint: md`Moment zwykły rzędu 2 to $E(X^2) = \sum x^2 p_X(x)$.`,
        solution: md`
**a)** $p_X(1) = 0{,}5$, $p_X(3) = 0{,}5$; $p_Y(-2) = 0{,}3$, $p_Y(0) = 0{,}3$, $p_Y(2) = 0{,}4$.
**b)** $p(1,-2) = 0{,}20 \ne 0{,}5\cdot0{,}3 = 0{,}15$ → **zależne**.
**c)** $E(X^2) = 1\cdot0{,}5 + 9\cdot0{,}5 = 5$; $E(Y^2) = 4\cdot0{,}3 + 0 + 4\cdot0{,}4 = 2{,}8$.
`,
        answer: md`$p_X$: 0,5/0,5; $p_Y$: 0,3/0,3/0,4; zależne; $E(X^2)=5$, $E(Y^2)=2{,}8$.`
      },
      {
        id: 'e3', tag: 'C07', title: 'Średnie i wariancje z tabeli',
        text: md`
| X \ Y | 1 | 2 | 3 |
|---|---:|---:|---:|
| **0** | 0,15 | 0,25 | 0,10 |
| **2** | 0,20 | 0,10 | 0,20 |

Oblicz $E(X)$, $V(X)$, $E(Y)$, $V(Y)$.
`,
        hint: md`Najpierw brzegi, potem wzory jednowymiarowe.`,
        solution: md`
$p_X(0) = 0{,}5$, $p_X(2) = 0{,}5$ → $E(X) = 1$, $E(X^2) = 2$, $V(X) = 1$.
$p_Y$: 0,35; 0,35; 0,30 → $E(Y) = 0{,}35+0{,}70+0{,}90 = 1{,}95$, $E(Y^2) = 0{,}35+1{,}40+2{,}70 = 4{,}45$, $V(Y) = 4{,}45-1{,}95^2 = 0{,}6475$.
`,
        answer: md`$E(X)=1$, $V(X)=1$, $E(Y)=1{,}95$, $V(Y)=0{,}6475$.`
      },
      {
        id: 'e4', tag: 'C07', title: 'Dystrybuanta, warunki i niezależność 3 × 3',
        text: md`
| X \ Y | 1 | 2 | 3 |
|---|---:|---:|---:|
| **0** | 0,05 | 0,15 | 0,10 |
| **1** | 0,10 | 0 | 0,10 |
| **2** | 0,15 | 0,25 | 0,10 |

a) Wyznacz wartości oczekiwane rozkładów brzegowych. b) Czy $X$ i $Y$ są niezależne? c) Oblicz $F(1, 2)$, $F(1{,}5;\,3{,}5)$, $P(X<2\mid Y>2)$ i $P(Y=y\mid X=2)$ dla $y = 1,2,3$.
`,
        hint: md`Zero w komórce (1, 2) przy dodatnich brzegach załatwia pytanie o niezależność. $F(1{,}5;3{,}5) = P(X\le1)$.`,
        solution: md`
**a)** $p_X$: 0,30; 0,20; 0,50 → $E(X) = 0{,}2+1{,}0 = 1{,}2$. $p_Y$: 0,30; 0,40; 0,30 → $E(Y) = 0{,}3+0{,}8+0{,}9 = 2{,}0$.
**b)** $p(1,2) = 0 \ne 0{,}2\cdot0{,}4$ → **zależne**.
**c)**
- $F(1,2) = P(X\le1, Y\le2) = 0{,}05+0{,}15+0{,}10+0 = 0{,}30$
- $F(1{,}5;3{,}5) = P(X\le1) = 0{,}30+0{,}20 = 0{,}50$
- $P(X<2\mid Y>2) = \dfrac{P(X\le1, Y=3)}{P(Y=3)} = \dfrac{0{,}10+0{,}10}{0{,}30} = \dfrac23$
- $P(Y=y\mid X=2)$: $\frac{0{,}15}{0{,}5}=0{,}3$; $\frac{0{,}25}{0{,}5} = 0{,}5$; $\frac{0{,}10}{0{,}5} = 0{,}2$.
`,
        answer: md`$E(X)=1{,}2$, $E(Y)=2$; zależne; $F(1,2)=0{,}3$; $F(1{,}5;3{,}5)=0{,}5$; $P(X<2\mid Y>2)=\frac23$; rozkład $Y\mid X=2$: 0,3/0,5/0,2.`
      },
      {
        id: 'e5', tag: 'C07', title: 'Gęstość łączna — stała, brzegi, niezależność',
        text: md`
$f(x,y) = c\,x\,y^2$ dla $0\le x\le1$, $0\le y\le3$ (0 poza). a) Wyznacz $c$. b) Wyznacz gęstości brzegowe. c) Oblicz $P(Y>2)$. d) Czy $X$ i $Y$ są niezależne?
`,
        hint: md`Całka się „rozdziela”: $\int_0^1x\,dx\cdot\int_0^3y^2dy$.`,
        solution: md`
**a)** $c\cdot\frac12\cdot9 = 1 \Rightarrow c = \frac29$.
**b)** $f_X(x) = \int_0^3\frac29xy^2dy = 2x$ na $[0;1]$; $f_Y(y) = \int_0^1\frac29xy^2dx = \frac{y^2}{9}$ na $[0;3]$.
**c)** $P(Y>2) = \int_2^3\frac{y^2}{9}dy = \frac{27-8}{27} = \frac{19}{27}\approx0{,}704$.
**d)** $f_X f_Y = 2x\cdot\frac{y^2}{9} = \frac29xy^2 = f$ → **niezależne**.
`,
        answer: md`$c=\frac29$; $f_X=2x$, $f_Y=y^2/9$; $P(Y>2)=\frac{19}{27}$; niezależne.`
      },
      {
        id: 'e6', tag: 'C07', title: 'Gęstość k(x + y)',
        text: md`
Wyznacz $k$ tak, aby $f(x,y) = k(x+y)$ dla $0\le x\le1$, $0\le y\le2$ (0 poza) była gęstością. Oblicz $F(0{,}5;\,1)$ oraz gęstości brzegowe. Czy zmienne są niezależne?
`,
        hint: md`$\int_0^1\int_0^2(x+y)\,dy\,dx = \int_0^1(2x+2)\,dx$.`,
        solution: md`
$\int_0^1(2x+2)dx = 1+2 = 3 \Rightarrow k = \frac13$.
$F(0{,}5;1) = \int_0^{0{,}5}\int_0^1\frac{x+y}{3}dy\,dx = \frac13\int_0^{0{,}5}\left(x+\frac12\right)dx = \frac13(0{,}125+0{,}25) = 0{,}125$.
$f_X(x) = \int_0^2\frac{x+y}{3}dy = \frac{2x+2}{3}$ na $[0;1]$; $f_Y(y) = \int_0^1\frac{x+y}{3}dx = \frac{1+2y}{6}$ na $[0;2]$.
W punkcie $(0,0)$: $f = 0$, a $f_Xf_Y = \frac23\cdot\frac16\ne0$ → **zależne**.
`,
        answer: md`$k=\frac13$; $F(0{,}5;1)=0{,}125$; $f_X=\frac{2x+2}{3}$, $f_Y=\frac{1+2y}{6}$; zależne.`
      },
      {
        id: 'e7', tag: 'C09', title: 'Te same brzegi, różne rozkłady łączne',
        text: md`
| X \ Y | 0 | 1 |
|---|---:|---:|
| **0** | $\frac14+\varepsilon$ | $\frac14-\varepsilon$ |
| **1** | $\frac14-\varepsilon$ | $\frac14+\varepsilon$ |

gdzie $\varepsilon\in\left[-\frac14;\frac14\right]$. Wyznacz rozkłady brzegowe. Czy zależą od $\varepsilon$? Dla jakiego $\varepsilon$ zmienne są niezależne? Jaki stąd wniosek?
`,
        hint: md`Dodaj komórki w wierszach i kolumnach — $\varepsilon$ się skraca.`,
        solution: md`
Każdy wiersz i każda kolumna sumuje się do $\frac12$, więc $p_X = p_Y = (\frac12, \frac12)$ **niezależnie od $\varepsilon$**. Niezależność wymaga $\frac14\pm\varepsilon = \frac14$, czyli $\varepsilon = 0$.
**Wniosek:** rozkłady brzegowe **nie wyznaczają** rozkładu łącznego — do opisu pary zmiennych potrzebna jest cała tabela (informacja o zależności). Dla $\varepsilon>0$ zmienne „lubią” być równe (dodatnia korelacja), dla $\varepsilon<0$ — różne.
`,
        answer: md`Brzegi zawsze (½, ½), nie zależą od $\varepsilon$; niezależne tylko dla $\varepsilon=0$.`
      },
      {
        id: 'e8', tag: 'C09', title: 'Brakujące p, dystrybuanta i korelacja',
        text: md`
| X \ Y | 1 | 2 | 3 |
|---|---:|---:|---:|
| **0** | 0,1 | 0,2 | 0,1 |
| **1** | 0,2 | $p$ | 0,1 |

a) Znajdź $p$. b) Oblicz $F(0, 2)$ i $F(0{,}5;\,5)$. c) Wyznacz brzegi i sprawdź niezależność. d) Czy $X$, $Y$ są skorelowane? W jakim stopniu?
`,
        hint: md`d) $E(XY)$: tylko wiersz $X=1$ daje niezerowe iloczyny.`,
        solution: md`
**a)** $0{,}7+p = 1\Rightarrow p = 0{,}3$.
**b)** $F(0,2) = 0{,}1+0{,}2 = 0{,}3$; $F(0{,}5;5) = P(X\le0) = 0{,}4$.
**c)** $p_X$: 0,4; 0,6. $p_Y$: 0,3; 0,5; 0,2. $p(0,1) = 0{,}1\ne0{,}4\cdot0{,}3 = 0{,}12$ → **zależne**.
**d)** $E(X) = 0{,}6$, $V(X) = 0{,}24$; $E(Y) = 1{,}9$, $E(Y^2) = 4{,}1$, $V(Y) = 0{,}49$.
$E(XY) = 1\cdot(1\cdot0{,}2 + 2\cdot0{,}3+3\cdot0{,}1) = 1{,}1$; $\mathrm{Cov} = 1{,}1 - 0{,}6\cdot1{,}9 = -0{,}04$.
$\rho = \dfrac{-0{,}04}{\sqrt{0{,}24}\cdot0{,}7}\approx-0{,}117$ — **słaba ujemna** korelacja.
`,
        answer: md`$p=0{,}3$; $F(0,2)=0{,}3$; $F(0{,}5;5)=0{,}4$; zależne; $\mathrm{Cov}=-0{,}04$, $\rho\approx-0{,}117$.`
      },
      {
        id: 'e9', tag: 'C09', title: 'Kowariancja i zmienna 2X + Y',
        text: md`
| X \ Y | 0 | 1 |
|---|---:|---:|
| **0** | 0,15 | 0,10 |
| **1** | 0,20 | 0,15 |
| **2** | 0,10 | $a$ |

a) Znajdź $a$ oraz $P(1\le X\le2,\ Y<4)$, $P(X=1\mid Y=0)$, $P(Y=1\mid X=0)$.
b) Wyznacz brzegi i sprawdź niezależność. c) Oblicz $\mathrm{Cov}(X,Y)$. d) Wyznacz $E(2X+Y)$ i $V(2X+Y)$.
`,
        hint: md`$Y<4$ zachodzi zawsze. d) $V(2X+Y) = 4V(X)+V(Y)+4\,\mathrm{Cov}(X,Y)$.`,
        solution: md`
**a)** $a = 1 - 0{,}70 = 0{,}30$. $P(1\le X\le2, Y<4) = P(X\in\{1,2\}) = 0{,}35+0{,}40 = 0{,}75$.
$P(X=1\mid Y=0) = \frac{0{,}20}{0{,}45}\approx0{,}444$; $P(Y=1\mid X=0) = \frac{0{,}10}{0{,}25} = 0{,}4$.
**b)** $p_X$: 0,25; 0,35; 0,40. $p_Y$: 0,45; 0,55. $p(0,0) = 0{,}15\ne0{,}25\cdot0{,}45$ → **zależne**.
**c)** $E(X) = 1{,}15$, $E(X^2) = 1{,}95$, $V(X) = 0{,}6275$; $E(Y) = 0{,}55$, $V(Y) = 0{,}2475$; $E(XY) = 1\cdot0{,}15+2\cdot0{,}30 = 0{,}75$; $\mathrm{Cov} = 0{,}75-1{,}15\cdot0{,}55 = 0{,}1175$.
**d)** $E(2X+Y) = 2{,}3+0{,}55 = 2{,}85$; $V(2X+Y) = 4\cdot0{,}6275+0{,}2475+4\cdot0{,}1175 = 3{,}2275$.
`,
        answer: md`$a=0{,}3$; 0,75; ≈ 0,444; 0,4; zależne; $\mathrm{Cov}=0{,}1175$; $E=2{,}85$; $V=3{,}2275$.`
      },
      {
        id: 'e10', tag: 'C09', title: 'Nieskorelowane, a jednak zależne',
        text: md`
$X$ przyjmuje wartości −1, 0, 1 z prawdopodobieństwem $\frac13$ każda, a $Y = X^2$. Zapisz tabelę rozkładu łącznego $(X, Y)$, oblicz $\mathrm{Cov}(X,Y)$ i sprawdź niezależność.
`,
        hint: md`$Y$ przyjmuje tylko 0 i 1. Sprawdź komórkę $(0, 1)$.`,
        solution: md`
| X \ Y | 0 | 1 |
|---|---:|---:|
| **−1** | 0 | 1/3 |
| **0** | 1/3 | 0 |
| **1** | 0 | 1/3 |

$E(X) = 0$, $E(XY) = E(X^3) = \frac13(-1+0+1) = 0$ → $\mathrm{Cov} = 0 - 0\cdot E(Y) = 0$ — **nieskorelowane**.
Ale $p(0,1) = 0\ne p_X(0)p_Y(1) = \frac13\cdot\frac23$ → **zależne**. Korelacja wykrywa tylko zależność liniową; tu zależność jest „paraboliczna”.
`,
        answer: md`$\mathrm{Cov}=0$ (nieskorelowane), ale zmienne są zależne.`
      },
      {
        id: 'e11', tag: 'C09', title: 'Zysk kawiarni',
        text: md`
Kawiarnia sprzedaje dziennie średnio 300 kaw (odchylenie 40) i 150 rogalików (odchylenie 25). Współczynnik korelacji liczby sprzedanych kaw i rogalików wynosi 0,5. Zysk z kawy to 2,50 zł, z rogalika 1,50 zł. Oblicz średni dzienny zysk i jego odchylenie standardowe.
`,
        hint: md`$Z = 2{,}5K + 1{,}5R$; $\mathrm{Cov}(K,R) = \rho\,\sigma_K\sigma_R$.`,
        solution: md`
$E(Z) = 2{,}5\cdot300+1{,}5\cdot150 = 750+225 = 975$ zł.
$\mathrm{Cov}(K,R) = 0{,}5\cdot40\cdot25 = 500$.
$V(Z) = 2{,}5^2\cdot1600 + 1{,}5^2\cdot625 + 2\cdot2{,}5\cdot1{,}5\cdot500 = 10\,000+1406{,}25+3750 = 15\,156{,}25$.
$\sigma_Z = \sqrt{15\,156{,}25}\approx123{,}1$ zł.
`,
        answer: md`$E(Z)=975$ zł, $\sigma_Z\approx123{,}1$ zł.`
      },
      {
        id: 'e12', tag: 'C09', title: 'Zysk = przychód − koszty',
        text: md`
Miesięczny przychód firmy ma średnią 50 tys. zł i odchylenie 5 tys. zł, koszty — średnią 35 tys. zł i odchylenie 4 tys. zł. Korelacja przychodu i kosztów wynosi 0,6. Oblicz wartość oczekiwaną i odchylenie standardowe miesięcznego zysku.
`,
        hint: md`$V(P-K) = V(P)+V(K)-2\,\mathrm{Cov}(P,K)$ — dodatnia korelacja **zmniejsza** zmienność zysku.`,
        solution: md`
$E = 50-35 = 15$ tys. zł.
$V = 25+16-2\cdot0{,}6\cdot5\cdot4 = 41-24 = 17$, $\sigma = \sqrt{17}\approx4{,}12$ tys. zł.
Gdy koszty rosną razem z przychodem, zysk „waha się” mniej niż przy braku korelacji ($\sqrt{41}\approx6{,}4$).
`,
        answer: md`$E=15$ tys. zł, $\sigma\approx4{,}12$ tys. zł.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'Two variables at once: height and weight, revenue and costs. We learn to read a **joint distribution table**, compute marginal and conditional distributions, check independence and measure dependence with **covariance** and **correlation**.',
    lecture: md`
# Two-dimensional random variables

In one experiment we often observe **several related** quantities, and knowing each separately is not enough. {lecture:W05}

::: def W05 | Two-dimensional variable and its CDF
$(X, Y)$ is a pair of random variables defined on the same space $\Omega$. The **joint CDF**:
$$F(x, y) = P(X\le x,\ Y\le y)$$
— the probability that the point $(X, Y)$ falls into the “quadrant” to the left of and below $(x, y)$.
:::

Necessary and sufficient conditions for a 2D CDF: limits 0 at $-\infty$ and 1 at $+\infty$, monotonicity and right-continuity in each variable, and the **rectangle condition**: $F(x_1,y_1)+F(x_2,y_2)-F(x_1,y_2)-F(x_2,y_1)\ge0$ for $x_1<x_2$, $y_1<y_2$ (it is the probability of a rectangle, so it can’t be negative). A function equal to 1 for $x+y\ge1$, $x,y\ge0$ satisfies the first three conditions, but gives $-1$ for the rectangle $[0,1]^2$ — it is not a CDF. {lecture:W05}

# Discrete case: the joint distribution table

::: def | Joint and marginal distributions
$p(x, y) = P(X=x,\ Y=y)$, with $p(x,y)\ge0$ and $\sum_x\sum_y p(x,y) = 1$.
**Marginal distributions** — row and column sums:
$$p_X(x) = \sum_y p(x,y),\qquad p_Y(y) = \sum_x p(x,y)$$
:::

::: example W05 | Insurance discounts
$X$ — discount on a car policy, $Y$ — on a home policy (PLN):

| X \ Y | 0 | 100 | 200 | 300 | $p_X$ |
|---|---:|---:|---:|---:|---:|
| **0** | 0.10 | 0.15 | 0.15 | 0.05 | **0.45** |
| **100** | 0.05 | 0.05 | 0.10 | 0.10 | **0.30** |
| **250** | 0.05 | 0.05 | 0.05 | 0.10 | **0.25** |
| $p_Y$ | **0.20** | **0.25** | **0.30** | **0.25** | 1 |

$P(Y\ge200) = p_Y(200)+p_Y(300) = 0.30+0.25 = 0.55$.
:::

::: intuition
The joint table is a “map” of all possible pairs. A marginal distribution looks at that map **from the side** — you see only one variable because you “summed out” the other. Hence the name: the sums are written **in the margin** of the table.
:::

::: tip own | CDF from a table
$F(x_0,y_0) = P(X\le x_0, Y\le y_0)$ = the sum of cells in the **top-left corner** (rows $x\le x_0$, columns $y\le y_0$). Arguments outside the support (e.g. $F(1.5;\,3.5)$) are rounded “down” to the nearest support points.
:::

# Continuous case: joint density

::: def W05 | Joint density
$f(x,y)\ge0$, $\iint_{\mathbb R^2}f\,dx\,dy = 1$ and $P((X,Y)\in A) = \iint_A f(x,y)\,dx\,dy$. Then
$$F(x,y) = \int_{-\infty}^x\int_{-\infty}^y f(u,v)\,dv\,du,\qquad f = \frac{\partial^2F}{\partial x\,\partial y},$$
$$f_X(x) = \int_{-\infty}^{\infty} f(x,y)\,dy,\qquad f_Y(y) = \int_{-\infty}^{\infty} f(x,y)\,dx.$$
:::

::: example W05 | Fast-food windows
$X$, $Y$ — fractions of time the drive-through / walk-up window is busy; $f(x,y) = \frac65(x+y^2)$ on $[0,1]^2$.
- Check: $\iint\frac65(x+y^2) = \frac65\left(\frac12+\frac13\right) = 1$ ✓.
- $P(X\le0.25,\ Y\le0.25) = \frac{7}{640}\approx0.0109$.
- $f_X(x) = \frac65x+\frac25$, $\;f_Y(y) = \frac65y^2+\frac35$, $\;P(0.25\le Y\le0.75) = \frac{37}{80} = 0.4625$.
:::

# Independence

::: def W05 | Independence
$X$ and $Y$ are **independent** when $F(x,y) = F_X(x)F_Y(y)$ for all $x, y$. In practice:
- **discrete**: $p(x,y) = p_X(x)\,p_Y(y)$ for **every** cell,
- **continuous**: $f(x,y) = f_X(x)\,f_Y(y)$.
:::

::: steps | Checking independence from a table
1. Compute row sums ($p_X$) and column sums ($p_Y$).
2. For every cell compare $p(x,y)$ with $p_X(x)\cdot p_Y(y)$.
3. **One** mismatch is enough → dependent. Independence requires agreement **everywhere**.
4. Quick test: a zero cell with $p_X>0$ and $p_Y>0$ → immediately **dependent**.
:::

::: example W05
In the discount table: $p(0,0) = 0.10 \ne 0.45\cdot0.20 = 0.09$ → $X$ and $Y$ are **dependent**. Independent variables with the same margins would have the “product” distribution $p_X(x)p_Y(y)$, e.g. 0.09 in the first cell.
:::

::: note W05
For continuous variables: if they are independent, the region where $f>0$ is a **rectangle** (a product of supports). The density $24xy$ on the triangle $x+y\le1$ immediately gives **dependent** variables.
:::

::: example W05 | Two independent devices
Lifetimes $X\sim Exp(\lambda_1)$, $Y\sim Exp(\lambda_2)$ independent, $\lambda_1 = \frac1{1000}$, $\lambda_2 = \frac1{1200}$. Both survive 1500 h:
$$P(X\ge1500, Y\ge1500) = e^{-1500/1000}\cdot e^{-1500/1200} = 0.2231\cdot0.2865 \approx 0.0639$$
:::

# Conditional distributions

::: def W05 | Conditional distribution (discrete)
$$P(X=x\mid Y=y) = \frac{p(x,y)}{p_Y(y)},\qquad E(X\mid Y=y) = \sum_x x\,P(X=x\mid Y=y)$$
That is: take **one row/column** of the table and divide it by its sum. In the continuous case: $f_{X|Y}(x|y) = \frac{f(x,y)}{f_Y(y)}$.
:::

::: example W05 | Y given X = 100
Row $X=100$: 0.05; 0.05; 0.10; 0.10 (sum 0.30). After dividing: $\frac16, \frac16, \frac26, \frac26$.
$$E(Y\mid X=100) = 0\cdot\tfrac16+100\cdot\tfrac16+200\cdot\tfrac26+300\cdot\tfrac26 = \tfrac{1100}{6}\approx183.33$$
:::

# Functions of two variables

For $Z = g(X, Y)$ (discrete): $P(Z = z) = \sum\limits_{g(x,y)=z}p(x,y)$ — collect all cells that give the same value $z$. {lecture:W05}

::: example W05 | Sum and maximum
| X \ Y | 0 | 1 | 2 | 3 |
|---|---:|---:|---:|---:|
| **0** | 0.1 | 0.1 | 0.2 | 0.1 |
| **1** | 0.1 | 0.1 | 0.1 | 0.0 |
| **2** | 0.1 | 0.0 | 0.0 | 0.1 |

$T = X+Y$: $P(T=0) = 0.1$; $P(T=1) = 0.2$; $P(T=2) = 0.4$; $P(T=3) = 0.2$; $P(T=4) = 0$; $P(T=5) = 0.1$.
$U = \max(X,Y)$: $P(U=0) = 0.1$; $P(U=1) = 0.3$; $P(U=2) = 0.4$; $P(U=3) = 0.2$.
:::

# Expectation, covariance, correlation

$$E[h(X,Y)] = \sum_x\sum_y h(x,y)\,p(x,y)\quad\text{or}\quad\iint h(x,y)f(x,y)\,dx\,dy$$

::: formula W05 | Linear combination
$$E(aX+bY) = aE(X)+bE(Y)$$
$$V(aX+bY) = a^2V(X) + b^2V(Y) + 2ab\,\mathrm{Cov}(X,Y)$$
:::

::: def W05 | Covariance and correlation coefficient
$$\mathrm{Cov}(X,Y) = E\big[(X-EX)(Y-EY)\big] = E(XY) - E(X)E(Y)$$
$$\rho_{XY} = \frac{\mathrm{Cov}(X,Y)}{\sigma_X\,\sigma_Y}$$
The second form of the covariance follows by expanding the brackets and is easier to compute.
:::

- $\mathrm{Cov}>0$: when $X$ grows, $Y$ **tends to** grow; $\mathrm{Cov}<0$ — tends to fall. Its size depends on units, which is why we use the **correlation** (the covariance of standardised variables).
- Properties: $|\rho|\le1$; $|\rho| = 1$ ⇔ $Y = aX+b$ with probability 1 (an exact linear relation); correlation is unchanged (in absolute value) under $aX+b$, $cY+d$. {lecture:W05}

::: grid
@chart rhoPos
@chart rhoZero
@chart rhoNeg
:::

::: warn W05 | Uncorrelated ≠ independent
Independent ⇒ $E(XY) = E(X)E(Y)$ ⇒ $\mathrm{Cov} = 0$ (**uncorrelated**). But **not conversely**: correlation measures only **linear** dependence. Example {own}: $X$ takes −1, 0, 1 with probability $\frac13$, $Y = X^2$. Then $E(XY) = E(X^3) = 0 = E(X)E(Y)$, so $\rho=0$, although $Y$ is **completely** determined by $X$.
:::

@chart parabola

::: steps | Covariance from a table
1. Margins → $E(X)$, $E(Y)$, $E(X^2)$, $E(Y^2)$ → $V(X)$, $V(Y)$.
2. $E(XY) = \sum x\,y\,p(x,y)$ — cells with $x=0$ or $y=0$ can be skipped.
3. $\mathrm{Cov} = E(XY) - E(X)E(Y)$, $\rho = \mathrm{Cov}/(\sigma_X\sigma_Y)$.
:::

# In Excel

~~~excel Joint table in B2:D3 (X values in A2:A3, Y values in B1:D1)
E2: =SUM(B2:D2)                                  // p_X of the first row (fill down)
B4: =SUM(B2:B3)                                  // p_Y of the first column (fill right)
G1: =SUMPRODUCT(A2:A3,E2:E3)                     // E(X)
G2: =SUMPRODUCT(B1:D1,B4:D4)                     // E(Y)
G3: =SUMPRODUCT(A2:A3*B1:D1*B2:D3)               // E(XY) (Excel 365; older: Ctrl+Shift+Enter)
G4: =G3-G1*G2                                    // Cov(X,Y)
~~~

~~~python A joint distribution in numpy
import numpy as np
x = np.array([0, 100, 250]); y = np.array([0, 100, 200, 300])
P = np.array([[.10, .15, .15, .05],
              [.05, .05, .10, .10],
              [.05, .05, .05, .10]])
pX, pY = P.sum(axis=1), P.sum(axis=0)          # margins
EX, EY = x @ pX, y @ pY
EXY = x @ P @ y
cov = EXY - EX * EY
rho = cov / np.sqrt((x**2 @ pX - EX**2) * (y**2 @ pY - EY**2))
print(pX, pY, cov, rho, np.allclose(P, np.outer(pX, pY)))   # False = dependent
~~~

::: summary
- Joint table: margins = row and column sums; $F(x_0,y_0)$ = sum of the top-left corner.
- Independence: $p = p_Xp_Y$ in **every** cell ($f = f_Xf_Y$).
- Conditional: row/column ÷ its sum.
- $\mathrm{Cov} = E(XY)-EXEY$, $\rho = \mathrm{Cov}/(\sigma_X\sigma_Y)$, $|\rho|\le1$.
- $V(aX+bY) = a^2VX+b^2VY+2ab\,\mathrm{Cov}$.
- Independent ⇒ uncorrelated; not conversely.
:::
`,

    cheatsheet: md`
## Joint table
- $\sum p(x,y)=1$ → missing $p$
- $p_X$ = row sum, $p_Y$ = column sum
- $F(x_0,y_0)$ = sum of cells with $x\le x_0$, $y\le y_0$
- $P(X=x\mid Y=y) = p(x,y)/p_Y(y)$; $E(X\mid Y=y)=\sum x\,P(X=x\mid Y=y)$

## Independence
- discrete: $p(x,y)=p_X(x)p_Y(y)$ **for every** cell
- continuous: $f=f_Xf_Y$; the support must be a rectangle
- a zero cell with positive margins → dependent

## Joint density
$\iint f=1$ · $f_X=\int f\,dy$ · $f_Y=\int f\,dx$ · $P(A)=\iint_A f$

## Moments
$$\mathrm{Cov}=E(XY)-E(X)E(Y)\qquad \rho=\frac{\mathrm{Cov}}{\sigma_X\sigma_Y}\in[-1,1]$$
$$E(aX+bY)=aEX+bEY$$
$$V(aX+bY)=a^2VX+b^2VY+2ab\,\mathrm{Cov}=a^2\sigma_X^2+b^2\sigma_Y^2+2ab\,\rho\,\sigma_X\sigma_Y$$
- profit = revenue − cost → $V = V_1+V_2-2\,\mathrm{Cov}$
- independent ⇒ $\mathrm{Cov}=0$ (not conversely!)

## Function Z = g(X, Y)
Collect the cells with the same $g(x,y)$ and add them.
`,

    exercises: [
      {
        id: 'e1', tag: 'C07', title: 'Are the variables independent? (2 × 2)',
        text: md`
Check the independence of $X$, $Y$ with joint distribution:
a) $p_{11} = 0.12$, $p_{12} = 0.28$, $p_{21} = 0.18$, $p_{22} = 0.42$;
b) $p_{11} = 0.15$, $p_{12} = 0.25$, $p_{21} = 0.15$, $p_{22} = 0.45$
($p_{ij} = P(X=x_i, Y=y_j)$).
`,
        hint: md`Compute row and column sums and compare the products with the cells.`,
        solution: md`
**a)** Rows: 0.40 and 0.60; columns: 0.30 and 0.70. Products: 0.12 ✓, 0.28 ✓, 0.18 ✓, 0.42 ✓ → **independent**.

**b)** Rows: 0.40 and 0.60; columns: 0.30 and 0.70. Already $p_{11} = 0.15 \ne 0.12$ → **dependent**.
`,
        answer: md`a) independent; b) dependent.`
      },
      {
        id: 'e2', tag: 'C07', title: 'Margins, independence, second moments',
        text: md`
| X \ Y | −2 | 0 | 2 |
|---|---:|---:|---:|
| **1** | 0.20 | 0.15 | 0.15 |
| **3** | 0.10 | 0.15 | 0.25 |

a) Find the marginal distributions. b) Are $X$ and $Y$ independent? c) Compute the raw second moments $E(X^2)$ and $E(Y^2)$.
`,
        hint: md`The raw second moment is $E(X^2) = \sum x^2 p_X(x)$.`,
        solution: md`
**a)** $p_X(1) = 0.5$, $p_X(3) = 0.5$; $p_Y(-2) = 0.3$, $p_Y(0) = 0.3$, $p_Y(2) = 0.4$.
**b)** $p(1,-2) = 0.20 \ne 0.15$ → **dependent**.
**c)** $E(X^2) = 0.5 + 4.5 = 5$; $E(Y^2) = 1.2 + 0 + 1.6 = 2.8$.
`,
        answer: md`$p_X$: 0.5/0.5; $p_Y$: 0.3/0.3/0.4; dependent; $E(X^2)=5$, $E(Y^2)=2.8$.`
      },
      {
        id: 'e3', tag: 'C07', title: 'Means and variances from a table',
        text: md`
| X \ Y | 1 | 2 | 3 |
|---|---:|---:|---:|
| **0** | 0.15 | 0.25 | 0.10 |
| **2** | 0.20 | 0.10 | 0.20 |

Compute $E(X)$, $V(X)$, $E(Y)$, $V(Y)$.
`,
        hint: md`Margins first, then the one-dimensional formulas.`,
        solution: md`
$p_X$: 0.5; 0.5 → $E(X) = 1$, $E(X^2) = 2$, $V(X) = 1$.
$p_Y$: 0.35; 0.35; 0.30 → $E(Y) = 1.95$, $E(Y^2) = 4.45$, $V(Y) = 0.6475$.
`,
        answer: md`$E(X)=1$, $V(X)=1$, $E(Y)=1.95$, $V(Y)=0.6475$.`
      },
      {
        id: 'e4', tag: 'C07', title: 'CDF, conditions and independence 3 × 3',
        text: md`
| X \ Y | 1 | 2 | 3 |
|---|---:|---:|---:|
| **0** | 0.05 | 0.15 | 0.10 |
| **1** | 0.10 | 0 | 0.10 |
| **2** | 0.15 | 0.25 | 0.10 |

a) Find the expected values of the marginals. b) Are $X$ and $Y$ independent? c) Compute $F(1, 2)$, $F(1.5;\,3.5)$, $P(X<2\mid Y>2)$ and $P(Y=y\mid X=2)$ for $y = 1,2,3$.
`,
        hint: md`The zero in cell (1, 2) with positive margins settles independence. $F(1.5;3.5) = P(X\le1)$.`,
        solution: md`
**a)** $p_X$: 0.30; 0.20; 0.50 → $E(X) = 1.2$. $p_Y$: 0.30; 0.40; 0.30 → $E(Y) = 2.0$.
**b)** $p(1,2) = 0 \ne 0.2\cdot0.4$ → **dependent**.
**c)** $F(1,2) = 0.30$; $F(1.5;3.5) = P(X\le1) = 0.50$; $P(X<2\mid Y>2) = \frac{0.20}{0.30} = \frac23$; $Y\mid X=2$: 0.3; 0.5; 0.2.
`,
        answer: md`$E(X)=1.2$, $E(Y)=2$; dependent; $F(1,2)=0.3$; $F(1.5;3.5)=0.5$; $\frac23$; 0.3/0.5/0.2.`
      },
      {
        id: 'e5', tag: 'C07', title: 'Joint density — constant, margins, independence',
        text: md`
$f(x,y) = c\,x\,y^2$ for $0\le x\le1$, $0\le y\le3$ (0 elsewhere). a) Find $c$. b) Find the marginal densities. c) Compute $P(Y>2)$. d) Are $X$ and $Y$ independent?
`,
        hint: md`The integral “splits”: $\int_0^1x\,dx\cdot\int_0^3y^2dy$.`,
        solution: md`
**a)** $c\cdot\frac12\cdot9 = 1 \Rightarrow c = \frac29$.
**b)** $f_X(x) = 2x$ on $[0;1]$; $f_Y(y) = \frac{y^2}{9}$ on $[0;3]$.
**c)** $P(Y>2) = \frac{27-8}{27} = \frac{19}{27}\approx0.704$.
**d)** $f_X f_Y = f$ → **independent**.
`,
        answer: md`$c=\frac29$; $f_X=2x$, $f_Y=y^2/9$; $P(Y>2)=\frac{19}{27}$; independent.`
      },
      {
        id: 'e6', tag: 'C07', title: 'Density k(x + y)',
        text: md`
Find $k$ so that $f(x,y) = k(x+y)$ for $0\le x\le1$, $0\le y\le2$ (0 elsewhere) is a density. Compute $F(0.5;\,1)$ and the marginal densities. Are the variables independent?
`,
        hint: md`$\int_0^1\int_0^2(x+y)\,dy\,dx = \int_0^1(2x+2)\,dx$.`,
        solution: md`
$\int_0^1(2x+2)dx = 3 \Rightarrow k = \frac13$.
$F(0.5;1) = \frac13\int_0^{0.5}\left(x+\frac12\right)dx = 0.125$.
$f_X(x) = \frac{2x+2}{3}$ on $[0;1]$; $f_Y(y) = \frac{1+2y}{6}$ on $[0;2]$.
At $(0,0)$: $f = 0$ but $f_Xf_Y = \frac23\cdot\frac16\ne0$ → **dependent**.
`,
        answer: md`$k=\frac13$; $F(0.5;1)=0.125$; $f_X=\frac{2x+2}{3}$, $f_Y=\frac{1+2y}{6}$; dependent.`
      },
      {
        id: 'e7', tag: 'C09', title: 'Same margins, different joint distributions',
        text: md`
| X \ Y | 0 | 1 |
|---|---:|---:|
| **0** | $\frac14+\varepsilon$ | $\frac14-\varepsilon$ |
| **1** | $\frac14-\varepsilon$ | $\frac14+\varepsilon$ |

where $\varepsilon\in\left[-\frac14;\frac14\right]$. Find the marginal distributions. Do they depend on $\varepsilon$? For which $\varepsilon$ are the variables independent? What do you conclude?
`,
        hint: md`Add the cells in rows and columns — $\varepsilon$ cancels.`,
        solution: md`
Every row and column sums to $\frac12$, so $p_X = p_Y = (\frac12, \frac12)$ **regardless of $\varepsilon$**. Independence requires $\varepsilon = 0$.
**Conclusion:** the marginals **do not determine** the joint distribution — describing a pair needs the whole table (the information about dependence). For $\varepsilon>0$ the variables “like” to be equal (positive correlation), for $\varepsilon<0$ — different.
`,
        answer: md`Margins always (½, ½), independent of $\varepsilon$; independent only for $\varepsilon=0$.`
      },
      {
        id: 'e8', tag: 'C09', title: 'Missing p, CDF and correlation',
        text: md`
| X \ Y | 1 | 2 | 3 |
|---|---:|---:|---:|
| **0** | 0.1 | 0.2 | 0.1 |
| **1** | 0.2 | $p$ | 0.1 |

a) Find $p$. b) Compute $F(0, 2)$ and $F(0.5;\,5)$. c) Find the margins and check independence. d) Are $X$, $Y$ correlated? How strongly?
`,
        hint: md`d) $E(XY)$: only the row $X=1$ gives non-zero products.`,
        solution: md`
**a)** $p = 0.3$. **b)** $F(0,2) = 0.3$; $F(0.5;5) = P(X\le0) = 0.4$.
**c)** $p_X$: 0.4; 0.6. $p_Y$: 0.3; 0.5; 0.2. $p(0,1) = 0.1\ne0.12$ → **dependent**.
**d)** $E(X) = 0.6$, $V(X) = 0.24$; $E(Y) = 1.9$, $V(Y) = 0.49$; $E(XY) = 1.1$; $\mathrm{Cov} = -0.04$; $\rho\approx-0.117$ — a **weak negative** correlation.
`,
        answer: md`$p=0.3$; $F(0,2)=0.3$; $F(0.5;5)=0.4$; dependent; $\mathrm{Cov}=-0.04$, $\rho\approx-0.117$.`
      },
      {
        id: 'e9', tag: 'C09', title: 'Covariance and the variable 2X + Y',
        text: md`
| X \ Y | 0 | 1 |
|---|---:|---:|
| **0** | 0.15 | 0.10 |
| **1** | 0.20 | 0.15 |
| **2** | 0.10 | $a$ |

a) Find $a$ and $P(1\le X\le2,\ Y<4)$, $P(X=1\mid Y=0)$, $P(Y=1\mid X=0)$.
b) Find the margins and check independence. c) Compute $\mathrm{Cov}(X,Y)$. d) Find $E(2X+Y)$ and $V(2X+Y)$.
`,
        hint: md`$Y<4$ always holds. d) $V(2X+Y) = 4V(X)+V(Y)+4\,\mathrm{Cov}(X,Y)$.`,
        solution: md`
**a)** $a = 0.30$. $P(X\in\{1,2\}) = 0.75$; $P(X=1\mid Y=0) = \frac{0.20}{0.45}\approx0.444$; $P(Y=1\mid X=0) = 0.4$.
**b)** $p_X$: 0.25; 0.35; 0.40. $p_Y$: 0.45; 0.55 → **dependent**.
**c)** $E(X) = 1.15$, $V(X) = 0.6275$; $E(Y) = 0.55$, $V(Y) = 0.2475$; $E(XY) = 0.75$; $\mathrm{Cov} = 0.1175$.
**d)** $E(2X+Y) = 2.85$; $V(2X+Y) = 2.51+0.2475+0.47 = 3.2275$.
`,
        answer: md`$a=0.3$; 0.75; ≈ 0.444; 0.4; dependent; $\mathrm{Cov}=0.1175$; $E=2.85$; $V=3.2275$.`
      },
      {
        id: 'e10', tag: 'C09', title: 'Uncorrelated, yet dependent',
        text: md`
$X$ takes the values −1, 0, 1 with probability $\frac13$ each, and $Y = X^2$. Write the joint table of $(X, Y)$, compute $\mathrm{Cov}(X,Y)$ and check independence.
`,
        hint: md`$Y$ takes only 0 and 1. Check the cell $(0, 1)$.`,
        solution: md`
| X \ Y | 0 | 1 |
|---|---:|---:|
| **−1** | 0 | 1/3 |
| **0** | 1/3 | 0 |
| **1** | 0 | 1/3 |

$E(X) = 0$, $E(XY) = E(X^3) = 0$ → $\mathrm{Cov} = 0$ — **uncorrelated**. But $p(0,1) = 0\ne\frac13\cdot\frac23$ → **dependent**. Correlation detects only linear dependence; this one is “parabolic”.
`,
        answer: md`$\mathrm{Cov}=0$ (uncorrelated), but the variables are dependent.`
      },
      {
        id: 'e11', tag: 'C09', title: 'A café’s profit',
        text: md`
A café sells on average 300 coffees a day (s.d. 40) and 150 croissants (s.d. 25). The correlation between coffees and croissants sold is 0.5. Profit per coffee is 2.50 PLN, per croissant 1.50 PLN. Find the mean daily profit and its standard deviation.
`,
        hint: md`$Z = 2.5K + 1.5R$; $\mathrm{Cov}(K,R) = \rho\,\sigma_K\sigma_R$.`,
        solution: md`
$E(Z) = 750+225 = 975$ PLN. $\mathrm{Cov} = 0.5\cdot40\cdot25 = 500$.
$V(Z) = 6.25\cdot1600 + 2.25\cdot625 + 2\cdot2.5\cdot1.5\cdot500 = 15{,}156.25$, $\sigma_Z\approx123.1$ PLN.
`,
        answer: md`$E(Z)=975$ PLN, $\sigma_Z\approx123.1$ PLN.`
      },
      {
        id: 'e12', tag: 'C09', title: 'Profit = revenue − costs',
        text: md`
A firm’s monthly revenue has mean 50k PLN and s.d. 5k PLN; costs have mean 35k PLN and s.d. 4k PLN. The correlation between revenue and costs is 0.6. Find the expected value and standard deviation of the monthly profit.
`,
        hint: md`$V(P-K) = V(P)+V(K)-2\,\mathrm{Cov}(P,K)$ — a positive correlation **reduces** profit variability.`,
        solution: md`
$E = 15$k PLN. $V = 25+16-2\cdot0.6\cdot5\cdot4 = 17$, $\sigma = \sqrt{17}\approx4.12$k PLN.
When costs rise together with revenue, profit fluctuates less than without correlation ($\sqrt{41}\approx6.4$).
`,
        answer: md`$E=15$k PLN, $\sigma\approx4.12$k PLN.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'Две величины сразу: рост и вес, выручка и затраты. Учимся читать **таблицу совместного распределения**, находить маргинальные и условные распределения, проверять независимость и измерять зависимость **ковариацией** и **корреляцией**.',
    lecture: md`
# Двумерная случайная величина

Часто в одном эксперименте мы наблюдаем **несколько связанных** величин, и знания каждой по отдельности недостаточно. {lecture:W05}

::: def W05 | Двумерная величина и её функция распределения
$(X, Y)$ — пара случайных величин на одном пространстве $\Omega$. **Совместная функция распределения**:
$$F(x, y) = P(X\le x,\ Y\le y)$$
— вероятность того, что точка $(X, Y)$ попадёт в «четверть» левее и ниже точки $(x, y)$.
:::

Необходимые и достаточные условия для двумерной функции распределения: пределы 0 в $-\infty$ и 1 в $+\infty$, монотонность и непрерывность справа по каждой переменной, а также **условие прямоугольника**: $F(x_1,y_1)+F(x_2,y_2)-F(x_1,y_2)-F(x_2,y_1)\ge0$ при $x_1<x_2$, $y_1<y_2$ (это вероятность прямоугольника, она не может быть отрицательной). Функция, равная 1 при $x+y\ge1$, $x,y\ge0$, удовлетворяет первым трём условиям, но для квадрата $[0,1]^2$ даёт $-1$ — это не функция распределения. {lecture:W05}

# Дискретный случай: таблица совместного распределения

::: def | Совместное и маргинальные распределения
$p(x, y) = P(X=x,\ Y=y)$, где $p(x,y)\ge0$ и $\sum_x\sum_y p(x,y) = 1$.
**Маргинальные (частные) распределения** — суммы по строкам и столбцам:
$$p_X(x) = \sum_y p(x,y),\qquad p_Y(y) = \sum_x p(x,y)$$
:::

::: example W05 | Скидки в страховой компании
$X$ — скидка на автостраховку, $Y$ — на страховку жилья (зл):

| X \ Y | 0 | 100 | 200 | 300 | $p_X$ |
|---|---:|---:|---:|---:|---:|
| **0** | 0,10 | 0,15 | 0,15 | 0,05 | **0,45** |
| **100** | 0,05 | 0,05 | 0,10 | 0,10 | **0,30** |
| **250** | 0,05 | 0,05 | 0,05 | 0,10 | **0,25** |
| $p_Y$ | **0,20** | **0,25** | **0,30** | **0,25** | 1 |

$P(Y\ge200) = p_Y(200)+p_Y(300) = 0{,}30+0{,}25 = 0{,}55$.
:::

::: intuition
Совместная таблица — «карта» всех возможных пар. Маргинальное распределение — взгляд на эту карту **сбоку**: видна только одна величина, потому что другую мы «просуммировали». Отсюда название: суммы пишут **на полях** (margin) таблицы.
:::

::: tip own | Функция распределения по таблице
$F(x_0,y_0) = P(X\le x_0, Y\le y_0)$ = сумма клеток в **левом верхнем углу** (строки $x\le x_0$, столбцы $y\le y_0$). Аргументы вне носителя (например, $F(1{,}5;\,3{,}5)$) округляйте «вниз» до ближайших точек носителя.
:::

# Непрерывный случай: совместная плотность

::: def W05 | Совместная плотность
$f(x,y)\ge0$, $\iint_{\mathbb R^2}f\,dx\,dy = 1$ и $P((X,Y)\in A) = \iint_A f(x,y)\,dx\,dy$. Тогда
$$F(x,y) = \int_{-\infty}^x\int_{-\infty}^y f(u,v)\,dv\,du,\qquad f = \frac{\partial^2F}{\partial x\,\partial y},$$
$$f_X(x) = \int_{-\infty}^{\infty} f(x,y)\,dy,\qquad f_Y(y) = \int_{-\infty}^{\infty} f(x,y)\,dx.$$
:::

::: example W05 | Окошки в фастфуде
$X$, $Y$ — доли времени, когда занято окошко для водителей / для пешеходов; $f(x,y) = \frac65(x+y^2)$ на $[0,1]^2$.
- Проверка: $\iint\frac65(x+y^2) = \frac65\left(\frac12+\frac13\right) = 1$ ✓.
- $P(X\le0{,}25,\ Y\le0{,}25) = \frac{7}{640}\approx0{,}0109$.
- $f_X(x) = \frac65x+\frac25$, $\;f_Y(y) = \frac65y^2+\frac35$, $\;P(0{,}25\le Y\le0{,}75) = \frac{37}{80} = 0{,}4625$.
:::

# Независимость

::: def W05 | Независимость
$X$ и $Y$ **независимы**, если $F(x,y) = F_X(x)F_Y(y)$ для всех $x, y$. На практике:
- **дискретные**: $p(x,y) = p_X(x)\,p_Y(y)$ для **каждой** клетки таблицы,
- **непрерывные**: $f(x,y) = f_X(x)\,f_Y(y)$.
:::

::: steps | Как проверить независимость по таблице
1. Посчитайте суммы строк ($p_X$) и столбцов ($p_Y$).
2. Для каждой клетки сравните $p(x,y)$ с $p_X(x)\cdot p_Y(y)$.
3. **Одной** несовпадающей клетки достаточно → зависимы. Независимость требует совпадения **везде**.
4. Быстрый тест: ноль в клетке при $p_X>0$ и $p_Y>0$ → сразу **зависимы**.
:::

::: example W05
В таблице скидок: $p(0,0) = 0{,}10 \ne 0{,}45\cdot0{,}20 = 0{,}09$ → $X$ и $Y$ **зависимы**. У независимых величин с теми же маргиналами было бы «произведение» $p_X(x)p_Y(y)$, например 0,09 в первой клетке.
:::

::: note W05
Для непрерывных: если величины независимы, то область, где $f>0$, — **прямоугольник** (произведение носителей). Плотность $24xy$ на треугольнике $x+y\le1$ сразу даёт **зависимые** величины.
:::

::: example W05 | Два независимых устройства
Сроки службы $X\sim Exp(\lambda_1)$, $Y\sim Exp(\lambda_2)$ независимы, $\lambda_1 = \frac1{1000}$, $\lambda_2 = \frac1{1200}$. Оба проработают 1500 ч:
$$P(X\ge1500, Y\ge1500) = e^{-1500/1000}\cdot e^{-1500/1200} = 0{,}2231\cdot0{,}2865 \approx 0{,}0639$$
:::

# Условные распределения

::: def W05 | Условное распределение (дискретное)
$$P(X=x\mid Y=y) = \frac{p(x,y)}{p_Y(y)},\qquad E(X\mid Y=y) = \sum_x x\,P(X=x\mid Y=y)$$
То есть: берём **одну строку/столбец** таблицы и делим на её сумму. В непрерывном случае: $f_{X|Y}(x|y) = \frac{f(x,y)}{f_Y(y)}$.
:::

::: example W05 | Y при условии X = 100
Строка $X=100$: 0,05; 0,05; 0,10; 0,10 (сумма 0,30). После деления: $\frac16, \frac16, \frac26, \frac26$.
$$E(Y\mid X=100) = 0\cdot\tfrac16+100\cdot\tfrac16+200\cdot\tfrac26+300\cdot\tfrac26 = \tfrac{1100}{6}\approx183{,}33$$
:::

# Функции двух величин

Для $Z = g(X, Y)$ (дискретных): $P(Z = z) = \sum\limits_{g(x,y)=z}p(x,y)$ — собираем все клетки, дающие одно и то же значение $z$. {lecture:W05}

::: example W05 | Сумма и максимум
| X \ Y | 0 | 1 | 2 | 3 |
|---|---:|---:|---:|---:|
| **0** | 0,1 | 0,1 | 0,2 | 0,1 |
| **1** | 0,1 | 0,1 | 0,1 | 0,0 |
| **2** | 0,1 | 0,0 | 0,0 | 0,1 |

$T = X+Y$: $P(T=0) = 0{,}1$; $P(T=1) = 0{,}2$; $P(T=2) = 0{,}4$; $P(T=3) = 0{,}2$; $P(T=4) = 0$; $P(T=5) = 0{,}1$.
$U = \max(X,Y)$: $P(U=0) = 0{,}1$; $P(U=1) = 0{,}3$; $P(U=2) = 0{,}4$; $P(U=3) = 0{,}2$.
:::

# Математическое ожидание, ковариация, корреляция

$$E[h(X,Y)] = \sum_x\sum_y h(x,y)\,p(x,y)\quad\text{или}\quad\iint h(x,y)f(x,y)\,dx\,dy$$

::: formula W05 | Линейная комбинация
$$E(aX+bY) = aE(X)+bE(Y)$$
$$V(aX+bY) = a^2V(X) + b^2V(Y) + 2ab\,\mathrm{Cov}(X,Y)$$
:::

::: def W05 | Ковариация и коэффициент корреляции
$$\mathrm{Cov}(X,Y) = E\big[(X-EX)(Y-EY)\big] = E(XY) - E(X)E(Y)$$
$$\rho_{XY} = \frac{\mathrm{Cov}(X,Y)}{\sigma_X\,\sigma_Y}$$
Вторая форма ковариации получается раскрытием скобок и удобнее для расчётов.
:::

- $\mathrm{Cov}>0$: когда $X$ растёт, $Y$ **скорее** растёт; $\mathrm{Cov}<0$ — скорее падает. Величина ковариации зависит от единиц измерения, поэтому используют **корреляцию** (ковариацию стандартизованных величин).
- Свойства: $|\rho|\le1$; $|\rho| = 1$ ⇔ $Y = aX+b$ с вероятностью 1 (точная линейная связь); корреляция не меняется (по модулю) при $aX+b$, $cY+d$. {lecture:W05}

::: grid
@chart rhoPos
@chart rhoZero
@chart rhoNeg
:::

::: warn W05 | Некоррелированные ≠ независимые
Независимы ⇒ $E(XY) = E(X)E(Y)$ ⇒ $\mathrm{Cov} = 0$ (**некоррелированы**). Но **не наоборот**: корреляция измеряет только **линейную** зависимость. Пример {own}: $X$ принимает −1, 0, 1 с вероятностью $\frac13$, $Y = X^2$. Тогда $E(XY) = E(X^3) = 0 = E(X)E(Y)$, значит $\rho=0$, хотя $Y$ **полностью** определяется $X$.
:::

@chart parabola

::: steps | Ковариация по таблице
1. Маргиналы → $E(X)$, $E(Y)$, $E(X^2)$, $E(Y^2)$ → $V(X)$, $V(Y)$.
2. $E(XY) = \sum x\,y\,p(x,y)$ — клетки с $x=0$ или $y=0$ можно пропустить.
3. $\mathrm{Cov} = E(XY) - E(X)E(Y)$, $\rho = \mathrm{Cov}/(\sigma_X\sigma_Y)$.
:::

# В Excel

~~~excel Совместная таблица в B2:D3 (значения X в A2:A3, Y в B1:D1)
E2: =SUM(B2:D2)                                  // p_X первой строки (протяните вниз)
B4: =SUM(B2:B3)                                  // p_Y первого столбца (протяните вправо)
G1: =SUMPRODUCT(A2:A3,E2:E3)                     // E(X)
G2: =SUMPRODUCT(B1:D1,B4:D4)                     // E(Y)
G3: =SUMPRODUCT(A2:A3*B1:D1*B2:D3)               // E(XY) (Excel 365; в старых — Ctrl+Shift+Enter)
G4: =G3-G1*G2                                    // Cov(X,Y)
~~~

~~~python Совместное распределение в numpy
import numpy as np
x = np.array([0, 100, 250]); y = np.array([0, 100, 200, 300])
P = np.array([[.10, .15, .15, .05],
              [.05, .05, .10, .10],
              [.05, .05, .05, .10]])
pX, pY = P.sum(axis=1), P.sum(axis=0)          # маргиналы
EX, EY = x @ pX, y @ pY
EXY = x @ P @ y
cov = EXY - EX * EY
rho = cov / np.sqrt((x**2 @ pX - EX**2) * (y**2 @ pY - EY**2))
print(pX, pY, cov, rho, np.allclose(P, np.outer(pX, pY)))   # False = зависимы
~~~

::: summary
- Совместная таблица: маргиналы = суммы строк и столбцов; $F(x_0,y_0)$ = сумма левого верхнего угла.
- Независимость: $p = p_Xp_Y$ в **каждой** клетке ($f = f_Xf_Y$).
- Условное: строка/столбец ÷ её сумма.
- $\mathrm{Cov} = E(XY)-EXEY$, $\rho = \mathrm{Cov}/(\sigma_X\sigma_Y)$, $|\rho|\le1$.
- $V(aX+bY) = a^2VX+b^2VY+2ab\,\mathrm{Cov}$.
- Независимы ⇒ некоррелированы; обратное неверно.
:::
`,

    cheatsheet: md`
## Совместная таблица
- $\sum p(x,y)=1$ → недостающее $p$
- $p_X$ = сумма строки, $p_Y$ = сумма столбца
- $F(x_0,y_0)$ = сумма клеток с $x\le x_0$, $y\le y_0$
- $P(X=x\mid Y=y) = p(x,y)/p_Y(y)$; $E(X\mid Y=y)=\sum x\,P(X=x\mid Y=y)$

## Независимость
- дискретные: $p(x,y)=p_X(x)p_Y(y)$ **для каждой** клетки
- непрерывные: $f=f_Xf_Y$; носитель — прямоугольник
- ноль в таблице при положительных маргиналах → зависимы

## Совместная плотность
$\iint f=1$ · $f_X=\int f\,dy$ · $f_Y=\int f\,dx$ · $P(A)=\iint_A f$

## Моменты
$$\mathrm{Cov}=E(XY)-E(X)E(Y)\qquad \rho=\frac{\mathrm{Cov}}{\sigma_X\sigma_Y}\in[-1,1]$$
$$E(aX+bY)=aEX+bEY$$
$$V(aX+bY)=a^2VX+b^2VY+2ab\,\mathrm{Cov}=a^2\sigma_X^2+b^2\sigma_Y^2+2ab\,\rho\,\sigma_X\sigma_Y$$
- прибыль = выручка − затраты → $V = V_1+V_2-2\,\mathrm{Cov}$
- независимы ⇒ $\mathrm{Cov}=0$ (обратное неверно!)

## Функция Z = g(X, Y)
Соберите клетки с одинаковым $g(x,y)$ и сложите.
`,

    exercises: [
      {
        id: 'e1', tag: 'C07', title: 'Независимы ли величины? (2 × 2)',
        text: md`
Проверьте независимость $X$, $Y$ с совместным распределением:
а) $p_{11} = 0{,}12$, $p_{12} = 0{,}28$, $p_{21} = 0{,}18$, $p_{22} = 0{,}42$;
б) $p_{11} = 0{,}15$, $p_{12} = 0{,}25$, $p_{21} = 0{,}15$, $p_{22} = 0{,}45$
($p_{ij} = P(X=x_i, Y=y_j)$).
`,
        hint: md`Посчитайте суммы строк и столбцов и сравните произведения с клетками.`,
        solution: md`
**а)** Строки: 0,40 и 0,60; столбцы: 0,30 и 0,70. Произведения: 0,12 ✓, 0,28 ✓, 0,18 ✓, 0,42 ✓ → **независимы**.

**б)** Строки: 0,40 и 0,60; столбцы: 0,30 и 0,70. Уже $p_{11} = 0{,}15 \ne 0{,}12$ → **зависимы**.
`,
        answer: md`а) независимы; б) зависимы.`
      },
      {
        id: 'e2', tag: 'C07', title: 'Маргиналы, независимость, моменты второго порядка',
        text: md`
| X \ Y | −2 | 0 | 2 |
|---|---:|---:|---:|
| **1** | 0,20 | 0,15 | 0,15 |
| **3** | 0,10 | 0,15 | 0,25 |

а) Найдите маргинальные распределения. б) Независимы ли $X$ и $Y$? в) Найдите начальные моменты второго порядка $E(X^2)$ и $E(Y^2)$.
`,
        hint: md`Начальный момент второго порядка: $E(X^2) = \sum x^2 p_X(x)$.`,
        solution: md`
**а)** $p_X(1) = 0{,}5$, $p_X(3) = 0{,}5$; $p_Y(-2) = 0{,}3$, $p_Y(0) = 0{,}3$, $p_Y(2) = 0{,}4$.
**б)** $p(1,-2) = 0{,}20 \ne 0{,}15$ → **зависимы**.
**в)** $E(X^2) = 0{,}5 + 4{,}5 = 5$; $E(Y^2) = 1{,}2 + 0 + 1{,}6 = 2{,}8$.
`,
        answer: md`$p_X$: 0,5/0,5; $p_Y$: 0,3/0,3/0,4; зависимы; $E(X^2)=5$, $E(Y^2)=2{,}8$.`
      },
      {
        id: 'e3', tag: 'C07', title: 'Средние и дисперсии по таблице',
        text: md`
| X \ Y | 1 | 2 | 3 |
|---|---:|---:|---:|
| **0** | 0,15 | 0,25 | 0,10 |
| **2** | 0,20 | 0,10 | 0,20 |

Найдите $E(X)$, $V(X)$, $E(Y)$, $V(Y)$.
`,
        hint: md`Сначала маргиналы, затем одномерные формулы.`,
        solution: md`
$p_X$: 0,5; 0,5 → $E(X) = 1$, $E(X^2) = 2$, $V(X) = 1$.
$p_Y$: 0,35; 0,35; 0,30 → $E(Y) = 1{,}95$, $E(Y^2) = 4{,}45$, $V(Y) = 0{,}6475$.
`,
        answer: md`$E(X)=1$, $V(X)=1$, $E(Y)=1{,}95$, $V(Y)=0{,}6475$.`
      },
      {
        id: 'e4', tag: 'C07', title: 'Функция распределения, условия и независимость 3 × 3',
        text: md`
| X \ Y | 1 | 2 | 3 |
|---|---:|---:|---:|
| **0** | 0,05 | 0,15 | 0,10 |
| **1** | 0,10 | 0 | 0,10 |
| **2** | 0,15 | 0,25 | 0,10 |

а) Найдите математические ожидания маргиналов. б) Независимы ли $X$ и $Y$? в) Найдите $F(1, 2)$, $F(1{,}5;\,3{,}5)$, $P(X<2\mid Y>2)$ и $P(Y=y\mid X=2)$ для $y = 1,2,3$.
`,
        hint: md`Ноль в клетке (1, 2) при положительных маргиналах решает вопрос о независимости. $F(1{,}5;3{,}5) = P(X\le1)$.`,
        solution: md`
**а)** $p_X$: 0,30; 0,20; 0,50 → $E(X) = 1{,}2$. $p_Y$: 0,30; 0,40; 0,30 → $E(Y) = 2{,}0$.
**б)** $p(1,2) = 0 \ne 0{,}2\cdot0{,}4$ → **зависимы**.
**в)** $F(1,2) = 0{,}30$; $F(1{,}5;3{,}5) = P(X\le1) = 0{,}50$; $P(X<2\mid Y>2) = \frac{0{,}20}{0{,}30} = \frac23$; $Y\mid X=2$: 0,3; 0,5; 0,2.
`,
        answer: md`$E(X)=1{,}2$, $E(Y)=2$; зависимы; $F(1,2)=0{,}3$; $F(1{,}5;3{,}5)=0{,}5$; $\frac23$; 0,3/0,5/0,2.`
      },
      {
        id: 'e5', tag: 'C07', title: 'Совместная плотность — константа, маргиналы, независимость',
        text: md`
$f(x,y) = c\,x\,y^2$ при $0\le x\le1$, $0\le y\le3$ (0 вне). а) Найдите $c$. б) Найдите маргинальные плотности. в) Найдите $P(Y>2)$. г) Независимы ли $X$ и $Y$?
`,
        hint: md`Интеграл «распадается»: $\int_0^1x\,dx\cdot\int_0^3y^2dy$.`,
        solution: md`
**а)** $c\cdot\frac12\cdot9 = 1 \Rightarrow c = \frac29$.
**б)** $f_X(x) = 2x$ на $[0;1]$; $f_Y(y) = \frac{y^2}{9}$ на $[0;3]$.
**в)** $P(Y>2) = \frac{27-8}{27} = \frac{19}{27}\approx0{,}704$.
**г)** $f_X f_Y = f$ → **независимы**.
`,
        answer: md`$c=\frac29$; $f_X=2x$, $f_Y=y^2/9$; $P(Y>2)=\frac{19}{27}$; независимы.`
      },
      {
        id: 'e6', tag: 'C07', title: 'Плотность k(x + y)',
        text: md`
Найдите $k$, при котором $f(x,y) = k(x+y)$ при $0\le x\le1$, $0\le y\le2$ (0 вне) — плотность. Найдите $F(0{,}5;\,1)$ и маргинальные плотности. Независимы ли величины?
`,
        hint: md`$\int_0^1\int_0^2(x+y)\,dy\,dx = \int_0^1(2x+2)\,dx$.`,
        solution: md`
$\int_0^1(2x+2)dx = 3 \Rightarrow k = \frac13$.
$F(0{,}5;1) = \frac13\int_0^{0{,}5}\left(x+\frac12\right)dx = 0{,}125$.
$f_X(x) = \frac{2x+2}{3}$ на $[0;1]$; $f_Y(y) = \frac{1+2y}{6}$ на $[0;2]$.
В точке $(0,0)$: $f = 0$, а $f_Xf_Y = \frac23\cdot\frac16\ne0$ → **зависимы**.
`,
        answer: md`$k=\frac13$; $F(0{,}5;1)=0{,}125$; $f_X=\frac{2x+2}{3}$, $f_Y=\frac{1+2y}{6}$; зависимы.`
      },
      {
        id: 'e7', tag: 'C09', title: 'Одинаковые маргиналы, разные совместные распределения',
        text: md`
| X \ Y | 0 | 1 |
|---|---:|---:|
| **0** | $\frac14+\varepsilon$ | $\frac14-\varepsilon$ |
| **1** | $\frac14-\varepsilon$ | $\frac14+\varepsilon$ |

где $\varepsilon\in\left[-\frac14;\frac14\right]$. Найдите маргинальные распределения. Зависят ли они от $\varepsilon$? При каком $\varepsilon$ величины независимы? Какой вывод?
`,
        hint: md`Сложите клетки по строкам и столбцам — $\varepsilon$ сокращается.`,
        solution: md`
Каждая строка и столбец дают $\frac12$, значит $p_X = p_Y = (\frac12, \frac12)$ **при любом $\varepsilon$**. Независимость требует $\varepsilon = 0$.
**Вывод:** маргиналы **не определяют** совместное распределение — для описания пары нужна вся таблица (информация о зависимости). При $\varepsilon>0$ величины «любят» совпадать (положительная корреляция), при $\varepsilon<0$ — различаться.
`,
        answer: md`Маргиналы всегда (½, ½), от $\varepsilon$ не зависят; независимы только при $\varepsilon=0$.`
      },
      {
        id: 'e8', tag: 'C09', title: 'Недостающее p, функция распределения и корреляция',
        text: md`
| X \ Y | 1 | 2 | 3 |
|---|---:|---:|---:|
| **0** | 0,1 | 0,2 | 0,1 |
| **1** | 0,2 | $p$ | 0,1 |

а) Найдите $p$. б) Найдите $F(0, 2)$ и $F(0{,}5;\,5)$. в) Найдите маргиналы и проверьте независимость. г) Коррелированы ли $X$, $Y$? Насколько сильно?
`,
        hint: md`г) $E(XY)$: ненулевые произведения даёт только строка $X=1$.`,
        solution: md`
**а)** $p = 0{,}3$. **б)** $F(0,2) = 0{,}3$; $F(0{,}5;5) = P(X\le0) = 0{,}4$.
**в)** $p_X$: 0,4; 0,6. $p_Y$: 0,3; 0,5; 0,2. $p(0,1) = 0{,}1\ne0{,}12$ → **зависимы**.
**г)** $E(X) = 0{,}6$, $V(X) = 0{,}24$; $E(Y) = 1{,}9$, $V(Y) = 0{,}49$; $E(XY) = 1{,}1$; $\mathrm{Cov} = -0{,}04$; $\rho\approx-0{,}117$ — **слабая отрицательная** корреляция.
`,
        answer: md`$p=0{,}3$; $F(0,2)=0{,}3$; $F(0{,}5;5)=0{,}4$; зависимы; $\mathrm{Cov}=-0{,}04$, $\rho\approx-0{,}117$.`
      },
      {
        id: 'e9', tag: 'C09', title: 'Ковариация и величина 2X + Y',
        text: md`
| X \ Y | 0 | 1 |
|---|---:|---:|
| **0** | 0,15 | 0,10 |
| **1** | 0,20 | 0,15 |
| **2** | 0,10 | $a$ |

а) Найдите $a$ и $P(1\le X\le2,\ Y<4)$, $P(X=1\mid Y=0)$, $P(Y=1\mid X=0)$.
б) Найдите маргиналы и проверьте независимость. в) Найдите $\mathrm{Cov}(X,Y)$. г) Найдите $E(2X+Y)$ и $V(2X+Y)$.
`,
        hint: md`$Y<4$ выполняется всегда. г) $V(2X+Y) = 4V(X)+V(Y)+4\,\mathrm{Cov}(X,Y)$.`,
        solution: md`
**а)** $a = 0{,}30$. $P(X\in\{1,2\}) = 0{,}75$; $P(X=1\mid Y=0) = \frac{0{,}20}{0{,}45}\approx0{,}444$; $P(Y=1\mid X=0) = 0{,}4$.
**б)** $p_X$: 0,25; 0,35; 0,40. $p_Y$: 0,45; 0,55 → **зависимы**.
**в)** $E(X) = 1{,}15$, $V(X) = 0{,}6275$; $E(Y) = 0{,}55$, $V(Y) = 0{,}2475$; $E(XY) = 0{,}75$; $\mathrm{Cov} = 0{,}1175$.
**г)** $E(2X+Y) = 2{,}85$; $V(2X+Y) = 2{,}51+0{,}2475+0{,}47 = 3{,}2275$.
`,
        answer: md`$a=0{,}3$; 0,75; ≈ 0,444; 0,4; зависимы; $\mathrm{Cov}=0{,}1175$; $E=2{,}85$; $V=3{,}2275$.`
      },
      {
        id: 'e10', tag: 'C09', title: 'Некоррелированы, но зависимы',
        text: md`
$X$ принимает значения −1, 0, 1 с вероятностью $\frac13$ каждое, а $Y = X^2$. Запишите таблицу совместного распределения $(X, Y)$, найдите $\mathrm{Cov}(X,Y)$ и проверьте независимость.
`,
        hint: md`$Y$ принимает только 0 и 1. Проверьте клетку $(0, 1)$.`,
        solution: md`
| X \ Y | 0 | 1 |
|---|---:|---:|
| **−1** | 0 | 1/3 |
| **0** | 1/3 | 0 |
| **1** | 0 | 1/3 |

$E(X) = 0$, $E(XY) = E(X^3) = 0$ → $\mathrm{Cov} = 0$ — **некоррелированы**. Но $p(0,1) = 0\ne\frac13\cdot\frac23$ → **зависимы**. Корреляция ловит только линейную зависимость, а здесь она «параболическая».
`,
        answer: md`$\mathrm{Cov}=0$ (некоррелированы), но величины зависимы.`
      },
      {
        id: 'e11', tag: 'C09', title: 'Прибыль кофейни',
        text: md`
Кофейня продаёт в день в среднем 300 чашек кофе (ст. откл. 40) и 150 круассанов (ст. откл. 25). Коэффициент корреляции продаж кофе и круассанов 0,5. Прибыль с кофе — 2,50 зл, с круассана — 1,50 зл. Найдите среднюю дневную прибыль и её стандартное отклонение.
`,
        hint: md`$Z = 2{,}5K + 1{,}5R$; $\mathrm{Cov}(K,R) = \rho\,\sigma_K\sigma_R$.`,
        solution: md`
$E(Z) = 750+225 = 975$ зл. $\mathrm{Cov} = 0{,}5\cdot40\cdot25 = 500$.
$V(Z) = 6{,}25\cdot1600 + 2{,}25\cdot625 + 2\cdot2{,}5\cdot1{,}5\cdot500 = 15\,156{,}25$, $\sigma_Z\approx123{,}1$ зл.
`,
        answer: md`$E(Z)=975$ зл, $\sigma_Z\approx123{,}1$ зл.`
      },
      {
        id: 'e12', tag: 'C09', title: 'Прибыль = выручка − затраты',
        text: md`
Месячная выручка фирмы в среднем 50 тыс. зл (ст. откл. 5 тыс.), затраты — в среднем 35 тыс. зл (ст. откл. 4 тыс.). Корреляция выручки и затрат 0,6. Найдите математическое ожидание и стандартное отклонение месячной прибыли.
`,
        hint: md`$V(P-K) = V(P)+V(K)-2\,\mathrm{Cov}(P,K)$ — положительная корреляция **уменьшает** колебания прибыли.`,
        solution: md`
$E = 15$ тыс. зл. $V = 25+16-2\cdot0{,}6\cdot5\cdot4 = 17$, $\sigma = \sqrt{17}\approx4{,}12$ тыс. зл.
Когда затраты растут вместе с выручкой, прибыль колеблется меньше, чем без корреляции ($\sqrt{41}\approx6{,}4$).
`,
        answer: md`$E=15$ тыс. зл, $\sigma\approx4{,}12$ тыс. зл.`
      }
    ]
  };

  SAD.registerTopic('t06', { charts: charts, pl: pl, en: en, ru: ru });
})();
