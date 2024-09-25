const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./model/user");
const { validateSignUpData } = require ('./utils/validation')
const bcrypt  = require ('bcrypt')
const cookieParser = require ('cookie-parser')
const jwt = require ('jsonwebtoken');

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

app.get ('/profile', async (req, res) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;

        if (!token) {
            throw new Error ("Invalid Token...!");
        }

        const decodedMsg = await jwt.verify ( token, "DhruvJaspreet" );
        const { _id } = decodedMsg;

        const user = await User.findById ( _id );

        if (!user) {
            throw new Error ("User does not exist");
        }

        res.send (user);
    }
    catch (err) {
        res.status(400).send ("Something wrong")
    }
})

// API call to get User with specific email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        const user = await User.findOne({ emailId: userEmail });
        if (!user) {
            res.status(400).send("User with This Email Not Found");
        }
        else {
            res.send(user);
        }
    }

    catch (err) {
        res.status(400).send("Something Went Wrong...!!!");
    }
})
// Instead of findOne we can also use find And don't pass any filter but find will return an array which 
// contains all the documents with that email and find will return the oldest email 

// API call to get All User (FEED)
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find();
        if (users.length === 0) {
            res.status(400).send("No User Found");
        }
        else {
            res.send(users);
        }
    }
    catch (err) {
        res.status(400).send("Something Went Wrong....!!!");
    }
})

// API call to get uesr by ID
app.get('/userID', async (req, res) => {
    const userId = req.body.userId;
    try {
        console.log(userId)
        const user = await User.findById(userId);
        if (!user) {
            res.status(400).send("User Not Found...!");
        }
        else {
            res.send(user);
        }
    }
    catch (err) {
        res.status(400).send("Something Went Wrong")
    }
})

// API call to DELETE user by ID
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try {
        const user = await User.findByIdAndDelete(userId);
        res.send({
            message: "User Deleted Successfully...!",
            userDeleted: user
        });
    }
    catch (err) {
        res.status(400).send("Something Went Wrong...!!" + err.message);
    }
})

// API call to UPDATE user by ID
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"]
        const isUpdateAllowed = Object.keys (data).every ((key) => ALLOWED_UPDATES.includes (key));
        if (!isUpdateAllowed) {
            throw new Error ("Update is Not Allowed...!");
        }

        if (data?.skills.length > 10) {
            throw new Error ("You can not add more than 10 skills");
        }

        const user = await User.findByIdAndUpdate(userId, data, {
            new: true, // To return the updated document
            runValidators: true // To ensure validation rules are applied
        });

        if (!user) {
            return res.status(404).send({
                message: "User not found",
            });
        }

        console.log(user);
        res.send({
            message: "User Updated Successfully...!",
            Updated_USER: user,
        });
    } catch (err) {
        res.status(400).send("Something Went Wrong...!!!!!!!!" + err.message);
    }
});

// API call to UPDATE user by email
app.patch("/userEmail", async (req, res) => {
    const userEmail = req.body.emailId; // Ensure this is correctly referenced
    const data = req.body; // Get all data from the body

    try {
        // Await the result of the update operation
        const user = await User.findOneAndUpdate({ emailId: userEmail }, data, {
            new: true, // To return the updated document
            runValidators: true // To ensure validation rules are applied
        });

        if (!user) {
            return res.status(404).send({
                message: "User not found",
            });
        }

        console.log(user);
        res.send({
            message: "User Updated Successfully...!",
            Updated_USER: user,
        });
    } catch (err) {
        res.status(400).send("Something Went Wrong...!!!!!!!!" + err.message);
    }
});



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

