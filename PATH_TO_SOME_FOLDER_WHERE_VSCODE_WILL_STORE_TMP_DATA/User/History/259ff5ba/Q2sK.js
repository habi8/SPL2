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
    api_secret: 'your_api_secret'
});

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profile_pictures', // Folder in Cloudinary
        format: async (req, file) => 'png', // Convert all to PNG
        public_id: (req, file) => req.session.userEmail.replace(/[@.]/g, "_") // Use email as file name
    }
});

const upload = multer({ storage: storage });

// Route to handle profile picture upload
router.post('/', upload.single('profilePic'), (req, res) => { // Change route to `/`
    if (!req.file || !req.file.path) {
        return res.status(400).json({ error: 'Upload failed' });
    }
    res.json({ url: req.file.path }); // Return Cloudinary URL
});

module.exports = router;
