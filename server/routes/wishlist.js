const express = require("express");

const router = express.Router();

// middlewares
const { authCheck } = require("../middlewares/auth");

//controllers
const { addToWishlist, wishlist, removeFromWishlist } = require("../controllers/wishlist");


router.post("/user/wishlist",authCheck,addToWishlist);
router.get("/user/wishlist",authCheck,wishlist);
router.put("/user/wishlist/:productId",authCheck,removeFromWishlist);

module.exports=router;