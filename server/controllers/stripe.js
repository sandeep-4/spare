const User=require('../models/user');
const Product=require('../models/product');
const Cart=require('../models/cart');
const Category=require('../models/category');
const Coupon=require('../models/coupon');
const Sub=require('../models/sub');

const stripe=require('stripe')(process.env.STRIPE_SECRET);

exports.createPaymentIntent=async(req,res)=>{

    const {couponApplied}=req.body;
    //apply coupon
    //apply price
    const user=await User.findOne({email:req.user.email}).exec();

    const {cartTotal ,totalAfterDiscount}=await Cart.findOne({orderedBy:user._id}).exec();

    let finalAmount=0;
    if(couponApplied && totalAfterDiscount){
        finalAmount=totalAfterDiscount *100;
    }else{
        finalAmount=cartTotal *100;
    }


    const paymentIntent=await stripe.paymentIntents.create({
        amount:cartTotal *100,
        currency:'usd'
    });
    res.send({
        clientSecret:paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable:finalAmount,
    });
}