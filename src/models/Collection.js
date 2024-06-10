import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Collection = mongoose.model("Collection", CollectionSchema);

export default Collection;