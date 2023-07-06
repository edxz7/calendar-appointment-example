const express = require('express');
const router = express.Router();
const Day = require('../models/Day.model');

router.post('/create', async (req, res, next) => {
    const dayHours = Array(24).fill(1).map((_, i) => i);

    for (const day of Object.keys(req.body)) {
        await Day.create({
            date: new Date(), //
            name: day,
            openTimeBlocks: req.body[day]
        });    
    }
    console.log('req.body: ', req.body);
    res.redirect('/')
})

module.exports = router;
