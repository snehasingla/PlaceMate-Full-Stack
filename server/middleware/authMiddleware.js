// middleware/authMiddleware.js
// Protects routes by checking if the request has a valid JWT cookie

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check for token in cookies (our preferred method)
  token = req.cookies.prepwork_token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request object (without the password)
    req.user = await User.findById(decoded.id).select("-password");

    next(); // Continue to the actual route handler
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = { protect };
