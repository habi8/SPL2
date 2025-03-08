const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const {collection,Player,posts,notifications} = require('./config')
const router = express.Router();
const session = require("express-session");
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v4: uuidv4 } = require('uuid');
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs','js')
app.use(cors());
app.use(express.static('public'))
const otpStorage = new Map();// Store {email: otp}
const { sendOTPEmail } = require('./mailer'); // Import mailer.js
const { log } = require('console');
const uploadRoutes = require('./uploadDP')

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use secure cookies if over HTTPS
}));



app.post('/OTP', async (req, res) => {            
    console.log("Signup & OTP Sending Process Started");

    const { email, name } = req.body; 
    req.session.email = email;  
    req.session.username = name;

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
        }


        otpStorage.set(email,otp);        
        console.log("email: ",email,"OTP: ",otp)
            const userdata = await collection.insertMany(data)
            console.log("Written on db")
        res.render("OTP", { email });
    } else {
        res.status(500).json({ message: "Failed to send OTP" });
    }
    }

    
});


app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    console.log("Email and OTP: ",req.body)

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const storedOtp = otpStorage.get(email);
    console.log("Stored email and OTP in OTPStorage is:",email, storedOtp);

    if (storedOtp === otp) {
    
        try {
            const updatedUser = await collection.findOneAndUpdate(
                { email: email },        
                { $set: { verified: true } }, 
                { new: true }            
            );
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            req.session.destroy()
            return res.json({ success: true, message: "OTP verified successfully", user: updatedUser })
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


app.get('/login',(req,res)=>{
    console.log('login route access')
    res.render('login')
})

let name='';
app.post('/newsfeed', async (req, res) => {
    req.session.email = req.body.email;
    let email = req.session.email;
    let user = await collection.findOne({ email : email })
    console.log(user)
    name = user.name;
    req.session.name = name;
    try {
        // Check if the session email exists
        console.log("Session email:", email);
        if (!req.session.email) {
            return res.send("Session email is missing.");
        }

        // Look for user in the database
        const check = await collection.findOne({ email: email });
        
        if (!check) {
            return res.send("User not found");
        }

        // Compare password with the hashed password in the database
        const profilePic = check.profilePic || '/default-profile.png'
        const userName = check.userName;
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            const users = await collection.find({ email: { $ne: req.session.email } }).select('userName profilePic'); // Only select the fields you need

            return res.render('newsfeed', {
                userName: user.userName,
                profilePic: user.profilePic || '/posts/user.png',
                users: users 
            });
        } else {
            return res.send('Wrong password');
        }
    } catch (error) {
        console.error(error);
        res.send("Wrong info");
    }
});

app.get('/newsfeed', async (req, res) => {
    if (!req.session.email) {
        return res.redirect('/login'); 
    }
    const user = await collection.findOne({ email: req.session.email });
    const users = await collection.find({ email: { $ne: req.session.email } }).select('userName profilePic');

    const profilePic = user.profilePic;
    const userName = user.userName;

    // Get the usernames to whom the current user has sent a friend request
    const friendRequestsSent = await collection.find(
        { friendRequests: user.userName },
        { userName: 1, _id: 0 }
    );

    const sentRequestUsernames = friendRequestsSent.map(u => u.userName); // Extract usernames

    res.render('newsfeed', {
        userName: userName,
        profilePic: profilePic || '/posts/user.png',
        users: users ,
        friendRequestsSent: sentRequestUsernames
    });
});

app.get('/newsfeedPage', async (req, res) => {
    if (!req.session.email) {
        return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    try {
        const user = await collection.findOne({ email: req.session.email });

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.json({
            userName: user.userName,
            profilePic: user.profilePic || '/default-profile.png'
        });
    } catch (error) {
        console.error("Error fetching newsfeed data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});





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
    if (!req.session.email) {
        return res.redirect('/login'); 
    }

    try {
        
        const user = await collection.findOne({ email: req.session.email });

        if (user) {
            console.log("Username: ",user.userName)
            console.log("Profile pic URL: ",user.profilePic)
            res.render('profile', { name: user.name ,userName: user.userName,bio: user.bio, profilePic: user.profilePic || '/default-profile.png'});
           
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        res.status(500).send('Error retrieving user');
    }
});

app.post('/checkUsername', async (req, res) => {
    const { username } = req.body;

    try {
        const exists = await checkUsernameExists(username);
        res.json({ isAvailable: !exists });
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).send('Internal server error');
    }
});


cloudinary.config({ 
    cloud_name: 'dipgpjbtc', 
    api_key: '375663322893436', 
    api_secret: 'KsbtwFT67NiJc7EFZtaVfg5FmEo'
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_pictures', 
        format: async (req, file) => 'jpg', 
        public_id: (req, file) => req.session.email.replace(/[@.]/g, "_"), 
    }
});
const upload = multer({ storage: storage });

const storage2 = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload2 = multer({ storage2});



app.post('/updateProfilePic', upload.single('profilePic'), async (req, res) => {
    
    const email = req.session.email;
    const profilePicUrl = req.file.path; // Cloudinary URL
    
    try {
        
        if (!email) {
            return res.status(400).json({ error: 'No user email found in session' });
        }

        
        const user = await collection.updateOne(
            { email },
            { $set: {profilePic: profilePicUrl} }, 
            
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ url: profilePicUrl });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Error updating profile picture' });
    }
});




app.post('/updateProfile', async (req, res) => {
    const { username, name, bio, profilePic } = req.body;
    const email = req.session.email; 

    if (!email) {
        return res.status(400).json({ error: 'User email not found in session' });
    }

    try {
         await collection.updateOne({ email }, { userName: username, name: name, bio: bio, profilePic: profilePic });
        console.log(`Updated profile for ${email}:`, { username, name, bio, profilePic });
        
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});


app.post("/uploadPost", upload.single("photo"), async (req, res) => {
    try {
        const { userName, profilePic, statusText } = req.body;
        const email = req.session.email;
        console.log("Email in /uploadPost: ",email);
        
        const newPost = new posts({
            postID: uuidv4(),
            userName,
            email,
            profilePic,
            statusText,
            photo: "", 
        });

       
        const savedPost = await newPost.save();

        
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "posts", 
                public_id: savedPost.postID.toString(),
                overwrite: true, 
            });

            savedPost.photo = result.secure_url;
            const updatedPost = await savedPost.save(); 
        }

       
        res.json({
            success: true,
            message: "Post uploaded successfully!",
            post: savedPost, 
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});

app.get('/getAllPosts', async (req, res) => {
    try {
        const Allposts = await posts.find().sort({ createdAt: -1 }); 
        res.json({ success: true, Allposts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching posts" });
    }
});

app.get('/getYourPosts', async (req, res) => {
    try {
        const  email  = req.session.email; // Get email from session

        let query = {};
        if (email) {
            query.email = email; // Filter posts by email if provided
        }

        const Allposts = await posts.find(query).sort({ createdAt: -1 }); // Get filtered posts
        res.json({ success: true, Allposts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching posts" });
    }
});




app.post('/addFriend', async (req, res) => {
    const { fromUserName,profilePic,toUserName } = req.body;  // The user to send a friend request to
    //const currentEmail = req.session.email;  // Current user's email from the session

    try {
        // Fetch the current user's userName using their email from the session
        // const currentUser = await collection.findOne({ email: currentEmail });

        // if (!currentUser) {
        //     return res.json({ success: false, message: 'Current user not found' });
        // }

        // const fromUserName = currentUser.userName;  // Get the current user's userName

        // Fetch the recipient by their userName
        const recipient = await collection.findOne({ userName: toUserName });
        const sender = await posts.findOne({ userName: fromUserName })

        if (!recipient || !sender) {
            return res.json({ success: false, message: 'Recipient or sender not found' });
        }
        const fromUser = await collection.findOne({ userName: fromUserName });
        const toUser = await collection.findOne({ userName: toUserName });

        if (!fromUser || !toUser) {
            return res.json({ success: false, message: "User not found" });
        }

        // Prevent duplicate friend requests
        if (toUser.friendRequests.includes(fromUserName)) {
            return res.json({ success: false, message: "Friend request already sent" });
        }

        // Add friend request to the recipient's pending requests
        toUser.friendRequests.push(fromUserName);
        await toUser.save();

        // Create a new notification for the recipient
        const newNotification = new notifications({
            userProfilePic: profilePic,
            fromUserName: fromUserName,
            toUserName: toUserName,  // Set the userName of the recipient (the one receiving the notification)
            content: `${fromUserName} sent you a friend request`,  // Content of the notification
        });

        // Save the notification in the database
        await newNotification.save();

        // Respond with success
        res.json({ success: true, message: 'Friend request sent and notification created' });

    } catch (error) {
        console.error("Error adding friend and creating notification:", error);
        res.json({ success: false, message: error.message });
    }
});




app.listen(5000,()=>{
    console.log("App running on port number 5000...")
})