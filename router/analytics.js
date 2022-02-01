const express = require("express")
const router = express.Router()
const { fastStore } = require("../lib")
const { successify, errorify } = require("../utils")

let store = new fastStore()
async function init(){
  store.connect()
}

init()

router.get("/get_stats", (req, res) => {
  let id = res.query.id
  let defaults = { seconds: 0, iters: 0 }
  let data = {}
  try{

  }
  catch(e){

  }
  return res.json(successify(data))
})

module.exports = {
  analyticsRouter: router
}
