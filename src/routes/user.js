const express = require ("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");
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

userRouter.get ("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        // Pagination
        const page = parseInt (req.query.page) || 1;
        let limit = parseInt (req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        // Find all connection related to user
        const connectionRequests = await ConnectionRequest.find ({
            $or : [
                { fromUserId : loggedInUser._id },
                { toUserId : loggedInUser._id },
            ],
        }).select ("fromUserId toUserId");

        // Store in set to remove duplicates
        const hiddenUserFromFeed = new Set ();
        connectionRequests.forEach ( (request) => {
            hiddenUserFromFeed.add (request.fromUserId.toString());
            hiddenUserFromFeed.add (request.toUserId.toString());
        });

        // Find all user except the hidden ones
        const users = await User.find ({
            $and : [
                {_id : {$nin : Array.from (hiddenUserFromFeed)}},
                {_id : {$ne : loggedInUser._id} },
            ]
        })
        .select (USER_SAFE_DATA)
        .skip (skip)
        .limit (limit)

        res.json ({
            message : "Feed Fetched Successfully...!",
            data : users,
        })
    }
    catch (err) {
        res.status(400).send ("Error : " + err.message);
    }
})

module.exports = userRouter;