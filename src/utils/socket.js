const socket = require ("socket.io");
const crypto = require ("crypto");
const jwt = require ("jsonwebtoken");
const cookie = require ("cookie");

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
    .createHash ("sha256")
    .update ([userId, targetUserId] .sort() .join ("$"))
    .digest("hex");
}

const initializedSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    io.use ((socket, next) => {
        const cookies = socket.handshake.headers.cookie;

        if (!cookies) {
            return next (new Error ("Auth Error : No cookies found"));
        }

        const parsedCookie = cookie.parse (cookies);
        const token = parsedCookie.token;

        if (!token) {
            return next(new Error("Authentication error: No token found"));
        }

        try {
            const decoded = jwt.verify(token, "DhruvJaspreet");
            socket.user = decoded; // Store user details in socket object
            next();
        } catch (error) {
            return next(new Error("Authentication error: Invalid token"));
        }
    })
    

    io.on ("connection", (socket) => {
        // Handle Events

        socket.on ("joinChat", ({firstName, userId, targetUserId}) => {
            if (userId !== socket.user._id) {
                return socket.disconnect ();
            }

            const roomId = getSecretRoomId(userId, targetUserId);
            console.log (firstName + " Joined Room : " + roomId);
            socket.join (roomId);
        });

        socket.on ("sendMessage", 
            ({firstName, lastName, userId, targetUserId, text}) => {
                const roomId = getSecretRoomId (userId, targetUserId);

                if (userId !== socket.user._id) {
                    return socket.disconnect();
                }

                console.log (firstName + " " + lastName + " Sends " + text);
                io.to (roomId).emit ("messageRecieved", {firstName, lastName, text});
            }
        );

        socket.on ("disconnect", () => {

        });
    })
}

module.exports = initializedSocket