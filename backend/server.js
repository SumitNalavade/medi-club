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
app.use(bodyParser.json());


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

const InventoryItemTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    schedule: { type: String, required: true },
    time: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true, default: 'https://ychef.files.bbci.co.uk/1280x720/p00pc0vt.jpg' },
});

const InventorySchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    drugs: [InventoryItemTypeSchema],
});

let InventoryItemType = mongoose.model('InventoryItemType', InventoryItemTypeSchema);

let Inventory = mongoose.model('Inventory', InventorySchema);

let User = mongoose.model('users', userSchema);

//insert new user into mongoDB
function newUser(newEmail, newName, newPass) {
    //don't allow fields
    if (!newEmail || !newPass || !newName) {
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
    User.findOne({ email: req.body.email, name: req.body.name }).exec().then(function (data) {
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

// Route to add an inventory item
app.post("/add-inventory-item", async (req, res) => {
    console.log(req.body);
    let name = req.body.name;
    let schedule = req.body.schedule;
    let time = req.body.time;
    let quantity = req.body.quantity;
    let image = req.body.image;
    let email = globEmail;
    try {
        let inventory = await Inventory.findOne({ email });

        const newItem = new InventoryItemType({
            name,
            schedule,
            time,
            quantity,
            image: image || 'https://ychef.files.bbci.co.uk/1280x720/p00pc0vt.jpg', // Use provided image or default
        });

        if (inventory) {
            // Add to existing inventory
            inventory.drugs.push(newItem);
        } else {
            // Create new inventory
            inventory = new Inventory({
                email,
                drugs: [newItem],
            });
        }

        await inventory.save();
        res.status(200).json({ message: 'Inventory item added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to get all inventory items for the logged-in user
app.get('/get-inventory-items', async (req, res) => {
    let email = globEmail;
    try {
        let inventory = await Inventory.findOne({ email });
        if (inventory) {
            res.status(200).json(inventory.drugs);
        } else {
            res.status(404).json({ error: 'No inventory found for this user' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/logout", jsonParser, (req, res) => {
    globUsername = "";
})