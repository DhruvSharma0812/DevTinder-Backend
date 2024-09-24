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

module.exports = { validateSignUpData }