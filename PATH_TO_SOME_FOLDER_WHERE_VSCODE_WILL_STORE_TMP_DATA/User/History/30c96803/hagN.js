const nodemailer = require("nodemailer");
const collection = require("./config");
require("dotenv").config({ path: "./.env" });


const Email = "conservethedeep@gmail.com"
const password= "zsoteyhubzwvhpsd"
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: Email,  
        pass: password,  
    },
});


const generateOTP = ()=> Math.floor(1000 + Math.random() * 9000).toString();
const otpStorage = new Map();


const sendOTPEmail = async (email) => {

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("Storing OTP for:", email, "OTP:", otp);
    otpStorage.set(email, otp);
    
    console.log(`Generated OTP for ${email}: ${otp}`);


    try {
        
        const mailOptions = {
            from: Email,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP for account registration is: ${otp}. Please use this to verify your account.Thank you for joining with us.`,
        };

        
        console.log("📤 Sending email...");
        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP Sent to ${email}`);


      return { success: true, otp };
      console.log("OTP sent successfully");
    } catch (error) {
        console.error("❌ Error Sending OTP:", error);
        return { success: false, message: "Error sending OTP" };
    }
   
};

module.exports = { sendOTPEmail,otpStorage };
