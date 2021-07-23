const express=require('express');
const router=express.Router();

//controllers
const { upload, remove } = require('../controllers/cloudinary');

//middleware
const { authCheck, adminCheck } = require('../middlewares/auth');

router.post('/uploadimages',authCheck,adminCheck,upload);
router.post('/removeimage',authCheck,adminCheck,remove);


module.exports=router;