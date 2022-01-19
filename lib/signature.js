const crypto = require("crypto")
const fs = require("fs")

exports.hash = function(something){
  let hasher = crypto.createHash("sha256")
  hasher.update(something)
  return hasher.digest("hex")
}

exports.hashFile = (fpath) => new Promise(async (resolve, reject) => {
  let rstream = fs.createReadStream(fpath)
  let hasher = crypto.createHash("sha256")
  rstream.on("end", () => resolve(hasher.digest("hex")))
  rstream.on("error", (err) => reject(err))
  rstream.pipe(hasher)
})