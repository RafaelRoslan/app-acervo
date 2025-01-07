import Negotiation from "../models/Negotiation.js";

function createNegotiation(body) {
    return Negotiation.create(body);
}

function getNegotiation(negotiationId) {
    return Negotiation.findById(negotiationId).populate("book collection buyer seller");
}

function getAllNegotiationsByUser(userId) {
    return Negotiation.find({
        $or: [
            { buyer: userId },
            { seller: userId }
        ]
    }).populate("book collection buyer seller");
}

function updateNegotiation(negotiationId, status) {
    return Negotiation.findByIdAndUpdate(
        negotiationId,
        { status },
        { new: true } // Retorna o documento atualizado
    );
}

function deleteNegotiation(negotiationId) {
    return Negotiation.findByIdAndDelete(negotiationId);
}

export default {
    createNegotiation,
    getNegotiation,
    getAllNegotiationsByUser,
    updateNegotiation,
    deleteNegotiation
};
