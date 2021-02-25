const admin=require('../firebase/index');
const User=require('../models/user');

exports.authCheck=async(req,res,next)=>{
// console.log(req.headers);
try {
    const firebaseUser=await admin.auth().verifyIdToken(req.headers.authtoken);
    // console.log('checking',firebaseUser)
    req.user=firebaseUser;
     next();
} catch (error) {
    res.status(400).json({
        error:"Invalid or expired"
    })
}
}

exports.adminCheck=async(req,res,next)=>{
    const {email}=req.user;

    const adminUser=await User.findOne({email}).exec();
   
    if(adminUser.role !== "admin"){
        res.status(403).json({
            err:"Admin Resorces ! Acess Denied"
        })
    }else{
        // console.log(adminUser)
        next();
    }
}