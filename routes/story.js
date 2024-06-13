const express = require('express');
const router = express.Router()
const db = require('../config/db')

let currentMaxUserId = 0

const initializeUserId = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT MAX(id) AS maxId FROM user'
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error initializing userId:', err)
                reject(err)
            } else {
                if (results.length > 0 && results[0].maxId !== null) {
                    currentMaxUserId = results[0].maxId
                } else {
                    currentMaxUserId = 0
                }
                console.log('Initialized userId to:', currentMaxUserId)
                resolve(currentMaxUserId)
            }
        });
    });
};

router.use((req, res, next) => {
    if (!req.session.userId) {
        req.session.userId = currentMaxUserId
    }
    next()
})

initializeUserId().then(maxUserId => {
    currentMaxUserId = maxUserId
}).catch(err => {
    console.error('Failed to initialize userId on server start:', err)
})

router.post('/start', (req, res) => {
    let userId = req.session.userId || 0
    userId = ++currentMaxUserId
    req.session.userId = userId

    const query = `INSERT INTO user (id) VALUES (${userId})`
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error inserting userId:", err)
            res.status(400).send('Fail')
        } else {
            console.log("update userId:", userId)
            res.status(200).send('Success')
        }
    })
})

router.get('/story/:id', (req, res) => {
    const { id } = req.params
    let tableName
    console.log(id)
    // 각 id에 맞는 대사 출력
    if (id == 2) {
        tableName = 'handsome_subtitle'
    } else if (id == 3) {
        tableName = 'model_subtitle'
    } else if (id == 4) {
        tableName = 'bully_subtitle'
    } else if (id == 5) {
        tableName = 'nerd_subtitle'
    } else {
        return res.status(400).send('Fail')
    }

    const query = `SELECT subTitle1, subTitle2, subTitle3, subTitle4 FROM ${tableName}`
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching subtitles:", err)
            res.status(500).send(err)
        } else {
            const texts = results.map(row => [row.subTitle1, row.subTitle2, row.subTitle3, row.subTitle4]).flat()
            res.json(texts)
        }
    })
})

module.exports = router
