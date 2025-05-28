import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.productId
    !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  

  const totalPrice = cartItems.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    const localUser = localStorage.getItem("user");
    const sessionUser = sessionStorage.getItem("user");
  
    let userString = localUser || sessionUser;
  
    if (!userString) {
      alert("Please login first to checkout.");
      navigate("/login");
      return;
    }
  
    let userData;
    try {
      userData = JSON.parse(userString);
    } catch (error) {
      // If it's a plain string (e.g., email), just use it
      userData = { email: userString };
    }
  
    if (!userData || !userData.email) {
      alert("Please login first to checkout.");
      navigate("/login");
      return;
    }
  
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
  
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return <div className="cart"><h2>Your cart is empty</h2></div>;
  }

  return (
    <div className="cart">
      <h2> Cart</h2>
      <div className="cart-items">
      {cartItems.map((item) => (
  <div className="cart-item" key={item.productId}>
    <img src={item.coverImageUrl} alt={item.title} />
    <div className="item-info">
      <h3>{item.title}</h3>
      <p>Price: Rs. {item.price}</p>
      <div className="quantity-controls">
        <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) =>
            handleQuantityChange(item.productId, parseInt(e.target.value))
          }
        />
        <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
      </div>
      <p>Subtotal: Rs. {(item.price * item.quantity).toFixed(2)}</p>
      <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
    </div>
  </div>
))}

      </div>
      <div className="cart-summary">
        <h3>Total: Rs. {totalPrice.toFixed(2)}</h3>
        <button className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
}
