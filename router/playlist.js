const express = require("express")
const router = express.Router()
const { successify, errorify } = require("../utils")
const { fastStore } = require("../lib")
const redis = require("redis")

let lookup = new fastStore()

async function initDB(){
  await lookup.connect()
}
initDB()

router.get("/get_playlist", async (req, res) => {
  let pname = req.query.pname
  let collection = await lookup.getCollection(pname)
  return res.json(successify({ collection: collection}))
})

router.get("/next", async (req, res) => {
  let id = req.query.id || "1c00b6eb0693f7ab82d835f0c098316f5d032a3ccd23272db04c59708d63ed8a"
  let pname = req.query.pname
  if(pname === "undefined") pname = "all"
  if(id === undefined) res.json(errorify({ message: "id cannot be empty"}))

  let ids = await lookup.keyaz()
  let offset = ids.indexOf(id)
  if(offset === -1){
    res.json(errorify({ message: "invalid song id"}))
  }
  else{
    res.json(successify({ id: ids[offset+1]}))
  }
})

router.get("/add", async (req, res) => {
  let pname = req.query.pname
  let id = req.query.id
  if(pname === undefined || id === undefined) res.json(errorify({ message: "parameters pname(playlistName) and id(musicID) required" }))
  console.log(`adding ${id} to ${pname}`)
  try{
    await lookup.add2Playlist(pname, id)
    res.json(successify({ action: "requested" }))
  }
  catch(e){
    console.log("error", e)
    res.json(errorify({ message: "parameters pname(playlistName) and id(musicID) required" }))
  }
  //if(await client.add2Playlist(pname, id)){
  //  res.json(successify({ action: "done"}))
  //} 
  //else{
  //  res.json(errorify({ action: "failed" }))
  //}
})


//router.get("/add", async (req, res) => {
//  let song = req.query.id
//  let playlist = req.query.pl
//
//})

process.on("exit", () => client.quit())

module.exports = {
  playlistRouter: router
}
