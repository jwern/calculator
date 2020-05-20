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

let lastOperation = { // Used for equations with multiple equals in a row, or no secondNumber given
    lastNumber: "",
    lastOperator: "",
}

buttons.forEach(button => button.addEventListener('click', translateButtonToID));
document.addEventListener('keydown', translateKeyToID);

function translateKeyToID(key) { // keyboard input
    const keyInput = {
        "1": "digit-1",
        "2": "digit-2",
        "3": "digit-3",
        "4": "digit-4",
        "5": "digit-5",
        "6": "digit-6",
        "7": "digit-7",
        "8": "digit-8",
        "9": "digit-9",
        "0": "digit-0",
        ".": "digit-decimal",
        "+": "operator-plus",
        "*": "operator-multiply",
        "/": "operator-divide",
        "=": "operator-equals",
        "Enter": "operator-equals",
        "Backspace": "function-backspace",
        "Escape": "function-clear",
    };

    const keyCodeInput = {
        173: "digit-negative", // the minus on underscore key
        109: "operator-minus", // the minus on numpad
    }

    if (key.key === "Enter") { // prevents Enter key from submitting operation twice
        key.preventDefault();
    };
    
    if (keyInput[key.key] || keyCodeInput[key.keyCode]) { // only use valid keys, break if invalid (like "e" etc.)
        displayButton(keyInput[key.key] || keyCodeInput[key.keyCode]);
    } else {
        return;
    };
}

function translateButtonToID(button) { // button/click input
    displayButton(button.target.id);
}

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
    };

    const operatorInput = {
        "operator-divide": "/",
        "operator-multiply": "*",
        "operator-plus": "+",
        "operator-minus": "-",
    };

    let buttonID = button;

    /* if button pressed is Clear, delete all previous inputs */
    if (buttonID === "function-clear") {
        clearNumbersToCalculate();
    }

    /* if button pressed is Backspace, remove the last character in the active number */
    if (buttonID === "function-backspace") {
        if (lastButtonPressed === "operator-equals") { // if the last button pressed was "=", we don't want to backspace on that result
            return;
        } else {
            numbersToCalculate[activeNumber()] = numbersToCalculate[activeNumber()].slice(0, -1);
        };
    }
    
    /* if button pressed is equals sign (=) */
    if (buttonID === "operator-equals") {
        if (lastButtonPressed === "operator-equals") { // e.g. someone presses "2 + 2 = = = " we want to show "4, 6, 8"
            numbersToCalculate["firstNumber"] = `${operate(lastOperation["lastOperator"], numbersToCalculate["firstNumber"], lastOperation["lastNumber"])}`;
        } else {
            if (numbersToCalculate["secondNumber"] === emptyString()) { // store lastNumber in case the user hits equals again
                lastOperation["lastNumber"] = numbersToCalculate["firstNumber"];
            } else {
                lastOperation["lastNumber"] = numbersToCalculate["secondNumber"];
            };
            /* complete the equation and assign the result to firstNumber; 
            the operator to lastOperator (in case the uer hits equals again); 
            then clear workingOperator and secondNumber. */
            numbersToCalculate["firstNumber"] = `${operate(numbersToCalculate["workingOperator"], numbersToCalculate["firstNumber"], numbersToCalculate["secondNumber"])}`;
            lastOperation["lastOperator"] = numbersToCalculate["workingOperator"];
            numbersToCalculate["workingOperator"] = emptyString();
            numbersToCalculate["secondNumber"] = emptyString();
        };
    };

    /* if the button pressed is a digit, decimal, or the negative/positive */
    if (digitInput.hasOwnProperty(buttonID)) {
        if (buttonID === "digit-negative") {
            numbersToCalculate[activeNumber()] = addOrRemoveNegative(numbersToCalculate[activeNumber()]);
        } else {
            if (lastButtonPressed === "operator-equals") { // if the last button pressed was "=", we're editing from scratch again, not appending digits
                numbersToCalculate[activeNumber()] = adjustZeroes(digitInput[buttonID]);
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
            numbersToCalculate["workingOperator"] = operatorInput[buttonID]; // if there is no operator, assign as operator
        } else {
            if (operatorInput.hasOwnProperty(lastButtonPressed)) {
                numbersToCalculate["workingOperator"] = operatorInput[buttonID]; // if there is an operator that was just added, overwrite it.  Example: "2 + - 1 =" is 1, not 3
            } else { // if there is an operator and last button was not an operator, complete the calculation and assign result to firstNumber, then assign new operator.
                numbersToCalculate["firstNumber"] = `${operate(numbersToCalculate["workingOperator"], numbersToCalculate["firstNumber"], numbersToCalculate["secondNumber"])}`;
                numbersToCalculate["workingOperator"] = operatorInput[buttonID];
                numbersToCalculate["secondNumber"] = emptyString();
            };
        };
    }

    numberToDisplay = numbersToCalculate["secondNumber"] || numbersToCalculate["firstNumber"] || "0";

    resultsScreen.textContent = numberToDisplay;

    /* remove NaN values before the next calculation */
    checkForErrors();
    
    lastButtonPressed = buttonID;
}

/* Functions to determine current numbers */

function firstNumberEditable() { // Checks if operator is empty, which tells us if we're editing the firstNumber (true) or secondNumber (false)
    return numbersToCalculate["workingOperator"] === emptyString();
}

function activeNumber() { // Determines which number in numbersToCalculate we're currently editing
    if (firstNumberEditable()) {
        return "firstNumber";
    } else {
        return "secondNumber";
    };
}

/* Functions to adjust for zeroes, negatives, or decimals */

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
    if (number[0] === "0" && number[1] !== "." && number.length > 1) { // prevents something like "0200", allows "0.0200"
        number = number.slice(1);
    }; 

    if (number[0] === "-" && number[1] === "0" && number.length > 2) { // turns something like "-02" into "-2"
        number = number.slice(0, 1) + number.slice(2); 
    }

    return addZeroes(number);
}

/* Functions to clear variables */

function emptyString() {
    return "";
}

function clearNumbersToCalculate() {
    for (key in numbersToCalculate) {
        numbersToCalculate[key] = emptyString();
    };
}

function checkForErrors() {
    if (isNaN(numbersToCalculate["firstNumber"]) || isNaN(numbersToCalculate["secondNumber"])) {
        clearNumbersToCalculate();
    };
}

/* Functions for math operations*/

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

    if (operator === emptyString()) {
        return Number(num2 || num1);
    };

    return operators[operator](num1, num2);
}