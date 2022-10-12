if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const initializePossport = require("./passport-config.js")
const flash = require("express")
const session = require("express-session")
const bodyParser = require("body-parser");
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

initializePossport(
    passport,
    email => users.find(user=>user.email === email),
    id => users.find(user => user.id === id)
)

const users = []
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

//configuring the login post functionality
app.post("/login", passport.authenticate("local", {
    successRedirect: "/student",
    failureRedirect: "/login",
    failureFlash: true
}))

// configuring the register post functionality
app.post("/register", async (req, res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        console.log(users)
        res.redirect("/login")
    }catch{
        console.log(e);
        res.redirect("./register")

    }
})

// Routes

app.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname+"/login.html"));
})
app.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname+"/register.html"));
})

app.get('/student', (req, res)=>{
    res.sendFile(path.join(__dirname+"/Student files/student.html"));
})

app.listen(5000, (req, res) =>{
 console.log("5000 port is running...")
})