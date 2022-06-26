import React from "react";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";

const Checkout = ({ subtotal, cartItems }) => {
  var cartItemsArray = [];

  function tokenHandler(token) {
    placeOrder(token, subtotal);
  }
  const placeOrder = async (token, subtotal) => {
    const orderToAdd = {
      token,
      subtotal: Number(subtotal) * 100,
      products: cartItems,
    };

    try {
      const { data } = await axios.post(
        "/api/orders/placeorder",
        JSON.stringify(orderToAdd)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <StripeCheckout
        amount={Number(subtotal) * 100}
        shippingAddress
        currency="SGD"
        token={tokenHandler}
        stripeKey="pk_test_51JrxoHD89oAlgjd7WzuYbZlru6gtn6eyRasFfP7DreYC2INZaDqUZhnTAaOEg5Y3n5pAkrLh5Ykr0Q758Y61ofPx00AA4Xtrkm"
      >
        <button style={{ marginTop: "30px" }} className="btn btn-warning">
          Pay Now
        </button>
      </StripeCheckout>
    </div>
  );
};

export default Checkout;
