import express from "express";
import controller from "../controllers/negotiation.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, controller.createNegotiation); // Criar negociação
router.get("/user/:userId", authenticate, controller.getNegotiationsByUser); // Listar negociações por usuário
router.post("/:negotiationId/comments", authenticate, controller.addNegotiationComment); // Adicionar comentário
router.post("/:negotiationId/reports", authenticate, controller.createNegotiationReport); // Criar denúncia
router.get("/:negotiationId/reports", authenticate, controller.listNegotiationReports); // Listar denúncias
router.get("/:negotiationId", authenticate, controller.readNegotiation); // Ler negociação específica
router.put("/:negotiationId", authenticate, controller.updateNegotiation); // Atualizar status da negociação
router.patch("/:negotiationId/mark-paid", authenticate, controller.markNegotiationPaid); // Registrar pagamento
router.patch("/:negotiationId/mark-shipped", authenticate, controller.markNegotiationShipped); // Registrar envio
router.patch("/:negotiationId/mark-received", authenticate, controller.markNegotiationReceived); // Marcar como recebida
router.delete("/:negotiationId", authenticate, controller.deleteNegotiation); // Deletar negociação

export default router;
