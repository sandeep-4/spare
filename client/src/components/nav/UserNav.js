import React from "react";
import { Link } from "react-router-dom";

const UserNav = () => (
  <nav>
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link to="/user/history" className="nav-link">
          Records Tab
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/user/wishlist" className="nav-link">
          Favourites Tab
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/user/wishlist" className="nav-link">
          Related items
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/user/password" className="nav-link">
          Password Change
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/user/wishlist" className="nav-link">
          Wishlist Tab
        </Link>
      </li>
    </ul>
  </nav>
);

export default UserNav;
