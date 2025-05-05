import { useEffect, useState } from "react";
import { getAllAccounts, createAccount, depositToAccount, withdrawFromAccount } from "./services/api";

function App() {
  const [accounts, setAccounts] = useState([]);//creating empty array
  //below insterting the data fetched from backend
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountType: "savings",
    balance: ""
  });
  const [transactionAmounts, setTransactionAmounts] = useState({});
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
  getAllAccounts().then(data => {
      console.log("Fetched accounts:", data); // debug

      if (Array.isArray(data)) {
        setAccounts(data); // case: backend returns a raw list
      } else if (data && Array.isArray(data.content)) {
        setAccounts(data.content); // case: paged Spring Data JPA response
      } else if (data && typeof data === 'object') {
        const possibleArray = Object.values(data).find(val => Array.isArray(val));
        if (possibleArray) {
          setAccounts(possibleArray);
        } else {
          console.error("Unexpected structure — no array found:", data);
          setAccounts([]);
        }
      } else {
        console.error("Completely unrecognized data:", data);
        setAccounts([]);
      }
    })
    .catch(err => {
      console.error("Error fetching accounts:", err);
      setAccounts([]); // fallback
    });
	};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
	const payload = {
    ...formData,
    balance: parseFloat(formData.balance)
	};
	console.log("Submitting:", payload);  // ✅ Inspect payload
	console.log("Submitting form data:", formData);
    createAccount(payload).then(() => {
      fetchAccounts(); // refresh list
      setFormData({
        accountHolderName: "",
        accountType: "savings",
        balance: "0"
      });
    });
  };
  const handleTransactionChange = (id, value) => {
    setTransactionAmounts(prev => ({ ...prev, [id]: value }));
  };

  const handleDeposit = (id) => {
    const amount = parseFloat(transactionAmounts[id]);
    if (!isNaN(amount) && amount > 0) {
      depositToAccount(id, amount).then(fetchAccounts);
    }
  };

  const handleWithdraw = (id) => {
    const amount = parseFloat(transactionAmounts[id]);
    if (!isNaN(amount) && amount > 0) {
      withdrawFromAccount(id, amount).then(fetchAccounts);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create New Account</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          name="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
          placeholder="Account Holder Name"
          required
        />
        <select
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
          style={{ marginLeft: "1rem" }}
        >
          <option value="savings">Savings</option>
          <option value="current">Current</option>
        </select>
        <input
          name="balance"
          value={formData.balance}
          onChange={handleChange}
          type="number"
          placeholder="Initial Balance"
		  step="0.01"
          style={{ marginLeft: "1rem" }}
          required
        />
        <button type="submit" style={{ marginLeft: "1rem" }}>Create</button>
      </form>

      <h2>Existing Accounts</h2>
      <ul>
        {Array.isArray(accounts) && accounts.map((account) => ( 
          <li key={account.id}>
            {account.accountHolderName} — {account.accountType} — ₹{account.balance ?? 0} 
			<input
              type="number"
              placeholder="Amount"
              style={{ marginLeft: "1rem" }}
              value={transactionAmounts[account.id] || ""}
              onChange={(e) => handleTransactionChange(account.id, e.target.value)}
            />
            <button onClick={() => handleDeposit(account.id)} style={{ marginLeft: "0.5rem" }}>
              Deposit
            </button>
            <button onClick={() => handleWithdraw(account.id)} style={{ marginLeft: "0.5rem" }}>
              Withdraw
            </button>
		  </li> 
		  ))
		 } 
	  </ul>
    </div>
  );
}

export default App;
