import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from "../functions/user";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CheckOut = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");

  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const dispatch = useDispatch();
  const { user, COD } = useSelector((state) => ({ ...state }));
  const { couponTrueOrFalse } = useSelector((state) => state.coupon);

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, []);

  const emptyCart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    //backend removal
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount(0);
      setCoupon("");
      toast.success("Shop more");
    });
  };

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address saved sucessfully");
      }
    });
  };

  const applyDiscountCoupon = () => {
    applyCoupon(user.token, coupon).then((res) => {
      if (res.data) {
        setTotalAfterDiscount(res.data);
        dispatch({
          type: "COUPON_APPLIED",
          payload: true,
        });
      }
      if (res.data.err) {
        setDiscountError(res.data.err);
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
      }
    });
  };

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>
  );

  const showProductSummary = () =>
    products.map((p, i) => (
      <div key={i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} ={" "}
          {p.product.price * p.count}
        </p>
      </div>
    ));

  const showApplyCoupon = () => (
    <>
      <input
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError("");
        }}
        value={coupon}
        type="text"
        className="form-control"
      />
      <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
        Apply
      </button>
    </>
  );
  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, couponTrueOrFalse).then((res) => {
      console.log("USER CASH ORDER CREATED RES ", res);
      // empty cart form redux, local Storage, reset coupon, reset COD, redirect
      if (res.data.ok) {
        // empty local storage
        if (typeof window !== "undefined") localStorage.removeItem("cart");
        // empty redux cart
        dispatch({
          type: "ADD_TO_CART",
          payload: [],
        });
        // empty redux coupon
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
        // empty redux COD
        dispatch({
          type: "COD",
          payload: false,
        });
        // mepty cart from backend
        emptyUserCart(user.token);
        // redirect
        setTimeout(() => {
          history.push("/user/history");
        }, 1000);
      }
    });
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4 style={{ color: "white" }}>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4 style={{ color: "white" }}>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>

      <div className="col-md-6">
        <h4 style={{ color: "white" }}>Summary of Order</h4>
        <hr />
        <p style={{ color: "white" }}>Products {products.length}</p>
        <hr />
        {showProductSummary()}
        <hr />
        <p>Cart Total: {total}</p>

        {totalAfterDiscount > 0 && (
          <p className="bg-dark p-2">
            Discount Applied: Total Payable: Rs {totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            {COD ? (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={() => history.push("/payment")}
              >
                Place Order
              </button>
            )}
          </div>

          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
