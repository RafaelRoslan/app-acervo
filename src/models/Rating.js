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
    ratingValue: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Rating = mongoose.model("Rating",RatingSchema);

export default Rating;
