const express = require ('express');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require ('bcrypt');
const User = require('../model/user');
const { userAuth } = require('../middleware/auth');

const authRouter = express.Router();

authRouter.post ("/signup", async (req, res) => {
    try {
        // validate the data
        validateSignUpData(req);

        // bcrypt the password
        const { firstName, lastName, password, emailId } = req.body;
        const passwordHash = await bcrypt.hash (password, 10);

        // create new instance of User Model
        const user = new User ({
            firstName,
            lastName,
            emailId,
            password : passwordHash
        })

        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
          });
      
        res.json({ message: "User Added successfully!", data: savedUser })
    }
    catch (err) {
        res.status(400).send ("Error : " + err.message);
    }
})

authRouter.post ("/login", async (req, res) => {
    try {
        const { password, emailId } = req.body;
        const user = await User.findOne ( {emailId : emailId} );

        if (!user) {
            throw new Error ("Invalid Credentials...!");
        }

        const isPasswordValid = await user.validatePassword (password);
        if (isPasswordValid) {
            // Create A JWT TOKEN
            const token = await user.getJWT();

            // Add Token to cookie and send response
            res.cookie ( "token", token, { expires : new Date ( Date.now() + 8 * 3600000 )} )
            res.json ({
                message : "Login Success...!",
                data : user,
            });
        }
        else {
            throw new Error ("Invlaid Credentials...!");
        }
    }
    catch (err) {
        res.status (400). send ("Error : " + err.message);
    }
})

authRouter.post ("/logout", (req, res) => {
    res.cookie ("token", null, {
        expires : new Date (Date.now()),
    });

    res.send ("Logout Success...!");
})

module.exports = authRouter;