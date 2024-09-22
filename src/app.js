const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require ("./model/user");

app.use (express.json());

// API call for signup
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

// API call to get User with specific email
app.get ("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await User.findOne ({ emailId : userEmail });
        if (!user) {
            res.status(400).send ("User with This Email Not Found");
        }
        else {
            res.send (user);
        }
    }

    catch (err) {
        res.status(400).send ("Something Went Wrong...!!!");
    }
})
// Instead of findOne we can also use find And don't pass any filter but find will return an array which 
// contains all the documents with that email and find will return the oldest email 

// API call to get All User (FEED)
app.get ("/feed", async (req, res) => {
    try {
        const users = await User.find ();
        if (users.length === 0) {
            res.status(400).send ("No User Found");
        }
        else {
            res.send (users);
        }
    }
    catch (err) {
        res.status(400).send("Something Went Wrong....!!!");
    }
})

// API call to get uesr by ID
app.get ('/userID', async (req, res) => {
    const userID = req.body.id;
    try {
        console.log (userID)
        const user = await User.findById ( userID );
        if (!user) {
            res.status (400).send ("User Not Found...!");
        }
        else {
            res.send (user);
        }
    }
    catch (err) {
        res.status(400).send("Something Went Wrong")
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

