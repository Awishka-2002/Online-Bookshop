import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Invoice.css";
import {  FaPrint, FaHome } from 'react-icons/fa';

export default function Invoice() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("order"));
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setOrder(storedOrder);
    setCartItems(storedCart);
  }, []);

  if (!order || cartItems.length === 0) {
    return <p style={{ textAlign: "center" }}>No order found.</p>;
  }

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleBackHome = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("order");
    navigate("/");
  };

  return (
    <div className="invoice-container">
      <h2>Invoice</h2>
      <h3>Shipping Details:</h3>
      <p><strong>Name:</strong> {order.shippingInfo.name}</p>
      <p><strong>Address:</strong> {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.postalCode}</p>
      <p><strong>Phone:</strong> {order.shippingInfo.phone}</p>
      <h3>Payment Method:</h3>
      <p>{order.paymentMethod}</p>
      <h3>Ordered Items:</h3>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.title} - {item.quantity} x Rs.{item.price}
          </li>
        ))}
      </ul>

      <h3>Total: Rs.{totalPrice.toFixed(2)}</h3>

      <div className="invoice-buttons">
        <button onClick={handlePrint}>
          <FaPrint style={{ marginRight: "8px" }} />
          Print Invoice
        </button>

        <button onClick={handleBackHome}>
          <FaHome style={{ marginRight: "8px" }} />
          Back to Home
        </button>
      </div>
    </div>
  );
}
