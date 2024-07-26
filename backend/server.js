//for security purposes
require('dotenv').config();

//GridFS stuff
const { MongoClient } = require('mongodb');
const fs = require('fs');

//general citations for this page: https://www.youtube.com/watch?v=w3vs4a03y3I and https://www.youtube.com/watch?v=bhiEJW5poHU
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//citation start: https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/
const bcrypt = require('bcryptjs');
const e = require('express');
const saltRounds = 10;
const port = 3456;
//citation end

//connect to MongoDB cluster here
const uri = process.env.MONGODOB_URI;

const app = express();


//citation start for parsing json: https://stackoverflow.com/questions/9177049/express-js-req-body-undefined
const jsonParser = bodyParser.json({ 'limit': '50mb' })
const urlencodedParser = bodyParser.urlencoded({ extended: false })
//citation end

async function connect() {
    try {
        await (mongoose.connect(uri));
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect();

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
app.use(cors());


//global variable to be used
let globEmail = "";
let globName = "";
let globId = "";


//inserting into mongoDb section of code(citation for inserting: https://www.tutorialkart.com/nodejs/mongoose/insert-document-to-mongodb/, citation for retrieving: https://mongoosejs.com/docs/api/model.html#Model.findOne())
const myDB = mongoose.connection;

//mongoDB insertion stuff (schemas and functions):
const userSchema = mongoose.Schema({
    email: String,
    name: String,
    password: String
});

const drugSchema = mongoose.Schema({
    drugName: String
});

let User = mongoose.model('users', userSchema);

//insert new user into mongoDB
function newUser(newEmail, newName, newPass, newisCoach) {
    //don't allow fields
    if (!newEmail|| !newPass || !newName)  {
        return false;
    }

    const newUser = new User({
        email: newEmail,
        name: newName,
        password: newPass,
    });

    newUser.save();

}

//sign up a new user
app.post("/signUp", jsonParser, (req, res) => {
    console.log("create called")
    //retrieve password from mongoDB
    User.findOne({ email: req.body.email, name: req.body.name}).exec().then(function (data) {
        //check that email already exists for specific type of account
        if (data != null) {
            res.json({ "success": false, "message": "email already has account" });
        }
        else {
            let password = req.body.password;
            //hash citation start: https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/
            bcrypt.hash(password, saltRounds, function (err, hash) {
                //hash citation end
                if (newUser(req.body.email, req.body.name, hash) == true) {
                    res.json({
                        "success": true, "message": "You've Created An Account!"
                    });
                }
                else {
                    res.json({
                        "success": false, "message": "You couldn't create an Account, Make Sure All Fields are Filled In!"
                    });
                }
            });
        }
    });

})


app.post("/login", jsonParser, (req, res) => {

    //retrieve password from mongoDB
    User.findOne({ email: req.body.email }).exec().then(function (data) {
        //add a null check in case email does not exists
        if (data == null) {
            res.json({ "success": false, "message": "email does not exist" });
            //NEED THIS RETURN STATEMENT VERY IMPORTANT
            return
        }
        //now check password
        //citation for comparing to hash start: https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/
        bcrypt.compare(req.body.password, data.password, function (err, result) {
            //citation for comparing to hash end
            if (result) {
                globEmail = req.body.email;
                globName = data.name;
                globId = data._id;
                res.json({ "success": true, "message": "You were able to login!" });
            }
            else {
                res.json({ "success": false, "message": "You were unable to login, check password!" });
            }
        })
    });
})


app.post("/logout", jsonParser, (req, res) => {
    globUsername = "";
})