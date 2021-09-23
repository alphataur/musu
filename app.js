const fastify = require("fastify")
const app = fastify({ logger: true })
const routes = require("./routes")
const defaults = require("./utils/defaults")

routes.forEach( route => app.route(route) )


app.get("/ping", (req, res) => {
  return { ...defaults.SUCCESS, message: "pong" }
})


let start = async (port) => {
  try{
    await app.listen(port)
  }
  catch(e){
    fastify.log.error(e)
    process.exit(1)
  }
}

start(3002)
