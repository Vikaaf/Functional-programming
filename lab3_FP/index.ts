const numbersArray: number[] = [1, 4, 56, 11, 44, 3, 78, 34, 67, 46, 100]

//Функция, которая принимает массив чисел и возвращает новый массив, содержащий только числа, кратные заданному числу
const multipleArray = (array: number[], divider: number): number[] =>
    array.filter(number => number % divider === 0);

console.log(multipleArray(numbersArray, 4));

const stringArray: string[] = ["Всем", "добра", "и", "хорошего", "настроения)"];

//Функция, которая принимает массив строк и возвращает новую строку, содержащую все строки, объединенные заданным разделителем
function textMessage (array: string[], separator: string): string {
    if (array.length === 0) {
        return "";
    }
    return array.join(separator);
}

console.log(textMessage(stringArray, " "));


interface Student {
    name: string;
    age?: number;
    city?: string;
}

const studentsArray: Student[] = [{name: "Masha", age: 20, city: "Moscow"}, {name: "Barbi", city: "Moscow"}, {name: "Ken", age: 25}]

//Функция, которая принимает массив объектов и возвращает новый массив, отсортированный по значению определенного свойства
function sortStudents <T>(objects: T[], property: keyof T): T[] {
    return [...objects].sort((a, b) => {
            const propertyA = a[property];
            const propertyB = b[property];

            //Отрицательное число: a должен быть перед b
            //Положительное число: b должен быть перед a
            // Ноль: порядок не важен
            if (propertyA === undefined && propertyB === undefined) return 0;
            if (propertyA === undefined) return 1;
            if (propertyB === undefined) return -1;
            if (propertyA < propertyB) return -1;
            if (propertyA > propertyB) return 1;
            return 0;
        });
}

console.log(sortStudents(studentsArray, 'age'))
console.log(sortStudents(studentsArray, 'name'))


//функция, которая принимает другую функцию в качестве аргумента и возвращает новую функцию,
// которая выполняет логирование перед вызовом исходной функции

function funcLogging<T extends Function> (func: T): T {
    return function(...args: any[]): any {
        console.log('--- Начало функции ---');
        console.log('Функция:', (func as any).name || 'без имени');
        console.log('Аргументы:', args);

        try {
            const result = func(...args); //оригинальная функцию
            console.log('Успешно! Результат:', result);
            return result;

        } catch (error) {
            console.log('Ошибка:', error);
            throw error;

        } finally {
            console.log('--- Конец функции ---');
        }
    }as unknown as T;
}
const loggingMultipleArray = funcLogging(multipleArray);
const result1 = loggingMultipleArray(numbersArray, 4);
console.log('Итог:', result1);

const loggingTextMessage = funcLogging(textMessage);
const result2 = loggingTextMessage(stringArray, "/");
console.log('Итог:', result2);

const loggingSortArray = funcLogging(sortStudents);
const result3 = loggingSortArray(studentsArray, 'age');
console.log('Итог:', result3);

