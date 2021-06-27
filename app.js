require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")

const APIRouter = require("./routes/index").APIRouter

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use("/api", APIRouter)



app.listen(3000, ()=>{
  console.log("server running at 3000!")
})

