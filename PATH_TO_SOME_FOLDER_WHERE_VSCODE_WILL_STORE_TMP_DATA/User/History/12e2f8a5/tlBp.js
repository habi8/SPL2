const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://127.0.0.1:27017/SPL2')

connect.then(()=>{
    console.log("database connected")
})

.catch((err)=>{
    console.log("not connected",err)
})

const LoginSchema = new mongoose.Schema({
    institute:{
        type:String,
        required:false
    },
    occupation:{
        type:String,
        required:false
    },
    
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    OTP:{
        type: String,
        required:false
    },
    password:{
        type: String,
        required:false
    },
    verified:{
        type: Boolean,
        required: false
    },
    userName:{
        type: String,
        required: false
    },
    posts:{
        type: String,
        required:false
    },
    bio:{
        type: String,
        required: false
    },
    profilePic: {
        type : String,
        required : false
    },
    friends:[{type: String}]
})

const playerSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    highScore: { type: Number, default: 0 }
});

const postSchema = new mongoose.Schema({
    postID: { type: Number, unique: true, required: true }, // Auto-incrementing post ID
    textContent: { type: String, required: false },
    photo: { type: String, required: false },
    profilePicture: { type: String, required: false },
    userName: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, default: 0 },
});


const collection =  mongoose.model('Users',LoginSchema);
const Player = mongoose.model("shark_sprint", playerSchema);
const posts = mongoose.model("posts",postSchema)
const Counter = mongoose.model("Counter", counterSchema);
module.exports = {collection,Player,posts,Counter};
