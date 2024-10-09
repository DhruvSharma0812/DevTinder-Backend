const express = require ("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");
const userRouter = express.Router ();

const USER_SAFE_DATA = "firstName lastName age gender photoUrl about skills"

userRouter.get ("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find ({
            toUserId : loggedInUser._id,
            status : "interested",
        }).populate ("fromUserId", USER_SAFE_DATA);

        if (!connectionRequests) {
            return res.status(400).json ({
                message : "No Data To Show...!",
            })
        }

        res.json ({
            message : "Data Fetched Successfully...!",
            data : connectionRequests,
        })
    }

    catch (err) {
        res.status(400).send ("Error : " + err.message);
    }
})

userRouter.get ("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find ({
            $or : [
                { toUserId : loggedInUser._id, status : "accepted"},
                { fromUserId : loggedInUser._id, status : "accepted"  },
            ],
        }).populate ("fromUserId", USER_SAFE_DATA)
        .populate ("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map ((row) => {
            if (row.fromUserId.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }

            return row.fromUserId;
        });

        console.log (connectionRequests)

        res.json ({
            message : "Data Fetched Successfully...!",
            data,
        })
    }

    catch (err) {
        res.status(400).send ("Error : " + err.message);
    }
})



module.exports = userRouter;