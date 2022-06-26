import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import ExpirationModal from "../components/ExpirationModal";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const loadProducts = async () => {
    try {
      const { data } = await axios.get(
        "/api/products/productlist?limit=undefined",
        {
          //if do not put ?limit=undefined or ?limit=100 it will show limit=6 by default as written in the controller
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );

      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const destroyProduct = async (productId) => {
    try {
      await axios.delete(`/api/product/${productId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      //reload products
      loadProducts();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);
  return (
    <div>
      <ExpirationModal />
      <Navbar />
      <h2>Manage Products</h2>
      <h4>Total products: {products.length}</h4>
      {products.map((p, i) => (
        <li className="flex-container container shadow p-5 mb-3 mt-3 rounded">
          <strong>{p.title}</strong>
          <div>
            {" "}
            <Link to={`/admin/product/update/${p._id}`}>
              <span style={{ color: "blue" }}>Update</span>
            </Link>
            <span
              style={{
                color: "red",
                marginLeft: "20px",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => destroyProduct(p._id)}
            >
              Delete
            </span>
          </div>
        </li>
      ))}
    </div>
  );
};

export default ManageProducts;
