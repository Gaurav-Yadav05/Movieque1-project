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

    if (!movie_id) {
        return res.status(400).json({ message: "movie_id is required" });
    }

    const checkQuery = `
        SELECT * FROM watchlist 
        WHERE user_id = ? AND movie_id = ?
    `;

    db.query(checkQuery, [userId, movie_id], (err, result) => {
        if (err) {
            console.error("DB ERROR (CHECK):", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (result.length > 0) {
            return res.status(409).json({ message: "Already in watchlist" });
        }

        const insertQuery = `
            INSERT INTO watchlist (user_id, movie_id)
            VALUES (?, ?)
        `;

        db.query(insertQuery, [userId, movie_id], (err2) => {
            if (err2) {
                console.error("DB ERROR (INSERT):", err2);
                return res.status(500).json({ message: "Insert failed ❌" });
            }

            res.json({ message: "Added to watchlist ⭐" });
        });
    });
});


// =========================
// 📥 GET WATCHLIST
// =========================
router.get("/", auth, (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT 
            m.id AS movie_id,
            m.title,
            m.poster,
            m.genre,
            m.year
        FROM watchlist w
        JOIN movies m ON w.movie_id = m.id
        WHERE w.user_id = ?
    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error("FETCH ERROR:", err);
            return res.status(500).json({ message: "Error loading watchlist ❌" });
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

    const deleteQuery = `
        DELETE FROM watchlist 
        WHERE user_id = ? AND movie_id = ?
    `;

    db.query(deleteQuery, [userId, movieId], (err) => {
        if (err) {
            console.error("DELETE ERROR:", err);
            return res.status(500).json({ message: "Delete failed ❌" });
        }

        res.json({ message: "Removed from watchlist ❌" });
    });
});

module.exports = router;