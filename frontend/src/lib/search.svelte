<div class="h-screen">
  <div class="flex flex-row justify-center">
    <img class="object-cover w-48 h-48" src="https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png" alt="NASA LOGO">
  </div>
  <div class="flex flex-row justify-center">
    <input class="text-blue-800 font-bold font-mono text-center border-2 border-blue-700 rounded rounded-2xl w-1/4" type="text" bind:value={searchParam} on:input={() => getSearchData()}>
  </div>
  <div class="flex flex-row justify-center py-2">
    <div class="border-2 border-blue-700 rounded rounded-2xl w-32 text-center font-mono text-gray-100 font-bold bg-blue-700" type="button" placeholder="Go!" value=""> Lets Go!</div>
  </div>
  <!--results placeholder-->
  <flex class="flex-col justify-center py-2">
    <ul>
      {#each results as result}
        <li> {result.slug} </li>
      {/each}
    </ul>
  </flex>
</div>
<script>
  let searchParam = "rock"
  let results = [{slug: "old"}]
  function writeResults(){
    console.log(results.results)
  }
  async function getSearchData(){
    let url = `http://localhost:3001/api/find?search=${searchParam}`
    let res = await fetch(url, {
      mode: "cors"
    })
    try{
      let json = await res.json()
      if(results.success)
        results = json.result
      else
        console.log("something isnt right in here")
      writeResults()
    }
    catch(e){
      console.log(e)
    }
  }
</script>