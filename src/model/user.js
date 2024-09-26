const mongoose = require("mongoose");
const validator = require ('validator');
const jwt = require ("jsonwebtoken");
const bcrypt  = require ('bcrypt')

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
            enum : {
                values : ["male", "female", "other"],
                message : ` {VALUE} is not a valid gender type`
            }
            // validate(value) {
            //     if (!["male", "female", "other"].includes(value)) {
            //         throw new Error("Gender Data Is Not Valid");
            //     }
            // },
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

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign ( { _id : user._id }, "DhruvJaspreet", { expiresIn : '7d' } );

    return token;
}

userSchema.methods.validatePassword = async function ( userInputpassword ) {
    const user = this;

    const isPasswordValid = await bcrypt.compare ( userInputpassword, user.password);

    return isPasswordValid;
}

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
