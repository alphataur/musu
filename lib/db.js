const redis = require("redis")
const fs = require("fs")
const path = require("path")

class fastEntry{
  constructor(client){
    this.client = client
    this.createdAt = new Date()
  }
  set(something){
    for(let key of ["artist", "album", "title", "year", "genre", "trackNumber", "image", "fpath"]){
      this[key] = something[key]
    }
    console.log(this.representation())
  }
  async save(hash){
    let representation = this.representation()
    //console.log(this.client)
    for(let key in representation)
      await this.client.HSET(hash, key, representation[key]).catch(console.log)
    if(!!this.image) {
      console.log("writing image to", hash, representation)
      let imageStream = fs.createWriteStream(path.join(process.env.IPATH, hash + ".jpg"))
      imageStream.write(this.image.buffer)
      imageStream.end()
    }
    return this.reversal()
  }
  representation(){
    return {
      createdAt: this.createdAt.toString() || "",
      title: this.title || "",
      artist: this.artist || "",
      album: this.album || "",
      year: this.year || "",
      trackNumber: this.trackNumber || "",
      genre: this.genre || "",
      //image: this.image,
      fpath: this.fpath || ""
    }
  }
  reverseRepresentation(){
    return {
      artist: this.artist || "",
      album: this.album || "",
      title: this.title || "",
      year: this.year || "",
      genre: this.genre || ""
    }
  }
  reversal(){
    let reverse = this.reverseRepresentation()
    for(let key in reverse){
      reverse[key] = reverse[key].toLowerCase().replace(/\s/g, "")
    }
    return `${reverse.title}:${reverse.artist}:${reverse.album}:${reverse.year}:${reverse.genre}`
  }
  serialize(){
    return JSON.stringify(this.representation(), null, 4)
  }
  deserialize(data){
    return JSON.parse(data)
  }
}

module.exports = {
  fastEntry
}