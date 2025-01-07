import Rating from "../models/Rating.js";

function createRating(body) {
    return Rating.create(body);
}

function getRatingsForUser(userId) {
    return Rating.find({ ratedUser: userId }).populate("ratedBy");
}

function getAllRatings() {
    return Rating.find().populate("ratedUser ratedBy");
}

function updateRating(ratingId, comment, score) {
    return Rating.findByIdAndUpdate(
        ratingId,
        { comment, score },
        { new: true } // Retorna o documento atualizado
    );
}

function deleteRating(ratingId) {
    return Rating.findByIdAndDelete(ratingId);
}

export default {
    createRating,
    getRatingsForUser,
    getAllRatings,
    updateRating,
    deleteRating
};
