const Customer = require("../models/customerModel");
exports.addOrderToUserHistory = async (req, res, next) => {
  let history = [];
  // console.log("reqbody", req.body);
  // const { order } = req.body;
  // console.log(order, "DECONSTREUCT order");
  try {
    req.body.order.products.forEach((item) => {
      history.push({
        _id: item._id,
        name: item.title,
        description: item.description,
        category: item.category,
        quantity: item.count,
        transaction_id: req.body.order.transaction_id,
        amount: req.body.order.amount,
      });
    });

    const customerTemp = await Customer.findOne({
      _id: req.payload.userObj.userDetails.userId,
    });
    // console.log(customerTemp);
    customerTemp.history.push(history);
    await customerTemp.save();
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const customer = await Customer.findById(
      req.payload.userObj.userDetails.userId
    );
    res.send(customer);
  } catch (err) {
    res.send(err);
  }
};

exports.updateUserInfo = async (req, res) => {
  try {
    const customer = await Customer.findById(
      req.payload.userObj.userDetails.userId
    );

    if (customer) {
      customer.username = req.body.username || customer.username;
      customer.first_name = req.body.first_name || customer.first_name;
      customer.last_name = req.body.last_name || customer.last_name;
      customer.postal_code = req.body.postal_code || customer.postal_code;
      customer.email = req.body.email || customer.email;
      if (req.body.password) {
        customer.password = req.body.password;
      }
      const updatedUser = await customer.save();
      res.send(updatedUser);
    }
  } catch (err) {
    res.status(404).json({ error: "User not found" });
  }
};
