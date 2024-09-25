const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./model/user");
const { validateSignUpData } = require ('./utils/validation')
const bcrypt  = require ('bcrypt')
const cookieParser = require ('cookie-parser')
const jwt = require ('jsonwebtoken');
const { userAuth } = require('./middleware/auth');

app.use (express.json());
app.use (cookieParser());

// API call for signup
app.post("/signup", async (req, res) => {
    
    try {
        // Validation of Data
        validateSignUpData (req);

        // bcrypt the password
        const { password, firstName, lastName, emailId } = req.body;
        const passwordHash = await bcrypt.hash (password, 10);
    
        // creating new instance of user Model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash,
        });
        
        await user.save();
        res.send("User Added Successfully...!");
    }
    catch (err) {
        res.status(400).send("Some Error While Adding A User...!!" + err.message);
    }
})

// API call for login
app.post ('/login', async (req, res) => {
    try {
        const { password, emailId } = req.body;
        const user = await User.findOne ( {emailId : emailId} );

        if (!user) {
            throw new Error ("Invalid Credentials...!");
        }

        const isPasswordValid = bcrypt.compare (password, user.password);
        if (isPasswordValid) {
            // create JWT token
            const token = await jwt.sign ( { _id : user._id }, "DhruvJaspreet" );

            // Add token to cookie and send response
            res.cookie ("token", token);
            res.send ("Login Success...!");
        }

        else {
            throw new Error ("Invalid Credentials...!");
        }
    }
    catch (err) {
        res.send ("Something went wrong : " + err.message)
    }
})

app.get ('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send (user);
    }
    catch (err) {
        res.status(400).send ("Error : " + err.message);
    }
})

app.post ('/sendConnectionRequest', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send (user.firstName + " Sent You a Connectino Request");
    }
    catch (err) {
        res.status(400).send ("Error : " + err.message);
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

