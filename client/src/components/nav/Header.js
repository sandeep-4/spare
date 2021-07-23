import React, { useState } from "react";
import { Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
  InfoOutlined,
  QuestionOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Search from "../forms/Search";
const { Item, SubMenu } = Menu;

const Header = () => {
  const dispatch = useDispatch();
  let history = useHistory();
  const [current, setCurrent] = useState("home");

  let { user, cart } = useSelector((state) => ({ ...state }));

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT",
      payload: null,
    });
    history.push("/login");
  };

  const mystyle = {
    color: "white",
  };

  return (
    <Menu
      onClick={handleClick}
      selectedKeys={[current]}
      mode="horizontal"
      className="bg-dark"
    >
      <Item key="home" icon={<AppstoreOutlined />} style={mystyle}>
        <Link to="/" style={mystyle}>
          Home
        </Link>
      </Item>

      <Item key="shop" icon={<ShoppingOutlined />} style={mystyle}>
        <Link to="/shop" style={mystyle}>
          Buy
        </Link>
      </Item>

      <Item key="shop" icon={<SettingOutlined />} style={mystyle}>
        <Link to="/shop" style={mystyle}>
          Spares
        </Link>
      </Item>

      <Item key="cart" icon={<ShoppingCartOutlined />} style={mystyle}>
        <Link to="/cart" style={mystyle}>
          <Badge count={cart.length} offset={[9, 0]}>
            Cart
          </Badge>
        </Link>
      </Item>

      <Item key="shop" icon={<CheckOutlined />} style={mystyle}>
        <Link to="/" style={mystyle}>
          Best Sellers
        </Link>
      </Item>

      <Item key="shop" icon={<PhoneOutlined />} style={mystyle}>
        <Link to="/shop" style={mystyle}>
          Contact Us
        </Link>
      </Item>

      <Item key="shop" icon={<InfoOutlined />} style={mystyle}>
        <Link to="/shop" style={mystyle}>
          About Us
        </Link>
      </Item>

      <Item key="shop" icon={<QuestionOutlined />} style={mystyle}>
        <Link to="/shop" style={mystyle}>
          FAQ
        </Link>
      </Item>

      {!user && (
        <Item
          key="register"
          icon={<UserAddOutlined />}
          className="float-right"
          style={mystyle}
        >
          <Link to="/register" style={{ color: "white" }}>
            Register
          </Link>
        </Item>
      )}

      {!user && (
        <Item
          key="login"
          icon={<UserOutlined />}
          className="float-right"
          style={mystyle}
        >
          <Link to="/login" style={{ color: "white" }}>
            Login
          </Link>
        </Item>
      )}

      {user && (
        <SubMenu
          style={{ color: "white" }}
          icon={<UserOutlined />}
          title={user.email && user.email.split("@")[0]}
          className="float-right"
        >
          {user && user.role === "subscriber" && (
            <Item>
              <Link to="/user/history">Dashboard</Link>
            </Item>
          )}

          {user && user.role === "admin" && (
            <Item>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Item>
          )}

          <Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Item>
        </SubMenu>
      )}

      <span className="float-right p-1">
        <Search />
      </span>
    </Menu>
  );
};

export default Header;
