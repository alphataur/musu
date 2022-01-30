require("dotenv").config({ path: "../confs/musu-dev2022/.env" })

const express = require("express")
const redis = require("redis")
const { baseRouter, playlistRouter } = require("./router")

const { successify, errorify } = require("./utils")
const cors = require("cors")

const app = express()
app.use(cors())

app.use("/api", baseRouter)
app.use("/api/playlist", playlistRouter)



app.get("/ping", (req, res) => {
  return res.json(successify({ message: "pong" }))
})

app.listen(process.env.PORT, () => console.log(`server running at port ${process.env.PORT}`))
