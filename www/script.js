const nameInput = document.getElementById("nameInput");
const amountInput = document.getElementById("amountInput");
const addButton = document.getElementById("addButton");
const expenseList = document.getElementById("expenseList");
const totalElement = document.getElementById("total");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
function displayExpenses() {
    expenseList.innerHTML = "";
    let total = 0;
    expenses.forEach((expense, index) => {
        total += expense.amount;
        const li = document.createElement("li");
        li.className = "expense";
        li.innerHTML = `
            <span>
                ${expense.name} - ₹${expense.amount}
            </span>
            <button class="delete" onclick="deleteExpense(${index})">
                Delete
            </button>
        `;
        expenseList.appendChild(li);
    });
    totalElement.textContent = total;
}

addButton.addEventListener("click", function () {
    const name = nameInput.value.trim();
    const amount = Number(amountInput.value);
    if (name === "" || amount <= 0) {
        alert("Please enter a valid name and amount.");
        return;
    }
    const expense = {
        name: name,
        amount: amount
    };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    nameInput.value = "";
    amountInput.value = "";
    displayExpenses();
});

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
    displayExpenses();
}

displayExpenses();