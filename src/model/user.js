const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 20,
        },

        lastName: {
            type: String,
        },

        emailId: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        age: {
            type: Number,
            min: 18,
        },

        gender: {
            type: String,
            validate(value) {
                if (!["male", "female", "other"].includes(value)) {
                    throw new Error("Gender Data Is Not Valid");
                }
            },
        },

        photoUrl: {
            type: String,
            default: "https://geographyandyou.com/images/user-profile.png",
        },

        about: {
            type: String,
            default: "This is Default About",
        },

        skills: {
            type: [String],
        },
    },

    {
        timestamps : true,
    }
);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
