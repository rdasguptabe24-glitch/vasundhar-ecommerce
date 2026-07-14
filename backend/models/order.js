const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  items: [
    {
      name: String,
      price: Number,
      image: String,
      quantity: Number,
    },
  ],

  total: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["Pending", "Paid", "Cancelled"],
    default: "Paid",
  },

  // NEW
  paymentId: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
