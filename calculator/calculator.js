let display = document.getElementById("display");
let historyDiv = document.getElementById("history");

let currentInput = "";

function updateDisplay() {
    display.textContent = currentInput || "0";
}

function appendNumber(num) {
    currentInput += num;
    updateDisplay();
}

function appendOperator(op) {
    let last = currentInput.slice(-1);
    if ("+-*/".includes(last)) return;
    currentInput += op;
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

function percentage() {
    try {
        currentInput = (eval(currentInput) / 100).toString();
        updateDisplay();
    } catch {}
}

function square() {
    try {
        currentInput = Math.pow(eval(currentInput), 2).toString();
        updateDisplay();
    } catch {}
}

function squareRoot() {
    try {
        currentInput = Math.sqrt(eval(currentInput)).toString();
        updateDisplay();
    } catch {}
}

function calculate() {
    try {
        let result = eval(currentInput);
        historyDiv.innerHTML += `<div>${currentInput} = ${result}</div>`;
        currentInput = result.toString();
    } catch {
        currentInput = "";
        alert("Invalid Calculation");
    }
    updateDisplay();
}

updateDisplay();