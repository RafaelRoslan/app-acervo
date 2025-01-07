import express from "express";
import controller from "../controllers/rating.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/", authenticate, controller.createRating); // Criar avaliação
router.get("/user/:userId", authenticate, controller.getRatingsForUser); // Listar avaliações de um usuário
router.put("/:ratingId", authenticate, controller.updateRating); // Atualizar avaliação
router.delete("/:ratingId", authenticate, controller.deleteRating); // Deletar avaliação

export default router;
