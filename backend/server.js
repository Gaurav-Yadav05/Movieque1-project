require("dotenv").config();

const db = require("./db");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const movieRoutes = require("./routes/movies");
const reviewRoutes = require("./routes/reviews");
const watchlistRoutes = require("./routes/watchlist");
const jwt = require("jsonwebtoken"); 

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.json({ message: "Movique Server Running 🚀" });
});


// =========================
// 🔐 REGISTER
// =========================
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(sql, [username, hashedPassword], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "User already exists or DB error" });
      }

      res.json({ message: "User Registered Successfully ✅" });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error hashing password" });
  }
});


// =========================
// 🔐 LOGIN
// =========================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ status: "fail", message: "All fields required" });
  }

  const sql = "SELECT * FROM users WHERE username=?";

  db.query(sql, [username], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: "fail", message: "Server error" });
    }

    if (result.length === 0) {
      return res.json({ status: "fail", message: "User not found" });
    }

    const user = result[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    status: "success",
    token: token,   // ✅ IMPORTANT
    user: {
      id: user.id,
      username: user.username
    }
  });
}else {
        res.json({ status: "fail", message: "Invalid password" });
      }

    } catch (err) {
      console.log(err);
      res.status(500).json({ status: "fail", message: "Error comparing password" });
    }
  });
});


// 🎬 MOVIES ROUTE
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/watchlist", watchlistRoutes);


// 🚀 START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});