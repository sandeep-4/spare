import React, { Component, useState, useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterComplete from "./pages/auth/RegisterComplete";
import History from "./pages/user/History";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/nav/Header";

import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./components/Globalstyle";
import { lightTheme, darkTheme } from "./components/Themes";

import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { currentUser } from "./functions/auth";
import UserRoute from "./components/routes/UserRoute";
import Wishlist from "./pages/user/WishList";
import Password from "./pages/user/Password";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/routes/AdminRoute";
import CategoryCreate from "./pages/admin/category/CategoryCreate";
import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
import SubCreate from "./pages/admin/sub/SubCreate";
import SubUpdate from "./pages/admin/sub/SubUpdate";
import ProductCreate from "./pages/admin/product/ProductCreate";
import AllProducts from "./pages/admin/product/AllProducts";
import ProductUpdate from "./pages/admin/product/ProductUpdate";
import Product from "./pages/Product";
import CategoryHome from "./pages/category/CategoryHome";
import SubHome from "./pages/sub/SubHome";
import Shop from "./pages/Shop";
import SideDrawer from "./components/drawer/SideDrawer";
import Cart from "./pages/Cart";
import Checkout from "./pages/CheckOut";
import CreateCouponPage from "./pages/admin/coupon/CreateCouponPage";
import Payment from "./pages/Payment";

const App = () => {
  const [theme, setTheme] = useState("dark");
  const dispatch = useDispatch();

  const themeToggler = () => {
    theme === "dark" ? setTheme("dark") : setTheme("dark");
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        currentUser(idTokenResult.token)
          .then((res) => {
            //  console.log(res.data);
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => console.log(err));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <Header />
        <SideDrawer />
        <ToastContainer />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/register/complete" component={RegisterComplete} />
          <Route exact path="/forgot/password" component={ForgotPassword} />
          <UserRoute exact path="/user/history" component={History} />
          <UserRoute exact path="/user/wishlist" component={Wishlist} />
          <UserRoute exact path="/user/password" component={Password} />
          <AdminRoute
            exact
            path="/admin/dashboard"
            component={AdminDashboard}
          />
          <AdminRoute exact path="/admin/category" component={CategoryCreate} />
          <AdminRoute
            exact
            path="/admin/category/:slug"
            component={CategoryUpdate}
          />
          <AdminRoute exact path="/admin/sub" component={SubCreate} />
          <AdminRoute exact path="/admin/sub/:slug" component={SubUpdate} />
          <AdminRoute exact path="/admin/product" component={ProductCreate} />
          <AdminRoute exact path="/admin/products" component={AllProducts} />
          <AdminRoute
            exact
            path="/admin/product/:slug"
            component={ProductUpdate}
          />
          <Route exact path="/product/:slug" component={Product} />
          <Route exact path="/category/:slug" component={CategoryHome} />
          <Route exact path="/sub/:slug" component={SubHome} />
          <Route exact path="/shop" component={Shop} />
          <Route exact path="/cart" component={Cart} />
          <UserRoute exact path="/checkout" component={Checkout} />
          <AdminRoute exact path="/admin/coupon" component={CreateCouponPage} />
          <UserRoute exact path="/payment" component={Payment} />
        </Switch>
      </>
    </ThemeProvider>
  );
};

export default App;
