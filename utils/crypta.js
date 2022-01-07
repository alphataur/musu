const crypto = require("crypto")
const fs = require("fs")
const { resolve } = require("path")

exports.hashFile = function(fpath){
  return new Promise((resolve, reject) => {
    if(!fs.existsSync(fpath)) return false
    let hasher = crypto.createHash("md5")
    let stream = fs.createReadStream(fpath)
    stream.on("end", () => {
      return resolve(hasher.digest("hex"))
    })
    stream.on("error", (err) => {
      return reject(err)
    })
    stream.pipe(hasher)
  })
}
