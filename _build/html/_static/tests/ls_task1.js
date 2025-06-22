
(() => {

/*  Название модуля тестирования. 
    Должно строго совпадать с атрибутом module-name тега python-editor
*/
const module_name = "ls_task1";
let editor = editor_create(module_name);


/* 
    Предопределенный код в редакторе. Ели редактор предполагается пустым, можно не вызывать это функцию.
    Код должен быть в обратных кавычках, чтобы сохранилось его выравнивание 
*/
editor_set_string(editor, 
`import numpy as np
from scipy.linalg import solve

# Исходные данные
X = np.array([22, 19, 11, 7, 13, 20, 8, 12, 15, 23])
Y = np.array([45, 42, 23, 23, 23, 39, 19, 21, 28, 65])
n = len(X)

# Продолжите...
`);


/*
    Функция-callback, вызывается при нажатии кнопки Run
*/
function OnClickRun() 
{
    /* Очищаем окно вывода */
    editor_output_clear(editor);

    let result = editor_run_python(editor);
    if(result.hasError)
    {
        editor_output_add_line(editor, "При выполении кода произошла ошибка:");
        editor_output_add_line(editor, result.out);
        return;
    }

    if(editor.stdout.length == 0)
    {
        editor_output_add_line(editor, "Пользователь не вывел результат!");
        return;
    }

    let numbers = editor.stdout[0].trim().split(/\s+/);

    var c1 = -1.6594594594594867;
    var c2 = 2.2972972972972987;
    if(numbers.length == 2)
    {
        if( Math.abs(c1 - parseFloat(numbers[0])) < 0.0003 && 
            Math.abs(c2 - parseFloat(numbers[1])) < 0.0003)
        {
            editor_output_add_line(editor, `Результат верный!\nc1 = ${c1}\nc2 = ${c2}`);
            return;
        }
    }

    editor_output_add_line(editor, "Результат неверный!");
};


/*
    Регистрация callback-функции OnClickkRun
*/
editor_register_run_callback(editor, OnClickRun);






})();




















/*

import numpy as np
from scipy.linalg import solve


# Исходные данные
X = np.array([22, 19, 11, 7, 13, 20, 8, 12, 15, 23])
Y = np.array([45, 42, 23, 23, 23, 39, 19, 21, 28, 65])
n = len(X)

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
print(f"{c0} {c1}")

*/
