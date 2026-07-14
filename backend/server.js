const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("./models/order");
const admin = require("./middleware/admin");
const auth = require("./middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
console.log("THIS IS MY SERVER");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const Product = require("./models/product");
const app = express();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
app.use(
  cors({
    origin: ["https://vasundhar-ecommerce.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const products = require("./products");
const PORT = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
});

app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce Backend!");
});

console.log(products);

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    console.log("Requested ID:", req.params.id);

    const product = await Product.findById(req.params.id);

    console.log("Found product:", product);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    filename: req.file.filename,
  });
});

app.post("/products", auth, admin, async (req, res) => {
  console.log("🔥 POST route reached");
  console.log("Request body:", req.body);

  try {
    const product = await Product.create(req.body);

    console.log("Product saved:", product);

    res.status(201).json(product);
  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/products/:id", auth, admin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,

      req.body,

      { new: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/products/:id", auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      },
    );

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/admin/orders", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/admin/orders/:id", auth, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/orders", auth, async (req, res) => {
  try {
    const { items, total } = req.body;

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/orders/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/admin/dashboard", auth, admin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$total",
          },
        },
      },
    ]);

    res.json({
      products: totalProducts,
      orders: totalOrders,
      pending: pendingOrders,
      revenue: revenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/create-order", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.id);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.id}`,
        });
      }

      total += product.price * item.quantity;
    }

    const options = {
      amount: total * 100, // paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      order,
      total,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to create order",
    });
  }
});

app.post("/verify-payment", auth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      total += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      status: "Paid",
      paymentId: razorpay_payment_id,
    });

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.use((req, res) => {
  console.log("Unknown route:", req.method, req.url);
  res.status(404).send("Route not found");
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
