const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require ("./model/user");

app.use (express.json());

app.post ("/signup", async (req, res) => {
    // creating new instance of user Model
    console.log (req.body);
    const user = new User (req.body);

    try {
        await user.save ();
        res.send ("User Added Successfully...!");
    }
    catch (err) {
        res.status (400). send ("Some Error While Adding A User...!!" + err.message);
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

