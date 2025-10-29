//IMPORTS
import express from "express";
import controller from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import { validateId, validateUser } from "../middlewares/global.middleware.js";


const route = express.Router();

route.post("/", controller.createUser);
//route.get("/me", authenticate, controller.readCurrentUser);
route.get("/:id",authenticate, validateId, validateUser, controller.readUser);
//route.get("/:id",controller.readUser);
route.patch("/:id",authenticate, validateId, validateUser, controller.updateUser);
route.patch("/:id/delete",authenticate, validateId, validateUser, controller.deleteUser);

export default route;