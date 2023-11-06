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
import { AppState } from "../Context/AppProvider";


const userSchemaValidation = yup.object({
    name: yup.string().required("Name is Required"),
    email: yup.string().email().required("Email is Required"),
    password: yup
      .string()
      .required("Password is Required")
      .min(7, "Password cannot be less than 7 characters"),
  });

export default function SignUp(){
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
    setProductCount(cartData.data.totalItem);
    const productIds = [];
    let totalCartAmount = 0;
    cartData.data.items.map((data) => {
      productIds.push(data.productId);
      totalCartAmount = totalCartAmount + data.price;
    });
    setTotalCartPrice(totalCartAmount);
    setCartProductId(productIds);
  };
  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: {
        name: "",
        email: "",
        password: "",
      },
      validationSchema: userSchemaValidation,
      onSubmit: async (data) => {
        try {
          handleOpen();
          await localStorage.removeItem("cUserId");
          await localStorage.removeItem("cUserToken");
          const response = await fetch("https://ecommerce-8rwm.onrender.com/user/signup", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const result = await response.json();
          if (result.success == true) {
            toast.success(result.message);
            navigate("/login");
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
              <h1>Looks like you're new here!</h1>
               <img className="img-fluid" src="./login-img.png"></img>
            </div>
            <form onSubmit={handleSubmit} className="col-8 login-side-2">
            <Form.Group className="mb-3" controlId="formGroupEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={values.name}
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter name"
                />
                {touched.name && errors.name ? (
                <p style={{ color: "crimson",margin:"0px" }}>{errors.name}</p>
              ) : (
                ""
              )}
              </Form.Group>
              
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
                {touched.email && errors.email ? (
                <p style={{ color: "crimson",margin:"0px" }}>{errors.email}</p>
              ) : (
                ""
              )}
              </Form.Group>
              
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
                {touched.password && errors.password ? (
                <p style={{ color: "crimson",margin:"0px" }}>{errors.password}</p>
              ) : (
                ""
              )}
              </Form.Group>
              
              <button type="submit">Next</button>
              <div className="text-center pt-2">
              Already have an account?<Link to={"/login"}> Log In</Link>
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