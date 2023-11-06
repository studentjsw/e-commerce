import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import BaseApp from "../BaseApp/baseApp";
import { AppState } from "../Context/AppProvider";
import { Form } from "react-bootstrap";

export default function Payment() {
  const navigate = useNavigate();
  const {
    totalCartPrice,
    setCartProductId,
    setProductCount,
    setTotalCartPrice,
  } = AppState();
  const [addressLine1,setAddressLine1]= useState("")
  const [addressLine2,setAddressLine2]= useState("")
  const [city,setCity]= useState("")
  const [state,setState]= useState("")
  const [postalCode,setPostalCode]= useState("")
  const [country,setCountry]= useState("")
  const [error,setError]= useState(false)

  const deleteAllCartData = async () => {
    const userId = localStorage.getItem("cUserId");
    const response = await fetch(
      `https://ecommerce-8rwm.onrender.com/cart/delete/all/${userId}`,
      { method: "DELETE" }
    );
    const cartDatas = await response.json();
    setCartProductId([]);
    setProductCount(0);
    setTotalCartPrice(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(addressLine1.length !== 0 && addressLine2 !== 0 && city.length !== 0 && state.length !== 0 && postalCode.length !== 0 && country.length !== 0 ){
    if (totalCartPrice == 0) {
      alert("Please Enter Amount");
    } else {
      var options = {
        key: "rzp_test_VEDkVn43r9ApFb",
        key_secret: "mFdBX0X7fiIkL4RSlNAKzFEL",
        amount: totalCartPrice * 100,
        currency: "INR",
        name: "E Commerce",
        description: "Product Purchase",
        handler: function (response) {
          
          toast.success(
            `your Payment is Completed Successfully, Your tranction Id ${response.razorpay_payment_id}`
          );
          deleteAllCartData();
          navigate("/home");       
        },
        prefill: {
          name: "jayasuriya",
          email: "jayasuriya@gmail.com",
          contact: "7384945834",
        },
        notes: {
          address: "Razorpay Corporate office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      var pay = new window.Razorpay(options);
      pay.open();
     
    }}else{
      setError(true)
    }
  };
  return (
    <BaseApp>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-6">
            <Form>
              <Form.Group controlId="addressLine1" className="pt-3">
              {error ? <p style={{color:"crimson"}}>Please Fill All Field</p> : ""}
                <Form.Control type="text" onChange={(e)=>setAddressLine1(e.target.value)} placeholder="Enter address line 1"/>
              </Form.Group>

              <Form.Group controlId="addressLine2" className="pt-3">
                <Form.Control type="text" onChange={(e)=>setAddressLine2(e.target.value)} placeholder="Enter address line 2" />
              </Form.Group>

              <Form.Group controlId="city" className="pt-3">
                <Form.Control type="text" onChange={(e)=>setCity(e.target.value)} placeholder="Enter city" />
              </Form.Group>

              <Form.Group controlId="state" className="pt-3">
                <Form.Control type="text" onChange={(e)=>setState(e.target.value)} placeholder="Enter state" />
              </Form.Group>

              <Form.Group controlId="postalCode" className="pt-3">
                <Form.Control type="number" onChange={(e)=>setPostalCode(e.target.value)} placeholder="Enter postal code" />
              </Form.Group>

              <Form.Group controlId="country" className="pt-3">
                <Form.Control type="text" onChange={(e)=>setCountry(e.target.value)} placeholder="Enter country" />
              </Form.Group>
              <button className="pay-btn" onClick={(e) => handleSubmit(e)}>
                Pay
              </button>
            </Form>
          </div>
        </div>
      </div>
    </BaseApp>
  );
}
