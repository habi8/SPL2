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
    }
})

const playerSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    highScore: { type: Number, default: 0 }
});

const collection =  mongoose.model('Users',LoginSchema);
const Player = mongoose.model("shark_sprint", playerSchema);
module.exports = {collection, Player};
