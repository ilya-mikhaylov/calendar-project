const express = require('express');
// const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const Event = require('../models/event');

const saltRounds = 10;

// router.get('/events', async function(req, res, next) {
//     req.session.user = user;
//     const userEvents = await Event.find({user: req.session.id}); /// Что мы получаем из кук? TODO: Отфильтровать по месяцу, категориям,
//     res.render('events', {calendar: 'calendar', events: await userEvents}); /// TODO: Обновить календарь
// });

router.get('/events', async function(req, res, next) {
    try {

        let dateTomorrow = new Date();
        let aaa = new Date();
        let dateNow = new Date();
        let date = new Date();
        date.setDate(date.getDate() - 1);
        dateTomorrow.setDate(date.getDate() + 1);
        aaa.setDate(date.getDate() + 5);
        const eve = await Event.find({ firstDate: { $gte: date, $lte: dateTomorrow } })
        // const events = await Event.find({ firstDate: { $gte: '2019-12-01', $lte: '2019-12-20' } })
         console.log(eve)
// ToDo: найти пользователей по статьям
        const users = await User.find()









        const events = await Event.find({user: req.session.user._id}); /// Что мы получаем из кук? TODO: Отфильтровать по месяцу, категориям,
        // await console.log(events);
        res.render('events', {events}); /// TODO: Обновить календарь
    } catch(e) {
        console.log(e)
    }
});

router.get('/events/new', async function(req, res, next) {
    try {
        res.render('redactor');
    } catch(e) {
        console.log(e);
    }
});

router.post('/events', async function(req, res, next) {
    if (req.session.user) {
        const newEntry = new Entry({
            user: req.session.user,
            activity: req.body.activity,
            firstDate: req.body.firstDate,
            period: req.body.period,
            notifyBefore: req.body.notifyBefore,
            specialist: req.body.specialist,
            cost: req.body.cost,
        });
        await newEntry.save();
        res.redirect(`/events`);
    } else {
        res.render('error', {message: 'Unauthorized operation'})
    }
});

router.get('/events:id', function(req, res, next) {
    res.render('event');
});

router.put('/events:id', async function(req, res, next) {
    if (req.session.user) {
        const entry = await Event.findById(req.params.id);
        entry.user = req.session.user;
        entry.activity = req.body.activity;
        entry.firstDate = req.body.firstDate;
        entry.period = req.body.period;
        entry.notifyBefore = req.body.notifyBefore;
        entry.specialist = req.body.specialist;
        entry.cost = req.body.cost;
        await entry.save();
        res.redirect(`/events`);
    } else {
        res.render('error', {message: 'Unauthorized operation'})
    }
});

router.delete('/events:id/delete', async function(req, res, next) {
if (req.session.user) {
    await Entry.deleteOne({'_id': req.params.id});
    res.redirect('/events');
    } else {
    res.render('error', {message: 'Unauthorized operation'})
    }
});

module.exports = router;