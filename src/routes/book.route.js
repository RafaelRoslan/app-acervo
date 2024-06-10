//IMPORTS
import express from "express";
import controller from "../controllers/book.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import { validateBookId, validateId, validateUser } from "../middlewares/global.middleware.js";

const route = express.Router();

route.post("/:collectionId/books/", authenticate, controller.createBook);
route.get("/:collectionId/books/", authenticate, controller.getAllBooks);
route.get("/:collectionId/books/:bookId", authenticate,validateId, validateUser, validateBookId, controller.readBook);
route.patch("/:collectionId/books/:bookId", authenticate, validateId, validateUser, validateBookId, controller.updateBook);
route.delete("/:collectionId/books/:bookId", authenticate, validateId, validateUser, validateBookId, controller.deleteBook);

export default route;