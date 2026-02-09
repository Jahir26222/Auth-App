const express = require('express')
const authRouter = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const app = express()
const path = require('path')
const compression = require("compression")
app.use(compression())
app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: "https://your-frontend-url.onrender.com",
  credentials: true
}));

app.use(express.static('./public'))




app.use('/api/auth', authRouter)

app.use('*name', (req, res)=>{
    res.sendFile(path.join(__dirname,"..","/public/index.html"))
})
module.exports = app