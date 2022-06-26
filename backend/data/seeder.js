const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("../config/db");
const Category = require("../models/categoryModel");
const Customer = require("../models/customerModel");
const Product = require("../models/productModel");
const categories = require("./categories");
const products = require("./products");
const customers = require("./customers");

connectDB();

const importData = async () => {
  try {
    // await Category.deleteMany();

    // await Category.insertMany(categories);

    await Product.deleteMany();

    await Product.insertMany(products);

    // await Customer.deleteMany();

    // await Customer.insertMany(customers);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();
    await Customer.deleteMany();
    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
