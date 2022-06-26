const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

exports.listAll = async (req, res) => {
  const products = await Product.find({});
  if (products) {
    res.json(products);
  } else {
    res.json({ error: "Error fetching products..." });
  }
};

exports.productById = async (req, res, next) => {
  const productId = await req.params.productId;
  // console.log(productId);
  Product.findOne({ _id: productId }).exec((err, product) => {
    if (err || !product) {
      console.log(err);
      return res.status(400).json({ error: "Product not found" });
    }
    req.product = product;
    next();
  });
};

exports.read = (req, res) => {
  //   we can leverage the productById middleware to read single product
  console.log("READ", req.product);
  return res.json(req.product);
};

exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { qty: -item.count, sold: +item.count } },
      },
    };
  });

  Product.bulkWrite(bulkOps, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: "Could not update product",
      });
    }
    next();
  });
};

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .populate("category") //_id is the name of ID column for Category model
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "Products not found " });
      }
      res.send(data);
    });
};

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  console.log("THIS IS REQ.PRODUCT", req.product);
  Product.find({
    _id: { $ne: req.product._id },
    category: req.product.category,
  })
    .limit(limit)
    .populate("category")
    .exec((err, data) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "Products not found " });
      }
      res.json(data);
    });
};

exports.listCategories = async (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({ error: "Categories not found " });
    }
    res.json(categories);
  });
};

exports.listBySearch = async (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      console.log(req.body);
      if (key === "price") {
        //price is a field in the Product Model
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = { $in: req.body.filters[key] };
      }
      console.log("findargs", findArgs);
    }
  }

  Product.find(findArgs)
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({ error: err });
    }

    res.json({ message: "Product deleted successfully" });
  });
};

exports.update = async (req, res) => {
  let product = await Product.findById(req.product);
  console.log(product);
  const { title, price, description, category_id, qty, image } = req.body;

  if (product) {
    product.title = title;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category_id = category_id;
    product.qty = qty;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
};

exports.getSoldByCategory = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: {
            category: "$category",
          },
          qtySold: { $sum: "$sold" },
        },
      },
    ]);

    res.send(stats);
  } catch (err) {
    console.log(err);
  }
};

// if (products) {
//   res.json(products);
// } else {
//   res.json({ error: "Error fetching products.." });
// }
// try {
//   const stats = await Order.aggregate([
//     { $match: { status: { $ne: "Cancelled" } } },
//     {
//       $group: {
//         _id: {
//           year: { $year: "$createdAt" },
//           month: { $month: "$createdAt" },
//         },
//         amount: { $sum: "$amount" },
//       },
//     },
//     { $sort: { year: -1, month: -1 } },
//   ]);

//   res.status(200).send(stats);
// } catch (err) {
//   res.status(404).json({ error: err });
// }
