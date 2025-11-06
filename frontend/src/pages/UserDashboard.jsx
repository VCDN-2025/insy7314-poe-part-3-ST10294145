import React from "react";

function UserDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Welcome to Your Dashboard!
      </h1>
      <p className="text-gray-700">
        You are successfully logged in as a user.
      </p>
    </div>
  );
}

export default UserDashboard;
