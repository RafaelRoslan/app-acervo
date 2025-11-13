import service from "../services/rating.service.js";

async function createRating(req, res) {
    try {
        const { ratedUserId, negotiationId, ratingValue, comment } = req.body;
        const ratingUserId = req.userId;

        if (!ratedUserId || !negotiationId || ratingValue === undefined || ratingValue === null) {
            return res.status(400).send({ message: "Preencha todos os campos obrigatórios para avaliação." });
        }

        if (typeof ratingValue !== "number" || ratingValue < 1 || ratingValue > 5) {
            return res.status(400).send({ message: "A nota deve ser um número entre 1 e 5." });
        }

        const rating = await service.createRating({
            ratedUserId,
            ratingUserId,
            negotiationId,
            ratingValue,
            comment: comment || null,
        });

        res.status(201).send({ message: "Avaliação criada com sucesso", rating });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function getRatingsForUser(req, res) {
    try {
        const { userId } = req.params;

        const ratings = await service.getRatingsForUser(userId);

        res.status(200).send({ ratings });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function getRatingsByNegotiation(req, res) {
    try {
        const { negotiationId } = req.params;

        const ratings = await service.getRatingsByNegotiation(negotiationId);

        res.status(200).send({ ratings });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function updateRating(req, res) {
    try {
        const { ratingId } = req.params;
        const { comment, ratingValue } = req.body;

        if (!comment && ratingValue === undefined) {
            return res.status(400).send({ message: "É necessário informar pelo menos um campo para atualização." });
        }

        if (ratingValue !== undefined && (typeof ratingValue !== "number" || ratingValue < 1 || ratingValue > 5)) {
            return res.status(400).send({ message: "A nota deve ser um número entre 1 e 5." });
        }

        const rating = await service.updateRating(ratingId, { comment, ratingValue });
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
    getRatingsByNegotiation,
    updateRating,
    deleteRating,
};
