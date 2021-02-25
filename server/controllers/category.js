const { default: slugify } = require('slugify');
const { findOneAndUpdate } = require('../models/category');
const Category=require('../models/category');
const Sub=require('../models/sub');
const Product =require('../models/product');

// create,read,list,update,remove

exports.create=async(req,res)=>{
    try {
        const {name}=req.body;
        const category=await new Category({name,slug:slugify(name)}).save();
        res.status(200).json({
            category
        })
    } catch (error) {
        res.status(403).json({
            message:error.message
        })
    }
}

exports.read=async(req,res)=>{
    
    let category=await Category.findOne({slug:req.params.slug}).exec();

    const products=await Product.find({category}).populate('category').exec();

    res.status(200).json({
        category,
        products
    })
}

exports.list=async(req,res)=>{
    const categories=await Category.find({}).sort({createAt: -1}).exec();
    res.status(200).json(categories);
}

exports.update=async(req,res)=>{
    const {name}=req.body;
    try {
        const updated=await Category.findOneAndUpdate(
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
        const deleted=await Category.findOneAndDelete({slug:req.params.slug});
        res.json(deleted);
    } catch (error) {
        res.status(403).json({
            message:error.message
        })
    }
}

exports.getSubs=async(req,res)=>{
    try {
        const subs=await Sub.find({parent:req.params._id});
        res.json(subs);
    } catch (error) {
        res.status(403).json({
            message:error.message
        })
    }
}