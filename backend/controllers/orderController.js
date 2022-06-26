const { Order, CartItem } = require("../models/orderModel");
const { Customer } = require("../models/customerModel");

exports.create = (req, res) => {
  // console.log("REQ.BODY", req.body);
  // console.log("REQ.BODY.ORDER", req.body.order);
  req.body.order.customer = req.payload.userObj.userDetails.userId;
  const order = new Order(req.body.order);
  order.save((error, data) => {
    if (error) {
      return res.status(400).json({
        error: error,
      });
    }

    res.json(data);
  });
};

exports.listUserOrders = (req, res) => {
  Order.find({ customer: req.payload.userObj.userDetails.userId })
    .populate("customer", "_id first_name last_name address")
    .sort("-createdAt")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json(orders);
    });
};

exports.listAllOrders = (req, res) => {
  Order.find({})
    .populate("customer", "_id first_name last_name address")
    .sort("-createdAt")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json(orders);
    });
};

exports.getStatusValues = (req, res) => {
  //this is to send the enum status values to the client to create a dropdown in the client
  res.json(Order.schema.path("status").enumValues);
};

exports.updateOrderStatus = (req, res) => {
  const { orderId, status } = req.body;
  Order.findById(orderId).exec((err, order) => {
    if (err || !order) {
      return res.status(403).json({ error: "No such expense found." });
    } else {
      order.status = status;

      order.save((err, updatedOrder) => {
        if (err) {
          return res.status(400).json({ error: "Order update failed." });
        }
        res.json(updatedOrder);
      });
    }
  });
};

exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          avgOrderAmount: { $avg: "$amount" },
          maxOrderAmount: { $max: "$amount" },
          minOrderAmount: { $min: "$amount" },
        },
      },
    ]);

    res.status(200).send(stats);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

exports.getOrderStatsByCustomer = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: "$customer_id",
          numOrders: { $sum: 1 },
        },
      },
      { $sort: { numOrders: -1 } },
    ]);

    res.status(200).send(stats);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

exports.getOrderStatsByMonth = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $unwind: "$products" },

      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          products: { $sum: "$products.count" },

          // product: { $push: "$products.title" },
          // count: { $push: "$products.count" },
        },
      },
      { $sort: { year: -1, month: -1 } },
    ]);

    res.status(200).send(stats);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getAmountEarnedByMonth = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { year: -1, month: -1 } },
    ]);

    res.status(200).send(stats);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

exports.getStatusValues = (req, res) => {
  //this is to send the enum status values to the client to create a dropdown in the client
  res.json(Order.schema.path("status").enumValues);
};
