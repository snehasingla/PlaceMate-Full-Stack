// utils/generateToken.js
// Creates a signed JWT and sets it as an httpOnly cookie
// httpOnly means JS in the browser cannot read it → more secure

const jwt = require("jsonwebtoken");

const generateToken = (res, userId, rememberMe = true) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d", // e.g. "7d" or "30d"
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  };

  if (rememberMe) {
    cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  }

  res.cookie("prepwork_token", token, cookieOptions);
};

module.exports = generateToken;
