const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./model/user");

app.use(express.json());

// API call for signup
app.post("/signup", async (req, res) => {
    // creating new instance of user Model
    console.log(req.body);
    const user = new User(req.body);

    try {
        await user.save();
        res.send("User Added Successfully...!");
    }
    catch (err) {
        res.status(400).send("Some Error While Adding A User...!!" + err.message);
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

