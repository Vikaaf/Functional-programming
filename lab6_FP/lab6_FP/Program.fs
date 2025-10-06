open System

//printf - в консоль, sprintf - вернет строку
//"%d" 42 - 42, "%5d" 42 - 5 символов, "%.0f" - знаки после запятой, при 0 округление, "%s" - для строк

//Метаматические операции

let summ x y = x + y

let subtract x y = x - y

let multiply x y = x * y

let divide x y = 
    if y = 0.0 then Error "На ноль не дели, пожалуйста" else Ok (x / y)

let power x y = Math.Pow(x, y)

let squareRoot x = 
    if x < 0.0 then Error "Упс.. Отрицательное число под корнем" else Ok (Math.Sqrt(x))

let sin deg = Math.Sin(deg * Math.PI / 180.0)
let cos deg = Math.Cos(deg * Math.PI / 180.0)
let tan deg = Math.Tan(deg * Math.PI / 180.0)


// Функция для нахождения НОД (алгоритм Евклида)
let rec nod a b =
    if b = 0L then abs a //если b = 0
    else nod b (a % b)

// Функция для сокращения дроби
let reduceFraction (numerator: int64) (denominator: int64) =
    if denominator = 0L then Error "Упс..Знаменатель не может быть 0"
    else
        let divisor = nod numerator denominator
        let reducedNum = numerator / divisor
        let reducedDen = denominator / divisor
        if reducedDen < 0L then
            Ok (-reducedNum, -reducedDen)
        else
            Ok (reducedNum, reducedDen)


// Функция для преобразования строки в число (дробь или десятичное)
let parseNumber (input: string) =
    let input = input.Trim()
    
    match Double.TryParse(input) with
    | (true, num) -> Some (float num)
    | _ -> 
      
        let parts = input.Split('/')
        if parts.Length = 2 then
            match Int64.TryParse(parts.[0].Trim()), Int64.TryParse(parts.[1].Trim()) with
            | (true, num), (true, den) ->
                if den = 0L then
                    printfn "Упс..Знаменател 0("
                    None
                else
                    match reduceFraction num den with
                    | Ok (reducedNum, reducedDen) ->
                        if reducedDen = 1L then
                            Some (float reducedNum)
                        else
                            Some (float reducedNum / float reducedDen)
                    | Error msg -> 
                        printfn "%s" msg
                        None
            | _ -> 
                printfn "Неверный формат дроби"
                None
        else
            printfn "Введите число в формате 1.1 или 1/1"
            None


// Функция преобразования десятичного в обыкновенную дробь для записи "0.2 или 1/5"
let formatResult (value: float) =
    
    if value % 1.0 = 0.0 then //является ли число целым
        sprintf "%.0f" value
    else
        let precision = 1e-8 //мин число, для сравнения
        let rec findFraction denominator maxDenominator =
            if denominator > maxDenominator then None
            else
                let numerator = round (value * float denominator)  //0,2 * на знаменатель
                if abs (value - numerator / float denominator) < precision then  //0,2 - (0,2 * на знаменатель)/знам макс приближено
                    match reduceFraction (int64 numerator) denominator with //нашли! сокращаем
                    | Ok (num, den) -> Some (num, den)
                    | Error _ -> None
                else
                    findFraction (denominator + 1L) maxDenominator
        
        match findFraction 1L 1000L with //перебор от 1 до 1000
        | Some (num, den) when den <> 1L ->  //если результат числитель/знаменатель и знам не равен 1
            sprintf "%.4f или %d/%d" value num den //вывести запись
        | _ ->
            sprintf "%.4f" value //иначе только дес дробь

let resultToString successMsg = function  //вывод строкового ответа
    | Ok value -> 
        let formatted = formatResult value
        sprintf "%s: %s" successMsg formatted
    | Error msg -> sprintf "Ошибка: %s" msg




//Интерфейс
let menu () =
    Console.Clear()
    printfn "Калькулятор. Выберите действие:"
    printfn "┌─────────────────┬─────────────────┬─────────────────┐"
    printfn "│ 1 - Сложение    │ 5 - Степень     │ 7 - Синус       │"
    printfn "│ 2 - Вычитание   │ 6 - Корень      │ 8 - Косинус     │"
    printfn "│ 3 - Умножение   │ 0 - Выход       │ 9 - Тангенс     │"
    printfn "│ 4 - Деление     │                 │                 │"
    printfn "└─────────────────┴─────────────────┴─────────────────┘"
    printfn ""
    printfn "Форматы ввода: 1, 1,1 или 1/1"
    printf "Выберите действие: "



let getNumber operation = //получаем либо дес число либо дробь
    printf "%s" operation
    parseNumber (Console.ReadLine())



//После выбора действия - обработка действия

//1
let summition () =
    match getNumber "Первое число: ", getNumber "Второе число: " with
    | Some a, Some b -> 
        summ a b |> formatResult |> sprintf "Результат: %s" |> printfn "%s"
    | _ -> ()

//2
let subtraction () =
    match getNumber "Первое число: ", getNumber "Второе число: " with
    | Some a, Some b -> 
        subtract a b |> formatResult |> sprintf "Результат: %s" |> printfn "%s"
    | _ -> ()

//3
let multiplication () =
    match getNumber "Первое число: ", getNumber "Второе число: " with
    | Some a, Some b -> 
        multiply a b |> formatResult |> sprintf "Результат: %s" |> printfn "%s"
    | _ -> ()

//4
let division () =
    match getNumber "Делимое: ", getNumber "Делитель: " with
    | Some a, Some b -> 
        divide a b |> resultToString "Результат" |> printfn "%s"
    | _ -> ()

//5
let pPower () =
    match getNumber "Основание: ", getNumber "Показатель: " with
    | Some a, Some b -> 
        power a b |> formatResult |> sprintf "Результат: %s" |> printfn "%s"
    | _ -> ()

//6
let sSquareRoot () =
    match getNumber "Число: " with
    | Some x -> 
        squareRoot x |> resultToString "Квадратный корень" |> printfn "%s"
    | _ -> ()

//7-9
let trigonometric operation name =
    match getNumber "Угол в градусах: " with
    | Some degrees -> 
        operation degrees |> formatResult |> sprintf "%s: %s" name |> printfn "%s"
    | _ -> ()



//Пользователь вводит действие
let rec menuInput () =
    menu ()
    let input = Console.ReadLine()
    
    match input with
    | "1" -> summition (); waitForContinue ()
    | "2" -> subtraction (); waitForContinue ()
    | "3" -> multiplication (); waitForContinue ()
    | "4" -> division (); waitForContinue ()
    | "5" -> pPower (); waitForContinue ()
    | "6" -> sSquareRoot (); waitForContinue ()
    | "7" -> trigonometric sin "Синус"; waitForContinue ()
    | "8" -> trigonometric cos "Косинус"; waitForContinue ()
    | "9" -> trigonometric tan "Тангенс"; waitForContinue ()
    | "0" -> 
        printfn "Пон"
        Environment.Exit(0)
    | _ -> 
        printfn "Неверный выбор!"
        waitForContinue ()

and waitForContinue () =
    printfn "\nПродолжаем?) Нажми любую клавишу"
    Console.ReadKey() |> ignore
    menuInput ()

[<EntryPoint>]
let main argv =
    printfn "Добро пожаловать в калькулятор!"
    menuInput ()
    0