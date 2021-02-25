const express = require("express");

const router = express.Router();

//imports
const { create, remove, list } = require("../controllers/coupon");

//middleawares
const { authCheck, adminCheck } = require("../middlewares/auth");

//routes
router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupons", list);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);

module.exports = router;
