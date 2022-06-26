import axios from "axios";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Navbar from "../components/Navbar";
import moment from "moment";
import { Link } from "react-router-dom";

const CustomerDashboard = () => {
  const [history, setHistory] = useState([]);
  const getPurchaseHistory = async () => {
    const { data } = await axios.get("/api/order/getmyorders", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    });

    setHistory(data);
  };
  useEffect(() => {
    getPurchaseHistory();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Past Purchases</h1>
      {/* {JSON.stringify(history)} */}
      {history.map((h, i) => {
        return (
          <div>
            {h.products.map((p, i) => {
              return (
                <div key={i}>
                  <Link to={`/product/${p._id}`}>
                    {" "}
                    <h6>Product name: {p.title}</h6>
                  </Link>
                  <h6>Product unit price: ${p.price}</h6>
                  <h6>Qty purchased: {p.count}</h6>
                  <h6>Order Status: {p.status}</h6>
                  <h6>Purchased date: {moment(p.createdAt).fromNow()}</h6>
                  <h6> Order Status: {h.status}</h6>
                  <h6> Order Total: ${h.amount}</h6>
                </div>
              );
            })}
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export default CustomerDashboard;
