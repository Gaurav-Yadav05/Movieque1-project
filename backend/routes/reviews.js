const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");


// =========================
// ➕ ADD REVIEW
// =========================
router.post("/add", auth, (req, res) => {
  const userId = req.user.id;

  const { movie_id, rating, review } = req.body;

  // ✅ VALIDATION
  if (!movie_id || !rating || !review) {
    return res.status(400).json({
      message: "All fields are required ❌",
      received: req.body
    });
  }

  const sql = `
    INSERT INTO reviews (user_id, movie_id, rating, review)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [userId, movie_id, rating, review], (err) => {
    if (err) {
      console.log("SQL ERROR:", err);
      return res.status(500).json({ message: "Database error ❌" });
    }

    res.json({ message: "Review added successfully ✍️" });
  });
});


// =========================
// 📥 GET REVIEWS FOR MOVIE
// =========================
router.get("/:movie_id", (req, res) => {
  const movieId = req.params.movie_id;

  const sql = `
    SELECT * FROM reviews WHERE movie_id = ?
  `;

  db.query(sql, [movieId], (err, result) => {
    if (err) {
      console.log("FETCH ERROR:", err);
      return res.status(500).json({ message: "Error fetching reviews ❌" });
    }

    res.json(result);
  });
});


module.exports = router;