const core = require("./controllers/core.js")

//  {
//    method: "POST",
//    url: "/explore",
//    handler: core.explore
//  },

module.exports = [
  {
    method: "POST",
    url: "/explore",
    handler: core.explore
  },
  {
    method: "POST",
    url: "/meta",
    handler: core.meta
  },
  {
    method: "POST",
    url: "/play",
    handler: core.play
  },
  {
    method: "POST",
    url: "/webplay",
    handler: core.webplay
  }
]
