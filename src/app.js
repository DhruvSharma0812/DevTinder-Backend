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

const allowedOrigins = ["http://localhost:5173", "http://54.87.198.108"]; // Allow both local and deployed frontend

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // Allow cookies/session sharing
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
}));
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
            console.log("Server is Running on port 7777....");
        })
    })
    .catch((err) => {
        console.log("Error while connecting can't connect..!");
    })

