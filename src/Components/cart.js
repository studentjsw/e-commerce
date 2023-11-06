import React, { useState } from "react";
import BaseApp from "../BaseApp/baseApp";
import DeleteIcon from "@mui/icons-material/Delete";
import { AppState } from "../Context/AppProvider";
import { useNavigate } from "react-router";

export default function Cart() {
  const navigate = useNavigate();
  const {
    product,
    cartProductId,
    setCartProductId,
    setProductCount,
    totalCartPrice,
    productCount,
  } = AppState();
  const deleteCart = async (data) => {
    const userId = localStorage.getItem("cUserId");
    const response = await fetch(
      `https://ecommerce-8rwm.onrender.com/cart/delete/${userId}/${data._id}`,
      { method: "DELETE" }
    );
    const cartData = await response.json();
    const filterData = cartProductId.filter((ele) => ele != data._id);
    setCartProductId(filterData);
    setProductCount(productCount - 1);
  };
  return (
    <BaseApp>
      {cartProductId.length != 0 ? (
        <div className="container">
          {cartProductId &&
            cartProductId.map((id, index) => {
              const data = product.find((ele) => ele._id == id);
              return (
                <div key={index} className="row mt-3">
                  <div className="col cart">
                    <img src={data.image}></img>
                    <p className="cart-prodect-name">{data.productName}</p>
                    <p className="cart-prodect-price">₹{data.price}</p>
                    <DeleteIcon
                      onClick={() => deleteCart(data)}
                      className="delete-icon"
                    ></DeleteIcon>
                  </div>
                </div>
              );
            })}
          <hr></hr>
          <div className="cart-amount-container">
            <p>Price ({productCount} items)</p>
            <p>₹{totalCartPrice}</p>
          </div>
          <div className="cart-amount-container">
            <p>Delivery charges</p>
            <p style={{ color: "green" }}>Free</p>
          </div>
          <hr></hr>
          <div className="cart-amount-container">
            <p>Total Amount</p>
            <p>₹{totalCartPrice}</p>
          </div>
          <hr></hr>
          <button
            className="check-out-btn"
            onClick={() => navigate("/payment")}
          >
            CHECK OUT
          </button>
        </div>
      ) : (
        <div className="cart-empty">
          <h4>Oops! Your Cart is Empty</h4>
          <button onClick={() => navigate("/home")}>Continue Shopping</button>
        </div>
      )}
    </BaseApp>
  );
}
