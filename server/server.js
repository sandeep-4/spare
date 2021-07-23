const express=require('express');
const app=express();
const mongoose=require('mongoose');
const morgan=require("morgan");
const cors=require('cors');
const bodyParser=require('body-parser');
const {readdirSync}=require('fs');
require('dotenv').config();

const port=process.env.PORT || 8000;

mongoose.connect(process.env.DATABASE,{
useNewUrlParser:true,
useFindAndModify:false,
useCreateIndex:true,
useUnifiedTopology:true
}).then(()=>{
    console.log("Connected to mongoDB");
}).catch((err)=>{
    console.log("error connecting to mongoDB ",err.message);
})


app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})

//middlewares
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//reading all routes now
readdirSync('./routes').map((r)=>app.use("/api",require("./routes/"+r)));


