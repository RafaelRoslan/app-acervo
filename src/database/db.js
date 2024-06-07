import mongoose from "mongoose";

//FUNCAO PARA CONECTAR NO BANCO DE DADOS
function connectDatabase() {
    //indicando que a ação está sendo executada
    console.log("Conectando com banco de dados");

    //tentando conectar ao banco de dados
    mongoose.connect("mongodb+srv://root:root@cluster0.2vk2vtl.mongodb.net/AcervoDB?retryWrites=true&w=majority&appName=Cluster0")
        .then(()=>console.log("Banco de dados conectado com sucesso"))
        .catch((error)=>console.log(error));
}

export default connectDatabase;