const express = require('express');

const app = express();

// If we don't send anything it will go to infinite loop
// app.get ('/user', (req, res) => {
//     console.log ("Hellor from Route Handler...");
// })

// In console it show only hello from route handler 1 
// and send back response 1 as there is no next call
// app.get ('/user', (req, res) => {
//     // Route Handler 1
//     console.log ("Hellor from Route Handler 1...");
//     res.send ("Response 1...!!");
//     },
//     (req, res) => {
//         // Route Hanlder 2
//         console.log ("Hello from Route Hanlder 2");
//         res.send ("Response 2..!");
//     }
// )

// In console it shows hello from rh 1, rh2 both
// and send back Response 2 as we are not sending anything from route 1
// app.get ('/user', (req, res, next) => {
//     // Route Handler 1
//     console.log ("Hello from Route Handler 1...");
//     next();

//     },
//     (req, res) => {
//         // Route Hanlder 2
//         console.log ("Hello from Route Hanlder 2");
//         res.send ("Response 2..!");
//     }
// )

// On console it print hello from rh 1, rh2 both but after that we have error
// error because we are returning 2 times from same url
// and sendBack only response 1
// app.get ('/user', (req, res, next) => {
//     // Route Handler 1
//     console.log ("Hello from Route Handler 1...");
//     res.send("Response 1...!");
//     next();

//     },
//     (req, res) => {
//         // Route Hanlder 2
//         console.log ("Hello from Route Hanlder 2");
//         res.send ("Response 2..!");
//     }
// )

// On console it print hello from rh 1, rh2 both but after that we have error
// error because we are returning 2 times from same url
// and sendBack only response 2
// app.get ('/user', (req, res, next) => {
//     // Route Handler 1
//     console.log ("Hello from Route Handler 1...");
//     next();
//     res.send("Response 1...!");

//     },
//     (req, res) => {
//         // Route Hanlder 2
//         console.log ("Hello from Route Hanlder 2");
//         res.send ("Response 2..!");
//     }
// )

// You can return as many route handler as you want
app.get ('/user', 
    [(req, res, next) => {
        // Route Handler 1
        console.log ("Hello from Route Handler 1...");
        next();
        // res.send("Response 1...!");

    },
    (req, res, next) => {
        // Route Hanlder 2
        console.log ("Hello from Route Hanlder 2");
        // res.send ("Response 2..!");
        next();
    },
    (req, res, next) => {
        // Route Hanlder 2
        console.log ("Hello from Route Hanlder 3");
        // res.send ("Response 2..!");
        next();
    },
    (req, res, next) => {
        // Route Hanlder 2
        console.log ("Hello from Route Hanlder 4");
        // res.send ("Response 2..!");
        next();
    },
    (req, res, next) => {
        // Route Hanlder 2
        console.log ("Hello from Route Hanlder 5");
        res.send ("Response 2..!");
        next();
    },]
)

app.listen(7777, () => {
    // This function takes port number and callback function
    console.log ("Server is Running on port 3000....");
})