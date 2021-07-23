const Product=require('../models/product');
const slugify=require('slugify');
const User = require('../models/user');
const { aggregate } = require('../models/product');


exports.create=async(req,res)=>{
    try {
        req.body.slug=slugify(req.body.title);
        const dublicate=await Product.findOne({slug:slugify(req.body.title)});
        if(dublicate){
            res.status(400).json({
                err:'Dublicate title select next please'
            });
        }
 
        const newProduct=new Product(req.body).save();
        res.json(newProduct);     
    } catch (err) {
        res.status(400).json({
            err:err.message,
        });
    }
}

exports.listAll=async(req,res)=>{
    let products=await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category')
    .populate('subs')
    .sort([['createdAt','desc']])
    .exec();
    res.json(products);
}

exports.remove=async(req,res)=>{
    try {
        const deleted=await Product.findOneAndRemove({slug:req.params.slug}).exec();
        res.json(deleted);
    } catch (error) {
        return res.status(400).send('Product cant deleted');
    }
}

exports.read=async(req,res)=>{
    const product=await Product.findOne({slug:req.params.slug})
    .populate('category')
    .populate('subs')
    .exec();
    res.json(product);
}

exports.update=async(req,res)=>{
    try {
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const updated=await Product.findOneAndUpdate({slug:req.params.slug},
            req.body,
            {new:true}).exec();
        res.json(updated);
    } catch (error) {
        res.status(400).json({
            err:err.message,
        }); 
    }
}

// exports.list=async(req,res)=>{
//     try {
//         const {sort ,order,limit}=req.body;
//         const products=await Product.find({})
//         .populate('category')
//         .populate('subs')
//         .sort([[sort,order]])
//         .limit(limit)
//         .exec();

//         res.json(products);

//     } catch (error) {
//         console.log(error);
//     }
// }

exports.list=async(req,res)=>{
    try {
        const {sort ,order,page}=req.body;

        const currentPage=page || 1;
        const perPage=3


        const products=await Product.find({})
        .skip((currentPage-1)*3)
        .populate('category')
        .populate('subs')
        .sort([[sort,order]])
        .limit(perPage)
        .exec();

        res.json(products);

    } catch (error) {
        console.log(error);
    }
}


exports.productsCount=async(req,res)=>{
    let total=await Product.find({}).estimatedDocumentCount().exec();
    res.json(total);
}

exports.productStar=async(req,res)=>{

    try {
        const product=await Product.findById(req.params.productId).exec();
        const user=await User.findOne({email:req.user.email}).exec();
        const {star}=req.body;
    
        //checking if the current user has alredry rated
        let existingRatingObject=product.ratings.find((ele)=>(ele.postedBy.toString() === user._id.toString()))
    
        //if user hasnt rated the rate it
        if(existingRatingObject===undefined){
            let ratingAdded=await Product.findByIdAndUpdate(
                product._id,
                {
                $push:{ratings:{star,postedBy:user._id}}
            },
            {new:true}).exec();
            res.json(ratingAdded);
        }else{
            //updating previous updates
            const ratingUpdated= await Product.updateOne({
                ratings:{$elemMatch:existingRatingObject},
            },{$set:{"ratings.$.star":star}},
            {new:true}).exec();
            res.json(ratingUpdated);
        }
        
    } catch (error) {
        console.log(error);
    }

  
}

exports.listRelated=async(req,res)=>{
    const product=await Product.findById(req.params.productId).exec();
    const related=await Product.find({
        _id:{$ne:product._id},
        category:product.category,
    }).limit(3)
    .populate('category')
    .populate('subs')
    .populate('postedBy')
    .exec();

    res.json(related);

}

const handleQuery=async(req,res,query)=>{
    const products=await Product.find({$text: {$search:query}})
    .populate('category', '_id name')
    .populate('subs','_id name')
    .populate('postedBy','_id name')
    .exec();

    res.json(products);
}

const handlePrice=async(req,res,price)=>{
    try {
        let products=await Product.find({
            price:{
                $gte:price[0],
                $lte:price[1]
            }
        }).populate('category', '_id name')
        .populate('subs','_id name')
        .populate('postedBy','_id name')
        .exec();
        res.json(products);  
    } catch (error) {
        console.log(error);
        
    }
}

const handleCategory=async(req,res,category)=>{
    try {
        let products=await Product.find({category})
        .populate('category','_id name')
        .populate('subs','_id name')
        .populate('postedBy' ,'_id name')
        .exec();
        res.json(products);
    } catch (error) {
        console.log(error);
    }
}

const handleStar=async(req,res,stars)=>{
    try {
      await  Product.aggregate([
            {
                $project:{
                    document:"$$ROOT",
                    floorAverage:{
                        $floor:{$avg:"$ratings.star"}
                    }
                }
            }
            ,{$match:{floorAverage:stars}}
        ]).limit(12)
        .exec(async(err,aggregrates)=>{
            if(err) console.log(err);
            await Product.find({_id:aggregrates})
            .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec((err,products)=>{
            if(err) console.log(err);
            res.json(products);
        })
        })
    } catch (error) {
        console.log(error);
    }
}

const handleSub=async(req,res,sub)=>{
    try {
        let products=await Product.find({subs:sub})
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec();
        res.json(products);
    } catch (error) {
        console.log(error);
    }
}

const handleShipping=async(req,res,shipping)=>{
    try {
        let products=await Product.find({shipping})
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec();
        res.json(products);
    } catch (error) {
        console.log(error);
    }
}

const handleColor=async(req,res,color)=>{
    try {
        const products=await Product.find({color})
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec();
        res.json(products);
    } catch (error) {
        console.log(error);
    }
}

const handleBrand=async(req,res,brand)=>{
    try {
        let products=await Product.find({brand})
        .populate("category", "_id name")
        .populate("subs", "_id name")
        .populate("postedBy", "_id name")
        .exec();
        res.json(products);
    } catch (error) {
        console.log(error);
    }
}


exports.searchFilters=async(req,res)=>{
    const {query,price,category,stars,sub,shipping,color,brand}=req.body;
    if(query){
        await handleQuery(req,res,query);
    }
    if(price !==undefined){
        await handlePrice(req,res,price);
    }
    if(category){
        await handleCategory(req,res,category);
    }
    if(stars){
        await handleStar(req,res,stars);
    }
    if(sub){
        await handleSub(req,res,sub);
    }
    if(shipping){
        await handleShipping(req,res,shipping);
    }
    if(color){
        await handleColor(req,res,color);
    }
    if(brand){
        await handleBrand(req,res,brand);
    }
}