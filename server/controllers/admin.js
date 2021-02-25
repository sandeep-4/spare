const User=require('../models/user');
const Order=require('../models/order');

exports.orders=async(req,res)=>{

    const allOrders=await Order.find({})
    .sort("-createdAt")
    .populate("products.product")
    .exec();

    res.json(allOrders);
}

exports.orderSatus=async(req,res)=>{

    const {orderId,orderSatus}=req.body;

    let updated=await Order.findByIdAndUpdate(orderId,{orderSatus},{new :true}).exec();

    res.json(updated);
}