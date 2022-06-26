import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const SignupScreen = () => {
  const navigate = useNavigate();

  // defining states
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    postalCode: "",
    username: "",
    gender: "",
    password: "",
    confirmPassword: "",
    buttonText: "Submit",
    error: "",
    success: false,
  });

  //destructure values
  const {
    firstName,
    lastName,
    email,
    postalCode,
    username,
    gender,
    password,
    confirmPassword,
    buttonText,
    error,
    success,
  } = values;
  useEffect(() => {
    if (success) {
      navigate("/");
      window.location.reload();
    }
  }, [success, navigate]);
  //on key change handling
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const Dropdown = ({ options }) => {
    const [selectedOption, setSelectedOption] = useState(options[0].value);
    return (
      <select
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  };

  //handle submit form
  const submitForm = async (e) => {
    e.preventDefault();
    setValues({
      firstName: "",
      lastName: "",
      email: "",
      postalCode: "",
      username: "",
      gender: "male",
      password: "",
      confirmPassword: "",
      buttonText: "Submitting",
      error: "",
      success: false,
    });
    if (
      username.trim().length == 0 ||
      email.trim().length == 0 ||
      password.trim().length == 0 ||
      confirmPassword.trim().length == 0 ||
      firstName.trim().length == 0 ||
      lastName.trim().length == 0 ||
      postalCode.trim().length == 0 ||
      gender.trim().length == 0
    ) {
      console.log(
        username,
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        postalCode,
        gender
      );
      return setValues({
        ...values,
        buttonText: "Submit",
        error: "One or more missing fields. Please try again.",
      });
    }

    if (password.trim().length < 6) {
      return setValues({
        ...values,
        buttonText: "Submit",
        error: "Password should be at least 6 characters long.",
      });
    }

    if (password.trim() !== confirmPassword.trim()) {
      return setValues({
        ...values,
        buttonText: "Submit",
        error: "Passwords do not match.",
      });
    }
    try {
      console.log(values);
      const res = await axios.post("/api/user/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password,
        gender,
        postal_code: postalCode,
      });
      setValues({
        ...values,
        success: true,
        buttonText: "Submit",
        error: null,
        success: true,
      });
    } catch (err) {
      setValues({
        ...values,
        buttonText: "Submit",
        error: err.response.data.error,
      });
    }
  };

  const signupForm = () => (
    <form onSubmit={submitForm}>
      <h1>Register</h1>
      {error && (
        <div class="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="form-group">
        <label className="text-muted">Username</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("username")}
          value={username}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">First Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("firstName")}
          value={firstName}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Last Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("lastName")}
          value={lastName}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Gender</label>
        <select id="gender" value={gender} onChange={handleChange("gender")}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="form-group">
        <label className="text-muted">Postal Code</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("postalCode")}
          value={postalCode}
        />
      </div>

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
      <div className="form-group">
        <label className="text-muted">Confirm Password</label>
        <input
          type="password"
          className="form-control"
          onChange={handleChange("confirmPassword")}
          value={confirmPassword}
        />
      </div>

      <div>
        <button className="btn btn-primary mt-3">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <>
      <Navbar />
      <div className="flex-container container shadow p-5 mb-5 mt-3 rounded">
        {signupForm()}
      </div>
    </>
  );
};

export default SignupScreen;
