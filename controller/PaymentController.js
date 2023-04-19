const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
let paymentId = null;
const { successResponse, errorResponse } = require("../utils/Response");

const Payment = async (req, res) => {
  try {
    // if (paymentId === null) {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "inr",
      amount: 1000,
      //   description: "Software development services",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    console.log("payment ", paymentIntent);
    console.log("payment intent key is", paymentIntent.client_secret);
    paymentId = paymentIntent.id;
    successResponse(
      {
        client_secret: paymentIntent.client_secret,
        paymentkey: paymentIntent.id,
      },
      res
    );
    // }
  } catch (error) {
    errorResponse(error, res, 500);
  }
};

module.exports = {
  Payment,
};
