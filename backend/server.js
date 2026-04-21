require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const db = require("./db");

const movieRoutes = require("./routes/movies");
const reviewRoutes = require("./routes/reviews");
const watchlistRoutes = require("./routes/watchlist");
const authRoutes = require("./routes/auth");

const app = express();

// =========================
// ✅ MIDDLEWARE
// =========================
app.use(cors({
  origin: "http://127.0.0.1:5500"
}));

app.use(express.json());

// =========================
// ✅ TEST ROUTE
// =========================
app.get("/", (req, res) => {
  res.json({ message: "Movique Server Running 🚀" });
});

// =========================
// 🔐 AUTH ROUTES
// =========================
app.use("/api/auth", authRoutes);

// =========================
// 🔐 REGISTER
// =========================
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields required ❌" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";

    db.query(sql, [username, hashedPassword], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "User already exists or DB error ❌" });
      }

      res.json({ message: "User Registered Successfully ✅" });
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error hashing password ❌" });
  }
});

// =========================
// 🎬 ROUTES
// =========================
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/watchlist", watchlistRoutes);

// =========================
// ✅ TEST ROUTE
// =========================
app.get("/test", (req, res) => {
  res.send("Backend is working ✅");
});

// =========================
// 🚀 START SERVER
// =========================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});