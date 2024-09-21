const express = require('express');
const app = express();
const {adminAuth, userAuth} = require ('./middleware/auth.js')

app.use ("/admin", adminAuth)

app.get ('/user/data', userAuth, (req, res) => {
    console.log ("User data sent")
    res.send ("User Data sent");
})

app.get ('/user/login', (req, res) => {
    console.log ("User logg in");
    res.send ("Login")
})

app.get ("/admin/getData", (req, res) => {
    console.log ("All Data sent")
    res.send ("All Data sent")
})

app.get ("/admin/deleteUser", (req, res) => {
    console.log ("User Deleted")
    res.send ("User Deleted")
})


app.listen(7777, () => {
    // This function takes port number and callback function
    console.log ("Server is Running on port 3000....");
})