import React, { useState } from "react";
import BaseApp from "../BaseApp/baseApp";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { AppState } from "../Context/AppProvider";

const userSchemaValidation = yup.object({
  email: yup.string().email().required("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is Required")
    .min(7, "Password cannot be less than 7 characters"),
});

export default function Login() {
  const { setCartData, setCartProductId, setProductCount, setTotalCartPrice } =
    AppState();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const updateCartData = async () => {
    const userId = localStorage.getItem("cUserId");
    const response = await fetch(
      `https://ecommerce-8rwm.onrender.com/cart/get/${userId}`
    );
    const cartData = await response.json();
    setCartData(cartData.data);
    if(cartData.data == null){
      setProductCount(0);
    }else{
      setProductCount(cartData.data.totalItem);
      const productIds = [];
      let totalCartAmount = 0;
      cartData.data.items.map((data) => {
        productIds.push(data.productId);
        totalCartAmount = totalCartAmount + data.price;
      });
      setTotalCartPrice(totalCartAmount);
      setCartProductId(productIds);
    }
   
  };
  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data) => {
        try {
          handleOpen();
          await localStorage.removeItem("cUserId");
          await localStorage.removeItem("cUserToken");
          const response = await fetch("https://ecommerce-8rwm.onrender.com/user/signin", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (result.success == true) {
            localStorage.setItem("cUserToken", result.token);
            localStorage.setItem("cUserId", result.id);
            updateCartData();
            navigate("/home");
          }
          if (result.success == false) {
            toast.error(result.message);
          }
        } catch (error) {
          console.log(error);
        } finally {
          handleClose();
        }
      },
    });
  return (
    <BaseApp>
      <div className="login-container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-4 login-side-1">
              <h1>Login</h1>
              <p>Get access to your</p>
              <p>Orders, Wishlist and</p>
              <p>Good Deals</p>
              <img className="img-fluid" src="./login-img.png"></img>
            </div>
            <form onSubmit={handleSubmit} className="col-8 login-side-2">
              <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </Form.Group>
              {touched.email && errors.email ? (
                <p style={{ color: "crimson" }}>{errors.email}</p>
              ) : (
                ""
              )}
              <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </Form.Group>
              {touched.password && errors.password ? (
                <p style={{ color: "crimson" }}>{errors.password}</p>
              ) : (
                ""
              )}
              <button type="submit">Next</button>
              <div className="text-center pt-2">
                Not registered yet?<Link to={"/signup"}> SignUp</Link>
              </div>
              <div className="d-flex justify-content-center">
                <div className="demo">
                  <p>For Demo:</p>
                  <p>Email: hema47173@gmail.com</p>
                  <p>password: admin@123</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </BaseApp>
  );
}
