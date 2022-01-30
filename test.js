require("dotenv").config({ path: "../confs/musu-dev2022/.env" })

const { fastLookup } = require("./lib/db")

async function redisInterfaceCheck(){
  let handle = new fastLookup()
  await handle.connect()
  let results = await handle.findPattern("*rock*").catch(console.error)
  console.log(results)
  handle.disconnect()
}

async function main(){
  console.log("checking redis connection")
  await redisInterfaceCheck().catch((e) => {
    console.log(`redis connection failed due to ${e}`)
  })
}


