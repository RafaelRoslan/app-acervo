//IMPORTS
import express from "express";
import controller from "../controllers/user.controller.js";


const route = express.Router();

route.post("/", controller.createUser);
route.get("/:id", controller.readUser);
route.put("/:id", controller.updateUser);
route.delete("/:id", controller.deleteUser);

export default route;