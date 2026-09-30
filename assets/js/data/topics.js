/*
 * Topic registry: order, titles, and mapping to the lecture PDFs (W..) and class lists (C..).
 * Topic content is loaded on demand from data/topics/<id>.js
 */
SAD.topics = [
  {
    id: 't01', num: 1, icon: '📊', lecture: 'W01', classes: 'C01–C02',
    title: { pl: 'Statystyka opisowa', en: 'Descriptive statistics', ru: 'Описательная статистика' },
    short: {
      pl: 'Dane, szeregi, wykresy, histogram, średnia, mediana, kwartyle, wariancja, wykres ramkowy.',
      en: 'Data, frequency tables, charts, histogram, mean, median, quartiles, variance, box plot.',
      ru: 'Данные, ряды, графики, гистограмма, среднее, медиана, квартили, дисперсия, ящик с усами.'
    }
  },
  {
    id: 't02', num: 2, icon: '🎲', lecture: 'W02', classes: 'C03',
    title: { pl: 'Prawdopodobieństwo', en: 'Probability', ru: 'Вероятность' },
    short: {
      pl: 'Zdarzenia, aksjomaty, kombinatoryka, prawdopodobieństwo warunkowe, wzór Bayesa, niezależność.',
      en: 'Events, axioms, combinatorics, conditional probability, Bayes’ rule, independence.',
      ru: 'События, аксиомы, комбинаторика, условная вероятность, формула Байеса, независимость.'
    }
  },
  {
    id: 't03', num: 3, icon: '🔢', lecture: 'W03', classes: 'C04',
    title: { pl: 'Zmienne losowe dyskretne', en: 'Discrete random variables', ru: 'Дискретные случайные величины' },
    short: {
      pl: 'Dystrybuanta, funkcja prawdopodobieństwa, E(X), wariancja, rozkład dwumianowy i Poissona.',
      en: 'CDF, probability mass function, E(X), variance, binomial and Poisson distributions.',
      ru: 'Функция распределения, ряд распределения, E(X), дисперсия, биномиальное и пуассоновское.'
    }
  },
  {
    id: 't04', num: 4, icon: '〰️', lecture: 'W04a', classes: 'C05',
    title: { pl: 'Zmienne losowe ciągłe', en: 'Continuous random variables', ru: 'Непрерывные случайные величины' },
    short: {
      pl: 'Gęstość, dystrybuanta, pole pod wykresem, E(X), wariancja, kwantyle, mediana, standaryzacja.',
      en: 'Density, CDF, area under the curve, E(X), variance, quantiles, median, standardisation.',
      ru: 'Плотность, функция распределения, площадь под графиком, E(X), дисперсия, квантили.'
    }
  },
  {
    id: 't05', num: 5, icon: '🔔', lecture: 'W04b', classes: 'C06',
    title: { pl: 'Rozkłady: jednostajny, normalny, wykładniczy', en: 'Uniform, normal and exponential distributions', ru: 'Равномерное, нормальное и показательное распределения' },
    short: {
      pl: 'Krzywa Gaussa, tablice Φ(z), reguła 3σ, brak pamięci rozkładu wykładniczego.',
      en: 'The Gaussian curve, Φ(z) tables, 3σ rule, memorylessness of the exponential distribution.',
      ru: 'Кривая Гаусса, таблицы Φ(z), правило 3σ, отсутствие памяти у показательного распределения.'
    }
  },
  {
    id: 't06', num: 6, icon: '🧮', lecture: 'W05', classes: 'C07, C09',
    title: { pl: 'Zmienne losowe dwuwymiarowe', en: 'Two-dimensional random variables', ru: 'Двумерные случайные величины' },
    short: {
      pl: 'Rozkład łączny, brzegowy i warunkowy, niezależność, kowariancja, współczynnik korelacji.',
      en: 'Joint, marginal and conditional distributions, independence, covariance, correlation.',
      ru: 'Совместное, маргинальное и условное распределения, независимость, ковариация, корреляция.'
    }
  },
  {
    id: 't07', num: 7, icon: '➕', lecture: 'W06', classes: 'C09',
    title: { pl: 'Wiele zmiennych i sumy', en: 'Many variables and sums', ru: 'Много величин и суммы' },
    short: {
      pl: 'Wektor losowy, E i Var kombinacji liniowej, średnia z próby, twierdzenia o dodawaniu rozkładów.',
      en: 'Random vectors, E and Var of linear combinations, the sample mean, addition theorems.',
      ru: 'Случайный вектор, E и Var линейной комбинации, выборочное среднее, теоремы сложения.'
    }
  },
  {
    id: 't08', num: 8, icon: '📈', lecture: 'W07', classes: 'C10',
    title: { pl: 'Prawo wielkich liczb i CTG', en: 'Law of large numbers and the CLT', ru: 'Закон больших чисел и ЦПТ' },
    short: {
      pl: 'Próba losowa, PWL, centralne twierdzenie graniczne, Moivre–Laplace, poprawka ciągłości.',
      en: 'Random sample, LLN, central limit theorem, de Moivre–Laplace, continuity correction.',
      ru: 'Случайная выборка, ЗБЧ, центральная предельная теорема, Муавр–Лаплас, поправка на непрерывность.'
    }
  },
  {
    id: 't09', num: 9, icon: '🎯', lecture: 'W08', classes: 'C11',
    title: { pl: 'Estymacja i przedziały ufności', en: 'Estimation and confidence intervals', ru: 'Оценивание и доверительные интервалы' },
    short: {
      pl: 'Estymator, nieobciążoność, przedziały ufności dla średniej, wariancji i proporcji, liczność próby.',
      en: 'Estimators, unbiasedness, confidence intervals for the mean, variance and proportion, sample size.',
      ru: 'Оценка, несмещённость, доверительные интервалы для среднего, дисперсии и доли, объём выборки.'
    }
  },
  {
    id: 't10', num: 10, icon: '⚖️', lecture: 'W09', classes: 'C12',
    title: { pl: 'Testowanie hipotez — jedna populacja', en: 'Hypothesis testing — one population', ru: 'Проверка гипотез — одна совокупность' },
    short: {
      pl: 'H₀ i H₁, błędy I i II rodzaju, zbiór krytyczny, p-wartość, testy dla średniej, wariancji, proporcji.',
      en: 'H₀ and H₁, type I/II errors, critical region, p-value, tests for the mean, variance, proportion.',
      ru: 'H₀ и H₁, ошибки I и II рода, критическая область, p-значение, тесты для среднего, дисперсии, доли.'
    }
  },
  {
    id: 't11', num: 11, icon: '🆚', lecture: 'W10', classes: 'C13, C15',
    title: { pl: 'Dwie populacje i testy chi-kwadrat', en: 'Two populations and chi-square tests', ru: 'Две совокупности и тесты хи-квадрат' },
    short: {
      pl: 'Porównanie dwóch średnich i dwóch proporcji, dane sparowane, test zgodności i niezależności χ².',
      en: 'Comparing two means and two proportions, paired data, χ² goodness-of-fit and independence tests.',
      ru: 'Сравнение двух средних и двух долей, парные данные, критерии согласия и независимости χ².'
    }
  },
  {
    id: 't12', num: 12, icon: '📉', lecture: 'W11–12', classes: '',
    title: { pl: 'Korelacja i regresja liniowa', en: 'Correlation and linear regression', ru: 'Корреляция и линейная регрессия' },
    short: {
      pl: 'Wykres rozrzutu, współczynnik korelacji, metoda najmniejszych kwadratów, R², prognoza, rezydua.',
      en: 'Scatter plot, correlation coefficient, least squares, R², prediction, residuals.',
      ru: 'Диаграмма рассеяния, коэффициент корреляции, МНК, R², прогноз, остатки.'
    }
  }
];

SAD.topicById = function (id) {
  for (var i = 0; i < SAD.topics.length; i++) { if (SAD.topics[i].id === id) { return SAD.topics[i]; } }
  return null;
};
