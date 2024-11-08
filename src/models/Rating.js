import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
    ratedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ratingUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    negotiationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Negotiation",
        required: true
    },
    ratingValue: { // Exemplo: de 1 a 5 estrelas
        type: Number,
        required: true
    },
    comment: {
        type: String // Avaliação opcional
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Rating = mongoose.model("Rating",RatingSchema);

export default Rating;
