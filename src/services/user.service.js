import User from "../models/User.js";

//FUNCAO CRIAR USUARIO
function createUser(body) {
    User.create(body);
}

//FUNCAO RECEBER USUARIO
function getUser(id) {
    User.findById(id);
}

//FUNCAO ATUALIZAR USUARIO
function updateUser(id, name, lastname, email, password, status) {
    return User.findOneAndUpdate({_id: id}, name, lastname, email, password, status);
}

//FUNCAO DELETAR USUARIO
function deleteUser(id) {
    User.findOneAndDelete({_id: id});
}

export default {
    createUser,
    getUser,
    updateUser,
    deleteUser
};