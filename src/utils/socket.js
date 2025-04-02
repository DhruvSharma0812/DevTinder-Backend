const socket = require ("socket.io");
const crypto = require ("crypto");

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
    

    io.on ("connection", (socket) => {
        // Handle Events

        socket.on ("joinChat", ({firstName, userId, targetUserId}) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            console.log (firstName + " Joined Room : " + roomId);
            socket.join (roomId);
        });

        socket.on ("sendMessage", 
            ({firstName, lastName, userId, targetUserId, text}) => {
                const roomId = getSecretRoomId (userId, targetUserId);
                console.log (firstName + " " + lastName + " Sends " + text);
                io.to (roomId).emit ("messageRecieved", {firstName, lastName, text});
            }
        );

        socket.on ("disconnect", () => {

        });
    })
}

module.exports = initializedSocket