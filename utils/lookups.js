const path = require("path")
const redis = require("redis")
const crypta = require("./crypta")

//async function Connection(offset){
//  return redis.createClient({ database: offset })
//}

class Connection{
  constructor(s,a,db){
    this.connection = redis.createClient({database: db})
    this.connection.on("error", e => console.log(`something ${e}`))
  }
  async getAll(){
    return await this.connection.keys("*")
  }
  async getPattern(pattern){
    return await this.connection.keys(pattern)
  }
  async setOne(key, value){
    await this.connection.set(key, JSON.stringify(value)) //.catch(console.log)
    return true
  }
  async getOne(key, decode){
    if(!!decode)
      return await this.connection.get(key)
    else
      return JSON.parse(await this.connection.get(key))
  }
  async setMany(keys, values){
    await Promise.all(keys.map(async function(key, index, keys){
      await this.setOne(key, values[index])
    }))
  }
  async getMany(keys){
    return await Promise.all(keys.map(async (key) => {
      return await getOne(key)
    }))
  }
  async close(){
    await this.connection.quit()
  }
}

class MetaManager{
  //"title:artist:album:year"
  constructor(dpath){
    this.dpath = dpath || process.env.MPATH
    this.hashLookup = new Connection(undefined, undefined, 1)
    this.artistLookup = new Connection(undefined, undefined, 2)
    this.idLookup = new Connection(undefined, undefined, 3)
  }
  async connect(){
    await this.hashLookup.connection.connect()
    await this.artistLookup.connection.connect()
    await this.idLookup.connect()
  }
  makeID(tags){
    if(tags === undefined) tags = this.tags
    let title = tags.title || "-"
    let artist = tags.artist || "-"
    let album = tags.album || "-"
    let year = tags.year || "-"
    title = title.toLowerCase()
    artist = artist.toLowerCase()
    album = album.toLowerCase()
    try{
      year = year.toLowerCase()
    }
    catch(e){

    }
    return `${title}:${artist}:${album}:${year}`
  }
  async setOne(connection, key, obj){
    return await connection.set(key, JSON.stringify(obj))
  }
  async getOne(connection, key){
    return JSON.parse(await connection.get(key) || "{}")
  }
  async save(tags){
    let hash = await crypta.hashFile(tags.fpath)
    //console.log(hash)
    //this.hashLookup.connection.sAdd()
    if(await this.hashLookup.connection.sIsMember("visited", hash)){
      return
    }
    await this.hashLookup.connection.sAdd("visited", hash)
    let ID = this.makeID(tags)
    console.log(ID)
    await this.hashLookup.setOne(ID, hash)
    delete tags.image
    await this.artistLookup.setOne(ID, tags)
    await this.idLookup.setOne(hash, ID)
  }
  async close(){
    await this.hashLookup.close()
    await this.artistLookup.close()
    await this.idLookup.close()
  }
}

module.exports = {
  MetaManager,
  Connection
}


