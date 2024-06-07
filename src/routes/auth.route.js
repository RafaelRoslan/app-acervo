import express from "express";
import login from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/",login);

export default route;