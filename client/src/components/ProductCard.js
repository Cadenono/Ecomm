import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { addItem, updateItem, removeItem } from "../utils/helpers";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product,
  showAddToCart,
  showRemoveFromCart,
  showCartOptions,
}) => {
  let navigate = useNavigate();
  const [count, setCount] = useState(product.count);
  const addToCart = () => {
    addItem(product, () => {
      navigate("/cart");
      window.location.reload();
    });
  };

  const handleChange = (productId) => (event) => {
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (
      event.target.value >= 1 &&
      Number(event.target.value) > Number(product.qty)
    ) {
      return alert("Insufficient stock!");
    }

    if (
      event.target.value >= 1 &&
      Number(event.target.value) <= Number(product.qty)
    ) {
      updateItem(productId, event.target.value);
    }
  };

  return (
    <Card
      className="my-3 p-3 rounded"
      style={{ height: "550px", width: "320px" }}
    >
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image}
          style={{ width: "280px", height: "250px" }}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.title}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">Price: ${product.price}</Card.Text>
        <Card.Text as="div">Description: {product.description}</Card.Text>
        <Card.Text as="div" style={{ fontWeight: "bold", color: "orange" }}>
          {product.qty > 0 ? "In stock" : "Out of stock!"}
        </Card.Text>
        {showCartOptions && (
          <div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">Adjust Quantity</span>
              </div>
              <input
                type="number"
                className="form-control"
                value={count}
                onChange={handleChange(product._id)}
              />
            </div>
          </div>
        )}
      </Card.Body>
      <Card.Footer>
        {" "}
        {product.qty > 0 && showAddToCart && (
          <Button className="btn-sm " variant="success" onClick={addToCart}>
            Add to Cart
          </Button>
        )}
        {product.qty > 0 && showRemoveFromCart && (
          <Button
            className="btn-sm "
            variant="danger"
            onClick={() => removeItem(product._id)}
          >
            Remove From Cart
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;
