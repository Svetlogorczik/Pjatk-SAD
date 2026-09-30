/* Topic 1 — Descriptive statistics (lecture W01, classes C01–C02) */
(function () {
  var md = SAD.md;

  var charts = {
    diceBar: { type: 'bar', labels: ['1', '2', '3', '4', '5', '6'], values: [5, 4, 6, 3, 5, 7],
      xLabel: { pl: 'liczba oczek', en: 'number of dots', ru: 'число очков' }, yLabel: { pl: 'liczebność', en: 'count', ru: 'частота (шт.)' },
      caption: { pl: 'Wykres słupkowy: 30 rzutów kostką (przykład z wykładu W01)', en: 'Bar chart: 30 dice rolls (lecture W01 example)', ru: 'Столбчатая диаграмма: 30 бросков кубика (пример из лекции W01)' } },
    dicePie: { type: 'pie', labels: ['1', '2', '3', '4', '5', '6'], values: [5, 4, 6, 3, 5, 7],
      caption: { pl: 'Te same dane na wykresie kołowym: kąt wycinka = częstość · 360°', en: 'The same data as a pie chart: slice angle = frequency · 360°', ru: 'Те же данные на круговой диаграмме: угол сектора = частота · 360°' } },
    shopsHist: { type: 'hist', edges: [70, 90, 110, 130, 150, 170, 190, 210], counts: [5, 7, 17, 21, 10, 6, 3],
      xLabel: { pl: 'powierzchnia sklepu [m²]', en: 'shop area [m²]', ru: 'площадь магазина [м²]' }, yLabel: { pl: 'liczebność', en: 'count', ru: 'частота' },
      caption: { pl: 'Histogram powierzchni 69 sklepów (W01)', en: 'Histogram of the areas of 69 shops (W01)', ru: 'Гистограмма площадей 69 магазинов (W01)' } },
    fuseHist: { type: 'hist', edges: [40.5, 45.5, 50.5, 55.5, 60.5, 65.5, 70.5, 75.5], counts: [1, 5, 10, 12, 9, 2, 1], polygon: true, xDecimals: 1,
      xLabel: { pl: 'czas przepalenia [min]', en: 'blow time [min]', ru: 'время перегорания [мин]' }, yLabel: { pl: 'liczebność', en: 'count', ru: 'частота' },
      caption: { pl: 'Histogram i łamana liczebności: czasy przepalenia 40 bezpieczników (W01)', en: 'Histogram and frequency polygon: blow times of 40 fuses (W01)', ru: 'Гистограмма и полигон частот: время перегорания 40 предохранителей (W01)' } },
    ageHist: { type: 'hist', edges: [19, 25, 31, 37, 43, 49], counts: [0.12, 0.24, 0.32, 0.20, 0.12], percent: true,
      xLabel: { pl: 'wiek [lata]', en: 'age [years]', ru: 'возраст [лет]' }, yLabel: { pl: 'częstość', en: 'frequency', ru: 'относительная частота' },
      caption: { pl: 'Histogram częstości wieku 25 osób (W01): 5 klas o szerokości 6', en: 'Frequency histogram of the age of 25 people (W01): 5 classes of width 6', ru: 'Гистограмма относительных частот возраста 25 человек (W01): 5 классов шириной 6' } },
    sigma: { type: 'sigma', mu: 0, sigma: 1, symbolic: true,
      caption: { pl: 'Reguła 68–95–99,7: ile danych leży w odległości 1, 2 i 3 odchyleń standardowych od średniej', en: 'The 68–95–99.7 rule: how much data lies within 1, 2 and 3 standard deviations of the mean', ru: 'Правило 68–95–99,7: сколько данных лежит в пределах 1, 2 и 3 стандартных отклонений от среднего' } },
    salaryBox: { type: 'box', range: [0, 20000], annotate: true,
      boxes: [{ min: 2000, q1: 2000, med: 2500, q3: 3500, max: 19000, whiskerLow: 2000, whiskerHigh: 3500, outliers: [19000], mean: 4000 }],
      xLabel: { pl: 'dochód [zł]', en: 'income [PLN]', ru: 'доход [зл]' },
      caption: { pl: 'Wykres ramkowy dochodów 11 osób (W01): kropka = obserwacja odstająca (19 000), × = średnia', en: 'Box plot of the incomes of 11 people (W01): dot = outlier (19,000), × = mean', ru: 'Ящик с усами для доходов 11 человек (W01): точка = выброс (19 000), × = среднее' } },

    exLangBar: { type: 'bar', labels: ['Python', 'JavaScript', 'Java', 'C++', 'Go'], values: [9, 6, 5, 3, 1],
      yLabel: { pl: 'liczba osób', en: 'people', ru: 'человек' } },
    exLangPie: { type: 'pie', labels: ['Python', 'JavaScript', 'Java', 'C++', 'Go'], values: [9, 6, 5, 3, 1] },
    exQueueBox: { type: 'box', range: [0, 34], annotate: true,
      boxes: [{ min: 4, q1: 5, med: 7, q3: 8, max: 31, whiskerLow: 4, whiskerHigh: 9, outliers: [31], mean: 8.64 }],
      xLabel: { pl: 'czas czekania [min]', en: 'waiting time [min]', ru: 'время ожидания [мин]' } },
    exCommuteHist: { type: 'hist', edges: [16, 21, 26, 31, 36, 41, 46], counts: [4, 7, 8, 6, 4, 1], polygon: true,
      xLabel: { pl: 'czas dojazdu [min]', en: 'commute time [min]', ru: 'время в пути [мин]' }, yLabel: { pl: 'liczebność', en: 'count', ru: 'частота' } },
    exUsageHist: { type: 'hist', edges: [0, 3, 6, 9, 12, 15, 18, 21], counts: [5 / 60, 14 / 60, 18 / 60, 11 / 60, 7 / 60, 3 / 60, 2 / 60], percent: true,
      xLabel: { pl: 'transfer danych [GB]', en: 'data usage [GB]', ru: 'трафик [ГБ]' }, yLabel: { pl: 'częstość', en: 'frequency', ru: 'отн. частота' } },
    exCourierBox: { type: 'box', range: [15, 48],
      boxes: [
        { label: 'A', min: 22, q1: 24.5, med: 27, q3: 29.5, max: 39, whiskerLow: 22, whiskerHigh: 31, outliers: [39], mean: 27.54 },
        { label: 'B', min: 18, q1: 21.5, med: 29, q3: 36, max: 45, mean: 29.38 }
      ],
      xLabel: { pl: 'czas dostawy [h]', en: 'delivery time [h]', ru: 'время доставки [ч]' } }
  };

  /* ======================================================================= */
  var pl = {
    lead: 'Zanim cokolwiek policzymy, trzeba dane **zobaczyć** i **opisać**: kilkoma liczbami (średnia, mediana, rozrzut) i kilkoma wykresami (słupki, histogram, pudełko).',
    lecture: md`
# Po co jest statystyka opisowa?

Statystyka bada **zbiorowości** obiektów (ludzi, produktów, zjawisk). Wnioski dotyczą całej zbiorowości, a nie pojedynczego obiektu. Pierwszy krok zawsze jest ten sam: **zebrać dane, uporządkować je i pokazać** tak, żeby w kilka sekund dało się coś zauważyć. {lecture:W01}

Cele statystyki opisowej (wg wykładu):
- **scharakteryzować dane w zwięzłej formie** — np. średni dochód, średnie zużycie paliwa;
- **odnaleźć regularności** (albo nieregularności) ukryte w danych i zależności między ich częściami.

::: intuition
Masz przed sobą 30 liczb. Patrząc na nie — nic nie widzisz. Statystyka opisowa to jak streszczenie książki: zamiast 300 stron dostajesz jeden akapit („typowa wartość to około 57, większość mieści się między 50 a 65, jest jedna dziwna wartość 75”) i jeden obrazek.
:::

Zanim zaczniesz liczyć, **obejrzyj dane surowe** i odpowiedz sobie na pytania z wykładu:
- jaką cechę mierzono i **w jakich jednostkach**? (różne jednostki trzeba sprowadzić do wspólnej skali),
- **ile** jest obserwacji, czy **nie brakuje** części danych, czy możliwe są przekłamania,
- **po co** zebrano dane — na jakie pytanie mają odpowiedzieć?

# Populacja, próbka, cecha

::: def | Populacja i próbka
**Populacja** — zbiór obiektów badanych ze względu na określoną cechę (tę cechę nazywamy **zmienną**).
**Próbka** — zbiór wartości cechy zbadanych obiektów, czyli tylko wylosowanej części populacji. {lecture:W01}
:::

Badanie może być:
- **pełne** (całkowite, wyczerpujące) — badamy wszystkie obiekty; ma sens, gdy populacja jest mała, a badanie tanie i nieniszczące;
- **częściowe** — badamy tylko **próbkę**. Tak jest prawie zawsze: badanie wszystkiego jest za drogie (spis powszechny robi się raz na 10 lat), niszczące (nie przepalisz wszystkich bezpieczników, żeby sprawdzić ich wytrzymałość) albo niemożliwe (populacja **hipotetyczna**, np. przyszli klienci produktu, którego jeszcze nie ma).

Próbka musi być **losowa** i **reprezentatywna** — odzwierciedlać zmienność w całej populacji. Przykład z wykładu: ankieter w galerii handlowej w Warszawie w poniedziałek o 10:00 dostanie odpowiedzi, ale nie od osób, które w tym czasie pracują — próbka nie będzie reprezentatywna. Dlatego ośrodki badania opinii stosują **losowanie warstwowe**: dzielą populację na jednorodne warstwy (np. regiony) i z każdej losują proporcjonalnie do jej wielkości. W produkcji jest prościej — zwykle wystarcza **prosta próbka losowa**. {lecture:W01}

| Populacja | Badana cecha (zmienna) | Zebrane dane (próbka) |
|---|---|---|
| zbiór detali | jakość detalu (spełnia / nie spełnia wymagań) | jakości zbadanych detali |
| komputery w sieci | liczba awarii w danym okresie | liczby awarii wybranych komputerów |
| projekty przysłane na konkurs | ocena projektu (punkty) | oceny wybranych projektów |
| pracownicy firmy | staż pracy | staże wylosowanych osób |

# Rodzaje cech

- **Ilościowe** (liczby):
  - **ciągłe** — mogą przyjąć każdą wartość z przedziału: wzrost, waga, czas (czas jest z natury ciągły, nawet jeśli podajemy go w pełnych godzinach);
  - **dyskretne** (skokowe) — zwykle liczby całkowite z liczenia: liczba dzieci w rodzinie, liczba reklamacji, liczba awarii.
- **Jakościowe** (kategorie):
  - **uporządkowane** — kategorie mają naturalną kolejność: miasta małe/średnie/duże, rodziny bezdzietne/wielodzietne;
  - **nominalne** — kategorii nie da się uporządkować: grupa krwi, płeć, kolor oczu.

Na wykładzie wspomniano też **dane ilorazowe** (dodatnie, niezerowe): można je dzielić, logarytmować — to „najbogatszy” typ danych. {lecture:W01}

::: warn
Metoda musi pasować do typu cechy. „Średnia grupa krwi” nie ma sensu — dla cech nominalnych możesz policzyć tylko liczebności, częstości i **modę** (najczęstszą kategorię).
:::

# Porządkowanie danych: szeregi

**Szereg szczegółowy (wyliczający)** — po prostu wartości ułożone rosnąco. Samo sortowanie już dużo daje: widać minimum, maksimum i powtarzające się wartości.

**Szereg rozdzielczy (strukturalny)** — dane podzielone na **klasy** z podaną liczbą elementów w każdej klasie:
- **punktowy** — gdy różnych wartości jest mało (każda wartość = osobna klasa),
- **przedziałowy** — gdy różnych wartości jest dużo (klasy to przedziały).

::: example W01 | Szereg punktowy
Liczba pracowników w 30 przedsiębiorstwach koncernu: 100; 125; 170; 144; 144; 235; 301; … Po posortowaniu okazuje się, że różnych wartości jest tylko 6:

| Liczba pracowników | 100 | 125 | 144 | 170 | 235 | 301 | razem |
|---|---:|---:|---:|---:|---:|---:|---:|
| liczebność | 5 | 5 | 9 | 4 | 3 | 4 | 30 |

Zamiast 30 liczb pamiętamy 12 — i możemy odtworzyć wszystkie wartości (bez ich pierwotnej kolejności).
:::

Dla każdej klasy liczymy:

| Symbol | Nazwa | Wzór | Sens |
|---|---|---|---|
| $n_i$ | liczebność | — | ile obserwacji jest w klasie $i$ |
| $w_i$ | częstość (względna) | $w_i = n_i / n$ | jaka to część całości (suma = 1 = 100%) |
| $N_i$ | liczebność skumulowana | $N_i = n_1 + \dots + n_i$ | ile obserwacji jest „do końca klasy $i$” |
| $W_i$ | częstość skumulowana | $W_i = w_1 + \dots + w_i$ | jaka część jest „do końca klasy $i$” (rośnie do 1) |

::: example W01 | Szereg przedziałowy: powierzchnie 69 sklepów [m²]
| przedział | 70–90 | 90–110 | 110–130 | 130–150 | 150–170 | 170–190 | 190–210 |
|---|---:|---:|---:|---:|---:|---:|---:|
| $n_i$ | 5 | 7 | 17 | 21 | 10 | 6 | 3 |
| $w_i$ | 0,07 | 0,10 | 0,25 | 0,30 | 0,14 | 0,09 | 0,04 |
| $N_i$ | 5 | 12 | 29 | 50 | 60 | 66 | 69 |
| $W_i$ | 0,07 | 0,17 | 0,42 | 0,72 | 0,87 | 0,96 | 1,00 |

Czytamy np.: 42% sklepów ma powierzchnię mniejszą niż 130 m².
:::

@chart shopsHist

::: note
Grupując dane w przedziały **tracimy bezpowrotnie część informacji**: wiemy, ile obserwacji jest w przedziale, ale nie wiemy, jak są w nim rozłożone. Dlatego w obliczeniach każdą wartość z przedziału utożsamiamy ze **środkiem przedziału** $\tilde x_i$. Szereg częstości to odpowiednik **gęstości**, a szereg skumulowany — **dystrybuanty** (poznamy je w tematach 3–4). {lecture:W01}
:::

# Wykresy dla cech jakościowych i dyskretnych

**Wykres słupkowy** (*bar chart*): każda kategoria/wartość ma słupek o wysokości równej liczebności (lub częstości). Słupki **nie stykają się** — między kategoriami nie ma „ciągłości”.

@chart diceBar

**Wykres kołowy** (*pie chart*): koło dzielimy na wycinki proporcjonalne do częstości.

$$\text{kąt wycinka} = \frac{n_i}{n}\cdot 360^\circ = w_i \cdot 360^\circ$$

@chart dicePie

Ograniczenia wykresu kołowego (wg wykładu):
- pokazuje tylko **udziały procentowe** (suma wycinków = 100%),
- **mało czytelny** przy wielu kategoriach,
- **porównanie dwóch wykresów kołowych** jest dużo trudniejsze niż jednego połączonego wykresu słupkowego.

::: tip W01 | Porównywanie dwóch grup
Chcesz porównać strukturę studentów w dwóch latach, gdy liczba studentów bardzo się zmieniła (544 tys. vs 1 265 tys.)? Rysuj **słupki częstości (%) obok siebie**, a nie liczebności — częstości sprowadzają obie grupy do tej samej skali.
:::

**Moda** (dominanta) — wartość/kategoria występująca **najczęściej**. Na wykresie słupkowym to najwyższy słupek. Dla kostki powyżej: moda = 6.

# Histogram — wykres dla cechy ciągłej

Gdy wartości jest dużo i prawie wszystkie są różne, grupujemy je w **klasy (przedziały) o jednakowej szerokości** i rysujemy **histogram**: słupki **stykają się**, bo cecha jest ciągła. Wysokość słupka = liczebność (histogram liczebności) albo częstość (histogram częstości).

::: steps | Jak zbudować szereg rozdzielczy i histogram (metoda z wykładu)
1. Znajdź $x_{\min}$, $x_{\max}$ i **rozstęp** $R = x_{\max} - x_{\min}$.
2. **Liczba klas**: $k \approx \sqrt{n}$ — bierzemy całkowitą najbliższą $\sqrt n$ (podłogę albo sufit, do wyboru).
3. **Szerokość klasy**: $h = \lceil R / k \rceil$ — zawsze **w górę**, żeby $k\cdot h \ge R$ (klasy muszą pokryć całą zmienność).
4. Nadwyżkę $k\cdot h - R$ rozdziel na lewo/prawo od danych (np. po połowie).
5. Przedziały **(a; b]** — lewostronnie otwarte, **prawostronnie domknięte**; pierwszy może być domknięty z obu stron. Wartość na granicy trafia do klasy **po lewej**.
6. Policz $n_i$ (i ewentualnie $w_i, N_i, W_i$). **Nie może być pustych klas w środku** — jeśli są, zmień podział.
:::

::: note W01
W przykładzie ze sklepami wykład użył przedziałów [a; b) celowo inaczej — **na ćwiczeniach stosujemy (a; b]**, bo tak liczy większość programów (i tak jest zdefiniowana dystrybuanta $F(x)=P(X\le x)$).
:::

Za mała szerokość klas → histogram „poszarpany”; za duża → zbyt wygładzony i nic nie widać. Reguła $k\approx\sqrt n$ jest prosta i zwykle wystarcza (programy komputerowe mają własne reguły, np. $h = 2{,}64\cdot IQR\cdot n^{-1/3}$ z wykładu).

::: example W01 | Bezpieczniki: 40 czasów przepalenia [min]
Norma: wkładka 20 A musi wytrzymać 28 A przez 1 godzinę. Zmierzono czasy przepalenia 40 wkładek:
51 58 64 69 61 56 41 48 56 61 75 55 46 57 70 55 47 62 55 60 54 57 65 60 53 54 49 58 62 59 53 50 58 63 64 59 52 51 65 60.

- $x_{\min}=41$, $x_{\max}=75$, $R=34$, $n=40$, $\sqrt{40}\approx 6{,}3$ → $k=7$,
- $h=\lceil 34/7\rceil = 5$, $7\cdot5=35$ → nadwyżka 1 jednostka: po pół z każdej strony, granice w „połówkach” (dzięki temu żadna obserwacja nie leży na granicy).

| nr | klasa | środek $\tilde x_i$ | $n_i$ | $w_i$ | $N_i$ | $W_i$ |
|---:|---|---:|---:|---:|---:|---:|
| 1 | 40,5–45,5 | 43 | 1 | 0,025 | 1 | 0,025 |
| 2 | 45,5–50,5 | 48 | 5 | 0,125 | 6 | 0,150 |
| 3 | 50,5–55,5 | 53 | 10 | 0,250 | 16 | 0,400 |
| 4 | 55,5–60,5 | 58 | 12 | 0,300 | 28 | 0,700 |
| 5 | 60,5–65,5 | 63 | 9 | 0,225 | 37 | 0,925 |
| 6 | 65,5–70,5 | 68 | 2 | 0,050 | 39 | 0,975 |
| 7 | 70,5–75,5 | 73 | 1 | 0,025 | 40 | 1,000 |
:::

@chart fuseHist

Histogram jest **jednomodalny** (jeden szczyt) i **mniej więcej symetryczny** — kształt przypomina **krzywą dzwonową Gaussa** (rozkład normalny, temat 5). Tak zwykle wyglądają pomiary obarczone błędami losowymi. **Łamana częstości** (pomarańczowa) łączy środki wierzchołków słupków; dokładamy puste klasy na brzegach, żeby „dochodziła” do osi.

::: example W01 | Wiek 25 osób w III filarze
30, 49, 33, 35, 37, 20, 31, 30, 36, 46, 39, 40, 38, 41, 35, 37, 24, 27, 36, 43, 45, 25, 32, 29, 28 — aż 21 różnych wartości, więc grupujemy. $n=25$ → $k=5$; $R=49-20=29$ → $h=\lceil29/5\rceil=6$; $5\cdot6=30$, nadwyżka 1 — dokładamy z lewej, bo przy $(20;26]$ wartość 20 by „wypadła”. Klasy: (19;25], (25;31], (31;37], (37;43], (43;49] z liczebnościami 3, 6, 8, 5, 3.
:::

@chart ageHist

::: note
**Histogram unormowany** ma słupki o wysokości $w_i/h$, więc łączne pole = 1, a pole nad przedziałem = częstość. Dziś rzadko używany w praktyce, ale to właśnie on przy $n\to\infty$ zamienia się w **gęstość** (temat 4). {lecture:W01}
:::

# Miary położenia — gdzie jest „środek” danych?

::: formula | Średnia arytmetyczna
$$\bar x = \frac{1}{n}\sum_{i=1}^{n} x_i = \frac{x_1+x_2+\dots+x_n}{n}$$
Dla danych pogrupowanych (środki klas $\tilde x_i$, liczebności $n_i$, $k$ klas):
$$\bar x \approx \frac{1}{n}\sum_{i=1}^{k} n_i\,\tilde x_i$$
:::

::: example W01 | Średnia z danych pogrupowanych
Dochody 10 osób [tys. zł]: klasy [1; 1,5], (1,5; 2], (2; 2,5], (2,5; 3] z liczebnościami 2, 2, 4, 2. Środki: 1,25; 1,75; 2,25; 2,75.
$$\bar x = \frac{2\cdot1{,}25 + 2\cdot1{,}75 + 4\cdot 2{,}25 + 2\cdot 2{,}75}{10} = 2{,}05 \text{ tys. zł}$$
Wynik trochę różni się od średniej z danych surowych — przez grupowanie straciliśmy informację.
:::

::: formula | Mediana (wartość środkowa)
Najpierw sortujemy: $x_{(1)} \le x_{(2)} \le \dots \le x_{(n)}$ (to tzw. **statystyki pozycyjne**; $x_{(1)}=\min$, $x_{(n)}=\max$).
$$\text{Me} = \begin{cases} x_{((n+1)/2)} & n \text{ nieparzyste}\\[4pt] \tfrac12\left(x_{(n/2)} + x_{(n/2+1)}\right) & n \text{ parzyste}\end{cases}$$
:::

::: intuition
**Średnia** to punkt, w którym deska z obciążnikami w miejscach $x_i$ byłaby w równowadze — jedna bardzo ciężka wartość daleko od reszty mocno ją przesuwa. **Mediana** to osoba stojąca dokładnie w środku kolejki ustawionej od najniższego do najwyższego — nie obchodzi jej, jak bardzo wysoki jest ostatni w kolejce.
:::

::: example W01 | Dlaczego mediana bywa lepsza od średniej
Dochody 11 osób: 4 × 2000 zł, 4 × 2500 zł, 2 × 3500 zł, 1 × 19 000 zł (menedżer).
$$\bar x = \frac{4\cdot2000 + 4\cdot2500 + 2\cdot3500 + 19000}{11} = 4000 \text{ zł}, \qquad \text{Me} = x_{(6)} = 2500 \text{ zł}$$
Średnią 4000 zł zarabia… nikt: 10 z 11 osób ma mniej. Średnia jest **wrażliwa na obserwacje odstające**, mediana jest **odporna**. Dlatego dla płac (rozkład asymetryczny) GUS podaje także medianę.
:::

**Średnia ucinana** (z parametrem $k$): odrzucamy po $k$ najmniejszych i największych obserwacji i liczymy średnią z reszty:
$$\bar x_{t,k} = \frac{1}{n-2k}\sum_{i=k+1}^{n-k} x_{(i)}$$
**Średnia winsorowska**: zamiast odrzucać, zastępujemy $k$ skrajnych obserwacji z każdej strony wartościami $x_{(k+1)}$ i $x_{(n-k)}$ (liczebność się nie zmienia). {lecture:W01}

::: warn W01
Obserwacje odstające mogą być **bardzo ważne** — np. sygnalizują rozregulowanie procesu produkcji. Średnią ucinaną stosuj, gdy odstające wartości są wynikiem **błędu** (pomyłka przy wpisywaniu, zepsuty przyrząd), a nie po to, żeby „ładniej wyszło”.
:::

**Moda** — wartość najczęstsza. Dla cechy ciągłej: szczyt (maksimum lokalne) histogramu; histogram z jednym szczytem to **jednomodalny**, z kilkoma — **wielomodalny** (często sygnał, że w danych są zmieszane różne populacje).

# Miary rozproszenia — jak bardzo dane się różnią?

Dwie klasy mogą mieć tę samą średnią ocen 3,5 — w jednej wszyscy mają 3,5, w drugiej połowa 2, połowa 5. Średnia tego nie pokaże; potrzebujemy miary **rozrzutu**.

::: formula | Rozstęp, wariancja, odchylenie standardowe
$$R = x_{(n)} - x_{(1)}$$
$$s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar x)^2 \qquad s = \sqrt{s^2}$$
Dla danych pogrupowanych: $s^2 \approx \dfrac{1}{n-1}\sum_{i=1}^{k} n_i(\tilde x_i - \bar x)^2$.
:::

- **Rozstęp** — najprostszy, ale zależy tylko od dwóch skrajnych wartości.
- **Wariancja** $s^2$ — średni kwadrat odległości od średniej (fizycznie: odpowiednik momentu bezwładności). Jej jednostka to jednostka danych **do kwadratu** (np. zł²).
- **Odchylenie standardowe** $s$ — pierwiastek z wariancji, w **tych samych jednostkach** co dane. Czytamy: „typowa odległość obserwacji od średniej”.
- **Odchylenie przeciętne** $d_1 = \frac1n\sum|x_i-\bar x|$ — używane rzadko.

::: note W01 | Dlaczego dzielimy przez n − 1, a nie przez n?
Dzielnik $n-1$ sprawia, że $s^2$ jest **estymatorem nieobciążonym** wariancji populacji — średnio „trafia” w prawdziwą wartość. Dokładnie wyjaśnimy to w temacie 9 (estymacja).
:::

::: example W01 | Wariancja z danych pogrupowanych
Dla dochodów 10 osób ($\bar x = 2{,}05$): odchylenia środków od średniej: −0,8; −0,3; 0,2; 0,7.
$$s^2 = \frac{2\cdot0{,}64 + 2\cdot0{,}09 + 4\cdot0{,}04 + 2\cdot0{,}49}{9} = \frac{2{,}6}{9} \approx 0{,}2889,\qquad s\approx 0{,}537 \text{ tys. zł}$$
:::

## Kwartyle i rozstęp międzykwartylowy

Mediana dzieli uporządkowaną próbkę **na pół**, kwartyle — **na ćwiartki**:
- **Q1 (dolny kwartyl)** = mediana podpróbki elementów „mniejszych” od mediany (stojących przed nią w kolejce),
- **Q2** = mediana,
- **Q3 (górny kwartyl)** = mediana podpróbki elementów „większych” od mediany (stojących po niej),
- **rozstęp międzykwartylowy** $IQR = Q_3 - Q_1$ — szerokość „środkowych 50%” danych. {lecture:W01}

::: example own | Kwartyle krok po kroku
Posortowane dane ($n=11$): 4, 5, 5, 6, 6, **7**, 7, 7, 8, 9, 31. Mediana = 6. element = 7.
Dolna połowa (przed medianą): 4, 5, **5**, 6, 6 → Q1 = 5. Górna połowa: 7, 7, **8**, 9, 31 → Q3 = 8. IQR = 3.
Gdy $n$ jest parzyste, dzielimy próbkę na dwie równe połowy (mediana nie należy do żadnej z nich).
:::

::: warn own | Excel liczy kwartyle na dwa sposoby
‹QUARTILE.EXC› (PL: ‹KWARTYL.PRZEDZ.OTW›) i ‹QUARTILE.INC› (‹KWARTYL.PRZEDZ.ZAMK›) mogą dać **różne wyniki**, a oba mogą się różnić od metody „mediana połówek” z wykładu. W przykładzie powyżej: EXC → 5 i 8 (jak z wykładu), INC → 5,5 i 7,5. Na kolokwium licz **ręcznie metodą z wykładu**, a w Excelu zaznacz, której funkcji używasz.
:::

## Odchylenie standardowe a rozkład normalny

Jeżeli histogram przypomina dzwon (rozkład zbliżony do normalnego), to:

| przedział | zawiera ok. |
|---|---:|
| $\bar x \pm 1\cdot s$ | 68% danych |
| $\bar x \pm 2\cdot s$ | 95% danych |
| $\bar x \pm 3\cdot s$ | 99,7% danych (**prawo trzech sigm**) |

@chart sigma

Prawo trzech sigm stosuje się w **kontroli jakości**, a regułę dwóch sigm — do **wykrywania wartości nietypowych** (obserwacja dalej niż $2s$ od średniej jest podejrzana). {lecture:W01}

# Wykres ramkowy (pudełkowy)

**Wykres ramkowy** (*box-and-whisker plot*) pokazuje pięć liczb: **min, Q1, Me, Q3, max**. Każda z czterech części zawiera ok. 25% danych.

- **pudełko** od Q1 do Q3 — środkowe 50% obserwacji; kreska w środku = mediana; szerokość pudełka = IQR;
- **wąsy** sięgają do najdalszych obserwacji, które **nie są odstające**:
  - lewy wąs do $\min\{x_k: x_k \ge Q_1 - 1{,}5\cdot IQR\}$,
  - prawy wąs do $\max\{x_k: x_k \le Q_3 + 1{,}5\cdot IQR\}$;
- obserwacje poza „płotkami” $[Q_1 - 1{,}5\,IQR;\; Q_3 + 1{,}5\,IQR]$ to **wartości odstające** — rysujemy je osobnymi kropkami. {lecture:W01}

@chart salaryBox

::: example W01 | Odczyt z wykresu
Dochody 11 osób: Q1 = 2000, Me = 2500, Q3 = 3500, IQR = 1500. Górny płotek: $3500 + 1{,}5\cdot1500 = 5750$ → 19 000 zł to obserwacja odstająca. Średnia (×) leży **na prawo** od mediany → rozkład jest **prawostronnie skośny** (dodatnia skośność).
:::

::: tip
Wykres ramkowy jest świetny do **porównywania kilku grup** — rysujesz pudełka jedno pod drugim na wspólnej osi (zob. zadanie 8).
:::

# Jak to zrobić w Excelu

~~~excel Statystyki opisowe — dane w A2:A41
D2: =COUNT(A2:A41)            // n — liczba obserwacji
D3: =AVERAGE(A2:A41)          // średnia
D4: =MEDIAN(A2:A41)           // mediana
D5: =MODE.SNGL(A2:A41)        // moda
D6: =MIN(A2:A41)
D7: =MAX(A2:A41)
D8: =D7-D6                    // rozstęp R
D9: =VAR.S(A2:A41)            // wariancja próbkowa s² (dzielnik n-1)
D10: =STDEV.S(A2:A41)         // odchylenie standardowe s
D11: =QUARTILE.EXC(A2:A41,1)  // Q1
D12: =QUARTILE.EXC(A2:A41,3)  // Q3
D13: =D12-D11                 // IQR
~~~

~~~excel Szereg rozdzielczy — górne granice klas w F2:F8
G2: =COUNTIFS($A$2:$A$41,">"&(F2-5),$A$2:$A$41,"<="&F2)   // liczebność klasy (F2-5; F2]
H2: =G2/$D$2                                                // częstość w_i
I2: =SUM($G$2:G2)                                           // liczebność skumulowana N_i
~~~

::: tip own | Szybciej: wbudowane narzędzia
- Histogram: *Wstawianie → Wykresy → Histogram* (Excel 2016+), albo funkcja ‹FREQUENCY› (‹CZĘSTOŚĆ›) — wpisz ją jako formułę tablicową dla całego zakresu wyników.
- Wszystkie statystyki naraz: *Dane → Analiza danych → Statystyka opisowa* (trzeba włączyć dodatek *Analysis ToolPak*).
- Wykres ramkowy: *Wstawianie → Wykresy statystyczne → Pudełkowy* (Excel 2016+).
:::

~~~python Te same obliczenia w Pythonie
import statistics as st

dane = [51, 58, 64, 69, 61, 56, 41, 48, 56, 61, 75, 55, 46, 57, 70, 55, 47, 62, 55, 60,
        54, 57, 65, 60, 53, 54, 49, 58, 62, 59, 53, 50, 58, 63, 64, 59, 52, 51, 65, 60]

print("n =", len(dane))
print("średnia =", st.mean(dane))          # 57.325
print("mediana =", st.median(dane))        # 57.5
print("s^2 =", st.variance(dane))          # dzielnik n-1
print("s =", st.stdev(dane))
q1, q2, q3 = st.quantiles(dane, n=4)       # metoda 'exclusive' = QUARTILE.EXC
print("Q1, Me, Q3 =", q1, q2, q3)
~~~

::: summary
- Najpierw **typ cechy** (ilościowa ciągła/dyskretna, jakościowa uporządkowana/nominalna) → od niego zależą dozwolone metody.
- Jakościowe: tabela liczebności/częstości, **słupki**, koło, **moda**.
- Ciągłe: szereg przedziałowy ($k\approx\sqrt n$, $h=\lceil R/k\rceil$, przedziały (a; b]) i **histogram**.
- Położenie: **średnia** (wrażliwa na odstające), **mediana** (odporna), moda.
- Rozproszenie: rozstęp, **wariancja** $s^2$ (dzielnik $n-1$), **odchylenie standardowe** $s$, **IQR**.
- **Wykres ramkowy**: min, Q1, Me, Q3, max; odstające poza $Q_1-1{,}5IQR$, $Q_3+1{,}5IQR$.
:::
`,

    cheatsheet: md`
## Typ cechy → co wolno

| Cecha | Przykład | Tabela / wykres | Miary |
|---|---|---|---|
| nominalna | grupa krwi | liczebności, słupki, koło | moda |
| uporządkowana | małe/średnie/duże | słupki (w kolejności) | moda, mediana |
| dyskretna | liczba awarii | szereg punktowy, słupki | wszystkie |
| ciągła | czas, waga | szereg przedziałowy, **histogram** | wszystkie |

## Szereg przedziałowy (histogram)

1. $R = x_{\max} - x_{\min}$
2. $k \approx \sqrt n$ (podłoga lub sufit)
3. $h = \lceil R/k \rceil$ (zawsze w górę!), nadwyżkę $kh-R$ rozdziel po bokach
4. przedziały **(a; b]**, bez pustych klas w środku
5. $w_i = n_i/n$, $N_i$, $W_i$ — skumulowane

## Wzory

$$\bar x = \tfrac1n\textstyle\sum x_i \qquad \bar x \approx \tfrac1n\sum n_i\tilde x_i$$
$$s^2 = \tfrac{1}{n-1}\textstyle\sum (x_i-\bar x)^2 \qquad s=\sqrt{s^2}$$

- **Mediana**: $n$ nieparz. → $x_{((n+1)/2)}$; $n$ parz. → średnia dwóch środkowych
- **Q1 / Q3** = mediana dolnej / górnej połowy (bez mediany przy $n$ nieparzystym)
- $IQR = Q_3 - Q_1$; odstające: $< Q_1 - 1{,}5\,IQR$ lub $> Q_3 + 1{,}5\,IQR$
- $\bar x \pm s$: ~68%, $\pm 2s$: ~95%, $\pm 3s$: ~99,7%
- średnia > mediana → skośność prawostronna

## Excel

‹AVERAGE› ‹MEDIAN› ‹MODE.SNGL› ‹VAR.S› ‹STDEV.S› ‹MIN› ‹MAX› ‹QUARTILE.EXC› ‹COUNTIF› ‹FREQUENCY›
(PL: ‹ŚREDNIA› ‹MEDIANA› ‹WYST.NAJCZĘŚCIEJ.WART› ‹WARIANCJA.PRÓBKI› ‹ODCH.STANDARD.PRÓBKI› ‹KWARTYL.PRZEDZ.OTW› ‹LICZ.JEŻELI› ‹CZĘSTOŚĆ›)

::: warn
Kąt na wykresie kołowym = $w_i\cdot360^\circ$. Wariancja ma jednostkę², odchylenie — jednostkę danych.
:::
`,

    exercises: [
      {
        id: 'e1', tag: 'C01–02', title: 'Rozgrzewka w Excelu: suma szeregu, wykres funkcji, kodowanie kategorii',
        text: md`
a) Oblicz w Excelu sumy częściowe $S(p) = \sum_{n=1}^{200} \dfrac{1}{n^p}$ dla $p = 1{,}5$ oraz $p = 3$ (wartość $p$ trzymaj w osobnej komórce).

b) Narysuj wykres funkcji
$$g(x) = \begin{cases} x^4 - 2x, & x\in[-1{,}5;\,1]\\ 2x - 3, & x\in(1;\,3]\end{cases}$$
z krokiem 0,05. Czy wykres jest ciągły w $x=1$?

c) W ankiecie 24 osoby podały rozmiar koszulki: S, M, M, L, XL, M, S, L, M, M, XL, L, S, M, L, M, XL, S, M, L, M, S, L, M. Zakoduj rozmiary liczbami S = 1, M = 2, L = 3, XL = 4 i wyznacz liczność każdej kategorii.
`,
        hint: md`
a) Kolumna A: $n = 1…200$, kolumna B: ‹=1/A2^$E$1›, gdzie E1 = $p$ (dolar = adres bezwzględny). b) Zagnieżdżony ‹IF› z ‹AND›. c) ‹IF›…‹IF› do kodowania, a do zliczania ‹COUNTIF›.
`,
        solution: md`
**a)** Układ arkusza:

~~~excel
E1: 1.5                  // p — zmień na 3 dla drugiego przypadku
A2: 1                    // potem przeciągnij do A201 (seria 1…200)
B2: =1/A2^$E$1           // przeciągnij do B201
E2: =SUM(B2:B201)        // S(p)
~~~

Wyniki: $S(1{,}5) \approx 2{,}4711$, $S(3) \approx 1{,}2020$. (Dla $p=3$ suma jest już bardzo blisko granicy $\zeta(3)\approx1{,}20206$; dla $p=1{,}5$ szereg zbiega znacznie wolniej.)

**b)** W A2 wpisz −1,5, w A3 ‹=A2+0.05› i przeciągnij do $x=3$. W kolumnie B:

~~~excel
B2: =IF(AND(A2>=-1.5,A2<=1),A2^4-2*A2,IF(AND(A2>1,A2<=3),2*A2-3,""))
~~~

Wykres: *Wstawianie → Punktowy z liniami*. W $x=1$: $1^4-2\cdot1=-1$ oraz $2\cdot1-3=-1$ — obie części dają −1, więc **wykres jest ciągły**. Minimum pierwszej części: $g'(x)=4x^3-2=0 \Rightarrow x=\sqrt[3]{0{,}5}\approx0{,}794$, $g\approx-1{,}19$.

**c)** Dane w B2:B25:

~~~excel
C2: =IF(B2="S",1,IF(B2="M",2,IF(B2="L",3,IF(B2="XL",4,"?"))))
F2: =COUNTIF($C$2:$C$25,E2)       // E2:E5 zawierają kody 1,2,3,4
~~~

| rozmiar | S | M | L | XL | razem |
|---|---:|---:|---:|---:|---:|
| kod | 1 | 2 | 3 | 4 | |
| liczność | 5 | 10 | 6 | 3 | 24 |
`,
        answer: md`$S(1{,}5)\approx 2{,}4711$; $S(3)\approx1{,}2020$; wykres ciągły w $x=1$; liczności S/M/L/XL = 5/10/6/3.`
      },
      {
        id: 'e2', tag: 'C01–02', title: 'Ulubiony język programowania',
        text: md`
24 studentów zapytano o ulubiony język programowania. Odpowiedzi:
Python, Java, Python, JavaScript, C++, Python, Java, JavaScript, Python, Go, JavaScript, Python, Java, C++, Python, JavaScript, Python, Java, JavaScript, Python, C++, Java, JavaScript, Python.

a) Sporządź tabelę liczebności i częstości oraz wykres słupkowy.
b) Narysuj wykres kołowy (podaj kąty wycinków) i zinterpretuj go. Jaka jest moda?
`,
        hint: md`To cecha **nominalna** — kolejność kategorii jest dowolna. Kąt wycinka $= w_i\cdot 360^\circ$.`,
        solution: md`
| język | $n_i$ | $w_i$ | % | kąt |
|---|---:|---:|---:|---:|
| Python | 9 | 0,375 | 37,5% | 135° |
| JavaScript | 6 | 0,250 | 25,0% | 90° |
| Java | 5 | 0,208 | 20,8% | 75° |
| C++ | 3 | 0,125 | 12,5% | 45° |
| Go | 1 | 0,042 | 4,2% | 15° |
| **razem** | **24** | **1** | **100%** | **360°** |

@chart exLangBar

@chart exLangPie

**Interpretacja:** moda = **Python** (ponad 1/3 odpowiedzi). Python i JavaScript razem to 62,5%, czyli prawie dwie trzecie grupy. Go wskazała tylko 1 osoba. Przy 5 kategoriach wykres kołowy jest jeszcze czytelny, ale słupki łatwiej porównać (np. JavaScript vs Java).
`,
        answer: md`Moda: Python (37,5%, kąt 135°); JavaScript 25% (90°), Java 20,8% (75°), C++ 12,5% (45°), Go 4,2% (15°).`
      },
      {
        id: 'e3', tag: 'C01–02', title: 'Kolejka w stołówce',
        text: md`
Zmierzono czas czekania w kolejce (w minutach) 11 studentów: 4, 7, 5, 9, 6, 7, 8, 5, 7, 6, 31.
Oblicz średnią, medianę i modę. Wyznacz kwartyle, narysuj wykres ramkowy i zinterpretuj go. Która miara lepiej opisuje „typowy” czas czekania?
`,
        hint: md`Posortuj dane. Przy $n=11$ mediana to 6. element; Q1 i Q3 to mediany 5 elementów przed i po medianie. Sprawdź płotki $Q_1-1{,}5IQR$, $Q_3+1{,}5IQR$.`,
        solution: md`
Posortowane: 4, 5, 5, 6, 6, **7**, 7, 7, 8, 9, 31.

- $\bar x = \dfrac{95}{11} \approx 8{,}64$ min
- Me $= x_{(6)} = 7$ min
- moda = 7 (występuje 3 razy)
- Q1 = mediana (4, 5, 5, 6, 6) = 5; Q3 = mediana (7, 7, 8, 9, 31) = 8; IQR = 3
- płotki: $5 - 1{,}5\cdot3 = 0{,}5$ oraz $8 + 1{,}5\cdot 3 = 12{,}5$ → **31 to obserwacja odstająca**; wąsy sięgają do 4 i 9.

@chart exQueueBox

**Interpretacja:** połowa studentów czekała od 5 do 8 minut. Jedna osoba czekała 31 minut (może awaria kasy?) i to ona „ciągnie” średnią w górę: 8,64 > 7. Typowy czas lepiej opisuje **mediana (7 min)**.

W Excelu: ‹QUARTILE.EXC› daje 5 i 8 (tak jak ręcznie), a ‹QUARTILE.INC› — 5,5 i 7,5.
`,
        answer: md`$\bar x\approx8{,}64$, Me = 7, moda = 7, Q1 = 5, Q3 = 8, IQR = 3, wartość 31 jest odstająca; lepsza miara: mediana.`
      },
      {
        id: 'e4', tag: 'C01–02', title: 'Ceny kawy',
        text: md`
Cena małej kawy w sześciu kawiarniach (zł): 12,50; 13,00; 11,80; 12,20; 13,40; 12,70. Oblicz średnią cenę oraz wariancję i odchylenie standardowe ceny.
`,
        hint: md`Zrób tabelkę: $x_i$, $x_i-\bar x$, $(x_i-\bar x)^2$. Dzielnik w wariancji próbkowej to $n-1=5$.`,
        solution: md`
$\bar x = \dfrac{75{,}6}{6} = 12{,}60$ zł.

| $x_i$ | 12,50 | 13,00 | 11,80 | 12,20 | 13,40 | 12,70 | suma |
|---|---:|---:|---:|---:|---:|---:|---:|
| $x_i-\bar x$ | −0,10 | 0,40 | −0,80 | −0,40 | 0,80 | 0,10 | 0 |
| $(x_i-\bar x)^2$ | 0,01 | 0,16 | 0,64 | 0,16 | 0,64 | 0,01 | 1,62 |

$$s^2 = \frac{1{,}62}{6-1} = 0{,}324 \text{ zł}^2, \qquad s = \sqrt{0{,}324}\approx 0{,}57 \text{ zł}$$

Kontrola: suma odchyleń od średniej zawsze wynosi 0. W Excelu: ‹=VAR.S(A2:A7)› i ‹=STDEV.S(A2:A7)›.
`,
        answer: md`$\bar x = 12{,}60$ zł, $s^2 = 0{,}324$ zł², $s \approx 0{,}57$ zł.`
      },
      {
        id: 'e5', tag: 'C01–02', title: 'Czas dojazdu na uczelnię — histogram',
        text: md`
Czasy dojazdu na uczelnię (min) 30 studentów:
18, 25, 32, 41, 22, 27, 35, 30, 19, 24, 38, 29, 33, 26, 21, 44, 28, 31, 36, 23, 27, 30, 34, 25, 29, 40, 20, 32, 26, 37.

Zbuduj szereg rozdzielczy metodą z wykładu, narysuj histogram liczebności i częstości oraz opisz kształt histogramu.
`,
        hint: md`$n=30$, $\sqrt{30}\approx5{,}48$ → $k=5$ lub $6$. Przy $k=6$: $h=\lceil26/6\rceil=5$. Przedziały (a; b].`,
        solution: md`
1. $x_{\min}=18$, $x_{\max}=44$, $R=26$.
2. $k=6$ (sufit z 5,48), $h=\lceil 26/6\rceil = \lceil4{,}33\rceil=5$; $6\cdot5=30$, nadwyżka 4 → po 2 z każdej strony: start od 16.

| klasa | (16; 21] | (21; 26] | (26; 31] | (31; 36] | (36; 41] | (41; 46] | razem |
|---|---:|---:|---:|---:|---:|---:|---:|
| $n_i$ | 4 | 7 | 8 | 6 | 4 | 1 | 30 |
| $w_i$ | 0,133 | 0,233 | 0,267 | 0,200 | 0,133 | 0,033 | 1 |
| $N_i$ | 4 | 11 | 19 | 25 | 29 | 30 | |

@chart exCommuteHist

**Kształt:** histogram **jednomodalny** (najliczniejsza klasa 26–31 min), w miarę **symetryczny**, z lekko dłuższym prawym „ogonem” (jedna osoba dojeżdża 44 min). Dla kontroli: $\bar x = 29{,}4$ min, Me = 29 min — prawie równe, co potwierdza symetrię.

Histogram częstości wygląda identycznie — zmienia się tylko skala osi Y (dzielimy przez 30).
`,
        answer: md`Klasy (16;21], …, (41;46] z liczebnościami 4, 7, 8, 6, 4, 1; rozkład jednomodalny, prawie symetryczny.`
      },
      {
        id: 'e6', tag: 'C01–02', title: 'Transfer danych w telefonie — dane pogrupowane',
        text: md`
Miesięczny transfer danych (GB) 60 użytkowników sieci zgrupowano w tabeli:

| transfer [GB] | 0–3 | 3–6 | 6–9 | 9–12 | 12–15 | 15–18 | 18–21 |
|---|---:|---:|---:|---:|---:|---:|---:|
| liczba osób | 5 | 14 | 18 | 11 | 7 | 3 | 2 |

a) Narysuj histogram częstości i opisz jego kształt.
b) Jaki procent użytkowników zużywa mniej niż 12 GB?
c) W którym przedziale leży mediana?
`,
        hint: md`c) Mediana to średnia z 30. i 31. obserwacji — szukaj klasy, w której liczebność skumulowana $N_i$ przekracza 30.`,
        solution: md`
**a)** Częstości $w_i = n_i/60$: 0,083; 0,233; 0,300; 0,183; 0,117; 0,050; 0,033.

@chart exUsageHist

Kształt: jednomodalny (szczyt 6–9 GB), **prawostronnie skośny** — długi ogon w stronę dużych wartości.

**b)** $\dfrac{5+14+18+11}{60} = \dfrac{48}{60} = 0{,}8$ → **80%** użytkowników.

**c)** Liczebności skumulowane: 5, 19, **37**, … Obserwacje nr 30 i 31 leżą w klasie, w której $N_i$ przekracza 30 po raz pierwszy → mediana jest w przedziale **6–9 GB**.

::: own | Bonus: przybliżona mediana i średnia
Interpolacja liniowa w klasie mediany: $\text{Me} \approx 6 + \dfrac{30-19}{18}\cdot 3 \approx 7{,}83$ GB. Średnia ze środków klas: $\bar x = \dfrac{5\cdot1{,}5 + 14\cdot4{,}5 + 18\cdot7{,}5 + 11\cdot10{,}5 + 7\cdot13{,}5 + 3\cdot16{,}5 + 2\cdot19{,}5}{60} = \dfrac{504}{60} = 8{,}4$ GB > Me — zgodnie z prawostronną skośnością.
:::
`,
        answer: md`Rozkład prawostronnie skośny; 80% użytkowników < 12 GB; mediana w przedziale 6–9 GB.`
      },
      {
        id: 'e7', tag: 'C01–02', title: 'Kwartyle bez liczb',
        text: md`
Dla próbki o liczności 12 wiadomo, że
$$x_4 = x_7 < x_2 = x_9 = x_{11} < x_1 < x_5 = x_{12} < x_3 = x_6 = x_8 < x_{10}.$$
Wyznacz medianę Q2 oraz kwartyle Q1 i Q3 (wyraź je przez $x_i$).
`,
        hint: md`Ustaw wartości w kolejności i ponumeruj pozycje 1…12. Przy $n=12$ mediana to średnia z pozycji 6 i 7; Q1 — średnia z pozycji 3 i 4; Q3 — średnia z pozycji 9 i 10.`,
        solution: md`
Kolejność (statystyki pozycyjne):

| pozycja | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| wartość | $x_4$ | $x_7$ | $x_2$ | $x_9$ | $x_{11}$ | $x_1$ | $x_5$ | $x_{12}$ | $x_3$ | $x_6$ | $x_8$ | $x_{10}$ |

- $Q_2 = \tfrac12\left(x_{(6)}+x_{(7)}\right) = \tfrac12(x_1 + x_5)$
- dolna połowa = pozycje 1–6, jej mediana $= \tfrac12(x_{(3)}+x_{(4)}) = \tfrac12(x_2+x_9) = x_2$ (bo $x_2=x_9$)
- górna połowa = pozycje 7–12, jej mediana $= \tfrac12(x_{(9)}+x_{(10)}) = \tfrac12(x_3+x_6) = x_3$
`,
        answer: md`$Q_2 = \frac{x_1+x_5}{2}$, $Q_1 = x_2$, $Q_3 = x_3$.`
      },
      {
        id: 'e8', tag: 'C01–02', title: 'Dwie firmy kurierskie — porównanie wykresami ramkowymi',
        text: md`
Zanotowano czasy dostawy (w godzinach) 13 losowo wybranych przesyłek w dwóch firmach kurierskich:

| firma | czasy dostawy [h] |
|---|---|
| A | 22, 26, 24, 30, 28, 25, 27, 29, 23, 31, 26, 28, 39 |
| B | 18, 34, 20, 40, 27, 22, 45, 30, 25, 38, 21, 29, 33 |

a) Oblicz i porównaj średnie oraz mediany.
b) Wyznacz Q1, Q3 i IQR dla obu firm.
c) Porównaj firmy na wykresach ramkowych. Którą wybrałbyś, jeśli zależy Ci na **przewidywalności** dostawy?
`,
        hint: md`$n=13$: mediana = 7. element, Q1 = mediana elementów 1–6, Q3 = mediana elementów 8–13. Sprawdź obserwacje odstające.`,
        solution: md`
**Firma A**, posortowane: 22, 23, 24, 25, 26, 26, **27**, 28, 28, 29, 30, 31, 39.
$\bar x_A = 358/13 \approx 27{,}54$ h, Me = 27, Q1 = (24 + 25)/2 = 24,5, Q3 = (29 + 30)/2 = 29,5, IQR = 5.
Płotki: 24,5 − 7,5 = 17 i 29,5 + 7,5 = 37 → **39 to wartość odstająca**, prawy wąs kończy się na 31.

**Firma B**, posortowane: 18, 20, 21, 22, 25, 27, **29**, 30, 33, 34, 38, 40, 45.
$\bar x_B = 382/13 \approx 29{,}38$ h, Me = 29, Q1 = (21 + 22)/2 = 21,5, Q3 = (34 + 38)/2 = 36, IQR = 14,5.
Płotki: −0,25 i 57,75 → brak odstających.

@chart exCourierBox

**Wnioski:** typowe czasy są podobne (mediany 27 h i 29 h), ale firma **B ma prawie 3 razy większy rozrzut** (IQR 14,5 h vs 5 h). Firma A dostarcza bardzo powtarzalnie — z jednym wyjątkiem (39 h). Jeśli liczy się przewidywalność → **firma A**.
`,
        answer: md`A: $\bar x\approx27{,}54$, Me = 27, Q1 = 24,5, Q3 = 29,5, IQR = 5 (39 odstające); B: $\bar x\approx29{,}38$, Me = 29, Q1 = 21,5, Q3 = 36, IQR = 14,5. Bardziej przewidywalna: A.`
      }
    ]
  };

  /* ======================================================================= */
  var en = {
    lead: 'Before we compute anything, we have to **look at** the data and **describe** it: with a few numbers (mean, median, spread) and a few charts (bars, histogram, box).',
    lecture: md`
# What is descriptive statistics for?

Statistics studies **collections** of objects (people, products, phenomena). Conclusions are about the whole collection, not about a single object. The first step is always the same: **collect the data, organise it and show it** so that you can notice something within seconds. {lecture:W01}

Goals of descriptive statistics (per the lecture):
- **characterise the data in a concise form** — e.g. average income, average fuel consumption;
- **find regularities** (or irregularities) hidden in the data and relationships between its parts.

::: intuition
You are looking at 30 numbers and see nothing. Descriptive statistics is like a book summary: instead of 300 pages you get one paragraph (“the typical value is about 57, most values are between 50 and 65, there is one strange value of 75”) and one picture.
:::

Before calculating, **look at the raw data** and answer the questions from the lecture:
- which feature was measured and **in which units**? (different units must be converted to a common scale),
- **how many** observations are there, is some data **missing**, could there be errors,
- **why** were the data collected — which question should they answer?

# Population, sample, feature

::: def | Population and sample
**Population** — the set of objects studied with respect to a given feature (the feature is called a **variable**).
**Sample** — the set of values of the feature for the examined objects, i.e. only a randomly drawn part of the population. {lecture:W01}
:::

A study can be:
- **complete** (full, exhaustive) — we examine every object; it makes sense when the population is small and the study cheap and non-destructive;
- **partial** — we examine only a **sample**. This is almost always the case: examining everything is too expensive (a census is done once every 10 years), destructive (you won’t blow every fuse to check its strength) or impossible (a **hypothetical** population, e.g. future customers of a product that doesn’t exist yet).

The sample must be **random** and **representative** — it must reflect the variability of the whole population. Lecture example: an interviewer in a Warsaw shopping mall on Monday at 10 a.m. will get answers, but not from people who are at work at that time — the sample is not representative. That is why polling companies use **stratified sampling**: they split the population into homogeneous strata (e.g. regions) and sample from each proportionally to its size. In production things are simpler — a **simple random sample** is usually enough. {lecture:W01}

| Population | Studied feature (variable) | Collected data (sample) |
|---|---|---|
| a set of parts | quality of a part (meets / does not meet requirements) | qualities of the examined parts |
| computers in a network | number of failures in a period | failure counts of selected computers |
| projects sent to a contest | project score (points) | scores of selected projects |
| a company’s employees | length of service | lengths of service of sampled people |

# Types of features

- **Quantitative** (numbers):
  - **continuous** — can take any value in an interval: height, weight, time (time is continuous by nature, even if we report it in whole hours);
  - **discrete** — usually integers from counting: number of children, number of complaints, number of failures.
- **Qualitative** (categories):
  - **ordinal** — categories have a natural order: small/medium/large towns, childless/large families;
  - **nominal** — categories cannot be ordered: blood group, sex, eye colour.

The lecture also mentioned **ratio data** (positive, non-zero): they can be divided and logged — the “richest” type of data. {lecture:W01}

::: warn
The method must fit the feature type. An “average blood group” makes no sense — for nominal features you can only compute counts, frequencies and the **mode** (the most frequent category).
:::

# Organising data: series

**Detailed (listing) series** — simply the values sorted in increasing order. Sorting alone already helps: you see the minimum, the maximum and repeated values.

**Frequency distribution (structural series)** — data split into **classes** with the number of elements in each class:
- **point** series — when there are few distinct values (each value = its own class),
- **interval** series — when there are many distinct values (classes are intervals).

::: example W01 | Point series
Numbers of employees in 30 companies of a group: 100; 125; 170; 144; 144; 235; 301; … After sorting it turns out there are only 6 distinct values:

| Employees | 100 | 125 | 144 | 170 | 235 | 301 | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| count | 5 | 5 | 9 | 4 | 3 | 4 | 30 |

Instead of 30 numbers we remember 12 — and we can recover all values (but not their original order).
:::

For each class we compute:

| Symbol | Name | Formula | Meaning |
|---|---|---|---|
| $n_i$ | count (frequency) | — | how many observations are in class $i$ |
| $w_i$ | relative frequency | $w_i = n_i / n$ | which part of the whole it is (sum = 1 = 100%) |
| $N_i$ | cumulative count | $N_i = n_1 + \dots + n_i$ | how many observations are “up to the end of class $i$” |
| $W_i$ | cumulative frequency | $W_i = w_1 + \dots + w_i$ | which part is “up to the end of class $i$” (grows to 1) |

::: example W01 | Interval series: areas of 69 shops [m²]
| interval | 70–90 | 90–110 | 110–130 | 130–150 | 150–170 | 170–190 | 190–210 |
|---|---:|---:|---:|---:|---:|---:|---:|
| $n_i$ | 5 | 7 | 17 | 21 | 10 | 6 | 3 |
| $w_i$ | 0.07 | 0.10 | 0.25 | 0.30 | 0.14 | 0.09 | 0.04 |
| $N_i$ | 5 | 12 | 29 | 50 | 60 | 66 | 69 |
| $W_i$ | 0.07 | 0.17 | 0.42 | 0.72 | 0.87 | 0.96 | 1.00 |

We read e.g.: 42% of the shops have an area below 130 m².
:::

@chart shopsHist

::: note
When grouping data into intervals we **irreversibly lose part of the information**: we know how many observations are in an interval, but not how they are spread inside it. That is why in computations every value in an interval is identified with the **class midpoint** $\tilde x_i$. The frequency series corresponds to the **density**, and the cumulative series to the **CDF** (topics 3–4). {lecture:W01}
:::

# Charts for qualitative and discrete features

**Bar chart**: each category/value gets a bar whose height equals the count (or frequency). The bars **do not touch** — there is no “continuity” between categories.

@chart diceBar

**Pie chart**: the circle is split into slices proportional to the frequencies.

$$\text{slice angle} = \frac{n_i}{n}\cdot 360^\circ = w_i \cdot 360^\circ$$

@chart dicePie

Limitations of the pie chart (per the lecture):
- it shows only **percentage shares** (all slices = 100%),
- **hard to read** with many categories,
- **comparing two pie charts** is much harder than one combined bar chart.

::: tip W01 | Comparing two groups
Want to compare the structure of students in two years when their number changed a lot (544k vs 1,265k)? Draw **frequency (%) bars side by side**, not counts — frequencies bring both groups to the same scale.
:::

**Mode** — the value/category that occurs **most often**. On a bar chart it is the highest bar. For the dice above: mode = 6.

# Histogram — the chart for a continuous feature

When there are many values and almost all differ, we group them into **classes (intervals) of equal width** and draw a **histogram**: the bars **touch**, because the feature is continuous. Bar height = count (count histogram) or relative frequency (frequency histogram).

::: steps | How to build a frequency table and a histogram (the lecture’s method)
1. Find $x_{\min}$, $x_{\max}$ and the **range** $R = x_{\max} - x_{\min}$.
2. **Number of classes**: $k \approx \sqrt{n}$ — take the integer nearest to $\sqrt n$ (floor or ceiling, your choice).
3. **Class width**: $h = \lceil R / k \rceil$ — always **round up**, so that $k\cdot h \ge R$ (the classes must cover all values).
4. Split the surplus $k\cdot h - R$ to the left/right of the data (e.g. half and half).
5. Intervals **(a; b]** — open on the left, **closed on the right**; the first one may be closed on both sides. A value on a boundary goes to the class **on the left**.
6. Count $n_i$ (and possibly $w_i, N_i, W_i$). **No empty classes in the middle** — if there are, change the split.
:::

::: note W01
In the shop example the lecture deliberately used [a; b) intervals — **in class we use (a; b]**, because most programs count this way (and this is how the CDF $F(x)=P(X\le x)$ is defined).
:::

Classes too narrow → a “ragged” histogram; too wide → over-smoothed, nothing visible. The rule $k\approx\sqrt n$ is simple and usually enough (software uses its own rules, e.g. $h = 2.64\cdot IQR\cdot n^{-1/3}$ from the lecture).

::: example W01 | Fuses: 40 blow times [min]
Standard: a 20 A fuse must withstand 28 A for 1 hour. Blow times of 40 fuses were recorded:
51 58 64 69 61 56 41 48 56 61 75 55 46 57 70 55 47 62 55 60 54 57 65 60 53 54 49 58 62 59 53 50 58 63 64 59 52 51 65 60.

- $x_{\min}=41$, $x_{\max}=75$, $R=34$, $n=40$, $\sqrt{40}\approx 6.3$ → $k=7$,
- $h=\lceil 34/7\rceil = 5$, $7\cdot5=35$ → surplus of 1 unit: half on each side, boundaries at “halves” (so no observation lies on a boundary).

| no. | class | midpoint $\tilde x_i$ | $n_i$ | $w_i$ | $N_i$ | $W_i$ |
|---:|---|---:|---:|---:|---:|---:|
| 1 | 40.5–45.5 | 43 | 1 | 0.025 | 1 | 0.025 |
| 2 | 45.5–50.5 | 48 | 5 | 0.125 | 6 | 0.150 |
| 3 | 50.5–55.5 | 53 | 10 | 0.250 | 16 | 0.400 |
| 4 | 55.5–60.5 | 58 | 12 | 0.300 | 28 | 0.700 |
| 5 | 60.5–65.5 | 63 | 9 | 0.225 | 37 | 0.925 |
| 6 | 65.5–70.5 | 68 | 2 | 0.050 | 39 | 0.975 |
| 7 | 70.5–75.5 | 73 | 1 | 0.025 | 40 | 1.000 |
:::

@chart fuseHist

The histogram is **unimodal** (one peak) and **roughly symmetric** — it resembles the **Gaussian bell curve** (the normal distribution, topic 5). Measurements with random errors usually look like this. The **frequency polygon** (orange) joins the midpoints of the bar tops; we add empty classes at both ends so it reaches the axis.

::: example W01 | Age of 25 people in a pension scheme
30, 49, 33, 35, 37, 20, 31, 30, 36, 46, 39, 40, 38, 41, 35, 37, 24, 27, 36, 43, 45, 25, 32, 29, 28 — as many as 21 distinct values, so we group. $n=25$ → $k=5$; $R=49-20=29$ → $h=\lceil29/5\rceil=6$; $5\cdot6=30$, surplus 1 — added on the left, because with $(20;26]$ the value 20 would “fall out”. Classes: (19;25], (25;31], (31;37], (37;43], (43;49] with counts 3, 6, 8, 5, 3.
:::

@chart ageHist

::: note
A **normalised histogram** has bar heights $w_i/h$, so the total area = 1 and the area above an interval = its frequency. Rarely used in practice today, but it is exactly what turns into the **density** as $n\to\infty$ (topic 4). {lecture:W01}
:::

# Measures of location — where is the “centre” of the data?

::: formula | Arithmetic mean
$$\bar x = \frac{1}{n}\sum_{i=1}^{n} x_i = \frac{x_1+x_2+\dots+x_n}{n}$$
For grouped data (class midpoints $\tilde x_i$, counts $n_i$, $k$ classes):
$$\bar x \approx \frac{1}{n}\sum_{i=1}^{k} n_i\,\tilde x_i$$
:::

::: example W01 | Mean of grouped data
Incomes of 10 people [thousand PLN]: classes [1; 1.5], (1.5; 2], (2; 2.5], (2.5; 3] with counts 2, 2, 4, 2. Midpoints: 1.25; 1.75; 2.25; 2.75.
$$\bar x = \frac{2\cdot1.25 + 2\cdot1.75 + 4\cdot 2.25 + 2\cdot 2.75}{10} = 2.05$$
The result differs slightly from the mean of the raw data — grouping lost information.
:::

::: formula | Median (middle value)
First sort: $x_{(1)} \le x_{(2)} \le \dots \le x_{(n)}$ (these are the **order statistics**; $x_{(1)}=\min$, $x_{(n)}=\max$).
$$\text{Me} = \begin{cases} x_{((n+1)/2)} & n \text{ odd}\\[4pt] \tfrac12\left(x_{(n/2)} + x_{(n/2+1)}\right) & n \text{ even}\end{cases}$$
:::

::: intuition
The **mean** is the point where a plank with weights at positions $x_i$ would balance — one very heavy value far from the rest shifts it a lot. The **median** is the person standing exactly in the middle of a queue ordered from shortest to tallest — it doesn’t care how tall the last person is.
:::

::: example W01 | Why the median is sometimes better than the mean
Incomes of 11 people: 4 × 2000 PLN, 4 × 2500 PLN, 2 × 3500 PLN, 1 × 19,000 PLN (the manager).
$$\bar x = \frac{4\cdot2000 + 4\cdot2500 + 2\cdot3500 + 19000}{11} = 4000, \qquad \text{Me} = x_{(6)} = 2500$$
Nobody earns the mean of 4000: 10 of 11 people earn less. The mean is **sensitive to outliers**, the median is **robust**. That is why for wages (a skewed distribution) the statistical office also reports the median.
:::

**Trimmed mean** (with parameter $k$): drop the $k$ smallest and $k$ largest observations and average the rest:
$$\bar x_{t,k} = \frac{1}{n-2k}\sum_{i=k+1}^{n-k} x_{(i)}$$
**Winsorised mean**: instead of dropping, replace the $k$ extreme observations on each side by $x_{(k+1)}$ and $x_{(n-k)}$ (the sample size stays the same). {lecture:W01}

::: warn W01
Outliers can be **very important** — e.g. they signal that a production process went out of control. Use the trimmed mean when outliers are the result of an **error** (typo, broken instrument), not to make the result “look nicer”.
:::

**Mode** — the most frequent value. For a continuous feature: the peak (local maximum) of the histogram; a histogram with one peak is **unimodal**, with several — **multimodal** (often a sign that different populations are mixed in the data).

# Measures of spread — how much do the data differ?

Two classes can both have a mean grade of 3.5 — in one everybody has 3.5, in the other half have 2 and half have 5. The mean won’t show it; we need a measure of **spread**.

::: formula | Range, variance, standard deviation
$$R = x_{(n)} - x_{(1)}$$
$$s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar x)^2 \qquad s = \sqrt{s^2}$$
For grouped data: $s^2 \approx \dfrac{1}{n-1}\sum_{i=1}^{k} n_i(\tilde x_i - \bar x)^2$.
:::

- **Range** — the simplest, but depends only on the two extreme values.
- **Variance** $s^2$ — the mean squared distance from the mean (physically: like a moment of inertia). Its unit is the data unit **squared** (e.g. PLN²).
- **Standard deviation** $s$ — square root of the variance, in the **same units** as the data. Read it as “the typical distance of an observation from the mean”.
- **Mean absolute deviation** $d_1 = \frac1n\sum|x_i-\bar x|$ — rarely used.

::: note W01 | Why divide by n − 1 and not by n?
The divisor $n-1$ makes $s^2$ an **unbiased estimator** of the population variance — on average it “hits” the true value. We explain this in topic 9 (estimation).
:::

::: example W01 | Variance of grouped data
For the incomes of 10 people ($\bar x = 2.05$): deviations of midpoints from the mean: −0.8; −0.3; 0.2; 0.7.
$$s^2 = \frac{2\cdot0.64 + 2\cdot0.09 + 4\cdot0.04 + 2\cdot0.49}{9} = \frac{2.6}{9} \approx 0.2889,\qquad s\approx 0.537$$
:::

## Quartiles and the interquartile range

The median splits the ordered sample **in half**, the quartiles — **into quarters**:
- **Q1 (lower quartile)** = median of the sub-sample of elements “smaller” than the median (standing before it in the queue),
- **Q2** = the median,
- **Q3 (upper quartile)** = median of the sub-sample of elements “larger” than the median (standing after it),
- **interquartile range** $IQR = Q_3 - Q_1$ — the width of the “middle 50%” of the data. {lecture:W01}

::: example own | Quartiles step by step
Sorted data ($n=11$): 4, 5, 5, 6, 6, **7**, 7, 7, 8, 9, 31. Median = 6th element = 7.
Lower half (before the median): 4, 5, **5**, 6, 6 → Q1 = 5. Upper half: 7, 7, **8**, 9, 31 → Q3 = 8. IQR = 3.
When $n$ is even, split the sample into two equal halves (the median belongs to neither).
:::

::: warn own | Excel computes quartiles in two ways
‹QUARTILE.EXC› (PL: ‹KWARTYL.PRZEDZ.OTW›) and ‹QUARTILE.INC› (‹KWARTYL.PRZEDZ.ZAMK›) can give **different results**, and both can differ from the lecture’s “median of halves” method. Above: EXC → 5 and 8 (as in the lecture), INC → 5.5 and 7.5. In a test compute **by hand with the lecture’s method**, and in Excel state which function you used.
:::

## Standard deviation and the normal distribution

If the histogram looks like a bell (distribution close to normal), then:

| interval | contains about |
|---|---:|
| $\bar x \pm 1\cdot s$ | 68% of the data |
| $\bar x \pm 2\cdot s$ | 95% of the data |
| $\bar x \pm 3\cdot s$ | 99.7% of the data (**three-sigma rule**) |

@chart sigma

The three-sigma rule is used in **quality control**, and the two-sigma rule for **detecting unusual values** (an observation further than $2s$ from the mean is suspicious). {lecture:W01}

# Box plot

A **box plot** (box-and-whisker plot) shows five numbers: **min, Q1, Me, Q3, max**. Each of the four parts contains about 25% of the data.

- the **box** from Q1 to Q3 — the middle 50% of observations; the line inside = median; box width = IQR;
- the **whiskers** reach the most distant observations that are **not outliers**:
  - left whisker to $\min\{x_k: x_k \ge Q_1 - 1.5\cdot IQR\}$,
  - right whisker to $\max\{x_k: x_k \le Q_3 + 1.5\cdot IQR\}$;
- observations beyond the “fences” $[Q_1 - 1.5\,IQR;\; Q_3 + 1.5\,IQR]$ are **outliers** — drawn as separate dots. {lecture:W01}

@chart salaryBox

::: example W01 | Reading the plot
Incomes of 11 people: Q1 = 2000, Me = 2500, Q3 = 3500, IQR = 1500. Upper fence: $3500 + 1.5\cdot1500 = 5750$ → 19,000 is an outlier. The mean (×) lies **to the right** of the median → the distribution is **right-skewed** (positive skewness).
:::

::: tip
A box plot is great for **comparing several groups** — draw the boxes one below another on a common axis (see exercise 8).
:::

# How to do it in Excel

~~~excel Descriptive statistics — data in A2:A41
D2: =COUNT(A2:A41)            // n — number of observations
D3: =AVERAGE(A2:A41)          // mean
D4: =MEDIAN(A2:A41)           // median
D5: =MODE.SNGL(A2:A41)        // mode
D6: =MIN(A2:A41)
D7: =MAX(A2:A41)
D8: =D7-D6                    // range R
D9: =VAR.S(A2:A41)            // sample variance s² (divisor n-1)
D10: =STDEV.S(A2:A41)         // standard deviation s
D11: =QUARTILE.EXC(A2:A41,1)  // Q1
D12: =QUARTILE.EXC(A2:A41,3)  // Q3
D13: =D12-D11                 // IQR
~~~

~~~excel Frequency table — upper class limits in F2:F8
G2: =COUNTIFS($A$2:$A$41,">"&(F2-5),$A$2:$A$41,"<="&F2)   // count of class (F2-5; F2]
H2: =G2/$D$2                                                // frequency w_i
I2: =SUM($G$2:G2)                                           // cumulative count N_i
~~~

::: tip own | Faster: built-in tools
- Histogram: *Insert → Charts → Histogram* (Excel 2016+), or the ‹FREQUENCY› function (‹CZĘSTOŚĆ›) entered as an array formula over the whole output range.
- All statistics at once: *Data → Data Analysis → Descriptive Statistics* (enable the *Analysis ToolPak* add-in first).
- Box plot: *Insert → Statistic Chart → Box and Whisker* (Excel 2016+).
:::

~~~python The same computations in Python
import statistics as st

data = [51, 58, 64, 69, 61, 56, 41, 48, 56, 61, 75, 55, 46, 57, 70, 55, 47, 62, 55, 60,
        54, 57, 65, 60, 53, 54, 49, 58, 62, 59, 53, 50, 58, 63, 64, 59, 52, 51, 65, 60]

print("n =", len(data))
print("mean =", st.mean(data))            # 57.325
print("median =", st.median(data))        # 57.5
print("s^2 =", st.variance(data))         # divisor n-1
print("s =", st.stdev(data))
q1, q2, q3 = st.quantiles(data, n=4)      # 'exclusive' method = QUARTILE.EXC
print("Q1, Me, Q3 =", q1, q2, q3)
~~~

::: summary
- First the **feature type** (quantitative continuous/discrete, qualitative ordinal/nominal) → it decides which methods are allowed.
- Qualitative: count/frequency table, **bars**, pie, **mode**.
- Continuous: interval series ($k\approx\sqrt n$, $h=\lceil R/k\rceil$, intervals (a; b]) and a **histogram**.
- Location: **mean** (sensitive to outliers), **median** (robust), mode.
- Spread: range, **variance** $s^2$ (divisor $n-1$), **standard deviation** $s$, **IQR**.
- **Box plot**: min, Q1, Me, Q3, max; outliers beyond $Q_1-1.5IQR$, $Q_3+1.5IQR$.
:::
`,

    cheatsheet: md`
## Feature type → what is allowed

| Feature | Example | Table / chart | Measures |
|---|---|---|---|
| nominal | blood group | counts, bars, pie | mode |
| ordinal | small/medium/large | bars (in order) | mode, median |
| discrete | number of failures | point series, bars | all |
| continuous | time, weight | interval series, **histogram** | all |

## Interval series (histogram)

1. $R = x_{\max} - x_{\min}$
2. $k \approx \sqrt n$ (floor or ceiling)
3. $h = \lceil R/k \rceil$ (always round up!), split the surplus $kh-R$ on both sides
4. intervals **(a; b]**, no empty classes in the middle
5. $w_i = n_i/n$, $N_i$, $W_i$ — cumulative

## Formulas

$$\bar x = \tfrac1n\textstyle\sum x_i \qquad \bar x \approx \tfrac1n\sum n_i\tilde x_i$$
$$s^2 = \tfrac{1}{n-1}\textstyle\sum (x_i-\bar x)^2 \qquad s=\sqrt{s^2}$$

- **Median**: $n$ odd → $x_{((n+1)/2)}$; $n$ even → average of the two middle values
- **Q1 / Q3** = median of the lower / upper half (without the median for odd $n$)
- $IQR = Q_3 - Q_1$; outliers: $< Q_1 - 1.5\,IQR$ or $> Q_3 + 1.5\,IQR$
- $\bar x \pm s$: ~68%, $\pm 2s$: ~95%, $\pm 3s$: ~99.7%
- mean > median → right skew

## Excel

‹AVERAGE› ‹MEDIAN› ‹MODE.SNGL› ‹VAR.S› ‹STDEV.S› ‹MIN› ‹MAX› ‹QUARTILE.EXC› ‹COUNTIF› ‹FREQUENCY›

::: warn
Pie chart angle = $w_i\cdot360^\circ$. Variance has unit², standard deviation has the data unit.
:::
`,

    exercises: [
      {
        id: 'e1', tag: 'C01–02', title: 'Excel warm-up: series sum, function plot, category coding',
        text: md`
a) Compute in Excel the partial sums $S(p) = \sum_{n=1}^{200} \dfrac{1}{n^p}$ for $p = 1.5$ and $p = 3$ (keep $p$ in a separate cell).

b) Plot the function
$$g(x) = \begin{cases} x^4 - 2x, & x\in[-1.5;\,1]\\ 2x - 3, & x\in(1;\,3]\end{cases}$$
with step 0.05. Is the graph continuous at $x=1$?

c) In a survey 24 people gave their T-shirt size: S, M, M, L, XL, M, S, L, M, M, XL, L, S, M, L, M, XL, S, M, L, M, S, L, M. Code the sizes as S = 1, M = 2, L = 3, XL = 4 and count each category.
`,
        hint: md`a) Column A: $n = 1…200$, column B: ‹=1/A2^$E$1›, where E1 = $p$ (dollar = absolute reference). b) Nested ‹IF› with ‹AND›. c) ‹IF›…‹IF› for coding and ‹COUNTIF› for counting.`,
        solution: md`
**a)** Sheet layout:

~~~excel
E1: 1.5                  // p — change to 3 for the second case
A2: 1                    // then fill down to A201 (series 1…200)
B2: =1/A2^$E$1           // fill down to B201
E2: =SUM(B2:B201)        // S(p)
~~~

Results: $S(1.5) \approx 2.4711$, $S(3) \approx 1.2020$. (For $p=3$ the sum is already very close to the limit $\zeta(3)\approx1.20206$; for $p=1.5$ the series converges much more slowly.)

**b)** Put −1.5 in A2, ‹=A2+0.05› in A3 and fill down to $x=3$. In column B:

~~~excel
B2: =IF(AND(A2>=-1.5,A2<=1),A2^4-2*A2,IF(AND(A2>1,A2<=3),2*A2-3,""))
~~~

Chart: *Insert → Scatter with lines*. At $x=1$: $1^4-2\cdot1=-1$ and $2\cdot1-3=-1$ — both parts give −1, so **the graph is continuous**. Minimum of the first part: $g'(x)=4x^3-2=0 \Rightarrow x=\sqrt[3]{0.5}\approx0.794$, $g\approx-1.19$.

**c)** Data in B2:B25:

~~~excel
C2: =IF(B2="S",1,IF(B2="M",2,IF(B2="L",3,IF(B2="XL",4,"?"))))
F2: =COUNTIF($C$2:$C$25,E2)       // E2:E5 contain the codes 1,2,3,4
~~~

| size | S | M | L | XL | total |
|---|---:|---:|---:|---:|---:|
| code | 1 | 2 | 3 | 4 | |
| count | 5 | 10 | 6 | 3 | 24 |
`,
        answer: md`$S(1.5)\approx 2.4711$; $S(3)\approx1.2020$; continuous at $x=1$; counts S/M/L/XL = 5/10/6/3.`
      },
      {
        id: 'e2', tag: 'C01–02', title: 'Favourite programming language',
        text: md`
24 students were asked about their favourite programming language. Answers:
Python, Java, Python, JavaScript, C++, Python, Java, JavaScript, Python, Go, JavaScript, Python, Java, C++, Python, JavaScript, Python, Java, JavaScript, Python, C++, Java, JavaScript, Python.

a) Make a table of counts and frequencies and a bar chart.
b) Draw a pie chart (give the slice angles) and interpret it. What is the mode?
`,
        hint: md`This is a **nominal** feature — the order of categories is arbitrary. Slice angle $= w_i\cdot 360^\circ$.`,
        solution: md`
| language | $n_i$ | $w_i$ | % | angle |
|---|---:|---:|---:|---:|
| Python | 9 | 0.375 | 37.5% | 135° |
| JavaScript | 6 | 0.250 | 25.0% | 90° |
| Java | 5 | 0.208 | 20.8% | 75° |
| C++ | 3 | 0.125 | 12.5% | 45° |
| Go | 1 | 0.042 | 4.2% | 15° |
| **total** | **24** | **1** | **100%** | **360°** |

@chart exLangBar

@chart exLangPie

**Interpretation:** mode = **Python** (more than 1/3 of answers). Python and JavaScript together make 62.5%, almost two thirds of the group. Only 1 person chose Go. With 5 categories the pie chart is still readable, but bars are easier to compare (e.g. JavaScript vs Java).
`,
        answer: md`Mode: Python (37.5%, 135°); JavaScript 25% (90°), Java 20.8% (75°), C++ 12.5% (45°), Go 4.2% (15°).`
      },
      {
        id: 'e3', tag: 'C01–02', title: 'Queue in the canteen',
        text: md`
The waiting time in a queue (minutes) of 11 students was measured: 4, 7, 5, 9, 6, 7, 8, 5, 7, 6, 31.
Compute the mean, median and mode. Find the quartiles, draw a box plot and interpret it. Which measure better describes the “typical” waiting time?
`,
        hint: md`Sort the data. With $n=11$ the median is the 6th element; Q1 and Q3 are the medians of the 5 elements before and after the median. Check the fences $Q_1-1.5IQR$, $Q_3+1.5IQR$.`,
        solution: md`
Sorted: 4, 5, 5, 6, 6, **7**, 7, 7, 8, 9, 31.

- $\bar x = \dfrac{95}{11} \approx 8.64$ min
- Me $= x_{(6)} = 7$ min
- mode = 7 (occurs 3 times)
- Q1 = median (4, 5, 5, 6, 6) = 5; Q3 = median (7, 7, 8, 9, 31) = 8; IQR = 3
- fences: $5 - 1.5\cdot3 = 0.5$ and $8 + 1.5\cdot 3 = 12.5$ → **31 is an outlier**; the whiskers reach 4 and 9.

@chart exQueueBox

**Interpretation:** half of the students waited between 5 and 8 minutes. One person waited 31 minutes (a broken till?) and pulls the mean up: 8.64 > 7. The typical time is better described by the **median (7 min)**.

In Excel: ‹QUARTILE.EXC› gives 5 and 8 (as by hand), ‹QUARTILE.INC› gives 5.5 and 7.5.
`,
        answer: md`$\bar x\approx8.64$, Me = 7, mode = 7, Q1 = 5, Q3 = 8, IQR = 3, 31 is an outlier; better measure: the median.`
      },
      {
        id: 'e4', tag: 'C01–02', title: 'Coffee prices',
        text: md`
The price of a small coffee in six cafés (PLN): 12.50; 13.00; 11.80; 12.20; 13.40; 12.70. Compute the mean price and the variance and standard deviation of the price.
`,
        hint: md`Make a table: $x_i$, $x_i-\bar x$, $(x_i-\bar x)^2$. The divisor of the sample variance is $n-1=5$.`,
        solution: md`
$\bar x = \dfrac{75.6}{6} = 12.60$ PLN.

| $x_i$ | 12.50 | 13.00 | 11.80 | 12.20 | 13.40 | 12.70 | sum |
|---|---:|---:|---:|---:|---:|---:|---:|
| $x_i-\bar x$ | −0.10 | 0.40 | −0.80 | −0.40 | 0.80 | 0.10 | 0 |
| $(x_i-\bar x)^2$ | 0.01 | 0.16 | 0.64 | 0.16 | 0.64 | 0.01 | 1.62 |

$$s^2 = \frac{1.62}{6-1} = 0.324 \text{ PLN}^2, \qquad s = \sqrt{0.324}\approx 0.57 \text{ PLN}$$

Check: the deviations from the mean always sum to 0. In Excel: ‹=VAR.S(A2:A7)› and ‹=STDEV.S(A2:A7)›.
`,
        answer: md`$\bar x = 12.60$ PLN, $s^2 = 0.324$ PLN², $s \approx 0.57$ PLN.`
      },
      {
        id: 'e5', tag: 'C01–02', title: 'Commute time — histogram',
        text: md`
Commute times to university (min) of 30 students:
18, 25, 32, 41, 22, 27, 35, 30, 19, 24, 38, 29, 33, 26, 21, 44, 28, 31, 36, 23, 27, 30, 34, 25, 29, 40, 20, 32, 26, 37.

Build a frequency table with the lecture’s method, draw count and frequency histograms and describe the shape.
`,
        hint: md`$n=30$, $\sqrt{30}\approx5.48$ → $k=5$ or $6$. With $k=6$: $h=\lceil26/6\rceil=5$. Intervals (a; b].`,
        solution: md`
1. $x_{\min}=18$, $x_{\max}=44$, $R=26$.
2. $k=6$ (ceiling of 5.48), $h=\lceil 26/6\rceil = \lceil4.33\rceil=5$; $6\cdot5=30$, surplus 4 → 2 on each side: start at 16.

| class | (16; 21] | (21; 26] | (26; 31] | (31; 36] | (36; 41] | (41; 46] | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| $n_i$ | 4 | 7 | 8 | 6 | 4 | 1 | 30 |
| $w_i$ | 0.133 | 0.233 | 0.267 | 0.200 | 0.133 | 0.033 | 1 |
| $N_i$ | 4 | 11 | 19 | 25 | 29 | 30 | |

@chart exCommuteHist

**Shape:** **unimodal** (the largest class 26–31 min), fairly **symmetric**, with a slightly longer right tail (one person commutes 44 min). Check: $\bar x = 29.4$ min, Me = 29 min — almost equal, confirming symmetry.

The frequency histogram looks identical — only the Y-axis scale changes (divide by 30).
`,
        answer: md`Classes (16;21], …, (41;46] with counts 4, 7, 8, 6, 4, 1; unimodal, almost symmetric.`
      },
      {
        id: 'e6', tag: 'C01–02', title: 'Mobile data usage — grouped data',
        text: md`
The monthly mobile data usage (GB) of 60 users was grouped:

| usage [GB] | 0–3 | 3–6 | 6–9 | 9–12 | 12–15 | 15–18 | 18–21 |
|---|---:|---:|---:|---:|---:|---:|---:|
| users | 5 | 14 | 18 | 11 | 7 | 3 | 2 |

a) Draw a frequency histogram and describe its shape.
b) What percentage of users use less than 12 GB?
c) In which interval is the median?
`,
        hint: md`c) The median is the average of the 30th and 31st observations — look for the class where the cumulative count $N_i$ exceeds 30.`,
        solution: md`
**a)** Frequencies $w_i = n_i/60$: 0.083; 0.233; 0.300; 0.183; 0.117; 0.050; 0.033.

@chart exUsageHist

Shape: unimodal (peak at 6–9 GB), **right-skewed** — a long tail towards large values.

**b)** $\dfrac{5+14+18+11}{60} = \dfrac{48}{60} = 0.8$ → **80%** of users.

**c)** Cumulative counts: 5, 19, **37**, … Observations no. 30 and 31 lie in the class where $N_i$ first exceeds 30 → the median is in **6–9 GB**.

::: own | Bonus: approximate median and mean
Linear interpolation inside the median class: $\text{Me} \approx 6 + \dfrac{30-19}{18}\cdot 3 \approx 7.83$ GB. Mean from the midpoints: $\bar x = \dfrac{504}{60} = 8.4$ GB > Me — consistent with right skew.
:::
`,
        answer: md`Right-skewed; 80% of users < 12 GB; the median is in 6–9 GB.`
      },
      {
        id: 'e7', tag: 'C01–02', title: 'Quartiles without numbers',
        text: md`
For a sample of size 12 we know that
$$x_4 = x_7 < x_2 = x_9 = x_{11} < x_1 < x_5 = x_{12} < x_3 = x_6 = x_8 < x_{10}.$$
Find the median Q2 and the quartiles Q1 and Q3 (express them through $x_i$).
`,
        hint: md`Put the values in order and number the positions 1…12. With $n=12$ the median is the mean of positions 6 and 7; Q1 — of positions 3 and 4; Q3 — of positions 9 and 10.`,
        solution: md`
Order (order statistics):

| position | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| value | $x_4$ | $x_7$ | $x_2$ | $x_9$ | $x_{11}$ | $x_1$ | $x_5$ | $x_{12}$ | $x_3$ | $x_6$ | $x_8$ | $x_{10}$ |

- $Q_2 = \tfrac12\left(x_{(6)}+x_{(7)}\right) = \tfrac12(x_1 + x_5)$
- lower half = positions 1–6, its median $= \tfrac12(x_{(3)}+x_{(4)}) = \tfrac12(x_2+x_9) = x_2$ (since $x_2=x_9$)
- upper half = positions 7–12, its median $= \tfrac12(x_{(9)}+x_{(10)}) = \tfrac12(x_3+x_6) = x_3$
`,
        answer: md`$Q_2 = \frac{x_1+x_5}{2}$, $Q_1 = x_2$, $Q_3 = x_3$.`
      },
      {
        id: 'e8', tag: 'C01–02', title: 'Two courier companies — comparing box plots',
        text: md`
Delivery times (hours) of 13 randomly chosen parcels were recorded for two courier companies:

| company | delivery times [h] |
|---|---|
| A | 22, 26, 24, 30, 28, 25, 27, 29, 23, 31, 26, 28, 39 |
| B | 18, 34, 20, 40, 27, 22, 45, 30, 25, 38, 21, 29, 33 |

a) Compute and compare the means and medians.
b) Find Q1, Q3 and IQR for both companies.
c) Compare the companies with box plots. Which would you choose if you care about **predictable** delivery?
`,
        hint: md`$n=13$: median = 7th element, Q1 = median of elements 1–6, Q3 = median of elements 8–13. Check for outliers.`,
        solution: md`
**Company A**, sorted: 22, 23, 24, 25, 26, 26, **27**, 28, 28, 29, 30, 31, 39.
$\bar x_A = 358/13 \approx 27.54$ h, Me = 27, Q1 = (24 + 25)/2 = 24.5, Q3 = (29 + 30)/2 = 29.5, IQR = 5.
Fences: 24.5 − 7.5 = 17 and 29.5 + 7.5 = 37 → **39 is an outlier**, the right whisker ends at 31.

**Company B**, sorted: 18, 20, 21, 22, 25, 27, **29**, 30, 33, 34, 38, 40, 45.
$\bar x_B = 382/13 \approx 29.38$ h, Me = 29, Q1 = (21 + 22)/2 = 21.5, Q3 = (34 + 38)/2 = 36, IQR = 14.5.
Fences: −0.25 and 57.75 → no outliers.

@chart exCourierBox

**Conclusions:** typical times are similar (medians 27 h and 29 h), but company **B has almost 3 times the spread** (IQR 14.5 h vs 5 h). Company A delivers very consistently — with one exception (39 h). If predictability matters → **company A**.
`,
        answer: md`A: $\bar x\approx27.54$, Me = 27, Q1 = 24.5, Q3 = 29.5, IQR = 5 (39 is an outlier); B: $\bar x\approx29.38$, Me = 29, Q1 = 21.5, Q3 = 36, IQR = 14.5. More predictable: A.`
      }
    ]
  };

  /* ======================================================================= */
  var ru = {
    lead: 'Прежде чем что-то считать, данные нужно **увидеть** и **описать**: несколькими числами (среднее, медиана, разброс) и несколькими графиками (столбцы, гистограмма, ящик с усами).',
    lecture: md`
# Зачем нужна описательная статистика?

Статистика изучает **совокупности** объектов (людей, изделий, явлений). Выводы касаются всей совокупности, а не отдельного объекта. Первый шаг всегда одинаковый: **собрать данные, упорядочить их и показать** так, чтобы за несколько секунд что-то заметить. {lecture:W01}

Цели описательной статистики (по лекции):
- **охарактеризовать данные в сжатом виде** — например, средний доход, средний расход топлива;
- **найти закономерности** (или нерегулярности), скрытые в данных, и зависимости между их частями.

::: intuition
Перед вами 30 чисел — и вы ничего не видите. Описательная статистика похожа на краткое содержание книги: вместо 300 страниц один абзац («типичное значение около 57, большинство между 50 и 65, есть одно странное значение 75») и одна картинка.
:::

Прежде чем считать, **посмотрите на сырые данные** и ответьте на вопросы из лекции:
- какой признак измеряли и **в каких единицах**? (разные единицы нужно привести к общей шкале),
- **сколько** наблюдений, **не пропала** ли часть данных, возможны ли искажения,
- **зачем** собирали данные — на какой вопрос они должны ответить?

# Генеральная совокупность, выборка, признак

::: def | Совокупность и выборка
**Генеральная совокупность (populacja)** — множество объектов, изучаемых по определённому признаку (признак называют **переменной**).
**Выборка (próbka)** — множество значений признака у обследованных объектов, т.е. только у случайно отобранной части совокупности. {lecture:W01}
:::

Исследование бывает:
- **сплошным** (полным) — обследуем все объекты; имеет смысл, если совокупность мала, а исследование дешёвое и не разрушает объект;
- **выборочным** — обследуем только **выборку**. Так бывает почти всегда: обследовать всё слишком дорого (перепись проводят раз в 10 лет), разрушительно (нельзя пережечь все предохранители, чтобы проверить их прочность) или невозможно (**гипотетическая** совокупность — например, будущие покупатели товара, которого ещё нет).

Выборка должна быть **случайной** и **репрезентативной** — отражать изменчивость всей совокупности. Пример из лекции: интервьюер в торговом центре Варшавы в понедельник в 10:00 получит ответы, но не от тех, кто в это время работает — выборка не репрезентативна. Поэтому социологи используют **стратифицированный отбор**: делят совокупность на однородные слои (например, регионы) и из каждого берут объекты пропорционально его размеру. На производстве проще — обычно хватает **простой случайной выборки**. {lecture:W01}

| Совокупность | Изучаемый признак | Собранные данные (выборка) |
|---|---|---|
| партия деталей | качество детали (соответствует / не соответствует) | качество проверенных деталей |
| компьютеры в сети | число сбоев за период | числа сбоев выбранных компьютеров |
| проекты на конкурсе | оценка проекта (баллы) | оценки выбранных проектов |
| сотрудники фирмы | стаж работы | стаж отобранных людей |

# Типы признаков

- **Количественные** (числа):
  - **непрерывные** — могут принимать любое значение из интервала: рост, вес, время (время по природе непрерывно, даже если мы указываем его в целых часах);
  - **дискретные** — обычно целые числа, полученные счётом: число детей в семье, число жалоб, число сбоев.
- **Качественные** (категории):
  - **порядковые** — у категорий есть естественный порядок: малые/средние/крупные города, бездетные/многодетные семьи;
  - **номинальные** — категории нельзя упорядочить: группа крови, пол, цвет глаз.

На лекции упоминались также **относительные данные (ilorazowe)** — положительные, ненулевые: их можно делить и логарифмировать, это самый «богатый» тип данных. {lecture:W01}

::: warn
Метод должен соответствовать типу признака. «Средняя группа крови» не имеет смысла — для номинальных признаков можно считать только частоты и **моду** (самую частую категорию).
:::

# Упорядочивание данных: ряды

**Вариационный ряд (szereg wyliczający)** — просто значения, отсортированные по возрастанию. Уже сортировка многое даёт: видно минимум, максимум и повторяющиеся значения.

**Ряд распределения (szereg rozdzielczy)** — данные, разбитые на **классы** с указанием числа элементов в каждом:
- **дискретный (точечный)** — если различных значений мало (каждое значение — отдельный класс),
- **интервальный** — если различных значений много (классы — интервалы).

::: example W01 | Точечный ряд
Число сотрудников в 30 предприятиях концерна: 100; 125; 170; 144; 144; 235; 301; … После сортировки оказывается, что различных значений всего 6:

| Число сотрудников | 100 | 125 | 144 | 170 | 235 | 301 | всего |
|---|---:|---:|---:|---:|---:|---:|---:|
| частота | 5 | 5 | 9 | 4 | 3 | 4 | 30 |

Вместо 30 чисел храним 12 — и можем восстановить все значения (но не их исходный порядок).
:::

Для каждого класса считаем:

| Обозначение | Название | Формула | Смысл |
|---|---|---|---|
| $n_i$ | частота (абсолютная) | — | сколько наблюдений в классе $i$ |
| $w_i$ | относительная частота | $w_i = n_i / n$ | какая это доля целого (сумма = 1 = 100%) |
| $N_i$ | накопленная частота | $N_i = n_1 + \dots + n_i$ | сколько наблюдений «до конца класса $i$» |
| $W_i$ | накопленная отн. частота | $W_i = w_1 + \dots + w_i$ | какая доля «до конца класса $i$» (растёт до 1) |

::: example W01 | Интервальный ряд: площади 69 магазинов [м²]
| интервал | 70–90 | 90–110 | 110–130 | 130–150 | 150–170 | 170–190 | 190–210 |
|---|---:|---:|---:|---:|---:|---:|---:|
| $n_i$ | 5 | 7 | 17 | 21 | 10 | 6 | 3 |
| $w_i$ | 0,07 | 0,10 | 0,25 | 0,30 | 0,14 | 0,09 | 0,04 |
| $N_i$ | 5 | 12 | 29 | 50 | 60 | 66 | 69 |
| $W_i$ | 0,07 | 0,17 | 0,42 | 0,72 | 0,87 | 0,96 | 1,00 |

Читаем, например: у 42% магазинов площадь меньше 130 м².
:::

@chart shopsHist

::: note
Группируя данные в интервалы, мы **безвозвратно теряем часть информации**: знаем, сколько наблюдений в интервале, но не знаем, как они внутри распределены. Поэтому в расчётах каждое значение интервала заменяем **серединой интервала** $\tilde x_i$. Ряд относительных частот — аналог **плотности**, а накопленный ряд — **функции распределения** (темы 3–4). {lecture:W01}
:::

# Графики для качественных и дискретных признаков

**Столбчатая диаграмма** (*bar chart*): у каждой категории/значения свой столбик высотой, равной частоте. Столбики **не соприкасаются** — между категориями нет «непрерывности».

@chart diceBar

**Круговая диаграмма** (*pie chart*): круг делится на секторы, пропорциональные относительным частотам.

$$\text{угол сектора} = \frac{n_i}{n}\cdot 360^\circ = w_i \cdot 360^\circ$$

@chart dicePie

Ограничения круговой диаграммы (по лекции):
- показывает только **доли в процентах** (все секторы = 100%),
- **плохо читается** при большом числе категорий,
- **сравнивать две круговые диаграммы** гораздо труднее, чем одну совмещённую столбчатую.

::: tip W01 | Сравнение двух групп
Хотите сравнить структуру студентов за два года, когда их число сильно изменилось (544 тыс. и 1 265 тыс.)? Рисуйте **столбики относительных частот (%) рядом**, а не абсолютные числа — частоты приводят обе группы к одной шкале.
:::

**Мода** — значение/категория, которое встречается **чаще всего**. На столбчатой диаграмме — самый высокий столбик. Для кубика выше: мода = 6.

# Гистограмма — график для непрерывного признака

Когда значений много и почти все разные, группируем их в **классы (интервалы) одинаковой ширины** и рисуем **гистограмму**: столбики **соприкасаются**, потому что признак непрерывный. Высота столбика = частота (гистограмма частот) или относительная частота.

::: steps | Как построить интервальный ряд и гистограмму (метод из лекции)
1. Найдите $x_{\min}$, $x_{\max}$ и **размах** $R = x_{\max} - x_{\min}$.
2. **Число классов**: $k \approx \sqrt{n}$ — берём целое, ближайшее к $\sqrt n$ (с округлением вниз или вверх — на выбор).
3. **Ширина класса**: $h = \lceil R / k \rceil$ — всегда **вверх**, чтобы $k\cdot h \ge R$ (классы должны покрыть все значения).
4. Излишек $k\cdot h - R$ распределите слева/справа от данных (например, поровну).
5. Интервалы **(a; b]** — открыты слева, **закрыты справа**; первый может быть закрыт с обеих сторон. Значение на границе попадает в класс **слева**.
6. Посчитайте $n_i$ (и при необходимости $w_i, N_i, W_i$). **Пустых классов в середине быть не должно** — если есть, измените разбиение.
:::

::: note W01
В примере с магазинами лекция нарочно использовала интервалы [a; b) — **на занятиях применяем (a; b]**, так считает большинство программ (и так определена функция распределения $F(x)=P(X\le x)$).
:::

Слишком узкие классы → гистограмма «рваная»; слишком широкие → чересчур сглаженная, ничего не видно. Правило $k\approx\sqrt n$ простое и обычно достаточно (в программах свои правила, например $h = 2{,}64\cdot IQR\cdot n^{-1/3}$ из лекции).

::: example W01 | Предохранители: 40 времён перегорания [мин]
Норма: плавкая вставка на 20 А должна выдержать 28 А в течение 1 часа. Измерили время перегорания 40 вставок:
51 58 64 69 61 56 41 48 56 61 75 55 46 57 70 55 47 62 55 60 54 57 65 60 53 54 49 58 62 59 53 50 58 63 64 59 52 51 65 60.

- $x_{\min}=41$, $x_{\max}=75$, $R=34$, $n=40$, $\sqrt{40}\approx 6{,}3$ → $k=7$,
- $h=\lceil 34/7\rceil = 5$, $7\cdot5=35$ → излишек 1 единица: по половине с каждой стороны, границы в «половинках» (так ни одно наблюдение не попадает на границу).

| № | класс | середина $\tilde x_i$ | $n_i$ | $w_i$ | $N_i$ | $W_i$ |
|---:|---|---:|---:|---:|---:|---:|
| 1 | 40,5–45,5 | 43 | 1 | 0,025 | 1 | 0,025 |
| 2 | 45,5–50,5 | 48 | 5 | 0,125 | 6 | 0,150 |
| 3 | 50,5–55,5 | 53 | 10 | 0,250 | 16 | 0,400 |
| 4 | 55,5–60,5 | 58 | 12 | 0,300 | 28 | 0,700 |
| 5 | 60,5–65,5 | 63 | 9 | 0,225 | 37 | 0,925 |
| 6 | 65,5–70,5 | 68 | 2 | 0,050 | 39 | 0,975 |
| 7 | 70,5–75,5 | 73 | 1 | 0,025 | 40 | 1,000 |
:::

@chart fuseHist

Гистограмма **унимодальная** (один пик) и **примерно симметричная** — похожа на **колокол Гаусса** (нормальное распределение, тема 5). Так обычно выглядят измерения со случайными ошибками. **Полигон частот** (оранжевый) соединяет середины верхушек столбиков; по краям добавляем пустые классы, чтобы он «доходил» до оси.

::: example W01 | Возраст 25 участников пенсионной программы
30, 49, 33, 35, 37, 20, 31, 30, 36, 46, 39, 40, 38, 41, 35, 37, 24, 27, 36, 43, 45, 25, 32, 29, 28 — целых 21 различное значение, поэтому группируем. $n=25$ → $k=5$; $R=49-20=29$ → $h=\lceil29/5\rceil=6$; $5\cdot6=30$, излишек 1 — добавляем слева, потому что при $(20;26]$ значение 20 «выпало» бы. Классы: (19;25], (25;31], (31;37], (37;43], (43;49] с частотами 3, 6, 8, 5, 3.
:::

@chart ageHist

::: note
У **нормированной гистограммы** высота столбика $w_i/h$, поэтому общая площадь = 1, а площадь над интервалом = относительной частоте. Сейчас на практике используется редко, но именно она при $n\to\infty$ превращается в **плотность** (тема 4). {lecture:W01}
:::

# Меры положения — где «центр» данных?

::: formula | Среднее арифметическое
$$\bar x = \frac{1}{n}\sum_{i=1}^{n} x_i = \frac{x_1+x_2+\dots+x_n}{n}$$
Для сгруппированных данных (середины классов $\tilde x_i$, частоты $n_i$, $k$ классов):
$$\bar x \approx \frac{1}{n}\sum_{i=1}^{k} n_i\,\tilde x_i$$
:::

::: example W01 | Среднее по сгруппированным данным
Доходы 10 человек [тыс. зл]: классы [1; 1,5], (1,5; 2], (2; 2,5], (2,5; 3] с частотами 2, 2, 4, 2. Середины: 1,25; 1,75; 2,25; 2,75.
$$\bar x = \frac{2\cdot1{,}25 + 2\cdot1{,}75 + 4\cdot 2{,}25 + 2\cdot 2{,}75}{10} = 2{,}05 \text{ тыс. зл}$$
Результат немного отличается от среднего по сырым данным — при группировке мы потеряли информацию.
:::

::: formula | Медиана (срединное значение)
Сначала сортируем: $x_{(1)} \le x_{(2)} \le \dots \le x_{(n)}$ (это **порядковые статистики**; $x_{(1)}=\min$, $x_{(n)}=\max$).
$$\text{Me} = \begin{cases} x_{((n+1)/2)} & n \text{ нечётное}\\[4pt] \tfrac12\left(x_{(n/2)} + x_{(n/2+1)}\right) & n \text{ чётное}\end{cases}$$
:::

::: intuition
**Среднее** — точка, в которой доска с грузиками в точках $x_i$ была бы в равновесии: один очень тяжёлый груз далеко от остальных сильно её сдвигает. **Медиана** — человек, стоящий ровно посередине очереди, выстроенной от самого низкого к самому высокому: ей всё равно, насколько высок последний.
:::

::: example W01 | Почему медиана бывает лучше среднего
Доходы 11 человек: 4 × 2000 зл, 4 × 2500 зл, 2 × 3500 зл, 1 × 19 000 зл (менеджер).
$$\bar x = \frac{4\cdot2000 + 4\cdot2500 + 2\cdot3500 + 19000}{11} = 4000 \text{ зл}, \qquad \text{Me} = x_{(6)} = 2500 \text{ зл}$$
Средние 4000 зл не зарабатывает… никто: у 10 из 11 человек меньше. Среднее **чувствительно к выбросам**, медиана **устойчива**. Поэтому для зарплат (асимметричное распределение) статистическое управление публикует и медиану.
:::

**Усечённое среднее** (с параметром $k$): отбрасываем по $k$ самых маленьких и самых больших наблюдений и усредняем остальные:
$$\bar x_{t,k} = \frac{1}{n-2k}\sum_{i=k+1}^{n-k} x_{(i)}$$
**Винзорированное среднее**: вместо отбрасывания заменяем $k$ крайних наблюдений с каждой стороны значениями $x_{(k+1)}$ и $x_{(n-k)}$ (объём выборки не меняется). {lecture:W01}

::: warn W01
Выбросы могут быть **очень важны** — например, сигнализировать о разладке производственного процесса. Усечённое среднее применяйте, когда выбросы — результат **ошибки** (опечатка, сломанный прибор), а не чтобы «красивее получилось».
:::

**Мода** — самое частое значение. Для непрерывного признака: пик (локальный максимум) гистограммы; гистограмма с одним пиком — **унимодальная**, с несколькими — **мультимодальная** (часто признак того, что в данных смешаны разные совокупности).

# Меры разброса — насколько данные различаются?

У двух групп может быть одинаковый средний балл 3,5 — в одной у всех 3,5, в другой у половины 2, у половины 5. Среднее этого не покажет; нужна мера **разброса**.

::: formula | Размах, дисперсия, стандартное отклонение
$$R = x_{(n)} - x_{(1)}$$
$$s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar x)^2 \qquad s = \sqrt{s^2}$$
Для сгруппированных данных: $s^2 \approx \dfrac{1}{n-1}\sum_{i=1}^{k} n_i(\tilde x_i - \bar x)^2$.
:::

- **Размах** — самая простая мера, но зависит только от двух крайних значений.
- **Дисперсия** $s^2$ — средний квадрат расстояния от среднего (физически — аналог момента инерции). Её единица — единица данных **в квадрате** (например, зл²).
- **Стандартное отклонение** $s$ — корень из дисперсии, в **тех же единицах**, что и данные. Читаем: «типичное расстояние наблюдения от среднего».
- **Среднее абсолютное отклонение** $d_1 = \frac1n\sum|x_i-\bar x|$ — используется редко.

::: note W01 | Почему делим на n − 1, а не на n?
Делитель $n-1$ делает $s^2$ **несмещённой оценкой** дисперсии совокупности — в среднем она «попадает» в истинное значение. Подробно — в теме 9 (оценивание).
:::

::: example W01 | Дисперсия по сгруппированным данным
Для доходов 10 человек ($\bar x = 2{,}05$): отклонения середин от среднего: −0,8; −0,3; 0,2; 0,7.
$$s^2 = \frac{2\cdot0{,}64 + 2\cdot0{,}09 + 4\cdot0{,}04 + 2\cdot0{,}49}{9} = \frac{2{,}6}{9} \approx 0{,}2889,\qquad s\approx 0{,}537 \text{ тыс. зл}$$
:::

## Квартили и межквартильный размах

Медиана делит упорядоченную выборку **пополам**, квартили — **на четверти**:
- **Q1 (нижний квартиль)** = медиана подвыборки элементов «меньших» медианы (стоящих перед ней в очереди),
- **Q2** = медиана,
- **Q3 (верхний квартиль)** = медиана подвыборки элементов «больших» медианы (стоящих после неё),
- **межквартильный размах** $IQR = Q_3 - Q_1$ — ширина «средних 50%» данных. {lecture:W01}

::: example own | Квартили шаг за шагом
Отсортированные данные ($n=11$): 4, 5, 5, 6, 6, **7**, 7, 7, 8, 9, 31. Медиана = 6-й элемент = 7.
Нижняя половина (до медианы): 4, 5, **5**, 6, 6 → Q1 = 5. Верхняя половина: 7, 7, **8**, 9, 31 → Q3 = 8. IQR = 3.
При чётном $n$ делим выборку на две равные половины (медиана не входит ни в одну).
:::

::: warn own | Excel считает квартили двумя способами
‹QUARTILE.EXC› (PL: ‹KWARTYL.PRZEDZ.OTW›) и ‹QUARTILE.INC› (‹KWARTYL.PRZEDZ.ZAMK›) могут давать **разные результаты**, и оба могут отличаться от метода «медиана половинок» из лекции. Выше: EXC → 5 и 8 (как в лекции), INC → 5,5 и 7,5. На коллоквиуме считайте **вручную методом из лекции**, а в Excel указывайте, какой функцией пользуетесь.
:::

## Стандартное отклонение и нормальное распределение

Если гистограмма похожа на колокол (распределение близко к нормальному), то:

| интервал | содержит около |
|---|---:|
| $\bar x \pm 1\cdot s$ | 68% данных |
| $\bar x \pm 2\cdot s$ | 95% данных |
| $\bar x \pm 3\cdot s$ | 99,7% данных (**правило трёх сигм**) |

@chart sigma

Правило трёх сигм применяют в **контроле качества**, а правило двух сигм — для **обнаружения нетипичных значений** (наблюдение дальше $2s$ от среднего подозрительно). {lecture:W01}

# Ящик с усами (box plot)

**Ящик с усами** (*box-and-whisker plot*) показывает пять чисел: **min, Q1, Me, Q3, max**. В каждой из четырёх частей около 25% данных.

- **ящик** от Q1 до Q3 — средние 50% наблюдений; черта внутри = медиана; ширина ящика = IQR;
- **усы** тянутся до самых дальних наблюдений, которые **не являются выбросами**:
  - левый ус до $\min\{x_k: x_k \ge Q_1 - 1{,}5\cdot IQR\}$,
  - правый ус до $\max\{x_k: x_k \le Q_3 + 1{,}5\cdot IQR\}$;
- наблюдения за «заборами» $[Q_1 - 1{,}5\,IQR;\; Q_3 + 1{,}5\,IQR]$ — **выбросы**, их рисуют отдельными точками. {lecture:W01}

@chart salaryBox

::: example W01 | Как читать график
Доходы 11 человек: Q1 = 2000, Me = 2500, Q3 = 3500, IQR = 1500. Верхний забор: $3500 + 1{,}5\cdot1500 = 5750$ → 19 000 зл — выброс. Среднее (×) лежит **правее** медианы → распределение **скошено вправо** (положительная асимметрия).
:::

::: tip
Ящик с усами отлично подходит для **сравнения нескольких групп** — ящики рисуют один под другим на общей оси (см. задачу 8).
:::

# Как это сделать в Excel

~~~excel Описательные статистики — данные в A2:A41
D2: =COUNT(A2:A41)            // n — число наблюдений
D3: =AVERAGE(A2:A41)          // среднее
D4: =MEDIAN(A2:A41)           // медиана
D5: =MODE.SNGL(A2:A41)        // мода
D6: =MIN(A2:A41)
D7: =MAX(A2:A41)
D8: =D7-D6                    // размах R
D9: =VAR.S(A2:A41)            // выборочная дисперсия s² (делитель n-1)
D10: =STDEV.S(A2:A41)         // стандартное отклонение s
D11: =QUARTILE.EXC(A2:A41,1)  // Q1
D12: =QUARTILE.EXC(A2:A41,3)  // Q3
D13: =D12-D11                 // IQR
~~~

~~~excel Ряд распределения — верхние границы классов в F2:F8
G2: =COUNTIFS($A$2:$A$41,">"&(F2-5),$A$2:$A$41,"<="&F2)   // частота класса (F2-5; F2]
H2: =G2/$D$2                                                // отн. частота w_i
I2: =SUM($G$2:G2)                                           // накопленная частота N_i
~~~

::: tip own | Быстрее: встроенные инструменты
- Гистограмма: *Вставка → Диаграммы → Гистограмма* (Excel 2016+) или функция ‹FREQUENCY› (‹CZĘSTOŚĆ›), введённая как формула массива.
- Все статистики сразу: *Данные → Анализ данных → Описательная статистика* (нужно включить надстройку *Analysis ToolPak*).
- Ящик с усами: *Вставка → Статистические диаграммы → Ящик с усами* (Excel 2016+).
:::

~~~python Те же вычисления в Python
import statistics as st

dane = [51, 58, 64, 69, 61, 56, 41, 48, 56, 61, 75, 55, 46, 57, 70, 55, 47, 62, 55, 60,
        54, 57, 65, 60, 53, 54, 49, 58, 62, 59, 53, 50, 58, 63, 64, 59, 52, 51, 65, 60]

print("n =", len(dane))
print("среднее =", st.mean(dane))          # 57.325
print("медиана =", st.median(dane))        # 57.5
print("s^2 =", st.variance(dane))          # делитель n-1
print("s =", st.stdev(dane))
q1, q2, q3 = st.quantiles(dane, n=4)       # метод 'exclusive' = QUARTILE.EXC
print("Q1, Me, Q3 =", q1, q2, q3)
~~~

::: summary
- Сначала **тип признака** (количественный непрерывный/дискретный, качественный порядковый/номинальный) → от него зависят допустимые методы.
- Качественные: таблица частот, **столбики**, круг, **мода**.
- Непрерывные: интервальный ряд ($k\approx\sqrt n$, $h=\lceil R/k\rceil$, интервалы (a; b]) и **гистограмма**.
- Положение: **среднее** (чувствительно к выбросам), **медиана** (устойчива), мода.
- Разброс: размах, **дисперсия** $s^2$ (делитель $n-1$), **стандартное отклонение** $s$, **IQR**.
- **Ящик с усами**: min, Q1, Me, Q3, max; выбросы за $Q_1-1{,}5IQR$, $Q_3+1{,}5IQR$.
:::
`,

    cheatsheet: md`
## Тип признака → что можно

| Признак | Пример | Таблица / график | Меры |
|---|---|---|---|
| номинальный | группа крови | частоты, столбики, круг | мода |
| порядковый | малый/средний/большой | столбики (по порядку) | мода, медиана |
| дискретный | число сбоев | точечный ряд, столбики | все |
| непрерывный | время, вес | интервальный ряд, **гистограмма** | все |

## Интервальный ряд (гистограмма)

1. $R = x_{\max} - x_{\min}$
2. $k \approx \sqrt n$ (вниз или вверх)
3. $h = \lceil R/k \rceil$ (всегда вверх!), излишек $kh-R$ — по краям
4. интервалы **(a; b]**, без пустых классов в середине
5. $w_i = n_i/n$, $N_i$, $W_i$ — накопленные

## Формулы

$$\bar x = \tfrac1n\textstyle\sum x_i \qquad \bar x \approx \tfrac1n\sum n_i\tilde x_i$$
$$s^2 = \tfrac{1}{n-1}\textstyle\sum (x_i-\bar x)^2 \qquad s=\sqrt{s^2}$$

- **Медиана**: $n$ нечётн. → $x_{((n+1)/2)}$; $n$ чётн. → среднее двух средних
- **Q1 / Q3** = медиана нижней / верхней половины (без медианы при нечётном $n$)
- $IQR = Q_3 - Q_1$; выбросы: $< Q_1 - 1{,}5\,IQR$ или $> Q_3 + 1{,}5\,IQR$
- $\bar x \pm s$: ~68%, $\pm 2s$: ~95%, $\pm 3s$: ~99,7%
- среднее > медианы → правосторонняя асимметрия

## Excel

‹AVERAGE› ‹MEDIAN› ‹MODE.SNGL› ‹VAR.S› ‹STDEV.S› ‹MIN› ‹MAX› ‹QUARTILE.EXC› ‹COUNTIF› ‹FREQUENCY›
(PL: ‹ŚREDNIA› ‹MEDIANA› ‹WYST.NAJCZĘŚCIEJ.WART› ‹WARIANCJA.PRÓBKI› ‹ODCH.STANDARD.PRÓBKI› ‹KWARTYL.PRZEDZ.OTW› ‹LICZ.JEŻELI› ‹CZĘSTOŚĆ›)

::: warn
Угол на круговой диаграмме = $w_i\cdot360^\circ$. Дисперсия — в единицах², стандартное отклонение — в единицах данных.
:::
`,

    exercises: [
      {
        id: 'e1', tag: 'C01–02', title: 'Разминка в Excel: сумма ряда, график функции, кодирование категорий',
        text: md`
а) Посчитайте в Excel частичные суммы $S(p) = \sum_{n=1}^{200} \dfrac{1}{n^p}$ для $p = 1{,}5$ и $p = 3$ (значение $p$ держите в отдельной ячейке).

б) Постройте график функции
$$g(x) = \begin{cases} x^4 - 2x, & x\in[-1{,}5;\,1]\\ 2x - 3, & x\in(1;\,3]\end{cases}$$
с шагом 0,05. Непрерывен ли график в точке $x=1$?

в) В анкете 24 человека указали размер футболки: S, M, M, L, XL, M, S, L, M, M, XL, L, S, M, L, M, XL, S, M, L, M, S, L, M. Закодируйте размеры числами S = 1, M = 2, L = 3, XL = 4 и найдите численность каждой категории.
`,
        hint: md`а) Столбец A: $n = 1…200$, столбец B: ‹=1/A2^$E$1›, где E1 = $p$ (доллар — абсолютная ссылка). б) Вложенный ‹IF› с ‹AND›. в) ‹IF›…‹IF› для кодирования и ‹COUNTIF› для подсчёта.`,
        solution: md`
**а)** Структура листа:

~~~excel
E1: 1.5                  // p — поменяйте на 3 для второго случая
A2: 1                    // затем протяните до A201 (ряд 1…200)
B2: =1/A2^$E$1           // протяните до B201
E2: =SUM(B2:B201)        // S(p)
~~~

Результаты: $S(1{,}5) \approx 2{,}4711$, $S(3) \approx 1{,}2020$. (При $p=3$ сумма уже очень близка к пределу $\zeta(3)\approx1{,}20206$; при $p=1{,}5$ ряд сходится гораздо медленнее.)

**б)** В A2 введите −1,5, в A3 ‹=A2+0.05› и протяните до $x=3$. В столбце B:

~~~excel
B2: =IF(AND(A2>=-1.5,A2<=1),A2^4-2*A2,IF(AND(A2>1,A2<=3),2*A2-3,""))
~~~

График: *Вставка → Точечная с линиями*. В $x=1$: $1^4-2\cdot1=-1$ и $2\cdot1-3=-1$ — обе части дают −1, значит **график непрерывен**. Минимум первой части: $g'(x)=4x^3-2=0 \Rightarrow x=\sqrt[3]{0{,}5}\approx0{,}794$, $g\approx-1{,}19$.

**в)** Данные в B2:B25:

~~~excel
C2: =IF(B2="S",1,IF(B2="M",2,IF(B2="L",3,IF(B2="XL",4,"?"))))
F2: =COUNTIF($C$2:$C$25,E2)       // в E2:E5 коды 1,2,3,4
~~~

| размер | S | M | L | XL | всего |
|---|---:|---:|---:|---:|---:|
| код | 1 | 2 | 3 | 4 | |
| численность | 5 | 10 | 6 | 3 | 24 |
`,
        answer: md`$S(1{,}5)\approx 2{,}4711$; $S(3)\approx1{,}2020$; график непрерывен в $x=1$; S/M/L/XL = 5/10/6/3.`
      },
      {
        id: 'e2', tag: 'C01–02', title: 'Любимый язык программирования',
        text: md`
24 студентов спросили о любимом языке программирования. Ответы:
Python, Java, Python, JavaScript, C++, Python, Java, JavaScript, Python, Go, JavaScript, Python, Java, C++, Python, JavaScript, Python, Java, JavaScript, Python, C++, Java, JavaScript, Python.

а) Составьте таблицу частот и относительных частот и постройте столбчатую диаграмму.
б) Постройте круговую диаграмму (укажите углы секторов) и проинтерпретируйте её. Какова мода?
`,
        hint: md`Это **номинальный** признак — порядок категорий произвольный. Угол сектора $= w_i\cdot 360^\circ$.`,
        solution: md`
| язык | $n_i$ | $w_i$ | % | угол |
|---|---:|---:|---:|---:|
| Python | 9 | 0,375 | 37,5% | 135° |
| JavaScript | 6 | 0,250 | 25,0% | 90° |
| Java | 5 | 0,208 | 20,8% | 75° |
| C++ | 3 | 0,125 | 12,5% | 45° |
| Go | 1 | 0,042 | 4,2% | 15° |
| **всего** | **24** | **1** | **100%** | **360°** |

@chart exLangBar

@chart exLangPie

**Интерпретация:** мода = **Python** (больше 1/3 ответов). Python и JavaScript вместе дают 62,5%, почти две трети группы. Go выбрал только 1 человек. При 5 категориях круговая диаграмма ещё читается, но столбики сравнивать легче (например, JavaScript и Java).
`,
        answer: md`Мода: Python (37,5%, 135°); JavaScript 25% (90°), Java 20,8% (75°), C++ 12,5% (45°), Go 4,2% (15°).`
      },
      {
        id: 'e3', tag: 'C01–02', title: 'Очередь в столовой',
        text: md`
Измерили время ожидания в очереди (в минутах) 11 студентов: 4, 7, 5, 9, 6, 7, 8, 5, 7, 6, 31.
Найдите среднее, медиану и моду. Найдите квартили, постройте ящик с усами и проинтерпретируйте его. Какая мера лучше описывает «типичное» время ожидания?
`,
        hint: md`Отсортируйте данные. При $n=11$ медиана — 6-й элемент; Q1 и Q3 — медианы 5 элементов до и после медианы. Проверьте «заборы» $Q_1-1{,}5IQR$, $Q_3+1{,}5IQR$.`,
        solution: md`
Отсортировано: 4, 5, 5, 6, 6, **7**, 7, 7, 8, 9, 31.

- $\bar x = \dfrac{95}{11} \approx 8{,}64$ мин
- Me $= x_{(6)} = 7$ мин
- мода = 7 (встречается 3 раза)
- Q1 = медиана (4, 5, 5, 6, 6) = 5; Q3 = медиана (7, 7, 8, 9, 31) = 8; IQR = 3
- заборы: $5 - 1{,}5\cdot3 = 0{,}5$ и $8 + 1{,}5\cdot 3 = 12{,}5$ → **31 — выброс**; усы доходят до 4 и 9.

@chart exQueueBox

**Интерпретация:** половина студентов ждала от 5 до 8 минут. Один человек ждал 31 минуту (сломалась касса?) — именно он «тянет» среднее вверх: 8,64 > 7. Типичное время лучше описывает **медиана (7 мин)**.

В Excel: ‹QUARTILE.EXC› даёт 5 и 8 (как вручную), а ‹QUARTILE.INC› — 5,5 и 7,5.
`,
        answer: md`$\bar x\approx8{,}64$, Me = 7, мода = 7, Q1 = 5, Q3 = 8, IQR = 3, значение 31 — выброс; лучше медиана.`
      },
      {
        id: 'e4', tag: 'C01–02', title: 'Цены на кофе',
        text: md`
Цена маленького кофе в шести кофейнях (зл): 12,50; 13,00; 11,80; 12,20; 13,40; 12,70. Найдите среднюю цену, дисперсию и стандартное отклонение цены.
`,
        hint: md`Составьте табличку: $x_i$, $x_i-\bar x$, $(x_i-\bar x)^2$. Делитель в выборочной дисперсии — $n-1=5$.`,
        solution: md`
$\bar x = \dfrac{75{,}6}{6} = 12{,}60$ зл.

| $x_i$ | 12,50 | 13,00 | 11,80 | 12,20 | 13,40 | 12,70 | сумма |
|---|---:|---:|---:|---:|---:|---:|---:|
| $x_i-\bar x$ | −0,10 | 0,40 | −0,80 | −0,40 | 0,80 | 0,10 | 0 |
| $(x_i-\bar x)^2$ | 0,01 | 0,16 | 0,64 | 0,16 | 0,64 | 0,01 | 1,62 |

$$s^2 = \frac{1{,}62}{6-1} = 0{,}324 \text{ зл}^2, \qquad s = \sqrt{0{,}324}\approx 0{,}57 \text{ зл}$$

Проверка: сумма отклонений от среднего всегда равна 0. В Excel: ‹=VAR.S(A2:A7)› и ‹=STDEV.S(A2:A7)›.
`,
        answer: md`$\bar x = 12{,}60$ зл, $s^2 = 0{,}324$ зл², $s \approx 0{,}57$ зл.`
      },
      {
        id: 'e5', tag: 'C01–02', title: 'Время дороги до университета — гистограмма',
        text: md`
Время дороги до университета (мин) у 30 студентов:
18, 25, 32, 41, 22, 27, 35, 30, 19, 24, 38, 29, 33, 26, 21, 44, 28, 31, 36, 23, 27, 30, 34, 25, 29, 40, 20, 32, 26, 37.

Постройте интервальный ряд методом из лекции, гистограммы частот и относительных частот и опишите форму гистограммы.
`,
        hint: md`$n=30$, $\sqrt{30}\approx5{,}48$ → $k=5$ или $6$. При $k=6$: $h=\lceil26/6\rceil=5$. Интервалы (a; b].`,
        solution: md`
1. $x_{\min}=18$, $x_{\max}=44$, $R=26$.
2. $k=6$ (вверх от 5,48), $h=\lceil 26/6\rceil = \lceil4{,}33\rceil=5$; $6\cdot5=30$, излишек 4 → по 2 с каждой стороны: начинаем с 16.

| класс | (16; 21] | (21; 26] | (26; 31] | (31; 36] | (36; 41] | (41; 46] | всего |
|---|---:|---:|---:|---:|---:|---:|---:|
| $n_i$ | 4 | 7 | 8 | 6 | 4 | 1 | 30 |
| $w_i$ | 0,133 | 0,233 | 0,267 | 0,200 | 0,133 | 0,033 | 1 |
| $N_i$ | 4 | 11 | 19 | 25 | 29 | 30 | |

@chart exCommuteHist

**Форма:** гистограмма **унимодальная** (самый многочисленный класс 26–31 мин), довольно **симметричная**, с чуть более длинным правым «хвостом» (один человек едет 44 мин). Проверка: $\bar x = 29{,}4$ мин, Me = 29 мин — почти равны, что подтверждает симметрию.

Гистограмма относительных частот выглядит так же — меняется только шкала оси Y (делим на 30).
`,
        answer: md`Классы (16;21], …, (41;46] с частотами 4, 7, 8, 6, 4, 1; распределение унимодальное, почти симметричное.`
      },
      {
        id: 'e6', tag: 'C01–02', title: 'Мобильный трафик — сгруппированные данные',
        text: md`
Месячный мобильный трафик (ГБ) 60 абонентов сгруппировали в таблицу:

| трафик [ГБ] | 0–3 | 3–6 | 6–9 | 9–12 | 12–15 | 15–18 | 18–21 |
|---|---:|---:|---:|---:|---:|---:|---:|
| абонентов | 5 | 14 | 18 | 11 | 7 | 3 | 2 |

а) Постройте гистограмму относительных частот и опишите её форму.
б) Какой процент абонентов тратит меньше 12 ГБ?
в) В каком интервале лежит медиана?
`,
        hint: md`в) Медиана — среднее 30-го и 31-го наблюдений: ищите класс, в котором накопленная частота $N_i$ впервые превышает 30.`,
        solution: md`
**а)** Относительные частоты $w_i = n_i/60$: 0,083; 0,233; 0,300; 0,183; 0,117; 0,050; 0,033.

@chart exUsageHist

Форма: унимодальная (пик 6–9 ГБ), **скошена вправо** — длинный хвост в сторону больших значений.

**б)** $\dfrac{5+14+18+11}{60} = \dfrac{48}{60} = 0{,}8$ → **80%** абонентов.

**в)** Накопленные частоты: 5, 19, **37**, … Наблюдения № 30 и 31 лежат в классе, где $N_i$ впервые превышает 30 → медиана в интервале **6–9 ГБ**.

::: own | Бонус: приближённые медиана и среднее
Линейная интерполяция в медианном классе: $\text{Me} \approx 6 + \dfrac{30-19}{18}\cdot 3 \approx 7{,}83$ ГБ. Среднее по серединам: $\bar x = \dfrac{504}{60} = 8{,}4$ ГБ > Me — как и положено при правосторонней асимметрии.
:::
`,
        answer: md`Скошено вправо; 80% абонентов < 12 ГБ; медиана в интервале 6–9 ГБ.`
      },
      {
        id: 'e7', tag: 'C01–02', title: 'Квартили без чисел',
        text: md`
Для выборки объёмом 12 известно, что
$$x_4 = x_7 < x_2 = x_9 = x_{11} < x_1 < x_5 = x_{12} < x_3 = x_6 = x_8 < x_{10}.$$
Найдите медиану Q2 и квартили Q1 и Q3 (выразите их через $x_i$).
`,
        hint: md`Расставьте значения по порядку и пронумеруйте позиции 1…12. При $n=12$ медиана — среднее позиций 6 и 7; Q1 — позиций 3 и 4; Q3 — позиций 9 и 10.`,
        solution: md`
Порядок (порядковые статистики):

| позиция | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| значение | $x_4$ | $x_7$ | $x_2$ | $x_9$ | $x_{11}$ | $x_1$ | $x_5$ | $x_{12}$ | $x_3$ | $x_6$ | $x_8$ | $x_{10}$ |

- $Q_2 = \tfrac12\left(x_{(6)}+x_{(7)}\right) = \tfrac12(x_1 + x_5)$
- нижняя половина = позиции 1–6, её медиана $= \tfrac12(x_{(3)}+x_{(4)}) = \tfrac12(x_2+x_9) = x_2$ (так как $x_2=x_9$)
- верхняя половина = позиции 7–12, её медиана $= \tfrac12(x_{(9)}+x_{(10)}) = \tfrac12(x_3+x_6) = x_3$
`,
        answer: md`$Q_2 = \frac{x_1+x_5}{2}$, $Q_1 = x_2$, $Q_3 = x_3$.`
      },
      {
        id: 'e8', tag: 'C01–02', title: 'Две курьерские службы — сравнение ящиков с усами',
        text: md`
Записали время доставки (в часах) 13 случайных посылок в двух курьерских службах:

| служба | время доставки [ч] |
|---|---|
| A | 22, 26, 24, 30, 28, 25, 27, 29, 23, 31, 26, 28, 39 |
| B | 18, 34, 20, 40, 27, 22, 45, 30, 25, 38, 21, 29, 33 |

а) Найдите и сравните средние и медианы.
б) Найдите Q1, Q3 и IQR для обеих служб.
в) Сравните службы с помощью ящиков с усами. Какую выбрать, если важна **предсказуемость** доставки?
`,
        hint: md`$n=13$: медиана = 7-й элемент, Q1 = медиана элементов 1–6, Q3 = медиана элементов 8–13. Проверьте выбросы.`,
        solution: md`
**Служба A**, отсортировано: 22, 23, 24, 25, 26, 26, **27**, 28, 28, 29, 30, 31, 39.
$\bar x_A = 358/13 \approx 27{,}54$ ч, Me = 27, Q1 = (24 + 25)/2 = 24,5, Q3 = (29 + 30)/2 = 29,5, IQR = 5.
Заборы: 24,5 − 7,5 = 17 и 29,5 + 7,5 = 37 → **39 — выброс**, правый ус заканчивается на 31.

**Служба B**, отсортировано: 18, 20, 21, 22, 25, 27, **29**, 30, 33, 34, 38, 40, 45.
$\bar x_B = 382/13 \approx 29{,}38$ ч, Me = 29, Q1 = (21 + 22)/2 = 21,5, Q3 = (34 + 38)/2 = 36, IQR = 14,5.
Заборы: −0,25 и 57,75 → выбросов нет.

@chart exCourierBox

**Выводы:** типичное время похоже (медианы 27 ч и 29 ч), но у службы **B разброс почти в 3 раза больше** (IQR 14,5 ч против 5 ч). Служба A доставляет очень стабильно — с одним исключением (39 ч). Если важна предсказуемость → **служба A**.
`,
        answer: md`A: $\bar x\approx27{,}54$, Me = 27, Q1 = 24,5, Q3 = 29,5, IQR = 5 (39 — выброс); B: $\bar x\approx29{,}38$, Me = 29, Q1 = 21,5, Q3 = 36, IQR = 14,5. Предсказуемее: A.`
      }
    ]
  };

  SAD.registerTopic('t01', { charts: charts, pl: pl, en: en, ru: ru });
})();
