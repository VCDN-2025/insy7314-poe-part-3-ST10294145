import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/api";
import "./SwiftPage.css";

const SwiftPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await API.get("/transactions/pending");
      // Expecting res.data to be an array of transactions with at least:
      // { id, customerName, amount, currency, swiftCode, accountInfo, status }
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // helper to update a transaction's status locally
  const updateLocalStatus = (id, status) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const changeStatus = async (id, status) => {
    // status should be one of: 'verified', 'approved', 'rejected'
    try {
      await API.put(`/transactions/status/${id}`, { status });
      updateLocalStatus(id, status);
    } catch (err) {
      console.error(`Failed to set status ${status} for ${id}:`, err);
      alert("Action failed. Check console.");
    }
  };

  const verifyTransaction = (id) => changeStatus(id, "verified");
  const approveTransaction = (id) => changeStatus(id, "approved");
  const rejectTransaction = (id) => {
    if (!window.confirm("Are you sure you want to reject this transaction?")) return;
    changeStatus(id, "rejected");
  };

  const submitToSwift = async () => {
    const approvedIds = transactions
      .filter((t) => t.status === "approved")
      .map((t) => t.id);

    if (approvedIds.length === 0) {
      alert("No approved transactions to submit.");
      return;
    }

    try {
      await API.post("/transactions/submit", { transactionIds: approvedIds });
      alert("Submitted approved transactions to SWIFT ✅");
      // refresh list after submit
      fetchTransactions();
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Submit failed. Check console.");
    }
  };

  const renderActions = (t) => {
    // t.status: 'pending' | 'verified' | 'approved' | 'rejected'
    switch (t.status) {
      case "pending":
        return (
          <>
            <button className="verify-btn" onClick={() => verifyTransaction(t.id)}>
              Verify
            </button>
            <button className="reject-btn" onClick={() => rejectTransaction(t.id)}>
              Reject
            </button>
          </>
        );
      case "verified":
        return (
          <>
            <button className="approve-btn" onClick={() => approveTransaction(t.id)}>
              Approve
            </button>
            <button className="reject-btn" onClick={() => rejectTransaction(t.id)}>
              Reject
            </button>
          </>
        );
      case "approved":
        return <span className="badge approved">👍 Approved</span>;
      case "rejected":
        return <span className="badge rejected">❌ Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="swift-page">
      <Navbar employeeName="Employee Name" />

      <div className="swift-container">
        <h2>Pending International Payments</h2>

        {loading ? (
          <div className="loading">Loading transactions…</div>
        ) : transactions.length === 0 ? (
          <div className="no-data">No pending transactions</div>
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
                <tr key={t.id} className={t.status === "approved" ? "approved-row" : t.status === "rejected" ? "rejected-row" : t.status === "verified" ? "verified-row" : ""}>
                  <td className="cell-left">{t.customerName}</td>
                  <td>{t.amount}</td>
                  <td>{t.currency}</td>
                  <td>{t.swiftCode}</td>
                  <td className="cell-left">{t.accountInfo}</td>
                  <td className="status-cell">
                    {t.status === "pending" && "⏳ Pending"}
                    {t.status === "verified" && "✅ Verified"}
                    {t.status === "approved" && "👍 Approved"}
                    {t.status === "rejected" && "❌ Rejected"}
                  </td>
                  <td className="actions-cell">{renderActions(t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="submit-wrap">
          <button className="submit-btn" onClick={submitToSwift}>
            Submit Approved to SWIFT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwiftPage;
