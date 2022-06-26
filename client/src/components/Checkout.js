import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { isAuth, emptyCart } from "../utils/helpers";
const Checkout = ({ products }) => {
  let navigate = useNavigate();
  const [data, setData] = useState({
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: "",
  });

  const createOrder = (createOrderData) => {
    return fetch(`/api/order/create/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
      body: JSON.stringify({ order: createOrderData }),
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
  };

  const getBraintreeClientToken = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      };

      const { data } = await axios.get(`/api/braintree/getToken`, config);

      setData({ ...data, clientToken: data.clientToken });
    } catch (err) {
      setData({ ...data, error: data.error });
    }
  };

  useEffect(() => {
    getBraintreeClientToken();
  }, []);

  const processPayment = async (paymentData) => {
    try {
      console.log(Cookies.get("accessToken"));
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      };

      const { data } = await axios.post(
        `/api/braintree/payment`,
        paymentData,
        config
      );
      return data;
    } catch (err) {
      console.log(err);
    }
  };
  let deliveryAddress = data.address;
  const handleAddress = (event) => {
    setData({ ...data, address: event.target.value });
  };

  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: "" })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className="gorm-group mb-3">
            <label className="text-muted">Delivery address:</label>
            <textarea
              onChange={handleAddress}
              className="form-control"
              value={data.address}
              placeholder="Type your delivery address here..."
            />
          </div>

          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: "vault",
              },
            }}
            onInstance={(instance) => (data.instance = instance)}
          />
          <button onClick={buy} className="btn btn-success btn-block">
            Checkout
          </button>
        </div>
      ) : null}
    </div>
  );

  const buy = () => {
    console.log(data.instance);
    //send nonce to your server
    //nonce = data.instace.requestPaymentMethod()
    let nonce;
    let getNonce = data.instance.requestPaymentMethod().then((data) => {
      console.log(data);
      nonce = data.nonce;
      // console.log("send nonce and total", nonce, getTotal(products));
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: getTotal(products),
      };
      processPayment(paymentData)
        .then((response) => {
          console.log(response);
          // empty cart
          // create order

          const createOrderData = {
            products: products,
            transaction_id: response.transaction.id,
            amount: response.transaction.amount,
            address: deliveryAddress,
          };

          createOrder(createOrderData)
            .then((response) => {
              emptyCart(() => {
                console.log("payment success and empty cart");
                setData({
                  loading: false,
                  success: true,
                });
              });
              toast.success("Your order is placed successfully!");
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log("dropin error", err);
          setData({ ...data, error: err.message });
        });
    });
  };
  const checkoutRedirect = () => {
    if (!isAuth()) {
      navigate("/login");
    } else {
      navigate("/payment");
    }
  };
  const getTotal = () => {
    return products.reduce((currValue, nextValue) => {
      return currValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showError = (error) => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  return (
    <>
      Total: ${getTotal()}
      <div>
        {data.error && showError(data.error)}
        {showDropIn()}
      </div>
    </>
  );
};

export default Checkout;
