const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;

const subSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:'Name is required',
        minlemgth:['2','Too short'],
        maxlemgth:['32','Too long']
    },
    slug:{
        type:String,
        index:true,
        unique:true,
        lowercase:true
    },
    parent:{type:ObjectId,ref:'Category',required:true}
},{timestamps:true})

module.exports=mongoose.model('Sub',subSchema);