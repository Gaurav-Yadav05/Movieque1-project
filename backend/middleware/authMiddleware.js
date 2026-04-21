const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided ❌" });
  }

  // ✅ Extract token from "Bearer TOKEN"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Invalid token format ❌" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Unauthorized ❌" });
  }
}

module.exports = verifyToken;