import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import Navbar from "../components/Navbar";
const LoginScreen = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    success: false,
    checkbox: true,
  });

  //destructure values
  const { email, password, error, success, checkbox } = values;
  const inFiveMinutes = new Date(new Date().getTime() + 1 * 60 * 1000);
  //navigaton use effect
  useEffect(() => {
    if (success) {
      navigate("/");
      window.location.reload();
    }
  }, [success, navigate]);

  //if checkbox is selected, save the email to localstorage
  //use effect for check box
  useEffect(() => {
    let rememberedEmail;
    rememberedEmail = localStorage.getItem("remember-email");
    console.log(rememberedEmail);
    if (rememberedEmail) {
      setValues({ ...values, email: rememberedEmail });
    }
  }, []);

  useEffect(() => {
    if (checkbox) {
      localStorage.setItem("remember-email", email);
    } else {
      localStorage.clear();
    }
  }, [checkbox, email]);

  //on key change handling
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  //checkbox handle change
  const handleChangeCheckbox = (name) => (event) => {
    console.log(event.target.checked);
    setValues({ ...values, [name]: event.target.checked });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    //simple verification to see if fields are empty or not
    if (email.trim().length === 0 || password.trim().length === 0) {
      return setValues({
        ...values,
        error: "One or more missing fields. Please try again.",
      });
    }

    //check if email is valid
    if (!email.includes("@")) {
      return setValues({
        ...values,
        error: "Not a valid email.",
      });
    }

    try {
      const res = await axios.post("/api/user/login", {
        email,
        password,
      });
      console.log(res);
      sessionStorage.setItem("isLoggedIn", true);
      localStorage.setItem(
        "userRoleisAdmin",
        JSON.stringify(res.data.user.admin)
      );

      Cookies.set("accessToken", res.data.accessTokenData.token, {
        expires: inFiveMinutes,
      });
      Cookies.set("refreshToken", res.data.refreshTokenData.token, {
        expires: inFiveMinutes,
      });
      Cookies.set("accessTokenExpiry", res.data.accessTokenData.exp, {
        expires: inFiveMinutes,
      });
      // localStorage.setItem("accessToken", res.data.accessTokenData.token);
      // localStorage.setItem("refreshToken", res.data.refreshTokenData.token);
      // localStorage.setItem("accessTokenExpiry", res.data.accessTokenData.exp); // jwt
      setValues({
        ...values,
        success: true,
        error: null,
      });
    } catch (err) {
      console.log(err);
      setValues({
        ...values,
        error: err.response.data.error,
      });
    }
  };
  const loginForm = () => (
    <form onSubmit={submitForm}>
      <h1>Login</h1>
      {error && (
        <div class="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("email")}
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          className="form-control"
          onChange={handleChange("password")}
          value={password}
        />
      </div>
      <input
        type="checkbox"
        name="remember"
        id="remember"
        checked
        onChange={handleChangeCheckbox("checkbox")}
      />
      <label for="remember">Remember me</label>
      <div>
        <button className="btn btn-primary mt-3">Submit</button>
      </div>
    </form>
  );

  return (
    <>
      {" "}
      <Navbar />
      <div className="flex-container container shadow p-5 mb-5 mt-3 rounded">
        {loginForm()}
      </div>{" "}
    </>
  );
};

export default LoginScreen;
