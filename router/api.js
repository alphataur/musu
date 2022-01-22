require("dotenv").config()
const fs = require("fs")
const path = require("path")
const express = require("express")

const { fastEntry, fastLookup } = require("../lib/db")
const { successify, errorify } = require("../utils")

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
  // Deprecation warning on this API endpoint
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


router.get("/search", async (req, res) => {
  let param = String(req.query.search)
  let slugs = await lookup.findPattern(param)
  let ids = await lookup.map2Id(slugs)
  let results = await Promise.all(ids.map(async (result) => await lookup.map2Meta(result)))
  for(let i = 0; i < results.length; i++){
    results[i].id = ids[i]
    results[i].slug = slugs[i]
  }
  return res.json(successify({results: results}))
})

router.get("/play", async (req, res) => {
  let meta = await lookup.map2Meta(req.query.id)
  return fs.createReadStream(meta.fpath).pipe(res)
})

router.get("/meta", async (req, res) => {
  try{
    let id = req.query.id
    let meta = await lookup.map2Meta(id)
    meta.id = id
    return res.json(successify({ meta }))
  }
  catch(e){
    console.log(e)
    return res.json(errorify({error: e.toString()}))
  }

})

router.get("/image", (req, res) => {
  try{
    fs.createReadStream(path.join(process.env.IPATH, req.query.id + ".jpg")).pipe(res)
  }
  catch(e){
    res.end()
  }
})

process.on("exit", () => {
  closeLookup()
  return process.exit(0)
})
module.exports = {
  APIRouter: router
}
