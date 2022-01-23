<svelte:head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.2/howler.min.js"></script>
</svelte:head>
<svelte:window on:keydown="{handleStrokes}"></svelte:window>
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
  <div class="pt-10 flex flex-row justify-center">
    <div class="w-screen h-8 w-full bg-gray-800">
      <div class="bg-gray-700 h-8" style="width: {perc}%"></div>
    </div>
    <!--
    <audio class="w-screen bg-gray-700 text-gray-100" controls autoplay loop>
      {#each songURL as song}
        <source src={ song } type="audio/mpeg" />
      {/each}
    </audio>
  -->
  </div>
</div>

<script>
  import { onMount } from "svelte";
  //import { requestQS } from "../../utils/requestQS.js";
  //../../utils/porter.js";
  import { page } from '$app/stores'
  import { meta, imageURL } from '../../states/play.js'
  import { Howl, Howler } from 'howler';
  let cursor = 0;

  let _meta = {};
  let _imageURL = "https://i.pinimg.com/736x/81/5c/c5/815cc5b6d5737102cba7a02a7ceff10d.jpg";
  let songURL = ""
  let audio;
  let audioID;  
  let perc = 0;
  let timer = setInterval(() => {
    //if(audio.playing()){
    //  clearInterval(timer)
    //}
    let duration = audio._duration
    let currentTime = audio.seek()
    perc = Math.floor((currentTime/duration)*100)
    if(perc === 100) clearInterval(timer)
    console.log(perc)
  }, 1000)
  meta.subscribe(value => {
    _meta = value
  })

  imageURL.subscribe(value => {
    _imageURL = value
  })
  
  async function main(){
    const id = $page.params.id
    const url = `http://localhost:3001/api/meta?id=${id}`
    let res = await fetch(url, { mode: "cors" })
    let results = await res.json()
    
    //meta = results.meta
    meta.set(results.meta)
    imageURL.set(`http://localhost:3001/api/image?id=${id}`)
    songURL = [`http://localhost:3001/api/play?id=${id}`]
    audio = new Howl({
      src: [songURL],
      volume: 1.0,
      preload: true,
      autoplay: true,
      html5: true
    })
    cursor = audio._duration
  }
  function togglePlay(){
    if(audio.playing()){
      console.log("audio already playing")
      audio.pause()
      audioID = undefined
    }
    else{
      console.log("audio sets go up!")
      audioID = audio.play()
    }
  }
  function seekFuture(){
    //console.log(audio.seek()+5)
    //audio.pause()
    
    let now = audio.seek()
    let to = audio.seek()+5
    console.log(audioID, to)
    audio.seek(to, audioID)
    //audio.play()
  }
  function seekPast(){
    //console.log(audio.seek()-5)
    //audio.pause()
    console.log(audioID) 
    let now = audio.seek()
    let to = now - 5
    if(to > 0){
      audio.seek(to, audioID)
      console.log(audioID, to)
    }
    //let to = audio.seek()-5
    //audio.seek(audioID, to)
    //audio.play()
  }
  function handleStrokes(event){
    let key = event.key
    switch(key){
      case "ArrowRight":
        seekFuture()
        break;
      case "ArrowLeft":
        seekPast()
        break;
      case " ":
        togglePlay()
        break;
      case "ArrowUp":
        audio.volume(audio.volume() + 0.1)
        break
      case "ArrowDown":
        audio.volume(audio.volume() - 0.1)
        break
      default:
        console.log("unsupported keystroke", key)
        break
    }
  }
  main()
  //async function main(){
  //  let json = await requestQS("http://localhost:3001/api/meta?search=linkin")

  //}
</script>