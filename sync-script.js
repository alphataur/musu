require("dotenv").config()
require("./patches")

const { Song, Music, MetaManager } = require("./utils")

async function main(){
  //takes about an hour on mpath
  let songs = await Music._search(process.env.MPATH)
  let manager = new MetaManager()
  manager.connect()
  for(let fpath of songs){
    //console.log(fpath)
    let song = new Song(fpath)
    let tags = song.read() //.catch(e => console.log(`failed to read tags from ${fpath}`))
    //debugger;
    //console.log(JSON.stringify(tags))
    await manager.save(tags)
    //await manager.close()
  }
  await manager.close()
}

//main()
