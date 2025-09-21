document.addEventListener('DOMContentLoaded', () => {
    let currentOperand = '';
    let previousOperand = '';
    let operation = null;
    let screenBehavior = false;
    let fractionInput = false;
    //МАТЕМАТИЧЕСКИЕ ОПЕРАЦИИ
    // Функция для преобразования строки-дроби в десятичное число number
    const toNumberFraction = (fractionStr) => {
        if (fractionStr === '' || fractionStr === '-')
            return null;
        const isNegative = fractionStr.startsWith('-');
        const cleanStr = isNegative ? fractionStr.slice(1) : fractionStr;
        if (!cleanStr.includes('/')) {
            const num = parseFloat(cleanStr);
            return isNaN(num) ? null : (isNegative ? -num : num);
        }
        const parts = cleanStr.split('/');
        if (parts.length !== 2)
            return null;
        const numerator = parseFloat(parts[0].trim());
        const denominator = parseFloat(parts[1].trim());
        if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
            return null;
        }
        const result = numerator / denominator;
        return isNegative ? -result : result;
    };
    // Функция для преобразования числа в дробь
    const toFraction = (decimal) => {
        if (!isFinite(decimal)) {
            return 'Ошибка';
        }
        const isNegative = decimal < 0;
        const absDecimal = Math.abs(decimal);
        if (absDecimal % 1 === 0) {
            return isNegative ? `-${absDecimal}` : absDecimal.toString();
        }
        const precision = 1000000;
        let numerator = Math.round(absDecimal * precision);
        let denominator = precision;
        // Сокращение дроби
        const reduction = (a, b) => {
            return b === 0 ? a : reduction(b, a % b);
        };
        const divisor = reduction(numerator, denominator);
        numerator /= divisor;
        denominator /= divisor;
        return `${isNegative ? '-' : ''}${numerator}/${denominator}`;
    };
    // Функция для вычисления факториала
    const factorial = (n) => {
        if (n < 0)
            return NaN;
        if (n === 0 || n === 1)
            return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    };
    //ФУНКЦИИ ДЛЯ КНОПОК
    // функция для =
    const calculate = () => {
        if (operation === null || screenBehavior)
            return;
        const prev = toNumberFraction(previousOperand);
        const current = toNumberFraction(currentOperand);
        if (prev === null || current === null || isNaN(prev) || isNaN(current)) {
            currentOperand = 'Ошибка';
            updateUI();
            return;
        }
        let result;
        switch (operation) {
            case '+':
                result = prev + current;
                break;
            case '–':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '/':
                result = current !== 0 ? prev / current : NaN;
                break;
            case '%':
                result = prev % current;
                break;
            case '^':
                result = Math.pow(prev, current);
                break;
            default:
                return;
        }
        if (isNaN(result)) {
            currentOperand = 'Ошибка';
        }
        else {
            currentOperand = toFraction(result);
        }
        operation = null;
        screenBehavior = true;
        fractionInput = false;
        updateUI();
    };
    //функция для С
    const clear = () => {
        currentOperand = '';
        previousOperand = '';
        operation = null;
        screenBehavior = false;
        fractionInput = false;
        updateUI();
    };
    //функция для +/-
    const changeSign = () => {
        if (currentOperand === '' || currentOperand === '0')
            return;
        if (currentOperand.startsWith('-')) {
            currentOperand = currentOperand.slice(1);
        }
        else {
            currentOperand = '-' + currentOperand;
        }
        updateUI();
    };
    const handleOperation = (op) => {
        if (operation !== null) {
            calculate();
        }
        previousOperand = currentOperand;
        operation = op;
        screenBehavior = true;
        fractionInput = false;
    };
    //продолжить писать выражение или очистить экран
    const continueWriting = (number) => {
        if (screenBehavior) {
            currentOperand = '';
            screenBehavior = false;
            fractionInput = false;
        }
        if (fractionInput) {
            if (currentOperand.includes('/')) {
                const parts = currentOperand.split('/');
                currentOperand = parts[0] + '/' + parts[1] + number;
            }
        }
        else {
            currentOperand += number;
        }
        updateUI();
    };
    //числа с плавающей запятой
    const appendDecimal = () => {
        if (screenBehavior) {
            currentOperand = '';
            screenBehavior = false;
            fractionInput = false;
        }
        if (fractionInput) {
            if (currentOperand.includes('/')) {
                const parts = currentOperand.split('/');
                if (parts[1].indexOf('.') === -1) {
                    currentOperand = parts[0] + '/' + parts[1] + '.';
                }
            }
        }
        else {
            if (currentOperand.indexOf('.') === -1) {
                currentOperand += currentOperand === '' ? '0.' : '.';
            }
        }
        updateUI();
    };
    // Функция для ввода дроби
    const inputFraction = () => {
        if (screenBehavior) {
            currentOperand = '';
            screenBehavior = false;
        }
        if (fractionInput) {
            fractionInput = false;
        }
        else {
            if (currentOperand === '' || currentOperand === '-') {
                currentOperand = currentOperand === '-' ? '-0/' : '0/';
            }
            else if (!currentOperand.includes('/')) {
                currentOperand += '/';
            }
            fractionInput = true;
        }
        updateUI();
    };
    // Функция для вычисления квадратного корня
    const calculateSquareRoot = () => {
        const numberValue = toNumberFraction(currentOperand);
        if (numberValue !== null && numberValue >= 0) {
            const result = Math.sqrt(numberValue);
            currentOperand = toFraction(result);
            screenBehavior = true;
            updateUI();
        }
        else {
            currentOperand = 'Ошибка';
            updateUI();
        }
    };
    // Функция для вычисления степени
    const calculatePower = () => {
        if (currentOperand !== '') {
            previousOperand = currentOperand;
            currentOperand = '';
            operation = '^';
            screenBehavior = true;
        }
    };
    // Функция для вычисления факториала
    const calculateFactorial = () => {
        const numberValue = toNumberFraction(currentOperand);
        if (numberValue !== null && numberValue >= 0 && Number.isInteger(numberValue)) {
            const result = factorial(numberValue);
            currentOperand = result.toString();
            screenBehavior = true;
            updateUI();
        }
        else {
            currentOperand = 'Ошибка';
            updateUI();
        }
    };
    // Функция для вычисления десятичного логарифма
    const calculateLog10 = () => {
        const numberValue = toNumberFraction(currentOperand);
        if (numberValue !== null && numberValue > 0) {
            const result = Math.log10(numberValue);
            currentOperand = toFraction(result);
            screenBehavior = true;
            updateUI();
        }
        else {
            currentOperand = 'Ошибка';
            updateUI();
        }
    };
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent;
            const buttonHTML = button.innerHTML;
            if (!buttonText)
                return;
            // Очистка дисплея
            if (buttonText === 'C') {
                clear();
                return;
            }
            // Вычисление результата
            if (buttonText === '=') {
                calculate();
                return;
            }
            // Обработка ввода минуса (для отрицательных чисел)
            if (buttonText === '-') {
                if (currentOperand === '' || currentOperand === '0') {
                    currentOperand = '-';
                }
                else if (currentOperand.startsWith('-')) {
                    currentOperand = currentOperand.slice(1);
                }
                else {
                    currentOperand = '-' + currentOperand;
                }
                updateUI();
                return;
            }
            // Обработка операций
            if (buttonText === '+' || buttonText === '–' || buttonText === '×' || buttonText === '/' || buttonText === '%' || buttonText === '^') {
                handleOperation(buttonText);
                return;
            }
            // Добавление цифр
            if (/^\d$/.test(buttonText)) {
                continueWriting(buttonText);
                return;
            }
            // Добавление десятичной точки
            if (buttonText === ',') {
                appendDecimal();
                return;
            }
            // Смена знака
            if (buttonText === '+/-') {
                changeSign();
                return;
            }
            // обработка кнопки дроби
            if (buttonText === 'a/b') {
                inputFraction();
                return;
            }
            // Квадратный корень
            if (buttonText === '√x') {
                calculateSquareRoot();
                return;
            }
            // Степень
            if (buttonText === 'a^b' || (buttonHTML && buttonHTML.includes('sup')) || buttonText === 'aᵇ') {
                calculatePower();
                return;
            }
            // Факториал
            if (buttonText === 'x!') {
                calculateFactorial();
                return;
            }
            // Десятичный логарифм
            if (buttonText === 'lg') {
                calculateLog10();
                return;
            }
        });
    });
    //обновляем дисплей
    const updateUI = () => {
        if (display) {
            display.textContent = currentOperand || '0';
        }
    };
});
//# sourceMappingURL=index.js.map