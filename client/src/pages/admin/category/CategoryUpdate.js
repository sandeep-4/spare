import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCategory, updateCategory } from "../../../functions/category";
import CategoryForm from "../../../components/forms/CategoryForm";

// import {useParams} from 'react-router-dom';

const CategoryUpdate=({history,match})=>{

  const {user}=useSelector((state)=>({...state}));

  const [name,setName]=useState('');
  const [loading,setLoading]=useState(false);

  // let {slug}=useParams()
  useEffect(()=>{
    loadCategory();
  },[])

  const loadCategory=()=>{
      getCategory(match.params.slug).then((c)=>setName(c.data.name));
  }

  const handleSubmit=(e)=>{
      e.preventDefault();
      setLoading(true);
      updateCategory(match.params.slug,{name},user.token)
      .then((res)=>{
          setLoading(false);
          setName('')
          toast.success(` update sucessfully`)
          
          history.push('/admin/category')
      })
      .catch((err)=>{
          setLoading(false);
          toast.error('set category',err.message)
          // history.push('/admin/category')

      
      })
  }




  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          
        
        {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Update category</h4>
          )}
          
          <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName}/>
          <hr />
        </div>
      </div>
    </div>
  );
          }

export default CategoryUpdate;