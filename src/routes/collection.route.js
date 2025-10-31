//IMPORTSvalidateId
import express from "express";
import controller from "../controllers/collection.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import { validateCollectionId, validateId, validateUser } from "../middlewares/global.middleware.js";

const route = express.Router();

route.post("/",authenticate, controller.createCollection);
route.get("/", authenticate, controller.readCollections);
route.get("/:collectionId", authenticate, validateId, validateUser, validateCollectionId, controller.readCollectionId);
route.patch("/:collectionId", authenticate, validateId, validateUser, validateCollectionId, controller.updateCollection);
route.delete("/:collectionId", authenticate, validateId, validateUser, validateCollectionId, controller.deleteCollection);

export default route;
