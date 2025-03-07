const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const session = require('express-session');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: 'dipgpjbtc', 
    api_key: '375663322893436', 
    api_secret: 'KsbtwFT67NiJc7EFZtaVfg5FmEo'
});

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_pictures', // Folder in Cloudinary
        format: async (req, file) => 'png', // Convert all to PNG
        public_id: (req, file) => req.session.mail.replace(/[@.]/g, "_") // Use email as file name
    }
});

const upload = multer({ storage: storage });

// Route to handle profile picture upload
// Your uploadDp.js code where multer and cloudinary are configured

// Route to handle profile picture upload
app.post('/updateProfilePic', upload.single('profilePic'), (req, res) => {
    if (!req.file || !req.file.path) {
        return res.status(400).json({ error: 'Upload failed' });
    }

    // Send back the uploaded image URL to frontend
    res.json({ url: req.file.path });
});


module.exports = router;
