// services/article.service.js
import Article from '../models/article.js';

async function createArticle(payload, userId) {
  const article = await Article.create({
    ...payload,
    autorId: userId,
    // se não vier dataPublicacao no payload, usa default do schema
  });

  return article;
}

async function updateArticle(id, payload) {
  const article = await Article.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
    context: 'query',
  });

  return article;
}

async function deleteArticle(id) {
  const article = await Article.findByIdAndDelete(id);
  return article;
}

async function getArticles(filters = {}) {
  const { tipo, q } = filters;
  const query = {};

  if (tipo) {
    query.tipo = tipo;
  }

  if (q) {
    query.$or = [
      { titulo: new RegExp(q, 'i') },
      { resumo: new RegExp(q, 'i') },
    ];
  }

  return Article.find(query).sort({ dataPublicacao: -1, createdAt: -1 });
}

async function getArticleById(id) {
  return Article.findById(id);
}

export default {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticles,
  getArticleById,
};
