import React, { useState } from "react";
import { Card ,Skeleton,Tooltip} from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import laptop from "../../images/laptop.png";
import { Link } from "react-router-dom";
import {showAverage} from '../../functions/rating';
import _ from 'lodash';
import {useDispatch,useSelector} from 'react-redux';


const { Meta } = Card;

const ProductCard = ({ product }) => {

  const [tooltip,setTooltip]=useState('Click to add')

  //redux
  const {user,cart}=useSelector((state)=>({...state}));
  const dispatch=useDispatch();


 const handleAddToCard=()=>{
   let cart=[];
   if(typeof window !== "undefined"){
     if(localStorage.getItem('cart')){
       cart=JSON.parse(localStorage.getItem('cart'));
     }

     //adding the product to cart
     cart.push({
       ...product,
       count:1,
     })
     //avoid dubliacay
     let unique=_.uniqWith(cart,_.isEqual);

     //saving locally
     localStorage.setItem('cart',JSON.stringify(unique));
     setTooltip("Added to cart");

     //add to redux state
     dispatch({
      type:'ADD_TO_CART',
      payload:unique,
    })

    //show sidedrawer
    dispatch({
      type:'SET_VISIBLE',
      payload:true,
    })
   }
 }


  // destructure
  const { images, title, description, slug ,price} = product;
  return (
    <>
    {product && product.ratings && product.ratings.length > 0 ? (
      showAverage(product)
    ) : (
      <div className="text-center pt-1 pb-3">No rating yet</div>
    )}

    <Card
      cover={
        <img
          src={images && images.length ? images[0].url : laptop}
          style={{ height: "150px", objectFit: "cover" }}
          className="p-1"
        />
      }
      actions={[
        <Link to={`/product/${slug}`}>
          <EyeOutlined className="text-warning" /> <br /> View Product
        </Link>,
       <Tooltip title={tooltip}>
       <a onClick={handleAddToCard} disabled={product.quantity < 1}>
       <ShoppingCartOutlined className="text-danger" /> <br /> 
       {product.quantity < 1 ? "Product out of Stock" :"Add to Cart"}
     </a>
       </Tooltip>,
      ]}
    >
      <Meta
        title={`${title} -${price}`}
        description={`${description && description.substring(0, 40)}...`}
      />
    </Card>
    </>
  );
};

export default ProductCard;
