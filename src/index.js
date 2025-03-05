const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const {collection,Player } = require('./config')
const router = express.Router();

require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

//const { name,email,password } = require('ejs')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('view engine','ejs','js')

app.use(express.static('public'))
const otpStorage = new Map();// Store {email: otp}

// Replace the previous OTP route with this
const { sendOTPEmail } = require('./mailer'); // Import mailer.js
const { log } = require('console');
app.post('/OTP', async (req, res) => {            
    console.log("Signup & OTP Sending Process Started");

    const { email, name, institute, occupation } = req.body;

    const existingUser = await collection.findOne({ email ,password: { $exists: true, $ne: null }});
    if (existingUser) return res.send("User already exists");

    else{
       
         // Send OTP via mail
    const mailResponse = await sendOTPEmail(email);
    const otp = mailResponse.otp;
    console.log("Mail response: ",mailResponse);

    if (mailResponse.success) {
        const data = {
            institute:req.body.institute,
            occupation:req.body.Role,
            name: req.body.name,
            email: req.body.email,
            OTP: otp,
            //password: req.body.password
            //shouldn't i add email and otp to the otpStorage map?
        }


        otpStorage.set(email,otp);        
        console.log("email: ",email,"OTP: ",otp)
        
           // const saltRounds = 10
            //const hashedPassword = await bcrypt.hash(data.password,saltRounds)
            //data.password = hashedPassword
            const userdata = await collection.insertMany(data)
           // console.log(userdata)
            console.log("Written on db")
            //res.render('OTP')

        res.render("OTP", { email });
        // await collection.updateOne({ email }, { otp, verified: false }); 
    } else {
        res.status(500).json({ message: "Failed to send OTP" });
    }

    }

    
});

//const User = require('./models/User'); // Import your User model

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    console.log("Email and OTP: ",req.body)

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const storedOtp = otpStorage.get(email);
    console.log("Stored email and OTP in OTPStorage is:",email, storedOtp);

    if (storedOtp === otp) {
        //otpStorage.clear(); 
        // // Clear OTP after verification

        // **Update the user's verified field**
        try {
            const updatedUser = await collection.findOneAndUpdate(
                { email: email },        // Find user by email
                { $set: { verified: true } }, // Update 'verified' field to true
                { new: true }            // Return the updated document
            );

            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            return res.json({ success: true, message: "OTP verified successfully", user: updatedUser });

        } catch (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({ success: false, message: "Database update failed" });
        }
    }

    return res.status(401).json({ success: false, message: "Invalid OTP" });
});


// 📌 Route to resend OTP
app.post("/resend-otp", async (req, res) => {
    const { email } = req.body; // Extract email properly
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const mailResponse = await sendOTPEmail(email);

    otpStorage.set(email,mailResponse.otp);  
    if (mailResponse.success) {
        return res.json({ success: true, message: "New OTP sent" });
    } else {
        return res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }
});
app.get("/setPassword", (req, res) => {
    res.render("setPassword"); // Render setPassword.ejs
});

app.post("/setpassword", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Missing fields!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password for security
        await collection.updateOne({ email }, { $set: { password: hashedPassword, verified: true } });

        res.json({ success: true, message: "Password set successfully!" });
    } catch (error) {
        console.error("Error setting password:", error);
        res.json({ success: false, message: "Server error!" });
    }
});



app.get('/',(req,res)=>{
    res.render('welcome')
})

app.get('/community',(req,res)=>{
    console.log('community route accessed')
    res.render('community')
})

app.get('/ocean',(req,res)=>{
    console.log('ocean route accessed')
    res.render('ocean')
})

app.get('/shark_sprint',(req,res)=>{
    res.render('shark_sprint')
})


 app.get('/signup',(req,res)=>{
     console.log('signup route accessed')
    res.render('signup')
})

// app.post('/OTP',(req,res)=>{
//     console.log("OTP verification");
//     res.render('OTP');
// })


// app.post('/signupVerification',async(req,res)=>{
//     const data = {
//         institute:req.body.institute,
//         occupation:req.body.occupation,
//         name: req.body.name,
//         email: req.body.email,
//         //password: req.body.password
//     }
//     const existingUser = await collection.findOne({email:data.email})
//     if(existingUser){
//         res.end('userExists')
//     }

//     else{
//        // const saltRounds = 10
//         //const hashedPassword = await bcrypt.hash(data.password,saltRounds)
//         //data.password = hashedPassword
//         const userdata = await collection.insertMany(data)
//         console.log(userdata)
//         console.log("Written on db")
//         res.render('OTP')
//     }
    
// })

app.get('/login',(req,res)=>{
    console.log('login route access')
    res.render('login')
})
app.post('/newsfeed',async(req,res)=>{
    try{
        const check = await collection.findOne({email:req.body.email})
        if(!check){
            res.send("user not found")
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password,check.password)
        if(isPasswordMatch){
           // res.render('community')
           res.render('newsfeed')
        }
        else{
            req.send('wrong password')
        }
    }
    catch{
        res.end("Wrong info")
    }
})

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.post("/save-score", async (req, res) => {
    const { username, score } = req.body;

    try {
        let player = await Player.findOne({ username });

        if (player) {
            if (score > player.highScore) {
                player.highScore = score;
                await player.save();
            }
        } else {
            player = new Player({ username, highScore: score });
            await player.save();
        }

        res.json({ message: "Score saved successfully!", player });
    } catch (err) {
        console.error("Error saving score:", err);
        res.status(500).json({ message: "Failed to save score", error: err });
    }
});


// Fetch Leaderboard
app.get("/leaderboard", async (req, res) => {
    try {
        const leaderboard = await Player.find().sort({ highScore: -1 }).limit(5);
        res.json(leaderboard);
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        res.status(500).json({ message: "Failed to fetch leaderboard", error: err });
    }
});

app.get('/profile', async (req, res) => {
    // try {
        // const user = req.session.user; // Assume user data is stored in session
        // if (!user) {
            // return res.redirect('/login'); // Redirect if not logged in
        // }
        
        res.render('profile'); // Render profile.ejs and pass user data
    // } catch (error) {
    //     console.error("Error loading profile:", error);
    //     res.status(500).send("Internal Server Error");
    // }
});





app.listen(5000,()=>{
    console.log("App running on port number 5000...")
})