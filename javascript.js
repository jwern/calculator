let buttons = document.querySelectorAll('button');
let resultsScreen = document.querySelector('.results');
resultsScreen.textContent = "0";
let numbersToCalculate = {
    firstNumber: "",
    workingOperator: "",
    secondNumber: "",
};
let lastButtonPressed = ""; // Updated at the very end of displayButton function so you can refer to it anytime before then
let lastOperation = {
    lastNumber: "",
    lastOperator: "",
}
let numberToDisplay = "";

buttons.forEach(button => button.addEventListener('click', displayButton));

function displayButton(button) {
    const digitInput = {
        "digit-1": "1",
        "digit-2": "2",
        "digit-3": "3",
        "digit-4": "4",
        "digit-5": "5",
        "digit-6": "6",
        "digit-7": "7",
        "digit-8": "8",
        "digit-9": "9",
        "digit-0": "0",
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

    /* if button pressed is Clear, delete all previous inputs */
    if (buttonID === "function-clear") {
        clearNumbersToCalculate();
    }

    /* if button pressed is equals sign (=), perform the operation and assign to firstNumber */
    if (buttonID === "operator-equals" && lastButtonPressed === "operator-equals") {
        numbersToCalculate["firstNumber"] = `${operate(lastOperation["lastOperator"], numbersToCalculate["firstNumber"], lastOperation["lastNumber"])}`;
    } else if (buttonID === "operator-equals") {
        numbersToCalculate["firstNumber"] = `${operate(numbersToCalculate["workingOperator"], numbersToCalculate["firstNumber"], numbersToCalculate["secondNumber"])}`;
        lastOperation["lastNumber"] = numbersToCalculate["secondNumber"];
        lastOperation["lastOperator"] = numbersToCalculate["workingOperator"];
        numbersToCalculate["workingOperator"] = "";
        numbersToCalculate["secondNumber"] = "";
    }

    /* if the button pressed is a digit, decimal, or the negative/positive */
    if (digitInput.hasOwnProperty(buttonID)) {
        if (buttonID === "digit-negative" && firstNumberEditable()) {
            numbersToCalculate["firstNumber"] = addOrRemoveNegative(numbersToCalculate["firstNumber"]);
        } else if (buttonID === "digit-negative" && !firstNumberEditable()) {
            numbersToCalculate["secondNumber"] = addOrRemoveNegative(numbersToCalculate["secondNumber"]);
        } else if (firstNumberEditable() && lastButtonPressed !== "operator-equals") {
            numbersToCalculate["firstNumber"] += digitInput[buttonID]; /* if there is no operator, we're still adding digits to the first number */
        } else if (firstNumberEditable() && lastButtonPressed === "operator-equals") {
            numbersToCalculate["firstNumber"] = digitInput[buttonID];
        } else if (!firstNumberEditable()) {
            numbersToCalculate["secondNumber"] += digitInput[buttonID]; /* if there IS an operator, add digits to the second number */
        };
    };

    /* if the button pressed is an operator (+, -, *, /) */
    if (operatorInput.hasOwnProperty(buttonID)) {
        if (firstNumberEditable()) {
            numbersToCalculate["workingOperator"] = operatorInput[buttonID]; /* if there is no operator, assign as operator */
        } else if (!firstNumberEditable() && operatorInput.hasOwnProperty(lastButtonPressed)) {
            numbersToCalculate["workingOperator"] = operatorInput[buttonID]; /* if there is an operator that was just added, overwrite it.  Example: 2 + - 1 = 1, not 3 */
        } else if (!firstNumberEditable()) { /* if there is an operator, complete the calculation and assign result to firstNumber, then assign new operator */
            numbersToCalculate["firstNumber"] = `${operate(numbersToCalculate["workingOperator"], numbersToCalculate["firstNumber"], numbersToCalculate["secondNumber"])}`;
            numbersToCalculate["workingOperator"] = operatorInput[buttonID];
            numbersToCalculate["secondNumber"] = "";
        };
    }

    numberToDisplay = removeLeadingZeroes(numbersToCalculate["secondNumber"] || numbersToCalculate["firstNumber"] || 0);
    
    resultsScreen.textContent = numberToDisplay;

    /* remove error or NaN values before the next calculation */
    /* do not remove singular negative sign */
    /* this "works" but may be preferred to try to keep the number from before the error */
    if (isNaN(numbersToCalculate["firstNumber"]) || isNaN(numbersToCalculate["secondNumber"])) {
        if (numbersToCalculate["firstNumber"] !== "-" && numbersToCalculate["secondNumber"] !== "-") {
            clearNumbersToCalculate();
        }
    }

    lastButtonPressed = buttonID;
}

function firstNumberEditable() { // Checks if operator is empty, which tells us if we're editing the firstNumber (true) or secondNumber (false)
    return numbersToCalculate["workingOperator"] === "";
}

function addOrRemoveNegative(string) {
    if (string[0] === "-") {
        return string.slice(1);
    } else {
        return `-${string}`;
    };
}

function removeLeadingZeroes(number) {
    while (number[0] === "0" && number.length > 1) {
        number = number.slice(1);
    }

    return number;
}

function clearNumbersToCalculate() {
    numbersToCalculate["firstNumber"] = "";
    numbersToCalculate["workingOperator"] = "";
    numbersToCalculate["secondNumber"] = "";
}

function add(num1, num2) { 
    return Number(num1) + Number(num2 || num1);
}

function subtract(num1, num2) {
    return Number(num1) - Number(num2 || num1);
}

function multiply(num1, num2) {
    return Number(num1) * Number(num2 || num1);
}

function divide(num1, num2) {
    if (num2 === "0") {
        return "Can't divide by 0";
    } else {
        return Number(num1) / Number(num2 || num1);
    }
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