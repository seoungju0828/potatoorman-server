const express = require('express')
const router = express.Router()
const db = require('../config/db')

router.use(express.json())

router.use((req, res, next) => {
    next()
})

router.use((req, res, next) => {
    if (!req.session.userId) {
        req.session.userId = 0
    }
    next()
})

router.post('/:roundIdx', (req, res) => {
    let userId = req.session.userId || 0
    const roundIdx = parseInt(req.params.roundIdx)
    const { counter } = req.body

    let score = ''
    switch (roundIdx) {
        case 1:
            score = 'firstScore'
            break
        case 2:
            score = 'secondScore'
            break
        case 3:
            score = 'thirdScore'
            break
        default:
            score = roundIdx
            break
    }

    const query = `UPDATE user SET ${score} = ${counter} WHERE id = ${userId}`

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error updating scores:', err)
            res.status(500).json({ error: 'Error updating scores' })
        } else {
            const getSumQuery = `select firstScore + secondScore + thirdScore as sum from user where id = ${userId}`
            db.query(getSumQuery, (err, results) => {
                if (err) {
                    console.error('Error fetching sum:', err)
                    return res.status(500).json({ error: 'Error fetching sum' })
                }

                let sum = results[0].sum / 3

                const finalScoreQuery = `update user set finalScore = ${sum} where id = ${userId}`
                db.query(finalScoreQuery, (err, result) => {
                    if (err) {
                        console.error('Error updating finalScore:', err)
                        return res.status(500).json({ error: 'Error updating finalScore' })
                    }

                    res.status(200).json({ message: 'Scores and finalScore updated successfully' })
                })
            })
        }
    })
})

router.get('/result', (req, res) => {
    let userId = req.session.userId || 0
    const query = `select firstScore, secondScore, thirdScore, finalScore from user where id = ${userId}`

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving scores:', err)
            res.status(500).json({ error: 'Error retrieving scores' })
        } else {
            if (results.length > 0) {
                const scores = {
                    firstScore: results[0].firstScore || 0,
                    secondScore: results[0].secondScore || 0,
                    thirdScore: results[0].thirdScore || 0,
                    finalScore: results[0].finalScore || 0
                }
                res.status(200).json(scores)
            } else {
                res.status(404).json({ error: 'Scores not found' })
            }
        }
    })

})

router.get('/change', (req, res) => {
    let userId = req.session.userId || 0
    const finalScoreQuery = `SELECT finalScore FROM user WHERE id = ${userId}`

    db.query(finalScoreQuery, (err, results) => {
        if (err) {
            console.error('Error retrieving finalScore:', err)
            return res.status(500).json({ error: 'Error retrieving finalScore' })
        }

        if (results.length > 0) {
            const finalScore = results[0].finalScore || 0

            let changeOX = finalScore >= 64 ? 'O' : 'X'

            const updateQuery = `UPDATE user SET changeOX='${changeOX}' WHERE id=${userId}`
            db.query(updateQuery, (err, updateResults) => {
                if (err) {
                    console.error('Error updating changeOX:', err)
                    return res.status(500).json({ error: 'Error updating changeOX' })
                }

                console.log('Updated changeOX:', changeOX)

                const getChangeOXQuery = `SELECT changeOX FROM user WHERE id=${userId}`
                db.query(getChangeOXQuery, (err, result) => {
                    if (err) {
                        console.error('Error fetching changeOX:', err)
                        return res.status(500).json({ error: 'Error fetching changeOX' })
                    }

                    if (result.length > 0) {
                        let fetchedChangeOX = result[0].changeOX
                        console.log('Fetched changeOX:', fetchedChangeOX)
                        res.status(200).json({ changeOX: fetchedChangeOX })
                    } else {
                        res.status(404).json({ error: 'changeOX not found' })
                    }
                })
            })
        } else {
            res.status(404).json({ error: 'Final score not found' })
        }
    })
})

module.exports = router