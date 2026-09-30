/* Topic 2 — Probability (lecture W02, classes C03) */
(function () {
  var md = SAD.md;

  /* ---------- diagrams (SVG, language-dependent labels) ---------- */

  function venn(labels) {
    function panel(i, kind, label) {
      var x0 = i * 220, ax = x0 + 80, bx = x0 + 135, cy = 85, r = 45, id = 'vennA' + i;
      var shade = '';
      if (kind === 'union') {
        shade = '<circle class="diagram__fill-1" cx="' + ax + '" cy="' + cy + '" r="' + r + '"/><circle class="diagram__fill-1" cx="' + bx + '" cy="' + cy + '" r="' + r + '"/>';
      } else if (kind === 'inter') {
        shade = '<clipPath id="' + id + '"><circle cx="' + ax + '" cy="' + cy + '" r="' + r + '"/></clipPath>' +
          '<circle class="diagram__fill-2" cx="' + bx + '" cy="' + cy + '" r="' + r + '" clip-path="url(#' + id + ')"/>';
      } else {
        shade = '<circle class="diagram__fill-1" cx="' + ax + '" cy="' + cy + '" r="' + r + '"/><circle class="diagram__hole" cx="' + bx + '" cy="' + cy + '" r="' + r + '"/>';
      }
      return '<rect class="diagram__box" x="' + (x0 + 8) + '" y="20" width="200" height="130" rx="8"/>' + shade +
        '<circle class="diagram__stroke" cx="' + ax + '" cy="' + cy + '" r="' + r + '"/><circle class="diagram__stroke" cx="' + bx + '" cy="' + cy + '" r="' + r + '"/>' +
        '<text class="diagram__text" x="' + (ax - 30) + '" y="' + (cy - 30) + '">A</text><text class="diagram__text" x="' + (bx + 20) + '" y="' + (cy - 30) + '">B</text>' +
        '<text class="diagram__text--muted" x="' + (x0 + 16) + '" y="38">S</text>' +
        '<text class="diagram__text diagram__text--accent" x="' + (x0 + 108) + '" y="176" text-anchor="middle">' + label + '</text>';
    }
    return '<svg class="chart__svg" viewBox="0 0 660 190" role="img" aria-label="Venn">' +
      panel(0, 'union', labels[0]) + panel(1, 'inter', labels[1]) + panel(2, 'diff', labels[2]) + '</svg>';
  }

  function tree(dec, words) {
    function n(x) { return String(x).replace('.', dec); }
    var t = '<svg class="chart__svg" viewBox="0 0 660 250" role="img" aria-label="tree">';
    function line(x1, y1, x2, y2, label, lx, ly) {
      return '<line class="diagram__line" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>' +
        '<text class="diagram__text--muted" x="' + lx + '" y="' + ly + '" text-anchor="middle">' + label + '</text>';
    }
    t += line(40, 125, 200, 65, n(0.01), 110, 82) + line(40, 125, 200, 185, n(0.99), 110, 172);
    t += line(200, 65, 380, 30, n(0.95), 290, 36) + line(200, 65, 380, 100, n(0.05), 290, 98);
    t += line(200, 185, 380, 150, n(0.05), 290, 156) + line(200, 185, 380, 220, n(0.95), 290, 218);
    t += '<circle class="diagram__node" cx="40" cy="125" r="8"/>';
    t += '<text class="diagram__text diagram__text--accent" x="200" y="60" text-anchor="middle">D</text>';
    t += '<text class="diagram__text diagram__text--accent" x="200" y="205" text-anchor="middle">D′</text>';
    var leaves = [[30, '+', n(0.01) + ' · ' + n(0.95) + ' = ' + n(0.0095), true], [100, '−', n(0.01) + ' · ' + n(0.05) + ' = ' + n(0.0005)],
      [150, '+', n(0.99) + ' · ' + n(0.05) + ' = ' + n(0.0495), true], [220, '−', n(0.99) + ' · ' + n(0.95) + ' = ' + n(0.9405)]];
    leaves.forEach(function (lf) {
      t += '<text class="diagram__text' + (lf[3] ? ' diagram__text--accent' : '') + '" x="392" y="' + (lf[0] + 5) + '">' + lf[1] + '   ' + lf[2] + '</text>';
    });
    t += '<text class="diagram__text--muted" x="40" y="150" text-anchor="middle">' + words.start + '</text>';
    return t + '</svg>';
  }

  function circuits(words) {
    var s = '<svg class="chart__svg" viewBox="0 0 660 200" role="img" aria-label="circuits">';
    function box(x, y, label) {
      return '<rect class="diagram__box" x="' + x + '" y="' + (y - 16) + '" width="46" height="32" rx="5"/>' +
        '<text class="diagram__text" x="' + (x + 23) + '" y="' + (y + 5) + '" text-anchor="middle">' + label + '</text>';
    }
    // series
    s += '<path class="diagram__wire" d="M20 90 H70 M116 90 H170 M216 90 H270"/>' + box(70, 90, '1') + box(170, 90, '2');
    s += '<circle class="diagram__node" cx="20" cy="90" r="5"/><circle class="diagram__node" cx="270" cy="90" r="5"/>';
    s += '<text class="diagram__text diagram__text--accent" x="145" y="150" text-anchor="middle">' + words.series + '</text>';
    s += '<text class="diagram__text--muted" x="145" y="175" text-anchor="middle">P = p₁ · p₂</text>';
    // parallel
    s += '<path class="diagram__wire" d="M360 90 H400 V50 H460 M506 50 H560 V90 H610 M400 90 V130 H460 M506 130 H560 V90"/>' + box(460, 50, '1') + box(460, 130, '2');
    s += '<circle class="diagram__node" cx="360" cy="90" r="5"/><circle class="diagram__node" cx="610" cy="90" r="5"/>';
    s += '<text class="diagram__text diagram__text--accent" x="485" y="170" text-anchor="middle">' + words.parallel + '</text>';
    s += '<text class="diagram__text--muted" x="485" y="192" text-anchor="middle">P = 1 − (1 − p₁)(1 − p₂)</text>';
    return s + '</svg>';
  }

  function exCircuits() {
    var s = '<svg class="chart__svg" viewBox="0 0 660 190" role="img" aria-label="circuits">';
    function box(x, y, label) {
      return '<rect class="diagram__box" x="' + x + '" y="' + (y - 15) + '" width="40" height="30" rx="5"/>' +
        '<text class="diagram__text" x="' + (x + 20) + '" y="' + (y + 5) + '" text-anchor="middle">' + label + '</text>';
    }
    // (a): (1–2 in series) parallel with 3
    s += '<text class="diagram__text diagram__text--accent" x="10" y="24">a)</text>';
    s += '<path class="diagram__wire" d="M20 95 H50 V55 H80 M120 55 H160 M200 55 H240 V95 H270 M50 95 V135 H120 M160 135 H240 V95"/>';
    s += box(80, 55, '1') + box(160, 55, '2') + box(120, 135, '3');
    s += '<circle class="diagram__node" cx="20" cy="95" r="5"/><circle class="diagram__node" cx="270" cy="95" r="5"/>';
    // (b): (1 parallel 2) in series with 3
    s += '<text class="diagram__text diagram__text--accent" x="340" y="24">b)</text>';
    s += '<path class="diagram__wire" d="M350 95 H380 V55 H420 M460 55 H500 V95 H540 M380 95 V135 H420 M460 135 H500 V95 M580 95 H630"/>';
    s += box(420, 55, '1') + box(420, 135, '2') + box(540, 95, '3');
    s += '<circle class="diagram__node" cx="350" cy="95" r="5"/><circle class="diagram__node" cx="630" cy="95" r="5"/>';
    return s + '</svg>';
  }

  var svg = {
    venn: { svg: { pl: venn(['A ∪ B (suma)', 'A ∩ B (iloczyn)', 'A − B (różnica)']), en: venn(['A ∪ B (union)', 'A ∩ B (intersection)', 'A − B (difference)']), ru: venn(['A ∪ B (сумма)', 'A ∩ B (произведение)', 'A − B (разность)']) },
      caption: { pl: 'Diagramy Venna: zaznaczony obszar to zdarzenie opisane pod rysunkiem', en: 'Venn diagrams: the shaded area is the event named below', ru: 'Диаграммы Венна: закрашенная область — событие, подписанное снизу' } },
    tree: { svg: { pl: tree(',', { start: 'start' }), en: tree('.', { start: 'start' }), ru: tree(',', { start: 'старт' }) },
      caption: { pl: 'Drzewko: najpierw „czy chory” (D), potem wynik testu. Mnożymy wzdłuż gałęzi, dodajemy liście z „+”.', en: 'Tree: first “is the person ill” (D), then the test result. Multiply along branches, add the “+” leaves.', ru: 'Дерево: сначала «болен ли» (D), затем результат теста. Умножаем вдоль ветвей, складываем листья с «+».' } },
    circuits: { svg: { pl: circuits({ series: 'szeregowo', parallel: 'równolegle' }), en: circuits({ series: 'in series', parallel: 'in parallel' }), ru: circuits({ series: 'последовательно', parallel: 'параллельно' }) },
      caption: { pl: 'Układ szeregowy działa, gdy działają wszystkie elementy; równoległy — gdy działa choć jeden', en: 'A series system works when all elements work; a parallel one — when at least one works', ru: 'Последовательная схема работает, если работают все элементы; параллельная — если работает хотя бы один' } },
    exCircuits: { svg: exCircuits() }
  };

  var charts = {
    bernoulli: { type: 'pmf', dist: { name: 'binom', n: 5, p: 0.25 }, showValues: true, highlight: function (k) { return k >= 3; },
      xLabel: { pl: 'liczba trafionych odpowiedzi k', en: 'number of correct answers k', ru: 'число верных ответов k' }, yLabel: 'P(X = k)',
      caption: { pl: 'Zgadywanie w teście: 5 pytań, p = 1/4. Pomarańczowe słupki: co najmniej 3 trafienia.', en: 'Guessing a test: 5 questions, p = 1/4. Orange bars: at least 3 correct.', ru: 'Угадывание теста: 5 вопросов, p = 1/4. Оранжевые столбики: не меньше 3 верных.' } }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Rachunek prawdopodobieństwa to matematyczny model przypadku. Tu uczymy się liczyć szanse zdarzeń, szanse „pod warunkiem” i odwracać wnioskowanie wzorem Bayesa.',
    lecture: md`
# Doświadczenie losowe i zdarzenia

Rachunek prawdopodobieństwa narodził się w XVII wieku z analizy gier hazardowych (Pascal, Fermat). Tworzy **modele matematyczne zjawisk losowych**. {lecture:W02}

::: def | Doświadczenie losowe
Doświadczenie, które:
- można **powtarzać** w tych samych warunkach,
- jego wyniku **nie znamy** przed wykonaniem,
- ale **znamy zbiór wszystkich możliwych wyników**. {lecture:W02}
:::

| Doświadczenie | Możliwe wyniki |
|---|---|
| podanie lekarstwa | {leczy, nie leczy} |
| czas życia procesora | $[0, \infty)$ |
| liczba błędów w aplikacji | {0, 1, 2, …} |
| liczba orłów w 100 rzutach monetą | {0, 1, …, 100} |
| liczba samochodów na autostradzie w godzinach szczytu | {0, 1, 2, …} |

::: def | Przestrzeń zdarzeń elementarnych, zdarzenie
- **Przestrzeń zdarzeń elementarnych** $S$ (czasem $\Omega$) — zbiór **wszystkich** możliwych wyników.
- **Zdarzenie elementarne** $s \in S$ — pojedynczy, niepodzielny wynik.
- **Zdarzenie** $A \subset S$ — dowolny podzbiór wyników. Mówimy, że $A$ **zaszło**, jeśli wynik doświadczenia należy do $A$. {lecture:W02}
:::

Ponieważ zdarzenia to zbiory, **rachunek zdarzeń = rachunek zbiorów**:

| Zdarzenie | Zapis | Kiedy zachodzi? |
|---|---|---|
| przeciwne do $A$ | $A' = S - A$ | gdy **nie** zachodzi $A$ |
| iloczyn | $A \cap B$ | gdy zachodzą **oba** |
| suma | $A \cup B$ | gdy zachodzi **co najmniej jedno** |
| różnica | $A - B$ | gdy zachodzi $A$, ale **nie** $B$ |
| wykluczające się | $A \cap B = \varnothing$ | nigdy razem |
| $A$ pociąga $B$ | $A \subset B$ | gdy zajdzie $A$, na pewno zajdzie $B$ |

@svg venn

::: example W02 | Dwa rzuty monetą
$S = \{OO, OR, RO, RR\}$. Niech $A$ = „orzeł w I rzucie” $=\{OO, OR\}$, $C$ = „orzeł w II rzucie” $= \{OO, RO\}$, $D = \{OO\}$.
Wtedy $A\cup C = \{OO, OR, RO\}$, $A\cap C = \{OO\} = D$, więc $D \subset A$ i $D\subset C$.
:::

::: example W02 | Rzucamy aż do pierwszego orła
$S = \{O, RO, RRO, RRRO, \dots\}$ — przestrzeń jest **nieskończona** (przeliczalna). Zdarzenie „wykonano mniej niż 6 rzutów” $= \{O, RO, RRO, RRRO, RRRRO\}$.
:::

# Czym jest prawdopodobieństwo?

**Podejście częstościowe.** Karl Pearson rzucił monetą **24 000** razy — orzeł wypadł z częstością 0,5005. Prawdopodobieństwo zdarzenia to **graniczna częstość** jego występowania przy nieograniczonej liczbie powtórzeń (R. von Mises, 1919). {lecture:W02}

::: def | Aksjomaty Kołmogorowa (1933)
Prawdopodobieństwo to funkcja $P$, która każdemu zdarzeniu $A\subset S$ przypisuje liczbę tak, że:
1. $0 \le P(A) \le 1$,
2. $P(S) = 1$, $P(\varnothing) = 0$,
3. jeśli $A_1, A_2, \dots$ **wzajemnie się wykluczają**, to $P(A_1\cup A_2\cup\dots) = P(A_1)+P(A_2)+\dots$ {lecture:W02}
:::

::: formula | Definicja klasyczna
Gdy wszystkie wyniki są **jednakowo prawdopodobne** i jest ich skończenie wiele:
$$P(A) = \frac{|A|}{|S|} = \frac{\text{liczba wyników sprzyjających}}{\text{liczba wszystkich wyników}}$$
:::

::: example W02
Trzy rzuty symetryczną monetą, $A$ = „orzeł po raz pierwszy w trzecim rzucie” $=\{RRO\}$. $|S| = 2^3 = 8$, więc $P(A) = 1/8$.
:::

# Kombinatoryka — jak liczyć wyniki

| Reguła | Wzór | Kiedy? |
|---|---|---|
| reguła iloczynu | $r\cdot k$ | etap 1: $r$ możliwości, etap 2: $k$ możliwości |
| kombinacje (podzbiory) | $\binom{n}{k} = \dfrac{n!}{k!\,(n-k)!}$ | wybór $k$ z $n$, **kolejność nieważna** |
| wariacje bez powtórzeń | $V(n,k) = \dfrac{n!}{(n-k)!}$ | wybór $k$ z $n$, **kolejność ważna**, bez powtórzeń |
| wariacje z powtórzeniami {own} | $n^k$ | kolejność ważna, elementy mogą się powtarzać |
| permutacje {own} | $n!$ | ustawienie $n$ elementów w kolejności |

::: example W02 | Przykłady z wykładu
- Liczb dwucyfrowych: $9\cdot10 = 90$; podzielnych przez 5: $9\cdot 2=18$.
- Wybór 2 asów spośród 4: $\binom42 = 6$.
- 5 osób wysiada z windy w bloku 10-piętrowym, każda na innym piętrze: $V(10,5) = 10\cdot9\cdot8\cdot7\cdot6 = 30\,240$.
- Brydż, 13 kart z 52: $P(\text{dokładnie 6 pików}) = \dfrac{\binom{13}{6}\binom{39}{7}}{\binom{52}{13}} \approx 0{,}0416$.
:::

::: intuition
Pytaj siebie: **czy kolejność ma znaczenie?** Skład drużyny {Ala, Ola} = {Ola, Ala} → kombinacje. Podium (złoto: Ala, srebro: Ola) ≠ (złoto: Ola, srebro: Ala) → wariacje.
:::

# Najważniejsze własności

::: formula | Własności prawdopodobieństwa
$$P(A') = 1 - P(A)$$
$$A\subset B \;\Rightarrow\; P(A)\le P(B)$$
$$P(A\cup B) = P(A) + P(B) - P(A\cap B)$$
:::

Dlaczego odejmujemy $P(A\cap B)$? Bo część wspólna została policzona **dwa razy** (raz w $A$, raz w $B$). Gdy $A$ i $B$ się wykluczają, $P(A\cap B)=0$. {lecture:W02}

::: tip W02 | Sztuczka z dopełnieniem
„Co najmniej jeden” liczy się najłatwiej przez zdarzenie przeciwne („ani jednego”). Co najmniej jeden orzeł w 3 rzutach: $1 - P(RRR) = 1 - \frac18 = \frac78$.
:::

::: formula own | Suma trzech zdarzeń (wzór włączeń i wyłączeń)
$$P(A\cup B\cup C) = P(A)+P(B)+P(C) - P(A\cap B) - P(A\cap C) - P(B\cap C) + P(A\cap B\cap C)$$
:::

# Prawdopodobieństwo warunkowe

::: def | Prawdopodobieństwo warunkowe
Dla $P(B) > 0$:
$$P(A\mid B) = \frac{P(A\cap B)}{P(B)}$$
Czytamy: „prawdopodobieństwo $A$ **pod warunkiem**, że zaszło $B$”.
:::

::: intuition
Warunek **zmniejsza świat**: wiemy już, że zaszło $B$, więc wszystko poza $B$ wyrzucamy. $P(A\mid B)$ mówi, jaką część **nowego, mniejszego świata** $B$ zajmuje $A$.
:::

::: example own
Rzut kostką. Wiemy, że wypadła liczba **parzysta** ($B=\{2,4,6\}$). Jaka jest szansa na szóstkę? W „nowym świecie” są 3 równie możliwe wyniki, więc $P(6\mid B) = \frac13$ (a bez tej wiedzy było $\frac16$). Ze wzoru: $\frac{P(\{6\})}{P(B)} = \frac{1/6}{1/2} = \frac13$.
:::

Z definicji wynika **reguła mnożenia**: $P(A\cap B) = P(B)\cdot P(A\mid B) = P(A)\cdot P(B\mid A)$.

# Wzór na prawdopodobieństwo całkowite

Zdarzenia $H_1, H_2, \dots, H_n$ tworzą **układ zupełny** (rozbicie $S$), jeśli wykluczają się parami i razem dają całe $S$ — dokładnie jedno z nich zawsze zachodzi. Wtedy:

::: formula | Prawdopodobieństwo całkowite
$$P(A) = \sum_{i=1}^{n} P(H_i)\,P(A\mid H_i) = P(H_1)P(A\mid H_1) + \dots + P(H_n)P(A\mid H_n)$$
:::

Najwygodniej liczyć to na **drzewku**: mnożymy prawdopodobieństwa wzdłuż gałęzi i **dodajemy** gałęzie prowadzące do $A$.

# Wzór Bayesa — odwracanie wnioskowania

Znamy $P(A\mid H_i)$ („jak często test wychodzi dodatni u chorych”), a chcemy $P(H_i\mid A)$ („jaka szansa, że jestem chory, skoro test wyszedł dodatni”).

::: formula | Wzór Bayesa
$$P(H_k\mid A) = \frac{P(H_k)\,P(A\mid H_k)}{P(A)} = \frac{P(H_k)\,P(A\mid H_k)}{\sum_i P(H_i)\,P(A\mid H_i)}$$
- $P(H_k)$ — prawdopodobieństwo **a priori** (przed obserwacją),
- $P(H_k\mid A)$ — prawdopodobieństwo **a posteriori** (po obserwacji $A$).
:::

::: example own | Test na rzadką chorobę
Choruje 1% populacji. Test wykrywa chorobę u 95% chorych, ale daje wynik dodatni także u 5% zdrowych. Wynik wyszedł **dodatni**. Jaka jest szansa, że osoba jest chora?

@svg tree

$$P(+) = 0{,}01\cdot0{,}95 + 0{,}99\cdot 0{,}05 = 0{,}0095 + 0{,}0495 = 0{,}059$$
$$P(D\mid +) = \frac{0{,}0095}{0{,}059} \approx 0{,}161$$

Tylko **ok. 16%**! Choroba jest tak rzadka, że fałszywych alarmów wśród zdrowych (0,0495) jest ponad 5 razy więcej niż prawdziwych wykryć (0,0095). Dlatego po dodatnim teście przesiewowym robi się drugi, dokładniejszy test.
:::

::: steps | Zadanie z Bayesa — schemat
1. Nazwij hipotezy $H_1, \dots, H_n$ (skąd pochodzi obiekt) i zdarzenie $A$ (co zaobserwowano).
2. Wypisz $P(H_i)$ i $P(A\mid H_i)$ z treści (procenty → ułamki).
3. Policz $P(A)$ wzorem na prawdopodobieństwo całkowite (drzewko).
4. Podziel „swoją gałąź” przez $P(A)$. Sprawdź, czy $\sum_k P(H_k\mid A) = 1$.
:::

# Niezależność zdarzeń

::: def | Niezależność dwóch zdarzeń
$A$ i $B$ są **niezależne**, gdy
$$P(A\cap B) = P(A)\cdot P(B)$$
Równoważnie (dla $P(B)>0$): $P(A\mid B) = P(A)$ — informacja o $B$ nie zmienia szansy $A$.
:::

::: def | Niezależność wielu zdarzeń
$A_1, \dots, A_n$ są **wzajemnie (łącznie) niezależne**, gdy dla **każdego** podzbioru tych zdarzeń prawdopodobieństwo iloczynu = iloczyn prawdopodobieństw. Dla trzech zdarzeń trzeba sprawdzić **4 równości**:
$$P(A\cap B)=P(A)P(B),\quad P(A\cap C)=P(A)P(C),\quad P(B\cap C)=P(B)P(C),$$
$$P(A\cap B\cap C)=P(A)P(B)P(C).$$
Gdy zachodzą tylko pierwsze trzy — zdarzenia są niezależne **parami**, ale niekoniecznie wzajemnie.
:::

::: example own | Parami tak, łącznie nie
Dwa rzuty monetą: $A$ = „orzeł w I rzucie”, $B$ = „orzeł w II rzucie”, $C$ = „dokładnie jeden orzeł”. Każde ma prawdopodobieństwo $\frac12$, każda para ma iloczyn o prawdopodobieństwie $\frac14$ (np. $A\cap C = \{OR\}$) — **parami niezależne**. Ale $A\cap B\cap C=\varnothing$, więc $P(A\cap B\cap C) = 0 \ne \frac18$ — **nie są wzajemnie niezależne**.
:::

::: warn
**Niezależne ≠ wykluczające się!** Jeśli $A\cap B = \varnothing$ i oba mają dodatnie prawdopodobieństwo, to $P(A\cap B) = 0 \ne P(A)P(B)$ — takie zdarzenia są **zależne** (zajście jednego wyklucza drugie, więc bardzo dużo o nim mówi).
:::

::: tip own
Jeśli $A$ i $B$ są niezależne, to niezależne są też pary $A'$ i $B$, $A$ i $B'$, $A'$ i $B'$. Przydaje się przy „oba zawiodą”: $P(A'\cap B') = P(A')P(B')$.
:::

## Niezawodność układów

Elementy działają **niezależnie**, element $i$ działa z prawdopodobieństwem $p_i$.

@svg circuits

- **szeregowo** — działa, gdy działają **wszystkie**: $P = p_1 p_2\cdots p_n$;
- **równolegle** — działa, gdy działa **co najmniej jeden**: $P = 1 - (1-p_1)(1-p_2)\cdots(1-p_n)$.

::: example own
Dwa elementy o niezawodności 0,9: szeregowo $0{,}9^2 = 0{,}81$, równolegle $1 - 0{,}1^2 = 0{,}99$. Równoległe połączenie (redundancja) mocno podnosi niezawodność — tak działają zapasowe serwery i dyski RAID.
:::

# Schemat Bernoulliego

Doświadczenie z dwoma wynikami („sukces” z prawdopodobieństwem $p$, „porażka” z $1-p$) powtarzamy $n$ razy **niezależnie**.

::: formula | Prawdopodobieństwo k sukcesów w n próbach
$$P(k) = \binom{n}{k} p^k (1-p)^{n-k},\qquad k = 0, 1, \dots, n$$
:::

::: intuition
$p^k(1-p)^{n-k}$ — szansa **jednego konkretnego** ciągu (np. SSPPP). $\binom nk$ — ile jest takich ciągów (na których miejscach stoją sukcesy).
:::

::: example own | Zgadywanie w teście
5 pytań, każde z 4 odpowiedziami, zgadujemy ($p=\frac14$). Szansa na co najmniej 3 trafienia:
$$P(\ge3) = \binom53\left(\tfrac14\right)^3\left(\tfrac34\right)^2 + \binom54\left(\tfrac14\right)^4\tfrac34 + \left(\tfrac14\right)^5 = \frac{90+15+1}{1024}\approx 0{,}104$$
:::

@chart bernoulli

Ten schemat to wstęp do **rozkładu dwumianowego** z tematu 3.

# W Excelu

~~~excel Kombinatoryka i schemat Bernoulliego
A1: =COMBIN(52,13)                 // liczba układów 13 kart z 52
A2: =COMBIN(13,6)*COMBIN(39,7)/COMBIN(52,13)   // P(dokładnie 6 pików) ≈ 0,0416
A3: =PERMUT(10,5)                  // V(10,5) = 30240
A4: =FACT(5)                       // 5! = 120
A5: =BINOM.DIST(3,5,0.25,FALSE)    // P(dokładnie 3 sukcesy)
A6: =1-BINOM.DIST(2,5,0.25,TRUE)   // P(co najmniej 3 sukcesy) ≈ 0,1035
~~~

~~~python Sprawdzenie w Pythonie
from math import comb, perm, factorial
from fractions import Fraction as F

print(comb(13, 6) * comb(39, 7) / comb(52, 13))   # 0.04156...
print(perm(10, 5), factorial(5))                  # 30240 120

# Bayes: test na rzadką chorobę (ułamki dokładne)
pD, sens, fp = F(1, 100), F(95, 100), F(5, 100)
p_plus = pD * sens + (1 - pD) * fp
print(p_plus, float(pD * sens / p_plus))          # 59/1000  0.161...
~~~

::: summary
- Zdarzenia = zbiory: suma, iloczyn, różnica, dopełnienie; diagram Venna.
- Klasycznie: $P(A)=|A|/|S|$; kombinatoryka: $\binom nk$, $V(n,k)$.
- $P(A') = 1-P(A)$, $P(A\cup B) = P(A)+P(B)-P(A\cap B)$.
- $P(A\mid B) = P(A\cap B)/P(B)$; całkowite: $P(A)=\sum P(H_i)P(A\mid H_i)$; Bayes: $P(H_k\mid A) = P(H_k)P(A\mid H_k)/P(A)$.
- Niezależność: $P(A\cap B)=P(A)P(B)$; dla 3 zdarzeń 4 warunki; niezależne ≠ rozłączne.
- Bernoulli: $\binom nk p^k(1-p)^{n-k}$.
:::
`,

    cheatsheet: md`
## Zdarzenia
$A'$ — nie $A$; $A\cap B$ — oba; $A\cup B$ — co najmniej jedno; $A-B$ — $A$ bez $B$; rozłączne: $A\cap B=\varnothing$.

## Liczenie
- klasycznie: $P(A) = |A| / |S|$ (wyniki jednakowo prawdopodobne)
- $\binom nk = \frac{n!}{k!(n-k)!}$ (kolejność nieważna), $V(n,k)=\frac{n!}{(n-k)!}$ (ważna), $n^k$ (z powtórzeniami)

## Wzory
$$P(A')=1-P(A)\qquad P(A\cup B)=P(A)+P(B)-P(A\cap B)$$
$$P(A\cup B\cup C)=\textstyle\sum P(\cdot) - \sum P(\text{par}) + P(A\cap B\cap C)$$
$$P(A\mid B)=\frac{P(A\cap B)}{P(B)}\qquad P(A\cap B)=P(B)\,P(A\mid B)$$
$$P(A)=\sum_i P(H_i)P(A\mid H_i)\qquad P(H_k\mid A)=\frac{P(H_k)P(A\mid H_k)}{P(A)}$$

## Niezależność
- $P(A\cap B)=P(A)P(B)$ ⇔ $P(A\mid B)=P(A)$
- 3 zdarzenia: 3 równości dla par + 1 dla trójki (parami ≠ wzajemnie)
- rozłączne z $P>0$ → **zależne**

## Układy (elementy niezależne)
- szeregowo: $\prod p_i$
- równolegle: $1-\prod(1-p_i)$
- „co najmniej jeden” → licz przez dopełnienie

## Bernoulli
$P(k) = \binom nk p^k(1-p)^{n-k}$ · Excel: ‹BINOM.DIST(k,n,p,FALSE)›, ‹COMBIN›, ‹PERMUT›, ‹FACT›
`,

    exercises: [
      {
        id: 'e1', tag: 'C03', title: 'Trzy zdarzenia i wzór włączeń-wyłączeń',
        text: md`
Wiadomo, że $P(A) = 0{,}4$, $P(B) = 0{,}5$, $P(C) = 0{,}3$, $P(A-B) = 0{,}1$, $P(C-B) = 0{,}2$ oraz $A\cap C = \varnothing$.
Oblicz $P(A\mid B)$, $P(C\mid B)$, $P(A\cup B\cup C)$, $P(A\cup B)$, $P(B\cup C)$.
`,
        hint: md`$A = (A-B)\cup(A\cap B)$ i te części są rozłączne, więc $P(A\cap B) = P(A) - P(A-B)$. Skoro $A\cap C=\varnothing$, to także $A\cap B\cap C=\varnothing$.`,
        solution: md`
1. $P(A\cap B) = P(A) - P(A-B) = 0{,}4 - 0{,}1 = 0{,}3$; $\;P(C\cap B) = 0{,}3 - 0{,}2 = 0{,}1$.
2. $P(A\mid B) = \dfrac{0{,}3}{0{,}5} = 0{,}6$; $\;P(C\mid B) = \dfrac{0{,}1}{0{,}5} = 0{,}2$.
3. $A\cap C = \varnothing \Rightarrow P(A\cap C) = 0$ i $P(A\cap B\cap C)=0$:
$$P(A\cup B\cup C) = 0{,}4+0{,}5+0{,}3-0{,}3-0-0{,}1+0 = 0{,}8$$
4. $P(A\cup B) = 0{,}4+0{,}5-0{,}3 = 0{,}6$; $\;P(B\cup C) = 0{,}5+0{,}3-0{,}1 = 0{,}7$.
`,
        answer: md`$P(A\mid B)=0{,}6$; $P(C\mid B)=0{,}2$; $P(A\cup B\cup C)=0{,}8$; $P(A\cup B)=0{,}6$; $P(B\cup C)=0{,}7$.`
      },
      {
        id: 'e2', tag: 'C03', title: 'Dwie kostki — kto od kogo zależy?',
        text: md`
Rzucamy dwiema kostkami. Zdarzenia: $A$ — suma oczek **co najmniej 9**, $B$ — na pierwszej kostce **piątka**, $C$ — na drugiej kostce **liczba parzysta**.
Zbadaj niezależność zdarzeń $A, B, C$ (parami i wzajemną). Oblicz $P(A\cap B\cap C)$, $P(A\mid B)$ i $P(B\mid C)$.
`,
        hint: md`$|S| = 36$. Wypisz pary dające sumę 9, 10, 11, 12. Dla każdej pary zdarzeń porównaj $P(X\cap Y)$ z $P(X)P(Y)$.`,
        solution: md`
**Pojedyncze:** suma ≥ 9: dla 9 — 4 pary, 10 — 3, 11 — 2, 12 — 1, razem 10 → $P(A) = \frac{10}{36} = \frac5{18}$. $P(B) = \frac16$, $P(C) = \frac12$.

**Pary:**
- $A\cap B$: (5,4), (5,5), (5,6) → $\frac3{36} = \frac1{12}$, a $P(A)P(B) = \frac5{108}\approx0{,}046 \ne 0{,}083$ → **zależne**.
- $A\cap C$: druga = 4 → (5,4), (6,4); druga = 6 → (3,6), (4,6), (5,6), (6,6); razem 6 → $\frac16$, a $P(A)P(C) = \frac5{36}\approx0{,}139\ne 0{,}167$ → **zależne**.
- $B\cap C$: (5,2), (5,4), (5,6) → $\frac3{36} = \frac1{12} = \frac16\cdot\frac12$ → **niezależne**.

**Trójka:** $A\cap B\cap C = \{(5,4), (5,6)\}$ → $P = \frac2{36} = \frac1{18}$. Skoro już pary $A,B$ są zależne, zdarzenia **nie są wzajemnie niezależne**.

$P(A\mid B) = \dfrac{1/12}{1/6} = \dfrac12$ (znając piątkę na pierwszej kostce, potrzebujemy ≥ 4 na drugiej: 3 z 6). $\;P(B\mid C) = \dfrac{1/12}{1/2} = \dfrac16$ (= $P(B)$, bo $B$ i $C$ niezależne).
`,
        answer: md`Tylko $B$ i $C$ są niezależne; brak niezależności wzajemnej. $P(A\cap B\cap C)=\frac1{18}$, $P(A\mid B)=\frac12$, $P(B\mid C)=\frac16$.`
      },
      {
        id: 'e3', tag: 'C03', title: 'Losowy numer i warunek',
        text: md`
Losujemy jedną liczbę ze zbioru $\{1, 2, \dots, 20\}$. Jakie jest prawdopodobieństwo, że jest **podzielna przez 3**, jeśli wiadomo, że jest **parzysta**? Czy zdarzenia „podzielna przez 3” i „parzysta” są niezależne?
`,
        hint: md`Warunek zmniejsza świat do liczb parzystych — ile ich jest i ile z nich dzieli się przez 3 (czyli przez 6)?`,
        solution: md`
$B$ = parzysta = {2, 4, …, 20}, $|B| = 10$. $A\cap B$ = podzielne przez 6 = {6, 12, 18}, 3 liczby.
$$P(A\mid B) = \frac{3}{10} = 0{,}3$$
Bez warunku: $A$ = {3, 6, 9, 12, 15, 18}, $P(A) = \frac6{20} = 0{,}3$. Skoro $P(A\mid B) = P(A)$, zdarzenia są **niezależne** (sprawdzenie: $P(A\cap B) = \frac3{20} = 0{,}3\cdot0{,}5$ ✓).
`,
        answer: md`$P = 0{,}3$; zdarzenia są niezależne.`
      },
      {
        id: 'e4', tag: 'C03', title: 'Trzy serwery zapasowe',
        text: md`
Usługa ma trzy niezależne serwery; każdy jest dostępny z prawdopodobieństwem 0,95. Oblicz prawdopodobieństwo, że (a) wszystkie trzy są niedostępne jednocześnie, (b) działa co najmniej jeden, (c) działa dokładnie jeden.
`,
        hint: md`Niedostępność jednego: $0{,}05$. (b) przez dopełnienie. (c) schemat Bernoulliego z $n=3$, $k=1$.`,
        solution: md`
(a) $0{,}05^3 = 0{,}000125$.
(b) $1 - 0{,}000125 = 0{,}999875$ (układ „równoległy”).
(c) $\binom31\cdot 0{,}95\cdot 0{,}05^2 = 3\cdot0{,}95\cdot0{,}0025 = 0{,}007125$.
`,
        answer: md`(a) 0,000125; (b) 0,999875; (c) 0,007125.`
      },
      {
        id: 'e5', tag: 'C03', title: 'Niezależne parami, ale nie łącznie',
        text: md`
Rzucamy dwiema kostkami. $A$ — na pierwszej wypadła liczba nieparzysta, $B$ — na drugiej liczba nieparzysta, $C$ — suma oczek jest nieparzysta. Sprawdź, czy zdarzenia $A, B, C$ są niezależne parami i czy są wzajemnie niezależne.
`,
        hint: md`Suma jest nieparzysta dokładnie wtedy, gdy jedna kostka pokazuje liczbę parzystą, a druga nieparzystą.`,
        solution: md`
$P(A) = P(B) = \frac12$; $C$ = (nieparz., parz.) lub (parz., nieparz.) → $P(C) = \frac14+\frac14 = \frac12$.
- $A\cap B$ = obie nieparzyste: $\frac14 = \frac12\cdot\frac12$ ✓
- $A\cap C$ = pierwsza nieparz., druga parz.: $\frac14$ ✓
- $B\cap C$ = pierwsza parz., druga nieparz.: $\frac14$ ✓

Parami **niezależne**. Ale $A\cap B\cap C$: obie nieparzyste ⇒ suma parzysta, więc $A\cap B\cap C = \varnothing$ i $P = 0 \ne \frac18$. **Nie są wzajemnie niezależne** — znając $A$ i $B$, wiemy wszystko o $C$.
`,
        answer: md`Parami niezależne; wzajemnie — nie ($P(A\cap B\cap C) = 0 \ne 1/8$).`
      },
      {
        id: 'e6', tag: 'C03', title: 'Niezawodność układów przekaźników',
        text: md`
Przekaźniki działają niezależnie, każdy z prawdopodobieństwem $p$. Oblicz prawdopodobieństwo przepływu sygnału przez układy a) i b), a potem podstaw $p = 0{,}9$.

@svg exCircuits

a) przekaźniki 1 i 2 szeregowo, a całość równolegle z przekaźnikiem 3; b) przekaźniki 1 i 2 równolegle, a całość szeregowo z przekaźnikiem 3.
`,
        hint: md`Rozkładaj układ na bloki: najpierw policz blok wewnętrzny, potem traktuj go jak jeden element.`,
        solution: md`
**a)** Blok (1–2 szeregowo): $p^2$. Równolegle z 3: $P_a = 1 - (1-p^2)(1-p) = p + p^2 - p^3$.
Dla $p = 0{,}9$: $1 - 0{,}19\cdot 0{,}1 = 0{,}981$.

**b)** Blok (1 ∥ 2): $1-(1-p)^2 = 2p - p^2$. Szeregowo z 3: $P_b = (2p-p^2)\,p = 2p^2 - p^3$.
Dla $p=0{,}9$: $0{,}99\cdot 0{,}9 = 0{,}891$.

Układ a) jest bardziej niezawodny — przekaźnik 3 stanowi „obejście” całej gałęzi.
`,
        answer: md`a) $p+p^2-p^3$ (0,981 dla $p=0{,}9$); b) $2p^2-p^3$ (0,891).`
      },
      {
        id: 'e7', tag: 'C03', title: 'Skąd pochodzi wadliwy układ scalony? (Bayes)',
        text: md`
Układy scalone pochodzą z trzech fabryk: A dostarcza 50%, B — 30%, C — 20% wszystkich układów. Odsetek wadliwych wynosi odpowiednio 1%, 3% i 4%. Wylosowany układ okazał się **wadliwy**. Jakie jest prawdopodobieństwo, że pochodzi z fabryki A, B, C?
`,
        hint: md`Hipotezy: fabryka A, B, C. Najpierw prawdopodobieństwo całkowite $P(W)$, potem Bayes dla każdej fabryki.`,
        solution: md`
$$P(W) = 0{,}5\cdot0{,}01 + 0{,}3\cdot 0{,}03 + 0{,}2\cdot0{,}04 = 0{,}005+0{,}009+0{,}008 = 0{,}022$$
$$P(A\mid W) = \frac{0{,}005}{0{,}022}\approx 0{,}227,\quad P(B\mid W) = \frac{0{,}009}{0{,}022}\approx0{,}409,\quad P(C\mid W)=\frac{0{,}008}{0{,}022}\approx0{,}364$$
Suma = 1 ✓. Ciekawostka: choć A produkuje połowę układów, wadliwy najpewniej pochodzi z **B** — tam wadliwość jest 3 razy większa.
`,
        answer: md`$P(W)=0{,}022$; A: ≈ 0,227; B: ≈ 0,409; C: ≈ 0,364.`
      },
      {
        id: 'e8', tag: 'C03', title: 'Oszukana kostka w worku',
        text: md`
W worku jest $N$ kostek; jedna z nich ma **szóstki na wszystkich ściankach**, pozostałe są uczciwe. Losujemy kostkę i rzucamy nią 5 razy — za każdym razem wypada szóstka. Jakie jest prawdopodobieństwo, że wylosowaliśmy oszukaną kostkę? Podaj wynik dla $N = 100$ i $N = 100\,000$ i zinterpretuj.
`,
        hint: md`Hipotezy: oszukana ($1/N$) lub uczciwa ($(N-1)/N$). Dla uczciwej szansa pięciu szóstek to $(1/6)^5 = 1/7776$.`,
        solution: md`
$$P(\text{osz.}\mid 5\times6) = \frac{\frac1N\cdot 1}{\frac1N\cdot1 + \frac{N-1}{N}\cdot\frac1{7776}} = \frac{1}{1 + \frac{N-1}{7776}}$$
- $N = 100$: $\dfrac{1}{1+99/7776} \approx 0{,}987$ — prawie na pewno oszukana.
- $N = 100\,000$: $\dfrac{1}{1+99\,999/7776} \approx 0{,}072$ — raczej uczciwa, której „się poszczęściło”.

**Interpretacja:** ta sama obserwacja prowadzi do zupełnie innych wniosków w zależności od prawdopodobieństwa **a priori**. Gdy oszukanych kostek jest bardzo mało, nawet 5 szóstek z rzędu nie wystarcza, żeby nabrać pewności.
`,
        answer: md`$N=100$: ≈ 0,987; $N=100\,000$: ≈ 0,072.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'Probability theory is the mathematical model of chance. Here we learn to compute the chances of events, chances “given” something, and to reverse the reasoning with Bayes’ rule.',
    lecture: md`
# Random experiments and events

Probability theory was born in the 17th century from the analysis of gambling (Pascal, Fermat). It builds **mathematical models of random phenomena**. {lecture:W02}

::: def | Random experiment
An experiment that:
- can be **repeated** under the same conditions,
- whose result is **unknown** before it is performed,
- but whose **set of all possible results is known**. {lecture:W02}
:::

| Experiment | Possible results |
|---|---|
| giving a medicine | {cures, does not cure} |
| lifetime of a processor | $[0, \infty)$ |
| number of bugs in an app | {0, 1, 2, …} |
| number of heads in 100 coin tosses | {0, 1, …, 100} |
| number of cars on a motorway at rush hour | {0, 1, 2, …} |

::: def | Sample space, event
- **Sample space** $S$ (sometimes $\Omega$) — the set of **all** possible results.
- **Elementary event** $s \in S$ — a single, indivisible result.
- **Event** $A \subset S$ — any subset of results. We say $A$ **occurred** if the result belongs to $A$. {lecture:W02}
:::

Since events are sets, **the algebra of events = the algebra of sets**:

| Event | Notation | When does it occur? |
|---|---|---|
| complement of $A$ | $A' = S - A$ | when $A$ does **not** occur |
| intersection | $A \cap B$ | when **both** occur |
| union | $A \cup B$ | when **at least one** occurs |
| difference | $A - B$ | when $A$ occurs but $B$ does **not** |
| mutually exclusive | $A \cap B = \varnothing$ | never together |
| $A$ implies $B$ | $A \subset B$ | if $A$ occurs, $B$ surely occurs |

@svg venn

::: example W02 | Two coin tosses
$S = \{HH, HT, TH, TT\}$. Let $A$ = “heads in the 1st toss” $=\{HH, HT\}$, $C$ = “heads in the 2nd toss” $= \{HH, TH\}$, $D = \{HH\}$.
Then $A\cup C = \{HH, HT, TH\}$, $A\cap C = \{HH\} = D$, so $D \subset A$ and $D\subset C$.
:::

::: example W02 | Toss until the first head
$S = \{H, TH, TTH, TTTH, \dots\}$ — the space is **infinite** (countable). The event “fewer than 6 tosses” $= \{H, TH, TTH, TTTH, TTTTH\}$.
:::

# What is probability?

**Frequency approach.** Karl Pearson tossed a coin **24,000** times — heads came up with frequency 0.5005. The probability of an event is the **limiting frequency** of its occurrence over infinitely many repetitions (R. von Mises, 1919). {lecture:W02}

::: def | Kolmogorov’s axioms (1933)
Probability is a function $P$ assigning to every event $A\subset S$ a number such that:
1. $0 \le P(A) \le 1$,
2. $P(S) = 1$, $P(\varnothing) = 0$,
3. if $A_1, A_2, \dots$ are **mutually exclusive**, then $P(A_1\cup A_2\cup\dots) = P(A_1)+P(A_2)+\dots$ {lecture:W02}
:::

::: formula | Classical definition
When all results are **equally likely** and there are finitely many:
$$P(A) = \frac{|A|}{|S|} = \frac{\text{number of favourable results}}{\text{number of all results}}$$
:::

::: example W02
Three tosses of a fair coin, $A$ = “first heads in the third toss” $=\{TTH\}$. $|S| = 2^3 = 8$, so $P(A) = 1/8$.
:::

# Combinatorics — counting results

| Rule | Formula | When? |
|---|---|---|
| product rule | $r\cdot k$ | stage 1: $r$ options, stage 2: $k$ options |
| combinations (subsets) | $\binom{n}{k} = \dfrac{n!}{k!\,(n-k)!}$ | choose $k$ of $n$, **order irrelevant** |
| variations without repetition | $V(n,k) = \dfrac{n!}{(n-k)!}$ | choose $k$ of $n$, **order matters**, no repeats |
| variations with repetition {own} | $n^k$ | order matters, elements may repeat |
| permutations {own} | $n!$ | arranging $n$ elements in a row |

::: example W02 | Examples from the lecture
- Two-digit numbers: $9\cdot10 = 90$; divisible by 5: $9\cdot 2=18$.
- Choosing 2 aces out of 4: $\binom42 = 6$.
- 5 people leave a lift in a 10-storey block, each on a different floor: $V(10,5) = 10\cdot9\cdot8\cdot7\cdot6 = 30{,}240$.
- Bridge, 13 cards out of 52: $P(\text{exactly 6 spades}) = \dfrac{\binom{13}{6}\binom{39}{7}}{\binom{52}{13}} \approx 0.0416$.
:::

::: intuition
Ask yourself: **does the order matter?** A team {Ann, Ola} = {Ola, Ann} → combinations. A podium (gold: Ann, silver: Ola) ≠ (gold: Ola, silver: Ann) → variations.
:::

# Key properties

::: formula | Properties of probability
$$P(A') = 1 - P(A)$$
$$A\subset B \;\Rightarrow\; P(A)\le P(B)$$
$$P(A\cup B) = P(A) + P(B) - P(A\cap B)$$
:::

Why subtract $P(A\cap B)$? Because the common part was counted **twice** (once in $A$, once in $B$). When $A$ and $B$ are exclusive, $P(A\cap B)=0$. {lecture:W02}

::: tip W02 | The complement trick
“At least one” is easiest via the complement (“none”). At least one head in 3 tosses: $1 - P(TTT) = 1 - \frac18 = \frac78$.
:::

::: formula own | Union of three events (inclusion–exclusion)
$$P(A\cup B\cup C) = P(A)+P(B)+P(C) - P(A\cap B) - P(A\cap C) - P(B\cap C) + P(A\cap B\cap C)$$
:::

# Conditional probability

::: def | Conditional probability
For $P(B) > 0$:
$$P(A\mid B) = \frac{P(A\cap B)}{P(B)}$$
Read: “the probability of $A$ **given** that $B$ occurred”.
:::

::: intuition
The condition **shrinks the world**: we already know $B$ happened, so everything outside $B$ is thrown away. $P(A\mid B)$ says what part of the **new, smaller world** $B$ is taken by $A$.
:::

::: example own
A die roll. We know the result is **even** ($B=\{2,4,6\}$). What is the chance of a six? The “new world” has 3 equally likely results, so $P(6\mid B) = \frac13$ (without this knowledge it was $\frac16$). By the formula: $\frac{P(\{6\})}{P(B)} = \frac{1/6}{1/2} = \frac13$.
:::

The definition gives the **multiplication rule**: $P(A\cap B) = P(B)\cdot P(A\mid B) = P(A)\cdot P(B\mid A)$.

# Law of total probability

Events $H_1, H_2, \dots, H_n$ form a **partition** of $S$ if they are pairwise exclusive and together make up $S$ — exactly one of them always occurs. Then:

::: formula | Total probability
$$P(A) = \sum_{i=1}^{n} P(H_i)\,P(A\mid H_i) = P(H_1)P(A\mid H_1) + \dots + P(H_n)P(A\mid H_n)$$
:::

It is easiest on a **tree**: multiply probabilities along branches and **add** the branches that lead to $A$.

# Bayes’ rule — reversing the reasoning

We know $P(A\mid H_i)$ (“how often the test is positive for sick people”) and want $P(H_i\mid A)$ (“what is the chance I am sick, given a positive test”).

::: formula | Bayes’ rule
$$P(H_k\mid A) = \frac{P(H_k)\,P(A\mid H_k)}{P(A)} = \frac{P(H_k)\,P(A\mid H_k)}{\sum_i P(H_i)\,P(A\mid H_i)}$$
- $P(H_k)$ — the **prior** probability (before the observation),
- $P(H_k\mid A)$ — the **posterior** probability (after observing $A$).
:::

::: example own | Test for a rare disease
1% of the population is ill. The test detects the disease in 95% of the ill, but is also positive for 5% of the healthy. The result is **positive**. What is the chance the person is ill?

@svg tree

$$P(+) = 0.01\cdot0.95 + 0.99\cdot 0.05 = 0.0095 + 0.0495 = 0.059$$
$$P(D\mid +) = \frac{0.0095}{0.059} \approx 0.161$$

Only **about 16%**! The disease is so rare that false alarms among the healthy (0.0495) are more than 5 times as many as true detections (0.0095). That is why a positive screening test is followed by a second, more accurate test.
:::

::: steps | A Bayes problem — template
1. Name the hypotheses $H_1, \dots, H_n$ (where the object comes from) and the event $A$ (what was observed).
2. Write down $P(H_i)$ and $P(A\mid H_i)$ from the text (percent → fractions).
3. Compute $P(A)$ with the law of total probability (tree).
4. Divide “your branch” by $P(A)$. Check that $\sum_k P(H_k\mid A) = 1$.
:::

# Independence of events

::: def | Independence of two events
$A$ and $B$ are **independent** when
$$P(A\cap B) = P(A)\cdot P(B)$$
Equivalently (for $P(B)>0$): $P(A\mid B) = P(A)$ — knowing $B$ does not change the chance of $A$.
:::

::: def | Independence of many events
$A_1, \dots, A_n$ are **mutually independent** when for **every** subset of them the probability of the intersection = the product of probabilities. For three events you check **4 equalities**:
$$P(A\cap B)=P(A)P(B),\quad P(A\cap C)=P(A)P(C),\quad P(B\cap C)=P(B)P(C),$$
$$P(A\cap B\cap C)=P(A)P(B)P(C).$$
If only the first three hold, the events are **pairwise** independent, but not necessarily mutually.
:::

::: example own | Pairwise yes, jointly no
Two coin tosses: $A$ = “heads in the 1st”, $B$ = “heads in the 2nd”, $C$ = “exactly one head”. Each has probability $\frac12$, each pair has intersection probability $\frac14$ (e.g. $A\cap C = \{HT\}$) — **pairwise independent**. But $A\cap B\cap C=\varnothing$, so $P(A\cap B\cap C) = 0 \ne \frac18$ — **not mutually independent**.
:::

::: warn
**Independent ≠ mutually exclusive!** If $A\cap B = \varnothing$ and both have positive probability, then $P(A\cap B) = 0 \ne P(A)P(B)$ — such events are **dependent** (one occurring rules out the other, which says a lot).
:::

::: tip own
If $A$ and $B$ are independent, so are $A'$ and $B$, $A$ and $B'$, $A'$ and $B'$. Useful for “both fail”: $P(A'\cap B') = P(A')P(B')$.
:::

## Reliability of systems

Elements work **independently**; element $i$ works with probability $p_i$.

@svg circuits

- **in series** — works when **all** work: $P = p_1 p_2\cdots p_n$;
- **in parallel** — works when **at least one** works: $P = 1 - (1-p_1)(1-p_2)\cdots(1-p_n)$.

::: example own
Two elements with reliability 0.9: in series $0.9^2 = 0.81$, in parallel $1 - 0.1^2 = 0.99$. Parallel connection (redundancy) greatly increases reliability — that is how backup servers and RAID disks work.
:::

# Bernoulli trials

An experiment with two outcomes (“success” with probability $p$, “failure” with $1-p$) is repeated $n$ times **independently**.

::: formula | Probability of k successes in n trials
$$P(k) = \binom{n}{k} p^k (1-p)^{n-k},\qquad k = 0, 1, \dots, n$$
:::

::: intuition
$p^k(1-p)^{n-k}$ — the chance of **one particular** sequence (e.g. SSFFF). $\binom nk$ — how many such sequences there are (where the successes stand).
:::

::: example own | Guessing a test
5 questions, each with 4 answers, we guess ($p=\frac14$). The chance of at least 3 correct:
$$P(\ge3) = \binom53\left(\tfrac14\right)^3\left(\tfrac34\right)^2 + \binom54\left(\tfrac14\right)^4\tfrac34 + \left(\tfrac14\right)^5 = \frac{90+15+1}{1024}\approx 0.104$$
:::

@chart bernoulli

This scheme leads to the **binomial distribution** in topic 3.

# In Excel

~~~excel Combinatorics and Bernoulli trials
A1: =COMBIN(52,13)                 // number of 13-card hands from 52
A2: =COMBIN(13,6)*COMBIN(39,7)/COMBIN(52,13)   // P(exactly 6 spades) ≈ 0.0416
A3: =PERMUT(10,5)                  // V(10,5) = 30240
A4: =FACT(5)                       // 5! = 120
A5: =BINOM.DIST(3,5,0.25,FALSE)    // P(exactly 3 successes)
A6: =1-BINOM.DIST(2,5,0.25,TRUE)   // P(at least 3 successes) ≈ 0.1035
~~~

~~~python Checking in Python
from math import comb, perm, factorial
from fractions import Fraction as F

print(comb(13, 6) * comb(39, 7) / comb(52, 13))   # 0.04156...
print(perm(10, 5), factorial(5))                  # 30240 120

# Bayes: rare disease test (exact fractions)
pD, sens, fp = F(1, 100), F(95, 100), F(5, 100)
p_plus = pD * sens + (1 - pD) * fp
print(p_plus, float(pD * sens / p_plus))          # 59/1000  0.161...
~~~

::: summary
- Events = sets: union, intersection, difference, complement; Venn diagrams.
- Classically: $P(A)=|A|/|S|$; combinatorics: $\binom nk$, $V(n,k)$.
- $P(A') = 1-P(A)$, $P(A\cup B) = P(A)+P(B)-P(A\cap B)$.
- $P(A\mid B) = P(A\cap B)/P(B)$; total: $P(A)=\sum P(H_i)P(A\mid H_i)$; Bayes: $P(H_k\mid A) = P(H_k)P(A\mid H_k)/P(A)$.
- Independence: $P(A\cap B)=P(A)P(B)$; for 3 events 4 conditions; independent ≠ exclusive.
- Bernoulli: $\binom nk p^k(1-p)^{n-k}$.
:::
`,

    cheatsheet: md`
## Events
$A'$ — not $A$; $A\cap B$ — both; $A\cup B$ — at least one; $A-B$ — $A$ without $B$; exclusive: $A\cap B=\varnothing$.

## Counting
- classical: $P(A) = |A| / |S|$ (equally likely results)
- $\binom nk = \frac{n!}{k!(n-k)!}$ (order irrelevant), $V(n,k)=\frac{n!}{(n-k)!}$ (order matters), $n^k$ (with repetition)

## Formulas
$$P(A')=1-P(A)\qquad P(A\cup B)=P(A)+P(B)-P(A\cap B)$$
$$P(A\cup B\cup C)=\textstyle\sum P(\cdot) - \sum P(\text{pairs}) + P(A\cap B\cap C)$$
$$P(A\mid B)=\frac{P(A\cap B)}{P(B)}\qquad P(A\cap B)=P(B)\,P(A\mid B)$$
$$P(A)=\sum_i P(H_i)P(A\mid H_i)\qquad P(H_k\mid A)=\frac{P(H_k)P(A\mid H_k)}{P(A)}$$

## Independence
- $P(A\cap B)=P(A)P(B)$ ⇔ $P(A\mid B)=P(A)$
- 3 events: 3 equalities for pairs + 1 for the triple (pairwise ≠ mutual)
- exclusive with $P>0$ → **dependent**

## Systems (independent elements)
- series: $\prod p_i$
- parallel: $1-\prod(1-p_i)$
- “at least one” → use the complement

## Bernoulli
$P(k) = \binom nk p^k(1-p)^{n-k}$ · Excel: ‹BINOM.DIST(k,n,p,FALSE)›, ‹COMBIN›, ‹PERMUT›, ‹FACT›
`,

    exercises: [
      {
        id: 'e1', tag: 'C03', title: 'Three events and inclusion–exclusion',
        text: md`
We know that $P(A) = 0.4$, $P(B) = 0.5$, $P(C) = 0.3$, $P(A-B) = 0.1$, $P(C-B) = 0.2$ and $A\cap C = \varnothing$.
Compute $P(A\mid B)$, $P(C\mid B)$, $P(A\cup B\cup C)$, $P(A\cup B)$, $P(B\cup C)$.
`,
        hint: md`$A = (A-B)\cup(A\cap B)$ with disjoint parts, so $P(A\cap B) = P(A) - P(A-B)$. Since $A\cap C=\varnothing$, also $A\cap B\cap C=\varnothing$.`,
        solution: md`
1. $P(A\cap B) = 0.4 - 0.1 = 0.3$; $\;P(C\cap B) = 0.3 - 0.2 = 0.1$.
2. $P(A\mid B) = \dfrac{0.3}{0.5} = 0.6$; $\;P(C\mid B) = \dfrac{0.1}{0.5} = 0.2$.
3. $A\cap C = \varnothing \Rightarrow P(A\cap C) = 0$ and $P(A\cap B\cap C)=0$:
$$P(A\cup B\cup C) = 0.4+0.5+0.3-0.3-0-0.1+0 = 0.8$$
4. $P(A\cup B) = 0.4+0.5-0.3 = 0.6$; $\;P(B\cup C) = 0.5+0.3-0.1 = 0.7$.
`,
        answer: md`$P(A\mid B)=0.6$; $P(C\mid B)=0.2$; $P(A\cup B\cup C)=0.8$; $P(A\cup B)=0.6$; $P(B\cup C)=0.7$.`
      },
      {
        id: 'e2', tag: 'C03', title: 'Two dice — who depends on whom?',
        text: md`
We roll two dice. Events: $A$ — the sum is **at least 9**, $B$ — the first die shows **five**, $C$ — the second die shows an **even** number.
Check the independence of $A, B, C$ (pairwise and mutual). Compute $P(A\cap B\cap C)$, $P(A\mid B)$ and $P(B\mid C)$.
`,
        hint: md`$|S| = 36$. List the pairs with sums 9, 10, 11, 12. For each pair of events compare $P(X\cap Y)$ with $P(X)P(Y)$.`,
        solution: md`
**Single events:** sum ≥ 9: for 9 — 4 pairs, 10 — 3, 11 — 2, 12 — 1, total 10 → $P(A) = \frac{10}{36} = \frac5{18}$. $P(B) = \frac16$, $P(C) = \frac12$.

**Pairs:**
- $A\cap B$: (5,4), (5,5), (5,6) → $\frac1{12}$, while $P(A)P(B) = \frac5{108}\approx0.046 \ne 0.083$ → **dependent**.
- $A\cap C$: second = 4 → (5,4), (6,4); second = 6 → (3,6), (4,6), (5,6), (6,6); total 6 → $\frac16$, while $P(A)P(C) = \frac5{36}\approx0.139\ne 0.167$ → **dependent**.
- $B\cap C$: (5,2), (5,4), (5,6) → $\frac1{12} = \frac16\cdot\frac12$ → **independent**.

**Triple:** $A\cap B\cap C = \{(5,4), (5,6)\}$ → $P = \frac1{18}$. Since $A,B$ are already dependent, the events are **not mutually independent**.

$P(A\mid B) = \dfrac{1/12}{1/6} = \dfrac12$ (given a five on the first die we need ≥ 4 on the second: 3 of 6). $\;P(B\mid C) = \dfrac{1/12}{1/2} = \dfrac16$ (= $P(B)$, as $B$ and $C$ are independent).
`,
        answer: md`Only $B$ and $C$ are independent; no mutual independence. $P(A\cap B\cap C)=\frac1{18}$, $P(A\mid B)=\frac12$, $P(B\mid C)=\frac16$.`
      },
      {
        id: 'e3', tag: 'C03', title: 'A random number and a condition',
        text: md`
We draw one number from $\{1, 2, \dots, 20\}$. What is the probability that it is **divisible by 3**, given that it is **even**? Are “divisible by 3” and “even” independent?
`,
        hint: md`The condition shrinks the world to even numbers — how many are there and how many of them are divisible by 3 (i.e. by 6)?`,
        solution: md`
$B$ = even = {2, 4, …, 20}, $|B| = 10$. $A\cap B$ = divisible by 6 = {6, 12, 18}, 3 numbers.
$$P(A\mid B) = \frac{3}{10} = 0.3$$
Without the condition: $A$ = {3, 6, 9, 12, 15, 18}, $P(A) = \frac6{20} = 0.3$. Since $P(A\mid B) = P(A)$, the events are **independent** (check: $P(A\cap B) = \frac3{20} = 0.3\cdot0.5$ ✓).
`,
        answer: md`$P = 0.3$; the events are independent.`
      },
      {
        id: 'e4', tag: 'C03', title: 'Three backup servers',
        text: md`
A service has three independent servers; each is available with probability 0.95. Find the probability that (a) all three are down at the same time, (b) at least one works, (c) exactly one works.
`,
        hint: md`One server is down with probability $0.05$. (b) via the complement. (c) Bernoulli trials with $n=3$, $k=1$.`,
        solution: md`
(a) $0.05^3 = 0.000125$.
(b) $1 - 0.000125 = 0.999875$ (a “parallel” system).
(c) $\binom31\cdot 0.95\cdot 0.05^2 = 3\cdot0.95\cdot0.0025 = 0.007125$.
`,
        answer: md`(a) 0.000125; (b) 0.999875; (c) 0.007125.`
      },
      {
        id: 'e5', tag: 'C03', title: 'Pairwise independent, but not jointly',
        text: md`
We roll two dice. $A$ — the first die shows an odd number, $B$ — the second die shows an odd number, $C$ — the sum is odd. Check whether $A, B, C$ are pairwise independent and whether they are mutually independent.
`,
        hint: md`The sum is odd exactly when one die is even and the other odd.`,
        solution: md`
$P(A) = P(B) = \frac12$; $C$ = (odd, even) or (even, odd) → $P(C) = \frac12$.
- $A\cap B$ = both odd: $\frac14 = \frac12\cdot\frac12$ ✓
- $A\cap C$ = first odd, second even: $\frac14$ ✓
- $B\cap C$ = first even, second odd: $\frac14$ ✓

**Pairwise independent.** But both odd ⇒ even sum, so $A\cap B\cap C = \varnothing$ and $P = 0 \ne \frac18$. **Not mutually independent** — knowing $A$ and $B$ tells us everything about $C$.
`,
        answer: md`Pairwise independent; not mutually independent ($P(A\cap B\cap C) = 0 \ne 1/8$).`
      },
      {
        id: 'e6', tag: 'C03', title: 'Reliability of relay systems',
        text: md`
Relays work independently, each with probability $p$. Find the probability that a signal passes through systems a) and b), then substitute $p = 0.9$.

@svg exCircuits

a) relays 1 and 2 in series, the whole in parallel with relay 3; b) relays 1 and 2 in parallel, the whole in series with relay 3.
`,
        hint: md`Split the system into blocks: compute the inner block first, then treat it as a single element.`,
        solution: md`
**a)** Block (1–2 in series): $p^2$. In parallel with 3: $P_a = 1 - (1-p^2)(1-p) = p + p^2 - p^3$.
For $p = 0.9$: $1 - 0.19\cdot 0.1 = 0.981$.

**b)** Block (1 ∥ 2): $1-(1-p)^2 = 2p - p^2$. In series with 3: $P_b = (2p-p^2)\,p = 2p^2 - p^3$.
For $p=0.9$: $0.99\cdot 0.9 = 0.891$.

System a) is more reliable — relay 3 is a “bypass” of the whole branch.
`,
        answer: md`a) $p+p^2-p^3$ (0.981 for $p=0.9$); b) $2p^2-p^3$ (0.891).`
      },
      {
        id: 'e7', tag: 'C03', title: 'Where does a faulty chip come from? (Bayes)',
        text: md`
Chips come from three factories: A supplies 50%, B — 30%, C — 20% of all chips. The share of faulty chips is 1%, 3% and 4% respectively. A randomly chosen chip turned out to be **faulty**. What is the probability that it comes from factory A, B, C?
`,
        hint: md`Hypotheses: factory A, B, C. First the total probability $P(F)$, then Bayes for each factory.`,
        solution: md`
$$P(F) = 0.5\cdot0.01 + 0.3\cdot 0.03 + 0.2\cdot0.04 = 0.005+0.009+0.008 = 0.022$$
$$P(A\mid F) = \frac{0.005}{0.022}\approx 0.227,\quad P(B\mid F) = \frac{0.009}{0.022}\approx0.409,\quad P(C\mid F)=\frac{0.008}{0.022}\approx0.364$$
Sum = 1 ✓. Interesting: although A makes half of the chips, a faulty one most likely comes from **B** — its fault rate is 3 times higher.
`,
        answer: md`$P(F)=0.022$; A: ≈ 0.227; B: ≈ 0.409; C: ≈ 0.364.`
      },
      {
        id: 'e8', tag: 'C03', title: 'A loaded die in a bag',
        text: md`
A bag contains $N$ dice; one of them has **sixes on all faces**, the others are fair. We draw a die and roll it 5 times — a six every time. What is the probability that we drew the loaded die? Give the result for $N = 100$ and $N = 100{,}000$ and interpret it.
`,
        hint: md`Hypotheses: loaded ($1/N$) or fair ($(N-1)/N$). For a fair die the chance of five sixes is $(1/6)^5 = 1/7776$.`,
        solution: md`
$$P(\text{loaded}\mid 5\times6) = \frac{\frac1N\cdot 1}{\frac1N\cdot1 + \frac{N-1}{N}\cdot\frac1{7776}} = \frac{1}{1 + \frac{N-1}{7776}}$$
- $N = 100$: $\approx 0.987$ — almost certainly loaded.
- $N = 100{,}000$: $\approx 0.072$ — rather a fair die that got lucky.

**Interpretation:** the same observation leads to very different conclusions depending on the **prior** probability. When loaded dice are very rare, even 5 sixes in a row are not enough to be sure.
`,
        answer: md`$N=100$: ≈ 0.987; $N=100{,}000$: ≈ 0.072.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'Теория вероятностей — математическая модель случайности. Учимся считать шансы событий, шансы «при условии» и «переворачивать» рассуждение формулой Байеса.',
    lecture: md`
# Случайный эксперимент и события

Теория вероятностей родилась в XVII веке из анализа азартных игр (Паскаль, Ферма). Она строит **математические модели случайных явлений**. {lecture:W02}

::: def | Случайный эксперимент
Эксперимент, который:
- можно **повторять** в одинаковых условиях,
- результат которого **неизвестен** заранее,
- но **известно множество всех возможных результатов**. {lecture:W02}
:::

| Эксперимент | Возможные результаты |
|---|---|
| приём лекарства | {лечит, не лечит} |
| время жизни процессора | $[0, \infty)$ |
| число ошибок в приложении | {0, 1, 2, …} |
| число орлов в 100 бросках монеты | {0, 1, …, 100} |
| число машин на трассе в час пик | {0, 1, 2, …} |

::: def | Пространство элементарных событий, событие
- **Пространство элементарных событий** $S$ (иногда $\Omega$) — множество **всех** возможных результатов.
- **Элементарное событие** $s \in S$ — один неделимый результат.
- **Событие** $A \subset S$ — любое подмножество результатов. Говорим, что $A$ **произошло**, если результат принадлежит $A$. {lecture:W02}
:::

Раз события — это множества, то **алгебра событий = алгебра множеств**:

| Событие | Запись | Когда происходит? |
|---|---|---|
| противоположное $A$ | $A' = S - A$ | когда $A$ **не** произошло |
| произведение (пересечение) | $A \cap B$ | когда произошли **оба** |
| сумма (объединение) | $A \cup B$ | когда произошло **хотя бы одно** |
| разность | $A - B$ | когда произошло $A$, но **не** $B$ |
| несовместные | $A \cap B = \varnothing$ | никогда вместе |
| $A$ влечёт $B$ | $A \subset B$ | если произошло $A$, то точно произошло $B$ |

@svg venn

::: example W02 | Два броска монеты
$S = \{OO, OR, RO, RR\}$ (О — орёл, Р — решка). Пусть $A$ = «орёл при 1-м броске» $=\{OO, OR\}$, $C$ = «орёл при 2-м броске» $= \{OO, RO\}$, $D = \{OO\}$.
Тогда $A\cup C = \{OO, OR, RO\}$, $A\cap C = \{OO\} = D$, значит $D \subset A$ и $D\subset C$.
:::

::: example W02 | Бросаем до первого орла
$S = \{O, RO, RRO, RRRO, \dots\}$ — пространство **бесконечное** (счётное). Событие «сделано меньше 6 бросков» $= \{O, RO, RRO, RRRO, RRRRO\}$.
:::

# Что такое вероятность?

**Частотный подход.** Карл Пирсон бросил монету **24 000** раз — орёл выпал с частотой 0,5005. Вероятность события — **предельная частота** его появления при неограниченном числе повторений (Р. фон Мизес, 1919). {lecture:W02}

::: def | Аксиомы Колмогорова (1933)
Вероятность — функция $P$, которая каждому событию $A\subset S$ ставит в соответствие число так, что:
1. $0 \le P(A) \le 1$,
2. $P(S) = 1$, $P(\varnothing) = 0$,
3. если $A_1, A_2, \dots$ **попарно несовместны**, то $P(A_1\cup A_2\cup\dots) = P(A_1)+P(A_2)+\dots$ {lecture:W02}
:::

::: formula | Классическое определение
Когда все результаты **равновероятны** и их конечное число:
$$P(A) = \frac{|A|}{|S|} = \frac{\text{число благоприятных исходов}}{\text{число всех исходов}}$$
:::

::: example W02
Три броска симметричной монеты, $A$ = «орёл впервые при третьем броске» $=\{RRO\}$. $|S| = 2^3 = 8$, значит $P(A) = 1/8$.
:::

# Комбинаторика — как считать исходы

| Правило | Формула | Когда? |
|---|---|---|
| правило произведения | $r\cdot k$ | этап 1: $r$ вариантов, этап 2: $k$ вариантов |
| сочетания (подмножества) | $\binom{n}{k} = \dfrac{n!}{k!\,(n-k)!}$ | выбор $k$ из $n$, **порядок не важен** |
| размещения без повторений | $V(n,k) = \dfrac{n!}{(n-k)!}$ | выбор $k$ из $n$, **порядок важен**, без повторов |
| размещения с повторениями {own} | $n^k$ | порядок важен, элементы могут повторяться |
| перестановки {own} | $n!$ | расстановка $n$ элементов по порядку |

::: example W02 | Примеры из лекции
- Двузначных чисел: $9\cdot10 = 90$; делящихся на 5: $9\cdot 2=18$.
- Выбор 2 тузов из 4: $\binom42 = 6$.
- 5 человек выходят из лифта в 10-этажном доме, каждый на своём этаже: $V(10,5) = 10\cdot9\cdot8\cdot7\cdot6 = 30\,240$.
- Бридж, 13 карт из 52: $P(\text{ровно 6 пик}) = \dfrac{\binom{13}{6}\binom{39}{7}}{\binom{52}{13}} \approx 0{,}0416$.
:::

::: intuition
Спросите себя: **важен ли порядок?** Состав команды {Аня, Оля} = {Оля, Аня} → сочетания. Пьедестал (золото: Аня, серебро: Оля) ≠ (золото: Оля, серебро: Аня) → размещения.
:::

# Главные свойства

::: formula | Свойства вероятности
$$P(A') = 1 - P(A)$$
$$A\subset B \;\Rightarrow\; P(A)\le P(B)$$
$$P(A\cup B) = P(A) + P(B) - P(A\cap B)$$
:::

Зачем вычитать $P(A\cap B)$? Потому что общая часть посчитана **дважды** (в $A$ и в $B$). Если $A$ и $B$ несовместны, $P(A\cap B)=0$. {lecture:W02}

::: tip W02 | Трюк с противоположным событием
«Хотя бы один» проще всего считать через противоположное («ни одного»). Хотя бы один орёл в 3 бросках: $1 - P(RRR) = 1 - \frac18 = \frac78$.
:::

::: formula own | Сумма трёх событий (включения–исключения)
$$P(A\cup B\cup C) = P(A)+P(B)+P(C) - P(A\cap B) - P(A\cap C) - P(B\cap C) + P(A\cap B\cap C)$$
:::

# Условная вероятность

::: def | Условная вероятность
При $P(B) > 0$:
$$P(A\mid B) = \frac{P(A\cap B)}{P(B)}$$
Читаем: «вероятность $A$ **при условии**, что произошло $B$».
:::

::: intuition
Условие **уменьшает мир**: мы уже знаем, что произошло $B$, поэтому всё вне $B$ выбрасываем. $P(A\mid B)$ показывает, какую часть **нового, меньшего мира** $B$ занимает $A$.
:::

::: example own
Бросок кубика. Известно, что выпало **чётное** число ($B=\{2,4,6\}$). Каков шанс шестёрки? В «новом мире» 3 равновероятных исхода, значит $P(6\mid B) = \frac13$ (без этого знания было $\frac16$). По формуле: $\frac{P(\{6\})}{P(B)} = \frac{1/6}{1/2} = \frac13$.
:::

Из определения следует **правило умножения**: $P(A\cap B) = P(B)\cdot P(A\mid B) = P(A)\cdot P(B\mid A)$.

# Формула полной вероятности

События $H_1, H_2, \dots, H_n$ образуют **полную группу** (разбиение $S$), если они попарно несовместны и вместе дают всё $S$ — всегда происходит ровно одно из них. Тогда:

::: formula | Полная вероятность
$$P(A) = \sum_{i=1}^{n} P(H_i)\,P(A\mid H_i) = P(H_1)P(A\mid H_1) + \dots + P(H_n)P(A\mid H_n)$$
:::

Удобнее всего считать на **дереве**: перемножаем вероятности вдоль ветвей и **складываем** ветви, ведущие к $A$.

# Формула Байеса — обратный вывод

Знаем $P(A\mid H_i)$ («как часто тест положителен у больных»), а хотим $P(H_i\mid A)$ («каков шанс, что я болен, раз тест положительный»).

::: formula | Формула Байеса
$$P(H_k\mid A) = \frac{P(H_k)\,P(A\mid H_k)}{P(A)} = \frac{P(H_k)\,P(A\mid H_k)}{\sum_i P(H_i)\,P(A\mid H_i)}$$
- $P(H_k)$ — **априорная** вероятность (до наблюдения),
- $P(H_k\mid A)$ — **апостериорная** вероятность (после наблюдения $A$).
:::

::: example own | Тест на редкую болезнь
Болеет 1% населения. Тест находит болезнь у 95% больных, но также положителен у 5% здоровых. Результат **положительный**. Каков шанс, что человек болен?

@svg tree

$$P(+) = 0{,}01\cdot0{,}95 + 0{,}99\cdot 0{,}05 = 0{,}0095 + 0{,}0495 = 0{,}059$$
$$P(D\mid +) = \frac{0{,}0095}{0{,}059} \approx 0{,}161$$

Всего **около 16%**! Болезнь настолько редка, что ложных тревог среди здоровых (0,0495) в 5 с лишним раз больше, чем настоящих обнаружений (0,0095). Поэтому после положительного скринингового теста делают второй, более точный.
:::

::: steps | Задача на Байеса — схема
1. Назовите гипотезы $H_1, \dots, H_n$ (откуда объект) и событие $A$ (что наблюдали).
2. Выпишите $P(H_i)$ и $P(A\mid H_i)$ из условия (проценты → доли).
3. Посчитайте $P(A)$ по формуле полной вероятности (дерево).
4. Разделите «свою ветвь» на $P(A)$. Проверьте, что $\sum_k P(H_k\mid A) = 1$.
:::

# Независимость событий

::: def | Независимость двух событий
$A$ и $B$ **независимы**, если
$$P(A\cap B) = P(A)\cdot P(B)$$
Равносильно (при $P(B)>0$): $P(A\mid B) = P(A)$ — информация о $B$ не меняет шанс $A$.
:::

::: def | Независимость многих событий
$A_1, \dots, A_n$ **независимы в совокупности**, если для **любого** их подмножества вероятность пересечения = произведению вероятностей. Для трёх событий нужно проверить **4 равенства**:
$$P(A\cap B)=P(A)P(B),\quad P(A\cap C)=P(A)P(C),\quad P(B\cap C)=P(B)P(C),$$
$$P(A\cap B\cap C)=P(A)P(B)P(C).$$
Если выполнены только первые три — события независимы **попарно**, но не обязательно в совокупности.
:::

::: example own | Попарно да, в совокупности нет
Два броска монеты: $A$ = «орёл в 1-м», $B$ = «орёл во 2-м», $C$ = «ровно один орёл». У каждого вероятность $\frac12$, у каждой пары пересечение с вероятностью $\frac14$ (например, $A\cap C = \{OR\}$) — **попарно независимы**. Но $A\cap B\cap C=\varnothing$, поэтому $P(A\cap B\cap C) = 0 \ne \frac18$ — **не независимы в совокупности**.
:::

::: warn
**Независимые ≠ несовместные!** Если $A\cap B = \varnothing$ и у обоих положительная вероятность, то $P(A\cap B) = 0 \ne P(A)P(B)$ — такие события **зависимы** (наступление одного исключает другое, а это очень много о нём говорит).
:::

::: tip own
Если $A$ и $B$ независимы, то независимы и пары $A'$ и $B$, $A$ и $B'$, $A'$ и $B'$. Пригодится для «оба откажут»: $P(A'\cap B') = P(A')P(B')$.
:::

## Надёжность схем

Элементы работают **независимо**, элемент $i$ работает с вероятностью $p_i$.

@svg circuits

- **последовательно** — работает, если работают **все**: $P = p_1 p_2\cdots p_n$;
- **параллельно** — работает, если работает **хотя бы один**: $P = 1 - (1-p_1)(1-p_2)\cdots(1-p_n)$.

::: example own
Два элемента с надёжностью 0,9: последовательно $0{,}9^2 = 0{,}81$, параллельно $1 - 0{,}1^2 = 0{,}99$. Параллельное соединение (резервирование) сильно повышает надёжность — так работают резервные серверы и RAID-массивы.
:::

# Схема Бернулли

Эксперимент с двумя исходами («успех» с вероятностью $p$, «неудача» с $1-p$) повторяем $n$ раз **независимо**.

::: formula | Вероятность k успехов в n испытаниях
$$P(k) = \binom{n}{k} p^k (1-p)^{n-k},\qquad k = 0, 1, \dots, n$$
:::

::: intuition
$p^k(1-p)^{n-k}$ — шанс **одной конкретной** последовательности (например, УУННН). $\binom nk$ — сколько таких последовательностей (на каких местах стоят успехи).
:::

::: example own | Угадывание теста
5 вопросов, в каждом 4 варианта, угадываем ($p=\frac14$). Шанс хотя бы 3 верных:
$$P(\ge3) = \binom53\left(\tfrac14\right)^3\left(\tfrac34\right)^2 + \binom54\left(\tfrac14\right)^4\tfrac34 + \left(\tfrac14\right)^5 = \frac{90+15+1}{1024}\approx 0{,}104$$
:::

@chart bernoulli

Эта схема ведёт к **биномиальному распределению** из темы 3.

# В Excel

~~~excel Комбинаторика и схема Бернулли
A1: =COMBIN(52,13)                 // число раскладов 13 карт из 52
A2: =COMBIN(13,6)*COMBIN(39,7)/COMBIN(52,13)   // P(ровно 6 пик) ≈ 0,0416
A3: =PERMUT(10,5)                  // V(10,5) = 30240
A4: =FACT(5)                       // 5! = 120
A5: =BINOM.DIST(3,5,0.25,FALSE)    // P(ровно 3 успеха)
A6: =1-BINOM.DIST(2,5,0.25,TRUE)   // P(не меньше 3 успехов) ≈ 0,1035
~~~

~~~python Проверка в Python
from math import comb, perm, factorial
from fractions import Fraction as F

print(comb(13, 6) * comb(39, 7) / comb(52, 13))   # 0.04156...
print(perm(10, 5), factorial(5))                  # 30240 120

# Байес: тест на редкую болезнь (точные дроби)
pD, sens, fp = F(1, 100), F(95, 100), F(5, 100)
p_plus = pD * sens + (1 - pD) * fp
print(p_plus, float(pD * sens / p_plus))          # 59/1000  0.161...
~~~

::: summary
- События = множества: сумма, произведение, разность, дополнение; диаграммы Венна.
- Классически: $P(A)=|A|/|S|$; комбинаторика: $\binom nk$, $V(n,k)$.
- $P(A') = 1-P(A)$, $P(A\cup B) = P(A)+P(B)-P(A\cap B)$.
- $P(A\mid B) = P(A\cap B)/P(B)$; полная: $P(A)=\sum P(H_i)P(A\mid H_i)$; Байес: $P(H_k\mid A) = P(H_k)P(A\mid H_k)/P(A)$.
- Независимость: $P(A\cap B)=P(A)P(B)$; для 3 событий 4 условия; независимые ≠ несовместные.
- Бернулли: $\binom nk p^k(1-p)^{n-k}$.
:::
`,

    cheatsheet: md`
## События
$A'$ — не $A$; $A\cap B$ — оба; $A\cup B$ — хотя бы одно; $A-B$ — $A$ без $B$; несовместные: $A\cap B=\varnothing$.

## Подсчёт
- классически: $P(A) = |A| / |S|$ (исходы равновероятны)
- $\binom nk = \frac{n!}{k!(n-k)!}$ (порядок не важен), $V(n,k)=\frac{n!}{(n-k)!}$ (важен), $n^k$ (с повторениями)

## Формулы
$$P(A')=1-P(A)\qquad P(A\cup B)=P(A)+P(B)-P(A\cap B)$$
$$P(A\cup B\cup C)=\textstyle\sum P(\cdot) - \sum P(\text{пар}) + P(A\cap B\cap C)$$
$$P(A\mid B)=\frac{P(A\cap B)}{P(B)}\qquad P(A\cap B)=P(B)\,P(A\mid B)$$
$$P(A)=\sum_i P(H_i)P(A\mid H_i)\qquad P(H_k\mid A)=\frac{P(H_k)P(A\mid H_k)}{P(A)}$$

## Независимость
- $P(A\cap B)=P(A)P(B)$ ⇔ $P(A\mid B)=P(A)$
- 3 события: 3 равенства для пар + 1 для тройки (попарно ≠ в совокупности)
- несовместные с $P>0$ → **зависимы**

## Схемы (элементы независимы)
- последовательно: $\prod p_i$
- параллельно: $1-\prod(1-p_i)$
- «хотя бы один» → через противоположное

## Бернулли
$P(k) = \binom nk p^k(1-p)^{n-k}$ · Excel: ‹BINOM.DIST(k,n,p,FALSE)›, ‹COMBIN›, ‹PERMUT›, ‹FACT›
`,

    exercises: [
      {
        id: 'e1', tag: 'C03', title: 'Три события и включения–исключения',
        text: md`
Известно: $P(A) = 0{,}4$, $P(B) = 0{,}5$, $P(C) = 0{,}3$, $P(A-B) = 0{,}1$, $P(C-B) = 0{,}2$ и $A\cap C = \varnothing$.
Найдите $P(A\mid B)$, $P(C\mid B)$, $P(A\cup B\cup C)$, $P(A\cup B)$, $P(B\cup C)$.
`,
        hint: md`$A = (A-B)\cup(A\cap B)$, части не пересекаются, значит $P(A\cap B) = P(A) - P(A-B)$. Раз $A\cap C=\varnothing$, то и $A\cap B\cap C=\varnothing$.`,
        solution: md`
1. $P(A\cap B) = 0{,}4 - 0{,}1 = 0{,}3$; $\;P(C\cap B) = 0{,}3 - 0{,}2 = 0{,}1$.
2. $P(A\mid B) = \dfrac{0{,}3}{0{,}5} = 0{,}6$; $\;P(C\mid B) = \dfrac{0{,}1}{0{,}5} = 0{,}2$.
3. $A\cap C = \varnothing \Rightarrow P(A\cap C) = 0$ и $P(A\cap B\cap C)=0$:
$$P(A\cup B\cup C) = 0{,}4+0{,}5+0{,}3-0{,}3-0-0{,}1+0 = 0{,}8$$
4. $P(A\cup B) = 0{,}4+0{,}5-0{,}3 = 0{,}6$; $\;P(B\cup C) = 0{,}5+0{,}3-0{,}1 = 0{,}7$.
`,
        answer: md`$P(A\mid B)=0{,}6$; $P(C\mid B)=0{,}2$; $P(A\cup B\cup C)=0{,}8$; $P(A\cup B)=0{,}6$; $P(B\cup C)=0{,}7$.`
      },
      {
        id: 'e2', tag: 'C03', title: 'Два кубика — кто от кого зависит?',
        text: md`
Бросаем два кубика. События: $A$ — сумма очков **не меньше 9**, $B$ — на первом кубике **пятёрка**, $C$ — на втором кубике **чётное** число.
Исследуйте независимость $A, B, C$ (попарно и в совокупности). Найдите $P(A\cap B\cap C)$, $P(A\mid B)$ и $P(B\mid C)$.
`,
        hint: md`$|S| = 36$. Выпишите пары с суммой 9, 10, 11, 12. Для каждой пары событий сравните $P(X\cap Y)$ и $P(X)P(Y)$.`,
        solution: md`
**По отдельности:** сумма ≥ 9: для 9 — 4 пары, 10 — 3, 11 — 2, 12 — 1, всего 10 → $P(A) = \frac{10}{36} = \frac5{18}$. $P(B) = \frac16$, $P(C) = \frac12$.

**Пары:**
- $A\cap B$: (5,4), (5,5), (5,6) → $\frac1{12}$, а $P(A)P(B) = \frac5{108}\approx0{,}046 \ne 0{,}083$ → **зависимы**.
- $A\cap C$: второй = 4 → (5,4), (6,4); второй = 6 → (3,6), (4,6), (5,6), (6,6); всего 6 → $\frac16$, а $P(A)P(C) = \frac5{36}\approx0{,}139\ne 0{,}167$ → **зависимы**.
- $B\cap C$: (5,2), (5,4), (5,6) → $\frac1{12} = \frac16\cdot\frac12$ → **независимы**.

**Тройка:** $A\cap B\cap C = \{(5,4), (5,6)\}$ → $P = \frac1{18}$. Раз уже $A,B$ зависимы, события **не независимы в совокупности**.

$P(A\mid B) = \dfrac{1/12}{1/6} = \dfrac12$ (зная пятёрку на первом кубике, нужно ≥ 4 на втором: 3 из 6). $\;P(B\mid C) = \dfrac{1/12}{1/2} = \dfrac16$ (= $P(B)$, так как $B$ и $C$ независимы).
`,
        answer: md`Независимы только $B$ и $C$; независимости в совокупности нет. $P(A\cap B\cap C)=\frac1{18}$, $P(A\mid B)=\frac12$, $P(B\mid C)=\frac16$.`
      },
      {
        id: 'e3', tag: 'C03', title: 'Случайное число и условие',
        text: md`
Выбираем одно число из $\{1, 2, \dots, 20\}$. Какова вероятность, что оно **делится на 3**, если известно, что оно **чётное**? Независимы ли события «делится на 3» и «чётное»?
`,
        hint: md`Условие сужает мир до чётных чисел — сколько их и сколько из них делится на 3 (то есть на 6)?`,
        solution: md`
$B$ = чётные = {2, 4, …, 20}, $|B| = 10$. $A\cap B$ = делящиеся на 6 = {6, 12, 18}, 3 числа.
$$P(A\mid B) = \frac{3}{10} = 0{,}3$$
Без условия: $A$ = {3, 6, 9, 12, 15, 18}, $P(A) = \frac6{20} = 0{,}3$. Раз $P(A\mid B) = P(A)$, события **независимы** (проверка: $P(A\cap B) = \frac3{20} = 0{,}3\cdot0{,}5$ ✓).
`,
        answer: md`$P = 0{,}3$; события независимы.`
      },
      {
        id: 'e4', tag: 'C03', title: 'Три резервных сервера',
        text: md`
У сервиса три независимых сервера; каждый доступен с вероятностью 0,95. Найдите вероятность того, что (а) все три одновременно недоступны, (б) работает хотя бы один, (в) работает ровно один.
`,
        hint: md`Недоступность одного: $0{,}05$. (б) через противоположное событие. (в) схема Бернулли с $n=3$, $k=1$.`,
        solution: md`
(а) $0{,}05^3 = 0{,}000125$.
(б) $1 - 0{,}000125 = 0{,}999875$ («параллельная» схема).
(в) $\binom31\cdot 0{,}95\cdot 0{,}05^2 = 3\cdot0{,}95\cdot0{,}0025 = 0{,}007125$.
`,
        answer: md`(а) 0,000125; (б) 0,999875; (в) 0,007125.`
      },
      {
        id: 'e5', tag: 'C03', title: 'Попарно независимы, но не в совокупности',
        text: md`
Бросаем два кубика. $A$ — на первом нечётное число, $B$ — на втором нечётное число, $C$ — сумма очков нечётная. Проверьте, независимы ли $A, B, C$ попарно и в совокупности.
`,
        hint: md`Сумма нечётна ровно тогда, когда на одном кубике чётное число, а на другом нечётное.`,
        solution: md`
$P(A) = P(B) = \frac12$; $C$ = (нечёт., чёт.) или (чёт., нечёт.) → $P(C) = \frac12$.
- $A\cap B$ = оба нечётные: $\frac14 = \frac12\cdot\frac12$ ✓
- $A\cap C$ = первый нечёт., второй чёт.: $\frac14$ ✓
- $B\cap C$ = первый чёт., второй нечёт.: $\frac14$ ✓

**Попарно независимы.** Но оба нечётные ⇒ сумма чётная, значит $A\cap B\cap C = \varnothing$ и $P = 0 \ne \frac18$. **В совокупности не независимы** — зная $A$ и $B$, мы знаем всё о $C$.
`,
        answer: md`Попарно независимы; в совокупности — нет ($P(A\cap B\cap C) = 0 \ne 1/8$).`
      },
      {
        id: 'e6', tag: 'C03', title: 'Надёжность схем из реле',
        text: md`
Реле работают независимо, каждое с вероятностью $p$. Найдите вероятность прохождения сигнала через схемы а) и б), затем подставьте $p = 0{,}9$.

@svg exCircuits

а) реле 1 и 2 последовательно, а всё вместе параллельно с реле 3; б) реле 1 и 2 параллельно, а всё вместе последовательно с реле 3.
`,
        hint: md`Разбивайте схему на блоки: сначала посчитайте внутренний блок, потом считайте его одним элементом.`,
        solution: md`
**а)** Блок (1–2 последовательно): $p^2$. Параллельно с 3: $P_a = 1 - (1-p^2)(1-p) = p + p^2 - p^3$.
При $p = 0{,}9$: $1 - 0{,}19\cdot 0{,}1 = 0{,}981$.

**б)** Блок (1 ∥ 2): $1-(1-p)^2 = 2p - p^2$. Последовательно с 3: $P_b = (2p-p^2)\,p = 2p^2 - p^3$.
При $p=0{,}9$: $0{,}99\cdot 0{,}9 = 0{,}891$.

Схема а) надёжнее — реле 3 служит «обходом» всей ветви.
`,
        answer: md`а) $p+p^2-p^3$ (0,981 при $p=0{,}9$); б) $2p^2-p^3$ (0,891).`
      },
      {
        id: 'e7', tag: 'C03', title: 'Откуда бракованная микросхема? (Байес)',
        text: md`
Микросхемы поступают с трёх заводов: A поставляет 50%, B — 30%, C — 20% всех микросхем. Доля брака соответственно 1%, 3% и 4%. Случайно выбранная микросхема оказалась **бракованной**. Какова вероятность, что она с завода A, B, C?
`,
        hint: md`Гипотезы: завод A, B, C. Сначала полная вероятность $P(W)$, потом Байес для каждого завода.`,
        solution: md`
$$P(W) = 0{,}5\cdot0{,}01 + 0{,}3\cdot 0{,}03 + 0{,}2\cdot0{,}04 = 0{,}005+0{,}009+0{,}008 = 0{,}022$$
$$P(A\mid W) = \frac{0{,}005}{0{,}022}\approx 0{,}227,\quad P(B\mid W) = \frac{0{,}009}{0{,}022}\approx0{,}409,\quad P(C\mid W)=\frac{0{,}008}{0{,}022}\approx0{,}364$$
Сумма = 1 ✓. Интересно: хотя A выпускает половину микросхем, бракованная скорее всего с завода **B** — там брак в 3 раза чаще.
`,
        answer: md`$P(W)=0{,}022$; A: ≈ 0,227; B: ≈ 0,409; C: ≈ 0,364.`
      },
      {
        id: 'e8', tag: 'C03', title: 'Нечестный кубик в мешке',
        text: md`
В мешке $N$ кубиков; у одного **шестёрки на всех гранях**, остальные честные. Достаём кубик и бросаем его 5 раз — каждый раз шестёрка. Какова вероятность, что нам попался нечестный кубик? Дайте ответ для $N = 100$ и $N = 100\,000$ и проинтерпретируйте.
`,
        hint: md`Гипотезы: нечестный ($1/N$) или честный ($(N-1)/N$). Для честного шанс пяти шестёрок $(1/6)^5 = 1/7776$.`,
        solution: md`
$$P(\text{нечест.}\mid 5\times6) = \frac{\frac1N\cdot 1}{\frac1N\cdot1 + \frac{N-1}{N}\cdot\frac1{7776}} = \frac{1}{1 + \frac{N-1}{7776}}$$
- $N = 100$: $\approx 0{,}987$ — почти наверняка нечестный.
- $N = 100\,000$: $\approx 0{,}072$ — скорее честный, которому «повезло».

**Интерпретация:** одно и то же наблюдение ведёт к совсем разным выводам в зависимости от **априорной** вероятности. Когда нечестных кубиков очень мало, даже 5 шестёрок подряд недостаточно для уверенности.
`,
        answer: md`$N=100$: ≈ 0,987; $N=100\,000$: ≈ 0,072.`
      }
    ]
  };

  SAD.registerTopic('t02', { charts: charts, svg: svg, pl: pl, en: en, ru: ru });
})();
