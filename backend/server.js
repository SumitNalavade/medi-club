//for security purposes
require('dotenv').config();

//GridFS stuff
const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');

//general citations for this page: https://www.youtube.com/watch?v=w3vs4a03y3I and https://www.youtube.com/watch?v=bhiEJW5poHU
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//used to generate token
const { v4: uuidv4 } = require('uuid');

//nodemailer stuff
const nodemailer = require('nodemailer');

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use any email service provider you prefer
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


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
        createGridFSBuckets();
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
let globUsername = "";
let globName = "";
let globId = "";


//inserting into mongoDb section of code(citation for inserting: https://www.tutorialkart.com/nodejs/mongoose/insert-document-to-mongodb/, citation for retrieving: https://mongoosejs.com/docs/api/model.html#Model.findOne())
const myDB = mongoose.connection;

//mongoDB insertion stuff (schemas and functions):
const userSchema = mongoose.Schema({
    username: String,
    name: String,
    password: String,
    isCoach: Boolean,
    verified: { type: Boolean, default: false },
    verificationToken: String
});

const postSchema = mongoose.Schema({
    authorUsername: String,
    authorName: String,
    postName: String,
    postDate: String,
    postTime: String,
    postDescription: String,
    postSlots: Number,
    latitide: Number,
    longitude: Number,
    signedUp: Array,
    address: String
});

const messageSchema = mongoose.Schema({
    sender: String,
    eventName: String,
    date: String,
    content: String,
    recipient: String
});


let User = mongoose.model('users', userSchema);



//insert new user into mongoDB
function newUser(newUsername, newName, newPass, newisCoach) {
    //don't allow blank usernames/passwords
    if (!newUsername || !newPass) {
        return false;
    }

    const verificationToken = uuidv4(); // Generate a verification token

    const newUser = new User({
        username: newUsername,
        name: newName,
        password: newPass,
    });

    newUser.save();

}


app.post("/login", jsonParser, (req, res) => {

    //retrieve password from mongoDB
    User.findOne({ username: req.body.username }).exec().then(function (data) {
        //add a null check in case username does not exists
        if (data == null) {
            res.json({ "success": false, "message": "username does not exist" });
            //NEED THIS RETURN STATEMENT VERY IMPORTANT
            return
        }
        //now check password
        //citation for comparing to hash start: https://heynode.com/blog/2020-04/salt-and-hash-passwords-bcrypt/
        bcrypt.compare(req.body.password, data.password, function (err, result) {
            //citation for comparing to hash end
            if (result) {
                globUsername = req.body.username;
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