const express = require('express')
const router = express.Router()
const db = require('../config/db')

router.use(express.json())

router.post('/:roundIdx', (req, res) => {
    const roundIdx = parseInt(req.params.roundIdx)
    const { counter } = req.body
    const userId = 1

    console.log(roundIdx)

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

    console.log(score)
    const query = `UPDATE user SET ${score} = ${counter} WHERE id = ${userId}`

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error updating scores:', err)
            res.status(500).json({ error: 'Error updating scores' })
        } else {
            res.status(200).json({ message: 'Score updated successfully' })
        }
    })
})

module.exports = router