import service from "../services/negotiation.service.js";

async function createNegotiation(req, res) {
    try {
        const { book, collection, buyer, seller, price, status } = req.body;

        if (!book && !collection) {
            return res.status(400).send({ message: "É necessário informar um livro ou coleção para a negociação." });
        }

        if (!buyer || !seller || !price) {
            return res.status(400).send({ message: "Preencha todos os campos obrigatórios para registro da negociação." });
        }

        const negotiation = await service.createNegotiation({
            book,
            collection,
            buyer,
            seller,
            price,
            status: status || "pending",
        });

        res.status(200).send({ message: "Negociação criada com sucesso", negotiation });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function readNegotiation(req, res) {
    try {
        const { negotiationId } = req.params;

        const negotiation = await service.getNegotiation(negotiationId);
        if (!negotiation) {
            return res.status(404).send({ message: "Negociação não encontrada." });
        }

        res.status(200).send({ negotiation });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function updateNegotiation(req, res) {
    try {
        const { negotiationId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).send({ message: "O status é obrigatório para atualizar a negociação." });
        }

        const negotiation = await service.updateNegotiation(negotiationId, status);
        if (!negotiation) {
            return res.status(404).send({ message: "Negociação não encontrada." });
        }

        res.status(200).send({ message: "Negociação atualizada com sucesso", negotiation });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function deleteNegotiation(req, res) {
    try {
        const { negotiationId } = req.params;

        const negotiation = await service.deleteNegotiation(negotiationId);
        if (!negotiation) {
            return res.status(404).send({ message: "Negociação não encontrada." });
        }

        res.status(200).send({ message: "Negociação deletada com sucesso" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function getNegotiationsByUser(req, res) {
    try {
        const { userId } = req.params;

        const negotiations = await service.getAllNegotiationsByUser(userId);

        res.status(200).send({ negotiations });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export default {
    createNegotiation,
    readNegotiation,
    updateNegotiation,
    deleteNegotiation,
    getNegotiationsByUser,
};
