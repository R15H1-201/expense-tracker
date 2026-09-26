const typeInput = document.getElementById("typeInput");
const amountInput = document.getElementById("amountInput");
const nameInput = document.getElementById("nameInput");
const memberInput = document.getElementById("memberInput");
const phoneInput = document.getElementById("phoneInput");
const pickContactBtn = document.getElementById("pickContactBtn");
const addButton = document.getElementById("addButton");
const expenseList = document.getElementById("expenseList");

const netBalanceEl = document.getElementById("netBalance");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const totalBorrowEl = document.getElementById("totalBorrow");
const totalLendEl = document.getElementById("totalLend");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Contact Picker API Integration
if (!('contacts' in navigator && 'ContactsManager' in window)) {
    pickContactBtn.classList.add("unsupported");
}

pickContactBtn.addEventListener("click", async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
        try {
            const props = ['name', 'tel'];
            const contacts = await navigator.contacts.select(props, { multiple: false });
            if (contacts && contacts.length > 0) {
                const contact = contacts[0];
                if (contact.name && contact.name.length > 0) {
                    memberInput.value = contact.name[0];
                }
                if (contact.tel && contact.tel.length > 0) {
                    phoneInput.value = contact.tel[0].replace(/\s+/g, '');
                }
            }
        } catch (err) {
            console.warn("Contact picking cancelled or failed:", err);
        }
    } else {
        alert("The native Contact Picker is supported directly on mobile devices (Chrome/Android WebView with HTTPS or in your app wrapper). You can type the name and phone number directly.");
    }
});

function updateSummary() {
    let income = 0;
    let expense = 0;
    let borrow = 0;
    let lend = 0;

    transactions.forEach(t => {
        const amt = Number(t.amount);
        if (t.type === "income") income += amt;
        else if (t.type === "expense") expense += amt;
        else if (t.type === "borrow") borrow += amt;
        else if (t.type === "lend") lend += amt;
    });

    const net = (income + borrow) - (expense + lend);

    netBalanceEl.textContent = net;
    totalIncomeEl.textContent = income;
    totalExpenseEl.textContent = expense;
    totalBorrowEl.textContent = borrow;
    totalLendEl.textContent = lend;
}

function displayTransactions() {
    expenseList.innerHTML = "";

    transactions.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = `transaction-item ${item.type}`;

        const typeLabels = {
            expense: "Expense",
            income: "Income",
            borrow: "Need to Return",
            lend: "To Receive"
        };

        let contactInfo = "";
        if (item.member || item.phone) {
            const phoneLink = item.phone ? `<a href="tel:${item.phone}" class="phone-link">📞 ${item.phone}</a>` : "";
            contactInfo = `
                <div class="member-info">
                    ${item.member ? `<span>👤 ${item.member}</span>` : ""}
                    ${phoneLink}
                </div>
            `;
        }

        li.innerHTML = `
            <div class="item-left">
                <span class="badge ${item.type}">${typeLabels[item.type]}</span>
                <span class="item-title">${item.name}</span>
                ${contactInfo}
            </div>
            <div class="item-right">
                <span class="item-amount">₹${item.amount}</span>
                <button class="delete" onclick="deleteTransaction(${index})">✕</button>
            </div>
        `;
        expenseList.appendChild(li);
    });

    updateSummary();
}

addButton.addEventListener("click", function () {
    const type = typeInput.value;
    const amount = Number(amountInput.value);
    const name = nameInput.value.trim();
    const member = memberInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    const transaction = {
        id: Date.now(),
        type,
        amount,
        name,
        member: member || null,
        phone: phone || null
    };

    transactions.unshift(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    amountInput.value = "";
    nameInput.value = "";
    memberInput.value = "";
    phoneInput.value = "";

    displayTransactions();
});

function deleteTransaction(index) {
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    displayTransactions();
}

displayTransactions();
