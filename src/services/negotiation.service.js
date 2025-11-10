import Negotiation from "../models/Negotiation.js";

function createNegotiations(bodies) {
    if (!Array.isArray(bodies)) {
        return Negotiation.create(bodies);
    }

    if (bodies.length === 0) {
        return [];
    }

    return Negotiation.insertMany(bodies);
}

const DEFAULT_POPULATIONS = [
    { path: "booksId" },
    { path: "listingsId" },
    { path: "buyerId", select: "-password" },
    { path: "sellerId", select: "-password" },
];

function buildPopulateSpec(relations = []) {
    if (!Array.isArray(relations) || relations.length === 0) {
        return DEFAULT_POPULATIONS;
    }

    return relations.map((relation) => {
        if (relation === "buyerId" || relation === "sellerId") {
            return { path: relation, select: "-password" };
        }

        return { path: relation };
    });
}

function populateNegotiation(negotiation, relations = []) {
    return negotiation.populate(buildPopulateSpec(relations));
}

function getNegotiation(negotiationId) {
    return Negotiation.findById(negotiationId).populate(DEFAULT_POPULATIONS);
}

function getAllNegotiationsByUser(userId) {
    return Negotiation.find({
        $or: [
            { buyerId: userId },
            { sellerId: userId }
        ]
    }).populate(DEFAULT_POPULATIONS);
}

function markNegotiationPaid(negotiationId, { method, comprovanteImage }) {
    return Negotiation.findByIdAndUpdate(
        negotiationId,
        {
            payment: {
                method,
                comprovanteImage,
                paidAt: new Date(),
            },
        },
        { new: true }
    ).populate(DEFAULT_POPULATIONS);
}

function markNegotiationShipped(negotiationId, { carrier, trackingCode, proofImage }) {
    return Negotiation.findByIdAndUpdate(
        negotiationId,
        {
            shipping: {
                carrier,
                trackingCode,
                proofImage,
                shippedAt: new Date(),
            },
        },
        { new: true }
    ).populate(DEFAULT_POPULATIONS);
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
    createNegotiations,
    populateNegotiation,
    getNegotiation,
    getAllNegotiationsByUser,
    markNegotiationPaid,
    markNegotiationShipped,
    updateNegotiation,
    deleteNegotiation
};
