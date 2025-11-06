import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    author:{
        type: String,
        required: true,
    },
    description:{
        type:String
    },
    isbn:{
        type:String
    },
    image:{
        type:String
    },
    collectionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection', 
        required: true, 
        immutable: true 
    },
});

const Book = mongoose.model("Book",BookSchema);

export default Book;