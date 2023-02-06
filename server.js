const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/connectDb");

//configure dotenv file
dotenv.config();

//database call
connectDb();

//rest object
const app = express();

//middleware
app.use(express.json());
app.use(cors());

// function verifyToken(req, res, next) {
//
// }
app.use("/pwd", require("./routes/otpRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/movie", require("./routes/movieRoutes"));

//port
const PORT = 8080;

//listening server
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
