const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

// =========================
// 🔐 LOGIN
// =========================
router.post("/login", (req, res) => {
  console.log("🔥 LOGIN API HIT");

  
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";

  db.query(sql, [username, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error ❌" });
    }

    if (result.length === 0) {
      return res.json({ message: "Invalid credentials ❌" });
    }

    const user = result[0];

    // ✅ create token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      "secretkey"
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  });
});

module.exports = router;