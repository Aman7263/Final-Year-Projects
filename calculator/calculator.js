let display = document.getElementById("display");
let currentInput = "";

function updateDisplay() {
    display.textContent = currentInput || "0";
}

function appendNumber(number) {
    currentInput += number;
    updateDisplay();
}

function appendOperator(operator) {

    if (currentInput === "") return;

    let lastChar = currentInput.slice(-1);

    if ("+-*/".includes(lastChar)) return;

    currentInput += operator;
    updateDisplay();
}

function clearDisplay() {
    currentInput = "";
    updateDisplay();
}

function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function calculate() {

    try {
        currentInput = eval(currentInput).toString();
    }
    catch {
        currentInput = "";
        alert("Invalid calculation");
    }

    updateDisplay();
}

/* Keyboard support */

document.addEventListener("keydown", function(event) {

    let key = event.key;

    if (!isNaN(key) || key === ".") {
        appendNumber(key);
    }

    else if (key === "+" || key === "-" || key === "*" || key === "/") {
        appendOperator(key);
    }

    else if (key === "Enter") {
        calculate();
    }

    else if (key === "Backspace") {
        deleteLast();
    }

    else if (key === "Escape") {
        clearDisplay();
    }

});