import React, {useEffect,useState}from "react";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import AdminNav from '../../../components/nav/AdminNav';
import {getProductsByCount} from '../../../functions/product';
import {removeProduct} from '../../../functions/product';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';

const AllProducts = () => {
  const [products,setProducts]=useState([]);
  const [loading,setLoading]=useState(false);

  const {user}=useSelector((state) =>({...state}));

  useEffect(() => {
   loadAllProducts();
  }, [ ])

  const loadAllProducts=()=>{
    setLoading(true);
    getProductsByCount(100).then((res)=>{
      // console.log(res.data)
      setProducts(res.data)
      // console.log(setProducts(res.data))
      setLoading(false)
    }).catch((err)=>{
    setLoading(false);
      console.log(err)
    })
  }

  const handleRemove=(slug)=>{
      let answer= window.confirm('Delete ?');
      if(answer){
        //   console.log(slug);
        removeProduct(slug,user.token)
        .then((res)=>{
            loadAllProducts();
            toast.error("Delete sucessfully")
        }).catch((err)=>toast.error("error deleteing product"))
    }
  }

  return (
    <div className="container-fluid">
    <div className="row">
      <div className="col-md-2">
        <AdminNav />
      </div>

      <div className="col">
        {loading ? (
          <h4 className="text-danger">Loading...</h4>
        ) : (
          <h4>All Products</h4>
        )}
        <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-4">
            <AdminProductCard product={product} handleRemove={handleRemove} />
          </div>
        ))}
        </div>
      </div>
    </div>
  </div>
  );
};

export default AllProducts;
