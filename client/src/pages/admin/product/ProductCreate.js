import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { createProduct } from "../../../functions/product";
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import { getCategories, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";

const initialState = {
  title: "Spare auto part",
  description:
    "Spare part is avialable for sales in bulk and in retail as well.This spare part, spare, service part, repair part, or replacement part, is an interchangeable part that is kept in an inventory",
  price: "120",
  categories: [],
  category: "",
  subs: [],
  shipping: "Yes",
  quantity: "25",
  images: [],
  colors: ["Black", "White", "Green", "Red", "Yellow", "Default"],
  brands: ["Suzaki", "Honda", "Yamaha", "TVS", "Others"],
  color: "White",
  brand: "Dell",
};
const ProductCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    title,
    description,
    price,
    categories,
    category,
    subs,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = values;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    getCategories().then((c) => setValues({ ...values, categories: c.data }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(values, user.token)
      .then((res) => {
        window.alert("Product created");
        window.location.reload();
      })
      .catch((err) => {
        toast.error(`unable to load product ${err.response.data.err}`);
      });
  };
  const handleChange = (e) => {
    e.preventDefault();
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCatagoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subs: [], category: e.target.value });
    getCategorySubs(e.target.value).then((res) => {
      setSubOptions(res.data);
    });
    setShowSub(true);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h1" />
          ) : (
            <h4>Product create</h4>
          )}
          <hr />

          {/* {JSON.stringify(values.images)} */}

          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCatagoryChange={handleCatagoryChange}
            subOptions={subOptions}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
