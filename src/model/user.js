const mongoose = require("mongoose");
const validator = require ('validator');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 20,
            validate: {
                validator: function (v) {
                    return /^[A-Za-z]+$/.test(v);  
                },
                message: "First name can only contain alphabets"
            }
        },

        lastName: {
            type: String,
            validate : {
                validator : function (v) {
                    return /^[A-Za-z]+$/.test(v);
                },
                message : "Last Name Can Only Contain Alphabets"
            }
        },

        emailId: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            validate (value) {
                if (!validator.isEmail (value)) {
                    throw new Error ("Invalid Email");
                }
            }
        },

        password: {
            type: String,
            required: true,
            validate (value) {
                if (!validator.isStrongPassword (value)) {
                    throw new Error ("Enter a strong password");
                }
            }
        },

        age: {
            type: Number,
            min: [18, "Age must be at least 18"],
            max: [100, "Age cannot exceed 100"]
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
            validate (value) {
                if (!validator.isURL (value)) {
                    throw new Error ("Enter a valid photo URL...!");
                }
            }
        },

        about: {
            type: String,
            default: "This is Default About",
            maxLength: [500, "About section cannot exceed 500 characters"]
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
