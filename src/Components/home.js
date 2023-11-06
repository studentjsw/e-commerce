import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import BaseApp from "../BaseApp/baseApp";
import { AppState } from "../Context/AppProvider";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Home() {
  const {
    product,
    setProduct,
    cartData,
    setCartData,
    cartProductId,
    setCartProductId,
    productCount,
    setProductCount,
    totalCartPrice,
    setTotalCartPrice,
  } = AppState();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const userId = localStorage.getItem("cUserId");
      const response = await fetch(
        "https://ecommerce-8rwm.onrender.com/get/product"
      );
      const productData = await response.json();
      setProduct(productData.data);
      if (
        localStorage.getItem("cUserId") &&
        localStorage.getItem("cUserToken")
      ) {
        const response2 = await fetch(
          `https://ecommerce-8rwm.onrender.com/cart/get/${userId}`
        );
        const cartData = await response2.json();
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
      }
    };
    getData();
  }, []);
  return (
    <BaseApp banner={true} footer={true}>
      <div className="product-container">
        {product == null ? <Box className="pt-5" sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box> : ""}
        {product &&
          product.map((data, index) => {
            return (
              <div
                className="product-item"
                key={index}
                onClick={() => navigate(`/product/${data._id}`)}
              >
                <div className="product-item-img-container">
                  <img src={data.image}></img>
                </div>
                <div className="product-item-title">{data.productName}</div>
                <div style={{ color: "#B12704" }}>₹ {data.price}</div>
                <div>Free Delivery</div>
              </div>
            );
          })}
      </div>
    </BaseApp>
  );
}
