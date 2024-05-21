const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("Mongo URI is not defined in environment variables");
    process.exit(1);
}

const connectToMongo = () => {
    mongoose.connect(mongoURI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
};

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
    });
});

module.exports = connectToMongo;
