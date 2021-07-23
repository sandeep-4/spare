const Sub=require('../models/sub');
const Product=require('../models/product');
const slugify=require('slugify');

exports.create=async(req,res)=>{
    try {
        const {name,parent}=req.body;
        const sub=await new Sub({name,parent,slug:slugify(name)}).save();
        res.json(sub);
    } catch (error) {
        res.status(403).send('Create sub denied '+error);
    }
}
exports.list=async(req,res)=>{
    const subs=await Sub.find({}).sort({createdAt:-1}).exec();
    res.json(subs);
}


exports.read=async(req,res)=>{
    let sub=await Sub.findOne({slug:req.params.slug}).exec();
    let products=await Product.find({subs:sub}).populate('category').exec();
    res.json({
        sub,
        products
    });
    
}
exports.update=async(req,res)=>{
    const {name,parent}=req.body;
    try {
        const updated=await Sub.findOneAndUpdate({slug:req.params.slug},
            {name,parent,slug:slugify(name)}
            ,{new:true});
            res.json(updated);
    } catch (error) {
        res.status(403).send('unable to update'); 
    }
}
exports.remove=async(req,res)=>{
    try {
        const deleted=await Sub.findOneAndDelete({slug:req.params.slug});
        res.json(deleted)

    } catch (error) {
        res.status(403).send('unable to delete');
    }
}

