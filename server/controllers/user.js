const Cart=require('../models/cart');
const Product=require('../models/product');
const User=require('../models/user');
const Coupon=require('../models/coupon');
const Order=require('../models/order');
const uniqueid = require("uniqueid");


//apis

//cart apis
exports.userCart=async(req,res)=>{
    const {cart}=req.body;
    let products=[]

    const user=await User.findOne({email:req.user.email}).exec();
    // console.log(user);

    //show if cart existed already
    let cartExistByThisUser=await Cart.findOne({orderedBy:user._id}).exec();
    // console.log(cartExistByThisUser);
    if(cartExistByThisUser){
        cartExistByThisUser.remove();
        console.log("remove old cart")
    }

    for(let i=0;i<cart.length;i++){
        let object={}

        object.product=cart[i]._id;
        object.count=cart[i].count;
        object.color=cart[i].color;

        //getting price

        //change back to previous if reuired
        //  let {price}=await Product.findById(cart[i]._id).select("price").exec();
        // object.price=price;
        // console.log(price);

        let productFromDb = await Product.findById(cart[i]._id)
        .select("price")
        .exec();
        // console.log("product from db----> ",productFromDb);
      object.price = productFromDb.price;


        products.push(object);
    }

    let cartTotal=0;
    for(let i=0;i<products.length;i++){
        cartTotal=cartTotal+products[i].price *products[i].count;
    }

    let newCart=await Cart.create({
        products,
        cartTotal,
        orderedBy:user._id
    });

    // let newCart=await new Cart({
    //     products,
    //     cartTotal,
    //     createdBy:user._id
    // }).save();

    res.json({ok:true,newCart});
    // res.json(saveCart);
}

exports.getUserCart=async(req,res)=>{
    const user=await User.findOne({email:req.user.email}).exec();

    let cart=await Cart.findOne({orderedBy:user._id})
    .populate('products.product','_id title price totalAfterDiscount').exec();

    const {products,cartTotal,totalAfterDiscount}=cart;  
    // console.log(products,cartTotal,totalAfterDiscount);
    res.json({products,cartTotal,totalAfterDiscount});
}

exports.emptyCart=async(req,res)=>{
    const user=await User.findOne({email:req.user.email}).exec();

    let cart=await Cart.findOneAndRemove({orderedBy:user._id}).exec();
    res.json(cart);
}

//adress saving api

exports.saveAddress=async(req,res)=>{
    const userAddress=await User.findOneAndUpdate({email:req.user.email},
        {address:req.body.address}).exec();
    res.json({ok:true});
}

//coupons apis

exports.applyCouponToUserCart=async(req,res)=>{
    const {coupon}=req.body;

    const validCoupon=await Coupon.findOne({name:coupon}).exec();
    if(validCoupon===null){
        return res.json({
            err:"Invalid Coupon"
        })
    }

    const user=await User.findOne({email:req.user.email}).exec();

    let{products,cartTotal}=await Cart.findOne({orderedBy:user._id})
    .populate("products.product","_id title price").exec();


    let totalAfterDiscount=(cartTotal-(cartTotal*validCoupon.discount)/100).toFixed(2);

   await Cart.findOneAndUpdate(
       {orderedBy:user._id},
       {totalAfterDiscount},
       {new :true}
       ).exec();

   res.json(totalAfterDiscount);
}


//orders apis

exports.createOrder=async(req,res)=>{
    const {paymentIntent}=req.body.stripeResponse;

    const user=await User.findOne({email:req.user.email}).exec();

    let {products}=await Cart.findOne({orderedBy:user._id}).exec();

    let newOrder=await new Cart({
        products,
        paymentIntent,
        orderedBy:user._id
    }).save();

    //now decrease quantity and increase the sales
    let bulkOption=products.map((item)=>{
        return {
            updateOne:{
                filter:{_id:item.product._id},
                update:{$inc:{quantity: -item.count ,sold:+item.count}}
            }
        }
    })

    let updated =await Product.bulkWrite(bulkOption,{new:true});
    // console.log('Updated product quantity ----->',updated);

    res.json({ok:true});
}

exports.orders=async(req,res)=>{
    let user=await User.findOne({email:req.user.email}).exec();

    let userOrders=await Order.find({orderedBy:user._id}).populate('products.product').exec();

    res.json(userOrders);
}


//wishlist apis
exports.addToWishlist=async(req,res)=>{
const {productId}=req.body;
const user=await User.findOneAndUpdate({email:req.user.email}
    ,{$addToSet:{wishlist:productId}}).exec();

    res.json({ok:true});

}

exports.wishlist=async(req,res)=>{
    const list=await User.findOne({email:req.user.email})
    .select('wishlist')
    .populate('wishlist')
    .exec();

    res.json(list);
}

exports.removeFromWishlist=async(req,res)=>{
    const {productId}=req.params;

    const user=await User.findOneAndUpdate(
        {email:req.user.email},
        {$pull:{wishlist:productId}}
        ).exec();
    res.json({ok:true});

}




exports.createCashOrder=async (req,res)=>{

    const {COD,couponApplied}=req.body;

    if(!COD){
        return res.send(400).send('Create cash order failed');
    }

 
    const user=await User.findOne({email:req.user.email}).exec();

    let userCart=await Cart.findOne({orderedBy:user._id}).exec();

    let finalAmount=0;
    if(couponApplied && userCart.totalAfterDiscount){
        finalAmount=Math.round(userCart.totalAfterDiscount *100);
    }else{
        finalAmount=Math.round(userCart.cartTotal *100);
    }


    let newOrder=await new Cart({
        products:userCart.products,
        paymentIntent:{
                id:uniqueid,
                amount:finalAmount,
                currency:"usd",
                status:"Cash On Delivery",
                created:Date.now(),
                payment_method_types:['cash']
        },
        orderedBy:user._id,
        orderStatus:"Cash On Delivery"
    }).save();

    //now decrease quantity and increase the sales
    let bulkOption=userCart.products.map((item)=>{
        return {
            updateOne:{
                filter:{_id:item.product._id},
                update:{$inc:{quantity: -item.count ,sold:+item.count}}
            }
        }
    })

    let updated =await Product.bulkWrite(bulkOption,{new:true});
    // console.log('Updated product quantity ----->',updated);

    res.json({ok:true});
}
