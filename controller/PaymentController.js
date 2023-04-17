const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { successResponse, errorResponse } = require("../utils/Response");

const Payment = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "inr",
      amount: 1000,
      //   description: "Software development services",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    successResponse({ client_secret: paymentIntent.client_secret }, res);
  } catch (error) {
    errorResponse(error, res, 500);
  }
};

module.exports = {
  Payment,
};
