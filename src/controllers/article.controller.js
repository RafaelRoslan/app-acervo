import articleService from "../services/article.service.js";
import Article from "../models/article.js";

async function createArticle(req, res) {
  try {
    const article = await articleService.createArticle(req.body, req.userId);
    return res
      .status(201)
      .json({ message: 'Artigo criado com sucesso.', article });
  } catch (err) {
    console.error('createArticle error:', err);
    return res
      .status(500)
      .json({ message: 'Erro ao criar artigo.' });
  }
}

async function updateArticle(req, res) {
  try {
    const { id } = req.params;
    const article = await articleService.updateArticle(id, req.body);

    if (!article) {
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }

    return res.json({ message: 'Artigo atualizado com sucesso.', article });
  } catch (err) {
    console.error('updateArticle error:', err);
    return res
      .status(500)
      .json({ message: 'Erro ao atualizar artigo.' });
  }
}

async function deleteArticle(req, res) {
  try {
    const { id } = req.params;
    const article = await articleService.deleteArticle(id);

    if (!article) {
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }

    return res.json({ message: 'Artigo removido com sucesso.' });
  } catch (err) {
    console.error('deleteArticle error:', err);
    return res
      .status(500)
      .json({ message: 'Erro ao remover artigo.' });
  }
}

async function getArticles(req, res) {
  try {
    const articles = await articleService.getArticles(req.query);
    return res.json({ articles });
  } catch (err) {
    console.error('getArticles error:', err);
    return res
      .status(500)
      .json({ message: 'Erro ao listar artigos.' });
  }
}

async function getArticleById(req, res) {
  try {
    const { id } = req.params;
    const article = await articleService.getArticleById(id);

    if (!article) {
      return res.status(404).json({ message: 'Artigo não encontrado.' });
    }

    return res.json({ article });
  } catch (err) {
    console.error('getArticleById error:', err);
    return res
      .status(500)
      .json({ message: 'Erro ao buscar artigo.' });
  }
}

export default {
  createArticle,
  updateArticle,
  deleteArticle,
  getArticles,
  getArticleById,
};
