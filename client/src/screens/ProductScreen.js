import axios from "axios";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/product/${id}`);
      setProduct(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const { data } = await axios.get(`/api/products/related/${id}`);
      setRelatedProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="text-center">
      <Navbar />
      {/* <div>{product && JSON.stringify(product)}</div> */}

      {product && (
        <ProductCard
          product={product}
          showAddToCart={true}
          showRemoveFromCart={false}
        />
      )}

      <hr />
      <h3>Other Products You May Like</h3>
      <div>
        {/* router.get("/related/:productId", productById, listRelated); */}
        <Row>
          {relatedProducts &&
            relatedProducts.map((p) => (
              <Col sm={12} md={6} lg={4} xl={3} className="text-center">
                <ProductCard
                  product={p}
                  showAddToCart={true}
                  showRemoveFromCart={false}
                />
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
};

export default ProductScreen;
