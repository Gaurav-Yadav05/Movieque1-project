const express = require("express");
const router = express.Router();

const db = require("../db");
const auth = require("../middleware/authMiddleware");

// =========================
// 🎬 GET ALL MOVIES
// =========================
router.get("/", auth, (req, res) => {
  console.log("🔥 MOVIES API HIT");
  console.log("USER:", req.user); // ✅ DEBUG

  const sql = "SELECT * FROM movies";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ message: "Error fetching movies ❌" });
    }

    res.json(result);
  });
});

// =========================
// ➕ ADD MOVIE
// =========================
router.post("/add-movie", auth, (req, res) => {
  const { title, genre, year } = req.body;

  if (!title || !genre || !year) {
    return res.status(400).json({ message: "All fields required ❌" });
  }

  const sql = "INSERT INTO movies (title, genre, year) VALUES (?, ?, ?)";

  db.query(sql, [title, genre, year], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error adding movie ❌" });
    }

    res.json({ message: "Movie added successfully 🎬" });
  });
});

// =========================
// ✏️ UPDATE MOVIE
// =========================
router.put("/update-movie/:id", auth, (req, res) => {
  const movieId = req.params.id;
  const { title, genre, year } = req.body;

  if (!title || !genre || !year) {
    return res.status(400).json({ message: "All fields required ❌" });
  }

  const sql = "UPDATE movies SET title=?, genre=?, year=? WHERE id=?";

  db.query(sql, [title, genre, year, movieId], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error updating movie ❌" });
    }

    res.json({ message: "Movie updated successfully ✏️" });
  });
});

// =========================
// ❌ DELETE MOVIE
// =========================
router.delete("/delete-movie/:id", auth, (req, res) => {
  const movieId = req.params.id;

  const sql = "DELETE FROM movies WHERE id=?";

  db.query(sql, [movieId], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Error deleting movie ❌" });
    }

    res.json({ message: "Movie deleted successfully ❌" });
  });
});

module.exports = router;