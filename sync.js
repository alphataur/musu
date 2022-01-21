require("dotenv").config()




const { isMusic, crawl, readTags } = require("./lib/tags")
const { hash, hashFile } = require("./lib/signature")

const { randomSample } = require("./utils")
const { nanoid } = require("nanoid")
const { fastEntry } = require("./lib/db")
const redis = require("redis")


const meta = redis.createClient({database: 1})
const search = redis.createClient({database: 2})




async function sync(location){
  
  await meta.connect()
  await search.connect()

  if(!!!location) location = "/home/iamfiasco/Downloads/Music/audiophile"
  console.log(location)
  let contents = await crawl(location)//.slice(1, 1000)
  //contents = contents.slice(115, 200)
  let counter = 0
  let n = contents.length
  for(let content of contents){
    console.log(`progress ${counter} of ${n}`, content)
    try{
      console.log("calculating hash")
      let id = await hashFile(content)
      if(await meta.exists(id)){
        console.log("tag already exists")
        counter++
        continue
      }
      console.log("reading tags")
      let tags = readTags(content)
      let handle = new fastEntry(meta)
      console.log("writing tags")
      handle.set(tags)
      
      console.log("saving tags")
      let reversal = await handle.save(id)
      
      //console.log(reversal)
      console.log("saving reversal", reversal, id)
      await search.set(reversal, id)
      
      //console.log(reversal)
    }catch(err){
      console.log(err)
      return close()
    }
    counter++
  }
  //let tags = readTags(selection)
  //console.log(tags)
  //console.log(randomSample(contents))
}

let close = async (err) => {
  if(!!err) console.log(err)
  await meta.quit()
  await search.quit()
}

sync()
