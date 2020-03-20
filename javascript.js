let buttons = document.querySelectorAll('button');
let resultsScreen = document.querySelector('.results');
let numbersToCalculate = {
    firstNumber: "",
    workingOperator: "",
    secondNumber: "",
};

buttons.forEach(button => button.addEventListener('click', displayButton));

function displayButton(button) {
    const digitInput = {
        "digit-1": 1,
        "digit-2": 2,
        "digit-3": 3,
        "digit-4": 4,
        "digit-5": 5,
        "digit-6": 6,
        "digit-7": 7,
        "digit-8": 8,
        "digit-9": 9,
        "digit-0": 0,
        "digit-decimal": ".",
        "digit-negative": "-",
    }

    const operatorInput = {
        "operator-divide": "/",
        "operator-multiply": "*",
        "operator-plus": "+",
        "operator-minus": "-",
    }

    let buttonID = button.target.id;

    if (digitInput.hasOwnProperty(buttonID)) {
        if (buttonID === "digit-negative") {
            console.log("work in progress"); /* need to append negative to current number */
        } else if (numbersToCalculate["workingOperator"] === "") {
            numbersToCalculate["firstNumber"] += digitInput[buttonID]; /* if there is no operator, we're still adding digits to the first number */
        } else if (numbersToCalculate["workingOperator"] !== "") {
            numbersToCalculate["secondNumber"] += digitInput[buttonID]; /* if there IS an operator, add digits to the second number */
        };
    };

    if (operatorInput.hasOwnProperty(buttonID)) {
        if (numbersToCalculate["workingOperator"] === "") {
            numbersToCalculate["workingOperator"] = operatorInput[buttonID];
        } else if (numbersToCalculate["workingOperator"] !== "") {
            console.log("work in progress"); /* need to return total from numbersToCalculate & assign that total to firstNumber */
        };
    }
    /* if we want to match the online-calculator example, we should only show the last number input before an operator (don't display the operator) */
    resultsScreen.textContent = `${numbersToCalculate["firstNumber"]} ${numbersToCalculate["workingOperator"]} ${numbersToCalculate["secondNumber"]}`

    // if (operatorInput.hasOwnProperty(button.target.id)) {

    // if (button.target.id === "function-clear") {
    //     resultsScreen.textContent = "";
    // } else if (button.target.id === "operator-equals") {
    //     resultsScreen.textContent = "" /* return result of operator */
    // } else {
    //     resultsScreen.textContent += (digitInput[button.target.id]);
    // };
}

function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function operate(operator, num1, num2) {
    const operators = {
        "+": add,
        "-": subtract,
        "*": multiply,
        "/": divide,
    }

    return operators[operator](num1, num2);
}