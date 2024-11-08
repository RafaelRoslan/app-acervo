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
    },
    address: {
        logradouro: String,
        numero: String,
        bairro: String,
        complemento: String,
        cidade: String,
        estado: String
    },
    bankDetails: {
        conta: String,
        agencia: String,
        tipoConta: String, // (poupança, corrente etc.)
        titular: String,
        cpfTitular: String
    },
    pix: {
        chave: String
    },
});

UserSchema.pre("save", async function (next){
    this.password = await bcript.hash(this.password, 10);
    next();
});

const User = mongoose.model("User", UserSchema);

export default User;