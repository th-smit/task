const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const { successResponse, errorResponse } = require("../utils/Response");

const Payment = async (req, res) => {
  try {
    const { ticketid } = req.params;
    await Ticket.findById(ticketid);
    await User.findById({
      email: req.body.email,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "inr",
      amount: 1000,
      description: "Ticket Booked",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    await Ticket.findByIdAndUpdate(
      ticketid,
      { $set: { payment_intentkey: paymentIntent.id } },
      { new: true }
    );

    successResponse(
      {
        client_secret: paymentIntent.client_secret,
        paymentkey: paymentIntent.id,
      },
      res
    );
  } catch (error) {
    errorResponse(error, res, 500);
  }
};

module.exports = {
  Payment,
};
