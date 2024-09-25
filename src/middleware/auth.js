const jwt = require ("jsonwebtoken");
const User = require ("../model/user");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error ("Token Not Valid");
        }

        const decodedMsg = await jwt.verify (token, "DhruvJaspreet");
        const { _id } = decodedMsg;

        const user = await User.findById ( _id );
        if (!user) {
            throw new Error ("User Not Found...!");
        }

        req.user = user;
        next();
    }

    catch (err) {
        res.status (400). send ("Error : " + err.message);
    }
}

module.exports = { userAuth }