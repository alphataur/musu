const { Connection } = require("./utils")

async function main(){
  let handle = new Connection(undefined, undefined, 1)
  let h2 = new Connection(undefined, undefined, 2)
  let h3 = new Connection(undefined, undefined, 3)
  await handle.connection.connect()
  await h2.connection.connect()
  await h3.connection.connect()
  let keys = await handle.getAll()
  console.log("nikhil surya mukhi", await h3.getOne("98d43efbed04783fc080344f257261e0"))
  console.log(await handle.getOne(keys[12]))
  console.log(await h2.getOne(keys[12]))
  await handle.connection.quit()
  await h2.connection.quit()
  await h3.connection.quit()
}

main()
