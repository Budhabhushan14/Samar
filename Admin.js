const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: String,
  passwordHash: String
});

module.exports = mongoose.model("Admin", adminSchema);
