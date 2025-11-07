import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";
import "./SwiftPage.css";

const SwiftPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // User transaction form
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

  // Fetch all transactions (employees only)
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

  // Users: create a new transaction
  const createTransaction = async (e) => {
    e.preventDefault();
    
    if (!userName || userName.trim() === "") {
      alert("Error: User name not found. Please log in again.");
      return;
    }

    try {
      const response = await API.post("/transactions/create", {
        customerName: userName,
        amount: parseFloat(amount),
        currency,
        swiftCode,
        accountInfo,
      });
      console.log("Transaction created:", response.data);
      alert("Transaction created successfully!");
      setAmount("");
      setCurrency("USD");
      setSwiftCode("");
      setAccountInfo("");
    } catch (err) {
      console.error("Transaction creation failed:", err);
      console.error("Error response:", err.response?.data);
      alert(`Failed to create transaction: ${err.response?.data?.message || err.message}`);
    }
  };

  // Employees: update transaction status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/transactions/status/${id}`, { status });
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );
      alert(`Transaction ${status} successfully!`);
    } catch (err) {
      console.error("Failed to update status:", err);
      console.error("Error response:", err.response?.data);
      alert(`Action failed: ${err.response?.data?.message || err.message}`);
    }
  };

  // Employees: submit approved transactions
  const submitToSwift = async () => {
    const approvedIds = transactions
      .filter((t) => t.status === "approved")
      .map((t) => t._id);

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
      console.error("Error response:", err.response?.data);
      alert(`Submit failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const renderActions = (t) => {
    switch (t.status) {
      case "pending":
        return (
          <div className="action-buttons">
            <button onClick={() => updateStatus(t._id, "verified")}>Verify</button>
            <button onClick={() => updateStatus(t._id, "rejected")}>Reject</button>
          </div>
        );
      case "verified":
        return (
          <div className="action-buttons">
            <button onClick={() => updateStatus(t._id, "approved")}>Approve</button>
            <button onClick={() => updateStatus(t._id, "rejected")}>Reject</button>
          </div>
        );
      case "approved":
        return <span className="status-approved">👍 Approved</span>;
      case "rejected":
        return <span className="status-rejected">❌ Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="swift-page">
      <Navbar employeeName={employeeName} userName={userName} />

      <main className="swift-container">
        {isUser && (
          <section className="swift-user-section">
            <h2>Make a New International Payment</h2>
            <form className="transaction-form" onSubmit={createTransaction}>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="ZAR">ZAR</option>
                </select>
              </div>

              <div className="form-group">
                <label>SWIFT Code</label>
                <input
                  type="text"
                  placeholder="Enter SWIFT Code"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Account Info</label>
                <input
                  type="text"
                  placeholder="Enter Account Info"
                  value={accountInfo}
                  onChange={(e) => setAccountInfo(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="submit-btn">Submit Payment</button>
            </form>
          </section>
        )}

        {isEmployee && (
          <section className="swift-employee-section">
            <h2>Pending International Payments</h2>
            {loading ? (
              <div className="loading">Loading transactions…</div>
            ) : !transactions.length ? (
              <div className="no-transactions">No pending transactions</div>
            ) : (
              <div className="table-wrapper">
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
                      <tr key={t._id}>
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
              </div>
            )}
            <button className="submit-approved-btn" onClick={submitToSwift}>
              Submit Approved to SWIFT
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default SwiftPage;
