const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const DB = process.env.DB;
const SERVER = process.env.SERVER;

const routes = require("./routes");
const mongoose = require("mongoose");

mongoose.connect(DB, { useNewUrlParser: true }).then(() => {
  const app = express();

  let headers = (req, res, next) => {
     // Website you wish to allow to connect
    //res.setHeader("Access-Control-Allow-Origin", "https://chokhonelidze.github.io/,http://localhost:5000,http://myhome.smho.site:5000");
    res.setHeader("Access-Control-Allow-Origin", process.env.SERVER);

    // Request methods you wish to allow
    res.header(
      "Access-Control-Allow-Methods",
      "Authorization,GET,PUT,POST,DELETE,PATCH,OPTIONS"
    );

    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,text/plain');
    res.setHeader("Access-Control-Allow-Headers", "*");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
  }

  app.use(headers);

  

  app.use(express.json());
  app.use("/api", routes);
  //READ


  app.listen(PORT, () => {
    console.log("PORT =" + PORT);
    console.log("Server has started!");
  });
});
