require("dotenv").config()
const mongoose = require("mongoose")
const id3 = require("node-id3")
const fs = require("fs")
const events = require("events")
const path = require("path")

class libraryUtils extends events{
  constructor(fpath){
    super()
    this.fpath = fpath
  }
  filterMusic(files){
    const filters = ["mp3", "m4a", "flac"]
    return files.filter(e => filters.indexOf(e) > -1)
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
    })).then((sparse)=>{
      return sparse.reduce((a, e) => a.concat(...e), [])
    })
  }
}

async function main(){
  let a = new libraryUtils(process.env.MPATH)
  let results = await a.walkFiles()
  console.log(results)
}

main()
