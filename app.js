const express = require('express')
const path = require('path')
const session = require('express-session')
const sessionConfig = require('./config/session')
const cors = require('cors')
const db = require('./config/db')

const crypto = require('crypto')
const randomBytes = crypto.randomBytes(32)
const sessionSecret = randomBytes.toString('hex')

const storyRoute = require('./routes/story')
const gaugeInfoRoute = require('./routes/gaugeInfo')
// const pictureRoute = require('./routes/picture')

const app = express()
app.use(session(sessionConfig));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'frontend/build')))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'))
})

app.use('/storyApi', storyRoute)    // 스토리 대사
app.use('/gaugeInfoApi', gaugeInfoRoute) // 게이지 정보 저장 및 결과창으로 정보 전달
// app.use('/pictureApi', pictureRoute) // 갤러리 사진 저장 + 이메일 전송

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))


const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

module.exports = app