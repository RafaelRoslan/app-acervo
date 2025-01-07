import service from "../services/rating.service.js";

async function createRating(req, res) {
    try {
        const { ratedUser, ratedBy, score, comment } = req.body;

        if (!ratedUser || !ratedBy || !score) {
            return res.status(400).send({ message: "Preencha todos os campos obrigatórios para avaliação." });
        }

        const rating = await service.createRating({ ratedUser, ratedBy, score, comment });

        res.status(200).send({ message: "Avaliação criada com sucesso", rating });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function getRatingsForUser(req, res) {
    try {
        const { userId } = req.params;

        const ratings = await service.getRatingsForUser(userId);
        if (!ratings || ratings.length === 0) {
            return res.status(404).send({ message: "Nenhuma avaliação encontrada para este usuário." });
        }

        res.status(200).send({ ratings });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function updateRating(req, res) {
    try {
        const { ratingId } = req.params;
        const { comment, score } = req.body;

        if (!comment && !score) {
            return res.status(400).send({ message: "É necessário informar pelo menos um campo para atualização." });
        }

        const rating = await service.updateRating(ratingId, comment, score);
        if (!rating) {
            return res.status(404).send({ message: "Avaliação não encontrada." });
        }

        res.status(200).send({ message: "Avaliação atualizada com sucesso", rating });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function deleteRating(req, res) {
    try {
        const { ratingId } = req.params;

        const rating = await service.deleteRating(ratingId);
        if (!rating) {
            return res.status(404).send({ message: "Avaliação não encontrada." });
        }

        res.status(200).send({ message: "Avaliação deletada com sucesso" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export default {
    createRating,
    getRatingsForUser,
    updateRating,
    deleteRating,
};
