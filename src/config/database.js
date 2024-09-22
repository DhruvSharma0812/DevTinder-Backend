const mongoose = require ('mongoose');

const connectDB = async () => {
    await mongoose.connect (
        "mongodb+srv://sharmdhruv1234:Dsapk0812@devtinder.ewdek.mongodb.net/DevTinder"
    )
}

module.exports = connectDB;