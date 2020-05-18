let buttons = document.querySelectorAll('button');
let resultsScreen = document.querySelector('.results');

let numberToDisplay = "0";
resultsScreen.textContent = numberToDisplay;

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

    if (buttonID === "function-backspace") {
        if (lastButtonPressed === "operator-equals") {
            return;
        } else {
            numbersToCalculate[activeNumber()] = numbersToCalculate[activeNumber()].slice(0, -1);
        };
    }
    
    /* if button pressed is equals sign (=) */
    if (buttonID === "operator-equals") {
        if (lastButtonPressed === "operator-equals") {
            numbersToCalculate["firstNumber"] = `${operate(lastOperation["lastOperator"], numbersToCalculate["firstNumber"], lastOperation["lastNumber"])}`;
        } else {
            if (numbersToCalculate["secondNumber"] === "") {
                lastOperation["lastNumber"] = numbersToCalculate["firstNumber"];
            } else {
                lastOperation["lastNumber"] = numbersToCalculate["secondNumber"];
            };
            numbersToCalculate["firstNumber"] = `${operate(numbersToCalculate["workingOperator"], numbersToCalculate["firstNumber"], numbersToCalculate["secondNumber"])}`;
            lastOperation["lastOperator"] = numbersToCalculate["workingOperator"];
            numbersToCalculate["workingOperator"] = "";
            numbersToCalculate["secondNumber"] = "";
        };
    };

    /* if the button pressed is a digit, decimal, or the negative/positive */
    if (digitInput.hasOwnProperty(buttonID)) {
        if (buttonID === "digit-negative") {
            numbersToCalculate[activeNumber()] = addOrRemoveNegative(numbersToCalculate[activeNumber()]);
        } else {
            if (lastButtonPressed === "operator-equals") { /* if the last button pressed was "=", we're editing from scratch again, not appending digits */
                numbersToCalculate[activeNumber()] = digitInput[buttonID];
            } else if (buttonID === "digit-decimal" && numbersToCalculate[activeNumber()].includes(".")) {
                return; // if the activeNumber already has a decimal in it and decimal is hit again, don't add another decimal - exit function
            } else {
                numbersToCalculate[activeNumber()] = adjustZeroes(numbersToCalculate[activeNumber()] += digitInput[buttonID]);
            };
            
        };
    };

    /* if the button pressed is an operator (+, -, *, /) */
    if (operatorInput.hasOwnProperty(buttonID)) {
        if (firstNumberEditable()) {
            numbersToCalculate["workingOperator"] = operatorInput[buttonID]; /* if there is no operator, assign as operator */
        } else {
            if (operatorInput.hasOwnProperty(lastButtonPressed)) {
                numbersToCalculate["workingOperator"] = operatorInput[buttonID]; /* if there is an operator that was just added, overwrite it.  Example: 2 + - 1 = 1, not 3 */
            } else { /* if there is an operator, complete the calculation and assign result to firstNumber, then assign new operator */
                numbersToCalculate["firstNumber"] = `${operate(numbersToCalculate["workingOperator"], numbersToCalculate["firstNumber"], numbersToCalculate["secondNumber"])}`;
                numbersToCalculate["workingOperator"] = operatorInput[buttonID];
                numbersToCalculate["secondNumber"] = "";
            };
        };
    }

    numberToDisplay = numbersToCalculate["secondNumber"] || numbersToCalculate["firstNumber"] || "0";

    resultsScreen.textContent = numberToDisplay;

    /* remove NaN values before the next calculation */
    checkForErrors;
    
    lastButtonPressed = buttonID;
}

function checkForErrors() {
    if (isNaN(numbersToCalculate["firstNumber"]) || isNaN(numbersToCalculate["secondNumber"])) {
        clearNumbersToCalculate();
    };
}

function firstNumberEditable() { // Checks if operator is empty, which tells us if we're editing the firstNumber (true) or secondNumber (false)
    return numbersToCalculate["workingOperator"] === "";
}

function activeNumber() { // Determines which number in numbersToCalculate we're currently editing
    if (firstNumberEditable()) {
        return "firstNumber";
    } else {
        return "secondNumber";
    };
}

function addOrRemoveNegative(string) {
    if (string[0] === "-") {
        return string.slice(1); // if first letter is negative, remove the negative
    } else {
        return addZeroes(`-${string}`); // otherwise add the negative
    };
}

function addZeroes(num) { // Prevent NaN errors if input is only a negative sign or decimal
    let acceptedDigits = {
        "-": "-0",
        ".": "0.",
    };

    return acceptedDigits[num] || num;
}

function adjustZeroes(number) {
    // while (number[0] === "0" && number[1] === "0") { // as long as the first and second digits are zero
    //     number = number.slice(1); // remove the first 0
    // };

    if (number[0] === "0" && number[1] !== "." && number.length > 1) { // prevents something like "0200", allows "0.0200"
        number = number.slice(1);
    }; 

    if (number[0] === "-" && number[1] === "0" && number.length > 2) { // turns something like "-02" into "-2"
        number = number.slice(0, 1) + number.slice(2); 
    }

    return addZeroes(number);
}

function clearNumbersToCalculate() {
    for (key in numbersToCalculate) {
        numbersToCalculate[key] = "";
    };
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
    };
}

function operate(operator, num1, num2) {
    const operators = {
        "+": add,
        "-": subtract,
        "*": multiply,
        "/": divide,
    };

    return operators[operator](num1, num2);
}