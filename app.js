const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/HospitalManagementDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const doctorSchema = new mongoose.Schema({
    name: String,
    age: Number,
    specialization: String
});
const specializationSchema = new mongoose.Schema({
    specialization: String
});
const appointmentSchema = new mongoose.Schema({
    name: String,
    address: String,
    number: Number,
    gender: String,
    age: Number,
    specialist: String
});
const inventorySchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number
});

const InventoryItem = mongoose.model("InventoryItem", inventorySchema);
const Doctor = mongoose.model("Doctor", doctorSchema);
const User = new mongoose.model("User", userSchema);
const Specialization = new mongoose.model("Specialization", specializationSchema);
const Appointment = new mongoose.model("Appointment", appointmentSchema);


app.get("/", function(req,res){
    res.render("landing");
})


app.get("/inventory", function(req, res) {
    
    InventoryItem.find({}).then(function(items) {
        res.render("inventory", { items: items });
    });
});

app.get("/addDoctor", function(req, res) {
    res.render("addDoctor");
});
app.post("/addDoctor", function(req, res) {
    const newDoctor = new Doctor({
        name: req.body.name,
        age: req.body.age,
        specialization: req.body.specialization
    });

    newDoctor.save();
    res.render('home');
});
app.get("/doctors", function(req, res) {
    Doctor.find({}).then(function(doctors) {
        res.render("doctors", { doctors: doctors });
    });
});


app.get("/addInventory", function(req,res){
    res.render("addInventory");
})
app.post("/addInventory", function(req,res){
    const newItem = new InventoryItem({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity
    });

    newItem.save();
    res.render('home');
})

app.get("/appointment", function(req,res){
    Specialization.find({}).then(function(specialization){
            res.render("appointment", { specialization: specialization });
        } 
    )
})
app.post("/appointment", function(req,res){
    const name = req.body.name;
    const address = req.body.address;
    const Phnumber = req.body.number;
    const gender = req.body.gender;
    const age = req.body.age;
    const temp = req.body.doctor;
    Specialization.findById(temp).then(function(doctor){
        const specialist = doctor.specialization;
        const newAppointment = new Appointment({
            name: name,
            address: address,
            number: Phnumber,
            gender: gender,
            age: age,
            specialist: specialist
        });
        newAppointment.save(); 
    });
    res.render("home")
})



app.get("/login", function(req,res){
    res.render("login");
})
app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then(function(foundUser){
        try{
           if( foundUser.password === password ){
                res.render("home");
            }
            else{
                res.send("Your Login Id or password is Incorrect");
            } 
        }
        catch(err){
            res.render("Your Login Id or password is Incorrect");
        } 
    })
})

app.get("/home", function(req,res){
    res.render("home");
})

app.get("/about", function(req,res){
    res.render("about");
})

app.get("/contact", function(req,res){
    res.render("contact");
})

app.get("/signup", function(req,res){
    res.render("signup"); 
})
app.post("/signup", function(req,res){ 
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(function(err){
        if(err){
            console.log(err);
        }
        res.render("login");
    })
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
});