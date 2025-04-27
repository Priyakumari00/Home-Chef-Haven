import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Back from "../../components/Button/Back";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import GlobalContext from "../../context/GlobalContext";
import Row, { Col } from "../../layout/Responsive";
import { registerBg } from "../../utils/images";
import "./register.css";

const Register = () => {
  const [registerUser, setRegisterUser] = useState({
    fname: "",
    lname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });

  // pull axiosInstance out of context (with correct baseURL & headers)
  const { axiosInstance, setSnack, setOpenSnackBar, setIsLoading } =
    useContext(GlobalContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterUser((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (registerUser.password !== registerUser.confirmPassword) {
      setSnack({
        text: "Passwords do not match",
        bgColor: "var(--red)",
        color: "var(--white)",
      });
      setOpenSnackBar(true);
      setTimeout(() => setOpenSnackBar(false), 5000);
      return;
    }

    try {
      setIsLoading(true);
      const res = await axiosInstance.post(
        "/api/auth/register",
        registerUser
      );
      setIsLoading(false);

      // accept 200, 201, or 204 as success
      if (
        res.status === 200 ||
        res.status === 201 ||
        res.status === 204
      ) {
        setSnack({
          text: res.data?.message || "Registration successful!",
          bgColor: "var(--green)",
          color: "var(--white)",
        });
        setOpenSnackBar(true);
        setTimeout(() => setOpenSnackBar(false), 5000);
        navigate("/login");
      }
    } catch (error) {
      setIsLoading(false);
      setSnack({
        text:
          error?.response?.data?.message || "Registration failed",
        bgColor: "var(--red)",
        color: "var(--white)",
      });
      setOpenSnackBar(true);
      setTimeout(() => setOpenSnackBar(false), 5000);
    }
  };

  return (
    <main className="register">
      <aside
        className="register-side"
        style={{ backgroundImage: `url(${registerBg})` }}
        data-aos="fade-in"
      />
      <Back />
      <section className="register-page">
        <div className="register-container">
          <h1>Get Started!</h1>
          <form onSubmit={handleSubmit}>
            <Row>
              <Col lg={50} md={50}>
                <Input
                  value={registerUser.fname}
                  name="fname"
                  type="text"
                  placeholder="First Name"
                  icon="person"
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col lg={50} md={50}>
                <Input
                  value={registerUser.lname}
                  name="lname"
                  type="text"
                  placeholder="Last Name"
                  icon="person"
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col lg={50} md={50}>
                <Input
                  value={registerUser.email}
                  name="email"
                  type="email"
                  placeholder="Email"
                  icon="mail"
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col lg={50} md={50}>
                <Input
                  value={registerUser.username}
                  name="username"
                  type="text"
                  placeholder="Username"
                  icon="account_circle"
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col lg={50} md={50}>
                <Input
                  value={registerUser.password}
                  name="password"
                  type="password"
                  placeholder="Password"
                  icon="key"
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col lg={50} md={50}>
                <Input
                  value={registerUser.confirmPassword}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  icon="lock"
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col lg={100} md={100} sm={100}>
                <Input
                  value={registerUser.avatar}
                  name="avatar"
                  type="url"
                  placeholder="Avatar URL"
                  icon="photo_camera"
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </Col>
            </Row>
            <Button text="Sign Up" type="submit" />
          </form>
          <div className="register-signup">
            <span>Already have an account? </span>
            <Link to="/login">Log In</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
