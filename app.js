require ("dotenv").config(); // Load variables from .env

const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

// Import your schema
const Mydata = require("./models/myDataSchema");

app.set('view engine', 'ejs')
app.use(express.static('public'))

// Auto refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
 
 
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());
 
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});


// Middleware to parse JSON & form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve home.html when visiting "/"
app.get("/", (req, res) => {



  // result is array of objects
  Mydata.find().then ( (result)=>{res.render("home",{mytitle: "Home page", arr: result})}).catch((err)=> {console.log(error)})

 
  
});

// Simple success page after POST
app.get("/index.html", (req, res) => {
  res.send("<h1>Data sent successfully</h1>");
});

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Server running at http://localhost:${port}/`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.post("/", (req, res) => {
  console.log("📦 Received data:", req.body);

  const mydata = new Mydata(req.body);

  mydata.save()
    .then(() => {
      console.log("✅ Data saved to MongoDB");
      res.redirect("/index.html");
    })
    .catch((err) => {
      console.error("❌ Error saving data:", err.message); // <-- log message
      res.status(500).send("Error saving data: " + err.message);
    });
});


