import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; 
import "./UserDashboard.css";

export default function UserDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://localhost:5000/api/transactions/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTransactions(response.data.transactions);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId, token]);

  return (
    <>
      {/* Pass the userName to Navbar so it shows on the right */}
      <Navbar userName={localStorage.getItem("userName")} />

      <div className="dashboard-container">
        <h2>Welcome {localStorage.getItem("userName")}!</h2>
        <p>Your transaction updates will appear below:</p>

        {loading && <p>Loading transactions...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="transactions-container">
          {transactions.length === 0 && !loading && <p>No transactions found.</p>}
          {transactions.map((tx) => (
            <div key={tx._id} className="transaction-card">
              <h3>{tx.customerName}</h3>
              <p>Amount: {tx.amount} {tx.currency}</p>
              <p>Account: {tx.accountInfo}</p>
              <p>SWIFT: {tx.swiftCode}</p>
              <p>
                Status:{" "}
                <span
                  className={
                    tx.status === "pending"
                      ? "status-pending"
                      : tx.status === "approved"
                      ? "status-approved"
                      : "status-rejected"
                  }
                >
                  {tx.status.toUpperCase()}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
