require("dotenv").config()
const fs = require("fs")
const path = require("path")
const express = require("express")
const { pipeline } = require("stream")
const { fastLookup } = require("../lib/db")
const { successify, errorify } = require("../utils")
const { randomSample } = require("../utils/random")

const router = express.Router()

let lookup = new fastLookup()

async function initializeLookup(){
  await lookup.connect()
}

function closeLookup(){
  lookup.quit()
}

initializeLookup()


router.get("/random", async (req, res) => {
  try{
    let slugs = await lookup.findPattern("")
    let slug = randomSample(slugs)
    let id = await lookup.map2Id([slug])
    id = id[0]
    res.json(successify({ id }))
  }
  catch(e){
    res.json(errorify({ error: "failed to get random slug" }))
  }
  
})

router.get("/find", async (req, res) => {
  // Deprecation warning on this API endpoint
  let results = await lookup.findPattern(req.query.search) //doesnt accept space; applying space breaks this API
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
  let param = Array.from(req.query.search).filter(e => e !== " " ).join("")
  console.log(param)
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
  let { size } = await fs.promises.stat(meta.fpath)
  let range = req.headers.range

    if (range) {
    /** Extracting Start and End value from Range Header */
    let [start, end] = range.replace(/bytes=/, "").split("-");
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : size - 1;

    if (!isNaN(start) && isNaN(end)) {
      start = start;
      end = size - 1;
    }
    if (isNaN(start) && !isNaN(end)) {
      start = size - end;
      end = size - 1;
    }

    // Handle unavailable range request
    if (start >= size || end >= size) {
      // Return the 416 Range Not Satisfiable.
      res.writeHead(416, {
        "Content-Range": `bytes */${size}`
      });
      return res.end();
    }

    /** Sending Partial Content With HTTP Code 206 */
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4"
    });

    let readable = fs.createReadStream(meta.fpath, { start: start, end: end });
    pipeline(readable, res, err => {
      console.log(err);
    });

  } else {

    res.writeHead(200, {
      "Content-Length": size,
      "Content-Type": "audio/mp3"
    });

    let readable = fs.createReadStream(meta.fpath);
    pipeline(readable, res, err => {
      console.log(err);
    });

  }


  //return fs.createReadStream(meta.fpath).pipe(res)
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
  let fpath = path.join(process.env.IPATH, `${req.query.id}.jpg`)
  if(fs.existsSync(fpath)){
    fs.createReadStream(fpath).pipe(res)
  }
  else{
    return res.json({ success: false, error: "album art not found"})
  }
})

process.on("exit", () => {
  closeLookup()
  return process.exit(0)
})
module.exports = {
  baseRouter: router
}
