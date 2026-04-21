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
// ✅ MIDDLEWARE (FIXED SAFE CORS)
// =========================
app.use(cors({
  origin: "*",   // ✅ FIX: prevents frontend blocking issues
  credentials: true
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
        console.error("REGISTER ERROR:", err);
        return res.status(500).json({ message: "User already exists or DB error ❌" });
      }

      res.json({ message: "User Registered Successfully ✅" });
    });

  } catch (err) {
    console.error("HASH ERROR:", err);
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
// ✅ DEBUG ROUTE (IMPORTANT FOR YOU)
// =========================
app.get("/debug", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) {
      return res.status(500).json({
        message: "DB NOT CONNECTED ❌",
        error: err
      });
    }

    res.json({ message: "DB Connected ✅" });
  });
});


// =========================
// 🚀 START SERVER
// =========================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});