const express = require("express")
const redis = require("redis")
const { APIRouter } = require("./router/api")
const { successify, errorify } = require("./utils")

const app = express()


app.use("/api", APIRouter)

app.get("/ping", (req, res) => {
  return res.json(successify({ message: "pong" }))
})

app.listen(3000, () => console.log("server running at port 3000"))