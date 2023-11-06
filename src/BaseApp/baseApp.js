import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Carousel from "react-bootstrap/Carousel";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router";
import { AppState } from "../Context/AppProvider";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

export default function BaseApp({ children, banner, footer }) {
  const {
    product,
    setProduct,
    setCartData,
    setTotalCartPrice,
    setProductCount,
    productCount,
    setCartProductId,
  } = AppState();
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("cUserId");
    localStorage.removeItem("cUserToken");
    setCartProductId([]);
    setProductCount(0);
    setTotalCartPrice(0);
    setCartData(null);
    navigate("/home");
  };
  function electronicsFilter(){
    console.log("productData",product)
    const productFilter = product.filter((data)=>{
      return data.category == "electronics"
    })
    console.log("electronicsFilter",productFilter)
    setProduct(productFilter)
  }

  function bookFilter(){
    console.log("productData",product)
    const productFilter = product.filter((data)=>{
      return data.category == "books"
    })
    console.log("electronicsFilter",productFilter)
    setProduct(productFilter)
  }

  function clothFilter(){
    console.log("productData",product)
    const productFilter = product.filter((data)=>{
      return data.category == "clothing"
    })
    console.log("electronicsFilter",productFilter)
    setProduct(productFilter)
  }


  return (
    <div className="base-container">
      <Navbar bg="light" className="sticky-top" expand="lg">
        <Container>
          <Navbar.Brand onClick={() => navigate("/home")}>
            E-Commerce
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate("/home")}>Home</Nav.Link>

              {/* <NavDropdown title="Categories" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={()=>electronicsFilter()}>
                  Electronics
                </NavDropdown.Item>
                <NavDropdown.Item onClick={()=>clothFilter()}>Clothing</NavDropdown.Item>
                <NavDropdown.Item onClick={()=>bookFilter()}>Books</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
          {localStorage.getItem("cUserId") &&
          localStorage.getItem("cUserToken") ? (
            <button className="login-btn" onClick={() => logOut()}>
              Log Out
            </button>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Log In
            </button>
          )}

          <IconButton aria-label="cart" onClick={() => navigate("/cart")}>
            <StyledBadge badgeContent={productCount} color="secondary">
              <ShoppingCartIcon />
            </StyledBadge>
          </IconButton>
        </Container>
      </Navbar>

      {banner ? (
        <div key="8" className="header">
          <h1>Online Shopping</h1>
        </div>
      ) : (
        ""
      )}

      <div className="content-section">{children}</div>
      {footer ? (
        <div className="footer">
          <p>Copyright © 2023 - Ecommerce by hemapriya</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
