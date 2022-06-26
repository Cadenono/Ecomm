import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getCart } from "../utils/helpers";
import Navbar from "../components/Navbar";

import Checkout from "../components/Checkout";
const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  return (
    <div className="row">
      <Navbar />
      <h2>Shopping Cart</h2>

      <div className="col-6">
        {" "}
        {cartItems.length == 0
          ? "Your cart is empty"
          : cartItems.map((c) => (
              <ProductCard
                key={c._id}
                product={c}
                showButton={false}
                showCartOptions={true}
                showRemoveCartButton={true}
              />
            ))}
      </div>
      <div className="col-6">
        <h2 className="mb-4">Your cart summary</h2>
        <hr />
        <Checkout products={cartItems} />
      </div>
    </div>
  );
};

export default CartScreen;
