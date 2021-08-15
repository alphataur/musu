require("dotenv")
const fs = require("fs")
const {createHash} = require("crypto")
const path = require("path")
const id3 = require("node-id3")
const {Finder, FilterMusic} = require("./finder")
const fs = require("fs").promises

function MusicRead(mPath){
  return new Promise((resolve, reject)=>{
    id3.read(mPath, function(err, tags){
      if(err) return reject(err)
      else return resolve(tags)
    })
  })
}

class Vault{
  constructor({basePath}){
    this.basePath = basePath
    this.files = []
  }
  async consume(files){
    for(let file of files){
      let music = await MusicRead(mPath)
      let meta = new SongMeta(music)
      debugger;;
    }
  }
  add(){
    
  }
  async crawl(){
    let finder = new Finder({basePath: this.basePath})
    let results = await finder.crawl()
    await this.consume(results)
  }
}

class SongMeta{
  constructor(options, core){
    this.genre = options.genre || ""
    this.album = options.album || ""
    this.artist = options.artist || ""
    this.title = options.title || ""
    this.year = options.year || ""
    //this.comment = options.comment || ""
    this.image = options.image || ""
    this.base = process.env.BPATH
    this.vault = new Vault({confPath: path.join(base, )})
  }
  pack(){
    return {
      genre: this.genre,
      album: this.album,
      artist: this.artist,
      title: this.title,
      year: this.year,
      image: this.image
    }
  }
  async save(){
    let data = this.pack()
  }
}
