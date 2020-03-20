let buttons = document.querySelectorAll('button');
let resultsScreen = document.querySelector('.results');
let numbersToCalculate = {
    firstNumber: "",
    workingOperator: "",
    secondNumber: "",
};
let lastButtonPressed = "";

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

    console.log(buttonID);
    if (buttonID === "function-clear") {
        numbersToCalculate["firstNumber"] = "";
        numbersToCalculate["workingOperator"] = "";
        numbersToCalculate["secondNumber"] = "";
    }

    console.log("Before anything is called:", numbersToCalculate["firstNumber"]);
    console.log(numbersToCalculate["workingOperator"]);
    console.log(numbersToCalculate["secondNumber"]);

    if (buttonID === "operator-equals") {
        numbersToCalculate["firstNumber"] = `${operate(numbersToCalculate["workingOperator"], numbersToCalculate["firstNumber"], numbersToCalculate["secondNumber"])}`;
        numbersToCalculate["workingOperator"] = "";
        numbersToCalculate["secondNumber"] = "";
    }

    if (digitInput.hasOwnProperty(buttonID)) {
        if (buttonID === "digit-negative") {
            console.log("work in progress"); /* need to append negative to current number */
        } else if (numbersToCalculate["workingOperator"] === "" && lastButtonPressed !== "operator-equals") {
            numbersToCalculate["firstNumber"] += digitInput[buttonID]; /* if there is no operator, we're still adding digits to the first number */
        } else if (numbersToCalculate["workingOperator"] === "" && lastButtonPressed === "operator-equals") {
            numbersToCalculate["firstNumber"] = digitInput[buttonID];
        } else if (numbersToCalculate["workingOperator"] !== "") {
            numbersToCalculate["secondNumber"] += digitInput[buttonID]; /* if there IS an operator, add digits to the second number */
        };
    };

    if (operatorInput.hasOwnProperty(buttonID)) {
        console.log("Inside operatorInput function:", numbersToCalculate["workingOperator"]);
        if (numbersToCalculate["workingOperator"] === "") {
            numbersToCalculate["workingOperator"] = operatorInput[buttonID];
        } else if (numbersToCalculate["workingOperator"] !== "") {
            numbersToCalculate["firstNumber"] = `${operate(numbersToCalculate["workingOperator"], numbersToCalculate["firstNumber"], numbersToCalculate["secondNumber"])}`;
            numbersToCalculate["workingOperator"] = operatorInput[buttonID];
            numbersToCalculate["secondNumber"] = "";
        };
    }
    /* if we want to match the online-calculator example, we should only show the last number input before an operator (don't display the operator) */
    resultsScreen.textContent = `${numbersToCalculate["firstNumber"]} ${numbersToCalculate["workingOperator"]} ${numbersToCalculate["secondNumber"]}`

    console.log("At the end:", numbersToCalculate["firstNumber"]);
    console.log(numbersToCalculate["workingOperator"]);
    console.log(numbersToCalculate["secondNumber"]);

    lastButtonPressed = buttonID;

    // } else if (button.target.id === "operator-equals") {
    //     resultsScreen.textContent = "" /* return result of operator */
    // } else {
    //     resultsScreen.textContent += (digitInput[button.target.id]);
    // };
}

function add(num1, num2) {
    return Number(num1) + Number(num2);
}

function subtract(num1, num2) {
    return Number(num1) - Number(num2);
}

function multiply(num1, num2) {
    return Number(num1) * Number(num2);
}

function divide(num1, num2) {
    return Number(num1) / Number(num2);
}

function operate(operator, num1, num2) {
    const operators = {
        "+": add,
        "-": subtract,
        "*": multiply,
        "/": divide,
    }
    // need if statement to check for empty operator / num1 / num2
    // num1 / num2 get turned into 0 on the Number() calls above
    // cannot use default arguments on empty strings - only works on undefined or null
    return operators[operator](num1, num2);
}