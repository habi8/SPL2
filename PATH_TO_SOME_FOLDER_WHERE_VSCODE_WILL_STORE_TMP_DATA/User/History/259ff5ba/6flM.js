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

module.exports = router;
