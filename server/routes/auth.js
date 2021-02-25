const express=require('express');

const router=express.Router();

//imports
const {createOrUpdateUser,currentUser}=require('../controllers/auth');

//middleawares
const {authCheck,adminCheck} =require('../middlewares/auth');

//routes
router.post("/create-or-update-user",authCheck,createOrUpdateUser);
router.post("/current-user",authCheck,currentUser);
router.post("/current-admin",authCheck,adminCheck,currentUser);



module.exports=router;


