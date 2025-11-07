import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./EmployeeDashboard.css";

export default function EmployeeDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const employeeName = localStorage.getItem("userName");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://localhost:5000/api/transactions/pending",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(
        `https://localhost:5000/api/transactions/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? { ...tx, status } : tx))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <>
      <Navbar employeeName={employeeName} />
      <div className="container">
        <h2>Welcome Employee! This is your admin dashboard.</h2>
        {loading && <p>Loading transactions...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="transactions-container">
          {transactions.map((tx) => (
            <div key={tx._id} className="transaction-card">
              <h3>{tx.customerName}</h3>
              <p>Amount: {tx.amount} {tx.currency}</p>
              <p>Account: {tx.accountInfo}</p>
              <p>SWIFT: {tx.swiftCode}</p>
              <p>Status: {tx.status.toUpperCase()}</p>

              {tx.status === "pending" && (
                <div className="buttons">
                  <button onClick={() => handleStatusUpdate(tx._id, "approved")}>Approve</button>
                  <button onClick={() => handleStatusUpdate(tx._id, "rejected")}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>

        
      </div>
    </>
  );
}
