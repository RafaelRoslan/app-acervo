import Rating from "../models/Rating.js";

function createRating({ ratedUserId, ratingUserId, negotiationId, ratingValue, comment }) {
    return Rating.create({
        ratedUserId,
        ratingUserId,
        negotiationId,
        ratingValue,
        comment: comment || null,
    });
}

function removeImagesFromNegotiation(negotiation) {
    if (!negotiation) return negotiation;
    
    const negotiationObj = negotiation.toObject ? negotiation.toObject() : negotiation;
    
    if (negotiationObj.booksId && Array.isArray(negotiationObj.booksId)) {
        negotiationObj.booksId = negotiationObj.booksId.map(book => {
            if (book && typeof book === 'object') {
                const { image, ...bookWithoutImage } = book;
                return bookWithoutImage;
            }
            return book;
        });
    }
    
    if (negotiationObj.listingsId && Array.isArray(negotiationObj.listingsId)) {
        negotiationObj.listingsId = negotiationObj.listingsId.map(listing => {
            if (listing && typeof listing === 'object') {
                const listingObj = { ...listing };
                if (listingObj.bookSnapshot && listingObj.bookSnapshot.image) {
                    const { image, ...bookSnapshotWithoutImage } = listingObj.bookSnapshot;
                    listingObj.bookSnapshot = bookSnapshotWithoutImage;
                }
                return listingObj;
            }
            return listing;
        });
    }
    
    if (negotiationObj.payment && negotiationObj.payment.comprovanteImage) {
        const { comprovanteImage, ...paymentWithoutImage } = negotiationObj.payment;
        negotiationObj.payment = paymentWithoutImage;
    }
    
    if (negotiationObj.shipping && negotiationObj.shipping.proofImage) {
        const { proofImage, ...shippingWithoutImage } = negotiationObj.shipping;
        negotiationObj.shipping = shippingWithoutImage;
    }
    
    return negotiationObj;
}

async function processRatings(ratings) {
    if (!ratings) return ratings;
    
    if (Array.isArray(ratings)) {
        return ratings.map(rating => {
            const ratingObj = rating.toObject ? rating.toObject() : rating;
            if (ratingObj.negotiationId) {
                ratingObj.negotiationId = removeImagesFromNegotiation(ratingObj.negotiationId);
            }
            return ratingObj;
        });
    }
    
    const ratingObj = ratings.toObject ? ratings.toObject() : ratings;
    if (ratingObj.negotiationId) {
        ratingObj.negotiationId = removeImagesFromNegotiation(ratingObj.negotiationId);
    }
    return ratingObj;
}

async function getRatingsForUser(userId) {
    const ratings = await Rating.find({ ratedUserId: userId })
        .populate("ratedUserId", "-password")
        .populate("ratingUserId", "-password")
        .populate({
            path: "negotiationId",
            populate: [
                { path: "booksId", select: "-image" },
                { path: "listingsId" },
                { path: "buyerId", select: "-password" },
                { path: "sellerId", select: "-password" }
            ]
        })
        .sort({ date: -1 });
    
    return processRatings(ratings);
}

async function getRatingsByNegotiation(negotiationId) {
    const ratings = await Rating.find({ negotiationId })
        .populate("ratedUserId", "-password")
        .populate("ratingUserId", "-password")
        .populate({
            path: "negotiationId",
            populate: [
                { path: "booksId", select: "-image" },
                { path: "listingsId" },
                { path: "buyerId", select: "-password" },
                { path: "sellerId", select: "-password" }
            ]
        })
        .sort({ date: -1 });
    
    return processRatings(ratings);
}

async function getAllRatings() {
    const ratings = await Rating.find()
        .populate("ratedUserId", "-password")
        .populate("ratingUserId", "-password")
        .populate({
            path: "negotiationId",
            populate: [
                { path: "booksId", select: "-image" },
                { path: "listingsId" },
                { path: "buyerId", select: "-password" },
                { path: "sellerId", select: "-password" }
            ]
        })
        .sort({ date: -1 });
    
    return processRatings(ratings);
}

async function updateRating(ratingId, { comment, ratingValue }) {
    const updateData = {};
    
    if (comment !== undefined) {
        updateData.comment = comment;
    }
    
    if (ratingValue !== undefined) {
        updateData.ratingValue = ratingValue;
    }

    const rating = await Rating.findByIdAndUpdate(
        ratingId,
        updateData,
        { new: true }
    )
        .populate("ratedUserId", "-password")
        .populate("ratingUserId", "-password")
        .populate({
            path: "negotiationId",
            populate: [
                { path: "booksId", select: "-image" },
                { path: "listingsId" },
                { path: "buyerId", select: "-password" },
                { path: "sellerId", select: "-password" }
            ]
        });
    
    return processRatings(rating);
}

function deleteRating(ratingId) {
    return Rating.findByIdAndDelete(ratingId);
}

export default {
    createRating,
    getRatingsForUser,
    getRatingsByNegotiation,
    getAllRatings,
    updateRating,
    deleteRating
};
