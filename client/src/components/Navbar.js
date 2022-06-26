import React from "react";
import { Link } from "react-router-dom";
import { isAuth, handleLogout, itemTotal, isUserAdmin } from "../utils/helpers";

export default function Navbar({ children }) {
  const nav = () => (
    <ul className="nav nav-tabs bg-primary">
      <li className="nav-item">
        <Link to="/" className="text-light nav-link">
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/shop" className="text-light nav-link">
          Shop
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/shopbyfilters" className="text-light nav-link">
          Shop By Filters
        </Link>
      </li>
      {!isAuth() && (
        <li className="nav-item">
          <Link to="/register" className="text-light nav-link">
            Register
          </Link>
        </li>
      )}
      {!isAuth() && (
        <li className="nav-item">
          <Link to="/login" className="text-light nav-link">
            Login
          </Link>
        </li>
      )}

      <li className="nav-item">
        <Link to="/cart" className="text-light nav-link">
          Cart ({itemTotal()})
        </Link>
      </li>

      {isAuth() && (
        <li className="nav-item">
          <Link to="/profile" className="text-light nav-link">
            Profile
          </Link>
        </li>
      )}
      {isAuth() && isUserAdmin && (
        <li className="nav-item">
          <Link to="/admin/products" className="text-light nav-link">
            Manage Products
          </Link>
        </li>
      )}
      {isAuth() && isUserAdmin() && (
        <li className="nav-item">
          <Link to="/admin/orders" className="text-light nav-link">
            Admin
          </Link>
        </li>
      )}
      {isAuth() && isUserAdmin() && (
        <li className="nav-item">
          <Link to="/admin/stats" className="text-light nav-link">
            Stats
          </Link>
        </li>
      )}
      {isAuth() && (
        <li className="nav-item">
          <Link to="/user/dashboard" className="text-light nav-link">
            Dashboard
          </Link>
        </li>
      )}
      {isAuth() && (
        <li className="nav-item">
          <span
            className="text-light nav-link"
            style={{ cursor: "pointer", color: "#fff" }}
            onClick={handleLogout}
          >
            Signout
          </span>
        </li>
      )}
    </ul>
  );

  return (
    <React.Fragment>
      {nav()}
      <div className="container">{children}</div>
    </React.Fragment>
  );
}
