const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require ("./model/user")

app.post ("/signup", async (req, res) => {
    // creating new instance of user Model
    const user = new User ({
        firstName : "user1",
        lastName : "test",
        emailId : "user1@gmail.com",
        password : "12345678",
    })

    try {
        await user.save ();
        res.send ("User Added Successfully...!");
    }
    catch (err) {
        res.status (400). send ("Some Error While Adding A User...!!");
    }
})

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

