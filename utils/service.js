require("dotenv").config()
//const mongoose = require("mongoose")
const id3 = require("node-id3")
const fs = require("fs")
const events = require("events")
const path = require("path")
const collections = require("./collections")

class MusuService extends events{
  constructor(fpath){
    super()
    //patching arrays and object prototypes
    if(Array.prototype.last === undefined){
      Array.prototype.last = function(){
        return this[this.length - 1]
      }
    }

    if(Object.prototype.keys === undefined){
      Object.prototype.keys = function(){
        return Object.keys(this)
      }
    }
    this.fpath = fpath
  }
  readTags(fpath){
    return new Promise((resolve, reject)=>{
      id3.read(fpath, function(err, tags){
        if(err)
          return reject(err)
        else
          return resolve(tags)
      })
    })
  }
  filterMusic(files){
    const filters = ["mp3", "m4a", "flac"]
    return files.filter(e => filters.indexOf(this.getExt(e)) > -1)
  }
  getExt(fpath){
    return fpath.split(".").last()
  }
  async walkFiles(root){
    if(root === undefined)
      root = this.fpath
    let files = await fs.promises.readdir(root)
    return await Promise.all(files.map(e => {
      return new Promise(async (resolve, reject)=>{
        let fullPath = path.join(root,e)
        let stats;
        try{
          stats = await fs.promises.lstat(fullPath)
        }
        catch(err){
          return reject(err)
        }
        if(stats.isFile())
          return resolve([fullPath])
        else if(stats.isDirectory())
          return resolve(await this.walkFiles(fullPath))
        else
          return resolve([])
      })
    })).then((sparseArr)=>{
      return sparseArr.reduce((a, e) => a.concat(...e), [])
    })
  }
  filterTags(file){
    let allowedTags = ["genre", "album", "artist", "title", "year", "comment", "image"]
    let matched = file.keys().filter(e => allowedTags.indexOf(e) > -1)
    let res = {}
    for(let i of matched){
      if(i === "image" && file.image !== undefined){
        res[i] = file[i].imageBuffer
        continue
      }
      res[i] = file[i]
    }
    return res
  }
}

async function main(){
  let a = new MusuService(process.env.MPATH)
  let core = new collections.mongoCore()
  let results = await a.walkFiles()
  let i = 0
  let n = results.length
  for(let music of a.filterMusic(results)){
    console.log(i, "of", n)
    let tags = a.filterTags(await a.readTags(music))
    let song = new collections.songMeta(tags, core)
    await song.save()
    i++;
  }
}

main()
