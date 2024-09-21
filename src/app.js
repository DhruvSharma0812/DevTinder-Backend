const express = require('express');
const app = express();
const {adminAuth, userAuth} = require ('./middleware/auth.js')

app.get ("/getUserData", (req, res) => {
    try {
        // Logic for DB Connection
        throw new Error ("Random Error....!!");
        res.send ("User Data Sent");
    }

    catch (err) {
        res.status(500).send ("Something Went Wring from try-catch")
    }
})

app.use ("/", (err, req, res, next) => {
    if (err) {
        res. status (500). send ("Something went wrong from app use /")
    }
})


app.listen(7777, () => {
    // This function takes port number and callback function
    console.log ("Server is Running on port 3000....");
})