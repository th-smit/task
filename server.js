const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connectDb = require("./config/connectDb");
// const { stripBasename } = require("@remix-run/router");

//configure dotenv file
dotenv.config();

//database call
connectDb();

//rest object
const app = express();

//middleware
app.use(express.json());
app.use(cors());

app.get("/config", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.use("/payment", require("./routes/PaymentRoutes"));

app.use("/pwd", require("./routes/otpRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/movie", require("./routes/movieRoutes"));
app.use("/show", require("./routes/showRoutes"));
app.use("/ticket", require("./routes/ticketRoutes"));
app.use("/promocode", require("./routes/promocodeRoutes"));
app.use("/userpromo", require("./routes/userRoutes"));

//port
const PORT = 8080;

//listening server
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
