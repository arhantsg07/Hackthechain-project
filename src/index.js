const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/views/images"));
app.use(express.static(__dirname + "/hackathonproject"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// use ejs as the view engine
app.set("view engine", "ejs");

// app.get("/home", (req, res) => {
//     res.render("")
// })
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/Ourteam", (req, res) => {
  res.render("Ourteam");
});

app.get("/contact", (req, res) => {
    res.render("contact")
});
app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.uname,
    password: req.body.Password,
  };
  //check if the user already exists in database
  const existingUser = await collection.findOne({ name: data.name });

  if (existingUser) {
    res.send("User already exists.Please choose a different username");
  } else {
    // hash the passwords using bcrypt
    const saltRounds = 10; //Number of salt round for bcrypt
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; //Replace the hashed password with original password
    const userdata = await collection.create(data);
    console.log(userdata);
    res.redirect("/login");
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.send("user name cannot found");
    }
    //comapre the hash password from the database with the plain text
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.redirect("/");
    } else {
      req.send("wrong password");
    }
  } catch {
    res.send("wrong details");
  }
});

app.listen(3000, () => {
  console.log("page is running at port 3000");
});
