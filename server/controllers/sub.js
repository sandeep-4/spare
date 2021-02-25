const { default: slugify } = require('slugify');
const Sub=require('../models/sub');
const Product=require('../models/product');

// create,read,list,update,remove

exports.create=async(req,res)=>{
    try {
        const {name,parent}=req.body;
        const sub=await new Sub({name,parent,slug:slugify(name)}).save();
        res.status(200).json({
            sub
        })
    } catch (error) {
        res.status(403).json({
            message:error.message
        })
    }
}

exports.read=async(req,res)=>{
    
    let sub=await Sub.findOne({slug:req.params.slug}).exec();
    const products=await Product.find({subs:sub}).populate('category').populate('subs').exec();
    res.status(200).json({
        products,
        sub
    })
}

exports.list=async(req,res)=>{
    const categories=await Sub.find({}).sort({createAt: -1}).exec();
    res.status(200).json(categories);
}

exports.update=async(req,res)=>{
    const {name}=req.body;
    try {
        const updated=await Sub.findOneAndUpdate(
            {slug:req.params.slug}, 
            {name,slug:slugify(name)},
           { new:true});
           res.status(200).json({
               updated
           })
    } catch (error) {
        res.status(403).json({
            message:error.message
        })  
    }
}

exports.remove=async(req,res)=>{
    try {
        const deleted=await Sub.findOneAndDelete({slug:req.params.slug});
        res.json(deleted);
    } catch (error) {
        res.status(403).json({
            message:error.message
        })
    }
}

