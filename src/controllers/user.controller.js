import service from "../services/user.service.js";

async function createUser(req, res) {
    try {
        //DESSETRUTURANDO OBJETO EM VARIAVEIS
        const {name, lastname, email, password} = req.body;

        //VALIDANDO VARIAVEIS
        if(!name || !lastname || !email || !password){
            //RETORNANDO ERRO 400(BAD REQUEST) SE FALTAR DADOS
            return res.status(400).send({messagem: "preencha todos os campos para registro."});
        }

        //SOLICITANDO AO SERVICE A CRIAÇÃO DO USUARIO
        let user = await service.createUser(req.body);
        if (!user) {
            return res.status(400).send({messagem: "Erro ao cadastrar usúario"})
        }

        //CRIANDO UM OBJ USUARIO
        let userRes = {
            id: user._id,
            name: name,
            lastname: lastname,
            email: email
        };

        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({message: "Cliente cadastrado com sucesso", userRes});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

async function readUser(req, res) {
    try {
         //ATRIBUINDO REQ EM VARIAVEL
         const id = req.params.id;

         //SOLICITANDO AO SERVICE O RECEBIMENTO DO USUARIO
         const user = await service.getUser(id);
         if(!user){
            return res.status(400).send({message: "Usuario não encontrado"});
         }
 
         //RETORNANDO SUCESSO COM MENSAGEM
         res.status(200).send({user});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

async function updateUser(req, res) {
    try {
        
        //DESSETRUTURANDO OBJETO EM VARIAVEIS        
        const {name, lastname, email, password, status} = req.body;
        const id = req.params.id;

        //VALIDANDO VARIAVEIS
        if(!name && !lastname && !email && !password){
            //RETORNANDO ERRO 400(BAD REQUEST) SE FALTAR DADOS
            return res.status(400).send({menssagem: "preencha todos os campos para registro."});
        }

        //SOLICITANDO AO SERVICE A BUSCA DO USUARIO E CHECANDO
        const user = await service.getUser(id);
        if(!user){
            return res.status(400).send({message: "Usuario não encontrado"});
         }
        if(String(user._id) != req.userId){
            return res.status(400).send({menssagem: "Voce não pode atualizar outro usuario"});
        }

        //SOLICITANDO AO SERVICE A ATUALIZAÇÃO DE DADOS
        await service.updateUser(id, name, lastname, email, password, status);

        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({menssagem:"Cliente autalizado com sucesso"});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

async function deleteUser(req, res) {
    try {
        //ATRIBUINDO REQ EM VARIAVEL
        const id = req.params.id;

        //SOLICITANDO AO SERVICE O RECEBIMENTO DO USUARIO
        const user = await service.getUser(id);

        if(!user){
            return res.status(400).send({message: "Usuario não encontrado"});
         }
        if(String(user._id) != req.userId){
            return res.status(400).send({menssagem: "Voce não pode deletar outro usuario"});
        }

        //SOLICITANDO AO SERVICE O RECEBIMENTO DO USUARIO
        await service.deleteUser(id);

        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({message: "Cliente deletado com sucesso"});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

export default {
    createUser,
    readUser,
    updateUser,
    deleteUser
}