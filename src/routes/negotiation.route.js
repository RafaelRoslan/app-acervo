import express from "express";
import controller from "../controllers/negotiation.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, controller.createNegotiation); // Criar negociação
router.get("/:negotiationId", authenticate, controller.readNegotiation); // Ler negociação específica
router.put("/:negotiationId", authenticate, controller.updateNegotiation); // Atualizar status da negociação
router.delete("/:negotiationId", authenticate, controller.deleteNegotiation); // Deletar negociação
router.get("/user/:userId", authenticate, controller.getNegotiationsByUser); // Listar negociações por usuário

export default router;
