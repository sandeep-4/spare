const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema;

const subSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'name is required'],
        minlength:[3,'too short'],
        maxlength:[32,'max length']
    },
    slug:{
        type:String,
        unique:true,
        lowercse:true,
        index:true
    },
    parent:{
        type:ObjectId,
        ref:'Category',
        required:true
    },
},{timestamps:true})

module.exports=mongoose.model('Sub',subSchema);
