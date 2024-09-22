import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Loading state

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handlePostRequest = async (newUrl, requestData) => {
    try {
      const response = await axios.post(newUrl, requestData);

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          setLoading(false); // Hide spinner after 3 seconds
          setShowLogin(false);
        }, 2000);
      } else {
        alert(response.data.message);
        setLoading(false); // Hide spinner immediately
      }
    } catch (error) {
      console.error("Error during request:", error);
      alert("An error occurred. Please try again.");
      setLoading(false); // Hide spinner immediately
    }
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setLoading(true); // Show spinner

    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    await handlePostRequest(newUrl, data);
  };

  const onGoogleSuccess = async (response) => {
    setLoading(true); // Show spinner
    const googleLoginUrl = `${url}/api/user/google-login`;
    const requestData = {
      tokenId: response.credential,
    };
    await handlePostRequest(googleLoginUrl, requestData);
  };

  const onGoogleFailure = () => {
    alert("Google Sign-In failed. Please try again.");
  };

  return (
    <div className="login-popup">
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {" "}
          {/* Disable button when loading */}
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleFailure} />
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p className="continuee">
            By continuing, I agree to the terms of use & privacy policy
          </p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
