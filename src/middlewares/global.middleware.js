import mongoose from "mongoose";
import service from "../services/user.service.js";

function validateId(req, res, next) {
    const id  = req.userId;

    if(id && !mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({menssagem: "ID invalido"});
    }

    return next();
}

function validateCollectionId(req, res, next) {
    const { collectionId } = req.params;

    if (collectionId && !mongoose.Types.ObjectId.isValid(collectionId)) {
        return res.status(400).send({ message: "ID de coleção inválido" });
    }

    return next();
}
function validateBookId(req, res, next) {
    const  bookId  = req.bookId;

    if (bookId && !mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).send({ message: "ID de livro inválido" });
    }

    return next();
}

async function validateUser(req,res, next) {
    const id    = req.userId;
    const user  = await service.getUser(id);

    if(!user){
        return res.status(400).send({menssagem: "Usuario não encontrado 1"});
    }

    req.id = id;
    req.user = user;

    return next();
}

export {
    validateBookId, validateCollectionId, validateId, validateUser
};

