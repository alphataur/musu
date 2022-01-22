<div class="h-screen flex flex-col justify-center">
  <div class="pt-1 flex flex-row justify-center">
    <img class="object-fit rounded rounded-full w-96 h-96 border-2 border-gray-800 p-1" src={_imageURL}>
  </div>
  <div class="pt-4 flex flex-row justify-center">
    <p class="text-6xl text-gray-800 text-center"> { _meta.title || "Untitled"}</p>
  </div>
  <div class="pt-1 flex flex-row justify-center">
    <p class="pt-1 text-3xl text-gray-800 text-center"> { _meta.artist || "Anonymous"}</p>
  </div>
  <div class="pt-2 flex flex-row justify-center">
    <p class="text-xl text-gray-800 text-center"> {_meta.album || "Untitled Album" } </p>
  </div>
  
</div>
<div class="flex flex-row justify-end">
  <div class="pt-10 flex flex-row justify-center float-bottom">
    <audio class="w-screen bg-gray-700 text-gray-100" controls autoplay loop>
      {#each songURL as song}
        <source src={ song } type="audio/mpeg" />
      {/each}
    </audio>
  </div>
</div>

<script>
  import { onMount } from "svelte";
  import { requestQS } from "../utils/porter.js";
  import { page } from '$app/stores'
  import { meta, imageURL } from '../states/play.js'
  //import { Howl, Howler } from '../utils/audible.js'

  let _meta = {};
  let _imageURL = "https://i.pinimg.com/736x/81/5c/c5/815cc5b6d5737102cba7a02a7ceff10d.jpg";
  let songURL = ""
  
  meta.subscribe(value => {
    _meta = value
  })

  imageURL.subscribe(value => {
    _imageURL = value
  })

  async function main(){
    const id = $page.url.searchParams.get("id")
    let results = await requestQS(`http://localhost:3001/api/meta?id=${id}`)
    //meta = results.meta
    meta.set(results.meta)
    imageURL.set(`http://localhost:3001/api/image?id=${id}`)
    songURL = [`http://localhost:3001/api/play?id=${id}`]
    //audio = new Audio(songURL)
  }
  main()
  //async function main(){
  //  let json = await requestQS("http://localhost:3001/api/meta?search=linkin")

  //}
</script>