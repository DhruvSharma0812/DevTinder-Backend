const validator = require ('validator');

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    console.log (firstName, lastName)

    if (!firstName || !lastName) {
        throw new Error ("Name is not valid...!");
    }

    else if (!validator.isEmail (emailId)) {
        throw new Error ("Email Id is Not valid...!");
    }

    else if (!validator.isStrongPassword (password)) {
        throw new Error ("Password is not Strong...!");
    }
}

const validateEditProfileData = (req) => {
    const allowedFields = [ "firstName", "lastName", "emailId", "about", "photoUrl", "age", "gender", "skills" ];
    const isEditAllowed = Object.keys (req.body).every ((field) => allowedFields.includes(field));

    return isEditAllowed;
}

module.exports = { validateSignUpData, validateEditProfileData }