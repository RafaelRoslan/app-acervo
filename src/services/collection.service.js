import Collection from "../models/Collection.js";

function createCollection(body) {
    return Collection.create(body);
}

function getAllCollections(userId){
    return Collection.find({userId:userId});
}

function updateCollection(id,name) {
    return Collection.findByIdAndUpdate({_id:id},{name}, { new: true, runValidators: true});
}

function deleteCollection(id) {
    return Collection.findByIdAndDelete({id});
}

function getCollection(id) {
    return Collection.findById(id);
}

async function getCollectionsWithCover(userId) {
  const uid = new mongoose.Types.ObjectId(userId);

  return Collection.aggregate([
    { $match: { userId: uid } },
    {
      $lookup: {
        from: 'books',               // nome da coleção no Mongo (plural minúsculo)
        let: { cid: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$collectionId', '$$cid'] }, image: { $ne: '' } } },
          { $addFields: { rank: { $cond: [{ $eq: ['$isCover', true] }, 0, 1] } } },
          { $sort: { rank: 1, createdAt: 1, _id: 1 } }, // prioriza capa escolhida; senão, 1ª com imagem
          { $project: { image: 1 } }
        ],
        as: '_books'
      }
    },
    { $addFields: { coverImage: { $first: '$_books.image' } } },
    { $project: { _books: 0 } }
  ]);
}

export default {
    createCollection,
    getAllCollections,
    updateCollection,
    deleteCollection,
    getCollection,
    getCollectionsWithCover,
};