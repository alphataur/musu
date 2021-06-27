require("dotenv").config()
const mongoose = require("mongoose")
const id3 = require("node-id3")
const fs = require("fs")
const events = require("events")
const path = require("path")

class libraryUtils extends events{
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
        return this[this.length - 1]
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
}

async function main(){
  let a = new libraryUtils(process.env.MPATH)
  let results = await a.walkFiles()
  for(let i of a.filterMusic(results)){
    console.log(await a.readTags(i))
  }
}

main()
