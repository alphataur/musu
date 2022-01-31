import { Howl } from "howler"

class Song{
  constructor(songURL, id){
    if(songURL === undefined) throw new Error("parameter songURL required")
    if(id === undefined) throw new Error("songID parameter required")
    this.id = id
    this.songURL = songURL
    this.audio = new Howl({
      src: [this.songURL],
      volume: 1.0,
      preload: true,
      autoplay: true,
      html5: true
    })
    this.duration = this.audio.duration
    this.offset = 0
    this.playing = false
  }
  playHandle(){
    if(this.promise === undefined){
      this.promise = new Promise((resolve, reject) => {
        this.timer = setInterval(async () => {
          //audio playback
          this.duration = this.audio._duration
          this.offset = this.audio.seek()
          if(this.end){
            let res = await fetch(`http://localhost:3001/api/playlist/next?id=${this.id}`, { mode: "cors"})
            let json = await res.json()
            if(json.successify()){
              return resolve(json.id)
            }
            else{
              return reject(false)
            }
            this.playing = false
          }
          else if(this.playing && this.offset === 0){
            console.log("song ended")
            this.end = true
          }
        }, 3000)
      })
      return this.promise
    }
    else{
      return this.promise
    }
  }
  seek(offset){
    //apply with -5 to reverse
    if(offset === undefined) offset = 5
    this.audio.seek(this.audio.seek()+offset, this.audioID)
  }
  play(){
    this.playing = true
    this.audioID = this.audio.play()
    return this.playHandle()
  }
  pause(){
    if(this.playing)
      this.audio.pause()
    else
      console.log("audio not playing")
  }
  togglePlay(){
    if(this.playing) this.pause()
    else this.play()
  }
}

export { Song as default }
