import mongoose from "mongoose";
import bcript   from "bcryptjs";

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        select: true
    },
    status:{
        type: String,
        enum: ['ativo', 'inativo'], 
        default: 'ativo'
    }
});

UserSchema.pre("save", async function (next){
    this.password = await bcript.hash(this.password, 10);
    next();
});

const User = mongoose.model("User", UserSchema);

export default User;