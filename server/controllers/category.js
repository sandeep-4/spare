const Category=require('../models/category');
const Product=require('../models/product');
const Sub=require('../models/sub');
const slugify=require('slugify');

exports.create=async(req,res)=>{
    try {
        const {name}=req.body;
        const category=await new Category({name,slug:slugify(name)}).save();
        res.json(category);
    } catch (error) {
        res.status(403).send('Create categorey denied');
    }
}
exports.list=async(req,res)=>{
    const categories=await Category.find({}).sort({createdAt:-1}).exec();
    res.json(categories);
}


exports.read=async(req,res)=>{
    let category=await Category.findOne({slug:req.params.slug}).exec();
    // res.json(category);
   const products= await Product.find({category})
    .populate('category')
    .exec();
    
    res.json({
        category,
        products 
    });
}
exports.update=async(req,res)=>{
    const {name}=req.body;
    try {
        const updated=await Category.findOneAndUpdate({slug:req.params.slug},
            {name,slug:slugify(name)}
            ,{new:true});
            res.json(updated);
    } catch (error) {
        res.status(403).send('unable to update'); 
    }
}
exports.remove=async(req,res)=>{
    try {
        const deleted=await Category.findOneAndDelete({slug:req.params.slug});
        res.json(deleted)

    } catch (error) {
        res.status(403).send('unable to delete');
    }
}

exports.getSubs=async(req,res)=>{
    await Sub.find({parent:req.params._id}).exec((err,subs)=>{
        if(err) console.log(err);
        res.json(subs);
    })
}

