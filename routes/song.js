const express = require("express")
const router = express.Router()
//const { Connection } = require("../utils/lookups")
const { createClient } = require("redis")

async function initClient(){
  let client = createClient(3)

}

router.get()
