import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ExpirationModal from "../components/ExpirationModal";
import { useNavigate } from "react-router-dom";

const UserScreen = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    postal_code: "",
    first_name: "",
    last_name: "",
    error: "",
    success: false,
  });

  const {
    username,
    email,
    password,
    postal_code,
    first_name,
    last_name,
    error,
    success,
  } = values;

  //     router.get("/getuserinfo", verifyAccessToken, getUserInfo);
  // router.post("/updatemyinfo", verifyAccessToken, updateUserInfo);

  const loadUserProfile = async () => {
    try {
      const { data } = await axios.get("/api/customer/getuserinfo", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      setValues({
        ...values,
        username: data.username,
        email: data.email,
        postal_code: data.postal_code,
        first_name: data.first_name,
        last_name: data.last_name,
      });
    } catch (err) {
      setValues({ ...values, error: "Error fetching user profile." });
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    const userObj = {
      username,
      email,
      password,
      first_name,
      last_name,
      postal_code,
    };
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/customer/updatemyinfo", userObj, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      toast.success("Your profile is updated successfully!");
      setValues({ ...values, success: true });

      //   setValues({
      //     ...values,
      //     username: data.username,
      //     email: data.email,
      //     password: data.password,
      //     first_name: data.first_name,
      //     last_name: data.last_name,
      //     postal_code: data.postal_code,
      //     success: true,
      //   });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const profileUpdateForm = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Username</label>
        <input
          type="text"
          onChange={handleChange("username")}
          className="form-control"
          value={username}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="text"
          onChange={handleChange("email")}
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">First Name</label>
        <input
          type="text"
          onChange={handleChange("first_name")}
          className="form-control"
          value={first_name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Last Name</label>
        <input
          type="text"
          onChange={handleChange("last_name")}
          className="form-control"
          value={last_name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Postal Code</label>
        <input
          type="text"
          onChange={handleChange("postal_code")}
          className="form-control"
          value={postal_code}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          onChange={handleChange("password")}
          className="form-control"
          value={password}
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
      <ToastContainer />
      <h2>Update Profile</h2>
      <div>{profileUpdateForm()}</div>
    </div>
  );
};

export default UserScreen;
