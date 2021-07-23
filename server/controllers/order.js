const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/order");
const uniqueId = require("uniqueid");

exports.createOrder=async(req,res)=>{
    const {paymentIntent}=req.body.stripeResponse;
    const user=await User.findOne({email:req.user.email}).exec();

    let {products}=await Cart.findOne({orderedBy:user._id}).exec();

    let newOrder=await new Order({
        products,
        paymentIntent,
        orderedBy:user._id
    }).save();

    //decreasimng quantity and increasing sold
    let bulkOption=products.map((item)=>{
        return{
            updateOne:{
                filter:{_id:item.product._id},
                update:{$inc:{quantity:-item.count,sold:+item.count}},
            }
        }
    })

    let updated=await Product.bulkWrite(bulkOption,{});

    res.json({ok:true});
}

exports.orders=async(req,res)=>{
    let user=await User.findOne({email:req.user.email}).exec();

    let userOrders=await Order.find({orderedBy:user._id})
    .populate('products.product')
    .exec();

    res.json(userOrders);
}

exports.createCashOrder=async(req,res)=>{
    const {COD,couponApplied}=req.body;
    if(!COD) return res.status(400).send('Not able to create cash order');

    const user=await User.findOne({email:req.user.email}).exec();

    let userCart=await Cart.findOne({orderedBy:user._id}).exec();

    let finalAmount=0;

    if(couponApplied && userCart.totalAfterDiscount){
        finalAmount=userCart.totalAfterDiscount*100;
    }else{
        finalAmount=userCart.cartTotal*100;
    }

    let newOrder=await new Order({
        products:userCart.products,
        paymentIntent:{
            id:uniqueId(),
            amount:finalAmount,
            currency:"usd",
            status:"Cash On Delivery",
            created:Date.now(),
            payment_method_types:['cash'],
        },
        orderedBy:user._id,
        orderStatus:"Cash On Delivery"
    }).save();

    //decrement quantity and increase sold

    let bulkOption=userCart.products.map((item)=>{
        return{
            updateOne:{
                filter:{_id:item.product._id},
                update:{$inc:{quantity:-item.count,sold:+item.count}}
            }
        }
    })

    let update=await Product.bulkWrite(bulkOption,{});

    res.json({ok:true});


}