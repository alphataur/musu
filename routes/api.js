const express = require("express")
const router = express.Router()


router.get("/ping", (req, res)=>{
  res.json({success: true, error: false, message: "pong"})
})

module.exports = {
  APIRouter: router
}
