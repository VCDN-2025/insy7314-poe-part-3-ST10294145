import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createEmployee = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Delete old employee if exists
    await User.deleteOne({ email: "employee@test.com" });
    console.log("🗑️  Deleted old employee (if existed)");

    // Create new employee with password123
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const employee = new User({
      name: "Admin Employee",
      email: "employee@test.com",
      password: hashedPassword,
      role: "employee"
    });

    await employee.save();

    console.log("\n✅ Employee created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:    employee@test.com");
    console.log("🔑 Password: password123");
    console.log("👤 Role:     employee");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\nUse these credentials to log in.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createEmployee();