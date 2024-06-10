import Collection from "../models/Collection.js";

function createCollection(body) {
    return Collection.create(body);
}

function getAllCollections(){
    return Collection.find();
}

function updateCollection(id,name) {
    return Collection.findByIdAndUpdate({_id:id},{name});
}

function deleteCollection(id) {
    return Collection.findByIdAndDelete({_id:id});
}

function getCollection(id) {
    return Collection.findById(id);
}

export default {
    createCollection,
    getAllCollections,
    updateCollection,
    deleteCollection,
    getCollection
};