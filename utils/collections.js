const mongoose = require("mongoose")

class songMeta{
  static getSchema(){
    return mongoose.Schema({
      genre: String,
      album: String,
      artist: String,
      title: String,
      year: String,
      comment: String,
      image: Buffer
    })
  }
  static getModel(){
    return mongoose.model("songs", this.getSchema())
  }
  constructor(options){
    this.genre = options.genre || ""
    this.album = options.album || ""
    this.artist = options.artist || ""
    this.title = options.title || ""
    this.year = options.year || ""
    this.comment = options.comment || ""
    this.image = options.image || ""
  }
  async save(song){
    let model = this.getModel()
    let songModel = new model(song)
    //this will err
    await songModel.save()
  }
}



module.exports = {
  songMeta
}
