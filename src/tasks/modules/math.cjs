/*
Создайте src/tasks/modules/math.cjs — CommonJS:

Экспортируйте функции add, subtract, multiply.
Используйте module.exports.
*/

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

module.exports = {
    add,
    subtract,
    multiply
};