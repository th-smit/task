const express = require("express");
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

//routesconst route = require("./routes/routes");
app.use("/movies", require("./routes/movieRoutes"));
app.use("/users", require("./routes/userRoutes"));

//port
const PORT = 8080;

//listening server
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
