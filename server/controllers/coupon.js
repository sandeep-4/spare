const Coupon=require('../models/coupon');

exports.create=async(req,res)=>{
   

try {
    // const {name,expiry,discount}=req.body
    const {name,expiry,discount}=req.body.coupon
    const coupon=await Coupon.create({name,expiry,discount});
    res.json(coupon);
    
} catch (error) {
    console.log(error.message);   
}
}

exports.list=async(req,res)=>{
    try {
        const coupons=await Coupon.find({})
        .sort({createdAt:-1})
        .exec();
        res.json(coupons);
    } catch (error) {
        console.log(error.message);
    }

}

exports.remove=async(req,res)=>{
    try {
        const coupon=await Coupon.findByIdAndRemove(req.params.couponId).exec();
        res.json(coupon);
    } catch (error) {
        console.log(error.message);
    }
}