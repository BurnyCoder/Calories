// SELECT ELEMENTS
const totalEl = document.querySelector(".total .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const outcomeEl = document.querySelector("#outcome");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const outcomeList = document.querySelector("#outcome .list");
const allList = document.querySelector("#all .list");

// SELECT BTNS
const outcomeBtn = document.querySelector(".tab1");
const incomeBtn = document.querySelector(".tab2");
const allBtn = document.querySelector(".tab3");

// INPUT BTS
const addExpense = document.querySelector(".add-outcome");
const outcomeTitle = document.getElementById("outcome-title-input");
const outcomeAmount = document.getElementById("outcome-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

// VARIABLES
let ENTRY_LIST;
let total = 0, income = 0, outcome = 0;
const DELETE = "delete", EDIT = "edit";

// LOOK IF THERE IS SAVED DATA IN LOCALSTORAGE
ENTRY_LIST = JSON.parse(localStorage.getItem("entry_list")) || [];
updateUI();

// EVENT LISTENERS
outcomeBtn.addEventListener("click", function () {
    show(outcomeEl);
    hide([incomeEl, allEl]);
    active(outcomeBtn);
    inactive([incomeBtn, allBtn]);
})
incomeBtn.addEventListener("click", function () {
    show(incomeEl);
    hide([outcomeEl, allEl]);
    active(incomeBtn);
    inactive([outcomeBtn, allBtn]);
})
allBtn.addEventListener("click", function () {
    show(allEl);
    hide([incomeEl, outcomeEl]);
    active(allBtn);
    inactive([incomeBtn, outcomeBtn]);
})

addExpense.addEventListener("click", function () {
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    if (!outcomeTitle.value || !outcomeAmount.value) return;

    // SAVE THE ENTRY TO ENTRY_LIST
    let outcome = {
        type: "outcome",
        title: outcomeTitle.value,
        amount: parseInt(outcomeAmount.value)
    }
    ENTRY_LIST.push(outcome);

    updateUI();
    clearInput([outcomeTitle, outcomeAmount])
})

addIncome.addEventListener("click", function () {
    // IF ONE OF THE INPUTS IS EMPTY => EXIT
    if (!incomeTitle.value || !incomeAmount.value) return;

    // SAVE THE ENTRY TO ENTRY_LIST
    let income = {
        type: "income",
        title: incomeTitle.value,
        amount: parseInt(incomeAmount.value)
    }
    ENTRY_LIST.push(income);

    updateUI();
    clearInput([incomeTitle, incomeAmount])
})

incomeList.addEventListener("click", deleteOrEdit);
outcomeList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

// HELPERS

function deleteOrEdit(event) {
    const targetBtn = event.target;

    const entry = targetBtn.parentNode;

    if (targetBtn.id == DELETE) {
        deleteEntry(entry);
    } else if (targetBtn.id == EDIT) {
        editEntry(entry);
    }
}

function deleteEntry(entry) {
    ENTRY_LIST.splice(entry.id, 1);

    updateUI();
}

function editEntry(entry) {
    console.log(entry)
    let ENTRY = ENTRY_LIST[entry.id];

    if (ENTRY.type == "income") {
        incomeAmount.value = ENTRY.amount;
        incomeTitle.value = ENTRY.title;
    } else if (ENTRY.type == "outcome") {
        outcomeAmount.value = ENTRY.amount;
        outcomeTitle.value = ENTRY.title;
    }

    deleteEntry(entry);
}

function updateUI() {
    income = calculateTotal("income", ENTRY_LIST);
    outcome = calculateTotal("outcome", ENTRY_LIST);
    total = calculateBalance(income, outcome);

    // UPDATE UI
    totalEl.innerHTML = `${total}`;
    outcomeTotalEl.innerHTML = `${outcome}`;
    incomeTotalEl.innerHTML = `${income}`;

    clearElement([outcomeList, incomeList, allList]);

    ENTRY_LIST.forEach((entry, index) => {
        if (entry.type == "outcome") {
            showEntry(outcomeList, entry.type, entry.title, entry.amount, index)
        } else if (entry.type == "income") {
            showEntry(incomeList, entry.type, entry.title, entry.amount, index)
        }
        showEntry(allList, entry.type, entry.title, entry.amount, index)
    });

    updateChart(income, outcome);

    localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

function showEntry(list, type, title, amount, id) {

    const entry = ` <li id = "${id}" class="${type}">
                        <div class="entry">${title}: ${amount}</div>
                        <div id="edit"></div>
                        <div id="delete"></div>
                    </li>`;

    const position = "afterbegin";

    list.insertAdjacentHTML(position, entry);
}

function clearElement(elements) {
    elements.forEach(element => {
        element.innerHTML = "";
    })
}

function calculateTotal(type, list) {
    let sum = 0;

    list.forEach(entry => {
        if (entry.type == type) {
            sum += entry.amount;
        }
    })

    return sum;
}

function calculateBalance(income, outcome) {
    return income - outcome;
}

function clearInput(inputs) {
    inputs.forEach(input => {
        input.value = "";
    })
}
function show(element) {
    element.classList.remove("hide");
}

function hide(elements) {
    elements.forEach(element => {
        element.classList.add("hide");
    })
}

function active(element) {
    element.classList.add("active");
}

function inactive(elements) {
    elements.forEach(element => {
        element.classList.remove("active");
    })
}