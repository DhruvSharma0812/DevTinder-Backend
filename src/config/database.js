const mongoose = require ('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect (
            "mongodb+srv://sharmdhruv1234:Dsapk0812@devtinder.ewdek.mongodb.net/"
        )
        console.log ("DB Connected");
    }

    catch (err) {
        console.error("Database connection error:", err.message);
        throw err;
    }
}

module.exports = connectDB;

