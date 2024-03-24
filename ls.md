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

# Аппроксимация. Метод наименьших квадратов

## Введение

## Теория

Аппроксимация – это замена одной функции $f(x)$ другой, похожей функцией $Y(x)$. Методы аппроксимации применяют как в случае, когда функция $f(x)$ задана в табличном виде, так и тогда, когда функция $f(x)$ является непрерывной и есть необходимость получить упрощенное математическое описание имеющейся сложной зависимости. На практике задача аппроксимации часто возникает тогда, когда по экспериментальным данным требуется подобрать такую аналитическую функцию, которая проходила бы как можно ближе к экспериментальным точкам. Построенная в результате решения задачи аппроксимации кривая сглаживает обрабатываемые экспериментальные данные и показывает общую тенденцию зависимости одного параметра от другого.  
Пусть в результате эксперимента получены данные, представленные в следующей таблице:

<style>
  .custom-bg-table {
    border: 1px solid grey;
    width: 250px;
    margin: 0 auto;
  }
</style>

:::custom-bg-table
```{table}
:widths: auto
:align: center
|$\boldsymbol{x_i}$|$x_0$|$x_1$|$x_2$|...|$x_m$|
|:-:|:-:|:-:|:-:|:-:|:-:|
|$\boldsymbol{y_i}$|$y_0$|$y_1$|$y_2$|...|$y_m$|
```
:::

Необходимо заменить таблично заданную функцию аналитической функцией $Y=f(x,c_0,c_1,...,c_k)$. При этом искомая функция $f(x,c_0,c_1,...,c_k)$ может зависеть от параметров как линейно, и тогда говорят о линейной аппроксимации, так и нелинейно. При решении задачи надо таким образом подобрать коэффициенты $c_0,c_1,...,c_k$ функции $Y$, чтобы отклонения экспериментальных значений $y_i$ от модельных $Y_i=f(x_i,c_0,c_1,...,c_k)$ были минимальными.

(approx-steps)=
### Этапы аппроксимации
Решение задачи аппроксимации состоит из нескольких этапов. На первом этапе надо
определить вид зависимости, т. е. выбрать такую кривую, которая лучше всего подходит для описания экспериментальных данных. Определить вид кривой можно визуально, представив данные графически, например:

```{image} img/Figure_1.jpg
:alt: linear_depend_sample
:class: bg-primary
:align: center
:name: Fig_1
```

Очевидно, что в общем случае Y зависит от X линейно, поэтому аппроксимацию можно осуществить прямой, заданной функцией $Y=c_0+c_1x$.

Вторым этапом является вычисление коэффициентов $c_i$. Всего существует три основных подхода к решению задани аппроксимации (поиску коэффициентов $c_i$) а именно: метод наименьших модулей, минимаксный подход и метод наименьших квадратов.

## Метод наименьших квадратов
Этот метод аппроксимации применяется во многих областях науки науки (в математической статистике, физике, биологии и т.д) а так же в обработке изображений.
Метод заключается в отыскании такой аппроксимирующей функции, сумма квадратов отклонений $F$ от которой до экспериментальных (табличных) значений будет наименьшей ($F \to min$). Эта функция выглядит следующим образом:

$$
F=\sum_{i=1}^{n}{(y_i-f(x_i))^2}
$$

Разберем простой пример: пусть необходимо построить аппроксимирующую прямую для табличной функции:

```{table}
:width: 220px
:align: center
|$\boldsymbol{x}$|0|1|2|3|4|5|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|$\boldsymbol{y}$|2.1|3.2|3.5|4.7|5.4|5.8|
```

Точечный график этой функции выглядит так:

```{image} img/Figure_2.jpg
:alt: ls_task_1
:class: bg-primary
:align: center
:name: Fig_2
```    
</br>

[В соответствии с этапами](#approx-steps) необходимо выбрать наиболее подходящую функцию (по условию задачи функция линейная: $Y=c_0+c_1x$) и найти коэффициенты $c_i$. Подставим $Y$ вместо $f(x)$ в функции $F$:

$$
F=\sum_{i=1}^{n}{(y_i-(c_0+c_1x_i))^2}
$$

Задача сводится к поиску таких коэффициентов $c_0$ и $c_1$ при которых $F \to min$. Для этого продифференцируем $F$ по $c_0$ и $c_1$ и составим систему уравнений:

$$
\begin{cases}
\frac{\partial F}{\partial c_0}=0 \\
\frac{\partial F}{\partial c_1}=0
\end{cases}
\implies
\begin{cases}
c_1\sum\limits_{i=1}^{n}{x_i^2} &+ &c_0\sum\limits_{i=1}^{n}{x_i} &- &\sum\limits_{i=1}^{n}{x_iy_i}&= 0 \\
c_1\sum\limits_{i=1}^{n}{x_i} &+ &c_0n &- &\sum\limits_{i=1}^{n}{y_i}&= 0
\end{cases}
$$

Свободные члены перенесем в правую часть:

$$
\begin{cases}
c_1\sum\limits_{i=1}^{n}{x_i^2} &+ &c_0\sum\limits_{i=1}^{n}{x_i} &= \sum\limits_{i=1}^{n}{x_iy_i} \\
c_1\sum\limits_{i=1}^{n}{x_i} &+ &c_0n &= \sum\limits_{i=1}^{n}{y_i}
\end{cases}
$$

Вычислим $x_i^2$, $x_iy_i$ и дополним ими исходную таблицу:

```{table}
:width: 220px
:align: center
|$\boldsymbol{x}$|0|1|2|3|4|5|
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
|$\boldsymbol{y}$|2.1|3.2|3.5|4.7|5.4|5.8|
|$\boldsymbol{x^2}$|0|1|4|9|16|25|
|$\boldsymbol{xy}$|0.0|3.2|7.0|14.1|21.6|29.0|
```

Теперь вычислим все суммы и подсавим их в систему:

$$
\begin{cases}
55c_1 &+ &15c_0 &= 74,9 \\
15c_1 &+ &6c_0 &= 24,7
\end{cases}
$$

Решив систему получим коэффициенты аппроксимирующей прямой $Y$. Решать систему будем на языке `Python` при помощи модулей `numpy` и `scipy.linalg`.

```{code-cell} ipython
---
mystnb:
  number_source_lines: true
---
import numpy as np
from scipy.linalg import solve


# Исходные данные
X = np.array([0, 1, 2, 3, 4, 5])
Y = np.array([2.1, 3.2, 3.5, 4.7, 5.4, 5.8])
n = 6

# Формируем список из x^2
X2 = [i**2 for i in X]

# Формируем список из xy
XY = [x*y for x, y in zip(X, Y)]

# Создаем систему из коэффициентов при неизвестных (в том же порядке что и системе уравнений)
A = np.array([
    [sum(X2), sum(X)],
    [sum(X), n]
])

# Создаем вектор-строку из свободных членов и превращаем его в вектор-столбец функцией reshape
B = np.array([
              sum(XY), 
              sum(Y)
              ]).reshape([2, 1])# 2 - кол-во столбцов исходного вектора, 1 - кол-во строк исходного вектора


# функция solve найдет неизвестные
result = solve(A, B)
c0 = result[1][0]
c1 = result[0][0]
print(f"c0 = {c0}")
print(f"c1 = {c1}")
```

Получили коэффициенты $c_1$ и $c_0$ соответственно. Подставим их в уравнение прямой $Y$:

$$
\begin{aligned}
Y = 2,24 + 0,75x
\end{aligned}
$$

Задача решена. Изобразим решение графически:


```{code-cell} ipython
---
mystnb:
  number_source_lines: true
---
from matplotlib import pyplot as plt

# Определяем график Y от X
plt.plot(X, Y, 'o', label="Исходные данные")# параметр 'o' задает точечный график

# Зададим названия осей
plt.xlabel('X')
plt.ylabel('Y')

# Определяем аппроксимирующую прямую
Y_approx = c0 + c1 * X # (см. заметку)
plt.plot(X, Y_approx, '--', label="Аппроксимирующая прямая")

plt.legend()
plt.show()
```

```{note}
Следует объяснить выражение `Y_approx = c0 + c1 * X` в девятой строке кода.
Тип объекта `X` - `ndarray` массив (похожий на тип списка `List`) определенный в модуле `numpy`. На этот массив можно умножать число и прибавлять к нему число. При умножении на число - каждый элемент массива умножается на это число, аналогично и при сложении: каждый элемент массива складывается в числом, например:

:::{code} python
lst = np.array([1, 2, 3, 4])

print(lst * 2)
print(lst + 3)
:::

:::{code}
[2 4 6 8]   
[4 5 6 7]
:::

При умножении списка `List` на число происходит его копирование `n` раз самого в себя, например:

:::{code} python
lst = [1, 2, 3]
print(lst * 3)
:::

:::{code}
[1, 2, 3, 1, 2, 3, 1, 2, 3]
:::

Будьте внимательны с типами имеющими схожее назначение.
```

*Задание.* Перед вами результаты наблюдений длительности нахождения
человека в очереди в зависимости от количества людей в этой очереди.

|Номер наблюдения|Количество человек в очереди, $X$|Время, проведенное в очереди (мин), $Y$|
|-|-|-|
|1|22|45|
|2|19|42|
|3|11|23|
|4|7|23|
|5|13|23|
|6|20|39|
|7|8|19|
|8|12|21|
|9|15|28|
|10|23|65|

Используйте модель линейной регрессии для прогнозирования и вычислите
коэффициенты регрессии $c_1, c_0$.

<script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"></script>

<textarea id="input1" value="sum([1, 2, 3, 4, 5])" style="width: 400px;" rows="20" hidden="1">
def check_user_code():
  if abs(c1 - 2.2973) < 1e-2 and abs(c0 + 1.6595) < 1e-2:
      return "Result is correct!";
  else:
      return "Result is NOT correct!";
      
check_user_code()
</textarea>

<textarea id="input2" value="sum([1, 2, 3, 4, 5])" style="width: 400px;" rows="20">
# Some calculations...

def do_some_calc():
    return 2*3
    
X = [22, 19, 11, 7, 13, 20, 8, 12, 15, 23]
Y = [45, 42, 23, 23, 23, 39, 19, 21, 28, 65]

c1 = 1.0
c0 = 0.0
</textarea>

<button onclick="evaluatePython()">Run</button>
<br />
<br />
<span>Output:</span><span id="status" style="margin-left: 40px; color: red;"> </span>
<br />
<textarea id="output1" style="width: 400px;" rows="40" disabled></textarea>
<textarea id="output2" style="width: 400px;" rows="40" disabled></textarea>

<script>
const output1 = document.getElementById("output1");
const output2 = document.getElementById("output2");
const testCode = document.getElementById("input1");
const userCode = document.getElementById("input2");
const statusString = document.getElementById("status");

function setOutput(s) {
  output1.value = s;
}

function addToOutput(s) {
  output1.value += s + "\n";
}

function setOutput2(s) {
  output2.value = s;
}

function addToOutput2(s) {
  output2.value += s + "\n";
}
      
function setStatus(s)
{
  statusString.innerHTML = s;
}

setStatus("Initializing...");

async function main() {
  let pyodide = await loadPyodide();

  //Load micropip package manager
  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");

  //Install matplot
  await micropip.install("matplotlib");

  //Install matplot
  await micropip.install("numpy");

  setStatus("Ready!");
  return pyodide;
}

let pyodideReadyPromise = main();

class StdinHandler {
  constructor(results, options) {
    this.results = results;
    this.idx = 0;
    Object.assign(this, options);
}

  stdin() {
    return this.results[this.idx++];
  }
}

async function evaluatePython() {
  let pyodide = await pyodideReadyPromise;
  try {
    setStatus("Wait...");
    setTimeout(function() {
    pyodide.globals.set("c1", 'Place here a result!');
    pyodide.globals.set("c0", 'Place here a result!');
    let userOutput = pyodide.runPython(userCode.value);
    let testOutput = pyodide.runPython(testCode.value);
    addToOutput(testOutput);
    addToOutput2(userOutput);
    setStatus("Ready!");
    }, 40);

  } catch (err) {
    addToOutput(err);
  }
}
</script>

