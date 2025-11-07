import bcrypt from "bcryptjs";

const plainPassword = "password123";

const hashPassword = async () => {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔑 BCRYPT PASSWORD HASH GENERATOR");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\nPlain Password:", plainPassword);
  console.log("\nHashed Password (copy this):");
  console.log(hashedPassword);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n📋 INSTRUCTIONS:");
  console.log("1. Copy the hashed password above");
  console.log("2. Open MongoDB Compass");
  console.log("3. Go to your Users collection");
  console.log("4. Create/Edit employee document:");
  console.log("   {");
  console.log('     "name": "Admin Employee",');
  console.log('     "email": "employee@test.com",');
  console.log('     "password": "<PASTE HASH HERE>",');
  console.log('     "role": "employee"');
  console.log("   }");
  console.log("5. Save and try logging in!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
};

hashPassword();