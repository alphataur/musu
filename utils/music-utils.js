require("dotenv").config()
require("../patches")
const fs = require("fs")
const path = require("path")
const id3 = require("node-id3")

class Music {
  constructor(dpath) {
    if (!!dpath)
      this.dpath = dpath
    else
      this.dpath = process.env.MPATH
  }
  isArgMusic(elem) {
    const FILTERS = [".mp3", ".flac", ".m4a", ".wma", ".wav", ".wave"]
    return FILTERS.indexOf(path.extname(elem)) > -1
  }
  static _search(dpath) {
    return new Promise(async (resolve, reject) => {
      let contents = await fs.promises.readdir(dpath)
      let tasks = contents.map(async (content) => {
        let fpath = path.join(dpath, content)
        let stats = await fs.promises.lstat(fpath).catch(reject)
        if (stats.isFile()) return fpath
        else if (stats.isDirectory()) {
          return await Music._search(fpath)
        }
        else return []
      })

      Promise.all(tasks)
        //.then(resolve)
        .then(sparseArr => {
          return sparseArr.flat()
        })
        .then(results => results.filter(e => {
          // use isArgMusic to filter out non-music files
          const FILTERS = [".mp3", ".flac", ".m4a", ".wma", ".wav", ".wave"]
          return FILTERS.indexOf(path.extname(e)) > -1 
        }))
        .then(resolve)
        .catch(reject)
    })
  }

  async search(dpath) {
    if (!!dpath) {
      let results = await Music._search(dpath)
      return results
    }
    else {
      let results = await Music._search(process.env.MPATH)
      return results
    }
  }
}

class Song {
  constructor(fpath) {
    if (!!fpath) {
      let exists = fs.existsSync(fpath)
      this.fpath = fpath
      this.tags = {}
    }
    else throw new Error(errors.NO_MPATH)
  }
  filterTags(tags) {
    const filters = ["title", "album", "trackNumber", "year", "genre", "image", "artist"]
    let result = {}
    filters.forEach(filter => {
      if (tags[filter] !== undefined) {
        if (filter === "image") {
          let image = tags[filter]
          result["image"] = {}
          result.image.imageBuffer = image.imageBuffer
          result.image.mime = image.mime
        }
        else {
          result[filter] = tags[filter]
        }
      }
    })
    result.fpath = this.fpath
    return result
  }
  read() {
    let tags = id3.read(this.fpath)
    if (tags !== undefined)
      this.tags = this.filterTags(tags)
    return this.tags
  }
  makeID(tags){
    if(tags === undefined) tags = this.tags
    let title = tags.title || "-"
    let artist = tags.artist || "-"
    let album = tags.album || "-"
    let year = tags.year || "-"
    return `${title}:${artist}:${album}:${year}`
  }
}

async function basicFunctionality() {
  let handle = new Music()
  let results = await handle.search("/home/iamfiasco/Downloads/Music/audiophile")
  let song = new Song(results[123])
  await song.read()
  console.log(song.tags)
}

async function test() {
  basicFunctionality()
}

//test()
//

module.exports = {
  Music,
  Song,
}
