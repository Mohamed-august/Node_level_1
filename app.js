require("dotenv").config(); // Load environment variables
const express = require ('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


const Mydata = require("./models/myDataSchema")


app.get("/",(req,res) =>
{
   res.sendFile("./views/home.html", {root: __dirname});
}
);

app.get("/index.html",(req,res) =>
{
   res.send("<h1>Data sent successfully</h1>")
}
);


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  app.listen(port, () => {
  console.log(`http://localhost:${port}/`)
})
})
.catch((err)=>{console.log(err)})
;

app.post("/", (req, res) => {
  console.log(req.body)

  const mydata = new Mydata(req.body)

  mydata.save().then(()=> 
  {
      res.redirect("/index.html")
  }).catch((err)=>{
    console.log(err)
  });
})



