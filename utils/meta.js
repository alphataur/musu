require("dotenv")

const {createHash} = require("crypto")
const path = require("path")
const id3 = require("node-id3")
const {Finder, filterMusic} = require("./finder")
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
      let music = await MusicRead(file)
      let extractor = new SongMeta(music)
      let tags = extractor.pack()
      console.log(tags)
      //console.log(extractor.generate_id())
    }
  }
  add(){
    
  }
  async crawl(){
    let finder = new Finder({basePath: this.basePath})
    let results = await finder.crawl()
    let music = results.filter(filterMusic)
    await this.consume(music)
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
    this.hash = this.getHash()
    this.image = options.image || ""
    this.imageHash = this.getImageHash()
    this.base = process.env.BPATH || "/home/musu"
    this.vault = new Vault({confPath: path.join(this.base, "index")})
  }
  getImageHash(){
    if(this.image === "" || this.image === undefined)
      return ""
    else{
      let hasher = createHash("md5")
      hasher.update(this.image.imageBuffer)
      //write logic here
      return hasher.digest("hex")
    }
  }
  getImageBuffer(){
    if(this.image === "" || this.image === undefined)
      return ""
    else{
      return this.image.imageBuffer
    }
  }
  getHash(){
    let combined = ""
    let payload = this.pack()
    for(let key in payload){
      if(typeof payload[key] === "string")
        combined += payload[key]
    }
    let hasher = createHash("md5")
    hasher.update(combined)
    return hasher.digest("hex")
  }
  pack(){
    return {
      genre: this.genre,
      album: this.album,
      artist: this.artist,
      title: this.title,
      year: this.year,
      hash: this.hash,
      imageBuffer: this.getImageBuffer(),
      imageHash: this.getImageHash()
    }
  }
  async save(){
    let data = this.pack()
    let image = data.imageBuffer

  }
}

async function main(){
  let handle = new Vault({basePath: "/home/iamfiasco/Downloads/Music/audiophile/Run The Jewels - RTJ4 (2020) [320]/"})
  await handle.crawl()
}

main()
