const { signAccessToken, signRefreshToken } = require("../helpers/jwtHelpers");
const Customer = require("../models/customerModel");
const { Order } = require("../models/orderModel");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Customer.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: "User with that email not found." });
  }

  if (user && (await user.matchPassword(password))) {
    let userDetails = {
      userId: user._id,
      userName: user.username,
      admin: user.admin,
    };
    const accessTokenData = await signAccessToken({
      userDetails,
    });
    const refreshTokenData = await signRefreshToken({
      userDetails,
    });

    res.send({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        admin: user.admin,
      },

      accessTokenData,
      refreshTokenData,
    });
  } else {
    return res.status(400).json({ error: "Email and password do not match." });
  }
};

exports.register = async (req, res) => {
  const {
    username,
    first_name,
    last_name,
    email,
    gender,
    postal_code,
    password,
  } = req.body;

  const userByEmail = await Customer.findOne({ email });
  const userByUsername = await Customer.findOne({ username });
  if (userByEmail && userByUsername) {
    return res.status(400).json({
      error: "Both username and email are taken!",
    });
  }
  if (userByEmail) {
    return res.status(400).json({
      error: "Email is taken!",
    });
  }

  if (userByUsername) {
    return res.status(400).json({
      error: "Username is taken!",
    });
  }
  try {
    const user = await Customer.create({
      username,
      first_name,
      last_name,
      gender,
      postal_code,
      email,
      password,
    });
    let userDetails = {
      userId: user._id,
      userName: user.username,
      admin: user.admin,
    };

    const accessTokenData = await signAccessToken(userDetails);
    const refreshTokenData = await signRefreshToken(userDetails);
    res.status(200).send({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      accessTokenData,
      refreshTokenData,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: "Error with registration. Please try again." });
  }
};

exports.getUserInfo = async (req, res) => {
  const { id } = req.payload;
  try {
    const customer = await Customer.findById(id);
    res.send(customer);
  } catch (err) {
    res.send(err);
  }
};

exports.updateUserInfo = async (req, res) => {
  const { id } = req.payload;
  try {
    const customer = await Customer.findById(id);

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

exports.getPurchaseHistory = async (req, res) => {
  await Order.find({ customer_id: req.payload.id })
    .populate("customer_id", "_id last_name")
    .sort("-createdAt")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({ error: err });
      }

      res.json(orders);
    });
};

exports.getUserStats = async (req, res) => {
  try {
    const stats = await Customer.aggregate([
      { $match: { admin: { $ne: true } } },
      {
        $group: {
          _id: null,
          numRegisteredUsers: { $sum: 1 },
        },
      },
    ]);

    res.status(200).send(stats);
  } catch (err) {
    res.status(404).json({ error: err });
  }
};

exports.adminMiddleware = (req, res, next) => {
  console.log(req.payload.userObj.userDetails);
  console.log(req.payload.userObj.userDetails.admin);
  if (
    req.payload.userObj.userDetails &&
    req.payload.userObj.userDetails.admin
  ) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};
