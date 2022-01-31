const redis = require("redis")
const fs = require("fs")
const path = require("path")

class fastStore{
  constructor(){
    this.meta = redis.createClient({database: 1})
    this.search = redis.createClient({database: 2})
    this.playlist = redis.createClient({ database: 3})
    this.createdAt = new Date()
  }
  async connect(){
    try{
      await this.meta.connect()
      await this.search.connect()
      await this.playlist.connect()
    }
    catch(e){
      console.log("error while connection to redis")
    }
  }
  disconnect(){
    this.meta.quit()
    this.search.quit()
  }
  async keyaz(){
    return await this.meta.keys("*")
  }
  async findPattern(pattern){
    //return await this.search.KEYS(pattern)
    return await this.search.keys(`*${pattern}*`) //pattern)
  }
  async getCollection(name){
    if(!!name && name !== true){
      let collection = await this.playlist.SMEMBERS(name)
      return this.mapCollection2Meta(collection)
    }
    else{
      name = "all"
      let collection = await this.playlist.SMEMBERS(name)
      return this.mapCollection2Meta(collection)
    }
  }
  async mapCollection2Meta(collection){
    try{
      let tasks = Promise.all(collection.map(async (id) => {
        let meta = await this.map2Meta(id)
        meta.id = id
        return meta
      }))
      let results = await tasks
      return results
    }
    catch(e){
      console.log("error mapping to collection")
      return []
    }
  }
  async map2Meta(id){
    return await this.meta.HGETALL(id)
  }
  async map2Id(idxs){
    return await Promise.all(idxs.map(async (idx) => await this.search.get(idx)))
  }

  //setter functions and utils
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
      await this.meta.HSET(hash, key, representation[key]).catch(console.log)
    if(!!this.image) {
      console.log("writing image to", hash, representation)
      let imageStream = fs.createWriteStream(path.join(process.env.IPATH, hash + ".jpg"))
      imageStream.write(this.image.buffer)
      imageStream.end()
    }
    return this.reversal()
  }
  representation(){
    //for internal class usage
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
    //for internal class usage
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
  async add2Playlist(playlist, id){
    try{
      await this.playlist.SADD(playlist, id)
      return true
    }
    catch(e){
      console.log(e)
      return false
    }
  }
}




module.exports = {
  fastStore
}
