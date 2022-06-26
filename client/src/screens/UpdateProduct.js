import axios from "axios";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import ExpirationModal from "../components/ExpirationModal";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    title: "",
    price: 0,
    description: "",
    category_id: "",
    sold: 0,
    image: "",
    qty: "",
    error: "",
    success: false,
  });

  const {
    title,
    price,
    description,
    category_id,
    sold,
    image,
    qty,
    error,
    success,
  } = values;

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (success) {
      navigate("/");
    }
  }, [success]);
  const loadSingleProduct = async () => {
    try {
      const {
        data: { title, price, description, category_id, sold, image, qty },
      } = await axios.get(`/api/products/product/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      setValues({
        ...values,
        title,
        price,
        description,
        category_id,
        sold,
        image,
        qty,
        error,
        success,
      });
    } catch (err) {
      setValues({ ...values, error: "Error fetching product info." });
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/getallcategories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadSingleProduct();
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    const productObj = {
      title,
      price,
      description,
      category_id,
      sold,
      image,
      qty,
    };
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/products/${id}`, productObj, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      setValues({
        ...values,
        title: data.price,
        price: data.price,
        description: data.description,
        category_id: data.category_id,
        sold: data.sold,
        image: data.image,
        qty: data.qty,
        success: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const productUpdateForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Product Title</label>
        <input
          type="text"
          onChange={handleChange("title")}
          className="form-control"
          value={title}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Product Price</label>
        <textarea
          type="number"
          step="0.01"
          onChange={handleChange("price")}
          className="form-control"
          value={price}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Product Description</label>
        <input
          type="text"
          onChange={handleChange("description")}
          className="form-control"
          value={description}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Category</label>
        <select onChange={handleChange("category_id")} className="form-control">
          <option>Please select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      <div className="form-group">
        <label className="text-muted">Sold</label>
        <input
          type="number"
          onChange={handleChange("sold")}
          className="form-control"
          value={sold}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Image</label>
        <input
          type="text"
          onChange={handleChange("image")}
          className="form-control"
          value={image}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input
          type="number"
          onChange={handleChange("qty")}
          className="form-control"
          value={qty}
        />
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );

  return (
    <div>
      <ExpirationModal />
      <Navbar />
      <h1> Update Product</h1>
      {/* {JSON.stringify(values)} */}
      {productUpdateForm()}
    </div>
  );
};

export default UpdateProduct;
