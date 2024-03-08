const express = require('express');
const cors = require('cors');
require("./config/DB");
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//authentication
// const {authenticationRouter}=require("./helper/Authorization.route");
// app.use("/api/v1/authentication",authenticationRouter);

//committee group routes
const userRoute = require("./routes/user.route");
app.use("/api/v1", userRoute);


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
