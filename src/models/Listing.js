import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  bookId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Snapshot do livro (para o anúncio não "quebrar" se o livro mudar)
  bookSnapshot: {
    title:  { type: String, default: '' },
    author: { type: String, default: '' },
    image:  { type: String, default: '' }, // base64 ou URL
    isbn:   { type: String, default: '' },
  },

  price:     { type: Number, required: true, min: 0 },
  condition: { 
    type: String, 
    enum: ['novo', 'como_novo', 'bom', 'regular', 'danificado'], // ← adição
    default: 'bom' 
  },
  stock:     { type: Number, default: 1, min: 1 },

  // Mantemos shipping: comunica expectativa de entrega sem usar address do anúncio
  shipping:  { type: String, enum: ['retirada', 'correios', 'combinado'], default: 'combinado' },

  // Fluxo de vida do anúncio
  status: { 
    type: String, 
    enum: ['ativo', 'pausado', 'vendido', 'expirado', 'removido'], 
    default: 'ativo' 
  },

  // expiração lógica (7 dias)
  expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 7*24*60*60*1000) },
}, { timestamps: true });

// Índices para busca/paginação
ListingSchema.index({ status: 1, expiresAt: 1, createdAt: -1 });
ListingSchema.index({ price: 1 });
ListingSchema.index({ 'bookSnapshot.title': 'text', 'bookSnapshot.author': 'text', 'bookSnapshot.isbn': 'text' });

export default mongoose.model('Listing', ListingSchema);

