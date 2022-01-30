const redis = require("redis")

async function main(){
  let client = redis.createClient({database: 3})
  await client.connect()
  let songs = client.sMembers("all")
  client.quit()
  return songs
}

main().then(console.log)
