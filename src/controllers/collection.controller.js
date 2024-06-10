import serviceBook from "../services/book.service.js";
import service from "../services/collection.service.js";

async function createCollection(req, res) {
    try {
        //DESSETRUTURANDO OBJETO EM VARIAVEIS
        const name = req.body.name;
        const userId = req.userId;


        //VALIDANDO VARIAVEIS
        if(!name){
            //RETORNANDO ERRO 400(BAD REQUEST) SE FALTAR DADOS
            return res.status(400).send({messagem: "preencha todos os campo."});
        }

        await service.createCollection({
            name,
            userId
        });

        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({message: "Coleção criada com sucesso"});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

async function readCollections(req, res) {
    try {

        const collections = await service.getAllCollections();
        if(collections.length < 1){
            return res.status(400).send({message: "Não há coleções cadastradas"});
        }

        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send(collections);
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

async function updateCollection(req, res) {
    try {
        const {name} = req.body;
        const {collectionId} = req.params;

        const collection = await service.getCollection(collectionId);
        if(!collection){
            return res.status(400).send({message: "Coleção não encontrada"});
        }

        if(!name){
            //RETORNANDO ERRO 400(BAD REQUEST) SE FALTAR DADOS
            return res.status(400).send({messagem: "preencha todos os campos para registro."});
        }

        await service.updateCollection(collectionId, name);
        
        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({message: "Coleção autalizada com sucesso"});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

async function deleteCollection(req, res) {
    try {
        const {collectionId} = req.params;

        //SOLICITANDO AO SERVICE O RECEBIMENTO DO USUARIO
        const collection = await service.getCollection(collectionId);
        if(!collection){
            return res.status(400).send({message: "Coleção não encontrada"});
        }
        if (String(collection.userId) != req.userId){
            return res.status(400).send({messagem: "Voce não pode deletar coleção de outro usuario"});
        }

        //pegar e deletar todos os livros antes de deletar a coleção.
        let books = await serviceBook.getAllBooks(collectionId);
        await Promise.all(books.map(book => serviceBook.deleteBook(book._id)));

        await service.deleteCollection(collectionId);
        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({message: "Coleção deletada com sucesso"});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}


export default {
    createCollection,
    readCollections,
    updateCollection,
    deleteCollection
}