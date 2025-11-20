const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { auth, role } = require("../middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);

router.post("/refresh", userController.refreshToken);
router.post("/logout", userController.logout);

// Protected route
router.get("/profile", auth, (req, res) => {
  res.json({ msg: "Profile", user: req.user });
});

// Admin only
router.get("/admin", auth, role("admin"), (req, res) => {
  res.json({ msg: "Only Admin Allowed" });
});

module.exports = router;
