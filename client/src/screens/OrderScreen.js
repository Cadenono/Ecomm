import Navbar from "../components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import ExpirationModal from "../components/ExpirationModal";

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [statusValues, setStatusValues] = useState([]);
  const listOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/getallorders", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadStatusValues = async () => {
    try {
      const { data } = await axios.get(`/api/order/status-values`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      setStatusValues(data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `/api/order/update-order-status`,
        { orderId, status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      toast.success("Successfully updated!");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    listOrders();
  }, [statusValues]);

  useEffect(() => loadStatusValues(), []);

  const handleStatusChange = (e, orderId) => {
    updateOrderStatus(orderId, e.target.value).then((data) => {
      if (data.error) {
        console.log("Status update failed");
      } else {
        listOrders();
      }
    });
  };

  const showStatus = (o) => (
    <div className="form-group">
      <h3 className="mark mb-4">Status: {o.status}</h3>
      <select
        className="form-control"
        onChange={(e) => handleStatusChange(e, o._id)}
      >
        <option>Update Status</option>
        {statusValues &&
          statusValues.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
      </select>
    </div>
  );

  return (
    <div>
      <ExpirationModal />
      <ToastContainer />
      <Navbar />

      {orders &&
        orders.map((order) => (
          <div style={{ borderBottom: "5px solid indigo" }} className="mt-5">
            <h2 className="mb-5">
              <span className="bg-primary">Order ID: {order._id}</span>
            </h2>

            <ul>
              <li>Status: {showStatus(order)}</li>

              <li>Transaction ID: {order.transaction_id}</li>
              <li>Amount: ${order.amount}</li>
              <li>Customer ID: {order.customer._id}</li>
              <li>
                Customer Full Name: {order.customer.first_name}{" "}
                {order.customer.last_name}
              </li>
              <li>Ordered on: {moment(order.createdAt).fromNow()}</li>
              <li>Delivery Address: {order.address}</li>
            </ul>
            {/* {JSON.stringify(order.products)} */}
            <h4>Total products in order: {order.products.length}</h4>
            {order.products.map((item) => (
              <div className="flex-container container shadow p-5 mb-5 mt-3 rounded">
                <p>Item: {item.title}</p>
                <p>Item ID: {item._id}</p>
                <p>Price: {item.price}</p>
                <p>No. of items purchased: {item.count}</p>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default OrderScreen;
