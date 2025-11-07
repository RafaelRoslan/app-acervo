import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import Book from '../models/Book.js';
import service from '../services/listing.service.js';

async function createListing(req, res) {
  try {
    const { bookId, price, condition, stock, shipping } = req.body;

    // bookId válido
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'bookId inválido' });
    }

    // normaliza preço: "10,00" -> 10.00
    const nprice = Number(String(price ?? '').toString().trim().replace('.', ','));
    if (!Number.isFinite(nprice) || nprice < 0) {
      return res.status(400).json({ message: 'Preço inválido' });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Livro não encontrado' });

    const listing = await service.createListing({
      bookId,
      sellerId: req.userId,
      bookSnapshot: {
        title:  book.title  || '',
        author: book.author || '',
        image:  book.image  || '',
        isbn:   book.isbn   || '',
      },
      price: nprice,
      condition: condition || 'bom',
      stock: Number(stock || 1),
      shipping: shipping || 'combinado',
      // expiresAt default (7 dias)
    });

    return res.status(201).json({ message: 'Anúncio criado', listing });
  } catch (e) {
    console.error('CREATE LISTING ERROR:', e);
    return res.status(500).json({ message: 'Erro interno' });
  }
}

async function searchListings(req, res) {
  try {
    const { q, minPrice, maxPrice, page = 1, pageSize = 20, sort = 'recent' } = req.query;

    const now = new Date();
    const params = { status: 'ativo', expiresAt: { $gt: now } };

    const nmin = minPrice !== undefined && minPrice !== '' ? Number(String(minPrice).replace(',', '.')) : undefined;
    const nmax = maxPrice !== undefined && maxPrice !== '' ? Number(String(maxPrice).replace(',', '.')) : undefined;

    // só aplica se forem válidos; caso contrário, ignora (não retorna 400)
    if (Number.isFinite(nmin)) params.price = { ...(params.price || {}), $gte: nmin };
    if (Number.isFinite(nmax)) params.price = { ...(params.price || {}), $lte: nmax };

    let textQuery = {};
    if (q) textQuery = { $text: { $search: q } };

    const [items, total] = await service.findActive(
      { ...params, ...textQuery },
      { page: Number(page), pageSize: Number(pageSize), sort }
    );

    return res.json({ items, total, page: Number(page), pageSize: Number(pageSize) });
  } catch (e) {
    console.error('SEARCH LISTINGS ERROR:', e);
    return res.status(500).json({ message: 'Erro interno' });
  }
}

async function myListings(req, res) {
  try {
    const items = await service.findMine(req.userId);
    return res.json({ items });
  } catch (e) {
    console.error('MY LISTINGS ERROR:', e);
    return res.status(500).json({ message: 'Erro interno' });
  }
}

async function updateListing(req, res) {
  try {
    const { listingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: 'listingId inválido' });
    }

    const allowed = ['price', 'condition', 'stock', 'shipping'];
    const updates = {};
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

    const updated = await service.updateListing(listingId, req.userId, updates);
    if (!updated) return res.status(404).json({ message: 'Anúncio não encontrado' });

    return res.json({ message: 'Atualizado', listing: updated });
  } catch (e) {
    console.error('UPDATE LISTING ERROR:', e);
    return res.status(500).json({ message: 'Erro interno' });
  }
}

async function deleteListing(req, res) {
  try {
    const { listingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: 'listingId inválido' });
    }

    const deleted = await service.deleteListing(listingId, req.userId);
    if (!deleted) return res.status(404).json({ message: 'Anúncio não encontrado' });

    return res.json({ message: 'Removido' });
  } catch (e) {
    console.error('DELETE LISTING ERROR:', e);
    return res.status(500).json({ message: 'Erro interno' });
  }
}

async function markStatus(req, res) {
  try {
    const { listingId } = req.params;
    const { status } = req.body; // 'ativo' | 'pausado' | 'vendido' | 'expirado' | 'removido'

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: 'listingId inválido' });
    }
    if (!['ativo', 'pausado', 'vendido', 'expirado', 'removido'].includes(status)) {
      return res.status(400).json({ message: 'Status inválido' });
    }

    const updated = await Listing.findOneAndUpdate(
      { _id: listingId, sellerId: req.userId },
      { $set: { status } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Anúncio não encontrado' });

    return res.json({ message: 'Status atualizado', listing: updated });
  } catch (e) {
    console.error('MARK STATUS ERROR:', e);
    return res.status(500).json({ message: 'Erro interno' });
  }
}

export default {
  createListing,
  searchListings,
  myListings,
  updateListing,
  deleteListing,
  markStatus,
};
