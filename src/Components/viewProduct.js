import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BaseApp from "../BaseApp/baseApp";
import { AppState } from "../Context/AppProvider";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { toast } from "react-toastify";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ViewProduct() {
  const {
    product,
    setCartData,
    cartProductId,
    setCartProductId,
    setProductCount,
    setTotalCartPrice,
  } = AppState();
  const [filterProduct, setFilterProduct] = useState(null);
  const { id } = useParams();

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    const getData = () => {
      const data = product.find((datas) => {
        return datas._id == id;
      });
      setFilterProduct(data);
    };
    getData();
  }, []);

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
  const addToCart = async (datas) => {
    const token = localStorage.getItem("cUserToken");
    const user = localStorage.getItem("cUserId");
    if (token) {
      const response = await fetch(
        `https://ecommerce-8rwm.onrender.com/cart/add/${user}/${datas._id}`,
        {
          method: "POST",
          body: JSON.stringify({}),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (data.success == true) {
        toast.success(data.message);
        navigate("/cart");
        updateCartData();
      }
    } else {
      handleClick();
    }
  };
  return (
    <BaseApp>
      <div className="container">
        {filterProduct != null && (
          <div className="row ">
            <div className="col-12 col-sm-12 col-md-5">
              <div className="view-product-img-container">
                <img src={filterProduct.image} className="img-fluid"></img>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-md-7 view-product-content-flex">
              <div className="view-product-content-container">
                <div style={{ fontSize: "24px" }}>
                  {filterProduct.productName}
                </div>
                <h2>₹{filterProduct.price}</h2>
                <div>Description: {filterProduct.description}</div>
              </div>
              <div className="view-product-btn">
                {cartProductId.includes(filterProduct._id) ? (
                  <button onClick={() => navigate("/cart")}>Go to Cart</button>
                ) : (
                  <button onClick={() => addToCart(filterProduct)}>
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
              Please Login to add the product in to cart
            </Alert>
          </Snackbar>
        </Stack>
      </div>
    </BaseApp>
  );
}
