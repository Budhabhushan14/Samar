const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./backend/models/Admin");

mongoose.connect("mongodb://127.0.0.1:27017/financeApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createAdmin() {
  const username = "admin";
  const password = "admin123";
  const passwordHash = bcrypt.hashSync(password, 10);

  const admin = new Admin({ username, passwordHash });
  await admin.save();

  console.log("✅ Admin user created!");
  mongoose.connection.close();
}

createAdmin();
