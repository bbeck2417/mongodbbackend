const db = require("../db");

const User = db.model("User", {
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  status: String,
});

module.exports = User;