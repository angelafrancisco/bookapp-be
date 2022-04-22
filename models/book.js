const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String },
    author: { type: String },
    image: { type: String },
    description: { type: String },
    read: { 
        type: String,
        enum: [
            "Read",
            "Want to Read",
            "Currently Reading"
        ]
    },
    listName: { type: String }
}, { timestamps: true })

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;