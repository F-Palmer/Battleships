const express = require("express")
const app = express()

app.use(express.static("public"))

app.get('/', (req, res) => {
    loggging()
})

function loggging(){
    console.log("funktionenn funktionieren")
}
app.listen(8000)