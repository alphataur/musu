require("dotenv")
const fs = require("fs")
const path = require("path")

if(Array.prototype.last === undefined){
  Array.prototype.last = function(){
    return this[this.length - 1]
  }
}

class Finder{
  constructor({basePath}){
    this.base = basePath
  }
  crawl(root){
    // i know its ambitious move to use custom made promises but ought to make an async version
    // but that would be really easy aint it?
    //patch rootPath
    if(root === undefined)
      root = this.base
    return new Promise((resolve, reject)=>{
      fs.readdir(root, (err, files)=>{
        if(err) return reject(err)
        else{
          Promise.all(files.map((file)=>{
            let fpath = path.join(root, file)
            return new Promise((resolve, reject)=>{
              fs.lstat(fpath, (err, stats)=>{
                if(err) return reject(err)
                else if(stats.isFile()) return resolve([fpath])
                else if(stats.isDirectory()) this.crawl(fpath).then(resolve)
                else return resolve([])
              })
            })
          }))
            .then(sparseArray => sparseArray.reduce((a, e) => a.concat(...e), []))
            .then(resolve)
            .catch(reject)
        }
      })
    })
  }
}

function filterMusic(fpath){
  let exts = ["mp3", "m4a", "flac", "wma", "wave"]
  let ext = fpath.split("/").last().split(".").last()
  return exts.indexOf(ext) > -1
}

module.exports = {
  Finder,
  filterMusic
}

//async function main(){
//  let root = "/home/iamfiasco/Downloads/Music/audiophile"
//  let handle = new Finder({basePath: root})
//  let results = await handle.crawl()
//  console.log(results.filter(filterMusic))
//}
//
//main()
