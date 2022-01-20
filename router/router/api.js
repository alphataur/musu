require("dotenv").config()
const fs = require("fs")
const path = require("path")
const express = require("express")

const { fastEntry, fastLookup } = require("../lib/db")
const { successify } = require("../utils")

const router = express.Router()

let lookup = new fastLookup()

async function initializeLookup(){
  await lookup.connect()
}

function closeLookup(){
  lookup.quit()
}
initializeLookup()

router.get("/find", async (req, res) => {
  let results = await lookup.findPattern(req.query.search)
  let ids = await lookup.map2Id(results)
  let payload = []
  for(let i = 0; i < ids.length; i++){
    payload.push({
      id: ids[i],
      slug: results[i]
    })
  }
  return res.json(successify({results: payload}))
})


router.get("/meta", async (req, res) => {
  let results = await lookup.findPattern(req.query.search)
  let ids = await lookup.map2Id(results)
  console.log(results)
  results = await Promise.all(ids.map(async (result) => await lookup.map2Meta(result)))
  return res.json(successify({results: results}))
})

router.get("/play", async (req, res) => {
  let meta = await lookup.map2Meta(req.query.id)
  return fs.createReadStream(meta.fpath).pipe(res)
})

router.get("/image", (req, res) => {
  fs.createReadStream(path.join(process.env.IPATH, req.query.id + ".jpg")).pipe(res)
})

process.on("exit", () => {
  closeLookup()
  return process.exit(0)
})
module.exports = {
  APIRouter: router
}