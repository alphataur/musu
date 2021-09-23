const { Finder } = require("../utils/finder")
const { Parser } = require("../utils/parser")
const axios = require("axios")
const fs = require("fs")

const defaults = require("../utils/defaults")

exports.explore = async (req, res) => {
  let path = req.body.path
  let recursive  = req.body.recursive || false
  let handle = new Finder(path)
  let results = await handle.find(path, recursive)
  return { ...defaults.SUCCESS, results }
}

exports.meta = async (req, res) => {
  let path = req.body.path
  let soundart = req.body.soundart || false
  let handle = new Parser(path)
  let results = await handle.find(path, soundart)
  return { ...defaults.SUCCESS, results }
}

exports.play  = async (req, res) => {
  let path = req.body.path
  try{
    let stats = await fs.promises.lstat(path)
    if(stats.isFile()) fs.createReadStream(path).pipe(res)
    else return { ...defaults.SUCCESS, message: "target is a directory" }
  }
  catch(e){
    let payload = { ...defaults.FAILURE }
    payload.error = e
    return payload
  }
}

exports.webplay = async (req, res) => {
  let url =req.body.url
  let wres = await axios({method: "GET", url, responseType: "stream"})
  wres.pipe(res)
}


