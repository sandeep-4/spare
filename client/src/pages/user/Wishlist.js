import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import { getWishlist, removeWishlist } from "../../functions/user";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import {toast} from 'react-toastify';


const Wishlist=()=>{

  const [wishlist,setWishlist]=useState([]);
  const {user}=useSelector((state)=>({...state}));

  useEffect(()=>{
    loadAllWishlist();
  },[]);

  const loadAllWishlist=()=>{
    getWishlist(user.token).then((res)=>{
      setWishlist(res.data.wishlist);
    }).then((err)=>console.log(err));
  }
  
  const handleRemove=(productId)=>{
    removeWishlist(productId).then((res)=>{
      toast.error('Removed from wishlist');
      loadAllWishlist();
    })
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>Wishlist</h4>

          {wishlist.map((p) => (
            <div key={p._id} className="alert alert-secondary">
              <Link to={`/product/${p.slug}`}>{p.title}</Link>
              <span
                onClick={() => handleRemove(p._id)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist;
