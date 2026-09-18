const express = require("express");
const env = require("./config/env");
const connectDB = require("./config/db");

const app = express();

app.listen(env.port, ()=>{
    console.log("Server connnected to " + env.port);
    connectDB();
})