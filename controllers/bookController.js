const express = require('express');
const router = express.Router();
const Book = require('../models/book')

// CREATE : POST   '/books'          1/4
// READ   : GET    '/books'          2/4 (INDEX)
// UPDATE : PUT    '/books/:id'      3/4
// DELETE : DELETE '/books/:id'      4/4

// READ   : GET    '/books'          2/4 (INDEX)
router.get('/', (req, res) => {
    try {
        const books = await Book.find();
        res.send({
            success: true,
            data: books
        });
    }catch(err){
        res.send({
            success: false,
            data: err.message
        });
    }
});

// CREATE : POST   '/books'          1/4
router.post('/', async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        console.log(newBook)
        // console.log(req.session.user._id)
        res.send({
            success: true,
            data: newBook
        });
    } catch (err) {
        res.send({
            success: false,
            data: err.message
        });
    }
});

// UPDATE : PUT    '/books/:id'      3/4
router.put('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send({
            success: true,
            data: book
        });
    } catch (err) {
        res.send({
            success: false,
            data: err.message
        });
    }
});

// DELETE : DELETE '/books/:id'      4/4
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            throw new Error('Oops, no book with that ID here!');
        }
        res.send({
            success: true,
            data: book
        });
    } catch (err) {
        res.send({
            success: false,
            data: err.message
        });
    }
});

module.exports = router;