const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./model/user");
const { validateSignUpData } = require ('./utils/validation')
const bcrypt  = require ('bcrypt')
const cookieParser = require ('cookie-parser')
const jwt = require ('jsonwebtoken');
const { userAuth } = require('./middleware/auth');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');
const cors = require("cors");

app.use (cors( {
    origin : "http://localhost:5173",
    credentials: true,
} ));
app.use (express.json());
app.use (cookieParser());

app.use ("/", authRouter);
app.use ("/", profileRouter);
app.use ("/", requestRouter);
app.use ("/", userRouter);


connectDB()
    .then(() => {
        console.log("Database Connected Succesfully....!");
        app.listen(7777, () => {
            // This function takes port number and callback function
            console.log("Server is Running on port 3000....");
        })
    })
    .catch((err) => {
        console.log("Error while connecting can't connect..!");
    })

