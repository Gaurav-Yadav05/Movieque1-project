const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");


// =========================
// ➕ ADD REVIEW (SAFE + NO DUPLICATE)
// =========================
router.post("/add", auth, (req, res) => {
  const userId = req.user.id;
  const { movie_id, rating, review } = req.body;

  // validation
  if (!movie_id || !rating || !review) {
    return res.status(400).json({
      message: "All fields are required ❌",
      received: req.body
    });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Rating must be between 1 and 5 ❌"
    });
  }

  // check duplicate review
  const checkSql = "SELECT id FROM reviews WHERE user_id = ? AND movie_id = ?";
  db.query(checkSql, [userId, movie_id], (err, existing) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error ❌" });
    }

    if (existing.length > 0) {
      return res.status(409).json({
        message: "You already reviewed this movie ❌"
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
});


// =========================
// 📥 GET REVIEWS (WITH USERNAME + AVG RATING)
// =========================
router.get("/:movie_id", (req, res) => {
  const movieId = req.params.movie_id;

  const sql = `
    SELECT 
      r.id,
      r.movie_id,
      r.rating,
      r.review,
      r.created_at,
      u.username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.movie_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(sql, [movieId], (err, result) => {
    if (err) {
      console.log("FETCH ERROR:", err);
      return res.status(500).json({ message: "Error fetching reviews ❌" });
    }

    // calculate average rating
    const avgRating =
      result.length > 0
        ? (result.reduce((sum, r) => sum + r.rating, 0) / result.length).toFixed(1)
        : null;

    res.json({
      reviews: result,
      averageRating: avgRating,
      totalReviews: result.length
    });
  });
});

module.exports = router;