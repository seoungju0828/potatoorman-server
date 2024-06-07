const express = require('express')
const router = express.Router()
const db = require('../config/db')

const tableMap = {
    2: 'handsome_subtitle',
    3: 'model_subtitle',
    4: 'bully_subtitle',
    5: 'nerd_subtitle'
}

router.get('/story/:id', (req, res) => {
    const { id } = req.params
    const tableName = tableMap[id]

    if (!tableName) {
        return res.status(400).send('Fail')
    }

    const query = `SELECT subTitle1, subTitle2, subTitle3, subTitle4 FROM ${tableName}`
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err)
        } else {
            const texts = []
            results.forEach(row => {
                texts.push(row.subTitle1, row.subTitle2, row.subTitle3, row.subTitle4)
            })
            res.json(texts)
        }
    })
})

module.exports = router