const express = require('express');

const app = express();

app.get(/.*fly$/, (req, res) => {
    res.send("abc working fine");
});

app.get ('/user', (req, res) => {
    console.log (req.query);
    res.send (req.query);
})

app.get('/user/:userid', (req, res) => {
    console.log(req.params); // Log route parameters
    console.log (req.query)
    let a = req.params.userid; // Access userid from route parameters
    res.send({ fname: "Dhruv", lname: "Sharma", userid: a });
});


app.use ('/test', (req, res) => {
    res.send ("Hello From test");
})

// app.use ('/', (req, res) => {
//     res.send ("Hello From Dhruv");
// })

app.listen(7777, () => {
    // This function takes port number and callback function
    console.log ("Server is Running on port 3000....");
})