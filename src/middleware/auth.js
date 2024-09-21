const adminAuth = (req, res, next) => {
    console.log ("Admin Autherization is happening");
    const token = "abc";
    const isAdminAuth = token === 'abc';

    if (!isAdminAuth) {
        console.log ("Authorizatin failed Unauthorized access");
        res.status(401).send("Unautorized Access...!");
    }

    else {
        console.log ("Auth successs")
        next();
    }
}

const userAuth = (req, res, next) => {
    console.log ("User Auth is happening");
    const token = "abc";
    const isUserAuth = token === 'xyz';

    if (!isUserAuth) {
        res.status(401).send("Auth Error");
    }
    else {
        next();
    }
}

module.exports = {adminAuth, userAuth}