import mongoose from "mongoose";

const NegotiationReportSchema = new mongoose.Schema({
    negotiationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Negotiation",
        required: true
    },
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    accusedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    attachments: [{
        type: String
    }],
    status: {
        type: String,
        enum: ["open", "under_review", "closed"],
        default: "open"
    },
}, {
    timestamps: true
});

NegotiationReportSchema.index({ negotiationId: 1, createdAt: -1 });

const NegotiationReport = mongoose.model("NegotiationReport", NegotiationReportSchema);

export default NegotiationReport;

