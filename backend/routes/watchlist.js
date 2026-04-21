const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");


// =========================
// ➕ ADD TO WATCHLIST
// =========================
router.post("/add", auth, (req, res) => {
  const userId = req.user.id;
  const { movie_id } = req.body;

  // ✅ Validation
  if (!movie_id) {
    return res.status(400).json({ message: "Movie ID is required ❌" });
  }

  const sql = "INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)";

  db.query(sql, [userId, movie_id], (err) => {
    if (err) {
      console.log("ADD ERROR:", err);
      return res.status(500).json({ message: "Error adding to watchlist ❌" });
    }

    res.json({ message: "Added to watchlist ⭐" });
  });
});


// =========================
// 📥 GET WATCHLIST
// =========================
router.get("/", auth, (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT movies.*
    FROM movies
    JOIN watchlist ON movies.id = watchlist.movie_id
    WHERE watchlist.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.log("FETCH ERROR:", err);
      return res.status(500).json({ message: "Error fetching watchlist ❌" });
    }

    res.json(result);
  });
});


// =========================
// ❌ REMOVE FROM WATCHLIST
// =========================
router.delete("/remove/:movie_id", auth, (req, res) => {
  const userId = req.user.id;
  const movieId = req.params.movie_id;

  const sql = "DELETE FROM watchlist WHERE user_id=? AND movie_id=?";

  db.query(sql, [userId, movieId], (err) => {
    if (err) {
      console.log("DELETE ERROR:", err);
      return res.status(500).json({ message: "Error removing from watchlist ❌" });
    }

    res.json({ message: "Removed from watchlist ❌" });
  });
});


module.exports = router;