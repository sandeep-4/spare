const express=require('express');
const router=express.Router();

const {authCheck} =require('../middlewares/auth');
//controller
const {userCart,getUserCart,
    emptyCart,saveAddress,
    applyCouponToUserCart,
    createOrder,orders,createCashOrder,
    addToWishlist,wishlist,removeFromWishlist
}=require('../controllers/user');

//routes
router.get("/user",(req,res,next)=>{
    res.status(200).json({
        sucesss:true,
        message:"Hello Nile world from user"
    })
})

router.post('/user/cart',authCheck,userCart);
router.get('/user/cart',authCheck,getUserCart);
router.delete('/user/cart',authCheck,emptyCart);
router.post('/user/address',authCheck,saveAddress);

//order
router.post('/user/order',authCheck,createOrder);            //with stripe
router.post('/user/cash-order',authCheck,createCashOrder);  //cod
router.get('/user/orders',authCheck,orders);

//coupon
router.post('/user/cart/coupon',authCheck,applyCouponToUserCart);

//wishlist
router.post('/user/wishlist',authCheck,addToWishlist);
router.get('/user/wishlists',authCheck,wishlist);
router.put('/user/wishlist/:productId',authCheck,removeFromWishlist);


module.exports=router;