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
    isCover: { 
        type: Boolean, 
        default: false 
    },
    collectionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection', 
        required: true, 
        immutable: true 
    },
    year: { 
        type: Number, 
        default: null
    },
    publisher: { 
        type: String, 
        default: ''
    },
},{ timestamps: true });

const Book = mongoose.model("Book",BookSchema);

export default Book;