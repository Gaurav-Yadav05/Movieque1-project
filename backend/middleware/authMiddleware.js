const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    let token = authHeader;

    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.slice(7);
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is missing in .env");
        return res.status(500).json({ message: "Server misconfigured" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch (err) {
        console.error("JWT ERROR:", err.message);

        return res.status(401).json({
            message: "Invalid token"
        });
    }
};