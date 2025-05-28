const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      bookTitle: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],

  shippingInfo: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true }
    
  },

  paymentMethod: { type: String, required: true },

  total: { type: Number, required: true },

  status: { type: String, default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
