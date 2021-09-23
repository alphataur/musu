const id3 = require("node-id3")

class Parser{
  constructor(path){
    this.path = path
  }
  async read(soundart){
    if(soundart === undefined) soundart = false

    let tags = await id3.read(this.path)
    return this.filterTags(tags, soundart)
  }
  filterTags(tags, soundart){

    let filters = ["genre", "year", "title", "artist", "album", "trackNumber"]
    let results = Object.keys(tags)
                                .filter(key => filters.indexOf(key) > -1)
                                .reduce((a, e) => {
                                  a[e] = tags[e]
                                  return a
                                }, {})

    if(soundart && tags.image !== undefined){
      results.image = {}
      results.image.buffer = tags.image.imageBuffer
      results.image.mime = tags.image.mime
    }

    return results
  }
}


module.exports = {
  Parser
}

//async function main(){
//  let handle = new Parser("/home/iamfiasco/Downloads/Music/audiophile/BTS-Dynamite.mp3")
//  let tags = await handle.read(true)
//  console.log(tags)
//}
//main()
