const express = require('express');

const app = express();

app.use ('/', (req, res) => {
    res.send ("Hello From Dhruv");
})

app.listen(3000, () => {
    // This function takes port number and callback function
    console.log ("Server is Running on port 3000....");
})