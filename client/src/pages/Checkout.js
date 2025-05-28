import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css"; 

export default function Checkout() {
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

// Inside handleSubmit:
const handleSubmit = async (e) => {
  e.preventDefault();

  const filteredShippingInfo = {
    name: shippingInfo.name,
    address: shippingInfo.address,
    phone: shippingInfo.phone,
  };

  const order = {
    shippingInfo: filteredShippingInfo,
    paymentMethod,
    items: JSON.parse(localStorage.getItem("cart") || "[]"),
  };

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // ✅ Step 1: Check token presence
  console.log("Token being sent to server:", token);

  if (!token) {
    alert("No token found. Please login again.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/api/orders", order, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.setItem("order", JSON.stringify(response.data));
    localStorage.setItem("cart", JSON.stringify(order.items));
    navigate("/invoice");
  } catch (error) {
    console.error("Order failed:", error.response?.data || error.message);
    alert("Order could not be placed. " + (error.response?.data?.message || ""));
  }
};

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <h3>Shipping Information</h3>
        <input
          type="text"
          placeholder="Full Name"
          value={shippingInfo.name}
          onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={shippingInfo.address}
          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={shippingInfo.city}
          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={shippingInfo.postalCode}
          onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={shippingInfo.phone}
          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
          required
        />

        <h3>Payment Method</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>Cash on Delivery</option>
          <option>Credit Card</option>
        </select>

        <button type="submit">Confirm Order</button>
      </form>
    </div>
  );
}
