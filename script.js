const inputDisplay = document.getElementById("calculator-input");
const outputDisplay = document.getElementById("calculator-output");
const buttons = document.querySelectorAll("button");
const historyDisplay = document.getElementById("history-display");
const clearHistoryBtn = document.getElementById("clear-history-btn");

let vstup = "";
let vystup = "";
let history = [];

const operators = "+-*/^().";
const digits = "0123456789";

function displayRender() {
  inputDisplay.textContent = vstup || "0";
  outputDisplay.textContent = vystup?.toString() || "0";
}

function renderHistory() {
  historyDisplay.innerHTML = history.map(item => `<p>${item}</p>`).join("");
}

function evaluateExpression() {
  const originalVstup = vstup;
  try {
    const evalInput = vstup.replace(/\^/g, "**");
    vystup = eval(evalInput);
    if (vystup % 1 !== 0) {
      vystup = Math.round(vystup * 100) / 100;
    }
    vstup = vystup.toString();
  } catch {
    vystup = "Error";
  }

  // Always show result or error in history
  history.push(`${originalVstup} = ${vystup}`);
  localStorage.setItem("historiePoctu", JSON.stringify(history));
  renderHistory();
  displayRender();
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.value;
    const id = button.id;

    if (value === "=") {
      evaluateExpression();
    } else if (id === "clear-all-btn") {
      vstup = "";
      vystup = "";
      displayRender();
    } else if (id === "clear-btn") {
      vstup = vstup.slice(0, -1);
      displayRender();
    } else if (value === ".") {
      const lastNumber = vstup.split(/[\+\-\*\/\^]/).pop();
      if (!lastNumber.includes(".")) {
        vstup += value;
        displayRender();
      }
    } else {
      vstup += value;
      displayRender();
    }
  });
});

document.addEventListener("keydown", (event) => {
  const klavesa = event.key;

  if (klavesa === "Enter") {
    event.preventDefault();
    evaluateExpression();

  } else if (klavesa === "Backspace") {
    vstup = vstup.slice(0, -1);
    displayRender();

  } else if (klavesa === "Escape") {
    vstup = "";
    vystup = "";
    displayRender();

  } else if (operators.includes(klavesa)) {
    if (klavesa === ".") {
      const lastNumber = vstup.split(/[\+\-\*\/\^]/).pop();
      if (!lastNumber.includes(".")) {
        vstup += ".";
        displayRender();
      }
    } else {
      vstup += klavesa;
      displayRender();
    }

  } else if (klavesa === ",") {
    const lastNumber = vstup.split(/[\+\-\*\/\^]/).pop();
    if (!lastNumber.includes(".")) {
      vstup += ".";
      displayRender();
    }

  } else if (digits.includes(klavesa)) {
    vstup += klavesa;
    displayRender();

  } else {
    event.preventDefault();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const ulozenaHistorie = localStorage.getItem("historiePoctu");
  if (ulozenaHistorie) {
    history = JSON.parse(ulozenaHistorie);
    renderHistory();
  }
});

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  localStorage.removeItem('historiePoctu');
  renderHistory();
});
