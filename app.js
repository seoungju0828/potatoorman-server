const express = require('express')
const app = express()
const path = require('path')

const storyRoute = require('./routes/story')
// const gaugeInfoRoute = require('./routes/story')
// const pictureRoute = require('./routes/story')

app.use(express.static(path.join(__dirname, 'frontend/build')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'))
})

app.use('/storyApi', storyRoute)    // 스토리 대사
// app.use('/gaugeInfoApi', gaugeInfoRoute) // 게이지 정보 저장 및 결과창으로 정보 전달
// app.use('/pictureApi', pictureRoute) // 갤러리 사진 저장 + 이메일 전송

app.listen(8080, function () {
    console.log('success!')
})