async function requestQS(url){
  //DO WE NEED THIS?
  let json = {}
  try{
    console.log("fetching url", url)
    let res = await fetch(url, {
      mode: "cors"
    })
    json = await res.json()
  }
  catch(e){
    console.log("something isnt right in here", e)
  }
  return json
}

export { requestQS }