// utils/generateToken.js
// Creates a signed JWT and sets it as an httpOnly cookie
// httpOnly means JS in the browser cannot read it → more secure

const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  // Sign the token with the user's ID as payload
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // e.g. "7d"
  });

  // Set cookie options
  res.cookie("prepwork_token", token, {
    httpOnly: true,                          // Not accessible via document.cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",                             // Make cookie valid for all API paths
    maxAge: 7 * 24 * 60 * 60 * 1000,        // 7 days in milliseconds
  });
};

module.exports = generateToken;
