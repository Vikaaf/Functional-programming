
//1
const array = [1, 2, 3, 6, 9, 23, 56, 11, 5, 78];

//возвращает четные числа
const evenArray = array.filter(n => n % 2 === 0);
console.log(evenArray);

//возвращает квадраты чисел
const sgArray = array.map(n => n ** 2);
console.log(sgArray);


const student1 = {name: "Ivan", age: 21, city: "Moscow"};
const student2 = {name: "Mia", age: 25, city: "Bryansk"};
const student3 = {name: "Kate", age: 17, city: "Vladivostok"};
const student4 = {name: "Lena", age: 30, city: "Moscow"};

const students = [student1, student2, student3, student4];
//объекты с определенным свойством
const newStudents = students.filter(n => n.city === "Moscow");
console.log(newStudents);


//сумма
const summ = array.reduce((num1, num2) => num1 + num2, 0);
console.log(summ);


//2
//функция высшего порядка
function myHigherOrderFunction(f, arr) {
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
        newArr.push(f(arr[i])); //добавить элемент в массив
    }
    return newArr;
}

const plusTenFunction = numb => numb + 100; //функция f

console.log(myHigherOrderFunction(plusTenFunction, array));


//3
//сумма квадратов всех чётных чисел
const sumSquareEvenArray = array
    .filter(n => n % 2 === 0) //четные числа
    .map(n => n ** 2) //квадраты четных чисел
    .reduce((num1, num2) => num1 + num2, 0); //сумма

console.log(sumSquareEvenArray);

//среднее арифметическое всех чисел, больших заданного значения
const filtered = array.filter(n => n > 10);
const average = filtered
    .reduce((num1, num2) => (num1 + num2), 0)/filtered.length;

console.log(average);
