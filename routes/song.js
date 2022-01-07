const express = require("express")
const router = express.Router()
const { Connection, Errors } = require("../utils")
const fs = require("fs")
//const { createClient } = require("redis")

async function getPattern(connection, pattern){
  if(pattern === undefined) pattern = "*"
  let results = await connection.connection.keys(pattern)
  return { results: results}
}

async function getMeta(connection, id){
  //console.log(id)
  if(id === undefined) return { error: Errors.NO_SONGID }
  else{
    let text = await connection.connection.get(id)
    let data = JSON.parse(text)
    //console.log(data)
    return data
  }
}

async function getKey(connection, key){
  if(key === undefined) return { error: Errors.NO_SONGID }
  else{
    let result = await connection.connection.get(key)
    console.log(result)
    return result
  }
}

let hashLookup = false
let idLookup = false
let cache = false
let hashReverseLookup = false

async function initClient(){
  hashLookup = new Connection(undefined, undefined, 1)
  idLookup = new Connection(undefined, undefined, 2)
  hashReverseLookup = new Connection(undefined, undefined, 3)
  cache = new Connection(undefined, undefined, 4)
  await hashLookup.connection.connect()
  await cache.connection.connect()
  await idLookup.connection.connect()
  await hashReverseLookup.connection.connect()
}

initClient()

router.get("/meta", async (req, res) => {
  //console.log("nikhil", req.query.hash)
  let ID = await hashReverseLookup.getOne(req.query.hash, dec=true) //await getKey(hashReverseLookup, req.params.hash)
  console.log(ID)
  let meta = await idLookup.getOne(ID)
  console.log(meta)
  res.json({result: meta, success: true, error: false })
})

router.get("/search", async (req, res) => {
  let pattern = req.query.q //"linkin park"
  let results = await hashLookup.getPattern(`*${pattern}*`) //await getPattern(idLookup, pattern)
  let response = []
  for(let result of results){
    let hash = await getMeta(hashLookup, result)
    response.push(hash)
  }
  //console.log(results)
  res.json({success: true, error: false, results: response})
})

router.get("/map/hash2id", async (req, res) => {
  let hash = req.query.hash
  let ID = await hashReverseLookup.getOne(hash, dec=true)
  res.json({ result: ID, success: true, error: false})
})


router.get("/play", async (req, res) => {
  let ID = await hashReverseLookup.getOne(req.query.hash, dec=true)
  let meta = await idLookup.getOne(ID)
  let stream = fs.createReadStream(meta.fpath)
  stream.pipe(res)
  //res.json({result: meta, success: true, error: false})
})

//router.get("/play", async (req, res) => {
//  console.log(req.query.hash)
//  //let id = await getKey(hashReverseLookup, req.query.hashid)
//  //console.log(id)
//  let id = await hashReverseLookup.getOne(req.query.hash)
//  //console.log(id)
//  let meta = await idLookup.getOne(id[0], true)
//  console.log(meta)
//  res.json({})
//  let fpath = meta.fpath
//  return fs.createReadStream(fpath).pipe(res) 
//})




module.exports = {
  SongRouter: router
}
