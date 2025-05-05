import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/accounts'; // Update if needed

export const getAllAccounts = () => {
  return axios.get(BASE_URL);
};

export const createAccount = async (accountData) => {
  const payload = {
    accountHolderName: accountData.accountHolderName,
    accountType: accountData.accountType,
    initialDeposit: parseFloat(accountData.balance)
  };

  const response = await fetch("http://localhost:8080/api/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to create account");
  }

  return await response.json();
};
export const depositToAccount = async (accountId, amount) => {
  const response = await fetch(`http://localhost:8080/api/accounts/${accountId}/deposit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });
  if (!response.ok) throw new Error("Failed to deposit");
};

export const withdrawFromAccount = async (accountId, amount) => {
  const response = await fetch(`http://localhost:8080/api/accounts/${accountId}/withdraw`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });
  if (!response.ok) throw new Error("Failed to withdraw");
};
