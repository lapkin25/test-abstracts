---
jupytext:
  cell_metadata_filter: -all
  formats: md:myst
  text_representation:
    extension: .md
    format_name: myst
    format_version: 0.13
    jupytext_version: 1.16.1
kernelspec:
  display_name: Python 3 (ipykernel)
  language: python
  name: python3
---

# Наивный байесовский классификатор

Байесовские классификаторы -- это семейство алгоритмов машинного обучения, которые основаны на принципах теории вероятностей и теоремы Байеса. Они используются для разделения объектов на классы на основе их признаков и апостериорной вероятности принадлежности к классам.

Формула для байесовского классификатора выглядит следующим образом:

$$
P(y / x) = \frac{P(x/y)P(y)}{P(x)}
$$

Здесь:
- $P(y/x)$ - апостериорная вероятность класса $y$ при условии признака $x$,
- $P(x/y)$ - вероятность признака $x$ при условии класса $y$,
- $P(y)$ - априорная вероятность класса $y$,
- $P(x)$ - вероятность признака $x$.

Байесовские классификаторы могут быть реализованы различными способами, такими как наивный Байесовский классификатор, квадратичный дискриминантный анализ, алгоритмы максимального правдоподобия и другие. Они широко применяются в задачах классификации, распознавания образов, фильтрации спама и других областях.

Для наивного Байесовского классификатора, который является одной из наиболее распространенных реализаций Байесовских классификаторов, используется предположение о независимости признаков при заданном классе $y$, что значительно упрощает модель и вычисления. Формула для апостериорной вероятности класса $y$ при условии признаков $x1, x2, \ldots , x_n$ выглядит следующим образом:

$$
P(y / x_1, x_2, \ldots, x_n) = \frac{P(y) \prod_{i=1}^n P(x_i / y)}{P(x_1, x_2, \ldots, x_n)}
$$

Здесь:
- $P(y/x_1, x_2, \ldots, x_n)$ - апостериорная вероятность класса $y$ при заданных признаках $x_1, x_2, \ldots, x_n$,
- $P(y)$ - априорная вероятность класса $y$,
- $P(x_i / y)$ - вероятность признака $x_i$ при условии класса $y$,
- $P(x_1, x_2, \ldots, x_n)$ - вероятность объединения признаков $x_1, x_2, \ldots, x_n$, которую обычно можно проигнорировать при сравнении разных классов.

Наивный Байесовский классификатор используется, например, в задачах классификации текста, фильтрации спама, анализе тональности и других задачах, где предположение о независимости признаков оправдано.

```{code-cell} ipython
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB

# Создание синтетических данных
X, y = make_classification(n_samples=100, n_features=2, n_informative=2, n_redundant=0, n_clusters_per_class=1, random_state=42)

# Разделение данных на обучающий и тестовый набор
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Создание и обучение наивного байесовского классификатора
nb_classifier = GaussianNB()
nb_classifier.fit(X_train, y_train)

# Предсказание классов для тестового набора
y_pred = nb_classifier.predict(X_test)

# Визуализация данных и результатов классификации
plt.figure(figsize=(10, 6))
plt.scatter(X_test[:, 0], X_test[:, 1], c=y_pred, cmap=plt.cm.coolwarm, marker='o', alpha=0.6, edgecolors='k')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.title('Naive Bayes Classifier')
plt.show()
```

<iframe src="https://trinket.io/embed/python3/027d928ab4" width="100%" height="356" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>

