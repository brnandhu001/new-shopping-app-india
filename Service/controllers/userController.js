const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../config/jwt");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    await User.create({ name, email, password, role });
    res.json({ msg: "User registered" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token in user document
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Refresh token API
exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ msg: "No refresh token" });

    // Find user with this refresh token
    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ msg: "Invalid refresh token" });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decode) => {
      if (err) return res.status(403).json({ msg: "Invalid refresh token" });

      // Generate new access token
      const newAccessToken = generateAccessToken(user);

      // Optional: Token rotation (create new refresh token)
      const newRefreshToken = generateRefreshToken(user);
      user.refreshToken = newRefreshToken;
      await user.save();

      res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      });
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { token } = req.body; // refresh token

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.json({ msg: "Logged out" });

    user.refreshToken = "";
    await user.save();

    res.json({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
