const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const collection = require('./config')
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
const otpStorage = new Map(); // Store {email: otp}

// Replace the previous OTP route with this
const { sendOTPEmail } = require('./mailer'); // Import mailer.js
app.post('/OTP', async (req, res) => {            
    console.log("Signup & OTP Sending Process Started");

    const { email, name, institute, occupation } = req.body;

    const existingUser = await collection.findOne({ email });
    if (existingUser) return res.send("User already exists");

    else{
       
         // Send OTP via mail
    const mailResponse = await sendOTPEmail(email);
    console.log(mailResponse);

    if (mailResponse.success) {
        const data = {
            institute:req.body.institute,
            occupation:req.body.Role,
            name: req.body.name,
            email: req.body.email,
           // OTP: "1234",
            //password: req.body.password
        }

        
        
           // const saltRounds = 10
            //const hashedPassword = await bcrypt.hash(data.password,saltRounds)
            //data.password = hashedPassword
            const userdata = await collection.insertMany(data)
            console.log(userdata)
            console.log("Written on db")
            //res.render('OTP')

        res.render("OTP", { email });
        // await collection.updateOne({ email }, { otp, verified: false }); 
    } else {
        res.status(500).json({ message: "Failed to send OTP" });
    }

    }

    
});

app.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const storedOtp = otpStorage.get(email);
    console.log(storedOtp)
    if (storedOtp === otp) {
        otpStorage.delete(email); // Clear OTP after verification
        return res.json({ success: true, message: "OTP verified successfully" });
    }

    return res.status(401).json({ success: false, message: "Invalid OTP" });
});

// 📌 Route to resend OTP
app.post("/resend-otp", async (req, res) => {
    const { email } = req.body; // Extract email properly
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const mailResponse = await sendOTPEmail(email);
    if (mailResponse.success) {
        return res.json({ success: true, message: "New OTP sent" });
    } else {
        return res.status(500).json({ success: false, message: "Failed to resend OTP" });
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
app.post('/login',async(req,res)=>{
    try{
        const check = await collection.findOne({email:req.body.email})
        if(!check){
            res.send("user not found")
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password,check.password)
        if(isPasswordMatch){
           // res.render('community')
           res.send('login successful')
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


app.listen(5000,()=>{
    console.log("App running on port number 5000...")
})