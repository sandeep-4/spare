const express=require('express');

const router=express.Router();

//imports
const {create,readAll,listAll,update,remove,read,
    list,productsCount,productStar,listRelated,searchFilters} =require('../controllers/product');

//middleawares
const {authCheck,adminCheck} =require('../middlewares/auth');

//rout
router.post("/product",authCheck,adminCheck,create);
router.get("/products/total",productsCount);

router.get("/productss",readAll);
router.get("/products/:count",listAll);
router.delete("/product/:slug",authCheck,adminCheck,remove);
router.get("/product/:slug",read);
router.put("/product/:slug",authCheck,adminCheck,update);

router.post("/products",list);
router.put('/product/star/:productId',authCheck,productStar);
router.get('/product/related/:productId',listRelated);

router.post('/search/filters',searchFilters);






module.exports=router;
