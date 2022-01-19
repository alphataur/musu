const { crawl, readTags, isMusic } = require("./lib/tags")
const { hash, hashFile } = require("./utils/signature")

module.exports = {
  crawl,
  readTags,
  isMusic,
  hash,
  hashFile
}