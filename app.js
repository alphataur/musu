const express = require("express")
const { SongRouter } = require("./routes")

const app = express()
app.use(express.json())
app.use("/song", SongRouter)


app.get("*", (req, res) => {
  res.json({ error: "route not recognized", success: false})
})

app.listen(3000, () => {
  console.log("server running at 3000")
})
