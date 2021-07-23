const express=require('express');

//controllers
const { create, listAll, remove, read, update, list,
     productsCount, productStar, listRelated, searchFilters} = require('../controllers/product');

//middlewares
const { authCheck, adminCheck } = require('../middlewares/auth');

const router=express.Router();

//routes

router.post("/product",authCheck,adminCheck,create);
router.get('/products/total',productsCount);
router.get("/products/:count",listAll);
router.get('/product/related/:productId',listRelated);

router.delete("/product/:slug",authCheck,adminCheck,remove);
router.get("/product/:slug",read); 
router.put("/product/:slug",authCheck,adminCheck,update); 

router.post('/products',list);
router.put('/product/star/:productId',authCheck,productStar);

router.post('/search/filters',searchFilters);



module.exports=router;