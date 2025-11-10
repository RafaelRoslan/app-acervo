import mongoose from 'mongoose';
import Book from '../models/Book.js';
import service from "../services/book.service.js";

async function createBook(req, res) {
    try {
        const {title, author, description, isbn, image, year, publisher} = req.body;
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
            collectionId,
            year,
            publisher
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

    if (!mongoose.Types.ObjectId.isValid(collectionId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    // Whitelist segura
    const allowed = ['title','author','description','isbn','year','publisher','image'];
    const updates = {};
    for (const k of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) {
        updates[k] = req.body[k];
      }
    }

    //console.log('updates:', updates);

    // ⚠️ Corrige o uso de `image` fora do escopo
    if (Object.prototype.hasOwnProperty.call(updates, 'image')) {
      const img = updates.image; // pode ser '', null, undefined ou data URL

      if (img === '' || img === null) {
        // limpar imagem
        updates.image = '';
      } else if (typeof img === 'string') {
        // validar data URL
        if (!/^data:image\/(png|jpe?g|webp);base64,/.test(img)) {
          return res.status(400).json({ message: 'Imagem inválida (formato)' });
        }
        const pure = img.split(',')[1] || '';
        const bytes = Math.floor((pure.length * 3) / 4);
        if (bytes > 250 * 1024) {
          return res.status(413).json({ message: 'Imagem muito grande (máx 250KB)' });
        }
        // mantém updates.image
      } else {
        // chegou algo estranho → não mexe na imagem
        delete updates.image;
      }
    }

    if ('collectionId' in req.body) delete req.body.collectionId;

    const found = await service.getBook(bookId, collectionId);
    if (!found) return res.status(404).json({ message: 'Livro não encontrado na coleção.' });

    const updated = await service.updateBook({ bookId, collectionId, updates });
    if (!updated) return res.status(404).json({ message: 'Livro não encontrado para atualização' });

    return res.status(200).json({ message: 'Livro atualizado com sucesso', book: updated });
  } catch (error) {
    console.error('UPDATE BOOK ERROR:', error);
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

async function setCover(req, res) {
  try {
    const { collectionId, bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(collectionId) || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    // zera flags da coleção
    await Book.updateMany({ collectionId }, { $set: { isCover: false } });

    // define capa neste livro
    const updated = await Book.findOneAndUpdate(
      { _id: bookId, collectionId },
      { $set: { isCover: true } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Livro não encontrado' });
    return res.status(200).json({ message: 'Capa definida', book: updated });
  } catch (e) {
    console.error('SET COVER ERROR:', e);
    return res.status(500).json({ message: 'Erro interno' });
  }
}

export default {
    createBook,
    readBook,
    updateBook,
    deleteBook,
    getAllBooks,
    setCover
}