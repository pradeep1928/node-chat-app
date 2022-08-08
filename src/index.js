const express = require('express')
const path = require('path')
const http = require('http');

const app = express()
const server = http.createServer(app)

const port = process.env.PORT || 3000 

app.use(express.json())

const publicDirPath = path.join(__dirname, '../public')
app.use(express.static(publicDirPath));


server.listen(port, () => {
    console.log(`server is running on port ${port}`)
})