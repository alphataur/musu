const express = require("express")
const { SongRouter } = require("./routes")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/song", SongRouter)


app.get("*", (req, res) => {
  res.json({ error: "route not recognized", success: false})
})

app.listen(3001, () => {
  console.log("server running at 3000")
})
