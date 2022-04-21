const express = require('express');
require("dotenv").config();
const router = express.Router();
const User = require('../models/user');
const Book = require('../models/book')
const bcrypt = require("bcryptjs");
const isLoggedIn = require('../middleware/isLoggedIn')

// CREATE : POST   '/user'          1/4
// READ   : GET    '/user'          2/4 (INDEX)
// UPDATE : PUT    '/user/:id'      3/4
// DELETE : DELETE '/user/:id'      4/4


// CREATE : POST   '/user'          1/4
router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        console.log(hashedPassword)
        req.body.password = hashedPassword
        const newUser = await User.create(req.body);
        res.send({
            success: true,
            data: newUser
        });
    } catch (err) {
        res.send({
            success: false,
            data: err.message
        });
    }
});

// READ  : GET    '/user'          2/4 (INDEX)
router.get('/', async (req, res) => {
    try {
        // const currentUser = req.session.isLoggedIn
        const user = await User.find();
        res.send({
            success: true,
            data: user
        });
    } catch (err) {
        res.send({
            success: false,
            data: err.message
        });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const possibleUser = await User.findOne({ username: req.body.username });
        console.log(possibleUser);
        if (possibleUser) {
            if (bcrypt.compareSync(req.body.password, possibleUser.password)) {
                console.log('logged in');
                req.session.isLoggedIn = true;
                req.session.userId = possibleUser._id;
                console.log(req.session.userId);
                console.log(possibleUser._id);
                res.send({
                    success: true,
                    data: possibleUser
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.send({
            success: false,
            data: err.message
        });
    }
});
// LOGOUT
// router.get('/logout', (req, res) => {
//     req.session.destroy(() => {
//         res.redirect("/")
//     })
// })

// EDIT
router.get('/:id', async (req, res) => {
    try {
        if (req.session.userId == req.params.id) {
            const user = await User.findById(req.params.id)
            res.send({
                success: true,
                data: user
            });
        }
    } catch (err) {
        res.send({
            success: false,
            data: err.message
        });
    }
});
// UPDATE : PUT    '/user/:id'      3/4
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send({
            success: true,
            data: user
        });
    } catch (err) {
        res.send({
            success: false,
            data: err.message
        });
    }
});

// DELETE : DELETE '/user/:id'      4/4
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            throw new Error("No user by that id here!")
        }
        res.send({
            success: true,
            data: user
        });
    } catch (err) {
        res.send({
            success: false,
            data: err.message
        });
    }
});



module.exports = router;