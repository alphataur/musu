const { Connection } = require("./utils")

async function patchRedis(){
  let toHash = new Connection(undefined, undefined, 1)
  let toID = new Connection(undefined, undefined, 3)
  await toHash.connection.connect()
  await toID.connection.connect()
  try{
    //let ids = await toHash.getAll()
    let ids = await toHash.connection.keys("*")
    let hashes = []
    for(let id of ids){
      if(id==="visited") continue
      let result = await toHash.connection.get(id)
      let n = result.length
      result = result.slice(1, n-1)
      await toID.connection.set(result, id)
    }
  }
  catch(e){
    console.log("something is broken", e)
  }
  await toID.connection.quit()
  await toHash.connection.quit()
}

patchRedis()
