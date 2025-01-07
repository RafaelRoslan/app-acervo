import mongoose from "mongoose";
import service from "../services/user.service.js";

/**
 * Valida um ID fornecido, verificando se é um ObjectId válido.
 * @param {string} id - O ID a ser validado.
 * @param {string} name - Nome do parâmetro (usado para mensagens de erro).
 */
function validateObjectId(id, name) {
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return { valid: false, message: `ID de ${name} inválido.` };
    }
    return { valid: true };
}

/**
 * Middleware para validar o ID do usuário.
 */
function validateId(req, res, next) {
    const { userId } = req;

    const validation = validateObjectId(userId, "usuário");
    if (!validation.valid) {
        return res.status(400).send({ message: validation.message });
    }

    return next();
}

/**
 * Middleware para validar o ID da coleção.
 */
function validateCollectionId(req, res, next) {
    const { collectionId } = req.params;

    const validation = validateObjectId(collectionId, "coleção");
    if (!validation.valid) {
        return res.status(400).send({ message: validation.message });
    }

    return next();
}

/**
 * Middleware para validar o ID do livro.
 */
function validateBookId(req, res, next) {
    const { bookId } = req.params;

    const validation = validateObjectId(bookId, "livro");
    if (!validation.valid) {
        return res.status(400).send({ message: validation.message });
    }

    return next();
}

/**
 * Middleware para validar o usuário autenticado.
 */
async function validateUser(req, res, next) {
    try {
        const { userId } = req;

        // Verifica se o usuário existe no banco de dados
        const user = await service.getUser(userId);
        if (!user) {
            return res.status(404).send({ message: "Usuário não encontrado." });
        }

        // Anexa o usuário à requisição
        req.user = user;
        return next();
    } catch (error) {
        // Retorna erro genérico caso ocorra um problema interno
        return res.status(500).send({ message: error.message });
    }
}

export {
    validateBookId,
    validateCollectionId,
    validateId,
    validateUser
};

