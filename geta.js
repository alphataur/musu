const { fastLookup } = require("./lib/db")

async function main(){
  let handle = new fastLookup()
  await handle.connect()
  let results = await handle.findPattern("*rock*").catch(console.error)
  console.log(results)
  handle.disconnect()
}

main()
