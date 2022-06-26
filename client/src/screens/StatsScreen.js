import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BarChart from "../charts/BarChart";
import DoughtnutChart from "../charts/DoughnutChart";
import Cookies from "js-cookie";
import ExpirationModal from "../components/ExpirationModal";

const StatsScreen = () => {
  //Find amount earned by year & month
  const [amount, setAmount] = useState([]);
  //Find products sold by year & month
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchDataAmount();
    fetchDataProducts();
    fetchDataCategories();
  }, []);

  const fetchDataAmount = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    };

    try {
      const { data } = await axios.get(
        "/api/order/amt-earned-by-month",
        config
      );
      setAmount(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDataProducts = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    };

    try {
      const { data } = await axios.get(
        "/api/order/order-stats-by-month",
        config
      );
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDataCategories = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    };

    try {
      const { data } = await axios.get("/api/products/getproductstats", config);
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  //MANIPULATE DATA FOR AMOUNTS

  let amountsSorted =
    amount &&
    amount.sort((a, b) => {
      if (a._id.year === b._id.year) {
        return a._id.month < b._id.month ? -1 : 1;
      } else {
        return a._id.year < b._id.year ? -1 : 1;
      }
    });

  let amounts = amountsSorted && amountsSorted.map((a) => a.amount);
  let labels = [];

  // console.log("AMOUNT", amounts);
  amount &&
    amount.forEach((e) => {
      const labelName = e._id.year.toString() + "-" + e._id.month.toString();
      labels.push(labelName);
      console.log(labels, "LABELS");
    });

  const amountDataForBarChart = {
    labels: labels,
    datasets: [
      {
        label: "Total Amount earned",
        data: amounts,
        backgroundColor: "pink",
      },
    ],
  };

  //MANIPULATE DATA FOR PRODUCTS

  let productsSorted =
    products &&
    products.sort((a, b) => {
      if (a._id.year === b._id.year) {
        return a._id.month < b._id.month ? -1 : 1;
      } else {
        return a._id.year < b._id.year ? -1 : 1;
      }
    });

  let productsLabel = productsSorted && productsSorted.map((a) => a.products);
  let labelsForProducts = [];

  // console.log("AMOUNT", amounts);
  products &&
    products.forEach((e) => {
      const labelName = e._id.year.toString() + "-" + e._id.month.toString();
      labelsForProducts.push(labelName);
    });

  const productDataForBarChart = {
    labels: labelsForProducts,
    datasets: [
      {
        label: "Total products sold",
        data: productsLabel,
        backgroundColor: "blue",
      },
    ],
  };

  //MANIPULATE DATA FOR CATEGORIES

  function random_bg_color() {
    var x = Math.floor(Math.random() * 256);
    var y = 100 + Math.floor(Math.random() * 256);
    var z = 50 + Math.floor(Math.random() * 256);
    var bgColor = "rgb(" + x + "," + y + "," + z + ")";
    return bgColor;
  }
  let categoriesLabel = categories && categories.map((a) => a._id.category);
  let dataForCategories = categories && categories.map((a) => a.qtySold);

  // console.log(categoriesLabel);

  let colors = [];

  categories.forEach((c) => colors.push(random_bg_color()));

  const categoryDataForDoughnutChart = {
    labels: categoriesLabel,
    datasets: [
      {
        label: "Total categories sold",
        data: dataForCategories,
        backgroundColor: colors,
      },
    ],
  };

  return (
    <div>
      <ExpirationModal />
      <Navbar />
      <h2>Total amount earned by year & month</h2>
      {amount.length > 0 && <BarChart chartData={amountDataForBarChart} />}
      <h2>Total sold by year & month</h2>
      {products.length > 0 && <BarChart chartData={productDataForBarChart} />}
      <h2>Total sold by category</h2>
      {categories.length > 0 && (
        <DoughtnutChart chartData={categoryDataForDoughnutChart} />
      )}

      <hr />
    </div>
  );
};

export default StatsScreen;
