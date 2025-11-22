// routes/article.routes.js
//IMPORTS
import express from "express";
import controller from "../controllers/article.controller.js";
import requireAdmin from "../middlewares/admin.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();


// Rotas públicas
router.get('/', controller.getArticles);
router.get('/:id', controller.getArticleById);

// Rotas restritas a admin
router.post('/', authenticate, requireAdmin, controller.createArticle);
router.put('/:id', authenticate, requireAdmin, controller.updateArticle);
router.delete('/:id', authenticate, requireAdmin, controller.deleteArticle);

export default router;
