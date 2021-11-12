const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const DB = process.env.DB;
const SERVER = process.env.SERVER;

const routes = require("./routes");
const mongoose = require("mongoose");
mongoose.connect(DB, { useNewUrlParser: true }).then(() => {
  const app = express();
  app.use(express.json())
  app.use("/api", routes);

  app.listen(PORT, () => {
    console.log("Server has started!");
  });
});
