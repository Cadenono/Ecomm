import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

import { Row, Col } from "react-bootstrap";

const ShopScreen = () => {
  const [productsBySell, setProductsBySell] = useState([]);
  const [productsByArrival, setProductsByArrival] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProductsByArrival();
    loadProductsBySell();
  }, []);

  const getProducts = async (sortBy) => {
    try {
      const { data } = await axios.get(
        `/api/products/productlist?sortBy=${sortBy}&order=desc&limit=3`
      );
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const loadProductsBySell = () => {
    getProducts("sold").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsBySell(data);
      }
    });
  };

  const loadProductsByArrival = () => {
    getProducts("createdAt").then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProductsByArrival(data);
      }
    });
  };

  return (
    <div>
      <Navbar />
      <Row>
        <h2>Latest Products</h2>
        {productsByArrival.map((product) => (
          <Col sm={12} md={6} lg={4} xl={3}>
            <ProductCard product={product} showButton={true} />
          </Col>
        ))}

        <hr />
        <h2>Most Sold Products</h2>
        {productsBySell.map((product) => (
          <Col sm={12} md={6} lg={4} xl={3}>
            <ProductCard product={product} showButton={true} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ShopScreen;
