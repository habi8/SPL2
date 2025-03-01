const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const collection = require('./config')

require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

//const { name,email,password } = require('ejs')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('view engine','ejs')

app.use(express.static('public'))

// Replace the previous OTP route with this
const { sendOTPEmail } = require('./mailer'); // Import mailer.js

app.post('/OTP', async (req, res) => {

   
            
    console.log("Signup & OTP Sending Process Started");
    
    
    const { email, name, institute, occupation } = req.body;

    const existingUser = await collection.findOne({ email });
    if (existingUser) return res.send("User already exists");

    else{
        const data = {
            institute:req.body.institute,
            occupation:req.body.Role,
            name: req.body.name,
            email: req.body.email,
            //password: req.body.password
        }
        
           // const saltRounds = 10
            //const hashedPassword = await bcrypt.hash(data.password,saltRounds)
            //data.password = hashedPassword
            const userdata = await collection.insertMany(data)
            console.log(userdata)
            console.log("Written on db")
            //res.render('OTP')

         // Send OTP via mail
    const mailResponse = await sendOTPEmail(email);
    console.log(mailResponse);

    if (mailResponse.success) {
        res.render("OTP", { email });
    } else {
        res.status(500).json({ message: "Failed to send OTP" });
    }

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

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/users', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log("MongoDB connected"))
// .catch(err => console.log(err));

// User Schema
// const UserSchema = new mongoose.Schema({
//     email: String,
//     otp: String,
//     verified: Boolean
// });
// const User = mongoose.model('User', UserSchema);

// Nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASSWORD
//     }
// });

// // Generate OTP
// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// // Signup Route
// app.post('/signup', async (req, res) => {
//     console.log("OTP sent1")
//     const { email } = req.body;
//     const otp = generateOTP();
    
//     await mongoose.connection.findOneAndUpdate({ email }, { otp, verified: false }, { upsert: true });
    
//     const mailOptions = {
//         from: process.env.EMAIL,
//         to: email,
//         subject: 'Your OTP Code',
//         text: `Your OTP is: ${otp}`
//     };
//     res.render('OTP');
//     transporter.sendMail(mailOptions, (error) => {
//         if (error) return res.status(500).json({ message: 'Error sending OTP' });
//         res.json({ message: 'OTP sent successfully' });
//     });

//     console.log("OTP sent2")
// });

// // Verify OTP Route
// app.post('/verify', async (req, res) => {
//     const { email, otp } = req.body;
//     const user = await User.findOne({ email, otp });
    
//     if (!user) return res.status(400).json({ message: 'Invalid OTP' });
    
//     await User.updateOne({ email }, { verified: true });
//     res.json({ message: 'Signup Successful' });
// });

app.listen(7000,()=>{
    console.log("App running on port number 7000...")
})