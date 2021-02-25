import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createProduct,
  getProducts,
  removeProduct,
} from "../../../functions/product";
import {getCategories,getCategorySubs} from "../../../functions/category";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ProductCreateForm from '../../../components/forms/ProductCreateForm';
import FileUpload from '../../../components/forms/FileUpload';
import {LoadingOutlined} from '@ant-design/icons';
// import LocalSearch from "../../../components/forms/LocalSearch";


const initalState={
  title: "Windows",
description: "best windows 10",
price: "15000",
categories: [],
category: "",
subs: [],
shipping: "Yes",
quantity: "25",
images: [],
colors: ["Black","Brown","Red","Green"],
brands: ["Microsoft","HP","Lenevo","Samsung"],
color: "Red",
brand: "HP",
}

const ProductCreate=()=>{

  const [values,setValues]=useState(initalState);
  const [subOptions,setSubOptions]=useState([]);
  const [showSub,setShowSub]=useState(false);
  const [loading,setLoading]=useState(false);
  // const [categories,setCategories]=useState([]);

  const {user}=useSelector((state)=>({...state}));

  useEffect(()=>{
    loadCategories()
},[]);
const loadCategories=()=>{
  getCategories().then((c)=>setValues({...values,categories:c.data}));
}

  const handleSubmit=(e)=>{
    e.preventDefault();
    createProduct(values,user.token)
    .then((res)=>{
      toast.success("product saved");
      window.alert("Product has been created");
      window.location.reload();
    }).catch((err)=>toast.error(err.response.data.err));

  }

  const handleChange=(e)=>{
    setValues({...values,[e.target.name]:e.target.value});
  }

  const handleCategoryChange=(e)=>{
    setValues({...values,subs:[],category:e.target.value});
    getCategorySubs(e.target.value)
    .then((res)=>{
      console.log(res);
      setSubOptions(res.data);
    })
    ;
    setShowSub(true);
  }

    return (
      <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
        {loading? <LoadingOutlined className="text-danger h1"/>:  
        <h4>Product Create Form</h4>}
          <hr />
          
{JSON.stringify(values.images)}
          
          <div className="p-3">
          <FileUpload values={values} setValues={setValues} setLoading={setLoading} />
          </div>

          <ProductCreateForm handleSubmit={handleSubmit} 
          handleChange={handleChange}
          values={values}
          handleCategoryChange={handleCategoryChange}
          subOptions={subOptions}
          showSub={showSub}
          setValues={setValues}
          />
        </div>
      </div>
    </div>
      );
}

export default ProductCreate;