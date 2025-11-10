import mongoose from "mongoose";

const NegotiationSchema = new mongoose.Schema({
    listingsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    }],
    booksId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    }],
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    payment: {
        method: {
            type: String,
            enum: ["PIX", "TED", "BOLETO"],
            default: null
        },
        comprovanteImage: {
            type: String,
            default: null
        },
        paidAt: {
            type: Date,
            default: null
        }
    },
    shipping: {
        carrier: {
            type: String,
            default: null
        },
        trackingCode: {
            type: String,
            default: null
        },
        proofImage: {
            type: String,
            default: null
        },
        shippedAt: {
            type: Date,
            default: null
        }
    },
    isEvaluated: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Negotiation = mongoose.model("Negotiation", NegotiationSchema);

export default Negotiation;