const mongoose = require("mongoose")


class mongoCore{
  constructor(){
    mongoose.connect('mongodb://localhost:27017/musu', {useNewUrlParser: true})
    this.schema = new mongoose.Schema({
      genre: String,
      album: String,
      artist: String,
      title: String,
      year: String,
      image: Buffer

    })
    this.model = mongoose.model("songs", this.schema)
  }
}
class songMeta{
  constructor(options, core){
    this.genre = options.genre || ""
    this.album = options.album || ""
    this.artist = options.artist || ""
    this.title = options.title || ""
    this.year = options.year || ""
    //this.comment = options.comment || ""
    this.image = options.image || ""
    this.core = core
  }
  pack(){
    return {
      genre: this.genre,
      album: this.album,
      artist: this.artist,
      title: this.title,
      year: this.year,
      image: this.image
    }
  }
  async save(){
    let data = this.pack()
    try{
      let songModel = new this.core.model(data)
      await songModel.save()
    }
    catch(e){
      console.log(e)
    }
  }
}



module.exports = {
  songMeta,
  mongoCore
}
