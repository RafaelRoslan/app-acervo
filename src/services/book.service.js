import Book from "../models/Book.js";

function createBook(body) {
    return Book.create(body);
}

function getBook(bookId, collectionId) {
    return Book.findOne({ _id: bookId, collectionId: collectionId});
}

function getAllBooks(collectionId) {
    return Book.find({ collectionId: collectionId });
}

function updateBook(bookId, title, author, description, isbn, image) {
    return Book.findOneAndUpdate({_id: bookId},{title, author, description, isbn, image});
}

function deleteBook(bookId) {
    return Book.findByIdAndDelete({_id: bookId});
}

export default {
    createBook,
    getBook,
    getAllBooks,
    updateBook,
    deleteBook
}