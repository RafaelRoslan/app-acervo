import Listing from '../models/Listing.js';

function createListing(doc) {
  return Listing.create(doc);
}

function findActive(params = {}, { page = 1, pageSize = 20, sort = 'recent' } = {}) {
  const filter = { ...params }; // ex: { status:'ativo', expiresAt: { $gt: now }, ... }
  const sortMap = {
    recent:     { createdAt: -1 },
    price_asc:  { price: 1 },
    price_desc: { price: -1 },
    title_asc:  { 'bookSnapshot.title': 1 },
  };
  const sortSpec = sortMap[sort] || sortMap.recent;
  const skip = (Number(page) - 1) * Number(pageSize);
  return Promise.all([
    Listing.find(filter).sort(sortSpec).skip(skip).limit(Number(pageSize)),
    Listing.countDocuments(filter),
  ]);
}

function findMine(sellerId) {
  return Listing.find({ sellerId }).sort({ createdAt: -1 });
}

function updateListing(listingId, sellerId, updates) {
  return Listing.findOneAndUpdate(
    { _id: listingId, sellerId },
    { $set: updates },
    { new: true }
  );
}

function deleteListing(listingId, sellerId) {
  return Listing.findOneAndDelete({ _id: listingId, sellerId });
}

export default {
  createListing,
  findActive,
  findMine,
  updateListing,
  deleteListing,
};
