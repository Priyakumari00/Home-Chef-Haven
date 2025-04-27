import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Back from "../../components/Button/Back";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import axiosInstance from "../../utils/axiosInstance";           // ← direct import
import GlobalContext from "../../context/GlobalContext";
import { loginBg } from "../../utils/images";
import "./login.css";
import "../../components/Button/button.css";


const Login = () => {
  const [loginUser, setLoginUser] = useState({
    username: "",
    password: "",
  });

  const {
    setIsLoading,
    setSnack,
    setOpenSnackBar,
    setIsAuthenticated,
    updateUser,
  } = useContext(GlobalContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // ← this will go to http://localhost:5000/api/auth/login
      const res = await axiosInstance.post("/api/auth/login", loginUser);
      setIsLoading(false);

      if (res.status === 200) {
        setSnack({
          text: res.data.message,
          bgColor: "var(--green)",
          color: "var(--white)",
        });
        setOpenSnackBar(true);
        setTimeout(() => setOpenSnackBar(false), 5000);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("isAuthenticated", "true");
        updateUser(res.data.user);
        setIsAuthenticated(true);

        navigate("/");  // or navigate("/") for home
      }
    } catch (error) {
      setIsLoading(false);
      setSnack({
        text: error?.response?.data?.message || "Login failed",
        bgColor: "var(--red)",
        color: "var(--white)",
      });
      setOpenSnackBar(true);
      setTimeout(() => setOpenSnackBar(false), 5000);
    }
  };

  return (
    <main className="login">
      <aside
        className="login-side"
        style={{ backgroundImage: `url(${loginBg})` }}
        data-aos="fade-in"
      />
      <Back />
      <section className="login-page">
        <div className="login-container">
          <h1>Welcome!</h1>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="username"
              value={loginUser.username}
              onChange={handleChange}
              placeholder="Username"
              icon="person"
            />
            <Input
              type="password"
              name="password"
              value={loginUser.password}
              onChange={handleChange}
              placeholder="Password"
              icon="lock"
            />
            <Button text="Login" type="submit" />
          </form>
          <div className="login-signup">
            <span>Don't have an account? </span>
            <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
