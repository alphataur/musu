const express = require("express")
const router = express.Router()
const redis = require("redis")
const { successify, errorify } = require("../utils")

let client;

async function initRedisClient(){
  client = redis.createClient({ database: 3 })
  await client.connect()
}




initRedisClient()



router.get("/", async (req, res) => {
  let page = Number(req.query.page) || 0
  let npage = Number(req.query.npage) || 50
  let pid = req.query.pid || "all"
  console.log(npage, page)
  if(client.exists(pid)){
    let songs = await client.sMembers(pid)
    if(songs.length > npage){
      console.log(`${page*npage} - ${(page+1) * npage}`)
      songs = songs.slice(page * npage, (page + 1) * npage)
    }
    console.log(songs.length)
    return res.json(successify({ songs }))
  }
  else{
    return res.json(errorify({ error: "failed to readplaylist"}))
  }

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
