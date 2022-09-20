const mongoose = require('mongoose');
require('dotenv').config();
async function dbConnect() {
    const dbConnect = mongoose.connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connected to MongoDB !");
    })
        .catch((error) => {
            console.log("Unable to connect to MongoDB !");
            console.error(error);
        });
}

module.exports = dbConnect;
