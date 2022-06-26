const stripe = require("stripe")(
  "sk_test_51JrxoHD89oAlgjd7V4gTowsHmdAcjV6ZySJ9GeotLzCvdTPYVw2HNAI8RL7uaCq583QNo9EYhYgIzO7up0wFxsVn00f9MsT655"
);
const { Order, CartItem } = require("../models/orderModel");
const { v4: uuidv4 } = require("uuid");

exports.makeOrder = async (req, res) => {
  const { token, subtotal, cartItems } = req.body;
  console.log(token);

  try {
    const customer = await stripe.customers.create({
      //   email: token.email,
      source: token.id,
    });

    console.log(customer);
    const payment = await stripe.charges.create(
      {
        amount: Number(subtotal),
        currency: "SGD",
        customer: customer.id,
        // receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    //   console.log(payment);
    if (payment) {
      //   const newOrder = await new Order({
      //     products: cartItems,
      //     amount: Number(subtotal),
      //     shippingAddress: {
      //       street: token.card.address_line1,
      //       city: token.card.address_city,
      //       country: token.card.address_country,
      //       zipcode: token.card.address_zip,
      //     },
      //     transactionId: payment.source.id,
      //   });

      const newOrder = await Order.create({
        products: cartItems,
        amount: Number(subtotal),
        shippingAddress: {
          street: token.card.address_line1,
          city: token.card.address_city,
          country: token.card.address_country,
          zipcode: token.card.address_zip,
        },
        transactionId: payment.source.id,
      });
      newOrder.save();
      res.send("Payment Done");
    } else {
      res.send("Payment failed");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
