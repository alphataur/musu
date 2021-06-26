require("dotenv").config()
const mongoose = require("mongoose")
const id3 = require("node-id3")
const fs = require("fs")
const events = require("events")


class libraryUtils extends events{
  constructor(fpath){
    super()
    this.fpath = fpath
  }
  walkFiles(root){
    var root;
    if(root === undefined)
      root = this.fpath
    return new Promise((resolve, reject)=>{
      fs.readdir(root, (err, files)=>{
        if(err)
          return reject(err)
        else{
          const fullPaths = files.map((e)=>{
            return path.join(root, e)
          })
          Promise.all(fullPaths.map(e =>{
            return new Promise((resolve, reject)=>{
              fs.lstat(e, (err, stats)=>{
                if(err)
                  reject(err)
                else if(stats.isDirectory()){
                  this.walkFiles().then(resolve).catch(reject)
                }
                else if(stats.isFile()){
                  return resolve([e])
                }
                else{
                  return resolve([])
                }
              })
            })
          }))
        }
      })
    })
  }
}

function main(){
  let a = new libraryUtils(process.env.MPATH)
  a.walkFiles(process.env.MPATH).then(console.log).catch(console.error)
}

main()
