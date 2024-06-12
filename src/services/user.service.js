import User from "../models/User.js";

//FUNCAO CRIAR USUARIO
function createUser(body) {
    return User.create(body);
}

//FUNCAO RECEBER USUARIO
function getUser(id) {
    return User.findOne({_id:id, status:"ativo"});
}

//FUNCAO ATUALIZAR USUARIO
function updateUser(id, name, lastname, email, password, status) {
    return User.findOneAndUpdate({_id: id},{name,lastname,email,password, status});
}

//FUNCAO DELETAR USUARIO
function deleteUser(id) {
    return User.findOneAndUpdate({_id: id},{status:"inativo"});
}

export default {
    createUser,
    getUser,
    updateUser,
    deleteUser
};