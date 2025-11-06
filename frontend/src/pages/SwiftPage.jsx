import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";
import "./SwiftPage.css";

const SwiftPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [swiftCode, setSwiftCode] = useState("");
  const [accountInfo, setAccountInfo] = useState("");

  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");
  const employeeName = localStorage.getItem("employeeName");

  const isUser = role === "user";
  const isEmployee = role === "employee";

  useEffect(() => {
    if (isEmployee) fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await API.get("/transactions/pending");
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // User: create new transaction
  const createTransaction = async (e) => {
    e.preventDefault();
    try {
      await API.post("/transactions/create", { amount, currency, swiftCode, accountInfo });
      alert("Transaction created successfully!");
      setAmount("");
      setCurrency("USD");
      setSwiftCode("");
      setAccountInfo("");
    } catch (err) {
      console.error("Transaction creation failed:", err);
      alert("Failed to create transaction. Check console.");
    }
  };

  // Employee: update transaction status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/transactions/status/${id}`, { status });
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Action failed. Check console.");
    }
  };

  const submitToSwift = async () => {
    const approvedIds = transactions
      .filter((t) => t.status === "approved")
      .map((t) => t.id);

    if (!approvedIds.length) {
      alert("No approved transactions to submit.");
      return;
    }

    try {
      await API.post("/transactions/submit", { transactionIds: approvedIds });
      alert("Submitted approved transactions to SWIFT ✅");
      fetchTransactions();
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Submit failed. Check console.");
    }
  };

  const renderActions = (t) => {
    switch (t.status) {
      case "pending":
        return (
          <>
            <button onClick={() => updateStatus(t.id, "verified")}>Verify</button>
            <button onClick={() => updateStatus(t.id, "rejected")}>Reject</button>
          </>
        );
      case "verified":
        return (
          <>
            <button onClick={() => updateStatus(t.id, "approved")}>Approve</button>
            <button onClick={() => updateStatus(t.id, "rejected")}>Reject</button>
          </>
        );
      case "approved":
        return <span>👍 Approved</span>;
      case "rejected":
        return <span>❌ Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="swift-page">
      <Navbar employeeName={employeeName} userName={userName} />

      <div className="swift-container">
        {isUser && (
          <>
            <h2>Make a New International Payment</h2>
            <form className="transaction-form" onSubmit={createTransaction}>
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="ZAR">ZAR</option>
              </select>
              <input
                type="text"
                placeholder="SWIFT Code"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Account Info"
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                required
              />
              <button type="submit">Submit Payment</button>
            </form>
          </>
        )}

        {isEmployee && (
          <>
            <h2>Pending International Payments</h2>
            {loading ? (
              <div>Loading transactions…</div>
            ) : !transactions.length ? (
              <div>No pending transactions</div>
            ) : (
              <table className="swift-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Currency</th>
                    <th>SWIFT Code</th>
                    <th>Account Info</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.customerName}</td>
                      <td>{t.amount}</td>
                      <td>{t.currency}</td>
                      <td>{t.swiftCode}</td>
                      <td>{t.accountInfo}</td>
                      <td>{t.status}</td>
                      <td>{renderActions(t)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={submitToSwift}>Submit Approved to SWIFT</button>
          </>
        )}
      </div>
    </div>
  );
};

export default SwiftPage;
