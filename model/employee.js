

//User model should have Full name, Email, and Contact No and profile image.

const mongoose = require('mongoose');
const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter the full name"]
    },
    email: {
        type: String,
        require: [true, "Please enter the Email name"]
    },
    mobile: {
        type: String,
        require: [true, "Please enter the ContactNo"]
    },
    image: {
        type: String,
        require: [true, "Please enter the profile image"]
    }
},
    {
        timestamps: true
    }
);

const employeeModel = mongoose.model("Employee", employeeSchema);

module.exports = employeeModel;


