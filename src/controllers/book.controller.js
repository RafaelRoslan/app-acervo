import service from "../services/book.service.js";

async function createBook(req, res) {
    try {
        const {title, author, description, isbn, image} = req.body;
        const {collectionId} = req.params;

        if(!title || !author){
            return res.status(400).send({message: "preencha todos os campos obrigatorios para registro."});
        }

        let book = await service.createBook({
            title,
            author,
            description,
            isbn,
            image,
            collectionId
        });

        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({ message: "Livro cadastrado com sucesso", book });
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

async function readBook(req, res) {
    try {
        //DESSETRUTURANDO OBJETO EM VARIAVEIS 
        const { collectionId, bookId } = req.params;
        
        //SOLICITANDO AO SERVICE A BUSCA DO LIVRO
        const book = await service.getBook(bookId, collectionId);
        if (!book) {
            return res.status(400).send({message: "Livro não encontrado na coleção."});
        }

        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({book});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

async function updateBook(req, res) {
    try {
        //DESSETRUTURANDO OBJETO EM VARIAVEIS 
        const { collectionId, bookId } = req.params;
        const {title, author, description, isbn, image} = req.body;

        //VALIDANDO VARIAVEIS
        if(!title || !author){
            //RETORNANDO ERRO 400(BAD REQUEST) SE FALTAR DADOS
            return res.status(400).send({message: "preencha todos os campos obrigatorios para registro."});
        }

        //SOLICITANDO AO SERVICE A BUSCA DO LIVRO E CHECANDO
        const book = await service.getBook(bookId, collectionId);
        if (!book) {
            return res.status(400).send({message: "Livro não encontrado na coleção."});
        }

        await service.updateBook(bookId, title, author, description, isbn, image);

        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({message:"livro autalizado com sucesso"});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

async function deleteBook(req, res) {
    try {
        const { collectionId, bookId } = req.params;

        const book = await service.getBook(bookId, collectionId);
        if (!book) {
            return res.status(400).send({message: "Livro não encontrado na coleção."});
        }

        await service.deleteBook(bookId);

        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({message:"livro deletado com sucesso"});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

async function getAllBooks(req, res) {
    try {
        const {collectionId} = req.params;

        let books = await service.getAllBooks(collectionId);

        //RETORNANDO SUCESSO COM MENSAGEM
        res.status(200).send({books});
    } catch (error) {
        //RETORNANDO ERRO CASO NÃO COSSIGA EXECUTAR O TRY
        res.status(500).send({message: error.message});
    }
}

export default {
    createBook,
    readBook,
    updateBook,
    deleteBook,
    getAllBooks
}