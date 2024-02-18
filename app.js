const express=require("express");
const pasth=require("path");
const bcrypt=require("bcrypt");
const collection=require("./config");

const app=express();
//conevrt data into json format
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// use ejs as the view engine
app.set('view engine','ejs');


//static file

app.use(express.static("public"));
app.use(express.static(__dirname + '/views'))


app.get("/",(req,res)=>{
    res.render('login');
})


//Register user
app.post("/signup",async(req,res)=>{

    const data={
        Firstname: req.body.fname,
        Lastname: req.body.lname,
        name: req.body.uname,
        Email: req.body.Email,
        password: req.body.Password,
        confirmpassword: req.body.Confirm

    }
    if (data.password !== data.confirmpassword) {
        return res.status(400).send("Passwords do not match");
    }
    //check if the user already exists in database
    const existingUser=await collection.findOne({name: data.name})

    if(existingUser){
        res.send("User already exists.Please choose a different username");
    }

    else{
        // hash the passwords using bcrypt
        const saltRounds=10;//Number of salt round for bcrypt
        const hashedPassword=await bcrypt.hash(data.password,saltRounds);
        
        data.password=hashedPassword;//Replace the hashed password with original password
        const userdata=await collection.insertMany(data);
        console.log(userdata);

    }

});

//Login user
app.post("/login",async(req,res)=>{
    try{
        const check=await collection.findOne({name:req.body.username});
        if(!check){
            res.send("user name cannot found");

        }
        //comapre the hash password from the database with the plain text
        const isPasswordMatch=await bcrypt.compare(req.body.password,check.password);
        if(isPasswordMatch){
            res.render("home");
        }
        else{
            req.send("wrong password")
        }

    }
    catch{
        res.send("wrong details");

    }
});


const port=5000;
app.listen(port,()=>{
    console.log(`Server running on port: ${port}`);
})
