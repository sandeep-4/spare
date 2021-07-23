const express = require("express");

const router = express.Router();

// middlewares
const { authCheck } = require("../middlewares/auth");

//controllers
const { createOrder, orders, createCashOrder } = require("../controllers/order");


router.post("/user/order",authCheck,createOrder);
router.post('/user/cash-order',authCheck,createCashOrder);
router.get('/user/orders',authCheck,orders);

module.exports=router;