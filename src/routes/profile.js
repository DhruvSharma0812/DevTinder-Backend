const express = require ('express');
const { userAuth } = require('../middleware/auth');
const { validateEditProfileData } = require('../utils/validation');
const validator = require ('validator');
const bcrypt = require ('bcrypt');

const profileRouter = express.Router();

profileRouter.get ("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send (user);
    }
    catch (err) {
        res.status (400). send ("Error : " + err.message);
    }
})

profileRouter.patch ("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData) {
            throw new Error ("Invalid Edit Request...!");
        }

        const loggedInUser = req.user; // getting user details who are logged in

        Object.keys (req.body).forEach (
            (key) => (loggedInUser [key] = req.body[key])
        );

        await loggedInUser.save();

        res.json ({
            message : `${loggedInUser.firstName} Your Profile Updated Successfully...!`,
            data : loggedInUser,
        });
    }
    catch (err) {
        res.status(400).send ("Error : " + err.message);
    }
})

profileRouter.patch ("/profile/password", userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!currentPassword || !newPassword) {
            throw new Error ("Both Current Password and New Password are required...!");
        }

        if (!validator.isStrongPassword (newPassword)) {
            throw new Error ("Enter a Strong Password...!");
        }

        const loggedInUser = req.user;

        const isPasswordValid = await bcrypt.compare (currentPassword, loggedInUser.password);
        if (!isPasswordValid) {
            throw new Error ("Current Password is Incorrect...!");
        }

        const hashPassword = await bcrypt.hash (newPassword, 10);

        loggedInUser.password = hashPassword;
        await loggedInUser.save();

        res.json ({
            message : "The Password Updated Successfully...!",
        })

    }
    catch (err) {
        res.status(400).send ("Error : " + err.message);
    }
})

module.exports = profileRouter;