import Negotiation from "../models/Negotiation.js";
import NegotiationReport from "../models/NegotiationReport.js";

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
    { path: "comments.authorId", select: "-password" },
];

function buildPopulateSpec(relations = []) {
    if (!Array.isArray(relations) || relations.length === 0) {
        return DEFAULT_POPULATIONS;
    }

    return relations.map((relation) => {
        if (relation === "buyerId" || relation === "sellerId" || relation === "comments.authorId") {
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

function addNegotiationComment(negotiationId, { authorId, role, message }) {
    const comment = {
        authorId,
        message,
        createdAt: new Date(),
    };

    if (role) {
        comment.role = role;
    }

    return Negotiation.findByIdAndUpdate(
        negotiationId,
        { $push: { comments: comment } },
        { new: true }
    ).populate(DEFAULT_POPULATIONS);
}

function createNegotiationReport({ negotiationId, reporterId, accusedId, reason, attachments }) {
    return NegotiationReport.create({
        negotiationId,
        reporterId,
        accusedId,
        reason,
        attachments,
    });
}

function getNegotiationReports(negotiationId) {
    return NegotiationReport.find({ negotiationId })
        .sort({ createdAt: -1 })
        .populate([
            { path: "reporterId", select: "-password" },
            { path: "accusedId", select: "-password" },
            { path: "negotiationId" },
        ]);
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
            status: "aguardando_envio",
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
            status: "encaminhada",
        },
        { new: true }
    ).populate(DEFAULT_POPULATIONS);
}

function markNegotiationReceived(negotiationId) {
    return Negotiation.findByIdAndUpdate(
        negotiationId,
        {
            status: "concluido",
        },
        { new: true }
    ).populate(DEFAULT_POPULATIONS);
}

function updateNegotiation(negotiationId, status) {
    return Negotiation.findByIdAndUpdate(
        negotiationId,
        { status },
        { new: true }
    ).populate(DEFAULT_POPULATIONS);
}

function deleteNegotiation(negotiationId) {
    return Negotiation.findByIdAndDelete(negotiationId);
}

export default {
    createNegotiations,
    populateNegotiation,
    getNegotiation,
    getAllNegotiationsByUser,
    addNegotiationComment,
    createNegotiationReport,
    getNegotiationReports,
    markNegotiationPaid,
    markNegotiationShipped,
    markNegotiationReceived,
    updateNegotiation,
    deleteNegotiation
};
