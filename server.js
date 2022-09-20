
const express = require('express');
const multiparty = require('multiparty');
var cors = require("cors");
const os = require('os');
const app = express();
const dotenv = require('dotenv').config();
const logger = require('morgan');
const port = process.env.PORT || 5000;

const IMAGE_UPLOAD_DIR = "./public/images";
const IMAGE_BASE_URL = "http://localhost:4000/images/";
const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.static("public"));
// /const User = require('./model/userModel')
const Employee = require('./model/employee')
const fs = require('fs');
const { errorHandler } = require('./errorHandler');
const { Parser } = require('json2csv');
// require database connection 
const dbConnect = require("./DB/config");
const { dirname } = require('path');

// execute database connection 
dbConnect();
console.log('platform : ' + os.platform);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


app.post("/add-employee-form", async (req, res) => {

    const form = new multiparty.Form({ uploadDir: IMAGE_UPLOAD_DIR });

    form.parse(req, async function (err, fields, files) {
        if (err) return res.send({ error: err.message });

        console.log(`fi elds = ${JSON.stringify(fields, null, 2)}`);
        console.log(`files = ${JSON.stringify(files, null, 2)}`)

        const imagePath = files.image[0].path;
        const imageFilename = imagePath.slice(imagePath.lastIndexOf("\\") + 1);
        const imageURL = IMAGE_BASE_URL + imageFilename;
        console.log(imageURL);

        const employeeData = new Employee({
            name: fields.name[0],
            email: fields.email[0],
            mobile: fields.mobile[0],
            image: imageURL
        })

        try {
            const employee = await employeeData.save();
            res.send(employee);
        } catch (err) {

        }

    });

});


// Fetch All user
app.get('/Employeelist', (req, res) => {
    Employee.find({}, function (err, allDetails) {
        if (err) {
            console.log(err);
        } else {
            res.json(allDetails);
        }
    })

});

//Update User
app.put('/Employee', (req, res) => {
    //res.send({message: 'hello'});
    Employee.findByIdAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (err) throw err;
        res.send({ message: "1 document updated" });
    });
})


// pdf Download 

app.get('/get-csv', (req, res) => {
    Employee.find({}, function (err, allDetails) {
        if (err) {
            console.log(err);
        } else {
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(allDetails);
            fs.writeFile("employee.csv", csv, function (err) {
                if (err) {
                    throw err;
                }
                console.log("file save");
            })
            res.attachment("employee.csv");
            res.status(200).send(csv);
        }
    })

});



// for custom Error HAndling
app.use(errorHandler);
app.listen(port, () => {
    console.log(`server is started on ${port}`);
})