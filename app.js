require("dotenv").config()
const express = require("express")
const redis = require("redis")
const { APIRouter } = require("./router/api")
const { successify, errorify } = require("./utils")
const cors = require("cors")

const app = express()
app.use(cors())

app.use("/api", APIRouter)

app.get("/ping", (req, res) => {
  return res.json(successify({ message: "pong" }))
})

app.listen(process.env.PORT, () => console.log(`server running at port ${process.env.PORT}`))