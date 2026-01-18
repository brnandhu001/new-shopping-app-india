const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartControllers");


router.post("/",  cartController.addToCart);
router.get("/", cartController.getCart);
router.put("/",  cartController.updateCartItem);
router.delete("/:productId", cartController.removeFromCart);
router.delete("/",  cartController.clearCart);

module.exports = router;
