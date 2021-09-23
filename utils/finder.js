const fs = require("fs")
const path = require("path")

class Finder{
  constructor(base){
    this.base = base
  }
  find(base, recursive){

    if(base === undefined) base = this.base
    if(recursive === undefined) recursive = false

    return new Promise( async (resolve, reject) => {

      let contents = await fs.promises.readdir(base)
      Promise.all( contents.map( content => {
        return new Promise(async (resolve, reject) => {
          let fpath = path.join(base, content)
          let stats = await fs.promises.lstat(fpath)

          if(stats.isFile()) return resolve([fpath])
          else if(stats.isDirectory() && recursive) this.find(fpath, recursive).then(resolve)
          else return resolve([])
        })
      }))
          .then(sparseArray => sparseArray.reduce((a, e) => a.concat(...e), []))
          .then(results => this.filterMusic(results))
          .then(resolve)
          .catch(reject)
    })
  }
  filterMusic(contents){
    let exts = ["flac", "mp3", "m4a", "wave", "wav", "wma"]
    return contents.filter( content => exts.indexOf(path.extname(content).slice(1)) > -1 )
  }
}


module.exports = {
  Finder
}
