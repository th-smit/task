const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");
const { successResponse, errorResponse } = require("../utils/Response");

const Payment = async (req, res) => {
  try {
    const { ticketid } = req.params;
    const TicketData = await Ticket.findById(ticketid);
    console.log("ticket data " + TicketData);
    console.log("ticket price is " + TicketData.price);

    const userData = await User.findOne({
      email: req.body.email,
    });
    console.log("customr id ", userData.customer_id);

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "INR",
      receipt_email: userData.email,
      customer: userData.customer_id,
      amount: TicketData.price * 100,
      payment_method_types: ["card"],
      payment_method_options: {
        card: {
          setup_future_usage: "off_session",
        },
      },
      // automatic_payment_methods: {
      //   enabled: true,
      // },
    });

    const paymentMethods = await stripe.paymentMethods.list({
      customer: userData.customer_id,
      type: "card",
    });

    const filteredMethods = {};
    // eslint-disable-next-line array-callback-return
    paymentMethods.data.map((item) => {
      if (!(item.card.fingerprint in filteredMethods)) {
        filteredMethods[item.card.fingerprint] = item;
      }
    });
    console.log("filter method", filteredMethods);

    console.log("payment intent key is " + paymentIntent.id);
    if (!TicketData.payment_intentkey) {
      await Ticket.findByIdAndUpdate(
        ticketid,
        { $set: { payment_intentkey: paymentIntent.id } },
        { new: true }
      );
    }

    successResponse(
      {
        client_secret: paymentIntent.client_secret,
        paymentkey: paymentIntent.id,
        paymentMethods: Object.values(filteredMethods),
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
