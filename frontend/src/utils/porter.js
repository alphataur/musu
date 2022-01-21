async function requestQS(url){
  let json = {}
  try{
    let res = await fetch(url, {
      mode: "cors"
    })
    json = await res.json()
  }
  catch(e){
    console.log("something isnt right in here")
  }
  return json
}

export { requestQS }