<div class="pt-32 h-screen">
  <div class="flex flex-row justify-center">
    <img class="object-cover w-48 h-48" src="https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png" alt="NASA LOGO">
  </div>
  <div class="flex flex-row justify-center">
    <input class="text-blue-800 font-bold font-mono text-center border-2 border-blue-700 rounded rounded-2xl w-1/4" type="text" bind:value={searchParamLocal} on:input={() => getSearchData()}>
  </div>
  <!--
  <div class="flex flex-row justify-center py-2">
    <div class="border-2 border-blue-700 rounded rounded-2xl w-32 text-center font-mono text-gray-100 font-bold bg-blue-700" type="button" placeholder="Go!" value=""> Lets Go!</div>
  </div>
  -->
  
  <!--results placeholder-->
  <div class="flex flex-row justify-center">
    <ul class="">
      {#each searchResultsLocal as result}
        <li class="overflow-hidden my-2 text-center border-2 rounded rounded-xl border-blue-800 bg-blue-700 text-gray-100"> 
          <a href="/play/{result.id}">{result.title || "Untitled" } - {result.artist || "Unknown"}</a>
        </li>
      {/each}
    </ul>
  </div>
</div>
<script>
  import { searchParam, searchResults } from '../states/search.js'
  let searchParamLocal = ""
  let searchResultsLocal = []
  
  searchResults.subscribe(value => {
    console.log(`found results ${value.length}`)
    searchResultsLocal = value
  })
  searchParam.subscribe(value => {
    searchParamLocal = value
    console.log(`search param changed to ${searchParamLocal}`)
  })
  
  function writeResults(){
    console.log("something in here")
  }
  
  async function getSearchData(){
    let url = `http://localhost:3001/api/search?search=${searchParamLocal}`
    let res = await fetch(url, {
      mode: "cors"
    })
    try{
      let json = await res.json()
      if(json.success)
        searchResults.set(json.results.slice(0, 15))
      else
        console.log("something isnt right in here")
      //writeResults()
    }
    catch(e){
      console.log(e)
    }
  }
</script>