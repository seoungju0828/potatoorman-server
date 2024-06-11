const express = require('express')
const router = express.Router()
const db = require('../config/db')

router.use(express.json())

router.post('/:roundIdx', (req, res) => {
    const roundIdx = parseInt(req.params.roundIdx)
    const { counter } = req.body
    const userId = 1

    // console.log(roundIdx)

    let score = '';
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

    // console.log(score)
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

                const sum = results[0].sum / 3

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
    const userId = 1
    const query = `select firstScore, secondScore, thirdScore, finalScore from user where id = ${userId}`

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving scores:', err)
            res.status(500).json({ error: 'Error retrieving scores' })
        } else {
            if (results.length > 0) {
                const scores = {
                    firstScore: results[0].firstScore,
                    secondScore: results[0].secondScore,
                    thirdScore: results[0].thirdScore,
                    finalScore: results[0].finalScore
                }
                res.status(200).json(scores)

                let changeQuery = ''
                if (scores.finalScore >= 64) changeQuery = `update user set changeOX='O' where id=${userId}`
                else changeQuery = `update user set changeOX='X' where id=${userId}`

                db.query(changeQuery, (err, updateResults) => {
                    if (err) {
                        console.error('Error updating finalScore:', err)
                        return res.status(500).json({ error: 'Error updating finalScore' })
                    }
                })
            } else {
                res.status(404).json({ error: 'Scores not found' })
            }
        }
    })

})

router.get('/change', (req, res) => {
    const userId = 1
    const query = `select changeOX from user where id=${userId}`

    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: 'Error' })
        const changeOX = result[0].changeOX
        res.status(200).json({ changeOX })
    })
})

module.exports = router