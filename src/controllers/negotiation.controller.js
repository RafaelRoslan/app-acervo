import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import service from "../services/negotiation.service.js";

function castObjectId(value) {
    if (!value) {
        return null;
    }

    if (value instanceof mongoose.Types.ObjectId) {
        return value;
    }

    try {
        return new mongoose.Types.ObjectId(String(value));
    } catch (error) {
        return null;
    }
}

async function createNegotiation(req, res) {
    try {
        const { groups } = req.body;

        if (!Array.isArray(groups) || groups.length === 0) {
            return res.status(400).send({ message: "É necessário informar grupos de itens para a negociação." });
        }

        const groupedBySeller = new Map();
        const listingIdsToFetch = new Map();

        for (const group of groups) {
            const sellerId = group?.seller?.id;
            const buyerId = group?.buyer?.id;
            const items = Array.isArray(group?.items) ? group.items : [];

            if (!sellerId || !buyerId) {
                return res.status(400).send({ message: "Informações de comprador e vendedor são obrigatórias." });
            }

            if (items.length === 0) {
                return res.status(400).send({ message: "Cada grupo deve possuir ao menos um item." });
            }

            const key = `${sellerId}-${buyerId}`;

            if (!groupedBySeller.has(key)) {
                groupedBySeller.set(key, {
                    sellerId,
                    buyerId,
                    items: [],
                    listingIds: new Map(),
                    itemsIndex: new Map(),
                    totalPrice: 0,
                    status: group?.status || "pending",
                    sellerInfo: group?.seller || {},
                    buyerInfo: group?.buyer || {},
                });
            }

            const aggregatedGroup = groupedBySeller.get(key);

            for (const item of items) {
                const rawListingId = item?.offerId ?? item?.id ?? item?.listingId;
                const listingObjectId = castObjectId(rawListingId);
                const quantity = Number(item?.quantidade) || 1;
                const unitPrice = Number(item?.preco) || 0;

                if (!listingObjectId) {
                    return res.status(400).send({ message: "Cada item deve possuir um identificador de oferta válido para registrar a negociação." });
                }

                const listingKey = listingObjectId.toString();
                listingIdsToFetch.set(listingKey, listingObjectId);

                if (aggregatedGroup.itemsIndex.has(listingKey)) {
                    const itemPosition = aggregatedGroup.itemsIndex.get(listingKey);
                    const accumulatedItem = aggregatedGroup.items[itemPosition];
                    const previousQuantity = Number(accumulatedItem?.quantidade) || 0;
                    const newQuantity = previousQuantity + quantity;

                    aggregatedGroup.items[itemPosition] = {
                        ...accumulatedItem,
                        quantidade: newQuantity,
                    };
                    aggregatedGroup.totalPrice += unitPrice * quantity;
                    continue;
                }

                aggregatedGroup.items.push({
                    ...item,
                    listingId: listingObjectId,
                });
                aggregatedGroup.itemsIndex.set(listingKey, aggregatedGroup.items.length - 1);
                aggregatedGroup.totalPrice += unitPrice * quantity;
                aggregatedGroup.listingIds.set(listingKey, listingObjectId);
            }
        }

        if (groupedBySeller.size === 0) {
            return res.status(400).send({ message: "Não foi possível montar negociações a partir dos dados enviados." });
        }

        if (listingIdsToFetch.size === 0) {
            return res.status(400).send({ message: "Não foi possível identificar as ofertas dos itens enviados." });
        }

        const listingDocuments = await Listing.find({
            _id: { $in: Array.from(listingIdsToFetch.values()) }
        }).select("_id bookId");

        const listingToBookMap = new Map();
        listingDocuments.forEach((doc) => {
            if (doc?.bookId) {
                listingToBookMap.set(doc._id.toString(), doc.bookId);
            }
        });

        for (const listingKey of listingIdsToFetch.keys()) {
            if (!listingToBookMap.has(listingKey)) {
                return res.status(400).send({ message: "Não foi possível localizar o livro associado a uma das ofertas informadas." });
            }
        }

        const aggregatedNegotiations = Array.from(groupedBySeller.values());

        for (const aggregatedGroup of aggregatedNegotiations) {
            const bookIds = new Map();

            aggregatedGroup.items = aggregatedGroup.items.map((item) => {
                const listingKey = item.listingId.toString();
                const bookId = listingToBookMap.get(listingKey);

                bookIds.set(bookId.toString(), bookId);

                return {
                    ...item,
                    bookId,
                };
            });

            aggregatedGroup.bookIds = bookIds;
        }

        const createdNegotiations = await service.createNegotiations(
            aggregatedNegotiations.map((aggregate) => ({
                sellerId: aggregate.sellerId,
                buyerId: aggregate.buyerId,
                listingsId: Array.from(aggregate.listingIds.values()),
                booksId: Array.from(aggregate.bookIds.values()),
                price: aggregate.totalPrice,
                status: aggregate.status,
            }))
        );

        const populatedNegotiations = await Promise.all(
            createdNegotiations.map((negotiation) =>
                service.populateNegotiation(negotiation, ["booksId", "listingsId", "buyerId", "sellerId"])
            )
        );

        const responseNegotiations = populatedNegotiations.map((negotiation, index) => {
            const aggregate = aggregatedNegotiations[index];
            const serializedNegotiation = typeof negotiation.toObject === "function" ? negotiation.toObject() : negotiation;

            return {
                ...serializedNegotiation,
                items: aggregate.items,
                seller: aggregate.sellerInfo,
                buyer: aggregate.buyerInfo,
            };
        });

        const message = responseNegotiations.length > 1
            ? "Negociações criadas com sucesso"
            : "Negociação criada com sucesso";

        res.status(200).send({ message, negotiations: responseNegotiations });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function readNegotiation(req, res) {
    try {
        const { negotiationId } = req.params;

        const negotiation = await service.getNegotiation(negotiationId);
        if (!negotiation) {
            return res.status(404).send({ message: "Negociação não encontrada." });
        }

        res.status(200).send({ negotiation });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function updateNegotiation(req, res) {
    try {
        const { negotiationId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).send({ message: "O status é obrigatório para atualizar a negociação." });
        }

        const negotiation = await service.updateNegotiation(negotiationId, status);
        if (!negotiation) {
            return res.status(404).send({ message: "Negociação não encontrada." });
        }

        res.status(200).send({ message: "Negociação atualizada com sucesso", negotiation });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function deleteNegotiation(req, res) {
    try {
        const { negotiationId } = req.params;

        const negotiation = await service.deleteNegotiation(negotiationId);
        if (!negotiation) {
            return res.status(404).send({ message: "Negociação não encontrada." });
        }

        res.status(200).send({ message: "Negociação deletada com sucesso" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function getNegotiationsByUser(req, res) {
    try {
        const { userId } = req.params;

        const negotiations = await service.getAllNegotiationsByUser(userId);

        res.status(200).send({ negotiations });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function markNegotiationPaid(req, res) {
    try {
        const { negotiationId } = req.params;
        const { method, comprovanteImage } = req.body;
        const allowedMethods = ["PIX", "TED", "BOLETO"];

        if (!allowedMethods.includes(method)) {
            return res.status(400).send({ message: "Método de pagamento inválido. Utilize PIX, TED ou BOLETO." });
        }

        if (typeof comprovanteImage !== "string" || comprovanteImage.trim() === "") {
            return res.status(400).send({ message: "A imagem do comprovante é obrigatória." });
        }

        const negotiation = await service.markNegotiationPaid(negotiationId, {
            method,
            comprovanteImage: comprovanteImage.trim(),
        });

        if (!negotiation) {
            return res.status(404).send({ message: "Negociação não encontrada." });
        }

        res.status(200).send({ message: "Pagamento registrado com sucesso.", negotiation });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function markNegotiationShipped(req, res) {
    try {
        const { negotiationId } = req.params;
        const { carrier, trackingCode, proofImage } = req.body;

        if (typeof trackingCode !== "string" || trackingCode.trim() === "") {
            return res.status(400).send({ message: "O código de rastreio é obrigatório." });
        }

        const negotiation = await service.markNegotiationShipped(negotiationId, {
            carrier: carrier?.trim() || null,
            trackingCode: trackingCode.trim(),
            proofImage: proofImage?.trim() || null,
        });

        if (!negotiation) {
            return res.status(404).send({ message: "Negociação não encontrada." });
        }

        res.status(200).send({ message: "Envio registrado com sucesso.", negotiation });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export default {
    createNegotiation,
    readNegotiation,
    updateNegotiation,
    deleteNegotiation,
    getNegotiationsByUser,
    markNegotiationPaid,
    markNegotiationShipped,
};
