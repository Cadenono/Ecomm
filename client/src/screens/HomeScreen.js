import axios from "axios";
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
// const products = require("../data/products");
const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchProduct]);
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      var filteredProducts =
        products &&
        products.filter((p) => p.title.toLowerCase().includes(searchProduct));

      setProducts(filteredProducts);
    } catch (err) {
      console.log(err);
    }
  };

  const FilterBar = () => (
    <div>
      <div className="row justify-content-center mt-3 mb-3">
        <div className="col-md-2 ">
          <input
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Search product"
          />
        </div>

        <div className="col-md-2 ">
          <button onClick={handleSubmit} className="btn btn-warning">
            Filter
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      {FilterBar()}
      <Row>
        {products.map((p) => (
          <Col sm={12} md={6} lg={4} xl={3} className="text-center">
            <ProductCard
              product={p}
              showAddToCart={true}
              showCartOptions={false}
              showRemoveFromCart={false}
            />{" "}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomeScreen;
