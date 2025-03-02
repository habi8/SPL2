const nodemailer = require("nodemailer");
const collection = require("./config");
require("dotenv").config({ path: "./.env" });


// Configure Nodemailer

console.log(process.env.EMAIL)
console.log(process.env.PASSWORD)
const Email = "habib08072002@gmail.com"
const password= "ymdbxmcfkgojmsbq "
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: Email,  // Use environment variable
        pass: password,  // Use App Password
    },
});

// Function to Generate OTP
const generateOTP = ()=> Math.floor(1000 + Math.random() * 9000).toString();
const otpStorage = {}; 

// Function to Send OTP Email & Store in Database
const sendOTPEmail = async (email) => {
    // console.log(Email)
    // console.log(password)
    // const otp = generateOTP();
    // console.log("✅ OTP Generated:", otp);
    // const otp = Math.floor(1000 + Math.random() * 9000).toString();
    // otpStorage[email] = otp; // Store OTP in memory
    // console.log(`✅ OTP for ${email}: ${otp}`);

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate random OTP
    otpStorage.set(email, otp); // Store OTP in memory
    
    console.log(`Generated OTP for ${email}: ${otp}`);


    try {
        // Update OTP in Database
        // const user = await collection.findOne({ email });

        // if (!user) {
        //     console.log("ℹ️ Creating new user...");
        //     await collection.create({ email, otp, verified: false });  
        // } else {
        //     console.log("ℹ️ User already exists...");
        //   //  await collection.updateOne({ email }, { otp, verified: false });
        // }

        // Email Content
        const mailOptions = {
            from: Email,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is: ${otp}. Please use this to verify your account.`,
        };

        // Send Email
        console.log("📤 Sending email...");
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP Sent to ${email}`);

      // localStorage.setItem("OTP",otp)

      return { success: true, otp };
      console.log("OTP sent successfully");
    } catch (error) {
        console.error("❌ Error Sending OTP:", error);
        return { success: false, message: "Error sending OTP" };
    }
   
};

// Export Functions
module.exports = { sendOTPEmail,otpStorage };
