const express = require("express");
const app = express();
const connectDB = require("./config/db");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brainTreeRoutes = require("./routes/brainTreeRoutes");
const customerRoutes = require("./routes/customerRoutes");

app.use(express.json());
app.use(cors());
connectDB();

app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/user", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/braintree", brainTreeRoutes);
app.use("/api/customer", customerRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.resolve("client", "build", "index.html"));
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`API is running on ${port}`);
});
