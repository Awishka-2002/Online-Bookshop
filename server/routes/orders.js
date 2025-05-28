const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const verifyToken = require("../middleware/verifyToken");

// ✅ Get all orders for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ Place a real order
router.post("/", verifyToken, async (req, res) => {
  try {
    // 🐛 DEBUG LOGGING
    console.log("📦 Incoming order request:", req.body);
    console.log("👤 Authenticated user ID:", req.user.id);

    const { shippingInfo, paymentMethod, items } = req.body;

if (!shippingInfo || !paymentMethod || !items || items.length === 0) {
  return res.status(400).json({ error: "Incomplete order data." });
}

// ✅ Map to correct schema
const transformedItems = items.map(item => ({
  bookTitle: item.title,
  price: parseFloat(item.price),
  quantity: item.quantity
}));


const total = transformedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

const newOrder = new Order({
  user: req.user.id,
  shippingInfo,
  paymentMethod,
  items: transformedItems,
  total,
});


    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: "Failed to place order." });
  }
});

// 🧪 Dummy test route
router.post("/create", verifyToken, async (req, res) => {
  try {
    const newOrder = new Order({
      user: req.user.id,
      shippingInfo: {
        name: "Test User",
        address: "123 Test Street",
        phone: "000-000-0000"
      },
      paymentMethod: "Test Payment",
      items: [{ bookTitle: "Test Book", quantity: 1, price: 25 }],
      total: 25,
    });

    await newOrder.save();
    res.json({ message: "Order created", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

module.exports = router;
