const fs = require("fs")
const path = require("path")

const id3 = require("node-id3")

const { randInt, randomSample } = require("../utils")



const isMusic = (fpath) => {
  //TODO:
  //check file exists
  //check mime type
  const MUSIC = [".mp3", ".m4a", ".flac", ".wav", ".wave"]
  return MUSIC.indexOf(path.extname(fpath)) > -1
}

const readTags = (fpath) => {
  const filters  = ["album", "artist", "title", "year", "trackNumber", "genre"]
  let tags = id3.read(fpath)
  let res = Object
    .keys(tags)
    .filter(key => filters.indexOf(key) > -1)
    .reduce((a, e) => {
      a[e] = tags[e]
      return a
    }, {})
  if(!!tags.image){
    res.image = {}
    res.image.buffer = tags.image.imageBuffer
    res.image.mime = tags.image.mime
    //res.raw = tags
  }
  res.fpath = fpath
  return res
}


const crawl = (fpath) => new Promise(async(resolve, reject) => {
  let contents = await fs.promises.readdir(fpath).catch(reject)
  let tasks = contents.map(content => new Promise(async (resolve, reject) => {
    let fullPath = path.join(fpath, content)
    let stats = await fs.promises.lstat(fullPath).catch(reject)
    if(stats.isFile()) return resolve([fullPath])
    else if(stats.isDirectory()) crawl(fullPath).then(resolve).catch(reject)
    else return resolve([])
  }))

  Promise.all(tasks)
    .then(results => results.reduce((a, e) => a.concat(...e), []))
    .then(results => results.filter(isMusic))
    .then(resolve)
    .catch(reject)
})

async function main(){
  let contents = await crawl("/home/iamfiasco/Downloads/Music/audiophile")
  //console.log(contents)
  let song = randomSample(contents)
  let tags = readTags(song)
  console.log(tags)
}

module.exports = {
  crawl,
  readTags,
  isMusic
}

//main()
