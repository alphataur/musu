const { crawl, readTags, isMusic } = require("./tags")
const { hash, hashFile } = require("../utils")
const { fastStore } = require("./db")

module.exports = {
  crawl,
  readTags,
  isMusic,
  hash,
  hashFile,
  fastStore
}
