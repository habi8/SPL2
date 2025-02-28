const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const collection = require('./config')
//const { name,email,password } = require('ejs')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.set('view engine','ejs')

app.use(express.static('public'))

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


app.post('/signupVerification',async(req,res)=>{
    const data = {
        institute:req.body.institute,
        occupation:req.body.occupation,
        name: req.body.name,
        email: req.body.email,
        //password: req.body.password
    }
    const existingUser = await collection.findOne({email:data.email})
    if(existingUser){
        res.end('userExists')
    }

    else{
       // const saltRounds = 10
        //const hashedPassword = await bcrypt.hash(data.password,saltRounds)
        //data.password = hashedPassword
        const userdata = await collection.insertMany(data)
        console.log(userdata)
        console.log("Written on db")
        res.render('OTP')
    }
    
})

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

app.listen(7000,()=>{
    console.log("App running on port number 7000...")
})