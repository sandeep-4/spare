const express=require('express');
const mongoose=require('mongoose');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const cors=require('cors');
const {readdirSync}=require('fs');

require('dotenv').config();

const app=express();


const mongo=async()=>{

try {
    await mongoose.connect(process.env.DATABASE,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology: true 
    });

    console.log("Connected to mongoDB");
} catch (error) {
    console.log("Error connecting to mongoDB : ",error.message)
;}
}

    const port=process.env.port || 8000
 app.listen(port,()=>{
    console.log(`listening in port ${port}`)
 });

//calling mongo function
mongo();

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({limit:"50mb"}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cors());
app.use(express.json());


// routes middleware
//noe we should not imort everytime
readdirSync('./routes').map((r)=>app.use("/api",require('./routes/' +r)))
