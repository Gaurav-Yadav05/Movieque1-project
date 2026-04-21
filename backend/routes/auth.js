const express = require("express");
const router = express.Router();

const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =========================
// 🔐 LOGIN
// =========================
router.post("/login", (req, res) => {
  console.log("🔥 LOGIN API HIT");

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields required ❌" });
  }

  const sql = "SELECT * FROM users WHERE username=?";

  db.query(sql, [username], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error ❌" });
    }

    if (result.length === 0) {
      return res.json({ message: "User not found ❌" });
    }

    const user = result[0];

    try {
      // ✅ Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.json({ message: "Invalid password ❌" });
      }

      // ✅ Create token
      const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
);

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username
        }
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error comparing password ❌" });
    }
  });
});

module.exports = router;