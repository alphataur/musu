<svelte:head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.1.2/howler.min.js"></script>
</svelte:head>
<svelte:window on:keydown="{handleStrokes}"></svelte:window>
<div class="h-screen flex flex-col justify-center">
  <div class="pt-1 flex flex-row justify-center">
    <img class="object-fit rounded rounded-full w-96 h-96 border-2 border-gray-800 p-1" src={_imageURL} on:click="{togglePlay}">
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
  import { onMount, onDestroy } from "svelte";
  import { page } from '$app/stores'
  import { goto } from '$app/navigation';
  

  import { meta, imageURL, percentage } from '../../states/play.js'
  
  //song definition

  import { Howl, Howler } from "howler"
  let perc;
  let cursor = 0;
  let audio;
  let _meta = {};
  let _imageURL = "https://i.pinimg.com/736x/81/5c/c5/815cc5b6d5737102cba7a02a7ceff10d.jpg";
  let songURL = ""
  let globalAct = false
  let end = false
  

  meta.subscribe(value => {
    _meta = value
  })

  imageURL.subscribe(value => {
    console.log(`imageURL is set to ${value}`)
    _imageURL = value
  })
  percentage.subscribe(value => {
    perc = value
  })

  class Song{
    constructor(songURL, id){
      console.log("constructor called")
      if(songURL === undefined) throw new Error("parameter songURL required")
      if(id === undefined) throw new Error("songID parameter required")
      this.id = id
      this.songURL = songURL
      this.audio = new Howl({
        src: [this.songURL],
        volume: 1.0,
        preload: true,
        //autoplay: true,
        html5: true
      })
      this.duration = this.audio.duration
      this.offset = 0
      this.playing = false
    }
    looper(){
      let ticks = 0
      return new Promise((resolve, reject) => {
        this.interval = setInterval(async () => {
          this.duration = this.audio._duration
          this.offset = this.audio.seek()
          perc = (this.offset/this.duration) * 100
          if(this.audio.playing()){
            ticks++
          }
          if(ticks > this.duration){
            console.log("ending looper")
            clearInterval(this.interval)
            return resolve(await this.getNext())
          }
        }, 1000)
      })
    }
    seek(offset){
      //apply with -5 to reverse
      if(offset === undefined) offset = 5
      let to = this.audio.seek() + offset
      console.log(to, this.duration)
      if(to > 0 && to < this.audio.seek())
        this.audio.seek(to, this.audioID)
    }
    async play(){
      this.audioID = this.audio.play()
      this.playing = true
      return await this.looper()
    }
    async getNext(){
      let res = await fetch(`http://localhost:3001/api/playlist/next?id=${this.id}&pname=all`, { mode: "cors" })
      let json = await res.json()
      return json.id
    }
    pause(){
      if(this.playing)
        this.audio.pause()
      else
        console.log("audio not playing")
    }
    togglePlay(){
      if(this.audio.playing()) this.pause()
      else this.play()
    }
    audioDelta(delta){
      this.audio.volume(this.audio.volume() + delta)
    }
    stop(){
      console.log("CANT TOUCH THIS")
      if(!!this.audio){
        this.audio.pause()
        this.audio.unload()
      }
      else{
        console.log("cannot stop the audio")
      }
    }
  }



  async function checkImage(url){
    //FIXME: please use alternative logic
    let res = await fetch(url, { mode: "cors" })
    try{
      await res.json()
      console.log("the image is not present")
      return false
    }
  catch(e){
    console.log(e)
      console.log("image is fine")
      return true
    }
  }
  function timeout(to){
    if(to === undefined) to = 1000
    return new Promise((resolve, reject) => {
      setTimeout(resolve, to)
    })
  }
  async function main(){
    const id = $page.params.id
    const url = `http://localhost:3001/api/meta?id=${id}`
    let res = await fetch(url, { mode: "cors" })
    let results = await res.json()
    //meta = results.meta
    meta.set(results.meta)
    let iURL = `http://localhost:3001/api/image?id=${id}`
    if(!!checkImage(iURL)){
      imageURL.set(iURL)
    }
    else{
      console.log("setting default")
      imageURL.set("https://w7.pngwing.com/pngs/503/857/png-transparent-computer-icons-headset-music-icon-text-logo-music-icon.png")
    }


    songURL = [`http://localhost:3001/api/play?id=${id}`]
    if(audio === undefined && !globalAct){
      audio = new Song(songURL, id)
      globalAct = true
      await timeout(2000)
      let next = await audio.play()
      if(!!next){
        audio.stop()
        console.log(`playing next ${next}`)
        goto(`http://localhost:3000/play/${next}`)
      }
      else
        console.log("failed to extract next file")
    }
    else{
      console.log("audio is already playing")
    }

    //audio = new Howl({
    //  src: [songURL],
    //  volume: 1.0,
    //  preload: true,
    //  autoplay: true,
    //  html5: true
    //})
    //let end = true
    //let isPlaying = true
    //let timer = setInterval(async () => {
    //  let duration = audio._duration
    //  let currentTime = audio.seek()
    //  
    //  if(!end){
    //    clearInterval(timer)
    //    let res = await fetch("http://localhost:3001/api/playlist/next?id=${$page.params.id}", { mode: "cors"})
    //    let json = await res.json()
    //    if(json.success){
    //      goto("/play/" + json.id)
    //    }
    //    else{
    //     goto("/play") 
    //    }
    //  }
    //  perc = Math.floor((currentTime/duration)*100)
    //  if(isPlaying !== audio.playing()){
    //    end = true
    //    //for end
    //    console.log("song ended")
    //  }
    //}, 10000)
    //cursor = audio._duration
  }
  function togglePlay(){
    audio.togglePlay()
  }
  function seekFuture(){
    audio.seek(5)
  }
  function seekPast(){
    audio.seek(-5)
  }
  function audioUp(){
    audio.audioDelta(0.1)
  }
  function audioDown(){
    audio.audioDelta(-0.1)
  }
  function audioStop(){
    audio.stop()
  }
  async function audioNext(){
    let next = await audio.getNext()
    if(!!next) {
      audio.stop()
      goto(`http://localhost:3000/play/${next}`, { replaceState: true })
    }
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
        console.log("play requested")
        togglePlay()
        break;
      case "ArrowUp":
        audioUp()
        //this.audio.volume(audio.volume() + 0.1)
        break
      case "ArrowDown":
        audioDown()
        //audio.volume(audio.volume() - 0.1)
        break
      case "S":
        console.log("stopping song")
        audioStop()
        break
      case "N":
        audioNext()
      default:
        console.log("unsupported keystroke", key)
        break
    }
  }

  onMount(async () => {
    console.log("mount called")
    if(audio === undefined) console.log("audio is undefined")
    await main()
  })
  //onDestroy(() => {
  //  audio.stop()
  //})
  //onMount(async () => {
  //  await main()
  //})
  //main()
  //async function main(){
  //  let json = await requestQS("http://localhost:3001/api/meta?search=linkin")

  //}
</script>
