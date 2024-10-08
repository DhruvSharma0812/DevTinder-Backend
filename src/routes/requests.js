const express = require ('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequest = require('../model/connectionRequest');
const User = require('../model/user');

const requestRouter = express.Router();

requestRouter.post ('/request/send/:status/:touserId', userAuth, async (req, res) => {
    try {
        // Send a connection request { from -> to }
        const fromUserId = req.user._id;
        const toUserId = req.params.touserId;
        const status = req.params.status;

        const allowedStatus = [ "ignored", "interested"];
        if (!allowedStatus.includes (status)) {
            return res.status (400). send ("Invalid Status Type : " + status);
        }

        const toUser = await User.findById (toUserId);
        if (!toUser) {
            return res.status(400).send ("User Does Not Exist...!");
        }

        const existingRequest = await ConnectionRequest.findOne ({
            $or : [
                { fromUserId, toUserId },
                { fromUserId : toUserId, toUserId : fromUserId},
            ],
        });

        if (existingRequest) {
            return res.status(400).send ("Connection Request Aleready Exist...!");
        }
        
        const connectionRequest = new ConnectionRequest ({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save ();
        res.json ({
            message : "Friend Request Send Successfyly from " + req.user.firstName,
            data, 
        })
    }
    catch (err) {
        res.status(400).send ("Error : " + err.message);
    }
})

requestRouter.post ('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInUser = req.user

        // validate the status
        const allowedStatus = [ "accepted", "rejected" ];
        if (!allowedStatus.includes (status)) {
            return res.status (400). json ( {
                message : `${status} status is now allowed...!`,
            })  
        }

        // D -> J
        // toUser is the loggedInUser

        const connectionRequest = await ConnectionRequest.findOne ({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested",
        })

        console.log (connectionRequest)

        if (!connectionRequest) {
            return res.status(400).json ({
                message : "Request Not Found...!"
            })
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json ({
            message : "Connectino Request : " + status,
            data,
        })
    }
    catch (err) {
        res.status(400).send ("Error : " + err.message);
    }
})

module.exports = requestRouter;