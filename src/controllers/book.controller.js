import service from "../services/book.service.js";
import mongoose from 'mongoose';

async function createBook(req, res) {
    try {
        const {title, author, description, isbn, image} = req.body;
        const {collectionId} = req.params;

        if(!title || !author){
            return res.status(400).send({message: "preencha todos os campos obrigatorios para registro."});
        }


        let imageBase64 = '';
        if (image) {
        // precisa começar com data:image/...
        if (!/^data:image\/(png|jpe?g|webp);base64,/.test(image)) {
            return res.status(400).json({ message: 'Imagem inválida (formato)' });
        }
        const pure = image.split(',')[1] || '';
        const bytes = Math.floor((pure.length * 3) / 4);

        const MAX = 250 * 1024; // 250KB no back (margem)
        if (bytes > MAX) {
            return res.status(413).json({ message: 'Imagem muito grande (máx 250KB)' });
        }

        imageBase64 = image; // guarda data URL completo
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
    const { collectionId, bookId } = req.params;

    // Validação de IDs
    if (!mongoose.Types.ObjectId.isValid(collectionId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    // Whitelist do body (nada de copiar body inteiro!)
    const { title, author, description, isbn, image } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = String(title).trim();
    if (author !== undefined) updates.author = String(author).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (isbn !== undefined) updates.isbn = String(isbn).trim();

    if (image !== undefined) {
      if (image === '' || image === null) {
        updates.image = '';
      } else {
        if (!/^data:image\/(png|jpe?g|webp);base64,/.test(image)) {
          return res.status(400).json({ message: 'Imagem inválida (formato)' });
        }
        const pure = image.split(',')[1] || '';
        const bytes = Math.floor((pure.length * 3) / 4);
        if (bytes > 250 * 1024) {
          return res.status(413).json({ message: 'Imagem muito grande (máx 250KB)' });
        }
        updates.image = image;
      }
    }

    // Bloqueia tentativa de alterar collectionId pelo body
    if ('collectionId' in req.body) delete req.body.collectionId;

    // Confirma que o livro existe na coleção
    const found = await service.getBook(bookId, collectionId);
    if (!found) return res.status(404).json({ message: 'Livro não encontrado na coleção.' });

    //console.log('PATCH updates:', updates);

    const updated = await service.updateBook({ bookId, collectionId, updates });
    //console.log('PATCH updated:', !!updated);

    if (!updated) return res.status(404).json({ message: 'Livro não encontrado para atualização' });

    return res.status(200).json({ message: 'Livro atualizado com sucesso', book: updated });
  } catch (error) {
    console.error('UPDATE BOOK ERROR:', error); // imprime stack completa
    return res.status(500).json({ message: error?.message || 'Erro interno' });
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